/* =========================
   BATCHES PAGE SCRIPT
   (Backend Ready)
========================= */

document.addEventListener("DOMContentLoaded", () => {
  renderBatches();
});

function renderBatches() {
  const container = document.getElementById("batch-list");
  if (!container) return;

  // TEMP static data
  // Later: fetch('/api/batches')
  const batches = [
    {
      level: "Beginner",
      title: "Pre-Basic Batch",
      duration: "1 Year",
      desc:
        "Designed for beginners. Students learn basic vocabulary, spellings practice, simple sentence formation, daily conversation, and grammar basics."
    },
    {
      level: "Foundation",
      title: "Basic Batch",
      duration: "1 Year",
      desc:
        "This batch strengthens grammar rules, spelling improvement, sentence structure, reading, writing skills, and spoken English practice."
    },
    {
      level: "Intermediate",
      title: "Pre-Intermediate Batch",
      duration: "1 Year",
      desc:
        "Students improve fluency, expand vocabulary, advanced grammar concepts, real-life conversations, public speaking basics, and stage confidence."
    },
    {
      level: "Advanced",
      title: "Intermediate Batch (Advanced Level)",
      duration: "1 Year",
      desc:
        "Focuses on professional communication, advanced public speaking, debates, interviews, group discussions, presentation mastery, and personality development."
    }
  ];

  container.innerHTML = "";

  batches.forEach(batch => {
    const card = document.createElement("div");
    card.className = "batch-card";

    card.innerHTML = `
      <span class="batch-level">${batch.level}</span>
      <h3>${batch.title}</h3>
      <p class="batch-desc">${batch.desc}</p>
      <div class="batch-footer">
        <span class="batch-duration">Duration: ${batch.duration}</span>
        <a class="btn btn-outline">Enquire Now</a>
      </div>
    `;

    container.appendChild(card);
  });
}