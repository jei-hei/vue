<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>SCHOLARSHIP<br />TRACKER</h1>
        <p>Log in to your account</p>
      </div>

      <div class="campus-box" aria-label="Select role">
        <button
          v-for="r in roles"
          :key="r"
          type="button"
          class="campus-btn"
          :class="{ active: role === r }"
          @click="role = r"
        >
          {{ capitalize(r) }}
        </button>
      </div>

      <div class="campus-box">
        <button
          v-for="c in campuses"
          :key="c"
          type="button"
          class="campus-btn"
          :class="{ active: campus === c }"
          @click="campus = c"
        >
          {{ c }}
        </button>
      </div>

      <label v-if="role === 'student'" class="label" for="student_id">ID Number</label>
      <input
        v-if="role === 'student'"
        id="student_id"
        class="input"
        v-model="student_id"
        placeholder="Format 12-3456"
        autocomplete="username"
      />

      <label v-if="role === 'student'" class="label" for="lrn">LRN (required)</label>
      <input
        v-if="role === 'student'"
        id="lrn"
        class="input"
        type="password"
        v-model="lrn"
        placeholder="Enter full 12-digit LRN (numbers only)"
        autocomplete="off"
      />

      <label v-if="role === 'student'" class="label" for="password">Password (optional)</label>
      <input
        v-if="role === 'student'"
        id="password"
        class="input"
        type="password"
        v-model="password"
        placeholder="Enter your password (optional)"
        autocomplete="current-password"
      />

      <label v-if="role === 'admin'" class="label" for="email">Email</label>
      <input
        v-if="role === 'admin'"
        id="email"
        class="input"
        v-model="email"
        placeholder="Enter your email"
        autocomplete="username"
      />

      <label v-if="role === 'admin'" class="label" for="password_admin">Password</label>
      <input
        v-if="role === 'admin'"
        id="password_admin"
        class="input"
        type="password"
        v-model="password"
        placeholder="Enter your password"
        autocomplete="current-password"
      />

      <button class="login-btn" :disabled="loading" @click="doLogin">
        {{ loading ? "Logging in..." : "Login" }}
      </button>

      <p class="footer">
        Don't have an account?
        <a href="#">Contact ADMIN Building</a>
      </p>
    </div>
  </div>
</template>

<script>
import api, { login as apiLogin } from "@/services/api";

export default {
  name: "LoginView",
  data() {
    return {
      roles: ["student", "admin"],
      role: "student",
      campuses: ["Echague", "Angadanan", "Jones", "Santiago"],
      campus: "Echague",
      student_id: "",
      lrn: "",
      email: "",
      password: "",
      loading: false,
    };
  },
  methods: {
    capitalize(s) {
      if (!s) return s;
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    normalizeStudentId(raw) {
      return (raw || "").trim();
    },
    async doLogin() {
      this.loading = true;
      try {
        // Clear stale token so login request is clean
        localStorage.removeItem("access_token");
        delete api.defaults.headers.common["Authorization"];

        // Build payload
        const payload = { campus: this.campus, role: this.role };

        if (this.role === "student") {
          const studentId = this.normalizeStudentId(this.student_id);
          const lrn = (this.lrn || "").trim();
          const pwd = (this.password || "").trim();

          if (!studentId) throw new Error("Please enter your ID Number (format 12-3456)");
          if (!/^\d{2}-\d{4}$/.test(studentId)) throw new Error("ID Number must match format 12-3456");
          if (!lrn || !/^\d{12}$/.test(lrn)) throw new Error("Please enter a valid 12-digit LRN");

          payload.student_id = studentId;
          payload.lrn = lrn;
          if (pwd) payload.password = pwd;
        } else {
          const email = (this.email || "").trim().toLowerCase();
          const pwd = (this.password || "").trim();
          if (!email) throw new Error("Please enter your email");
          if (!pwd) throw new Error("Please enter your password");
          payload.email = email;
          payload.password = pwd;
        }

        // Call centralized login helper
        const data = await apiLogin(payload);

        const token = data?.access_token || data?.token || null;
        if (!token) throw new Error(data?.message || "Login failed: no token returned");

        // Ensure header and storage are set
        localStorage.setItem("access_token", token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Navigate
        const role = (data.user?.role || "").toLowerCase();
        const target = role === "admin" ? "/admin-dashboard" : "/dashboard";
        await this.$router.replace(target);
      } catch (e) {
        let msg = e.message || "Login failed";
        if (e.response) {
          if (e.response.status === 422 && e.response.data?.errors) {
            const errs = Object.values(e.response.data.errors).flat();
            msg = errs.join("; ");
          } else if (e.response.data?.message) {
            msg = e.response.data.message;
          } else {
            msg = `Server error (${e.response.status})`;
          }
        }
        console.error("Login error:", e);
        alert(msg);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    const token = localStorage.getItem("access_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #1f6a88;
  display: grid;
  place-items: center;
}
.login-card {
  width: 360px;
  background: #2c2c2c;
  border-radius: 12px;
  padding: 28px 26px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
  color: #fff;
}
.login-header h1 {
  text-align: center;
  color: #08a8ff;
  font-weight: 800;
  letter-spacing: 2px;
  margin: 0;
}
.login-header p {
  text-align: center;
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.9;
}
.campus-box {
  margin: 18px 0;
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
}
.campus-btn {
  border: none;
  padding: 8px 10px;
  font-weight: 700;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
}
.campus-btn.active {
  background: #08a8ff;
  color: #fff;
}
.label {
  font-weight: 700;
  font-size: 12px;
  margin-top: 8px;
  display: block;
}
.input {
  width: 93%;
  margin: 6px 0 10px;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1e1e1e;
  color: #fff;
}
.login-btn {
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #08a8ff;
  font-weight: 800;
  color: #fff;
  cursor: pointer;
}
.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.footer {
  text-align: center;
  margin-top: 18px;
  font-size: 12px;
}
.footer a {
  color: #08a8ff;
  text-decoration: none;
  font-weight: 700;
}
</style>