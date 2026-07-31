/* ภาพรวม: ยอดรวม, ยอดวันนี้, ยอดเดือนนี้, จำนวนรายการวันนี้ */
function renderOverview(allDonations) {
  const todayStart = startOfDay(Date.now());
  const monthStart = startOfMonth(Date.now());

  const total = allDonations.reduce((s, d) => s + (d.diamondValue || 0), 0);
  const today = allDonations.filter(d => d.ts >= todayStart);
  const month = allDonations.filter(d => d.ts >= monthStart);

  document.getElementById('totalAll').textContent = baht(total);
  document.getElementById('totalToday').textContent = baht(today.reduce((s, d) => s + (d.diamondValue || 0), 0));
  document.getElementById('totalMonth').textContent = baht(month.reduce((s, d) => s + (d.diamondValue || 0), 0));
  document.getElementById('countToday').textContent = today.length + ' ครั้ง';

  return total; // ส่งยอดรวมกลับไปให้ goal.js ใช้ต่อ
}
