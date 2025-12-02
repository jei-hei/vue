import { createRouter, createWebHistory } from "vue-router";
import api from "@/services/api";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
  { path: "/dashboard", component: DashboardView, meta: { requiresAuth: true } },
  { path: "/admin-dashboard", component: AdminDashboard, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

let authVerified = false;

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) return next();

  const token = localStorage.getItem("token");
  if (!token) return next("/login");

  if (authVerified) return next();

  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  try {
    // verify token by calling /me
    await api.get("/me");
    authVerified = true;
    return next();
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    return next("/login");
  }
});

export default router;