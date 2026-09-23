import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import TextLabView from "./views/TextLabView.vue";

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: HomeView },
    { path: "/text-lab", component: TextLabView },
  ],
});