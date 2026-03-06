/* =========================
   GALLERY PAGE SCRIPT
========================= */

async function loadGallery() {
  const data = await API.get("/gallery");

  renderFilters(data.categories);
  renderImages(data.images);
}

/* FILTERS */
function renderFilters(categories) {
  const container = document.getElementById("gallery-filters");
  container.innerHTML = "";

  const allBtn = createFilterButton("All", "all");
  container.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = createFilterButton(cat.name, cat.id);
    container.appendChild(btn);
  });
}

function createFilterButton(label, categoryId) {
  const btn = document.createElement("button");
  btn.className = "filter-btn";
  btn.innerText = label;

  btn.onclick = () => filterImages(categoryId);
  return btn;
}

/* IMAGES */
let allImages = [];

function renderImages(images) {
  allImages = images;
  displayImages(images);
}

function displayImages(images) {
  const container = document.getElementById("gallery-grid");
  container.innerHTML = "";

  images.forEach(img => {
    const card = document.createElement("div");
    card.className = "card gallery-card";

    card.innerHTML = `
      <img src="${img.url}" alt="${img.caption || ''}" />
    `;

    container.appendChild(card);
  });
}

function filterImages(categoryId) {
  if (categoryId === "all") {
    displayImages(allImages);
  } else {
    const filtered = allImages.filter(img => img.category_id === categoryId);
    displayImages(filtered);
  }
}

/* INIT */
loadGallery();