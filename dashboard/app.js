/* app.js — จุดเริ่มต้นของ dashboard
   หน้าที่เดียวคือ: ฟังข้อมูลจาก Firebase แล้วสั่งให้ไฟล์ฟีเจอร์แต่ละไฟล์ render ตัวเอง
   ถ้าจะเพิ่มฟีเจอร์ใหม่ในอนาคต: สร้างไฟล์ .js ใหม่ + เพิ่ม <script> ใน index.html + เรียกใช้ตรงนี้ */

initGoal();
initChart();

db.ref('donations').on('value', snap => {
  const data = snap.val() || {};
  const allDonations = Object.values(data).sort((a, b) => b.ts - a.ts);

  // เก็บไว้ใน window เผื่อโมดูลอื่น (เช่นตอนสลับแท็บกราฟ) เอาไปใช้ซ้ำโดยไม่ต้องรอ Firebase ใหม่
  window.lastDonations = allDonations;

  const total = renderOverview(allDonations);
  window.lastTotal = total;
  updateGoalProgress(total);

  renderChart(allDonations, currentChartDays);
  renderLeaderboard(allDonations);
  renderHistory(allDonations);
  renderTax(allDonations);
});
