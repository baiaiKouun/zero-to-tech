<script setup>
import { onMounted, ref } from "vue";
import { animate, stagger } from "animejs";
import Nav from "../components/Nav.vue";
import { home } from "../../data/site.js";

const data = ref(home);
const grid = ref(null);
const apiBase = import.meta.env.VITE_API_BASE_URL || "";

onMounted(async () => {
  animate(grid.value.querySelectorAll(".card"), {
    opacity: [0, 1],
    translateY: [24, 0],
    delay: stagger(120),
    duration: 700,
    ease: "outBack",
  });

  try {
    const response = await fetch(`${apiBase}/api/profile`);
    if (!response.ok) {
      throw new Error(`主页数据加载失败：${response.status}`);
    }
    data.value = await response.json();
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <section ref="grid" class="dashboard-grid">
    <article class="hero-stage panel-full">
      <Nav />
      <div class="hero-copy">
        <h1 class="hero-display">{{ data.heroTitle }}</h1>
        <p class="hero-subtitle">{{ data.heroSubtitle }}</p>
      </div>
    </article>

    <article class="panel panel-full featured-work-panel card">
      <p class="section-kicker">{{ data.featuredWork.kicker }}</p>
      <p class="featured-title">{{ data.featuredWork.title }}</p>
      <p class="featured-copy">{{ data.featuredWork.copy }}</p>
      <RouterLink class="featured-link" to="/text-lab">
        <span class="featured-link-label">
          {{ data.featuredWork.linkLabel }}
        </span>
        <span class="arrow">›</span>
      </RouterLink>
    </article>

    <article class="panel panel-full identity-panel card">
      <div class="identity-item">
        <p class="section-kicker">座右铭</p>
        <p class="identity-value identity-quote">{{ data.identity.motto }}</p>
      </div>
      <div class="identity-item">
        <p class="section-kicker">正在学习</p>
        <p class="identity-value">{{ data.identity.learning }}</p>
      </div>
    </article>
  </section>
</template>