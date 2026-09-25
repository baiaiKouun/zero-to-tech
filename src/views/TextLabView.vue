<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { animate, scrambleText } from "animejs";
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
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
});

watch(result, async () => {
  await nextTick();
  if (scoreNode.value) {
    animate(scoreNode.value, {
      innerHTML: scrambleText({ chars: "0-9" }),
      duration: 1200,
    });
  }
});
</script>

<template>
  <div class="flex h-full w-full flex-col justify-between gap-3 overflow-hidden select-text sm:gap-4 md:gap-5">
    <!-- 头部标题 -->
    <div class="flex shrink-0 items-baseline justify-between border-b border-black/15 pb-2">
      <div>
        <h1 class="text-base font-bold tracking-tight text-black sm:text-lg md:text-xl">
          {{ textLab.heroTitle }}
        </h1>
        <p class="mt-1 font-mono text-xs text-black/70 sm:text-sm">
          {{ textLab.heroSubtitle }}
        </p>
      </div>
    </div>

    <!-- 主体左右双栏卡片：高度与首页完全统一 -->
    <div class="grid min-h-0 flex-1 grid-cols-12 items-stretch gap-3 sm:gap-4 md:gap-5">
      <!-- 左栏：输入区 -->
      <article
        class="col-span-12 flex h-full flex-col justify-between rounded-lg border border-black/25 bg-[#f3f4f1] p-4 shadow-[2px_2px_0px_rgba(0,0,0,0.12)] sm:p-5 md:col-span-6"
      >
        <div class="flex items-center justify-between font-mono text-[11px] text-black/60">
          <span>[ 01: 输入区 ]</span>
        </div>

        <form class="my-2 flex min-h-0 flex-1 flex-col justify-between gap-2" @submit.prevent="analyze">
          <textarea
            id="text-input"
            v-model="text"
            placeholder="贴入一段中文进行拼音转换与情感计算..."
            class="h-full min-h-[90px] w-full resize-none rounded-[4px] border border-black/20 bg-white/80 p-2.5 font-mono text-xs leading-relaxed text-[#18181a] outline-none placeholder:text-black/40 focus:border-black focus:bg-white sm:text-sm"
          ></textarea>

          <div class="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-xs">
            <span class="text-black/60">已输入 {{ text.length }} 字</span>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="rounded-[3px] border border-black/30 bg-transparent px-2.5 py-1 font-mono text-xs text-black/80 transition-colors hover:border-black hover:text-black"
                @click="openHistory"
              >
                [ 历史记录 ]
              </button>
              <button
                type="submit"
                class="rounded-[3px] border border-black bg-black px-3.5 py-1 font-mono text-xs font-semibold text-white transition-opacity hover:opacity-85"
              >
                [ 开始分析 ]
              </button>
            </div>
          </div>
          <p v-if="error" class="font-mono text-xs text-red-600">{{ error }}</p>
        </form>
      </article>

      <!-- 右栏：结果区 -->
      <article
        class="col-span-12 flex h-full flex-col justify-between rounded-lg border border-black/25 bg-[#f3f4f1] p-4 shadow-[2px_2px_0px_rgba(0,0,0,0.12)] sm:p-5 md:col-span-6"
      >
        <div class="flex items-center justify-between font-mono text-[11px] text-black/60">
          <span>[ 02: 分析结果 ]</span>
        </div>

        <div class="my-2 flex min-h-0 flex-1 flex-col justify-between gap-2">
          <!-- 原文 -->
          <div class="rounded border border-black/15 bg-white/70 p-2 sm:p-2.5">
            <span class="block font-mono text-[10px] text-black/50"> 原文 </span>
            <p class="mt-0.5 line-clamp-2 text-xs font-medium text-[#18181a] sm:text-sm">
              {{ result ? result.text : defaultText }}
            </p>
          </div>

          <!-- 拼音 -->
          <div class="rounded border border-black/15 bg-white/70 p-2 sm:p-2.5">
            <span class="block font-mono text-[10px] text-black/50"> 拼音 </span>
            <p class="mt-0.5 line-clamp-2 font-mono text-xs text-[#0066cc] sm:text-sm">
              {{ result ? result.pinyin : "jīn tiān de fēng hěn qīng …" }}
            </p>
          </div>

          <!-- 情绪指标 -->
          <div class="grid grid-cols-2 gap-2">
            <div class="rounded border border-black/15 bg-white/70 p-2 sm:p-2.5">
              <span class="block font-mono text-[10px] text-black/50"> 情绪得分 </span>
              <strong
                ref="scoreNode"
                class="mt-1 block font-mono text-xl font-bold tracking-tight text-black sm:text-2xl"
              >
                {{ result ? result.score : 0.86 }}
              </strong>
            </div>
            <div class="rounded border border-black/15 bg-white/70 p-2 sm:p-2.5">
              <span class="block font-mono text-[10px] text-black/50"> 情绪判断 </span>
              <strong class="mt-1 block font-mono text-xl font-bold tracking-tight text-black sm:text-2xl">
                {{ result ? result.label : "偏积极" }}
              </strong>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- 历史记录模态弹窗 -->
    <div
      v-if="historyOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="historyOpen = false"
    >
      <div
        class="flex max-h-[75vh] w-[min(540px,94vw)] flex-col rounded-lg border-2 border-black bg-[#dfdeda] p-4 font-mono sm:p-5"
      >
        <div class="mb-3 flex items-start justify-between gap-3 border-b border-black/20 pb-2">
          <div>
            <h3 class="text-base font-bold text-black sm:text-lg">
              最近分析记录
            </h3>
          </div>
          <button
            class="rounded border border-black bg-black px-2 py-0.5 text-xs text-white hover:opacity-85"
            type="button"
            @click="historyOpen = false"
          >
            [ 关闭 ESC ]
          </button>
        </div>

        <p v-if="historyError" class="text-xs text-red-600">{{ historyError }}</p>
        <p v-else-if="history.length === 0" class="text-xs text-black/60">
          暂无历史记录，请先在左侧分析一句。
        </p>
        <div v-else class="grid min-h-0 gap-2 overflow-y-auto pr-1">
          <div
            v-for="item in history"
            :key="item.id"
            class="rounded border border-black/15 bg-white/80 p-2 text-xs"
          >
            <p class="break-words font-medium text-black">{{ item.text }}</p>
            <span class="mt-1 block text-[10.5px] text-black/60">
              得分: {{ item.score }} · {{ item.label }} · {{ formatTime(item.created_at) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
