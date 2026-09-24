<template>
  <div
    class="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f5f5f7_28%,#f5f5f7_100%)] font-sans leading-normal text-[#1d1d1f]"
  >
    <div
      class="mx-auto w-[min(980px,calc(100%-40px))] pb-8 max-[640px]:w-[min(980px,calc(100%-24px))]"
    >
      <main>
        <RouterView />
      </main>

      <footer class="py-7 pb-1 text-center">
        <div
          class="inline-flex flex-wrap items-center justify-center gap-4 rounded-[18px] border border-black/[0.08] px-4 py-2 text-[13px] leading-[1.4] text-black/55"
        >
          <a
            href="https://beian.miit.gov.cn/"
            rel="noreferrer"
            target="_blank"
            class="transition-colors duration-200 hover:text-[#1d1d1f]"
          >
            蜀ICP备2026055874号
          </a>
          <a
            href="https://beian.mps.gov.cn/#/query/webSearch?code=51012202002682"
            rel="noreferrer"
            target="_blank"
            class="inline-flex items-center gap-1 transition-colors duration-200 hover:text-[#1d1d1f]"
          >
            <img class="h-[18px] w-[18px] object-contain" src="/bei-an-police.png" alt="" />
            <span>川公网安备51012202002682号</span>
          </a>
        </div>
      </footer>
    </div>
  </div>
</template>
