// ── MENU HAMBURGER MOBILE
document.addEventListener('DOMContentLoaded', () => {
  const burger      = document.querySelector('.nav-burger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const overlay     = document.querySelector('.mobile-menu-overlay');
  const closeBtn    = document.querySelector('.mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  function openMenu() {
    burger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    overlay.style.display = 'block';
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    burger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    overlay.classList.remove('is-open');
    overlay.addEventListener('transitionend', () => { overlay.style.display = 'none'; }, { once: true });
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    burger.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
});

// ── FORMULAIRE DE CONTACT (EmailJS) ───────────────────────────────────────────
(function () {
  const EMAILJS_PUBLIC_KEY  = '2CIlXEWf0-EsFfMgV';
  const EMAILJS_SERVICE_ID  = 'service_rr46wbg';
  const EMAILJS_TEMPLATE_ID = 'template_njcl7po';

  const form     = document.getElementById('contact-form');
  if (!form) return;

  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  const btn      = form.querySelector('.form-submit-btn');
  const label    = form.querySelector('.form-submit-label');
  const feedback = document.getElementById('form-feedback');

  function setFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className   = 'form-feedback form-feedback--' + type;
    feedback.hidden      = false;
  }

  function setLoading(on) {
    btn.disabled = on;
    label.textContent = on ? 'Sending...' : 'Send enquiry';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const org     = form.querySelector('#org').value.trim();
    const message = form.querySelector('#message').value.trim();
    const phone   = form.querySelector('#phone').value.trim();

    if (!name || !email || !message) {
      setFeedback('Please fill in your name, work email and message.', 'err');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback('Please enter a valid email address.', 'err');
      return;
    }

    setLoading(true);
    feedback.hidden = true;

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name: name,
        email: email,
        organisation: org,
        phone: phone,
        message: message,
      });

      form.reset();
      setFeedback('Enquiry sent. Bureau Point Fixe will respond directly and discreetly.', 'ok');

    } catch (_) {
      setFeedback('Network unavailable. Please try again or write directly to contact@bureaupointfixe.com.', 'err');
    } finally {
      setLoading(false);
    }
  });
})();

// ── RAIL (ACTIVE SECTION)
(function () {
  const railLinks = Array.from(document.querySelectorAll('.rail-list a'));
  if (!railLinks.length) return;

  const sections = railLinks
    .map(link => document.getElementById(link.getAttribute('data-section')))
    .filter(Boolean);

  function setActive(id) {
    railLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('data-section') === id);
    });
  }

  if (!('IntersectionObserver' in window) || !sections.length) return;

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => sectionObs.observe(section));
})();

// ── SCROLL PROGRESS (MOBILE) ──────────────────────────────────────────────────
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  let ticking = false;

  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    bar.style.width = (ratio * 100) + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });

  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
})();

/* ═══════════════════════════════════════════════════════════
   CHARGEMENT CONTENU -> fichiers JSON (CMS Sveltia)
═══════════════════════════════════════════════════════════ */

function el(id) { return document.getElementById(id); }

function pad2(n) { return String(n).padStart(2, '0'); }

function bodyToHtml(body) {
  return body.split('\n\n').map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`).join('');
}

function renderHome(d) {
  const h = d.hero;
  if (el('home-hero-label'))         el('home-hero-label').textContent = h.label;
  if (el('home-hero-h1'))            el('home-hero-h1').textContent    = h.h1;
  if (el('home-hero-lead'))          el('home-hero-lead').textContent  = h.lead;
  if (el('home-hero-cta-secondary')) el('home-hero-cta-secondary').textContent = h.cta_secondary;
  if (el('home-hero-aside-label'))   el('home-hero-aside-label').textContent   = h.aside_label;
  if (el('home-hero-aside-lines'))   el('home-hero-aside-lines').innerHTML     = h.aside_lines.map(l => l.line).join('<br>');

  const t = d.tensions;
  if (el('home-tensions-label')) el('home-tensions-label').textContent = t.label;
  if (el('home-tensions-h2'))    el('home-tensions-h2').textContent    = t.h2;
  if (el('home-tensions-intro')) el('home-tensions-intro').textContent = t.intro;
  if (el('home-tensions-teaser'))el('home-tensions-teaser').textContent= t.teaser;
  if (el('home-tensions-items')) {
    el('home-tensions-items').innerHTML = t.items.map((item, i) => `
      <article class="tension"><div class="num">${pad2(i + 1)}</div><h3>${item.line1}<br>${item.line2}</h3></article>`
    ).join('');
  }
}

function renderCapabilities(d) {
  const h = d.hero;
  if (el('cap-hero-label')) el('cap-hero-label').textContent = h.label;
  if (el('cap-hero-h1'))    el('cap-hero-h1').textContent    = h.h1;
  if (el('cap-hero-lead'))  el('cap-hero-lead').textContent  = h.lead;

  if (el('cap-items')) {
    el('cap-items').innerHTML = d.items.map((c, i) => {
      const n = pad2(i + 1);
      return `
      <article class="cap">
        <div class="container cap-grid">
          <div class="cap-head"><span class="cap-ghost" aria-hidden="true">${n}</span><div class="num">${n}</div><h2>${c.h2}</h2></div>
          <div class="cap-body">
            <p class="promise">${c.promise}</p>
            <p>${c.body}</p>
            <p class="scope">${c.scope}</p>
          </div>
        </div>
      </article>`;
    }).join('');
  }

  const f = d.formats;
  if (el('cap-formats-label')) el('cap-formats-label').textContent = f.label;
  if (el('cap-formats-h2'))    el('cap-formats-h2').textContent    = f.h2;
  if (el('cap-formats-items')) {
    el('cap-formats-items').innerHTML = f.items.map((item, i) => `
      <article class="format"><div class="num">${pad2(i + 1)}</div><h3>${item.h3}</h3><p>${item.p}</p></article>`
    ).join('');
  }
}

function renderMarkets(d) {
  const h = d.hero;
  if (el('markets-hero-label')) el('markets-hero-label').textContent = h.label;
  if (el('markets-hero-h1'))    el('markets-hero-h1').textContent    = h.h1;
  if (el('markets-hero-lead'))  el('markets-hero-lead').textContent  = h.lead;
  if (el('markets-territory'))  el('markets-territory').textContent  = d.territory;

  if (el('markets-items')) {
    el('markets-items').innerHTML = d.items.map((m, i) => `
      <div class="market"><div class="num">${pad2(i + 1)}</div><h3>${m.h3}</h3><p>${m.p}</p></div>`
    ).join('');
  }
}

function renderAbout(d) {
  const h = d.hero;
  if (el('about-hero-label')) el('about-hero-label').textContent = h.label;
  if (el('about-hero-h1'))    el('about-hero-h1').textContent    = h.h1;
  if (el('about-hero-lead'))  el('about-hero-lead').textContent  = h.lead;

  const c = d.copy;
  if (el('about-copy')) {
    el('about-copy').innerHTML = `<p>${c.p1}</p><p>${c.p2}</p><p class="sig">${c.signature}</p>`;
  }

  const a = d.aside;
  if (el('about-aside-kicker')) el('about-aside-kicker').textContent = a.kicker;
  if (el('about-aside-strong'))el('about-aside-strong').innerHTML   = `${a.line1}<br>${a.line2}`;
  if (el('about-aside-small1'))el('about-aside-small1').textContent = a.small1;
  if (el('about-aside-small2'))el('about-aside-small2').textContent = a.small2;

  const e = d.evidence;
  if (el('about-evidence-label')) el('about-evidence-label').textContent = e.label;
  if (el('about-evidence-h2'))    el('about-evidence-h2').textContent    = e.h2;
  if (el('about-evidence-note'))  el('about-evidence-note').textContent  = e.note;
  if (el('about-evidence-items')) {
    el('about-evidence-items').innerHTML = e.items.map(item => `
      <div class="e-item"><strong>${item.strong}</strong><p>${item.p}</p></div>`
    ).join('');
  }

  const g = d.governance;
  if (el('about-governance-label')) el('about-governance-label').textContent = g.label;
  if (el('about-governance-h2'))    el('about-governance-h2').textContent    = g.h2;
  if (el('about-governance-items')) {
    el('about-governance-items').innerHTML = g.items.map(item => `
      <div class="governance-grid">
        <div>
          <div class="num">${item.standing_label}</div>
          <h3 style="font-size:22px;line-height:1.15;margin:8px 0 0">${item.standing_title}</h3>
          <p class="small stand">${item.standing_valid}</p>
        </div>
        <div class="governance-copy"><p>${item.p1}</p><p>${item.p2}</p></div>
      </div>`
    ).join('');
  }
}

function renderFooterSocials(d) {
  if (!el('footer-socials')) return;
  el('footer-socials').innerHTML = d.socials.map(s =>
    `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a>`
  ).join('<br>');
}

function renderLegal(d, email) {
  if (el('legal-title')) el('legal-title').textContent = d.title;
  if (el('legal-sections')) {
    el('legal-sections').innerHTML = d.sections.map((s, i) => {
      const extra = i === 0 ? `<p>Email: <a href="mailto:${email}">${email}</a></p>` : '';
      return `<div class="legal-section"><h3>${s.heading}</h3>${bodyToHtml(s.body)}${extra}</div>`;
    }).join('');
  }
}

function renderPrivacy(d, email) {
  if (el('privacy-title')) el('privacy-title').textContent = d.title;
  if (el('privacy-sections')) {
    el('privacy-sections').innerHTML = d.sections.map((s, i) => {
      const extra = i === 0
        ? `<p>Email: <a href="mailto:${email}">${email}</a></p>`
        : (i === d.sections.length - 1 ? `<p>To exercise these rights, contact <a href="mailto:${email}">${email}</a>.</p>` : '');
      return `<div class="legal-section"><h3>${s.heading}</h3>${bodyToHtml(s.body)}${extra}</div>`;
    }).join('');
  }
}

/* Adresse utilisée dans les pages légales (la page Contact n'est pas gérée par le CMS) */
const CONTACT_EMAIL = 'contact@bureaupointfixe.com';

/* Chargement de tous les fichiers en parallèle */
Promise.all([
  fetch('content/home.json').then(r => r.json()),
  fetch('content/capabilities.json').then(r => r.json()),
  fetch('content/markets.json').then(r => r.json()),
  fetch('content/about.json').then(r => r.json()),
  fetch('content/footer.json').then(r => r.json()),
  fetch('content/legal.json').then(r => r.json()),
  fetch('content/privacy.json').then(r => r.json()),
]).then(([home, cap, markets, about, footer, legal, privacy]) => {
  renderHome(home);
  renderCapabilities(cap);
  renderMarkets(markets);
  renderAbout(about);
  renderFooterSocials(footer);
  renderLegal(legal, CONTACT_EMAIL);
  renderPrivacy(privacy, CONTACT_EMAIL);
}).catch(err => console.error('Erreur chargement contenu :', err));
