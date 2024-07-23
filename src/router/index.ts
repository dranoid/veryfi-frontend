import { createRouter, createWebHistory } from "vue-router";
import { authService } from "../services/auth.service";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/SignUp.vue"),
  },
  {
    path: "/",
    name: "verify",
    component: () => import("../views/Verify.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.path === "/" && !authService.isLoggedIn()) {
//     next("/login");
//   } else {
//     next();
//   }
// });

export default router;
