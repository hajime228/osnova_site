
(function(){
  const FALLBACK_ARTICLES = [
    {
      status:'Опубликовано', date:'2026-07-13', category:'Обучение',
      title:'Понимание важнее запоминания: что происходит, когда ученик видит логику задачи',
      slug:'ponimanie-vazhnee-zapominaniya',
      excerpt:'О том, почему правильный ответ ещё не означает понимания и как пошаговый разбор помогает ученику действовать самостоятельно.',
      content:'<p>Ученик может запомнить последовательность действий и всё равно растеряться, если условие задачи немного изменится. Это происходит не из-за недостатка старания. Просто в памяти осталась схема, а связь между шагами не стала понятной.</p><h2>Что значит понять задачу</h2><p>Понимание начинается там, где ученик может объяснить, что именно дано, какой результат нужно получить и зачем выполняется каждый шаг построения.</p><blockquote>Цель занятия — не провести ученика по одной знакомой дороге, а помочь ему увидеть карту.</blockquote><p>Поэтому полезно не торопиться с готовым решением. Сначала стоит выделить исходные данные, определить связи между ними, предположить возможный ход решения и только затем переходить к построению.</p><h2>Как это меняет обучение</h2><p>Когда логика становится видимой, уменьшается количество случайных ошибок. Ученик быстрее замечает, где нарушена последовательность, и может проверить себя без постоянной подсказки преподавателя.</p>',
      image:'', readTime:'5 минут'
    },
    {
      status:'Опубликовано', date:'2026-07-10', category:'Развитие',
      title:'Можно ли развить пространственное мышление',
      slug:'prostranstvennoe-myshlenie',
      excerpt:'Пространственное мышление — не фиксированный талант. Оно развивается через наблюдение, построение, сравнение проекций и работу с реальными объектами.',
      content:'<p>Способность мысленно представить объект с разных сторон часто воспринимают как врождённый дар. На практике эта способность может развиваться, если человек регулярно выполняет подходящие действия.</p><h2>С чего начинается развитие</h2><p>Полезно сопоставлять предмет и его изображения, мысленно вращать простые формы, замечать, какие элементы видны на разных проекциях, а какие скрыты.</p><p>Черчение удобно тем, что сразу показывает точность представления: если образ объекта неточен, это проявляется в построении и становится материалом для следующего шага.</p><h2>Важно не сравнивать скорость</h2><p>Одному ученику образ складывается быстро, другому требуется больше внешних опор. Это не означает, что направление ему не подходит. Важно посмотреть, возникает ли интерес к поиску решения и растёт ли точность после практики.</p>',
      image:'', readTime:'4 минуты'
    },
    {
      status:'Опубликовано', date:'2026-07-06', category:'Педагогика',
      title:'Преподаватель не только объясняет: он помогает ученику выстроить способ действия',
      slug:'rol-prepodavatelya',
      excerpt:'Хорошее объяснение решает текущую задачу. Хорошее обучение постепенно даёт ученику инструменты, с которыми он сможет работать дальше.',
      content:'<p>Иногда результат занятия измеряют количеством разобранных заданий. Но важнее другое: что ученик сможет сделать после занятия без преподавателя.</p><h2>От подсказки к самостоятельности</h2><p>Сначала преподаватель может задавать вопросы, выделять существенные данные и показывать способ проверки. Затем часть этих действий передаётся ученику.</p><p>Так формируется не зависимость от объяснений, а собственный алгоритм: остановиться, понять условие, выбрать инструмент, выполнить построение и проверить результат.</p><h2>Ошибка как источник информации</h2><p>Ошибка показывает, на каком этапе нарушилась логика. Если просто заменить неверный ответ правильным, эта информация теряется. Если разобрать причину, ошибка становится частью обучения.</p>',
      image:'', readTime:'5 минут'
    }
  ];

  function esc(value){ return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch])); }
  function dateRu(value){
    if(!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'});
  }
  function card(a){
    const cover = a.image ? `<img src="${esc(a.image)}" alt="">` : '';
    return `<article class="article-card"><a class="article-cover" href="article.html?slug=${encodeURIComponent(a.slug)}">${cover}</a><div class="article-body"><span class="article-category">${esc(a.category || 'Статья')}</span><h3><a href="article.html?slug=${encodeURIComponent(a.slug)}">${esc(a.title)}</a></h3><p>${esc(a.excerpt || '')}</p><div class="article-meta"><span>${esc(dateRu(a.date))}</span><span>${esc(a.readTime || '')}</span></div><a class="article-link" href="article.html?slug=${encodeURIComponent(a.slug)}">Читать →</a></div></article>`;
  }
  function loadArticles(){
    return new Promise(resolve => {
      const api=(window.OSNOVA_ARTICLES_API||'').trim();
      if(!api){ resolve(FALLBACK_ARTICLES); return; }
      const cb='osnovaArticlesCallback_'+Date.now();
      const script=document.createElement('script');
      const timer=setTimeout(()=>{ cleanup(); resolve(FALLBACK_ARTICLES); },8000);
      function cleanup(){ clearTimeout(timer); delete window[cb]; script.remove(); }
      window[cb]=payload=>{ cleanup(); const rows=Array.isArray(payload)?payload:(payload && payload.articles)||[]; resolve(rows.length?rows:FALLBACK_ARTICLES); };
      script.onerror=()=>{ cleanup(); resolve(FALLBACK_ARTICLES); };
      script.src=api+(api.includes('?')?'&':'?')+'callback='+encodeURIComponent(cb);
      document.head.appendChild(script);
    });
  }
  async function initHome(){
    const box=document.getElementById('homeArticles'); if(!box) return;
    const all=(await loadArticles()).filter(a=>String(a.status||'Опубликовано').toLowerCase()!=='черновик');
    box.innerHTML=all.slice(0,3).map(card).join('') || '<div class="empty-state">Статьи скоро появятся.</div>';
  }
  async function initList(){
    const box=document.getElementById('articlesList'); if(!box) return;
    const all=(await loadArticles()).filter(a=>String(a.status||'Опубликовано').toLowerCase()!=='черновик');
    box.innerHTML=all.map(card).join('') || '<div class="empty-state">Статьи скоро появятся.</div>';
  }
  async function initArticle(){
    const root=document.getElementById('articleRoot'); if(!root) return;
    const slug=new URLSearchParams(location.search).get('slug');
    const all=await loadArticles(); const a=all.find(x=>x.slug===slug) || all[0];
    if(!a){ root.innerHTML='<div class="empty-state">Статья не найдена.</div>'; return; }
    document.title=a.title+' — ЦОР ОСНОВА';
    root.innerHTML=`<nav class="article-nav-inline" aria-label="Навигация по статьям"><a href="index.html">← На сайт</a><span aria-hidden="true">·</span><a href="articles.html">Все статьи →</a></nav><header class="article-header"><span class="article-category">${esc(a.category||'Статья')}</span><h1>${esc(a.title)}</h1><div class="article-meta"><span>Фарида Мухамадиева</span><span>${esc(dateRu(a.date))}</span><span>${esc(a.readTime||'')}</span></div></header>${a.image?`<div class="article-hero-image"><img src="${esc(a.image)}" alt=""></div>`:''}<div class="article-content">${a.content||''}</div><div class="article-cta"><h2>Нужно разобрать учебную задачу?</h2><p>Можно обсудить цель и подобрать подходящий формат занятий.</p><a href="index.html#top">Получить консультацию</a></div>`;
  }
  window.OsnovaArticles={loadArticles,FALLBACK_ARTICLES};
  document.addEventListener('DOMContentLoaded',()=>{initHome();initList();initArticle();});
})();
