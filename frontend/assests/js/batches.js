/* =========================
   BATCHES PAGE SCRIPT
========================= */

async function loadBatches() {
  const data = await API.get("/batches");

  renderBatches(data);
}

function renderBatches(batches) {
  const container = document.getElementById("batch-list");
  container.innerHTML = "";

  batches.forEach((batch, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${batch.name}</h3>
      <p>${batch.description}</p>

      <p><strong>Duration:</strong> ${batch.duration}</p>

      <div class="actions">
        <a class="btn btn-outline">View Details</a>
      </div>
    `;

    container.appendChild(card);
  });
}

loadBatches();