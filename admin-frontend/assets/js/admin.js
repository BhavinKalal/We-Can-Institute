/* ============================================================
   ADMIN.JS - Sidebar · Toast · Modal · Global Helpers
   WE CAN Institute - Admin Dashboard
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const SIDEBAR_COLLAPSED_KEY = 'wecan_sidebar_collapsed';
  const onLoginPage = window.location.pathname.endsWith('/login.html');
  const token = localStorage.getItem('wecan_admin_token');
  const loginPath = window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html';
  const dashboardPath = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';

  if (!onLoginPage && !token) {
    window.location.href = loginPath;
    return;
  }
  if (onLoginPage && token) {
    window.location.href = dashboardPath;
    return;
  }

  const applyRoleUI = (user) => {
    if (!user || onLoginPage) return;
    const isSuperAdmin = user.role === 'super_admin';
    const nav = document.querySelector('.sidebar__nav');
    const onPagesDir = window.location.pathname.includes('/pages/');
    const usersHref = onPagesDir ? 'admin-users.html' : 'pages/admin-users.html';

    if (nav && isSuperAdmin && !nav.querySelector('[data-super-admin-link]')) {
      const settingsLink = nav.querySelector('.sidebar__link[href$="settings.html"]');
      const sectionLabel = document.createElement('span');
      sectionLabel.className = 'sidebar__section-label';
      sectionLabel.textContent = 'Super Admin';
      sectionLabel.setAttribute('data-super-admin-link', 'true');

      const link = document.createElement('a');
      link.href = usersHref;
      link.className = 'sidebar__link';
      link.setAttribute('data-super-admin-link', 'true');
      link.innerHTML = '<i data-lucide="shield-check"></i> Admin Users';

      if (settingsLink) {
        nav.insertBefore(sectionLabel, settingsLink);
        nav.insertBefore(link, settingsLink);
      } else {
        nav.appendChild(sectionLabel);
        nav.appendChild(link);
      }
      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [link] });
    }

    const requiresSuperAdmin = document.body?.dataset?.requiresSuperAdmin === 'true';
    if (requiresSuperAdmin && !isSuperAdmin) {
      showToast('Super admin access required', 'error');
      setTimeout(() => { window.location.href = dashboardPath; }, 300);
    }
  };

  if (typeof lucide !== 'undefined') lucide.createIcons();

  const appShell = document.querySelector('.admin-app');
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('sidebarToggle');
  const overlay = document.getElementById('sidebarOverlay');
  const isDesktop = () => window.matchMedia('(min-width: 901px)').matches;
  if (appShell && isDesktop() && localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1') {
    appShell.classList.add('sidebar-collapsed');
  }
  hamburger?.addEventListener('click', () => {
    if (isDesktop()) {
      appShell?.classList.toggle('sidebar-collapsed');
      if (appShell?.classList.contains('sidebar-collapsed')) {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, '1');
      } else {
        localStorage.removeItem(SIDEBAR_COLLAPSED_KEY);
      }
      return;
    }
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('show');
  });
  overlay?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    overlay.classList.remove('show');
  });
  window.addEventListener('resize', () => {
    if (isDesktop()) {
      sidebar?.classList.remove('open');
      overlay?.classList.remove('show');
    }
  });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar__link').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    if (href === currentPage) link.classList.add('active');
  });

  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem('wecan_admin_token');
    localStorage.removeItem('wecan_admin_user');
    window.location.href = loginPath;
  };

  document.querySelectorAll('[data-admin-logout]').forEach(btn => btn.addEventListener('click', logoutHandler));

  if (!onLoginPage) {
    const topbarRight = document.querySelector('.topbar__right');
    if (topbarRight && !topbarRight.querySelector('[data-admin-logout]')) {
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'btn btn--ghost btn--sm';
      logoutBtn.setAttribute('data-admin-logout', 'true');
      logoutBtn.innerHTML = '<i data-lucide="log-out"></i> Logout';
      topbarRight.appendChild(logoutBtn);
      logoutBtn.addEventListener('click', logoutHandler);
      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [logoutBtn] });
    }
  }

  window.openModal = (id) => {
    const el = document.getElementById(id);
    if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
  };
  window.closeModal = (id) => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
  };

  document.querySelectorAll('.modal-overlay').forEach(modalOverlay => {
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) closeModal(modalOverlay.id);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
    }
  });

  window.showToast = (message, type = 'success', duration = 3500) => {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle', info: 'info' };
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `<i data-lucide="${icons[type] || 'info'}" style="width:16px;height:16px;flex-shrink:0;"></i><span>${message}</span>`;

    container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [toast] });

    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  };

  window.confirmAction = (message, onConfirm) => {
    const confirmOverlay = document.getElementById('confirmModal');
    const msgEl = document.getElementById('confirmMessage');
    const confirmBtn = document.getElementById('confirmBtn');

    if (!confirmOverlay) {
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

  if (!onLoginPage && window.API?.me) {
    API.me().then(user => applyRoleUI(user)).catch(() => {
      localStorage.removeItem('wecan_admin_token');
      localStorage.removeItem('wecan_admin_user');
      window.location.href = loginPath;
    });
  } else {
    try {
      const cachedUser = JSON.parse(localStorage.getItem('wecan_admin_user') || 'null');
      applyRoleUI(cachedUser);
    } catch (_) {}
  }
});

window.fmtDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

window.truncate = (str, n = 60) => str?.length > n ? str.slice(0, n) + '...' : str;

window.starsHtml = (count, max = 5) => {
  return Array.from({ length: max }, (_, i) =>
    `<svg class="star ${i < count ? '' : 'star--empty'}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
  ).join('');
};

window.statusBadge = (status) => {
  const map = {
    new: ['blue', 'New'],
    contacted: ['yellow', 'Contacted'],
    enrolled: ['green', 'Enrolled'],
    closed: ['grey', 'Closed'],
    published: ['green', 'Published'],
    draft: ['grey', 'Draft'],
    active: ['green', 'Active'],
    inactive: ['grey', 'Inactive'],
  };
  const [color, label] = map[status] || ['grey', status];
  return `<span class="badge badge--${color}">${label}</span>`;
};

window.levelBadge = (level) => {
  const map = {
    Beginner: 'green', Elementary: 'blue', Intermediate: 'yellow', Advanced: 'orange', Expert: 'purple'
  };
  return `<span class="badge badge--${map[level] || 'grey'}">${level}</span>`;
};

window.debounce = (fn, delay = 300) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};

window.setButtonLoading = (button, isLoading, loadingText = 'Saving...') => {
  if (!button) return;
  if (isLoading) {
    if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML;
    button.disabled = true;
    button.classList.add('btn--loading');
    button.innerHTML = `<i data-lucide="loader-circle"></i> ${loadingText}`;
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

window.setPageStatus = (elementId, message = '', type = 'info') => {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (!message) {
    el.className = 'page-status';
    el.innerHTML = '';
    return;
  }
  const icons = { info: 'info', success: 'check-circle', error: 'triangle-alert' };
  el.className = `page-status page-status--${type} is-visible`;
  el.innerHTML = `<i data-lucide="${icons[type] || 'info'}"></i><span>${message}</span>`;
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [el] });
};
window.resolveAdminMediaUrl = (pathOrUrl) => {
  if (!pathOrUrl) return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') || pathOrUrl.startsWith('blob:') || pathOrUrl.startsWith('data:')) {
    return pathOrUrl;
  }
  if (pathOrUrl.startsWith('/media/') || pathOrUrl.startsWith('media/')) {
    const apiRoot = (typeof BASE_URL === 'string' ? BASE_URL : 'http://localhost:8000/api/v1')
      .replace(/\/api\/v1\/?$/, '/');
    return new URL(pathOrUrl, apiRoot).toString();
  }
  return pathOrUrl;
};




