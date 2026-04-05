// frontend/assets/js/dynamic-content.js

document.addEventListener('DOMContentLoaded', () => {
    loadHomepageData();
});

const DEFAULT_HERO_STATS = [
    { value: 5200, suffix: '+', label: 'Students Trained', sort_order: 0 },
    { value: 14, suffix: ' yrs', label: 'Years of Excellence', sort_order: 1 },
    { value: 98, suffix: '%', label: 'Success Rate', sort_order: 2 },
    { value: 4.9, suffix: '★', label: 'Average Rating', sort_order: 3 },
];
const BLOG_POST_MAP = new Map();

function setHomepageStatus(message = '') {
    const banner = document.getElementById('homepageStatus');
    if (!banner) return;
    banner.textContent = message;
    banner.classList.toggle('is-visible', Boolean(message));
}

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

function clampText(value, max = 160) {
    const text = String(value || '').trim();
    if (text.length <= max) return text;
    return `${text.slice(0, max - 1).trimEnd()}…`;
}

function setBlogPostCache(posts) {
    BLOG_POST_MAP.clear();
    (posts || []).forEach((post) => {
        if (post && typeof post.id !== 'undefined') {
            BLOG_POST_MAP.set(String(post.id), post);
        }
    });
}

function renderBlogLightbox(post) {
    const content = document.getElementById('blogLightboxContent');
    const modal = document.getElementById('blogLightbox');
    if (!content || !modal || !post) return;

    const cover = post.cover_image_url
        ? `<img src="${resolveMediaUrl(post.cover_image_url)}" alt="${post.title || 'Blog cover'}" class="blog-reader__cover-image" />`
        : `<div class="blog-reader__cover-empty">No Cover Image</div>`;
    const bodyHtml = (post.content || '').trim()
        ? post.content
        : `<p>${post.excerpt || ''}</p>`;

    content.innerHTML = `
      <article class="blog-reader">
        <div class="blog-reader__media">${cover}</div>
        <div class="blog-reader__body">
          <div class="blog-reader__meta">
            <span class="blog-reader__category">${post.category || 'Blog'}</span>
            <h2 class="blog-reader__title">${post.title || ''}</h2>
            <p class="blog-reader__meta-line">${fmtDate(post.published_date)}${post.read_time ? ` · ${post.read_time}` : ''}</p>
          </div>
          <div class="blog-reader__content">${bodyHtml}</div>
        </div>
      </article>
    `;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

window.openBlogLightboxById = (postId) => {
    const post = BLOG_POST_MAP.get(String(postId));
    if (!post) return;
    renderBlogLightbox(post);
};

window.closeBlogLightbox = (event) => {
    const modal = document.getElementById('blogLightbox');
    if (!modal) return;
    if (!event || event.target === modal || event.currentTarget?.classList?.contains('gallery-lightbox__close')) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
};

async function loadHomepageData() {
    const heroSection = document.getElementById('hero');
    const heroStatsStrip = document.querySelector('.hero-stats-strip');
    const loadingSections = document.querySelectorAll('.content-loading');
    try {
        setHomepageStatus('');
        const data = await API.getHomepageData();
        if (data.settings) populateSettings(data.settings);
        if (data.hero) {
            populateHero(data.hero);
        }
        populateBatches(Array.isArray(data.batches) ? data.batches : []);
        populateFaculty(Array.isArray(data.faculty) ? data.faculty : []);
        populateTestimonials(Array.isArray(data.testimonials) ? data.testimonials : []);
        populateGallery(Array.isArray(data.gallery) ? data.gallery : []);
        populateBlog(Array.isArray(data.blog_posts) ? data.blog_posts : []);

        if (typeof lucide !== 'undefined') lucide.createIcons();
        reinitCounters();
    } catch (error) {
        console.error('Failed to load homepage data:', error);
        setHomepageStatus('Live content could not be loaded right now. Showing fallback content where available.');
        populateBatches([]);
        populateFaculty([]);
        populateTestimonials([]);
        populateGallery([]);
        populateBlog([]);
    } finally {
        if (heroSection) heroSection.classList.remove('hero--loading');
        if (heroStatsStrip) heroStatsStrip.classList.remove('hero-stats-strip--loading');
        loadingSections.forEach(section => section.classList.remove('content-loading'));
    }
}

function populateTestimonials(testimonials) {
    const section = document.getElementById('testimonials');
    if (!section) return;
    const active = testimonials
        .filter(t => t.is_active !== false)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    if (!active.length) {
        section.style.display = 'none';
        return;
    }
    section.style.display = '';

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
        const links = `
            ${settings.instagram ? `<a href="${settings.instagram}" class="footer__social-btn" aria-label="Instagram" target="_blank" rel="noreferrer noopener"><i class="fab fa-instagram"></i></a>` : ''}
            ${settings.facebook ? `<a href="${settings.facebook}" class="footer__social-btn" aria-label="Facebook" target="_blank" rel="noreferrer noopener"><i class="fab fa-facebook"></i></a>` : ''}
            ${settings.linkedin ? `<a href="${settings.linkedin}" class="footer__social-btn" aria-label="LinkedIn" target="_blank" rel="noreferrer noopener"><i class="fab fa-linkedin"></i></a>` : ''}
            ${settings.youtube ? `<a href="${settings.youtube}" class="footer__social-btn" aria-label="YouTube" target="_blank" rel="noreferrer noopener"><i class="fab fa-youtube"></i></a>` : ''}
        `.trim();
        socialWrap.innerHTML = links;
        socialWrap.hidden = !links;
    }
}

function populateHero(hero) {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const isVideoMode = !!hero.video_mode;
    const posterUrl = resolveMediaUrl(hero.poster_url);
    const videoUrl = resolveMediaUrl(hero.video_url);
    const fallbackVideoUrl = 'assets/videos/hero-section-video.mp4';
    const fallbackPosterUrl = 'assets/images/hero/hero.png';

    // Keep the same hero layout in both modes; only media behavior changes.
    heroSection.classList.add('hero--video');
    heroSection.classList.toggle('hero--poster', !isVideoMode);
    const video = heroSection.querySelector('.hero__video');
    if (video) {
        video.poster = posterUrl || fallbackPosterUrl;
        const source = video.querySelector('source');
        if (source) {
            source.src = videoUrl || fallbackVideoUrl;
            video.load();
        }
        if (isVideoMode) {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {});
            }
        } else {
            video.pause();
            video.currentTime = 0;
        }
    }

    if (isVideoMode) {
        heroSection.style.backgroundImage = '';
        heroSection.style.backgroundSize = '';
        heroSection.style.backgroundPosition = '';
        heroSection.style.backgroundRepeat = '';
    } else if (posterUrl || fallbackPosterUrl) {
        const bgUrl = posterUrl || fallbackPosterUrl;
        heroSection.style.backgroundImage = `linear-gradient(to top, rgba(15, 23, 42, 0.62), rgba(15, 23, 42, 0.22)), url("${bgUrl}")`;
        heroSection.style.backgroundSize = '100% 100%, 100% auto';
        heroSection.style.backgroundPosition = 'center center, center top';
        heroSection.style.backgroundRepeat = 'no-repeat, no-repeat';
    } else {
        heroSection.style.backgroundImage = '';
        heroSection.style.backgroundSize = '';
        heroSection.style.backgroundPosition = '';
        heroSection.style.backgroundRepeat = '';
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
    const stats = Array.isArray(hero.stats) && hero.stats.length ? hero.stats : DEFAULT_HERO_STATS;
    if (statsStrip) {
        statsStrip.innerHTML = stats
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
        const activeBatches = batches.filter(b => b.is_active);
        if (!activeBatches.length) {
            batchList.innerHTML = '<div class="empty-state"><div class="empty-state__title">Batches will be announced soon.</div></div>';
        } else {
            batchList.innerHTML = activeBatches
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
        }

        const demoFormSelect = document.querySelector('#demoForm select');
        if (demoFormSelect) {
            demoFormSelect.innerHTML = '<option value="" disabled selected>Select a Batch</option>' +
            activeBatches
                .map(batch => `<option value="${batch.name.toLowerCase().replace(/ /g, '-')}">${batch.name}</option>`)
                .join('');
        }
    }
}

function populateFaculty(faculty) {
    const grid = document.getElementById('facultyGrid') || document.querySelector('.faculty__grid');
    if (!grid) return;
    const active = faculty.filter(f => f.is_active).sort((a, b) => a.sort_order - b.sort_order);
    if (!active.length) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state__title">Faculty details will be updated soon.</div></div>';
        FACULTY_SLIDER.items = [];
        FACULTY_SLIDER.count = 0;
        FACULTY_SLIDER.index = 0;
        FACULTY_SLIDER.renderIndex = 0;
        refreshFacultySliderButtons();
        return;
    }

    FACULTY_SLIDER.items = active;
    FACULTY_SLIDER.count = active.length;
    syncFacultyVisibleCount();
    renderFacultyTrack();
    initFacultySlider();
    updateFacultySlidePosition('auto');
    refreshFacultySliderButtons();
}

const FACULTY_SLIDER = {
    items: [],
    index: 0,
    renderIndex: 0,
    count: 0,
    visible: 3,
};

function getFacultySliderElements() {
    return {
        viewport: document.getElementById('facultyViewport'),
        grid: document.getElementById('facultyGrid'),
        prevBtn: document.getElementById('facultyPrevBtn'),
        nextBtn: document.getElementById('facultyNextBtn'),
    };
}

function getFacultyMaxStartIndex() {
    return Math.max(0, FACULTY_SLIDER.count - FACULTY_SLIDER.visible);
}

function renderFacultyCard(f, idx, realIdx) {
    return `
      <article class="faculty-card" data-slide-index="${idx}" data-real-index="${realIdx}" aria-label="Faculty member">
        <div class="faculty-card__photo">
          ${f.profile_photo_url
            ? `
              <img src="${resolveMediaUrl(f.profile_photo_url)}" alt="" aria-hidden="true" class="faculty-card__photo-bg" />
              <img src="${resolveMediaUrl(f.profile_photo_url)}" alt="${f.name}" class="faculty-card__photo-main" />
            `
            : `<div class="faculty-card__avatar-placeholder"><div class="faculty-card__avatar-circle">${(f.initials || f.name.slice(0, 2)).toUpperCase()}</div></div>`}
        </div>
        <div class="faculty-card__info">
          <span class="faculty-card__role-badge">${f.role || ''}</span>
          <h3 class="faculty-card__name">${f.name}</h3>
          <p class="faculty-card__speciality">${f.speciality || ''}</p>
          <div class="faculty-card__tags">${(f.tags || []).map(t => `<span class="faculty-card__tag">${t}</span>`).join('')}</div>
          <div class="faculty-card__exp"><span class="faculty-card__exp-dot"></span>${f.experience || ''}</div>
        </div>
      </article>
    `;
}

function renderFacultyTrack() {
    const { grid } = getFacultySliderElements();
    if (!grid) return;
    const real = FACULTY_SLIDER.items || [];
    const realCount = real.length;
    if (!realCount) return;

    const cloneCount = Math.min(FACULTY_SLIDER.visible, realCount);
    const headClones = real.slice(0, cloneCount);
    const tailClones = real.slice(realCount - cloneCount);
    const rendered = [...tailClones, ...real, ...headClones];

    grid.innerHTML = rendered.map((item, idx) => {
        const realIdx = (idx - cloneCount + realCount) % realCount;
        return renderFacultyCard(item, idx, realIdx);
    }).join('');

    FACULTY_SLIDER.renderIndex = cloneCount;
    FACULTY_SLIDER.index = 0;
}

function refreshFacultySliderButtons() {
    const { prevBtn, nextBtn } = getFacultySliderElements();
    if (!prevBtn || !nextBtn) return;
    const noOverflow = getFacultyMaxStartIndex() <= 0;
    prevBtn.disabled = noOverflow;
    nextBtn.disabled = noOverflow;
    prevBtn.classList.toggle('is-disabled', prevBtn.disabled);
    nextBtn.classList.toggle('is-disabled', nextBtn.disabled);
}

function updateFacultySlidePosition(behavior = 'smooth') {
    const { viewport, grid } = getFacultySliderElements();
    if (!viewport || !grid) return;
    const cards = Array.from(grid.querySelectorAll('.faculty-card'));
    if (!cards.length) return;

    const cloneCount = Math.min(FACULTY_SLIDER.visible, FACULTY_SLIDER.count);
    const start = FACULTY_SLIDER.renderIndex;
    const centerIndex = Math.min(cards.length - 1, start + Math.floor((FACULTY_SLIDER.visible - 1) / 2));

    cards.forEach((card, idx) => {
        const diff = Math.abs(idx - centerIndex);
        card.classList.toggle('is-active', diff === 0);
        card.classList.toggle('is-near', diff === 1);
        card.classList.toggle('is-far', diff >= 2);
    });

    const firstCard = cards[0];
    const secondCard = cards[1];
    const step = secondCard ? (secondCard.offsetLeft - firstCard.offsetLeft) : firstCard.offsetWidth;
    const target = -(start * step);

    grid.style.transition = behavior === 'auto' ? 'none' : 'transform 420ms cubic-bezier(.22,.61,.36,1)';
    grid.style.transform = `translate3d(${target}px, 0, 0)`;
    if (behavior === 'auto') {
        requestAnimationFrame(() => {
            grid.style.transition = '';
        });
    }

    // Keep logical index in sync with visible real-window start.
    if (FACULTY_SLIDER.count > 0) {
        FACULTY_SLIDER.index = (FACULTY_SLIDER.renderIndex - cloneCount + FACULTY_SLIDER.count) % FACULTY_SLIDER.count;
    } else {
        FACULTY_SLIDER.index = 0;
    }

    refreshFacultySliderButtons();
}

function moveFacultySlide(delta) {
    if (getFacultyMaxStartIndex() <= 0) return;
    FACULTY_SLIDER.renderIndex += delta;
    updateFacultySlidePosition();
}

function syncFacultyVisibleCount() {
    const { viewport } = getFacultySliderElements();
    if (!viewport) return;
    const width = viewport.clientWidth || window.innerWidth;
    FACULTY_SLIDER.visible = width <= 768 ? 1 : width <= 1024 ? 2 : 3;
}

function initFacultySlider() {
    const { viewport, prevBtn, nextBtn, grid } = getFacultySliderElements();
    if (!viewport || !prevBtn || !nextBtn || !grid) return;
    if (viewport.dataset.sliderBound === '1') return;

    prevBtn.addEventListener('click', () => moveFacultySlide(-1));
    nextBtn.addEventListener('click', () => moveFacultySlide(1));
    grid.addEventListener('transitionend', () => {
        const cloneCount = Math.min(FACULTY_SLIDER.visible, FACULTY_SLIDER.count);
        if (!cloneCount || FACULTY_SLIDER.count <= FACULTY_SLIDER.visible) return;
        let shouldReset = false;
        if (FACULTY_SLIDER.renderIndex < cloneCount) {
            FACULTY_SLIDER.renderIndex += FACULTY_SLIDER.count;
            shouldReset = true;
        } else if (FACULTY_SLIDER.renderIndex >= cloneCount + FACULTY_SLIDER.count) {
            FACULTY_SLIDER.renderIndex -= FACULTY_SLIDER.count;
            shouldReset = true;
        }
        if (shouldReset) updateFacultySlidePosition('auto');
    });
    window.addEventListener('resize', () => {
        syncFacultyVisibleCount();
        renderFacultyTrack();
        updateFacultySlidePosition('auto');
    });
    viewport.dataset.sliderBound = '1';
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

function youtubeThumbFromUrl(url) {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace(/^www\./, '');
        if (host === 'youtube.com' || host === 'youtu.be') {
            const videoId = host === 'youtu.be' ? parsed.pathname.slice(1) : parsed.searchParams.get('v');
            if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
    } catch (_) {}
    return null;
}

function normalizeGalleryCategory(value) {
    const raw = (value || '').toString().trim().toLowerCase();
    if (!raw) return 'activities';
    const normalized = raw.replace(/[_\s]+/g, '-');
    if (normalized.includes('video')) return 'video';
    if (normalized.includes('award')) return 'awards';
    if (normalized.includes('student')) return 'students';
    if (normalized.includes('grand')) return 'grand-finale';
    if (normalized.includes('activit') || normalized.includes('program')) return 'activities';
    return normalized;
}

function categoryLabel(slug) {
    if (!slug) return '';
    return slug
        .split('-')
        .map(token => token.charAt(0).toUpperCase() + token.slice(1))
        .join(' ');
}

function populateGallery(galleryItems) {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    const visible = galleryItems.filter(g => g.is_visible).sort((a, b) => a.sort_order - b.sort_order);
    if (!visible.length) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state__title">Gallery will be updated soon.</div></div>';
        return;
    }

    const collagePattern = ['normal', 'normal', 'normal', 'wide', 'normal', 'normal', 'normal', 'normal'];

    grid.innerHTML = visible.map((item, idx) => {
        const category = normalizeGalleryCategory(item.category);
        const pattern = collagePattern[idx % collagePattern.length];
        const layoutClass = pattern === 'normal' ? '' : `gallery__item--${pattern}`;
        let media = '';
        const mediaUrl = item.media_url ? resolveMediaUrl(item.media_url) : '';
        const externalVideoUrl = item.external_video_url || '';
        if (item.media_type === 'image') {
            media = `<img src="${mediaUrl}" class="gallery__item-bg" alt="${item.caption || 'Gallery image'}" />`;
        } else if (externalVideoUrl) {
            const thumb = youtubeThumbFromUrl(externalVideoUrl);
            media = thumb
                ? `<img src="${thumb}" class="gallery__item-bg" alt="${item.caption || 'Video thumbnail'}" />`
                : `
                  <div class="gallery__video-preview" aria-hidden="true">
                    <span class="gallery__video-icon"><i data-lucide="play"></i></span>
                    <span class="gallery__video-label">Video URL</span>
                  </div>
                `;
        } else {
            media = `
              <video class="gallery__item-bg" muted playsinline preload="metadata">
                <source src="${mediaUrl}">
              </video>
            `;
        }
        return `
          <div
            class="gallery__item ${layoutClass} ${item.media_type === 'video' ? 'gallery__item--video' : ''}"
            data-category="${category}"
            data-media-type="${item.media_type || ''}"
            data-media-url="${mediaUrl}"
            data-external-video-url="${externalVideoUrl}"
            onclick="openLightbox(this)"
            aria-label="${item.caption || categoryLabel(category)}">
            ${media}
            ${item.media_type === 'video' ? '<span class="gallery__play-btn" aria-hidden="true"><i data-lucide="play"></i></span>' : ''}
            <div class="gallery__item-overlay">
              <div>
                <span class="gallery__item-cat">${categoryLabel(category)}</span>
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
    setBlogPostCache(published);
    if (!published.length) {
        section.style.display = 'none';
        return;
    }
    section.style.display = '';

    const featured = published.find(p => p.featured) || published[0];
    const rest = published.filter(p => p.id !== featured.id);

        const featuredEl = section.querySelector('.blog-featured');
    if (featuredEl) {
        featuredEl.setAttribute('href', 'javascript:void(0)');
        featuredEl.setAttribute('onclick', `openBlogLightboxById("${featured.id}")`);
        const cover = featured.cover_image_url
            ? `<img src="${resolveMediaUrl(featured.cover_image_url)}" alt="${featured.title}" style="width:100%;height:100%;object-fit:cover;" />`
            : `<div class="blog-featured__cover-placeholder"><div class="blog-featured__cover-gradient blog-cover--featured"></div></div>`;
        featuredEl.innerHTML = `
          <div class="blog-featured__cover">${cover}<span class="blog-featured__badge">Featured</span></div>
          <div class="blog-featured__body">
            <div class="blog-featured__meta"><span class="blog-featured__cat">${featured.category || ''}</span><span>·</span><span>${fmtDate(featured.published_date)}</span><span>·</span><span>${featured.read_time || ''}</span></div>
            <h3 class="blog-featured__title">${clampText(featured.title, 120)}</h3>
            <p class="blog-featured__excerpt">${clampText(featured.excerpt || '', 190)}</p>
            <div class="blog-featured__author"><div class="blog-featured__author-avatar">${(featured.author || 'A').slice(0, 2).toUpperCase()}</div><div><p class="blog-featured__author-name">${featured.author || ''}</p></div></div>
          </div>
        `;
    }

    const sidebar = section.querySelector('.blog__sidebar');
    if (sidebar) {
        sidebar.innerHTML = rest.slice(0, 3).map(p => `
          <a href="javascript:void(0)" class="blog-card-sm" aria-label="Blog post" onclick="openBlogLightboxById('${p.id}')">
            <div class="blog-card-sm__cover">
              ${p.cover_image_url ? `<img src="${resolveMediaUrl(p.cover_image_url)}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;" />` : '<div class="blog-card-sm__cover-placeholder blog-cover--indigo"></div>'}
            </div>
            <div class="blog-card-sm__body">
              <p class="blog-card-sm__cat">${p.category || ''}</p>
              <h4 class="blog-card-sm__title">${clampText(p.title, 84)}</h4>
              <p class="blog-card-sm__excerpt">${clampText(p.excerpt || '', 90)}</p>
              <p class="blog-card-sm__meta">${fmtDate(p.published_date)} · ${p.read_time || ''}</p>
              <div class="blog-card-sm__author">
                <span class="blog-card-sm__avatar">${(p.author || 'A').slice(0, 2).toUpperCase()}</span>
                <span class="blog-card-sm__author-name">${p.author || ''}</span>
              </div>
            </div>
          </a>
        `).join('');
    }

    const gridBottom = section.querySelector('.blog__grid-bottom');
    if (gridBottom) {
        gridBottom.innerHTML = rest.slice(3, 6).map(p => `
          <a href="javascript:void(0)" class="blog-card-grid" aria-label="Blog post" onclick="openBlogLightboxById('${p.id}')">
            <div class="blog-card-grid__cover">
              ${p.cover_image_url ? `<img src="${resolveMediaUrl(p.cover_image_url)}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;" />` : '<div class="blog-card-grid__cover-placeholder blog-cover--navy"></div>'}
            </div>
            <div class="blog-card-grid__body">
              <p class="blog-card-grid__cat">${p.category || ''}</p>
              <h4 class="blog-card-grid__title">${clampText(p.title, 92)}</h4>
              <p class="blog-card-grid__excerpt">${clampText(p.excerpt || '', 110)}</p>
              <p class="blog-card-grid__meta">${fmtDate(p.published_date)} · ${p.read_time || ''}</p>
              <div class="blog-card-grid__footer">
                <div class="blog-card-grid__author"><div class="blog-card-grid__avatar">${(p.author || 'A').slice(0, 2).toUpperCase()}</div><span class="blog-card-grid__author-name">${p.author || ''}</span></div>
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

