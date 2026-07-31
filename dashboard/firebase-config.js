/* ============================================================
   ตั้งค่า Firebase — จุดเดียวที่ต้องแก้ในทุกไฟล์ของระบบ
   (ต้องใช้ config ชุดเดียวกับ overlay.html และ index.html หน้าโดเนท)
   ============================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyC_FnxOT-9-hRVX9bnyzL8-ztzrow-NxJQ",
  authDomain: "nwdonate2.firebaseapp.com",
  databaseURL: "https://nwdonate2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nwdonate2",
  storageBucket: "nwdonate2.firebasestorage.app",
  messagingSenderId: "767503307361",
  appId: "1:767503307361:web:87374ecd1aacdbb18f9020"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ยูทิลิตี้เล็กๆ ที่ไฟล์อื่นเรียกใช้ร่วมกัน */
function startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); }
function startOfMonth(d) { const x = new Date(d); x.setDate(1); x.setHours(0, 0, 0, 0); return x.getTime(); }
function baht(n) { return (n || 0).toLocaleString() + ' ฿'; }
