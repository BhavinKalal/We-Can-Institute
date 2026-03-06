/* =========================
   CONTACT PAGE SCRIPT
========================= */

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusEl.innerText = "Submitting...";
  statusEl.style.color = "gray";

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    await API.post("/enquiry", payload);

    statusEl.innerText = "Thank you! We will contact you soon.";
    statusEl.style.color = "green";
    form.reset();
  } catch (err) {
    statusEl.innerText = "Something went wrong. Please try again.";
    statusEl.style.color = "red";
  }
});