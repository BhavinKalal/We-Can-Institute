/* =========================
   BLOG DETAIL SCRIPT
========================= */

function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

async function loadBlogDetail() {
  const slug = getSlug();
  if (!slug) return;

  const blog = await API.get(`/blogs/${slug}`);
  renderBlog(blog);
}

function renderBlog(blog) {
  const container = document.getElementById("blog-detail");

  container.innerHTML = `
    <h1>${blog.title}</h1>
    <p><em>${blog.created_at}</em></p>
    <div>${blog.content}</div>
  `;
}

loadBlogDetail();