// frontend/assets/js/dynamic-content.js

document.addEventListener('DOMContentLoaded', () => {
    loadHomepageData();
});

function resolveMediaUrl(pathOrUrl) {
    if (!pathOrUrl) return '';
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
    if (pathOrUrl.startsWith('/media/')) {
        const apiRoot = (typeof BASE_URL === 'string' ? BASE_URL : 'http://localhost:8000/api/v1').replace('/api/v1', '/');
        return new URL(pathOrUrl, apiRoot).toString();
    }
    return pathOrUrl;
}

function fmtDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

async function loadHomepageData() {
    try {
        const data = await API.getHomepageData();
        if (data.settings) populateSettings(data.settings);
        if (data.hero) populateHero(data.hero);
        if (data.batches) populateBatches(data.batches);
        if (data.faculty) populateFaculty(data.faculty);
        if (data.testimonials) populateTestimonials(data.testimonials);
        if (data.gallery) populateGallery(data.gallery);
        if (data.blog_posts) populateBlog(data.blog_posts);

        if (typeof lucide !== 'undefined') lucide.createIcons();
        reinitCounters();
    } catch (error) {
        console.error('Failed to load homepage data:', error);
    }
}

function populateTestimonials(testimonials) {
    const section = document.getElementById('testimonials');
    if (!section) return;
    const active = testimonials
        .filter(t => t.is_active !== false)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    if (!active.length) return;

    const featured = active[0];
    const rest = active.slice(1, 4);

    const bigQuote = section.querySelector('.testimonials__big-text');
    if (bigQuote) bigQuote.textContent = `"${featured.quote || ''}"`;

    const heroAvatar = section.querySelector('.testimonials__author-avatar');
    if (heroAvatar) heroAvatar.textContent = (featured.initials || (featured.name || '').slice(0, 2)).toUpperCase();

    const heroName = section.querySelector('.testimonials__author-name');
    if (heroName) heroName.textContent = featured.name || '';

    const heroRole = section.querySelector('.testimonials__author-role');
    if (heroRole) heroRole.textContent = featured.role || '';

    const grid = section.querySelector('.testimonials__grid');
    if (!grid || !rest.length) return;

    grid.innerHTML = rest.map((t) => `
      <article class="testimonial-card" role="listitem">
        <div class="testimonial-card__stars" aria-label="${t.stars || 5} stars">${'★'.repeat(Math.max(1, Math.min(5, t.stars || 5)))}</div>
        <p class="testimonial-card__quote">"${t.quote || ''}"</p>
        <div class="testimonial-card__author">
          <div class="testimonial-card__avatar" aria-hidden="true">${(t.initials || (t.name || '').slice(0, 2)).toUpperCase()}</div>
          <div>
            <p class="testimonial-card__name">${t.name || ''}</p>
            <p class="testimonial-card__role">${t.role || ''}</p>
          </div>
        </div>
      </article>
    `).join('');
}

function populateSettings(settings) {
    document.title = settings.meta_title || 'WE CAN Institute of English';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = settings.meta_description || '';

    const contactItems = document.querySelector('address');
    if (contactItems) {
        contactItems.innerHTML = `
            <h3 class="footer__col-title">Contact Us</h3>
            <div class="footer__contact-item">
                <span class="footer__contact-icon"><i data-lucide="map-pin"></i></span>
                <span>${settings.address || ''}</span>
            </div>
            <div class="footer__contact-item">
                <span class="footer__contact-icon"><i data-lucide="phone"></i></span>
                <a href="tel:${settings.phone || ''}" class="footer__link">${settings.phone || ''}</a>
            </div>
            <div class="footer__contact-item">
                <span class="footer__contact-icon"><i data-lucide="mail"></i></span>
                <a href="mailto:${settings.email || ''}" class="footer__link">${settings.email || ''}</a>
            </div>
            <div class="footer__contact-item">
                <span class="footer__contact-icon"><i data-lucide="clock"></i></span>
                <span>${settings.timings || ''}</span>
            </div>
        `;
    }

    const socialWrap = document.querySelector('.footer__socials-wrap');
    if (socialWrap) {
        socialWrap.innerHTML = `
            ${settings.instagram ? `<a href="${settings.instagram}" class="footer__social-btn" aria-label="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
            ${settings.facebook ? `<a href="${settings.facebook}" class="footer__social-btn" aria-label="Facebook"><i class="fab fa-facebook"></i></a>` : ''}
            ${settings.youtube ? `<a href="${settings.youtube}" class="footer__social-btn" aria-label="YouTube"><i class="fab fa-youtube"></i></a>` : ''}
        `;
    }
}

function populateHero(hero) {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    heroSection.classList.toggle('hero--video', hero.video_mode);
    const video = heroSection.querySelector('.hero__video');
    if (video) {
        video.poster = resolveMediaUrl(hero.poster_url);
        const source = video.querySelector('source');
        if (source) {
            source.src = resolveMediaUrl(hero.video_url);
            video.load();
        }
    }

    const eyebrow = heroSection.querySelector('.hero__eyebrow .section-badge');
    if (eyebrow) eyebrow.innerHTML = `<i data-lucide="target" class="icon-inline"></i> &nbsp;${hero.eyebrow || ''}`;

    const title = heroSection.querySelector('.hero__title');
    if (title) {
        title.innerHTML = `${hero.title_line1 || ''} <br>
        <span class="red">${hero.title_line2 || ''}</span><br>
        ${hero.title_line3 || ''}`;
        const title3 = title.childNodes[4];
        if (title3 && title3.nodeType === Node.TEXT_NODE) {
            const words = title3.textContent.trim().split(' ');
            if (words.length > 0) {
                const lastWord = words.pop();
                title3.textContent = words.join(' ') + ' ';
                const blueSpan = document.createElement('span');
                blueSpan.className = 'blue';
                blueSpan.textContent = lastWord;
                title.appendChild(blueSpan);
            }
        }
    }

    const subtitle = heroSection.querySelector('.hero__subtitle');
    if (subtitle) subtitle.innerHTML = hero.subtitle || '';

    const badge = heroSection.querySelector('.hero__badge .glass-badge');
    if (badge) badge.innerHTML = `<span class="glass-badge__dot" aria-hidden="true"></span> ${hero.badge_text || ''}`;

    const ctaBtn = document.getElementById('bookDemoBtn');
    if (ctaBtn) {
        ctaBtn.innerHTML = `
            <span class="btn__icon" aria-hidden="true"><i data-lucide="graduation-cap"></i></span>
            ${hero.cta_text || 'Book Free Demo'}
        `;
    }

    const ctaSubtext = heroSection.querySelector('.hero__cta-wrap .t-small');
    if (ctaSubtext) ctaSubtext.textContent = hero.cta_subtext || '';

    const statsStrip = document.querySelector('.hero-stats-strip__inner');
    if (statsStrip && hero.stats) {
        statsStrip.innerHTML = hero.stats
            .sort((a, b) => a.sort_order - b.sort_order)
            .map(stat => `
            <div class="hero-stats-strip__item">
                <span class="hero-stats-strip__num" data-counter data-target="${stat.value}" data-suffix="${stat.suffix || ''}">0</span>
                <span class="hero-stats-strip__label">${stat.label}</span>
            </div>
        `).join('');
    }
}

function populateBatches(batches) {
    const batchList = document.querySelector('.programs__list');
    if (batchList) {
        batchList.innerHTML = batches
            .filter(b => b.is_active)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map(batch => `
            <article class="program-card" role="listitem">
                <div class="program-card__emoji" aria-hidden="true">${batch.icon || '<i data-lucide="book-open"></i>'}</div>
                <div class="program-card__info">
                    <h4 class="program-card__name">${batch.name}</h4>
                    <p class="program-card__meta">${batch.description}</p>
                </div>
                <span class="program-card__badge">${batch.level}</span>
            </article>
        `).join('');

        const demoFormSelect = document.querySelector('#demoForm select');
        if (demoFormSelect) {
            demoFormSelect.innerHTML = '<option value="" disabled selected>Select a Batch</option>' +
            batches
                .filter(b => b.is_active)
                .map(batch => `<option value="${batch.name.toLowerCase().replace(/ /g, '-')}">${batch.name}</option>`)
                .join('');
        }
    }
}

function populateFaculty(faculty) {
    const grid = document.querySelector('.faculty__grid');
    if (!grid) return;
    const active = faculty.filter(f => f.is_active).sort((a, b) => a.sort_order - b.sort_order).slice(0, 8);
    if (!active.length) return;

    grid.innerHTML = active.map((f, idx) => `
      <article class="faculty-card" aria-label="Faculty member">
        <div class="faculty-card__photo">
          ${f.profile_photo_url
            ? `<img src="${resolveMediaUrl(f.profile_photo_url)}" alt="${f.name}" style="width:100%;height:100%;object-fit:cover;object-position:top;" />`
            : `<div class="faculty-card__avatar-placeholder"><div class="faculty-card__avatar-circle">${(f.initials || f.name.slice(0, 2)).toUpperCase()}</div></div>`}
          <div class="faculty-card__photo-overlay" aria-hidden="true"></div>
        </div>
        <div class="faculty-card__info">
          <span class="faculty-card__role-badge">${f.role || ''}</span>
          <h3 class="faculty-card__name">${f.name}</h3>
          <p class="faculty-card__speciality">${f.speciality || ''}</p>
          <div class="faculty-card__tags">${(f.tags || []).map(t => `<span class="faculty-card__tag">${t}</span>`).join('')}</div>
          <div class="faculty-card__exp"><span class="faculty-card__exp-dot"></span>${f.experience || ''}</div>
        </div>
      </article>
    `).join('');
}

function embedFromUrl(url) {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace(/^www\./, '');
        if (host === 'youtube.com' || host === 'youtu.be') {
            const videoId = host === 'youtu.be' ? parsed.pathname.slice(1) : parsed.searchParams.get('v');
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }
    } catch (_) {}
    return null;
}

function populateGallery(galleryItems) {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    const visible = galleryItems.filter(g => g.is_visible).sort((a, b) => a.sort_order - b.sort_order);
    if (!visible.length) return;

    grid.innerHTML = visible.map(item => {
        const category = item.category || 'activities';
        let media = '';
        if (item.media_type === 'image') {
            media = `<img src="${resolveMediaUrl(item.media_url)}" class="gallery__item-bg" alt="${item.caption || 'Gallery image'}" />`;
        } else if (item.external_video_url) {
            const embed = embedFromUrl(item.external_video_url);
            media = embed
                ? `<iframe src="${embed}" width="100%" height="100%" frameborder="0" allowfullscreen loading="lazy"></iframe>`
                : `<iframe src="${item.external_video_url}" width="100%" height="100%" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
        } else {
            media = `<video class="gallery__item-bg" controls><source src="${resolveMediaUrl(item.media_url)}"></video>`;
        }
        return `
          <div class="gallery__item ${item.media_type === 'video' ? 'gallery__item--video' : ''}" data-category="${category}" onclick="openLightbox(this)">
            ${media}
            <div class="gallery__item-overlay">
              <div>
                <span class="gallery__item-cat">${category}</span>
                <p class="gallery__item-caption">${item.caption || ''}</p>
              </div>
            </div>
          </div>
        `;
    }).join('');
}

function populateBlog(posts) {
    const section = document.getElementById('blog');
    if (!section) return;
    const published = posts.filter(p => p.status === 'published');
    if (!published.length) return;

    const featured = published.find(p => p.featured) || published[0];
    const rest = published.filter(p => p.id !== featured.id);

        const featuredEl = section.querySelector('.blog-featured');
    if (featuredEl) {
        const cover = featured.cover_image_url
            ? `<img src="${resolveMediaUrl(featured.cover_image_url)}" alt="${featured.title}" style="width:100%;height:100%;object-fit:cover;" />`
            : `<div class="blog-featured__cover-placeholder"><div class="blog-featured__cover-gradient blog-cover--featured"></div></div>`;
        featuredEl.innerHTML = `
          <div class="blog-featured__cover">${cover}<span class="blog-featured__badge">Featured</span></div>
          <div class="blog-featured__body">
            <div class="blog-featured__meta"><span class="blog-featured__cat">${featured.category || ''}</span><span>·</span><span>${fmtDate(featured.published_date)}</span><span>·</span><span>${featured.read_time || ''}</span></div>
            <h3 class="blog-featured__title">${featured.title}</h3>
            <p class="blog-featured__excerpt">${featured.excerpt || ''}</p>
            <div class="blog-featured__author"><div class="blog-featured__author-avatar">${(featured.author || 'A').slice(0, 2).toUpperCase()}</div><div><p class="blog-featured__author-name">${featured.author || ''}</p></div></div>
          </div>
        `;
    }

    const sidebar = section.querySelector('.blog__sidebar');
    if (sidebar) {
        sidebar.innerHTML = rest.slice(0, 3).map(p => `
          <a href="#" class="blog-card-sm" aria-label="Blog post">
            <div class="blog-card-sm__cover">
              ${p.cover_image_url ? `<img src="${resolveMediaUrl(p.cover_image_url)}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;" />` : '<div class="blog-card-sm__cover-placeholder blog-cover--indigo"></div>'}
            </div>
            <div class="blog-card-sm__body">
              <p class="blog-card-sm__cat">${p.category || ''}</p>
              <h4 class="blog-card-sm__title">${p.title}</h4>
              <p class="blog-card-sm__meta">${fmtDate(p.published_date)} · ${p.read_time || ''}</p>
            </div>
          </a>
        `).join('');
    }

    const gridBottom = section.querySelector('.blog__grid-bottom');
    if (gridBottom) {
        gridBottom.innerHTML = rest.slice(3, 6).map(p => `
          <a href="#" class="blog-card-grid" aria-label="Blog post">
            <div class="blog-card-grid__cover">
              ${p.cover_image_url ? `<img src="${resolveMediaUrl(p.cover_image_url)}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;" />` : '<div class="blog-card-grid__cover-placeholder blog-cover--navy"></div>'}
            </div>
            <div class="blog-card-grid__body">
              <p class="blog-card-grid__cat">${p.category || ''}</p>
              <h4 class="blog-card-grid__title">${p.title}</h4>
              <p class="blog-card-grid__excerpt">${p.excerpt || ''}</p>
              <div class="blog-card-grid__footer">
                <div class="blog-card-grid__author"><div class="blog-card-grid__avatar">${(p.author || 'A').slice(0, 2).toUpperCase()}</div><span class="blog-card-grid__author-name">${p.author || ''}</span></div>
                <span class="blog-card-grid__read">${p.read_time || ''}</span>
              </div>
            </div>
          </a>
        `).join('');
    }
}

function reinitCounters() {
    const animCount = el => {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const dur = 1800;
        const start = performance.now();

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
            if (e.isIntersecting) {
                animCount(e.target);
                cntObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-counter]').forEach(el => cntObs.observe(el));
}

