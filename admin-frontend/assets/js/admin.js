/* ============================================================
   ADMIN.JS — Sidebar · Toast · Modal · Global Helpers
   WE CAN Institute — Admin Dashboard
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── LUCIDE ICONS ── */
  if (typeof lucide !== 'undefined') lucide.createIcons();

  /* ── SIDEBAR TOGGLE (mobile) ── */
  const sidebar  = document.getElementById('sidebar');
  const hamburger= document.getElementById('sidebarToggle');
  const overlay  = document.getElementById('sidebarOverlay');

  hamburger?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay?.classList.toggle('show');
  });
  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });

  /* ── ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar__link').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    if (href === currentPage) link.classList.add('active');
  });

  /* ── MODAL HELPERS ── */
  window.openModal = (id) => {
    const el = document.getElementById(id);
    if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
  };
  window.closeModal = (id) => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
  };

  // Close modal on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // Close modal on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        closeModal(m.id);
      });
    }
  });

  /* ── TOAST SYSTEM ── */
  window.showToast = (message, type = 'success', duration = 3500) => {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle', info: 'info' };
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <i data-lucide="${icons[type] || 'info'}" style="width:16px;height:16px;flex-shrink:0;"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [toast] });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  };

  /* ── CONFIRM DIALOG ── */
  window.confirmAction = (message, onConfirm) => {
    const overlay = document.getElementById('confirmModal');
    const msgEl   = document.getElementById('confirmMessage');
    const confirmBtn = document.getElementById('confirmBtn');

    if (!overlay) {
      if (confirm(message)) onConfirm();
      return;
    }

    if (msgEl) msgEl.textContent = message;
    openModal('confirmModal');

    const handler = () => {
      closeModal('confirmModal');
      onConfirm();
      confirmBtn.removeEventListener('click', handler);
    };
    confirmBtn.addEventListener('click', handler);
  };

  /* ── TAB SYSTEM ── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.tabGroup;
      const target = btn.dataset.tab;

      document.querySelectorAll(`.tab-btn[data-tab-group="${group}"]`).forEach(b => b.classList.remove('active'));
      document.querySelectorAll(`.tab-panel[data-tab-group="${group}"]`).forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const panel = document.querySelector(`.tab-panel[data-tab="${target}"][data-tab-group="${group}"]`);
      if (panel) panel.style.display = '';
    });
  });

  /* ── DRAG & DROP UPLOAD ── */
  document.querySelectorAll('.upload-area').forEach(area => {
    area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('drag-over'); });
    area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
    area.addEventListener('drop', e => {
      e.preventDefault();
      area.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      const input = area.querySelector('input[type="file"]');
      if (input && files.length) {
        input.files = files;
        input.dispatchEvent(new Event('change'));
      }
    });
    area.addEventListener('click', () => area.querySelector('input[type="file"]')?.click());
  });

});

/* ── GLOBAL HELPERS ── */

// Format date
window.fmtDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
};

// Truncate text
window.truncate = (str, n = 60) => str?.length > n ? str.slice(0, n) + '...' : str;

// Stars HTML
window.starsHtml = (count, max = 5) => {
  return Array.from({length: max}, (_, i) =>
    `<svg class="star ${i < count ? '' : 'star--empty'}" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>`
  ).join('');
};

// Status badge HTML
window.statusBadge = (status) => {
  const map = {
    'new':       ['blue',   'New'],
    'contacted': ['yellow', 'Contacted'],
    'enrolled':  ['green',  'Enrolled'],
    'closed':    ['grey',   'Closed'],
    'published': ['green',  'Published'],
    'draft':     ['grey',   'Draft'],
    'active':    ['green',  'Active'],
    'inactive':  ['grey',   'Inactive'],
  };
  const [color, label] = map[status] || ['grey', status];
  return `<span class="badge badge--${color}">${label}</span>`;
};

// Level badge
window.levelBadge = (level) => {
  const map = {
    'Beginner': 'green', 'Elementary': 'blue',
    'Intermediate': 'yellow', 'Advanced': 'orange', 'Expert': 'purple'
  };
  return `<span class="badge badge--${map[level] || 'grey'}">${level}</span>`;
};

// Debounce
window.debounce = (fn, delay = 300) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};
