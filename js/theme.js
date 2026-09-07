(function () {
  const STORAGE_KEY = 'osnova-theme';
  const ICONS = {
    light: 'assets/icon-moon.png',
    dark: 'assets/icon-sun.png'
  };

  function readSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'dark' || saved === 'light' ? saved : '';
    } catch (e) {
      return '';
    }
  }

  function saveTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const button = document.getElementById('themeToggle');
    if (!button) return;
    const isDark = theme === 'dark';
    button.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
    button.setAttribute('title', isDark ? 'Светлая тема' : 'Тёмная тема');
    const icon = button.querySelector('.theme-icon');
    if (icon) icon.setAttribute('src', isDark ? ICONS.dark : ICONS.light);
  }

  const savedTheme = readSavedTheme();
  applyTheme(savedTheme || 'light');

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(document.documentElement.dataset.theme || savedTheme || 'light');
    const button = document.getElementById('themeToggle');
    if (!button) return;
    button.addEventListener('click', function () {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      saveTheme(next);
      applyTheme(next);
    });
  });
})();
