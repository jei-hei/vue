<template>
  <div class="login-page">
    <div class="login-card" role="main" aria-labelledby="login-heading">
      <div class="login-header">
        <h1 id="login-heading">SCHOLARSHIP<br />TRACKER</h1>
        <p>Log in to your account</p>
      </div>

      <!-- Role selector -->
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

      <!-- Campus selector (only for students) -->
      <div v-if="role === 'student'" class="campus-box" aria-label="Select campus">
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

      <!-- Username -->
      <label class="label" for="username">Username</label>
      <input
        id="username"
        class="input"
        v-model="username"
        placeholder="Enter your username"
        autocomplete="username"
        @keyup.enter="doLogin"
      />

      <!-- Password -->
      <label class="label" for="password">Password</label>
      <input
        id="password"
        class="input"
        type="password"
        v-model="password"
        placeholder="Enter your password"
        autocomplete="current-password"
        @keyup.enter="doLogin"
      />

      <!-- Inline error -->
      <p v-if="error" class="error">{{ error }}</p>

      <button
        class="login-btn"
        :disabled="loading"
        @click="doLogin"
        aria-busy="loading"
      >
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
      roles: ["admin", "student"],
      role: "admin",
      campuses: ["Echague", "Angadanan", "Jones", "Santiago"],
      campus: "Echague",
      username: "",
      password: "",
      loading: false,
      error: null,
    };
  },
  methods: {
    capitalize(s) {
      if (!s) return s;
      return s.charAt(0).toUpperCase() + s.slice(1);
    },

    async doLogin() {
      this.error = null;
      this.loading = true;

      try {
        // Clear stale token so login request is clean
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];

        // Build payload according to backend expectations
        const payload = {
          username: (this.username || "").trim(),
          password: this.password || "",
        };

        // campus is required for student, optional for admin
        if (this.role === "student") {
          payload.campus = this.campus;
        }

        // Basic client-side validation
        if (!payload.username) {
          this.error = "Please enter your username";
          throw new Error(this.error);
        }
        if (!payload.password) {
          this.error = "Please enter your password";
          throw new Error(this.error);
        }
        if (this.role === "student" && !payload.campus) {
          this.error = "Please select your campus";
          throw new Error(this.error);
        }

        // Call centralized login helper
        const data = await apiLogin(payload);

        // backend returns token and role (token key is `token` per your backend)
        const token = data?.token || null;
        if (!token) {
          const msg = data?.message || "Login failed: no token returned";
          this.error = msg;
          throw new Error(msg);
        }

        // Persist token and user and set axios header
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Navigate based on role returned by backend (data.role)
        const returnedRole = (data.role || "").toLowerCase();
        if (returnedRole === "admin") {
          await this.$router.replace("/admin-dashboard");
        } else {
          await this.$router.replace("/dashboard");
        }
      } catch (e) {
        // Prefer server message when available
        if (e.response && e.response.data) {
          this.error = e.response.data.message || this.error || "Login failed";
        } else {
          this.error = this.error || e.message || "Login failed";
        }
        console.error("Login error:", e);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    const token = localStorage.getItem("token");
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
.error {
  color: #ffb4b4;
  background: #3a1f1f;
  padding: 8px 10px;
  border-radius: 6px;
  margin: 8px 0;
  font-size: 13px;
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