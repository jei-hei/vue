import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import AdminDashboard from "@/views/AdminDashboard.vue"; // ✅ match filename

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
  { path: "/dashboard", component: DashboardView, meta: { requiresAuth: true } },

  // ✅ admin route
  { path: "/admin-dashboard", component: AdminDashboard, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem("token")) {
    return next("/login");
  }
  next();
});

export default router;
