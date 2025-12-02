


import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import api from "@/services/api";

const app = createApp(App);

// set axios header from stored token on boot
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

app.use(router);
app.mount("#app");