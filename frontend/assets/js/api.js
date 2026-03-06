/* =========================
   API FETCH WRAPPER
========================= */

async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API Error");
    }

    return await response.json();
  } catch (err) {
    console.error("API ERROR:", err.message);
    throw err;
  }
}

/* Convenience methods */
const API = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};