<template>
  <footer class="app-footer">
    <div class="film-strip"></div>
    <div class="container app-footer__inner">
      <div class="app-footer__brand">
        <p class="app-footer__name">旧光集</p>
        <p class="app-footer__tagline">让旧相机重新见到光。</p>
      </div>
      <nav class="app-footer__links" aria-label="页脚导航">
        <button type="button" @click="notReady('关于旧光集')">关于旧光集</button>
        <button type="button" @click="notReady('联系暗房')">联系暗房</button>
        <button type="button" @click="notReady('服务条款')">服务条款</button>
      </nav>
    </div>
    <div class="container app-footer__copyright">
      <p>基于用户体验的影像器材电商网站 · 本科毕业设计项目</p>
    </div>
  </footer>
</template>

<script setup>
import { notReady } from '../utils/notify.js';
</script>

<style scoped>
.app-footer {
  background: var(--paper-deep);
}
.app-footer__inner {
  display: flex;
  align-items: baseline;
  gap: var(--sp-5);
  padding: var(--sp-5) 0 var(--sp-4);
}
.app-footer__name {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: var(--fs-md);
  letter-spacing: 0.15em;
}
.app-footer__tagline {
  font-size: var(--fs-sm);
  color: var(--ink-soft);
}
.app-footer__links {
  display: flex;
  gap: var(--sp-4);
  margin-left: auto;
}
.app-footer__links button {
  font-size: var(--fs-sm);
  color: var(--ink-soft);
  transition: color var(--dur) var(--ease);
}
.app-footer__links button:hover { color: var(--accent); }
.app-footer__copyright {
  padding: var(--sp-3) 0 var(--sp-4);
  border-top: 1px dashed var(--line);
  font-size: var(--fs-xs);
  color: var(--ink-faint);
}
@media (max-width: 768px) {
  .app-footer__inner { flex-direction: column; gap: var(--sp-2); }
  .app-footer__links { margin-left: 0; flex-wrap: wrap; }
}
</style>
