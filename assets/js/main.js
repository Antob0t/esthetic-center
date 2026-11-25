const WHATSAPP = '34644818750';
const waLink = text => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

function initLayout() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
}

if (window.partialsReady) initLayout();
else document.addEventListener('partials:ready', initLayout, { once: true });

document.querySelectorAll('.service:not([data-extra])').forEach(li => {
  const title = li.querySelector('h4');
  const name = title.cloneNode(true);
  name.querySelectorAll('small').forEach(s => s.remove());
  const service = name.textContent.trim();
  const price = li.querySelector('.service__price')?.textContent.trim();

  const a = document.createElement('a');
  a.className = 'service__link';
  a.href = waLink(`Hola Suyai, me gustaría pedir cita para ${service}${price ? ` (${price})` : ''}.`);
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', `Pedir cita para ${service} por WhatsApp`);
  while (li.firstChild) a.appendChild(li.firstChild);

  const cta = document.createElement('span');
  cta.className = 'service__cta';
  cta.textContent = 'Pedir cita';
  a.querySelector('.service__info').appendChild(cta);

  li.appendChild(a);
  li.classList.add('service--bookable');
});

const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const toMin = (h, m) => Number(h) * 60 + Number(m);
const fmt = min => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

const schedule = {};
document.querySelectorAll('.schedule tr[data-day]').forEach(tr => {
  const ranges = [...tr.querySelector('td').textContent.matchAll(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/g)];
  schedule[tr.dataset.day] = ranges.map(r => [toMin(r[1], r[2]), toMin(r[3], r[4])]);
});

function nowInSpain() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date()).map(p => [p.type, p.value])
  );
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  return { day, min: toMin(parts.hour, parts.minute) };
}

function getStatus() {
  const { day, min } = nowInSpain();
  const current = (schedule[day] || []).find(([o, c]) => min >= o && min < c);
  if (current) {
    const left = current[1] - min;
    return { open: true, text: left <= 30 ? `Abierto · cierra pronto (${fmt(current[1])})` : `Abierto ahora · hasta las ${fmt(current[1])}` };
  }
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7;
    const next = (schedule[d] || []).find(([o]) => i > 0 || o > min);
    if (next) {
      const when = i === 0 ? 'hoy' : i === 1 ? 'mañana' : `el ${DAY_NAMES[d]}`;
      return { open: false, text: `Cerrado · abre ${when} a las ${fmt(next[0])}`, day };
    }
  }
  return { open: false, text: 'Cerrado' };
}

function renderStatus() {
  const { day } = nowInSpain();
  document.querySelectorAll('.schedule tr').forEach(tr => tr.classList.toggle('today', tr.dataset.day === String(day)));

  const status = getStatus();
  document.querySelectorAll('[data-status]').forEach(el => {
    el.hidden = false;
    el.className = `status ${status.open ? 'status--open' : 'status--closed'}`;
    el.innerHTML = `<span class="status__dot" aria-hidden="true"></span>${status.text}`;
  });
}
renderStatus();
setInterval(renderStatus, 60 * 1000);

document.querySelectorAll('[data-load-map]').forEach(btn =>
  btn.addEventListener('click', () => {
    const map = btn.closest('.map');
    const iframe = document.createElement('iframe');
    iframe.title = 'Ubicación de Suyai Encinas Estética Avanzada';
    iframe.src = map.dataset.mapSrc;
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    map.replaceChildren(iframe);
  })
);

const targets = document.querySelectorAll('.section__head, .gift, .info, .map, .notice');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(t => { t.classList.add('reveal'); io.observe(t); });
}
