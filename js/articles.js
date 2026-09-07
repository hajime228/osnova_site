(function(){
  const FALLBACK_ARTICLES = [
    {
      slug: 'cherchenie-i-inzhenernaya-grafika',
      title: 'Черчение и инженерная графика: первый шаг к инженерному мышлению',
      category: 'Профориентация',
      excerpt: 'Как через черчение познакомиться с инженерным языком, проверить интерес к техническому направлению и развивать пространственное мышление.',
      date: '2026-09-07',
      readTime: '4 мин',
      status: 'Опубликовано',
      image: 'assets/articles/engineering-drawing.png',
      content: `
        <p><strong>Черчение</strong> — это способ точно показать предмет на плоском листе: его форму, размеры, вид сверху, сбоку, спереди и в разрезе.</p>
        <p><strong>Инженерная графика</strong> — это язык, на котором инженеры, конструкторы, архитекторы и технические специалисты передают друг другу информацию об объектах и конструкциях.</p>
        <p>У этого языка есть свои правила, обозначения и логика. И хорошая новость в том, что его можно изучить.</p>

        <h2>Кому это может быть интересно</h2>
        <p>В первую очередь — подросткам и студентам, которые ещё не определились с будущим направлением или только присматриваются к инженерным и техническим профессиям.</p>
        <p>Иногда сложно понять, подходит ли тебе инженерия, просто читая описание специальности.</p>
        <p><strong>Гораздо интереснее попробовать её язык на практике.</strong></p>
        <p>Представьте обычную кружку.</p>
        <p>Теперь мысленно посмотрите на неё сверху. Сбоку. Представьте, как она выглядела бы в разрезе.</p>
        <p>Так работает <strong>пространственное мышление</strong> — способность представлять предметы в объёме, мысленно поворачивать их и понимать, как связаны их части.</p>
        <p>У кого-то это получается легко с самого начала. Кому-то требуется больше времени.</p>
        <p>Но пространственное мышление можно развивать, а черчение — один из самых наглядных способов его тренировать.</p>

        <h2>Что можно понять, попробовав черчение</h2>
        <p>Нравится ли вам разбираться, как устроены предметы?</p>
        <p>Интересно ли представлять их в пространстве?</p>
        <p>Доставляет ли удовольствие момент, когда непонятные линии вдруг складываются в объёмную деталь?</p>
        <p>Хочется ли находить точное решение?</p>
        <p>Такие ощущения могут рассказать о ваших интересах гораздо больше, чем очередной тест на выбор профессии.</p>
        <p>При этом сам инженерный язык довольно логичен и практичен: чем больше понимаешь его правила, тем легче начинаешь «читать» чертёж и видеть за линиями настоящий объект.</p>

        <h2>Не гадать — попробовать</h2>
        <p>Не нужно заранее решать, хотите ли вы стать инженером.</p>
        <p>Можно начать с малого: несколько недель или один-два месяца позаниматься черчением и инженерной графикой, разобрать базовые построения и попробовать решать задачи самостоятельно.</p>
        <p>Этого уже может быть достаточно, чтобы почувствовать:</p>
        <blockquote>«Мне это интересно. Я хочу понимать этот язык дальше»</blockquote>
        <p>или</p>
        <blockquote>«Я попробовал — и хочу поискать другое направление».</blockquote>
        <p>И в этом ценность знакомства с предметом: будущую профессию не приходится выбирать вслепую.</p>
        <p>На занятиях мы начинаем с понятных вещей и постепенно учимся видеть за линиями форму, пространство и логику чертежа.</p>
        <p><strong>Инженерный язык не обязательно выбирать профессией. Но его стоит хотя бы один раз попробовать прочитать.</strong></p>
      `
    }
  ];

  function esc(value){ return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch])); }
  function dateRu(value){
    if(!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'});
  }
  function parseJson(value, fallback=[]){
    if(Array.isArray(value)) return value;
    if(!value) return fallback;
    try { const v=JSON.parse(value); return Array.isArray(v)?v:fallback; } catch(e){ return fallback; }
  }
  function safeUrl(value){
    const url=String(value||'').trim();
    if(!url) return '';
    return /^(https?:\/\/|assets\/|\.\/|\/)/i.test(url) ? url : '';
  }
  function filterRemoteArticles(rows){
    return (Array.isArray(rows) ? rows : []).filter(article =>
      String(article && article.title || '').trim() !== 'Название новой статьи'
    );
  }
  function mergeArticles(local, remote){
    const merged=new Map();
    [...local,...filterRemoteArticles(remote)].forEach(article=>{
      if(article && article.slug) merged.set(article.slug, article);
    });
    return [...merged.values()];
  }
  function card(a){
    const image=safeUrl(a.image);
    const cover = image ? `<img src="${esc(image)}" alt="${esc(a.title||'')}">` : '';
    const href=`article.html?slug=${encodeURIComponent(a.slug)}`;
    const featured=a.slug==='cherchenie-i-inzhenernaya-grafika';
    if(featured){
      return `<article class="article-card article-card--featured"><a class="article-cover" href="${href}">${cover}</a><div class="article-body"><div class="article-feature-kicker"><span class="article-feature-badge">Новая статья</span><span class="article-category">${esc(a.category || 'Статья')}</span></div><h3><a href="${href}">${esc(a.title)}</a></h3><p>${esc(a.excerpt || '')}</p><div class="article-meta"><span>${esc(dateRu(a.date))}</span><span>${esc(a.readTime || '')}</span></div><a class="article-link article-link--button" href="${href}">Читать статью →</a></div></article>`;
    }
    return `<article class="article-card"><a class="article-cover" href="${href}">${cover}</a><div class="article-body"><span class="article-category">${esc(a.category || 'Статья')}</span><h3><a href="${href}">${esc(a.title)}</a></h3><p>${esc(a.excerpt || '')}</p><div class="article-meta"><span>${esc(dateRu(a.date))}</span><span>${esc(a.readTime || '')}</span></div><a class="article-link" href="${href}">Читать →</a></div></article>`;
  }
  function loadArticles(){
    return new Promise(resolve => {
      const api=(window.OSNOVA_ARTICLES_API||'').trim();
      if(!api){ resolve(FALLBACK_ARTICLES); return; }
      const cb='osnovaArticlesCallback_'+Date.now();
      const script=document.createElement('script');
      const timer=setTimeout(()=>{ cleanup(); resolve(FALLBACK_ARTICLES); },10000);
      function cleanup(){ clearTimeout(timer); delete window[cb]; script.remove(); }
      window[cb]=payload=>{ cleanup(); const rows=Array.isArray(payload)?payload:(payload && payload.articles)||[]; resolve(mergeArticles(FALLBACK_ARTICLES, rows)); };
      script.onerror=()=>{ cleanup(); resolve(FALLBACK_ARTICLES); };
      script.src=api+(api.includes('?')?'&':'?')+'api=1&callback='+encodeURIComponent(cb);
      document.head.appendChild(script);
    });
  }
  function renderGallery(a){
    const images=parseJson(a.gallery).map(x=>typeof x==='string'?{url:x,caption:''}:x).filter(x=>safeUrl(x.url));
    if(!images.length) return '';
    return `<section class="article-media-section"><h2>Фотографии и материалы</h2><div class="article-gallery">${images.map((img,i)=>`<figure><a href="${esc(safeUrl(img.url))}" target="_blank" rel="noopener"><img src="${esc(safeUrl(img.url))}" alt="${esc(img.caption||a.title||'Изображение')}"></a>${img.caption?`<figcaption>${esc(img.caption)}</figcaption>`:''}</figure>`).join('')}</div></section>`;
  }
  function attachmentIcon(type){
    const t=String(type||'').toLowerCase();
    if(t.includes('pdf')) return 'PDF';
    if(t.includes('presentation')||t.includes('powerpoint')||t.includes('ppt')) return 'PPT';
    if(t.includes('image')) return 'IMG';
    if(t.includes('video')) return 'VID';
    return 'FILE';
  }
  function renderAttachments(a){
    const files=parseJson(a.attachments).map(x=>typeof x==='string'?{url:x,name:'Материал',type:''}:x).filter(x=>safeUrl(x.url));
    if(!files.length) return '';
    return `<section class="article-media-section"><h2>Файлы к статье</h2><div class="article-attachments">${files.map(f=>`<a class="article-attachment" href="${esc(safeUrl(f.url))}" target="_blank" rel="noopener"><span class="article-attachment-icon">${esc(attachmentIcon(f.type))}</span><span><strong>${esc(f.name||'Открыть материал')}</strong><small>${esc(f.description||'Открыть в новой вкладке')}</small></span><b>↗</b></a>`).join('')}</div></section>`;
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
    const all=await loadArticles(); const a=all.find(x=>x.slug===slug);
    if(!a){ root.innerHTML='<div class="empty-state">Статья не найдена. <a href="articles.html">Перейти ко всем статьям</a></div>'; return; }
    document.title=a.title+' — ЦОР ОСНОВА';
    const hero=safeUrl(a.image);
    root.innerHTML=`<nav class="article-nav-inline" aria-label="Навигация по статьям"><a href="index.html">← На сайт</a><span aria-hidden="true">·</span><a href="articles.html">Все статьи →</a></nav><header class="article-header"><span class="article-category">${esc(a.category||'Статья')}</span><h1>${esc(a.title)}</h1><div class="article-meta"><span>Фарида Мухамадиева</span><span>${esc(dateRu(a.date))}</span><span>${esc(a.readTime||'')}</span></div></header>${hero?`<div class="article-hero-image"><img src="${esc(hero)}" alt="${esc(a.title||'')}"></div>`:''}<div class="article-content">${a.content||''}</div>${renderGallery(a)}${renderAttachments(a)}<div class="article-cta"><h2>Нужно разобрать учебную задачу?</h2><p>Можно обсудить цель и подобрать подходящий формат занятий.</p><a href="index.html#top">Получить консультацию</a></div>`;
  }
  window.OsnovaArticles={loadArticles,FALLBACK_ARTICLES,filterRemoteArticles};
  document.addEventListener('DOMContentLoaded',()=>{initHome();initList();initArticle();});
})();
