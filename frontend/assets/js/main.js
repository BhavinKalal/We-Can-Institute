/* ============================================================
   MAIN.JS — Navbar · Scroll Reveal · Counters · Smooth Scroll
   WE CAN Institute of English
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ── MOBILE MENU ── */
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobileMenu');

  ham?.addEventListener('click', () => {
    const isOpen = ham.classList.toggle('open');
    mob.classList.toggle('open', isOpen);
    mob.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.navbar__mobile-link').forEach(l =>
    l.addEventListener('click', () => {
      ham.classList.remove('open');
      mob.classList.remove('open');
      mob.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    })
  );

  /* ── ACTIVE NAV LINK ON SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link[data-section]');

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l =>
          l.classList.toggle('active', l.dataset.section === e.target.id)
        );
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObs.observe(s));

  /* ── SCROLL REVEAL ── */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  /* ── ANIMATED COUNTERS ── */
  const animCount = el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const dur    = 1800;
    const start  = performance.now();

    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (Number.isInteger(target)
        ? Math.floor(eased * target).toLocaleString()
        : (eased * target).toFixed(1)
      ) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animCount(e.target); cntObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => cntObs.observe(el));

  /* ── SMOOTH SCROLL (offset for fixed navbar) ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', ev => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) {
        ev.preventDefault();
        window.scrollTo({
          top: t.getBoundingClientRect().top + window.scrollY - 72,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── DEMO BUTTON ── */
  document.getElementById('bookDemoBtn')?.addEventListener('click', () => {
    document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
  });

  /* —— DEMO FORM SUBMIT —— */
  const demoForm = document.getElementById('demoForm');
  demoForm?.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const submitBtn = demoForm.querySelector('button[type="submit"]');
    const nameInput = demoForm.querySelector('input[type="text"]');
    const phoneInput = demoForm.querySelector('input[type="tel"]');
    const batchSelect = demoForm.querySelector('select');
    if (!nameInput || !phoneInput || !batchSelect) return;

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const batchName = batchSelect.options[batchSelect.selectedIndex]?.text || '';

    if (!name || !phone || !batchName) return;

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }
      await API.submitEnquiry({
        name,
        phone,
        batch_name: batchName,
      });
      demoForm.reset();
      alert('Demo enquiry submitted successfully. We will contact you soon.');
    } catch (error) {
      alert(error?.message || 'Could not submit enquiry. Please try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span class="btn__icon" aria-hidden="true"><i data-lucide="target"></i></span>
          Book My Free Demo Class
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [submitBtn] });
      }
    }
  });

  /* ── PROGRAM CARD HOVER ── */
  document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.querySelectorAll('.program-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

});
