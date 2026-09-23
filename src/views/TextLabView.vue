<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { animate, scrambleText, stagger } from "animejs";
import Nav from "../components/Nav.vue";
import { textLab } from "../../data/site.js";

const apiBase = import.meta.env.VITE_API_BASE_URL || "";
const defaultText = "今天的风很轻，适合把脑海里的想法慢慢写下来。";

const grid = ref(null);
const scoreNode = ref(null);
const text = ref(defaultText);
const error = ref("");
const result = ref(null);
const history = ref([]);
const historyOpen = ref(false);
const historyError = ref("");

function formatTime(iso) {
  return new Date(iso).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function onKeydown(event) {
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

    result.value = await response.json();
  } catch (caught) {
    error.value = caught.message;
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

    history.value = await response.json();
  } catch (caught) {
    historyError.value = caught.message;
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown);

  animate(grid.value.querySelectorAll(".card"), {
    opacity: [0, 1],
    translateY: [24, 0],
    delay: stagger(120),
    duration: 700,
    ease: "outBack",
  });
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
});

watch(result, async () => {
  await nextTick();
  animate(scoreNode.value, {
    innerHTML: scrambleText({ chars: "0-9" }),
    duration: 1500,
  });
});
</script>

<template>
  <section ref="grid" class="dashboard-grid">
    <article class="hero-stage panel-full">
      <Nav />
      <div class="hero-copy">
        <h1 class="hero-display">{{ textLab.heroTitle }}</h1>
        <p class="hero-subtitle">{{ textLab.heroSubtitle }}</p>
      </div>
    </article>

    <article class="panel panel-half lab-panel card">
      <div class="panel-heading">
        <p class="section-kicker">输入区</p>
        <h3>贴一段中文</h3>
      </div>

      <form class="lab-form" @submit.prevent="analyze">
        <label for="text-input">文本内容</label>
        <textarea
          id="text-input"
          v-model="text"
          rows="8"
          placeholder="例如：生活没有标准答案，但每一天都值得认真感受。"
        ></textarea>
        <p class="lab-count">已输入 {{ text.length }} 字</p>
        <p v-if="error" class="lab-error">{{ error }}</p>
        <button class="primary-button" type="submit">开始分析</button>
      </form>
    </article>

    <article class="panel panel-half lab-panel result-panel card">
      <div class="panel-heading panel-heading-row">
        <div>
          <p class="section-kicker">结果区</p>
          <h3>分析结果</h3>
        </div>
        <button class="ghost-button" type="button" @click="openHistory">
          历史记录
        </button>
      </div>

      <div class="result-stack">
        <div class="result-item">
          <span>原文</span>
          <p>{{ result ? result.text : defaultText }}</p>
        </div>
        <div class="result-item">
          <span>拼音</span>
          <p>{{ result ? result.pinyin : "jīn tiān de fēng hěn qīng …" }}</p>
        </div>
        <div class="result-grid">
          <div class="result-badge">
            <span>情感分数</span>
            <strong ref="scoreNode">{{ result ? result.score : 0.86 }}</strong>
          </div>
          <div class="result-badge">
            <span>情感判断</span>
            <strong>{{ result ? result.label : "偏积极" }}</strong>
          </div>
        </div>
      </div>
    </article>

    <div
      v-if="historyOpen"
      class="modal-overlay"
      @click.self="historyOpen = false"
    >
      <div class="modal-panel">
        <div class="modal-heading">
          <div>
            <p class="section-kicker">历史记录</p>
            <h3>最近的分析</h3>
          </div>
          <button
            class="modal-close"
            type="button"
            @click="historyOpen = false"
          >
            关闭
          </button>
        </div>

        <p v-if="historyError" class="lab-error">{{ historyError }}</p>
        <p v-else-if="history.length === 0" class="history-empty">
          还没有记录，先分析一句试试。
        </p>
        <div v-else class="history-list">
          <div v-for="item in history" :key="item.id" class="history-item">
            <p class="history-text">{{ item.text }}</p>
            <span class="history-meta">
              {{ item.score }} · {{ item.label }} ·
              {{ formatTime(item.created_at) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>