/* ============================================================
   MAIN.JS — Navbar · Scroll Reveal · Counters · Smooth Scroll
   WE CAN Institute of English
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const PHONE_PATTERN = /^[6-9]\d{9}$/;
  const toastContainer = (() => {
    let node = document.getElementById('siteToastContainer');
    if (!node) {
      node = document.createElement('div');
      node.id = 'siteToastContainer';
      node.style.position = 'fixed';
      node.style.right = '16px';
      node.style.bottom = '16px';
      node.style.zIndex = '9999';
      node.style.display = 'flex';
      node.style.flexDirection = 'column';
      node.style.gap = '8px';
      document.body.appendChild(node);
    }
    return node;
  })();
  const showSiteToast = (message, type = 'error') => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.background = type === 'success' ? 'rgba(16,185,129,0.95)' : 'rgba(239,68,68,0.95)';
    toast.style.color = '#fff';
    toast.style.padding = '10px 12px';
    toast.style.borderRadius = '10px';
    toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
    toast.style.fontSize = '13px';
    toast.style.maxWidth = '320px';
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  };

  /* Navbar scroll */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* Mobile menu */
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

  /* Active nav link on scroll */
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

  /* Scroll reveal */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  /* Animated counters */
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

  /* Smooth scroll with fixed navbar offset */
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

  /* Demo button */
  document.getElementById('bookDemoBtn')?.addEventListener('click', () => {
    document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
  });

  /* Demo form submit */
  const demoForm = document.getElementById('demoForm');
  const getFormFeedbackNode = () => document.getElementById('demoFormStatus');
  const setFormFeedback = (message, type = 'error') => {
    const node = getFormFeedbackNode();
    if (!node) return;
    node.textContent = message || '';
    node.className = 'cta-form__feedback';
    if (message) node.classList.add(type === 'success' ? 'is-success' : 'is-error');
  };
  const toggleFieldError = (field, hasError) => {
    if (!field) return;
    field.classList.toggle('is-invalid', hasError);
    field.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  };
  const clearFieldErrors = (...fields) => fields.forEach(field => toggleFieldError(field, false));
  const setSubmitLoading = (button, isLoading) => {
    if (!button) return;
    if (isLoading) {
      if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML;
      button.disabled = true;
      button.classList.add('btn--loading');
      button.innerHTML = `
        <span class="btn__icon" aria-hidden="true"><i data-lucide="loader-circle"></i></span>
        Submitting...
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [button] });
      return;
    }
    button.disabled = false;
    button.classList.remove('btn--loading');
    if (button.dataset.originalHtml) {
      button.innerHTML = button.dataset.originalHtml;
      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [button] });
    }
  };

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
    clearFieldErrors(nameInput, phoneInput, batchSelect);

    if (!name || !phone || !batchName) {
      toggleFieldError(nameInput, !name);
      toggleFieldError(phoneInput, !phone);
      toggleFieldError(batchSelect, !batchName);
      setFormFeedback('Please fill name, phone, and batch.');
      showSiteToast('Please fill name, phone, and batch.');
      return;
    }
    if (name.length < 2) {
      toggleFieldError(nameInput, true);
      setFormFeedback('Name must be at least 2 characters.');
      showSiteToast('Name must be at least 2 characters.');
      return;
    }
    if (!PHONE_PATTERN.test(phone)) {
      toggleFieldError(phoneInput, true);
      setFormFeedback('Enter valid Indian mobile number (10 digits, starts with 6-9).');
      showSiteToast('Enter valid Indian mobile number (10 digits, starts with 6-9).');
      return;
    }

    try {
      setFormFeedback('');
      setSubmitLoading(submitBtn, true);
      await API.submitEnquiry({
        name,
        phone,
        batch_name: batchName,
      });
      demoForm.reset();
      clearFieldErrors(nameInput, phoneInput, batchSelect);
      setFormFeedback('Demo enquiry submitted successfully. We will contact you soon.', 'success');
      showSiteToast('Demo enquiry submitted successfully.', 'success');
    } catch (error) {
      setFormFeedback(error?.message || 'Could not submit enquiry. Please try again.');
      showSiteToast(error?.message || 'Could not submit enquiry. Please try again.');
    } finally {
      setSubmitLoading(submitBtn, false);
    }
  });

  const phoneInput = demoForm?.querySelector('input[type="tel"]');
  const nameInput = demoForm?.querySelector('input[type="text"]');
  const batchSelect = demoForm?.querySelector('select');
  [nameInput, phoneInput, batchSelect].forEach(field => {
    field?.addEventListener('input', () => {
      toggleFieldError(field, false);
      if (getFormFeedbackNode()?.textContent) setFormFeedback('');
    });
    field?.addEventListener('change', () => {
      toggleFieldError(field, false);
      if (getFormFeedbackNode()?.textContent) setFormFeedback('');
    });
  });
  phoneInput?.addEventListener('input', () => {
    const digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    phoneInput.value = digits;
  });

  phoneInput?.addEventListener('blur', () => {
    const value = phoneInput.value.trim();
    if (!value) return;
    if (!PHONE_PATTERN.test(value)) {
      toggleFieldError(phoneInput, true);
      setFormFeedback('Enter valid Indian mobile number (10 digits, starts with 6-9).');
      showSiteToast('Enter valid Indian mobile number (10 digits, starts with 6-9).');
    }
  });

  /* Program card hover */
  document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.querySelectorAll('.program-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

});
