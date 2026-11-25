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
