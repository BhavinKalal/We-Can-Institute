/* ============================================================
   GALLERY.JS — Filter Tabs · Lightbox
   WE CAN Institute of English
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── GALLERY FILTER TABS ── */
  document.querySelectorAll('.gallery__tab').forEach(tab => {
    tab.addEventListener('click', () => {

      // Update active tab
      document.querySelectorAll('.gallery__tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;

      document.querySelectorAll('.gallery__item').forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 20);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ── LIGHTBOX ── */
  window.openLightbox = (el) => {
    const caption = el.querySelector('.gallery__item-caption')?.textContent || '';
    const cat     = el.querySelector('.gallery__item-cat')?.textContent || '';
    const lb      = document.getElementById('galleryLightbox');
    const content = document.getElementById('lightboxContent');

    content.innerHTML = `
      <div style="text-align:center;padding:2rem 3rem;">
        <div style="font-size:4rem;margin-bottom:1rem;">🖼️</div>
        <p style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;
                  color:var(--red-light);font-weight:700;margin-bottom:.5rem;">${cat}</p>
        <p style="color:var(--white);font-size:1.1rem;font-weight:600;
                  margin-bottom:1rem;font-family:'Playfair Display',serif;">${caption}</p>
        <p style="color:var(--text-soft);font-size:13px;">
          Replace the placeholder with your actual image<br>
          <code style="background:rgba(255,255,255,.06);padding:2px 8px;border-radius:4px;
                       font-size:12px;color:#60c9f8;">&lt;img src="your-photo.jpg" /&gt;</code>
        </p>
      </div>`;

    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = (e) => {
    const lb = document.getElementById('galleryLightbox');
    if (!e || e.target === lb || e.currentTarget?.classList?.contains('gallery-lightbox__close')) {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.getElementById('galleryLightbox').classList.remove('open');
      document.body.style.overflow = '';
    }
  });

});
