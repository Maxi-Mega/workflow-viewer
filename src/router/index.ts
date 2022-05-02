import { createRouter, createWebHistory } from "vue-router";
import WorkflowView from "../components/WorkflowBoard.vue";
import { getEnv } from "@/env";

const router = createRouter({
  history: createWebHistory(getEnv().BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: WorkflowView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
