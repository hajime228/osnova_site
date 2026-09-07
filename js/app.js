
  const LEAD_ENDPOINT = 'https://osnova-telegram.site-sd.workers.dev';
  const TEACHER_PHONE = '+79874230130';
  const input = document.getElementById('phoneInput');
  const form = document.getElementById('leadForm');
  const statusEl = document.getElementById('status');
  const modal = document.getElementById('setupModal');
  const closeModal = document.getElementById('closeModal');
  const taskVideo = document.getElementById('taskVideo');
  const taskSkip = document.getElementById('taskSkip');

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
  const taskSources = {
    given: {
      video: 'assets/task-given.mp4',
      poster: 'assets/task-given.png',
      label: 'Анимация условия задачи'
    },
    solution: {
      video: 'assets/task-solution.mp4',
      poster: 'assets/task-solution.png',
      label: 'Анимация решения задачи'
    }
  };
  let activeTaskSlide = 'given';

  function restartTaskVideo(){
    if (!taskVideo) return;
    const source = taskSources[activeTaskSlide];
    taskVideo.pause();
    if (taskVideo.getAttribute('src') !== source.video) {
      taskVideo.setAttribute('src', source.video);
      taskVideo.load();
    }
    if (source.poster) taskVideo.setAttribute('poster', source.poster);
    taskVideo.setAttribute('aria-label', source.label);
    taskVideo.currentTime = 0;
    const playWhenReady = () => {
      const playback = taskVideo.play();
      if (playback && typeof playback.catch === 'function') playback.catch(() => {});
    };
    if (taskVideo.readyState >= 1) {
      playWhenReady();
    } else {
      taskVideo.addEventListener('loadedmetadata', playWhenReady, { once: true });
    }
  }

  function skipTaskVideoToEnd(){
    if (!taskVideo) return;
    const finish = () => {
      const duration = Number(taskVideo.duration) || 0;
      if (!duration) return;
      taskVideo.currentTime = Math.max(0, duration - 0.05);
      taskVideo.pause();
    };
    if (taskVideo.readyState >= 1) finish();
    else taskVideo.addEventListener('loadedmetadata', finish, { once: true });
  }

  function renderTaskMedia(restartVideo = true){
    if (!taskVideo) return;
    if (restartVideo) restartTaskVideo();
  }

  document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeTaskSlide = btn.dataset.slide === 'solution' ? 'solution' : 'given';
    renderTaskMedia(true);
  }));

  if (taskVideo) {
    renderTaskMedia(true);
    if (taskSkip) taskSkip.addEventListener('click', skipTaskVideoToEnd);
  }
