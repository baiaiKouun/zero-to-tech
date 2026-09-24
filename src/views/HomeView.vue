<script setup lang="ts">
import { onMounted, ref } from "vue";
import { animate, stagger } from "animejs";
import Nav from "../components/Nav.vue";
import { home, type HomeContent } from "../data/site";

const data = ref<HomeContent>(home);
const grid = ref<HTMLElement | null>(null);
const apiBase = import.meta.env.VITE_API_BASE_URL || "";

onMounted(async () => {
  if (grid.value) {
    animate(grid.value.querySelectorAll("[data-card]"), {
      opacity: [0, 1],
      translateY: [24, 0],
      delay: stagger(120),
      duration: 700,
      ease: "outBack",
    });
  }

  try {
    const response = await fetch(`${apiBase}/api/profile`);
    if (!response.ok) {
      throw new Error(`主页数据加载失败：${response.status}`);
    }
    data.value = (await response.json()) as HomeContent;
  } catch (error: unknown) {
    console.error(error);
  }
});
</script>

<template>
  <section ref="grid" class="grid grid-cols-12 gap-[18px]">
    <article
      class="col-span-12 grid min-h-[36vh] content-center px-0 py-2 pb-[18px] max-[640px]:min-h-0 max-[640px]:py-3 max-[640px]:pb-5"
    >
      <Nav />
      <div class="max-w-[620px]">
        <h1
          class="bg-gradient-to-br from-[#ff00f7] to-[#1e98fd] bg-clip-text text-[clamp(56px,10vw,96px)] font-semibold leading-[1.04] tracking-[-0.06em] text-transparent max-[640px]:text-5xl"
        >
          {{ data.heroTitle }}
        </h1>
        <p
          class="mt-2.5 max-w-[540px] text-[clamp(18px,2.2vw,24px)] leading-[1.28] tracking-[-0.02em] text-black/[0.72] max-[640px]:mt-3.5 max-[640px]:text-lg"
        >
          {{ data.heroSubtitle }}
        </p>
      </div>
    </article>

    <article
      data-card
      class="col-span-12 grid min-h-[220px] content-center gap-2 rounded-[32px] bg-white px-7 py-7 opacity-0 shadow-[3px_5px_30px_rgba(0,0,0,0.08)] translate-y-6 max-[640px]:rounded-3xl max-[640px]:px-5 max-[640px]:py-5"
    >
      <p class="mb-3 text-xs font-semibold leading-[1.33] tracking-[-0.0075em] text-black/[0.56]">
        {{ data.featuredWork.kicker }}
      </p>
      <p
        class="max-w-[720px] text-[clamp(34px,4.2vw,52px)] font-semibold leading-[1.04] tracking-[-0.05em] max-[640px]:text-2xl"
      >
        {{ data.featuredWork.title }}
      </p>
      <p
        class="max-w-[520px] text-[clamp(17px,2vw,21px)] leading-[1.28] tracking-[-0.02em] text-black/[0.72]"
      >
        {{ data.featuredWork.copy }}
      </p>
      <RouterLink
        class="mt-1.5 inline-flex w-fit items-center gap-2.5 transition-opacity duration-200 hover:opacity-[0.86]"
        to="/text-lab"
      >
        <span class="text-[17px] leading-[1.47] tracking-[-0.023em] text-[#0071e3]">
          {{ data.featuredWork.linkLabel }}
        </span>
        <span class="text-[28px] leading-none text-[#0071e3]">›</span>
      </RouterLink>
    </article>

    <article
      data-card
      class="col-span-12 grid grid-cols-2 items-start gap-6 rounded-[32px] bg-white px-7 py-5 opacity-0 shadow-[3px_5px_30px_rgba(0,0,0,0.08)] translate-y-6 max-[834px]:grid-cols-1 max-[640px]:rounded-3xl max-[640px]:px-5"
    >
      <div class="pt-1">
        <p class="mb-3 text-xs font-semibold leading-[1.33] tracking-[-0.0075em] text-black/[0.56]">
          座右铭
        </p>
        <p
          class="max-w-[520px] text-[clamp(20px,2.2vw,28px)] font-medium leading-[1.4] tracking-[-0.02em]"
        >
          {{ data.identity.motto }}
        </p>
      </div>
      <div class="pt-1">
        <p class="mb-3 text-xs font-semibold leading-[1.33] tracking-[-0.0075em] text-black/[0.56]">
          正在学习
        </p>
        <p
          class="text-[clamp(24px,3vw,32px)] font-semibold leading-[1.12] tracking-[-0.04em] max-[640px]:text-2xl"
        >
          {{ data.identity.learning }}
        </p>
      </div>
    </article>
  </section>
</template>
