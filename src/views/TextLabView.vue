<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { animate, scrambleText, stagger } from "animejs";
import Nav from "../components/Nav.vue";
import { textLab } from "../data/site";

interface AnalyzeResult {
  text: string;
  score: number;
  label: string;
  pinyin: string;
  created_at: string;
}

interface HistoryItem extends AnalyzeResult {
  id: number;
  session_id?: string;
}

const apiBase = import.meta.env.VITE_API_BASE_URL || "";
const defaultText = "今天的风很轻，适合把脑海里的想法慢慢写下来。";

const grid = ref<HTMLElement | null>(null);
const scoreNode = ref<HTMLElement | null>(null);
const text = ref(defaultText);
const error = ref("");
const result = ref<AnalyzeResult | null>(null);
const history = ref<HistoryItem[]>([]);
const historyOpen = ref(false);
const historyError = ref("");

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    historyOpen.value = false;
  }
}

async function analyze() {
  error.value = "";

  try {
    const response = await fetch(`${apiBase}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text: text.value }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.detail || `分析失败：${response.status}`);
    }

    result.value = (await response.json()) as AnalyzeResult;
  } catch (caught: unknown) {
    error.value = caught instanceof Error ? caught.message : "分析失败";
  }
}

async function openHistory() {
  historyOpen.value = true;
  historyError.value = "";

  try {
    const response = await fetch(`${apiBase}/api/history`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`历史记录加载失败：${response.status}`);
    }

    history.value = (await response.json()) as HistoryItem[];
  } catch (caught: unknown) {
    historyError.value =
      caught instanceof Error ? caught.message : "历史记录加载失败";
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown);

  if (grid.value) {
    animate(grid.value.querySelectorAll("[data-card]"), {
      opacity: [0, 1],
      translateY: [24, 0],
      delay: stagger(120),
      duration: 700,
      ease: "outBack",
    });
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
});

watch(result, async () => {
  await nextTick();
  if (scoreNode.value) {
    animate(scoreNode.value, {
      innerHTML: scrambleText({ chars: "0-9" }),
      duration: 1500,
    });
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
          {{ textLab.heroTitle }}
        </h1>
        <p
          class="mt-2.5 max-w-[540px] text-[clamp(18px,2.2vw,24px)] leading-[1.28] tracking-[-0.02em] text-black/[0.72] max-[640px]:mt-3.5 max-[640px]:text-lg"
        >
          {{ textLab.heroSubtitle }}
        </p>
      </div>
    </article>

    <article
      data-card
      class="col-span-6 min-h-[340px] rounded-[32px] bg-white p-6 opacity-0 shadow-[3px_5px_30px_rgba(0,0,0,0.08)] translate-y-6 max-[834px]:col-span-12 max-[834px]:min-h-0 max-[640px]:rounded-3xl max-[640px]:p-5"
    >
      <div class="mb-5">
        <p class="mb-3 text-xs font-semibold leading-[1.33] tracking-[-0.0075em] text-black/[0.56]">输入区</p>
        <h3 class="text-[28px] font-semibold leading-[1.14] tracking-[-0.03em] max-[640px]:text-2xl">
          贴一段中文
        </h3>
      </div>

      <form class="grid gap-3.5" @submit.prevent="analyze">
        <label class="text-[17px] leading-[1.47] tracking-[-0.023em] text-black/[0.72]" for="text-input">
          文本内容
        </label>
        <textarea
          id="text-input"
          v-model="text"
          rows="8"
          placeholder="例如：生活没有标准答案，但每一天都值得认真感受。"
          class="min-h-[220px] w-full resize-y rounded-[18px] border border-black/[0.08] bg-[#fbfbfd] px-5 py-[18px] text-[17px] leading-[1.47] tracking-[-0.023em] text-[#1d1d1f] outline-none placeholder:text-black/[0.56] focus:border-[#0071e3] focus:shadow-[0_0_0_2px_rgba(0,113,227,0.14)]"
        ></textarea>
        <p class="text-[13px] leading-[1.3] tracking-[-0.0075em] text-black/[0.56]">
          已输入 {{ text.length }} 字
        </p>
        <p v-if="error" class="text-sm leading-[1.4] text-[#b42318]">{{ error }}</p>
        <button
          class="justify-self-start rounded-full border-0 bg-[#0071e3] px-4 py-2 text-[17px] leading-[1.41] text-white transition-opacity duration-200 hover:opacity-[0.86]"
          type="submit"
        >
          开始分析
        </button>
      </form>
    </article>

    <article
      data-card
      class="col-span-6 min-h-[340px] rounded-[32px] bg-white p-6 opacity-0 shadow-[3px_5px_30px_rgba(0,0,0,0.08)] translate-y-6 max-[834px]:col-span-12 max-[834px]:min-h-0 max-[640px]:rounded-3xl max-[640px]:p-5"
    >
      <div class="mb-5 flex items-start justify-between gap-3">
        <div>
          <p class="mb-3 text-xs font-semibold leading-[1.33] tracking-[-0.0075em] text-black/[0.56]">结果区</p>
          <h3 class="text-[28px] font-semibold leading-[1.14] tracking-[-0.03em] max-[640px]:text-2xl">
            分析结果
          </h3>
        </div>
        <button
          class="shrink-0 rounded-full border border-black/[0.08] bg-transparent px-3.5 py-1.5 text-sm leading-[1.4] text-black/[0.72] transition-colors duration-200 hover:border-[#0071e3] hover:text-[#0071e3]"
          type="button"
          @click="openHistory"
        >
          历史记录
        </button>
      </div>

      <div class="grid gap-3.5">
        <div class="rounded-[18px] bg-[#fbfbfd] p-5">
          <span class="mb-2 block text-xs leading-[1.33] tracking-[-0.0075em] text-black/[0.56]">原文</span>
          <p class="break-words text-[17px] leading-[1.47] tracking-[-0.023em] text-[#1d1d1f]">
            {{ result ? result.text : defaultText }}
          </p>
        </div>
        <div class="rounded-[18px] bg-[#fbfbfd] p-5">
          <span class="mb-2 block text-xs leading-[1.33] tracking-[-0.0075em] text-black/[0.56]">拼音</span>
          <p class="break-words text-[17px] leading-[1.47] tracking-[-0.023em] text-[#1d1d1f]">
            {{ result ? result.pinyin : "jīn tiān de fēng hěn qīng …" }}
          </p>
        </div>
        <div class="grid grid-cols-2 gap-3.5 max-[834px]:grid-cols-1">
          <div class="rounded-[18px] bg-[#fbfbfd] p-5">
            <span class="mb-2 block text-xs leading-[1.33] tracking-[-0.0075em] text-black/[0.56]">情感分数</span>
            <strong ref="scoreNode" class="text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#1d1d1f]">
              {{ result ? result.score : 0.86 }}
            </strong>
          </div>
          <div class="rounded-[18px] bg-[#fbfbfd] p-5">
            <span class="mb-2 block text-xs leading-[1.33] tracking-[-0.0075em] text-black/[0.56]">情感判断</span>
            <strong class="text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#1d1d1f]">
              {{ result ? result.label : "偏积极" }}
            </strong>
          </div>
        </div>
      </div>
    </article>

    <div
      v-if="historyOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.32)] p-6"
      @click.self="historyOpen = false"
    >
      <div
        class="flex max-h-[min(70vh,640px)] w-[min(560px,100%)] flex-col rounded-[32px] bg-white p-7 shadow-[0_24px_60px_rgba(0,0,0,0.18)] max-[640px]:rounded-3xl max-[640px]:p-5"
      >
        <div class="mb-5 flex items-start justify-between gap-3">
          <div>
            <p class="mb-3 text-xs font-semibold leading-[1.33] tracking-[-0.0075em] text-black/[0.56]">历史记录</p>
            <h3 class="text-[28px] font-semibold leading-[1.14] tracking-[-0.03em] max-[640px]:text-2xl">
              最近的分析
            </h3>
          </div>
          <button
            class="shrink-0 rounded-full border border-black/[0.08] bg-transparent px-3.5 py-1.5 text-sm leading-[1.4] text-black/[0.72] hover:border-[#0071e3] hover:text-[#0071e3]"
            type="button"
            @click="historyOpen = false"
          >
            关闭
          </button>
        </div>

        <p v-if="historyError" class="text-sm leading-[1.4] text-[#b42318]">{{ historyError }}</p>
        <p v-else-if="history.length === 0" class="text-[15px] leading-[1.4] text-black/[0.56]">
          还没有记录，先分析一句试试。
        </p>
        <div v-else class="grid gap-2.5 overflow-y-auto">
          <div v-for="item in history" :key="item.id" class="rounded-[18px] bg-[#fbfbfd] px-[18px] py-3.5">
            <p class="break-words text-base leading-[1.45] text-[#1d1d1f]">{{ item.text }}</p>
            <span class="mt-1.5 block text-xs leading-[1.33] tracking-[-0.0075em] text-black/[0.56]">
              {{ item.score }} · {{ item.label }} ·
              {{ formatTime(item.created_at) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
