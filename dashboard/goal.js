/* เป้าหมายโดเนท: ตั้งเป้า + progress bar (เก็บเป้าหมายไว้บน Firebase เผื่อดูจากเครื่องอื่น) */
let currentGoal = 0;

function initGoal() {
  db.ref('config/goal').on('value', snap => {
    currentGoal = snap.val() || 0;
    document.getElementById('goalInput').value = currentGoal || '';
    updateGoalProgress(window.lastTotal || 0);
  });

  document.getElementById('saveGoalBtn').onclick = () => {
    const v = parseFloat(document.getElementById('goalInput').value) || 0;
    db.ref('config/goal').set(v);
  };
}

function updateGoalProgress(total) {
  const fill = document.getElementById('goalFill');
  const caption = document.getElementById('goalCaption');
  if (!currentGoal) {
    fill.style.width = '0%';
    fill.textContent = '';
    caption.textContent = 'ยังไม่ได้ตั้งเป้าหมาย';
    return;
  }
  const pct = Math.min(100, Math.round((total / currentGoal) * 100));
  fill.style.width = pct + '%';
  fill.textContent = pct >= 10 ? pct + '%' : '';
  caption.textContent = `${baht(total)} จากเป้าหมาย ${baht(currentGoal)} (${pct}%)`;
}
