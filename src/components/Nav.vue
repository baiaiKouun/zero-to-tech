<template>
  <div
    class="mb-[22px] flex items-baseline justify-between gap-6 max-[640px]:mb-[18px] max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-2.5"
  >
    <p
      class="text-[21px] font-medium leading-[1.14] tracking-[-0.03em] text-black/[0.88] max-[640px]:text-lg"
    >
      zero to tech
    </p>
    <nav class="inline-flex flex-wrap justify-end gap-[18px] max-[640px]:justify-start">
      <RouterLink
        to="/"
        class="text-[15px] leading-[1.33] tracking-[-0.015em] text-black/[0.54] transition-colors duration-200 hover:text-[#1d1d1f] aria-[current=page]:font-medium aria-[current=page]:text-[#1d1d1f]"
      >
        个人主页
      </RouterLink>
      <RouterLink
        to="/text-lab"
        class="text-[15px] leading-[1.33] tracking-[-0.015em] text-black/[0.54] transition-colors duration-200 hover:text-[#1d1d1f] aria-[current=page]:font-medium aria-[current=page]:text-[#1d1d1f]"
      >
        文字实验室
      </RouterLink>
    </nav>
  </div>
</template>
