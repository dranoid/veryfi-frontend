import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import axiosInstance from "./api/axios";
import { authService } from "./services/auth.service";

const app = createApp(App);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      authService.clearUser();
      localStorage.removeItem("auth-token");
      router.push("/login"); // Use the router instance from here
    }
    return Promise.reject(error);
  }
);
app.use(router);
app.mount("#app");
