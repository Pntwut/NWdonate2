/**
 * Firebase Cloud Function: verifySlip
 * -------------------------------------------------
 * รับข้อมูลจากหน้า donate.html (ชื่อ, ข้อความ, จำนวนเงิน, รูปสลิป)
 * ส่งรูปสลิปไปตรวจกับ SlipOK API ฝั่งเซิร์ฟเวอร์ (ปลอดภัย ไม่ต้องเผย API key ให้ browser)
 * ถ้ายอดเงินในสลิปตรงกับที่กรอก -> บันทึกลง Realtime Database ที่ overlay.html ฟังอยู่
 *
 * วิธี deploy:
 *   1. cd functions && npm install
 *   2. ตั้งค่า SlipOK: firebase functions:config:set slipok.branch_id="YOUR_BRANCH_ID" slipok.api_key="YOUR_API_KEY"
 *      (หรือถ้าใช้ Functions v2 ให้ตั้งเป็น environment variable ใน .env แทน ดูคอมเมนต์ด้านล่าง)
 *   3. firebase deploy --only functions
 */

const { onRequest } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const logger = require('firebase-functions/logger');

initializeApp();
const db = getDatabase();

// ===== ตั้งค่า SlipOK ตรงนี้ (หรือย้ายไปใช้ .env / functions.config() ก็ได้) =====
const SLIPOK_BRANCH_ID = process.env.SLIPOK_BRANCH_ID || 'YOUR_BRANCH_ID';
const SLIPOK_API_KEY = process.env.SLIPOK_API_KEY || 'YOUR_API_KEY';
const AMOUNT_TOLERANCE = 0.5; // บาท กันปัดเศษ

exports.verifySlip = onRequest(
  { cors: true, region: 'asia-southeast1' },
  async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { name, message, amount, slipImage } = req.body || {};
    if (!name || !message || !amount || !slipImage) {
      return res.status(400).json({ success: false, message: 'ข้อมูลไม่ครบ' });
    }

    try {
      // slipImage เป็น data URL (data:image/png;base64,...) แปลงเป็น base64 ล้วน
      const base64Data = slipImage.split(',')[1] || slipImage;

      const slipokRes = await fetch(
        `https://api.slipok.com/api/line/apikey/${SLIPOK_BRANCH_ID}`,
        {
          method: 'POST',
          headers: {
            'x-authorization': SLIPOK_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64Data }),
        }
      );
      const slipData = await slipokRes.json();

      if (!slipokRes.ok || !slipData.success) {
        logger.warn('Slip verification failed', slipData);
        return res.json({
          success: false,
          message: slipData.message || 'ตรวจสอบสลิปไม่ผ่าน (อาจเป็นสลิปปลอมหรือใช้ซ้ำ)',
        });
      }

      const paidAmount = Number(slipData.data?.amount || 0);
      const expectedAmount = Number(amount);

      if (Math.abs(paidAmount - expectedAmount) > AMOUNT_TOLERANCE) {
        return res.json({
          success: false,
          message: `ยอดเงินไม่ตรงกัน (สลิป ${paidAmount} บาท แต่กรอกไว้ ${expectedAmount} บาท)`,
        });
      }

      // กันสลิปซ้ำ: ใช้ transactionRef ของ SlipOK เป็น key กันบันทึกซ้ำ
      const txRef = slipData.data?.transRef || slipData.data?.ref || `${Date.now()}`;
      const dupCheck = await db.ref('usedSlips/' + txRef).get();
      if (dupCheck.exists()) {
        return res.json({ success: false, message: 'สลิปนี้ถูกใช้ไปแล้ว' });
      }
      await db.ref('usedSlips/' + txRef).set(true);

      // บันทึกโดเนทลง path เดียวกับที่ overlay.html ฟังอยู่
      const entry = {
        uniqueId: 'promptpay_' + txRef,
        nickname: name,
        giftName: message,     // ใช้ field เดิม แต่เก็บข้อความให้กำลังใจแทนชื่อของขวัญ
        repeatCount: 1,
        diamondValue: expectedAmount,
        source: 'promptpay',
        ts: Date.now(),
      };
      await db.ref('donations').push(entry);
      await db.ref('stats/totalDiamonds').transaction(v => (v || 0) + expectedAmount);
      const safeKey = entry.nickname.replace(/[.#$\[\]]/g, '_');
      await db.ref('stats/byDonor/' + safeKey + '/diamonds').transaction(v => (v || 0) + expectedAmount);
      await db.ref('stats/byDonor/' + safeKey + '/nickname').set(entry.nickname);

      logger.info('Donation verified & logged', entry);
      return res.json({ success: true });
    } catch (err) {
      logger.error('verifySlip error', err);
      return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์' });
    }
  }
);
