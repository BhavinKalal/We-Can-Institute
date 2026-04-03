/* ============================================================
   API.JS — Mock Data + Fetch Wrapper
   WE CAN Institute — Admin Dashboard
   
   HOW TO SWITCH TO REAL BACKEND:
   1. Set USE_MOCK = false
   2. Set BASE_URL to your FastAPI server URL
   3. All functions will automatically use real API calls
   ============================================================ */

const USE_MOCK = false;
const BASE_URL = 'http://localhost:8000/api/v1';
const ADMIN_TOKEN = "super-secret-admin-token";

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
    posterUrl: 'assets/images/hero-poster.jpg',
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
    { id: 5, category: 'videos',        caption: 'Confidence Challenge', mediaType: 'video', url: '', date: '2026-02-01' },
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
    instagram: 'https://instagram.com/wecaninstitute',
    facebook: 'https://facebook.com/wecaninstitute',
    youtube: 'https://youtube.com/wecaninstitute',
    whatsapp: '+919876543210',
    mapEmbed: '',
    metaTitle: 'WE CAN Institute of English — Spoken English & Public Speaking, Ahmedabad',
    metaDescription: 'Premium Spoken English, Public Speaking & Personality Development in Ahmedabad.',
  }
};

/* ── FETCH WRAPPER ── */
async function apiFetch(endpoint, options = {}) {
  if (USE_MOCK) {
    console.log(`[MOCK API] ${options.method || 'GET'} ${endpoint}`);
    return null; // mock mode: data comes from MOCK object directly
  }
  const isFormData = options.body instanceof FormData;
  const defaultHeaders = isFormData
    ? { 'X-Admin-Token': ADMIN_TOKEN }
    : { 'Content-Type': 'application/json', 'X-Admin-Token': ADMIN_TOKEN };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { ...defaultHeaders, ...options.headers },
    ...options
  });
  if (!res.ok) {
    let message = `API error: ${res.status}`;
    try {
      const body = await res.json();
      message = body?.detail || message;
    } catch (_) {}
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

/* ── API METHODS ── */
const API = {

  /* Stats */
  getStats:        () => USE_MOCK ? Promise.resolve(MOCK.stats)        : apiFetch('/stats'),

  /* Hero */
  getHero:         () => USE_MOCK ? Promise.resolve(MOCK.hero)         : apiFetch('/admin/hero'),
  updateHero: (data) => USE_MOCK ? Promise.resolve({...MOCK.hero,...data}) : apiFetch('/admin/hero', {method:'PUT', body:JSON.stringify(data)}),
  uploadHeroMedia: (file, kind) => {
    if (USE_MOCK) {
      const fallback = kind === 'hero_video' ? 'assets/videos/hero-section-video.mp4' : 'assets/images/hero-poster.jpg';
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
  getBatches:      ()     => USE_MOCK ? Promise.resolve([...MOCK.batches])          : apiFetch('/admin/batches'),
  createBatch: (data)     => USE_MOCK ? Promise.resolve({id:Date.now(),...data})    : apiFetch('/admin/batches', {method:'POST',body:JSON.stringify(data)}),
  updateBatch: (id, data) => USE_MOCK ? Promise.resolve({id,...data})               : apiFetch(`/admin/batches/${id}`, {method:'PUT',body:JSON.stringify(data)}),
  deleteBatch: (id)       => USE_MOCK ? Promise.resolve({success:true})             : apiFetch(`/admin/batches/${id}`, {method:'DELETE'}),

  /* Faculty */
  getFaculty:      ()     => USE_MOCK ? Promise.resolve([...MOCK.faculty])          : apiFetch('/admin/faculty'),
  createFaculty: (data)   => USE_MOCK ? Promise.resolve({id:Date.now(),...data})    : apiFetch('/admin/faculty', {method:'POST',body:JSON.stringify(data)}),
  updateFaculty: (id,data)=> USE_MOCK ? Promise.resolve({id,...data})               : apiFetch(`/admin/faculty/${id}`, {method:'PUT',body:JSON.stringify(data)}),
  deleteFaculty: (id)     => USE_MOCK ? Promise.resolve({success:true})             : apiFetch(`/admin/faculty/${id}`, {method:'DELETE'}),

  /* Gallery */
  getGallery:      ()     => USE_MOCK ? Promise.resolve([...MOCK.gallery])          : apiFetch('/admin/gallery'),
  createGalleryItem:(data)=> USE_MOCK ? Promise.resolve({id:Date.now(),...data})    : apiFetch('/admin/gallery', {method:'POST',body:JSON.stringify(data)}),
  updateGalleryItem:(id,data)=> USE_MOCK ? Promise.resolve({id,...data})            : apiFetch(`/admin/gallery/${id}`, {method:'PUT',body:JSON.stringify(data)}),
  deleteGalleryItem:(id)  => USE_MOCK ? Promise.resolve({success:true})             : apiFetch(`/admin/gallery/${id}`, {method:'DELETE'}),

  /* Blog */
  getPosts:        ()     => USE_MOCK ? Promise.resolve([...MOCK.blog])             : apiFetch('/admin/blog'),
  createPost: (data)      => USE_MOCK ? Promise.resolve({id:Date.now(),...data})    : apiFetch('/admin/blog', {method:'POST',body:JSON.stringify(data)}),
  updatePost: (id,data)   => USE_MOCK ? Promise.resolve({id,...data})               : apiFetch(`/admin/blog/${id}`, {method:'PUT',body:JSON.stringify(data)}),
  deletePost: (id)        => USE_MOCK ? Promise.resolve({success:true})             : apiFetch(`/admin/blog/${id}`, {method:'DELETE'}),

  /* Testimonials */
  getTestimonials: ()     => USE_MOCK ? Promise.resolve([...MOCK.testimonials])     : apiFetch('/testimonials'),
  createTestimonial:(data)=> USE_MOCK ? Promise.resolve({id:Date.now(),...data})    : apiFetch('/testimonials', {method:'POST',body:JSON.stringify(data)}),
  updateTestimonial:(id,data)=>USE_MOCK? Promise.resolve({id,...data})              : apiFetch(`/testimonials/${id}`, {method:'PUT',body:JSON.stringify(data)}),
  deleteTestimonial:(id)  => USE_MOCK ? Promise.resolve({success:true})             : apiFetch(`/testimonials/${id}`, {method:'DELETE'}),

  /* Enquiries */
  getEnquiries:    ()     => USE_MOCK ? Promise.resolve([...MOCK.enquiries])        : apiFetch('/enquiries'),
  updateEnquiry: (id,data)=> USE_MOCK ? Promise.resolve({id,...data})               : apiFetch(`/enquiries/${id}`, {method:'PUT',body:JSON.stringify(data)}),
  deleteEnquiry: (id)     => USE_MOCK ? Promise.resolve({success:true})             : apiFetch(`/enquiries/${id}`, {method:'DELETE'}),

  /* Settings */
  getSettings:     ()     => USE_MOCK ? Promise.resolve({...MOCK.settings})         : apiFetch('/admin/settings'),
  updateSettings: (data)  => USE_MOCK ? Promise.resolve({...MOCK.settings,...data}) : apiFetch('/admin/settings', {method:'PUT',body:JSON.stringify(data)}),
};
