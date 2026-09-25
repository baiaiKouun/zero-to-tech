<script setup lang="ts">
import { ref } from "vue";
import LoadingScreen from "./components/LoadingScreen.vue";

const isLoading = ref(true);

const currentDate = (() => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y} · ${m} · ${day}`;
})();
</script>

<template>
  <LoadingScreen v-if="isLoading" @finish="isLoading = false" />

  <div
    class="fixed inset-0 z-0 flex h-screen w-screen select-none items-center justify-center overflow-hidden bg-[#101012] p-2 font-mono text-[#18181a] sm:p-4 md:p-5"
  >
    <!-- CRT 监视器外壳与主屏幕 -->
    <div
      class="crt-chassis relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[20px] border-[8px] border-[#222326] bg-[#dfdeda] p-3.5 shadow-[inset_0_0_50px_rgba(0,0,0,0.3),0_0_0_2px_#18191b,0_20px_50px_rgba(0,0,0,0.85)] sm:rounded-[30px] sm:border-[14px] sm:p-6 md:border-[18px] md:p-7"
    >
      <!-- 动态扫描线遮罩（柔和向下平移） -->
      <div class="crt-scanlines pointer-events-none absolute inset-0 z-20"></div>

      <!-- CRT 暗角与微曲面玻璃光影 -->
      <div class="crt-vignette pointer-events-none absolute inset-0 z-20"></div>

      <!-- 顶部 HUD 状态栏（保留左上角、右上角及横线） -->
      <header class="relative z-10 w-full shrink-0">
        <div
          class="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] font-medium tracking-wider text-black/75 sm:text-[13px] md:text-[14px]"
        >
          <div class="flex items-center gap-2 sm:gap-4">
            <span class="text-black">[baiaikouun's web v0.1]</span>
            <nav class="inline-flex items-center gap-1 text-xs sm:gap-1.5 sm:text-[13px]">
              <RouterLink
                to="/"
                class="rounded-[2px] px-1.5 py-0.5 text-black/60 transition-colors hover:text-black aria-[current=page]:bg-black aria-[current=page]:font-bold aria-[current=page]:text-white"
              >
                [ 01: 首页 ]
              </RouterLink>
              <RouterLink
                to="/text-lab"
                class="rounded-[2px] px-1.5 py-0.5 text-black/60 transition-colors hover:text-black aria-[current=page]:bg-black aria-[current=page]:font-bold aria-[current=page]:text-white"
              >
                [ 02: 文字实验室 ]
              </RouterLink>
            </nav>
          </div>
          <span>[SYSTEM · {{ currentDate }}]</span>
        </div>
        <div class="mt-2.5 w-full border-b border-dotted border-black/35 sm:mt-3"></div>
      </header>

      <!-- 中间内容区域：恰好占满剩余高度，无任何垂直滚动条 -->
      <main class="relative z-10 flex min-h-0 flex-1 flex-col justify-center overflow-hidden py-2 sm:py-3">
        <RouterView />
      </main>

      <!-- 底部状态栏与备案信息 -->
      <footer class="relative z-10 w-full shrink-0 pt-1">
        <div class="mb-2 w-full border-b border-dotted border-black/35 sm:mb-2.5"></div>
        <div
          class="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-black/60 sm:text-[11.5px]"
        >
          <div class="flex items-center gap-2">
            <span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>SYSTEM READY</span>
          </div>
          <div class="inline-flex flex-wrap items-center gap-3">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noreferrer"
              class="transition-colors hover:text-black"
            >
              蜀ICP备2026055874号
            </a>
            <a
              href="https://beian.mps.gov.cn/#/query/webSearch?code=51012202002682"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center gap-1 transition-colors hover:text-black"
            >
              <img class="h-3 w-3 object-contain" src="/bei-an-police.png" alt="" />
              <span>川公网安备51012202002682号</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.crt-scanlines {
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0px,
    rgba(255, 255, 255, 0) 2px,
    rgba(0, 0, 0, 0.045) 2px,
    rgba(0, 0, 0, 0.045) 4px
  );
  background-size: 100% 4px;
  animation: scanlineMove 8s linear infinite;
}

@keyframes scanlineMove {
  0% {
    background-position-y: 0px;
  }
  100% {
    background-position-y: 120px;
  }
}

.crt-vignette {
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(0, 0, 0, 0.03) 60%,
    rgba(0, 0, 0, 0.22) 100%
  );
}
</style>
