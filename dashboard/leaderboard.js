/* อันดับผู้สนับสนุน — รวมยอดตามชื่อ เรียงจากมากไปน้อย */
function renderLeaderboard(allDonations) {
  const byDonor = {};
  allDonations.forEach(d => {
    const key = d.nickname || 'ไม่ระบุชื่อ';
    byDonor[key] = (byDonor[key] || 0) + (d.diamondValue || 0);
  });
  const rows = Object.entries(byDonor).sort((a, b) => b[1] - a[1]).slice(0, 20);
  const tbody = document.getElementById('leaderboardBody');
  tbody.innerHTML = rows.length ? rows.map(([name, amt], i) => `
    <tr><td class="rank">#${i + 1}</td><td>${name}</td>
    <td class="diamonds" style="text-align:right">${baht(amt)}</td></tr>
  `).join('') : '<tr><td class="empty" colspan="3">ยังไม่มีข้อมูล</td></tr>';
}
