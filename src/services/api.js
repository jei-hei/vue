import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8003/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// attach token automatically if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- AUTH ---
export async function login(payload) {
  const res = await api.post("/login", payload);
  return res.data;
}

export async function logout() {
  const res = await api.post("/logout");
  return res.data;
}

// --- DASHBOARD DATA ---
export async function getTotals() {
  const res = await api.get("/dashboard/stats");
  return res.data;
}

// --- CHARTS ---
export async function getApplicantsPerScholarship() {
  const res = await api.get("/dashboard/applicants-per-scholarship");
  return res.data;
}

export async function getStatusDistribution() {
  const res = await api.get("/dashboard/status-distribution");
  return res.data;
}

// --- ENLIST ---
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

// --- PROFILE ---
export async function getProfile() {
  const res = await api.get("/profile");
  return res.data;
}

// --- NOTIFICATIONS ---
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

// must match backend method (POST unless you change api.php)
export async function markNotifRead(id) {
  const res = await api.post(`/notifications/${id}/read`);
  return res.data;
}

// --- ADMIN APPLICATIONS ---
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
