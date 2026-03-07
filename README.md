# WE CAN Institute of English — Website

**Version:** 1.0  
**Built:** 2026  
**Tech:** Pure HTML · CSS · Vanilla JS (no frameworks, no dependencies)

---

## 📁 Folder Structure

```
wecan-project/
│
├── index.html                  ← Main homepage (open this in browser)
│
├── assets/
│   ├── css/
│   │   ├── base.css            ← Variables, reset, typography, utilities
│   │   ├── layout.css          ← Containers, grid, section spacing
│   │   ├── components.css      ← Navbar, buttons, cards, badges
│   │   ├── sections.css        ← Hero, Why, Programs, Journey, Testimonials, CTA, Footer
│   │   └── new-sections.css    ← Faculty, Gallery, Blog sections
│   │
│   ├── js/
│   │   ├── main.js             ← Navbar, scroll reveal, counters, smooth scroll
│   │   └── gallery.js          ← Gallery filter tabs + lightbox
│   │
│   └── images/
│       ├── wecan-logo.png      ← Official logo (PNG, transparent)
│       └── wecan-logo.jpeg     ← Official logo (JPEG)
```

---

## 🚀 How to Open

1. Download and unzip the folder
2. Open `index.html` in any browser (Chrome, Firefox, Safari, Edge)
3. That's it — no server needed, no npm install, no build steps

> ⚠️ **Note:** Google Fonts requires an internet connection to load.  
> The site works offline but will fall back to system fonts.

---

## ✏️ How to Edit Content

### Change Institute Name / Contact Info
Open `index.html` and search for the text you want to change.

### Update Phone / Email / Address
Search for `+91 98765 43210` or `hello@wecaninstitute.com` and replace.

---

## 👨‍🏫 Adding Faculty Photos

Find the faculty section in `index.html`. Each card has a placeholder like:

```html
<div class="faculty-card__avatar-placeholder">
  <div class="faculty-card__avatar-circle">MK</div>
  ...
</div>
```

Replace the entire `faculty-card__avatar-placeholder` div with:

```html
<img src="assets/images/faculty-name.jpg"
     alt="Faculty Name"
     style="width:100%;height:100%;object-fit:cover;object-position:top;" />
```

**Recommended photo specs:**
- Size: 400×533px (3:4 ratio portrait)
- Format: JPG or WebP
- File size: under 200KB for best performance

---

## 🖼️ Updating Gallery Images

Each gallery item has a colored placeholder. To replace with a real photo:

**Find this pattern:**
```html
<div class="gallery__item" data-category="activities" onclick="openLightbox(this)">
  <div class="gallery__placeholder" style="background:...">
    ...
  </div>
```

**Replace `gallery__placeholder` div with:**
```html
<img src="assets/images/gallery/your-photo.jpg"
     class="gallery__item-bg"
     alt="Description of photo" />
```

**For video items**, replace the placeholder with a YouTube embed:
```html
<iframe width="100%" height="100%"
        src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
        frameborder="0" allowfullscreen></iframe>
```

**Gallery is designed to be updated monthly.**  
Simply swap image files in `assets/images/gallery/` folder.

---

## 📝 Updating Blog Posts

Each blog card in `index.html` has:
- A title (`blog-featured__title` or `blog-card-grid__title`)
- An excerpt (`blog-featured__excerpt` or `blog-card-grid__excerpt`)
- Author name and role
- Date and read time

Just edit the text directly in `index.html`.

---

## 🎨 Changing Brand Colors

Open `assets/css/base.css` and update the CSS variables at the top:

```css
:root {
  --red:       #e31e24;   /* Primary red */
  --blue:      #1b9bd7;   /* Primary blue */
  --navy:      #020617;   /* Dark background */
  --navy-mid:  #0f172a;   /* Mid background */
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Target |
|-----------|--------|
| 1200px    | Large desktop |
| 1024px    | Laptop / tablet landscape |
| 768px     | Tablet portrait |
| 480px     | Mobile |

---

## 📦 Sections (in order)

1. **Hero** — Main banner with CTA
2. **Why Choose Us** — 6 feature cards
3. **Programs / Batches** — Featured + batch list
4. **Learning Journey** — 4-step timeline
5. **Faculty** — Team cards with photos
6. **Testimonials** — Featured quote + 3 cards
7. **Gallery** — Filterable photo/video grid (updated monthly)
8. **Blog** — Featured article + grid posts
9. **CTA** — Enquiry form + book demo
10. **Footer** — Links, contact, copyright

---

## 🛠️ Support

For design changes or new features, contact your web developer.

© 2026 WE CAN Institute of English. All rights reserved.
