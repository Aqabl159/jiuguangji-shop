<template>
  <div class="home">
    <div class="film-strip"></div>

    <!-- 品牌主视觉 -->
    <header class="hero">
      <div class="container hero-inner">
        <p class="hero-kicker">JIU GUANG JI · 胶片暗房 · EST. 1987</p>
        <h1 class="hero-title">旧光集</h1>
        <p class="hero-tagline">
          让旧相机重新见到光。复古胶片相机、全新胶卷与相机配件，
          每一件器材都经过成色分级与逐项检测。
        </p>
        <div class="hero-actions">
          <router-link to="/products" class="btn btn-primary">开始逛店</router-link>
          <router-link to="/products" class="btn btn-outline">浏览全部器材</router-link>
        </div>
      </div>
    </header>

    <main class="container home-main">
      <!-- 分类导航 -->
      <section class="category-section">
        <h2 class="section-title">器材分类</h2>
        <div class="category-grid">
          <article class="category-card perforated-card" v-for="c in categories" :key="c.name">
            <span class="category-card-index" aria-hidden="true">{{ c.index }}</span>
            <h3 class="category-card-name">{{ c.name }}</h3>
            <p class="category-card-desc">{{ c.desc }}</p>
          </article>
        </div>
      </section>

      <!-- 最新上架（阶段 2 接入商品数据） -->
      <section class="placeholder-section">
        <h2 class="section-title">最新上架</h2>
        <p class="placeholder-note">
          商品数据将在阶段 2 接入：演示商品 + 真实照片 + 成色分级与检测项清单。
        </p>
      </section>
    </main>

    <footer class="home-footer">
      <div class="film-strip"></div>
      <div class="container footer-inner">
        <p class="footer-brand">旧光集</p>
        <p class="footer-note">基于用户体验的影像器材电商网站 · 毕业设计项目</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// 分类导航：固定三类（阶段 2 改为从 /api/categories 加载）
const categories = [
  { index: '01', name: '二手相机', desc: '成色分级 · 快门检测 · 多角度实拍' },
  { index: '02', name: '全新胶卷', desc: '感光度 · 有效期 · 储存条件说明' },
  { index: '03', name: '相机配件', desc: '镜头 · 闪光灯 · 滤镜 · 肩带' },
];
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ---- hero ---- */
.hero {
  padding: var(--sp-8) 0 var(--sp-7);
}
.hero-inner {
  text-align: center;
}
.hero-kicker {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  letter-spacing: 0.3em;
  color: var(--ink-soft);
}
.hero-title {
  font-size: var(--fs-hero);
  font-weight: 900;
  letter-spacing: 0.18em;
  margin: var(--sp-4) 0 var(--sp-3);
}
.hero-tagline {
  color: var(--ink-soft);
  font-size: var(--fs-md);
  max-width: 32em;
  margin: 0 auto var(--sp-6);
}
.hero-actions {
  display: flex;
  gap: var(--sp-4);
  justify-content: center;
  flex-wrap: wrap;
}

/* ---- 主体 ---- */
.home-main {
  flex: 1;
  padding: var(--sp-6) 0 var(--sp-7);
}
.category-section {
  margin-bottom: var(--sp-7);
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-5);
}
.category-card {
  padding: var(--sp-5) var(--sp-5) var(--sp-6);
  transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.category-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-raised);
}
.category-card-index {
  font-family: var(--font-display);
  font-size: var(--fs-lg);
  font-weight: 700;
  color: var(--accent-soft);
}
.category-card-name {
  margin: var(--sp-2) 0 var(--sp-2);
}
.category-card-desc {
  color: var(--ink-soft);
  font-size: var(--fs-sm);
}

/* ---- 占位提示 ---- */
.placeholder-section {
  padding: var(--sp-6);
  background: var(--paper-deep);
  border: 1px dashed var(--line);
  border-radius: var(--radius-lg);
}
.placeholder-note {
  color: var(--ink-soft);
}

/* ---- 页脚 ---- */
.home-footer .film-strip { margin-top: var(--sp-6); }
.footer-inner {
  display: flex;
  align-items: baseline;
  gap: var(--sp-4);
  padding: var(--sp-5) 0 var(--sp-6);
}
.footer-brand {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--fs-md);
  letter-spacing: 0.1em;
}
.footer-note {
  color: var(--ink-soft);
  font-size: var(--fs-sm);
}

/* ---- 响应式 ---- */
@media (max-width: 768px) {
  .hero-title { font-size: var(--fs-xl); }
  .category-grid { grid-template-columns: 1fr; }
  .footer-inner { flex-direction: column; gap: var(--sp-1); }
}
</style>
