<script setup lang="ts">
import { onMounted, ref } from "vue";
import { home, type HomeContent } from "../data/site";

const data = ref<HomeContent>(home);
const apiBase = import.meta.env.VITE_API_BASE_URL || "";

onMounted(async () => {
  try {
    const response = await fetch(`${apiBase}/api/profile`);
    if (response.ok) {
      data.value = (await response.json()) as HomeContent;
    }
  } catch (error: unknown) {
    console.error(error);
  }
});
</script>

<template>
  <div class="flex h-full w-full flex-col justify-between gap-3 overflow-hidden select-text sm:gap-4 md:gap-5">
    <!-- 头部 Banner -->
    <div class="flex shrink-0 items-baseline justify-between border-b border-black/15 pb-2">
      <div>
        <h1 class="text-base font-bold tracking-tight text-black sm:text-lg md:text-xl">
          {{ data.heroTitle }}
        </h1>
        <p class="mt-1 font-mono text-xs text-black/70 sm:text-sm">
          {{ data.heroSubtitle }}
        </p>
      </div>
    </div>

    <!-- 主体卡片网格：充满剩余高度，高度与文字实验室严格一致 -->
    <div class="grid min-h-0 flex-1 grid-cols-12 items-stretch gap-3 sm:gap-4 md:gap-5">
      <!-- 卡片 1: 核心作品 (占 6 列) -->
      <article
        class="col-span-12 flex h-full flex-col justify-between rounded-lg border border-black/25 bg-[#f3f4f1] p-4 shadow-[2px_2px_0px_rgba(0,0,0,0.12)] transition-all hover:border-black/50 sm:p-5 md:col-span-6"
      >
        <div>
          <div class="flex items-center justify-between font-mono text-[11px] text-black/60">
            <span>[ 01: {{ data.featuredWork.kicker }} ]</span>
          </div>
          <h2 class="mt-2 text-xl font-bold tracking-tight text-black sm:text-2xl md:text-3xl">
            {{ data.featuredWork.title }}
          </h2>
          <p class="mt-2 text-xs leading-relaxed text-black/75 sm:text-sm">
            {{ data.featuredWork.copy }}
          </p>
        </div>
      </article>

      <!-- 卡片 2 & 3: 右侧纵列 (占 6 列) -->
      <div class="col-span-12 flex h-full flex-col justify-between gap-3 sm:gap-4 md:gap-5 md:col-span-6">
        <!-- 卡片 2: 座右铭 -->
        <article
          class="flex flex-1 flex-col justify-between rounded-lg border border-black/25 bg-[#f3f4f1] p-3.5 shadow-[2px_2px_0px_rgba(0,0,0,0.12)] sm:p-4"
        >
          <div class="flex items-center justify-between font-mono text-[11px] text-black/60">
            <span>[ 02: 座右铭 ]</span>
          </div>
          <p class="my-1.5 text-base font-semibold tracking-tight text-black sm:text-lg md:text-xl">
            “{{ data.identity.motto }}”
          </p>
        </article>

        <!-- 卡片 3: 学习方向 -->
        <article
          class="flex flex-1 flex-col justify-between rounded-lg border border-black/25 bg-[#f3f4f1] p-3.5 shadow-[2px_2px_0px_rgba(0,0,0,0.12)] sm:p-4"
        >
          <div class="flex items-center justify-between font-mono text-[11px] text-black/60">
            <span>[ 03: 学习方向 ]</span>
          </div>
          <p class="my-1.5 text-xl font-bold tracking-tight text-black sm:text-2xl md:text-3xl">
            {{ data.identity.learning }}
          </p>
        </article>
      </div>
    </div>
  </div>
</template>
