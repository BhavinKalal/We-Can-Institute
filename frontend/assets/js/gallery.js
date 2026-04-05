/* ============================================================
   GALLERY.JS - Filter Tabs and Lightbox
   WE CAN Institute of English
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const escapeHtml = str => String(str || '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));

  /* Gallery filter tabs */
  document.querySelectorAll('.gallery__tab').forEach(tab => {
    tab.addEventListener('click', () => {
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

  /* Lightbox */
  window.openLightbox = el => {
    const caption = el.querySelector('.gallery__item-caption')?.textContent?.trim() || '';
    const cat = el.querySelector('.gallery__item-cat')?.textContent?.trim() || '';
    const lb = document.getElementById('galleryLightbox');
    const content = document.getElementById('lightboxContent');
    const mediaType = el.dataset.mediaType || '';
    const mediaUrl = el.dataset.mediaUrl || '';
    const externalVideoUrl = el.dataset.externalVideoUrl || '';
    const img = el.querySelector('.gallery__item-bg, .gallery__placeholder img, img');
    const video = el.querySelector('video');
    const iframe = el.querySelector('iframe');

    let mediaHtml = `
      <div class="gallery-lightbox__fallback">
        <p class="lightbox-placeholder-text">No image available for this card yet.</p>
      </div>`;

    if (mediaType === 'image' && (mediaUrl || img?.src)) {
      const src = mediaUrl || img.currentSrc || img.src;
      mediaHtml = `<img src="${src}" alt="${escapeHtml(img?.alt || caption || cat || 'Gallery image')}" class="gallery-lightbox__img" />`;
    } else if (mediaType === 'video' && externalVideoUrl) {
      let iframeSrc = externalVideoUrl;
      try {
        const parsed = new URL(externalVideoUrl);
        const host = parsed.hostname.replace(/^www\./, '');
        if (host === 'youtube.com' || host === 'youtu.be') {
          const videoId = host === 'youtu.be' ? parsed.pathname.slice(1) : parsed.searchParams.get('v');
          if (videoId) iframeSrc = `https://www.youtube.com/embed/${videoId}`;
        }
      } catch (_) {}
      mediaHtml = `
        <iframe
          class="gallery-lightbox__iframe"
          src="${iframeSrc}"
          title="${escapeHtml(caption || cat || 'Gallery video')}"
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    } else if (mediaType === 'video' && (mediaUrl || video?.currentSrc || video?.src || video?.querySelector('source')?.src)) {
      const videoSrc = mediaUrl || video?.currentSrc || video?.src || video?.querySelector('source')?.src || '';
      mediaHtml = `
        <video class="gallery-lightbox__video" controls autoplay playsinline>
          <source src="${videoSrc}">
        </video>`;
    } else if (img?.src) {
      mediaHtml = `<img src="${img.currentSrc || img.src}" alt="${escapeHtml(img.alt || caption || cat || 'Gallery image')}" class="gallery-lightbox__img" />`;
    } else if (video?.currentSrc || video?.src || video?.querySelector('source')?.src) {
      const videoSrc = video.currentSrc || video.src || video.querySelector('source')?.src || '';
      mediaHtml = `
        <video class="gallery-lightbox__video" controls autoplay playsinline>
          <source src="${videoSrc}">
        </video>`;
    } else if (iframe?.src) {
      mediaHtml = `
        <iframe
          class="gallery-lightbox__iframe"
          src="${iframe.src}"
          title="${escapeHtml(caption || cat || 'Gallery video')}"
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    }

    content.innerHTML = `
      <figure class="gallery-lightbox__figure">
        <div class="gallery-lightbox__media">
          ${mediaHtml}
        </div>
        ${(cat || caption) ? `
          <figcaption class="gallery-lightbox__meta">
            ${cat ? `<span class="gallery-lightbox__cat">${escapeHtml(cat)}</span>` : ''}
            ${caption ? `<p class="gallery-lightbox__caption">${escapeHtml(caption)}</p>` : ''}
          </figcaption>` : ''}
      </figure>`;

    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = e => {
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
