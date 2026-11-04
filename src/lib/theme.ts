/** Скрипт установки темы до первого рендера, чтобы не было вспышки. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('atlas-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
