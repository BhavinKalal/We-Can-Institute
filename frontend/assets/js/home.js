/* =========================
   HOME PAGE SCRIPT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  renderWhyUs();
  renderLearningJourney();
  renderTestimonials();
});

/* =========================
   WHY CHOOSE US
========================= */
function renderWhyUs() {
  const container = document.getElementById("why-us");
  if (!container) return;

  const items = [
    {
      icon: "🎓",
      title: "Expert Trainers",
      desc: "Learn from certified and experienced English trainers."
    },
    {
      icon: "🗣",
      title: "Spoken English Focus",
      desc: "Daily speaking practice for real-life confidence."
    },
    {
      icon: "🧠",
      title: "Personality Development",
      desc: "Improve confidence, communication, and presentation skills."
    },
    {
      icon: "🎯",
      title: "Practical Learning",
      desc: "Role plays, group discussions, and real-world activities."
    }
  ];

  container.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "why-card";
    card.innerHTML = `
      <div class="why-icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    `;
    container.appendChild(card);
  });
}

/* =========================
   LEARNING JOURNEY (TIMELINE)
========================= */
function renderLearningJourney() {
  const container = document.getElementById("batches");
  if (!container) return;

  const steps = [
    {
      step: "01",
      title: "Foundation Level",
      desc: "Basic grammar, vocabulary, and sentence structure."
    },
    {
      step: "02",
      title: "Spoken English",
      desc: "Daily speaking practice and pronunciation improvement."
    },
    {
      step: "03",
      title: "Advanced Communication",
      desc: "Fluency, public speaking, and confidence building."
    },
    {
      step: "04",
      title: "Confident Speaker",
      desc: "Interviews, presentations, and real-life conversations."
    }
  ];

  container.className = "learning-timeline";
  container.innerHTML = "";

  steps.forEach(item => {
    const stepEl = document.createElement("div");
    stepEl.className = "timeline-step";

    stepEl.innerHTML = `
      <div class="timeline-dot">${item.step}</div>
      <div class="timeline-content">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </div>
    `;

    container.appendChild(stepEl);
  });
}

/* =========================
   TESTIMONIALS – SUMMARY ONLY
========================= */
function renderTestimonials() {
  const container = document.getElementById("testimonials");
  if (!container) return;

  const data = [
    {
      summary:
        "Despite being a Gujarati medium student, my daughter now speaks and writes English confidently.",
      name: "Dhavalbhai Patel",
      role: "Director, Tapovan Vidhya Mandir Sankul"
    },
    {
      summary:
        "My daughter has gained remarkable confidence and fluency in English within just six months.",
      name: "Dr. Hiren Patel",
      role: "Section Officer, Finance Department"
    },
    {
      summary:
        "Exceptional teaching methods helped my child overcome hesitation and speak confidently.",
      name: "Nirav Shah",
      role: "Ariha Developer"
    }
  ];

  container.innerHTML = "";

  data.forEach(item => {
    const block = document.createElement("div");
    block.className = "testimonial-item";

    block.innerHTML = `
      <span class="testimonial-tag">Parent Feedback</span>
      <p class="testimonial-summary">"${item.summary}"</p>
      <div class="testimonial-author">
        <strong>${item.name}</strong>
        <span>${item.role}</span>
      </div>
    `;

    container.appendChild(block);
  });
}