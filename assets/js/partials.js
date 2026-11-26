const DISENOS = { b: 'assets/css/diseno-b/main.css' };

(() => {
  const param = new URLSearchParams(location.search).get('diseno');
  let diseno = param;
  try {
    if (param) sessionStorage.setItem('diseno', param);
    else diseno = sessionStorage.getItem('diseno');
  } catch {}

  const href = DISENOS[diseno];
  const actual = document.querySelector('link[href$="assets/css/main.css"]');
  if (!href || !actual) return;

  const root = document.documentElement;
  root.style.visibility = 'hidden';
  const mostrar = () => { root.style.visibility = ''; };
  const nuevo = document.createElement('link');
  nuevo.rel = 'stylesheet';
  nuevo.href = href;
  nuevo.onload = () => { actual.remove(); mostrar(); };
  nuevo.onerror = mostrar;
  actual.after(nuevo);
  setTimeout(mostrar, 3000);
  root.dataset.diseno = diseno;
})();

(async () => {
  const slots = [...document.querySelectorAll('[data-include]')];

  await Promise.all(slots.map(async slot => {
    try {
      const res = await fetch(slot.dataset.include);
      if (!res.ok) throw new Error(res.status);
      slot.outerHTML = await res.text();
    } catch (err) {
      console.error(`No se pudo cargar ${slot.dataset.include}. Abre la web desde un servidor local.`, err);
    }
  }));

  document.querySelectorAll('a[href^="index.html#"]').forEach(a => {
    const id = a.getAttribute('href').split('#')[1];
    if (document.getElementById(id)) a.setAttribute('href', `#${id}`);
  });

  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll(`a[href="${page}"]`).forEach(a => a.setAttribute('aria-current', 'page'));

  window.partialsReady = true;
  document.dispatchEvent(new Event('partials:ready'));
})();
