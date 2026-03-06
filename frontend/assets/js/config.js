/* =========================
   GLOBAL CONFIG
========================= */

const ENV = {
  development: {
    API_BASE_URL: "http://localhost:8000/api",
  },
  production: {
    API_BASE_URL: "https://api.wecanenglish.com/api",
  },
};

// Change ONLY this when deploying
const CURRENT_ENV = "development";

const CONFIG = ENV[CURRENT_ENV];