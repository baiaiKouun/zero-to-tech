<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const emit = defineEmits<{
  (e: "finish"): void;
}>();

const PATH_1 =
  "M-109.06069946289062,95.92639923095703 C1.9544999599456787,157.6403045654297 103.11389923095703,236.9969940185547 217.881103515625,372.07550048828125 C296,464.2846984863281 337.9999084472656,569.5725708007812 340,642.1939697265625 C341,696.1920166015625 314.6702880859375,737.156005859375 266,737.156005859375 C212,737.156005859375 178,696.1920166015625 157,602.1610107421875 C134,498.82000732421875 117,380.239990234375 74,0";

const PATH_2 =
  "M78.21453094482422,37.160953521728516 C100.22924041748047,230.68260192871094 184,372 291,372 C355,372 395.6745910644531,321 384.1253967285156,248 C377.6238098144531,205 370.0873107910156,161 361.3063049316406,110 C351.0714111328125,46 380.3254089355469,-4 468.96173095703125,-4 C598.2246704101562,-4 739.2435302734375,67.83381652832031 811.4124145507812,179.0941619873047 C836,217 846,251 847,284 C848,344 814,389 754,389 C678,389 620,303 620,193 C620,75 684,-8 819.9180908203125,-8 C1004.7244873046875,-8 1209.4246826171875,213.84754943847656 1303.4808349609375,461.42327880859375 C1330.037353515625,531.3258056640625 1340,596.2349243164062 1340,641.593994140625 C1340,695.3764038085938 1323,736.673583984375 1275,736.673583984375 C1228,736.673583984375 1197,700.1784057617188 1169,642.5543823242188 C1136.1939697265625,575.7216186523438 1111.927734375,479.32598876953125 1102,370.3599853515625 C1077,96.94000244140625 1133,-4 1266.152099609375,-4 C1427.6083984375,-4 1607.1151123046875,220.92921447753906 1698.771728515625,462.18878173828125 C1725.037353515625,531.3258056640625 1735,596.2349243164062 1735,641.593994140625 C1735,695.3764038085938 1718,736.673583984375 1670,736.673583984375 C1623,736.673583984375 1592,700.1784057617188 1564,642.5543823242188 C1531.1939697265625,575.7216186523438 1506.927734375,479.32598876953125 1497,370.3599853515625 C1472,96.94000244140625 1528,-4 1646.906005859375,-4 C1765.623779296875,-4 1830.114990234375,99.48485565185547 1868.77880859375,209.3712158203125 C1907,318 1954,385 2052,385 C2133,385 2197,325 2197,212 C2197,87 2115.90087890625,-7 2013.41845703125,-8 C1923.234130859375,-9 1864,64 1870,174 C1877,296 1951,385 2048,385 C2104,385 2151.03564453125,360.1071472167969 2188,333 C2288.21435546875,259.8928527832031 2365.4287109375,305.0714416503906 2395,377.3571472167969";

const path1Ref = ref<SVGPathElement | null>(null);
const path2Ref = ref<SVGPathElement | null>(null);

const percent = ref(0);
const terminalStep = ref(0);
const isClosing = ref(false);

const len1 = ref(0);
const len2 = ref(0);

const DURATION_MS = 5000;

const currentDate = (() => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y} · ${m} · ${day}`;
})();
let animationFrameId: number | null = null;
let finishTimeoutId: ReturnType<typeof setTimeout> | null = null;
let closeTimeoutId: ReturnType<typeof setTimeout> | null = null;

function skip() {
  if (isClosing.value) return;
  percent.value = 100;
  terminalStep.value = 3;
  if (path1Ref.value) path1Ref.value.style.strokeDashoffset = "0";
  if (path2Ref.value) path2Ref.value.style.strokeDashoffset = "0";
  isClosing.value = true;
  closeTimeoutId = setTimeout(() => {
    emit("finish");
  }, 450);
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
    skip();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);

  if (!path1Ref.value || !path2Ref.value) return;

  const l1 = path1Ref.value.getTotalLength();
  const l2 = path2Ref.value.getTotalLength();
  len1.value = l1;
  len2.value = l2;

  path1Ref.value.style.strokeDasharray = `${l1} ${l1}`;
  path1Ref.value.style.strokeDashoffset = `${l1}`;
  path2Ref.value.style.strokeDasharray = `${l2} ${l2}`;
  path2Ref.value.style.strokeDashoffset = `${l2}`;

  const startTime = performance.now();
  const totalLength = l1 + l2;

  const tick = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / DURATION_MS);

    percent.value = Math.min(100, Math.floor(progress * 100));

    const currentLen = progress * totalLength;
    if (path1Ref.value && path2Ref.value) {
      if (currentLen <= l1) {
        path1Ref.value.style.strokeDashoffset = `${Math.max(0, l1 - currentLen)}`;
        path2Ref.value.style.strokeDashoffset = `${l2}`;
      } else {
        path1Ref.value.style.strokeDashoffset = "0";
        const drawn2 = currentLen - l1;
        path2Ref.value.style.strokeDashoffset = `${Math.max(0, l2 - drawn2)}`;
      }
    }

    if (progress >= 0.08 && terminalStep.value < 1) terminalStep.value = 1;
    if (progress >= 0.42 && terminalStep.value < 2) terminalStep.value = 2;
    if (progress >= 0.82 && terminalStep.value < 3) terminalStep.value = 3;

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(tick);
    } else {
      percent.value = 100;
      terminalStep.value = 3;
      if (path1Ref.value) path1Ref.value.style.strokeDashoffset = "0";
      if (path2Ref.value) path2Ref.value.style.strokeDashoffset = "0";

      // 达成 100% 后稍作停顿，随后触发电视关机画面转场
      finishTimeoutId = setTimeout(() => {
        isClosing.value = true;
        closeTimeoutId = setTimeout(() => {
          emit("finish");
        }, 500);
      }, 700);
    }
  };

  animationFrameId = requestAnimationFrame(tick);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown);
  if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
  if (finishTimeoutId !== null) clearTimeout(finishTimeoutId);
  if (closeTimeoutId !== null) clearTimeout(closeTimeoutId);
});
</script>

<template>
  <div
    class="fixed inset-0 z-[9999] flex h-screen w-screen select-none items-center justify-center overflow-hidden bg-[#101012] p-2 sm:p-4 md:p-5"
    @click="skip"
  >
    <!-- CRT 监视器外壳与屏幕 -->
    <div
      :class="[
        'crt-chassis relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[20px] border-[8px] border-[#222326] bg-[#dfdeda] p-3.5 shadow-[inset_0_0_50px_rgba(0,0,0,0.3),0_0_0_2px_#18191b,0_20px_50px_rgba(0,0,0,0.85)] sm:rounded-[30px] sm:border-[14px] sm:p-6 md:border-[18px] md:p-7',
        isClosing ? 'crt-turn-off' : 'crt-screen-flicker',
      ]"
    >
      <!-- 动态扫描线遮罩（向下平移） -->
      <div class="crt-scanlines pointer-events-none absolute inset-0 z-20"></div>

      <!-- CRT 暗角与球面微曲面光影 -->
      <div class="crt-vignette pointer-events-none absolute inset-0 z-20"></div>

      <!-- 顶部 HUD 状态栏 -->
      <header class="relative z-10 w-full shrink-0">
        <div
          class="flex items-center justify-between font-mono text-[11px] font-medium tracking-wider text-black/75 sm:text-[13px] md:text-[14px]"
        >
          <span>[baiaikouun's web v0.1]</span>
          <span>[SYSTEM · {{ currentDate }}]</span>
        </div>
        <div class="mt-2.5 w-full border-b border-dotted border-black/35 sm:mt-3"></div>
      </header>

      <!-- 居中：艺术字 "hello" 手写勾勒动画 -->
      <main class="relative z-10 flex min-h-0 flex-1 items-center justify-center px-4 py-2">
        <svg
          viewBox="-189.06069946289062 -89 2664.0606994628906 906.156005859375"
          class="max-h-[50vh] w-[min(960px,90vw)] overflow-visible drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
          fill="none"
          stroke="#161618"
          stroke-width="60"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <g transform="scale(1, -1) translate(0, -728.156005859375)">
            <path ref="path1Ref" :d="PATH_1" />
            <path ref="path2Ref" :d="PATH_2" />
          </g>
        </svg>
      </main>

      <!-- 底部区域：终端输出信息 + 进度条 -->
      <footer class="relative z-10 w-full shrink-0">
        <!-- 左下角终端逐行展现文字（预占位 + 透明度渐入，杜绝高度突增引起的页面回流跳动） -->
        <div
          class="mb-3.5 flex flex-col justify-end font-mono text-[11px] leading-relaxed text-black/85 sm:mb-4 sm:text-[12.5px] md:text-[14px]"
        >
          <div
            :class="[
              'transition-opacity duration-300',
              terminalStep >= 1 ? 'opacity-100' : 'pointer-events-none select-none opacity-0',
            ]"
          >
            addison@nexus:~$ ./init --portfolio
          </div>
          <div
            :class="[
              'flex items-center gap-1.5 transition-opacity duration-300',
              terminalStep >= 2 ? 'opacity-100' : 'pointer-events-none select-none opacity-0',
            ]"
          >
            <span>[</span>
            <span class="rounded-[2px] bg-black px-1 text-[10px] font-bold text-white sm:text-[11px]">
              OK
            </span>
            <span>] loading UI/UX experience ......... 6+ yrs</span>
          </div>
          <div
            :class="[
              'transition-opacity duration-300',
              terminalStep >= 3 ? 'opacity-100' : 'pointer-events-none select-none opacity-0',
            ]"
          >
            NOTICE: selected works are ready to explore.
          </div>
        </div>

        <!-- 虚线分割线 -->
        <div class="mb-3 w-full border-b border-dotted border-black/35 sm:mb-3.5"></div>

        <!-- 进度条与百分比显示 -->
        <div class="flex items-center gap-3 sm:gap-4">
          <div class="relative h-2.5 flex-1 overflow-hidden rounded-xs bg-black/15 sm:h-3">
            <div
              class="h-full bg-[#18181a] will-change-[width]"
              :style="{ width: percent + '%' }"
            ></div>
          </div>
          <span
            class="w-11 text-right font-mono text-xs font-semibold text-black/85 sm:w-14 sm:text-sm"
          >
            {{ percent }}%
          </span>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* 早期电视机动态扫描线：缓缓向下平移 */
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

/* CRT 屏幕微颤光泽感（大幅降低晃眼闪动幅度，柔和微光） */
.crt-screen-flicker {
  animation: crtFlicker 0.22s infinite alternate;
}

@keyframes crtFlicker {
  0% {
    opacity: 0.995;
    filter: brightness(0.998);
  }
  50% {
    opacity: 1;
    filter: brightness(1.002);
  }
  100% {
    opacity: 0.997;
    filter: brightness(1);
  }
}

/* CRT 屏幕边缘暗角与微曲面玻璃反射 */
.crt-vignette {
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(0, 0, 0, 0.04) 55%,
    rgba(0, 0, 0, 0.25) 100%
  );
}

/* 关机转场特效：显像管熄灭时的收缩断电动画 */
.crt-turn-off {
  animation: crtShutdown 0.45s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes crtShutdown {
  0% {
    transform: scale(1, 1);
    opacity: 1;
    filter: brightness(1);
  }
  45% {
    transform: scale(1, 0.005);
    opacity: 0.95;
    filter: brightness(3);
  }
  80% {
    transform: scale(0.005, 0.005);
    opacity: 0.8;
    filter: brightness(5);
  }
  100% {
    transform: scale(0, 0);
    opacity: 0;
  }
}
</style>
