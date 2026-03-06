/* =========================
   GLOBAL COMPONENT LOADER
========================= */

/**
 * Detect base path depending on page location
 * - pages/*.html  -> ".."
 * - index.html    -> "."
 */
function getBasePath() {
  const path = window.location.pathname;
  return path.includes("/pages/") ? ".." : ".";
}

/**
 * Load HTML component into selector
 */
async function loadComponent(selector, componentFile) {
  const container = document.querySelector(selector);
  if (!container) return;

  try {
    const basePath = getBasePath();
    const response = await fetch(
      `${basePath}/components/${componentFile}`
    );

    if (!response.ok) {
      throw new Error(`Failed to load ${componentFile}`);
    }

    container.innerHTML = await response.text();
  } catch (error) {
    console.error(error.message);
  }
}

/**
 * Load global components on every page
 */
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("#navbar", "navbar.html");
  loadComponent("#footer", "footer.html");
});

/**
 * Mobile menu toggle (delegated)
 */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("menu-toggle")) {
    const nav = document.querySelector(".nav-links");
    if (nav) nav.classList.toggle("active");
  }
});