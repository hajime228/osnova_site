
  const LEAD_ENDPOINT =   "https://osnova-telegram.site-sd.workers.dev";
  const TEACHER_PHONE = '+79874230130';
  const input = document.getElementById('phoneInput');
  const form = document.getElementById('leadForm');
  const statusEl = document.getElementById('status');
  const modal = document.getElementById('setupModal');
  const closeModal = document.getElementById('closeModal');
  const taskImg = document.getElementById('taskImg');

  function digitsOnly(v){ return String(v || '').replace(/\D/g,''); }
  function formatNational(national){
    const d = String(national || '').replace(/\D/g,'').slice(0,10);
    let out = '+7';
    if (d.length > 0) out += ' (' + d.slice(0,3);
    if (d.length >= 3) out += ')';
    if (d.length > 3) out += ' ' + d.slice(3,6);
    if (d.length > 6) out += '-' + d.slice(6,8);
    if (d.length > 8) out += '-' + d.slice(8,10);
    return out;
  }
  function getNational(raw){
    let d = digitsOnly(raw);
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (d.startsWith('7')) d = d.slice(1);
    return d.slice(0,10);
  }
  function setCaretEnd(){ requestAnimationFrame(()=>input.setSelectionRange(input.value.length, input.value.length)); }
  input.addEventListener('input', () => { input.value = formatNational(getNational(input.value)); setCaretEnd(); });
  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Backspace' && e.key !== 'Delete') return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    if (start !== end) return;
    e.preventDefault();
    const national = getNational(input.value);
    if (!national.length) { input.value = '+7'; setCaretEnd(); return; }
    input.value = formatNational(national.slice(0, -1));
    setCaretEnd();
  });
  input.addEventListener('focus', () => { if(!input.value || input.value === '+') input.value = '+7'; setCaretEnd(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = input.value.trim();
    const digits = digitsOnly(phone);
    if (digits.length !== 11) { statusEl.textContent = 'Введите номер полностью.'; return; }
    statusEl.textContent = 'Отправляем заявку...';
    if (!LEAD_ENDPOINT) { statusEl.textContent = ''; modal.classList.add('open'); return; }
    try {
      const res = await fetch(LEAD_ENDPOINT, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ phone, source: location.href, page:'ЦОР ОСНОВА' }) });
      if (!res.ok) throw new Error('send failed');
      statusEl.style.color = '#15803d'; statusEl.textContent = 'Заявка отправлена. Преподаватель свяжется с вами.'; input.value = '+7';
    } catch(err) { statusEl.style.color = '#b80e09'; statusEl.textContent = 'Не удалось отправить. Попробуйте позвонить, написать в MAX или на почту.'; }
  });
  closeModal.addEventListener('click',()=>modal.classList.remove('open'));
  modal.addEventListener('click',(e)=>{ if(e.target===modal) modal.classList.remove('open') });
  document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); taskImg.src = btn.dataset.slide === 'solution' ? 'assets/task-solution.png' : 'assets/task-given.png'; }));
  document.getElementById('maxLink').addEventListener('click', (e)=>{ setTimeout(()=>{ window.location.href='https://web.max.ru/'; }, 700); });
