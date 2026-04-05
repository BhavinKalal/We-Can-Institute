/* ============================================================
   API.JS — Frontend Data Fetching
   WE CAN Institute of English
   ============================================================ */

function resolveFrontendApiBaseUrl() {
  const explicit = window.WECAN_API_BASE_URL || document.documentElement?.dataset?.apiBaseUrl;
  if (explicit) return explicit.replace(/\/$/, '');

  const { protocol, hostname, origin } = window.location;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  if (isLocal) return `${protocol}//localhost:8000/api/v1`;
  return `${origin}/api/v1`;
}

const BASE_URL = resolveFrontendApiBaseUrl();

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

async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  if (!res.ok) {
    let message = `API error: ${res.status}`;
    try {
      const body = await res.json();
      message = extractApiErrorMessage(body, message);
    } catch (_) {}
    throw new Error(message);
  }
  return res.json();
}

const API = {
  getHomepageData: () => apiFetch('/public/homepage'),
  submitEnquiry: (data) => apiFetch('/public/enquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
