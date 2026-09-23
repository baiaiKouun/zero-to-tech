<template>
    <div class="app-shell">
      <div class="page-shell">
        <main class="page-content">
          <RouterView />
        </main>
  
        <footer class="site-footer">
          <div class="filing-box">
            <a
              href="https://beian.miit.gov.cn/"
              rel="noreferrer"
              target="_blank"
            >
              蜀ICP备2026055874号
            </a>
            <a
              class="police-filing-link"
              href="https://beian.mps.gov.cn/#/query/webSearch?code=51012202002682"
              rel="noreferrer"
              target="_blank"
            >
              <img src="/bei-an-police.png" alt="" />
              <span>川公网安备51012202002682号</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  </template>