/* ประวัติล่าสุด — 50 รายการล่าสุด */
function renderHistory(allDonations) {
  const rows = allDonations.slice(0, 50);
  const tbody = document.getElementById('historyBody');
  tbody.innerHTML = rows.length ? rows.map(r => `
    <tr>
      <td>${new Date(r.ts).toLocaleString('th-TH')}</td>
      <td>${r.nickname}</td>
      <td>${r.giftName}${r.repeatCount > 1 ? ' x' + r.repeatCount : ''}</td>
      <td class="diamonds" style="text-align:right">${baht(r.diamondValue)}</td>
    </tr>`).join('') : '<tr><td class="empty" colspan="4">ยังไม่มีข้อมูล</td></tr>';
}
