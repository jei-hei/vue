import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token automatically if it exists (backend returns `token`)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Clear local auth state on 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];
    }
    return Promise.reject(error);
  }
);

// --- AUTH helpers ---
export async function login(payload) {
  // Remove stale token so login request is clean
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];

  const res = await api.post("/login", payload);
  const data = res.data || {};

  // backend returns `token`
  const token = data.token || null;
  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(data.user || {}));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return data;
}

export async function logout() {
  try {
    const res = await api.post("/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    return res.data;
  } catch (err) {
    // still clear local state on error
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    throw err;
  }
}

// --- PROTECTED API helpers (examples) ---
export async function getMe() {
  const res = await api.get("/me");
  return res.data;
}

export async function getProfile() {
  const res = await api.get("/profile");
  return res.data;
}

export async function getTotals() {
  const res = await api.get("/dashboard/stats");
  return res.data;
}

// ... other helpers (scholarships, notifications, admin endpoints) ...
export default api;