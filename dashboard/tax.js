/* สรุปยอดรายเดือน — จัดกลุ่มตามเดือน/ปี เผื่อดูภาพรวมยื่นภาษี (ไม่ใช่แบบฟอร์มภาษีจริง) */
function renderTax(allDonations) {
  const byMonth = {};
  allDonations.forEach(d => {
    const dt = new Date(d.ts);
    const key = dt.toLocaleDateString('th-TH', { year: 'numeric', month: 'long' });
    if (!byMonth[key]) byMonth[key] = { count: 0, total: 0, ts: dt.getTime() };
    byMonth[key].count += 1;
    byMonth[key].total += (d.diamondValue || 0);
  });
  const rows = Object.entries(byMonth).sort((a, b) => b[1].ts - a[1].ts);
  const tbody = document.getElementById('taxBody');
  tbody.innerHTML = rows.length ? rows.map(([month, v]) => `
    <tr><td>${month}</td><td>${v.count} ครั้ง</td>
    <td class="diamonds" style="text-align:right">${baht(v.total)}</td></tr>
  `).join('') : '<tr><td class="empty" colspan="3">ยังไม่มีข้อมูล</td></tr>';
}
