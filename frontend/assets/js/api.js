/* ============================================================
   API.JS — Frontend Data Fetching
   WE CAN Institute of English
   ============================================================ */

const BASE_URL = 'http://localhost:8000/api/v1';

async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

const API = {
  getHomepageData: () => apiFetch('/public/homepage'),
  submitEnquiry: (data) => apiFetch('/public/enquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
