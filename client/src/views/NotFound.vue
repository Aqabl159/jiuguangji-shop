<template>
  <main class="container not-found">
    <div class="film-strip"></div>
    <div class="not-found__body">
      <p class="not-found__code">404</p>
      <h1 class="not-found__title">这张底片找不到</h1>
      <p class="not-found__hint">您访问的页面可能已下架、被冲坏了，或者地址有误。</p>
      <router-link to="/" class="btn btn-primary">返回首页</router-link>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  padding: var(--sp-6) 0 var(--sp-8);
}
.not-found__body {
  margin-top: var(--sp-6);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sp-3);
}
.not-found__code {
  font-family: var(--font-mono);
  font-size: var(--fs-hero);
  color: var(--accent-soft);
  line-height: 1;
}
.not-found__title {
  font-size: var(--fs-xl);
  letter-spacing: 0.1em;
}
.not-found__hint {
  color: var(--ink-soft);
  margin-bottom: var(--sp-2);
}
</style>
