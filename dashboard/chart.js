/* กราฟยอดโดเนทย้อนหลัง — SVG bar chart วาดเอง ไม่ต้องพึ่ง library ภายนอก */
let currentChartDays = 7;

function initChart() {
  document.querySelectorAll('.chart-tabs button').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.chart-tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentChartDays = parseInt(btn.dataset.days);
      renderChart(window.lastDonations || [], currentChartDays);
    };
  });
}

function renderChart(allDonations, days) {
  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = startOfDay(Date.now() - i * 86400000);
    buckets.push({ day, total: 0 });
  }
  allDonations.forEach(d => {
    const day = startOfDay(d.ts);
    const b = buckets.find(x => x.day === day);
    if (b) b.total += (d.diamondValue || 0);
  });

  const svg = document.getElementById('chartSvg');
  const w = Math.max(600, days * 44);
  const h = 220, padBottom = 30, padTop = 10;
  const max = Math.max(1, ...buckets.map(b => b.total));
  const barW = (w / buckets.length) * 0.55;

  let bars = '';
  buckets.forEach((b, i) => {
    const x = (w / buckets.length) * i + (w / buckets.length - barW) / 2;
    const barH = ((h - padBottom - padTop) * b.total) / max;
    const y = h - padBottom - barH;
    const label = new Date(b.day).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    bars += `
      <rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="url(#barGrad)"></rect>
      <text x="${x + barW / 2}" y="${h - 10}" text-anchor="middle" font-size="11" fill="#9d93b8" font-family="JetBrains Mono, monospace">${label}</text>
      ${b.total > 0 ? `<text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" font-size="11" fill="#f3b93a" font-family="JetBrains Mono, monospace">${b.total}</text>` : ''}
    `;
  });

  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('width', w);
  svg.innerHTML = `
    <defs>
      <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#ff3d77"/>
        <stop offset="100%" stop-color="#f3b93a"/>
      </linearGradient>
    </defs>
    <line x1="0" y1="${h - padBottom}" x2="${w}" y2="${h - padBottom}" stroke="#2c1f42"/>
    ${bars}
  `;
}
