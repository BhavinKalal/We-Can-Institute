async function loadComponent(selector, file) {
  const el = document.querySelector(selector);
  if (!el) return;

  const res = await fetch(file);
  el.innerHTML = await res.text();
}

/* Load global components */
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("#navbar", "../components/navbar.html");
  loadComponent("#footer", "../components/footer.html");
});

/* Mobile menu toggle */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("menu-toggle")) {
    document.querySelector(".nav-links").classList.toggle("active");
  }
});