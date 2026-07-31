/* ============================================================
   ตั้งค่า Firebase — จุดเดียวที่ต้องแก้ในทุกไฟล์ของระบบ
   (ต้องใช้ config ชุดเดียวกับ overlay.html และ index.html หน้าโดเนท)
   ============================================================ */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "YOUR_PROJECT",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ยูทิลิตี้เล็กๆ ที่ไฟล์อื่นเรียกใช้ร่วมกัน */
function startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); }
function startOfMonth(d) { const x = new Date(d); x.setDate(1); x.setHours(0, 0, 0, 0); return x.getTime(); }
function baht(n) { return (n || 0).toLocaleString() + ' ฿'; }
