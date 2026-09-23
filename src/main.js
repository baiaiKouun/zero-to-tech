import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";

import "../css/reset.css";
import "../css/variables.css";
import "../css/layout.css";
import "../css/hero.css";
import "../css/nav.css";
import "../css/cards.css";
import "../css/lab.css";
import "../css/responsive.css";

createApp(App).use(router).mount("#app");