import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token automatically if it exists (use the same key backend returns)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Clear local auth state on 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];
    }
    return Promise.reject(error);
  }
);

// --- AUTH helpers ---
export async function login(payload) {
  // Ensure no stale token is attached to the login request
  localStorage.removeItem("access_token");
  delete api.defaults.headers.common["Authorization"];

  const res = await api.post("/login", payload);
  const data = res.data || {};

  // backend returns access_token
  const token = data.access_token || data.token || null;
  if (token) {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(data.user || {}));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return data;
}

export async function logout() {
  try {
    const res = await api.post("/logout");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    return res.data;
  } catch (err) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    throw err;
  }
}

// --- API helpers ---
export async function getTotals() {
  const res = await api.get("/dashboard/stats");
  return res.data;
}

export async function getApplicantsPerScholarship() {
  const res = await api.get("/dashboard/applicants-per-scholarship");
  return res.data;
}

export async function getStatusDistribution() {
  const res = await api.get("/dashboard/status-distribution");
  return res.data;
}

export async function getScholarships() {
  const res = await api.get("/scholarships");
  return res.data;
}

export async function getMyApplications() {
  const res = await api.get("/my-applications");
  return res.data;
}

export async function applyScholarship(scholarship_id) {
  const res = await api.post("/apply", { scholarship_id });
  return res.data;
}

export async function removeApplication(appId) {
  const res = await api.delete(`/remove-application/${appId}`);
  return res.data;
}

export async function getProfile() {
  const res = await api.get("/profile");
  return res.data;
}

export async function getNotifications() {
  const res = await api.get("/notifications");
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.notifications)) return data.notifications;
  if (data.notification) return [data.notification];
  return [];
}

export async function getUnreadNotifCount() {
  const res = await api.get("/notifications/unread-count");
  return res.data;
}

export async function markNotifRead(id) {
  const res = await api.post(`/notifications/${id}/read`);
  return res.data;
}

export async function adminGetAllApplications() {
  const res = await api.get("/admin/applications");
  return res.data;
}

export async function adminApproveApplication(appId) {
  const res = await api.post(`/admin/applications/${appId}/approve`);
  return res.data;
}

export async function adminRejectApplication(appId) {
  const res = await api.post(`/admin/applications/${appId}/reject`);
  return res.data;
}

export default api;