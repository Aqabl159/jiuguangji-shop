<template>
  <main class="container placeholder-page">
    <div class="film-strip"></div>
    <div class="placeholder-body">
      <h1 class="placeholder-title">正在冲洗中…</h1>
      <p>该页面将在后续开发阶段上线，当前为阶段 0 工程骨架演示。</p>
      <router-link to="/" class="btn btn-primary">返回首页</router-link>
    </div>
  </main>
</template>

<style scoped>
.placeholder-page {
  padding: var(--sp-6) 0;
}
.placeholder-body {
  margin-top: var(--sp-6);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sp-4);
}
.placeholder-title {
  font-size: var(--fs-xl);
  letter-spacing: 0.1em;
}
.placeholder-body p {
  color: var(--ink-soft);
}
</style>
