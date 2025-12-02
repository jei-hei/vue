<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>SCHOLARSHIP<br />TRACKER</h1>
        <p>Log in to your account</p>
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

      <label class="label">ID Number</label>
      <input
        class="input"
        v-model="username"
        placeholder="Enter your ID Number"
      />

      <label class="label">LRN</label>
      <input
        class="input"
        type="password"
        v-model="password"
        placeholder="Enter last 4 digits of LRN"
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
import { login } from "@/services/api";

export default {
  name: "LoginView",
  data() {
    return {
      campuses: ["Echague", "Angadanan", "Jones", "Santiago"],
      campus: "Echague",
      username: "",
      password: "",
      loading: false,
    };
  },
  methods: {
   async doLogin() {
  this.loading = true;
  try {
    const data = await login({
      username: this.username,
      password: this.password,
      campus: this.campus,
    });

    if (data?.status === "success") {
      localStorage.clear();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user || {}));
      localStorage.setItem(
        "student_name",
        data.user?.full_name || data.user?.username || "Student"
      );

      const role = (data.role || data.user?.role || "").toLowerCase();

      if (role === "admin") {
        this.$router.push("/admin-dashboard");
      } else {
        this.$router.push("/dashboard");
      }
    } else {
      alert(data?.message || "Login failed");
    }
  } catch (e) {
    console.error(e);
    alert("Login failed");
  } finally {
    this.loading = false;
  }
}
  }
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
