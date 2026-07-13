
(function(){
  const FALLBACK_ARTICLES = [];

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
