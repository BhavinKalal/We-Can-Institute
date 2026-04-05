/* ============================================================
   API.JS — Mock Data + Fetch Wrapper
   WE CAN Institute — Admin Dashboard
   
   HOW TO SWITCH TO REAL BACKEND:
   1. Set USE_MOCK = false
   2. Optionally set window.WECAN_API_BASE_URL before this script loads
   3. All functions will automatically use real API calls
   ============================================================ */

const USE_MOCK = false;
function resolveAdminApiBaseUrl() {
  const explicit = window.WECAN_API_BASE_URL || document.documentElement?.dataset?.apiBaseUrl;
  if (explicit) return explicit.replace(/\/$/, '');

  const { protocol, hostname, origin } = window.location;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  if (isLocal) return `${protocol}//localhost:8000/api/v1`;
  return `${origin}/api/v1`;
}

const BASE_URL = resolveAdminApiBaseUrl();
const ADMIN_TOKEN_KEY = 'wecan_admin_token';
const ADMIN_USER_KEY = 'wecan_admin_user';

function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

function setAdminToken(token) {
  if (!token) {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    return;
  }
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

function getAdminUser() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || 'null');
  } catch (_) {
    return null;
  }
}

function setAdminUser(user) {
  if (!user) {
    localStorage.removeItem(ADMIN_USER_KEY);
    return;
  }
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

function clearAdminAuth() {
  clearAdminToken();
  setAdminUser(null);
}

/* ── MOCK DATA STORE ── */
const MOCK = {

  stats: {
    totalStudents: 5200,
    activeBatches: 5,
    totalBlogPosts: 12,
    newEnquiries: 24,
    totalFaculty: 4,
    totalTestimonials: 8,
    galleryItems: 18,
  },

  hero: {
    videoUrl: 'assets/videos/hero-section-video.mp4',
    posterUrl: 'assets/images/hero/hero.png',
    eyebrow: 'Speak · Impress · Lead',
    titleLine1: 'Speak With',
    titleLine2: 'Confidence.',
    titleLine3: 'Lead With Words.',
    subtitle: 'From phonics to public speaking — build confidence in English communication and transform your personality with expert guidance.',
    ctaText: 'Book Free Demo',
    ctaSubtext: 'No payment required · 100% free session',
    badgeText: 'Become A Confident Speaker',
    stats: [
      { num: 5200, suffix: '+', label: 'Students Trained' },
      { num: 14,   suffix: ' yrs', label: 'Of Excellence' },
      { num: 98,   suffix: '%', label: 'Success Rate' },
      { num: 4.9,  suffix: '/5', label: 'Average Rating' },
    ]
  },

  batches: [
    { id: 1, name: 'Phonics Batch', level: 'Beginner', icon: '🔤', duration: '3 Months', timing: 'Mon-Wed-Fri · 9AM', seats: 15, filled: 12, description: 'Perfect for young learners building a strong English foundation.', badge: 'Kids Favourite', active: true },
    { id: 2, name: 'Pre Basic',     level: 'Beginner', icon: '📖', duration: '3 Months', timing: 'Tue-Thu · 10AM',   seats: 20, filled: 18, description: 'Introduction to spoken English for absolute beginners.', badge: '', active: true },
    { id: 3, name: 'Basic',         level: 'Elementary', icon: '💬', duration: '4 Months', timing: 'Mon-Wed · 5PM',  seats: 20, filled: 20, description: 'Core grammar, vocabulary, and conversational basics.', badge: 'Most Popular', active: true },
    { id: 4, name: 'Pre Intermediate', level: 'Intermediate', icon: '🎤', duration: '4 Months', timing: 'Sat-Sun · 11AM', seats: 18, filled: 10, description: 'Build confidence for everyday English conversations.', badge: '', active: true },
    { id: 5, name: 'Intermediate',  level: 'Advanced', icon: '🏆', duration: '6 Months', timing: 'Mon-Thu · 7PM',   seats: 15, filled: 8,  description: 'Advanced communication, public speaking & personality.', badge: 'Top Rated', active: true },
  ],

  faculty: [
    { id: 1, name: 'Meera Kapoor',   role: 'Head Trainer', speciality: 'Public Speaking', experience: '10 Years', tags: ['Public Speaking', 'Phonics', 'Corporate'], photoUrl: '', initials: 'MK', active: true },
    { id: 2, name: 'Rohan Mehta',    role: 'English Trainer', speciality: 'Grammar & Writing', experience: '7 Years', tags: ['Grammar', 'IELTS Prep', 'Writing'], photoUrl: '', initials: 'RM', active: true },
    { id: 3, name: 'Sonal Patel',    role: 'Phonics Specialist', speciality: 'Kids Phonics', experience: '5 Years', tags: ['Phonics', 'Kids', 'Foundation'], photoUrl: '', initials: 'SP', active: true },
    { id: 4, name: 'Arjun Shah',     role: 'Personality Coach', speciality: 'Personality Dev.', experience: '8 Years', tags: ['Personality', 'Leadership', 'Confidence'], photoUrl: '', initials: 'AS', active: true },
  ],

  gallery: [
    { id: 1, category: 'activities',    caption: 'Group Speaking Activity', mediaType: 'image', url: '', date: '2026-02-10' },
    { id: 2, category: 'grand-finale',  caption: 'Grand Finale 2025', mediaType: 'image', url: '', date: '2025-12-20' },
    { id: 3, category: 'awards',        caption: 'Best Speaker Award', mediaType: 'image', url: '', date: '2025-12-20' },
    { id: 4, category: 'students',      caption: 'Batch Graduation', mediaType: 'image', url: '', date: '2026-01-15' },
    { id: 5, category: 'video',         caption: 'Confidence Challenge', mediaType: 'video', url: '', date: '2026-02-01' },
    { id: 6, category: 'activities',    caption: 'Role Play Session', mediaType: 'image', url: '', date: '2026-03-01' },
  ],

  blog: [
    { id: 1, title: '5 Daily Habits to Improve Your Spoken English', category: 'Tips & Tricks', author: 'Meera Kapoor', date: '2026-03-01', status: 'published', excerpt: 'Small consistent habits can transform your English communication dramatically.', readTime: '5 min', featured: true },
    { id: 2, title: 'Why Public Speaking is a Life Skill Everyone Needs', category: 'Public Speaking', author: 'Arjun Shah', date: '2026-02-22', status: 'published', excerpt: 'The ability to speak confidently in public opens doors in every area of life.', readTime: '4 min', featured: false },
    { id: 3, title: 'How Phonics Builds a Strong English Foundation', category: 'Phonics', author: 'Sonal Patel', date: '2026-02-15', status: 'published', excerpt: 'Understanding phonics is the first step toward confident reading and speaking.', readTime: '3 min', featured: false },
    { id: 4, title: 'Grand Finale 2025 — A Night to Remember', category: 'Events', author: 'Rohan Mehta', date: '2025-12-22', status: 'published', excerpt: 'Our students showcased their transformation in our biggest event of the year.', readTime: '6 min', featured: false },
    { id: 5, title: 'How to Overcome Stage Fear', category: 'Tips & Tricks', author: 'Meera Kapoor', date: '2026-01-10', status: 'draft', excerpt: 'Stage fear is common but completely conquerable with the right techniques.', readTime: '4 min', featured: false },
  ],

  testimonials: [
    { id: 1, name: 'Priya Sharma',   role: 'IT Professional', quote: 'WE CAN transformed my communication skills completely. I got promoted within 3 months of completing the course!', stars: 5, initials: 'PS', active: true },
    { id: 2, name: 'Karan Desai',    role: 'College Student', quote: 'I was extremely shy before joining. Now I give presentations confidently. Best investment of my life!', stars: 5, initials: 'KD', active: true },
    { id: 3, name: 'Anita Joshi',    role: 'Homemaker',       quote: 'The phonics program for my daughter was excellent. She loves English now and reads fluently!', stars: 5, initials: 'AJ', active: true },
    { id: 4, name: 'Rahul Verma',    role: 'Business Owner',  quote: 'My client meetings improved drastically. The personality development sessions are truly life-changing.', stars: 4, initials: 'RV', active: true },
  ],

  enquiries: [
    { id: 1,  name: 'Sneha Patel',   phone: '+91 98765 12345', batch: 'Basic',          date: '2026-03-09', status: 'new',       notes: '' },
    { id: 2,  name: 'Dev Shah',      phone: '+91 87654 23456', batch: 'Intermediate',   date: '2026-03-09', status: 'contacted', notes: 'Called, demo scheduled' },
    { id: 3,  name: 'Pooja Mehta',   phone: '+91 76543 34567', batch: 'Phonics Batch',  date: '2026-03-08', status: 'new',       notes: '' },
    { id: 4,  name: 'Amit Kumar',    phone: '+91 65432 45678', batch: 'Pre Basic',       date: '2026-03-08', status: 'enrolled',  notes: 'Joined Basic batch' },
    { id: 5,  name: 'Riya Joshi',    phone: '+91 54321 56789', batch: 'Pre Intermediate',date: '2026-03-07', status: 'new',       notes: '' },
    { id: 6,  name: 'Nikhil Sharma', phone: '+91 43210 67890', batch: 'Basic',           date: '2026-03-07', status: 'contacted', notes: 'WhatsApp sent' },
    { id: 7,  name: 'Kavya Reddy',   phone: '+91 32109 78901', batch: 'Intermediate',   date: '2026-03-06', status: 'enrolled',  notes: '' },
    { id: 8,  name: 'Aryan Gupta',   phone: '+91 21098 89012', batch: 'Phonics Batch',  date: '2026-03-06', status: 'new',       notes: '' },
  ],

  settings: {
    siteName: 'WE CAN Institute of English',
    tagline: 'Public Speaking & Self Development',
    phone: '+91 98765 43210',
    email: 'hello@wecaninstitute.com',
    address: '12, Commerce House, CG Road, Ahmedabad, Gujarat 380009',
    timings: 'Mon-Sat: 8:00 AM - 8:00 PM',
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    whatsapp: '+919876543210',
    mapEmbed: '',
    metaTitle: 'WE CAN Institute of English — Spoken English & Public Speaking, Ahmedabad',
    metaDescription: 'Premium Spoken English, Public Speaking & Personality Development in Ahmedabad.',
  }
};

/* ── FETCH WRAPPER ── */
function authRedirectPath() {
  return window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html';
}

function extractApiErrorMessage(body, fallback) {
  if (!body) return fallback;
  if (typeof body === 'string') return body;
  if (Array.isArray(body?.detail)) {
    const first = body.detail[0];
    if (typeof first === 'string') return first;
    if (first?.msg) return first.msg;
  }
  if (typeof body?.detail === 'string') return body.detail;
  if (body?.detail?.message) return body.detail.message;
  if (body?.message) return body.message;
  return fallback;
}

async function apiFetch(endpoint, options = {}, requiresAuth = true) {
  if (USE_MOCK) {
    console.log(`[MOCK API] ${options.method || 'GET'} ${endpoint}`);
    return null; // mock mode: data comes from MOCK object directly
  }
  const isFormData = options.body instanceof FormData;
  const token = getAdminToken();
  const defaultHeaders = isFormData
    ? {}
    : { 'Content-Type': 'application/json' };

  if (requiresAuth && token) {
    defaultHeaders['X-Admin-Token'] = token;
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { ...defaultHeaders, ...options.headers },
    ...options
  });
  if (!res.ok) {
    if (res.status === 401 && requiresAuth) {
      clearAdminAuth();
      if (!window.location.pathname.endsWith('/login.html')) {
        window.location.href = authRedirectPath();
      }
    }
    let message = `API error: ${res.status}`;
    try {
      const body = await res.json();
      message = extractApiErrorMessage(body, message);
    } catch (_) {}
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

function mapEnquiryFromBackend(enquiry) {
  return {
    id: enquiry.id,
    name: enquiry.name || '',
    phone: enquiry.phone || '',
    batch: enquiry.batch_name || '',
    date: enquiry.submitted_at || enquiry.created_at || new Date().toISOString(),
    status: enquiry.status || 'new',
    notes: enquiry.notes || '',
    source: enquiry.source || 'website',
  };
}

function mapEnquiryUpdateToBackend(data = {}) {
  const payload = {};
  if (Object.prototype.hasOwnProperty.call(data, 'status')) payload.status = data.status;
  if (Object.prototype.hasOwnProperty.call(data, 'notes')) payload.notes = data.notes;
  if (Object.prototype.hasOwnProperty.call(data, 'batch')) payload.batch_name = data.batch;
  return payload;
}

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      search.set(key, String(value));
    }
  });
  const q = search.toString();
  return q ? `?${q}` : '';
}

async function apiFetchBlob(endpoint, options = {}, requiresAuth = true) {
  if (USE_MOCK) return null;
  const token = getAdminToken();
  const headers = { ...(options.headers || {}) };
  if (requiresAuth && token) {
    headers['X-Admin-Token'] = token;
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401 && requiresAuth) {
      clearAdminAuth();
      if (!window.location.pathname.endsWith('/login.html')) {
        window.location.href = authRedirectPath();
      }
    }
    let message = `API error: ${res.status}`;
    try {
      message = await res.text();
    } catch (_) {}
    throw new Error(message || `API error: ${res.status}`);
  }
  return res.blob();
}

/* ── API METHODS ── */
const API = {
  getAdminToken,
  setAdminToken,
  clearAdminToken,
  getAdminUser,
  setAdminUser,
  clearAdminAuth,

  login: async (email, password) => {
    const result = await apiFetch(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
      false
    );
    if (result?.access_token) {
      setAdminToken(result.access_token);
      setAdminUser({
        email: result.email,
        full_name: result.full_name,
        role: result.role,
      });
    }
    return result;
  },
  logout: () => {
    clearAdminAuth();
  },
  me: async () => {
    const me = await apiFetch('/auth/me');
    setAdminUser(me);
    return me;
  },
  changeMyPassword: (currentPassword, newPassword) =>
    apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    }),

  getAdminUsers: () => apiFetch('/admin/users'),
  createAdminUser: (data) => apiFetch('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminUser: (id, data) => apiFetch(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAdminUser: (id) => apiFetch(`/admin/users/${id}`, { method: 'DELETE' }),

  /* Stats */
  getStats:        () => USE_MOCK ? Promise.resolve(MOCK.stats)        : apiFetch('/stats'),

  /* Hero */
  getHero:         () => USE_MOCK ? Promise.resolve(MOCK.hero)         : apiFetch('/admin/hero/'),
  updateHero: (data) => USE_MOCK ? Promise.resolve({...MOCK.hero,...data}) : apiFetch('/admin/hero/', {method:'PUT', body:JSON.stringify(data)}),
  uploadHeroMedia: (file, kind) => {
    if (USE_MOCK) {
      const fallback = kind === 'hero_video' ? 'assets/videos/hero-section-video.mp4' : 'assets/images/hero/hero.png';
      return Promise.resolve({ kind, url: fallback, relative_url: fallback, filename: file?.name || '' });
    }
    const form = new FormData();
    form.append('file', file);
    return apiFetch(`/admin/media/upload?kind=${encodeURIComponent(kind)}`, { method: 'POST', body: form });
  },
  uploadFacultyPhoto: (file) => {
    if (USE_MOCK) return Promise.resolve({ url: '', relative_url: '' });
    const form = new FormData();
    form.append('file', file);
    return apiFetch('/admin/media/upload?kind=faculty_profile', { method: 'POST', body: form });
  },
  uploadGalleryImage: (file) => {
    if (USE_MOCK) return Promise.resolve({ url: '', relative_url: '' });
    const form = new FormData();
    form.append('file', file);
    return apiFetch('/admin/media/upload?kind=gallery_image', { method: 'POST', body: form });
  },
  uploadGalleryVideo: (file) => {
    if (USE_MOCK) return Promise.resolve({ url: '', relative_url: '' });
    const form = new FormData();
    form.append('file', file);
    return apiFetch('/admin/media/upload?kind=gallery_video', { method: 'POST', body: form });
  },
  uploadBlogCover: (file) => {
    if (USE_MOCK) return Promise.resolve({ url: '', relative_url: '' });
    const form = new FormData();
    form.append('file', file);
    return apiFetch('/admin/media/upload?kind=blog_cover', { method: 'POST', body: form });
  },

  /* Batches */
  getBatches:      ()     => USE_MOCK ? Promise.resolve([...MOCK.batches])          : apiFetch('/admin/batches/'),
  createBatch: (data)     => USE_MOCK ? Promise.resolve({id:Date.now(),...data})    : apiFetch('/admin/batches/', {method:'POST',body:JSON.stringify(data)}),
  updateBatch: (id, data) => USE_MOCK ? Promise.resolve({id,...data})               : apiFetch(`/admin/batches/${id}`, {method:'PUT',body:JSON.stringify(data)}),
  deleteBatch: (id)       => USE_MOCK ? Promise.resolve({success:true})             : apiFetch(`/admin/batches/${id}`, {method:'DELETE'}),

  /* Faculty */
  getFaculty:      ()     => USE_MOCK ? Promise.resolve([...MOCK.faculty])          : apiFetch('/admin/faculty/'),
  createFaculty: (data)   => USE_MOCK ? Promise.resolve({id:Date.now(),...data})    : apiFetch('/admin/faculty/', {method:'POST',body:JSON.stringify(data)}),
  updateFaculty: (id,data)=> USE_MOCK ? Promise.resolve({id,...data})               : apiFetch(`/admin/faculty/${id}`, {method:'PUT',body:JSON.stringify(data)}),
  deleteFaculty: (id)     => USE_MOCK ? Promise.resolve({success:true})             : apiFetch(`/admin/faculty/${id}`, {method:'DELETE'}),

  /* Gallery */
  getGallery:      ()     => USE_MOCK ? Promise.resolve([...MOCK.gallery])          : apiFetch('/admin/gallery/'),
  createGalleryItem:(data)=> USE_MOCK ? Promise.resolve({id:Date.now(),...data})    : apiFetch('/admin/gallery/', {method:'POST',body:JSON.stringify(data)}),
  updateGalleryItem:(id,data)=> USE_MOCK ? Promise.resolve({id,...data})            : apiFetch(`/admin/gallery/${id}`, {method:'PUT',body:JSON.stringify(data)}),
  deleteGalleryItem:(id)  => USE_MOCK ? Promise.resolve({success:true})             : apiFetch(`/admin/gallery/${id}`, {method:'DELETE'}),

  /* Blog */
  getPosts:        ()     => USE_MOCK ? Promise.resolve([...MOCK.blog])             : apiFetch('/admin/blog/'),
  createPost: (data)      => USE_MOCK ? Promise.resolve({id:Date.now(),...data})    : apiFetch('/admin/blog/', {method:'POST',body:JSON.stringify(data)}),
  updatePost: (id,data)   => USE_MOCK ? Promise.resolve({id,...data})               : apiFetch(`/admin/blog/${id}`, {method:'PUT',body:JSON.stringify(data)}),
  deletePost: (id)        => USE_MOCK ? Promise.resolve({success:true})             : apiFetch(`/admin/blog/${id}`, {method:'DELETE'}),

  /* Testimonials */
  getTestimonials: ()     => USE_MOCK ? Promise.resolve([...MOCK.testimonials])     : apiFetch('/admin/testimonials/'),
  createTestimonial:(data)=> USE_MOCK ? Promise.resolve({id:Date.now(),...data})    : apiFetch('/admin/testimonials/', {method:'POST',body:JSON.stringify(data)}),
  updateTestimonial:(id,data)=>USE_MOCK? Promise.resolve({id,...data})              : apiFetch(`/admin/testimonials/${id}`, {method:'PUT',body:JSON.stringify(data)}),
  deleteTestimonial:(id)  => USE_MOCK ? Promise.resolve({success:true})             : apiFetch(`/admin/testimonials/${id}`, {method:'DELETE'}),

  /* Enquiries */
  getEnquiries: async () => {
    if (USE_MOCK) return Promise.resolve([...MOCK.enquiries]);
    const rows = await apiFetch('/admin/enquiries/');
    return rows.map(mapEnquiryFromBackend);
  },
  updateEnquiry: async (id, data) => {
    if (USE_MOCK) return Promise.resolve({ id, ...data });
    const updated = await apiFetch(`/admin/enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapEnquiryUpdateToBackend(data)),
    });
    return mapEnquiryFromBackend(updated);
  },
  deleteEnquiry: (id) => USE_MOCK ? Promise.resolve({ success: true }) : apiFetch(`/admin/enquiries/${id}`, { method: 'DELETE' }),
  exportEnquiriesCsv: async (filters = {}) => {
    if (USE_MOCK) {
      const rows = [...MOCK.enquiries].filter((e) =>
        (!filters.q || e.name.toLowerCase().includes(filters.q.toLowerCase()) || e.phone.includes(filters.q)) &&
        (!filters.batch_name || e.batch === filters.batch_name) &&
        (!filters.status_filter || e.status === filters.status_filter)
      );
      const csv = ['ID,Name,Phone,Batch,Status,Notes,Source,Submitted At'];
      rows.forEach((e) => {
        csv.push([e.id, e.name, e.phone, e.batch, e.status, `"${(e.notes || '').replaceAll('"', '""')}"`, 'website', e.date].join(','));
      });
      return new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8' });
    }
    return apiFetchBlob(`/admin/enquiries/export.csv${buildQuery(filters)}`);
  },

  /* Settings */
  getSettings:     ()     => USE_MOCK ? Promise.resolve({...MOCK.settings})         : apiFetch('/admin/settings/'),
  updateSettings: (data)  => USE_MOCK ? Promise.resolve({...MOCK.settings,...data}) : apiFetch('/admin/settings/', {method:'PUT',body:JSON.stringify(data)}),
};
