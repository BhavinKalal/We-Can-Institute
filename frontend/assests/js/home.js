/* =========================
   HOME PAGE SCRIPT
========================= */

async function loadHomeData() {
  const data = await API.get("/home");

  // Hero text
  document.querySelectorAll("[data-text]").forEach(el => {
    const key = el.getAttribute("data-text");
    el.innerText = data.texts[key] || "";
  });

  // Sections
  renderWhyUs(data.why_us);
  renderBatches(data.batches);
  renderTestimonials(data.testimonials);
}

function renderWhyUs(items) {
  const container = document.getElementById("why-us");
  container.innerHTML = "";
  items.forEach(text => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${text}</h3>`;
    container.appendChild(card);
  });
}

function renderBatches(batches) {
  const container = document.getElementById("batches");
  container.innerHTML = "";
  batches.forEach(batch => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${batch.name}</h3>
      <p>${batch.level}</p>
      <a class="btn btn-outline">View Details</a>
    `;
    container.appendChild(card);
  });
}

function renderTestimonials(items) {
  const container = document.getElementById("testimonials");
  container.innerHTML = "";
  items.forEach(t => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <p>"${t.text}"</p>
      <strong>- ${t.name}</strong>
    `;
    container.appendChild(card);
  });
}

/* INITIAL LOAD */
loadHomeData();