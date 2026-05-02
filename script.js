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

  // ---- contact form -> POST to /api/contact (Cloudflare Pages Function + Resend) ----
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  const showNote = (text, isError = false) => {
    if (!note) return;
    note.hidden = false;
    note.classList.toggle('is-error', !!isError);
    note.textContent = text;
  };

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const payload = {
        name: (data.get('name') || '').toString().trim(),
        email: (data.get('email') || '').toString().trim(),
        type: (data.get('type') || '').toString(),
        message: (data.get('message') || '').toString().trim(),
        website: (data.get('website') || '').toString(), // honeypot
      };

      if (!payload.name || !payload.email || !payload.message) {
        showNote('Please fill out your name, email, and a short message.', true);
        return;
      }

      const submitBtn = form.querySelector('button[type=submit]');
      const originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      showNote('Sending your message…');

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await res.json().catch(() => ({}));

        if (res.ok && result.ok) {
          showNote("Thanks — your message is in. We'll be in touch within 24 hours.");
          form.reset();
        } else {
          showNote(result.error || "Something went wrong. Please email us directly at bailey_dougie@yahoo.com.", true);
        }
      } catch (err) {
        showNote("Couldn't reach the server. Please email us directly at bailey_dougie@yahoo.com.", true);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }
    });
  }
})();
