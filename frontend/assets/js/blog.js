/* =========================
   BLOG LISTING SCRIPT
========================= */

async function loadBlogs() {
  const blogs = await API.get("/blogs");
  renderBlogs(blogs);
}

function renderBlogs(blogs) {
  const container = document.getElementById("blog-list");
  container.innerHTML = "";

  blogs.forEach(blog => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${blog.title}</h3>
      <p>${blog.excerpt}</p>
      <a class="btn btn-outline" href="blog-detail.html?slug=${blog.slug}">
        Read More
      </a>
    `;

    container.appendChild(card);
  });
}

loadBlogs();