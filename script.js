/* Ex Machina Printing — small UI helpers */

(() => {
  // ---- year in footer ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- nav: shadow on scroll ----
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- mobile menu toggle ----
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- reveal-on-scroll for cards & sections ----
  const revealTargets = document.querySelectorAll(
    '.service, .gallery__item, .step, .why__card, .founder, .hero__copy, .hero__visual, .section__head'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => io.observe(el));

  // ---- contact form (graceful fallback — no backend yet) ----
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      if (!name || !email || !message) {
        note.hidden = false;
        note.classList.add('is-error');
        note.textContent = 'Please fill out your name, email, and a short message.';
        return;
      }

      // Build a mailto fallback so the message reaches us until a backend is wired up
      const type = (data.get('type') || 'Not specified').toString();
      const subject = encodeURIComponent(`New project inquiry — ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nProject type: ${type}\n\n${message}`
      );
      const mail = `mailto:bailey_dougie@yahoo.com?subject=${subject}&body=${body}`;

      note.hidden = false;
      note.classList.remove('is-error');
      note.textContent = 'Thanks! Opening your email client to send the message…';

      window.setTimeout(() => { window.location.href = mail; }, 600);
      form.reset();
    });
  }
})();
