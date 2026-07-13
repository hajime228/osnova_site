(function(){
  const FALLBACK_ARTICLES = [];

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
  function card(a){
    const image=safeUrl(a.image);
    const cover = image ? `<img src="${esc(image)}" alt="${esc(a.title||'')}">` : '';
    return `<article class="article-card"><a class="article-cover" href="article.html?slug=${encodeURIComponent(a.slug)}">${cover}</a><div class="article-body"><span class="article-category">${esc(a.category || 'Статья')}</span><h3><a href="article.html?slug=${encodeURIComponent(a.slug)}">${esc(a.title)}</a></h3><p>${esc(a.excerpt || '')}</p><div class="article-meta"><span>${esc(dateRu(a.date))}</span><span>${esc(a.readTime || '')}</span></div><a class="article-link" href="article.html?slug=${encodeURIComponent(a.slug)}">Читать →</a></div></article>`;
  }
  function loadArticles(){
    return new Promise(resolve => {
      const api=(window.OSNOVA_ARTICLES_API||'').trim();
      if(!api){ resolve(FALLBACK_ARTICLES); return; }
      const cb='osnovaArticlesCallback_'+Date.now();
      const script=document.createElement('script');
      const timer=setTimeout(()=>{ cleanup(); resolve(FALLBACK_ARTICLES); },10000);
      function cleanup(){ clearTimeout(timer); delete window[cb]; script.remove(); }
      window[cb]=payload=>{ cleanup(); const rows=Array.isArray(payload)?payload:(payload && payload.articles)||[]; resolve(rows.length?rows:FALLBACK_ARTICLES); };
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
  window.OsnovaArticles={loadArticles,FALLBACK_ARTICLES};
  document.addEventListener('DOMContentLoaded',()=>{initHome();initList();initArticle();});
})();
