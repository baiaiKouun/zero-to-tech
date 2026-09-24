# zero-to-tech

一个正在向个人博客演进的 Vue 3 项目。目前包含个人主页和中文文字实验室。

## 当前状态

当前版本是一个 Vue 单页应用和 FastAPI 服务组成的中文文本分析工具：

- `/`：个人主页，展示介绍、作品和学习方向
- `/text-lab`：输入中文，获取拼音、情感分数和情感判断
- `/api/profile`：提供主页内容
- `/api/analyze`：分析文本并保存历史记录
- `/api/history`：读取当前浏览器会话的分析历史
- 数据暂时保存在 SQLite 中
- 当前没有管理员账户和文章管理功能
- 前端所有页面样式都使用 Tailwind CSS 工具类

博客改造的目标是保留文字实验室，同时增加技术笔记、诗文札记和只允许管理员使用的文章后台。

## 技术栈

| 部分 | 技术 | 用途 |
| --- | --- | --- |
| 前端框架 | Vue 3 | 页面组件和响应式状态 |
| 路由 | Vue Router | 首页和文字实验室之间的单页路由 |
| 构建工具 | Vite | 开发服务器和生产构建 |
| 语言 | TypeScript | 页面、路由、接口数据的类型检查 |
| 样式 | Tailwind CSS、`@tailwindcss/vite` | 布局、颜色、响应式和组件样式 |
| 动画 | Anime.js | 卡片进入动画和分数动画 |
| 后端 | FastAPI、Uvicorn | 提供主页和文本分析接口 |
| 中文处理 | pypinyin、SnowNLP | 拼音转换和情感分析 |
| 当前数据库 | SQLite | 保存文字实验室历史记录 |
| 生产部署 | Nginx | 静态文件服务和 API 反向代理 |


## 项目结构

```text
zero-to-tech/
├─ backend/
│  ├─ main.py              FastAPI 应用和接口
│  ├─ storage.py           SQLite 初始化与历史记录读写
│  ├─ requirements.txt     Python 依赖
│  └─ .env.example         后端环境变量示例
├─ public/
│  └─ bei-an-police.png    备案图标
├─ src/
│  ├─ components/Nav.vue   顶部导航
│  ├─ assets/styles/       Tailwind CSS 入口
│  ├─ data/site.ts         默认文案和数据类型
│  ├─ router/index.ts      路由配置
│  ├─ env.d.ts             Vite 环境变量类型
│  ├─ views/HomeView.vue   个人主页
│  ├─ views/TextLabView.vue 文字实验室
│  └─ main.ts              前端入口
├─ .env.example            前端环境变量示例
├─ index.html              HTML 入口
├─ package.json             前端脚本和依赖
├─ tsconfig.json            TypeScript 配置
└─ vite.config.mts         Vite、Vue 和 Tailwind 配置
```

## 环境要求

- Node.js `20.19+` 或 `22.12+`
- npm
- Python 3.10 或更高版本

Node.js 版本要求来自当前 Vite 依赖的运行时约束。可以使用 `node --version` 检查版本。

## 只运行前端

在项目根目录执行：

```powershell
npm install
npm run dev
```

然后打开终端显示的地址，默认通常是：

```text
http://localhost:5173
```

只运行前端时，首页可以展示本地默认数据。文字分析和历史记录需要后端服务。

## 本地完整运行

建议打开两个终端：一个运行后端，一个运行前端。

### 1. 启动后端

在第一个终端执行：

```powershell
cd backend
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

编辑 `backend/.env`，至少设置：

```env
ALLOWED_ORIGINS=http://localhost:5173
```

继续执行：

```powershell
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

后端地址为 `http://localhost:8000`，接口文档为 `http://localhost:8000/docs`。

### 2. 启动前端

在第二个终端打开项目根目录，执行：

```powershell
npm install
npm run dev
```

如果前端不设置 `VITE_API_BASE_URL`，开发服务器会把 `/api` 代理到 `http://127.0.0.1:8000`。也可以在项目根目录创建 `.env.local`，明确设置：

```env
VITE_API_BASE_URL=http://localhost:8000
```

`VITE_` 开头的变量会进入浏览器代码，只能放公开配置，不能放密码或密钥。

## 常用命令

```powershell
npm run dev
npm run typecheck
npm run build
npm run preview
```

命令说明：

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run typecheck` | 使用 `vue-tsc` 检查 TypeScript 和 Vue 类型 |
| `npm run build` | 构建生产文件到 `dist/` |
| `npm run preview` | 预览生产构建结果 |

## 前端数据流程

首页加载时先使用 `src/data/site.ts` 中的默认内容，然后请求 `GET /api/profile`。接口成功时替换为服务端内容，接口失败时保留默认内容。

文字实验室提交表单后：

```text
输入文本
  ↓
POST /api/analyze
  ↓
显示原文、拼音、分数和标签
  ↓
后端保存当前浏览器会话的历史记录
```

历史记录通过 Cookie 中的 `session_id` 区分浏览器会话。它不是账户数据，清理 Cookie 或更换浏览器后，看到的记录会发生变化。

## API

### 获取主页数据

```http
GET /api/profile
```

返回首页标题、介绍、作品和个人信息。

### 分析文本

```http
POST /api/analyze
Content-Type: application/json
```

请求体：

```json
{
  "text": "今天的风很轻，适合慢慢写下自己的想法。"
}
```

返回示例：

```json
{
  "text": "今天的风很轻，适合慢慢写下自己的想法。",
  "score": 0.86,
  "label": "偏积极",
  "pinyin": "jīn tiān de fēng hěn qīng ...",
  "created_at": "2026-09-23T06:00:00+00:00"
}
```

### 获取历史记录

```http
GET /api/history?limit=10
```

接口根据 `session_id` Cookie 返回当前浏览器会话的记录。

## 样式约定

Tailwind 通过 [tailwind.css](src/assets/styles/tailwind.css) 和 `@tailwindcss/vite` 接入。页面模板直接使用 Tailwind 工具类，旧的全局 CSS 文件已经移除。

Anime.js 只负责运行时动画，不负责页面基础样式。新增页面时优先使用 Tailwind；需要复杂的运行时效果时再引入动画库。

## 生产部署

生产环境建议使用 Nginx：

```text
浏览器 → Nginx HTTPS
             ├─ /api/* → FastAPI：127.0.0.1:8000
             └─ 其他   → dist/
```

构建前端：

```powershell
npm install
npm run build
```

Nginx 需要：

- 将站点根目录指向 `dist/`
- 将 `/api/` 转发到 FastAPI
- 将未知前端路径回退到 `/index.html`，支持 Vue Router 直接访问
- 生产环境启用 HTTPS

前端构建不需要在生产环境持续运行 Node.js 服务。FastAPI 应由 Uvicorn 配合 systemd 或其他进程管理器运行。

## 当前限制

- 尚未实现管理员账户和登录系统
- 尚未实现文章、分类、标签和 Markdown 渲染
- 文字实验室历史记录只按浏览器会话区分
- 文本为空或过长时，服务端校验和错误提示仍需加强
- 当前数据库是 SQLite，后续按计划迁移到 PostgreSQL
- 尚未配置自动化测试和持续集成
