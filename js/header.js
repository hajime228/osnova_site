const menuToggle = document.getElementById('menuToggle');
const mainMenu = document.getElementById('mainMenu');

if (menuToggle && mainMenu) {
  const closeMenu = () => {
    menuToggle.classList.remove('open');
    mainMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const willOpen = !mainMenu.classList.contains('open');
    menuToggle.classList.toggle('open', willOpen);
    mainMenu.classList.toggle('open', willOpen);
    menuToggle.setAttribute('aria-expanded', String(willOpen));
  });

  mainMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => {
    if (!mainMenu.classList.contains('open')) return;
    if (!mainMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
}

const mobileCta = document.getElementById('mobileCta');
if (mobileCta) {
  mobileCta.addEventListener('click', () => {
    setTimeout(() => document.getElementById('phoneInput')?.focus(), 350);
  });
}
