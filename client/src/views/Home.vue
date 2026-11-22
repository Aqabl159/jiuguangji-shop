<template>
  <div class="home">
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
          <router-link
            v-for="c in categories"
            :key="c.category_id"
            :to="{ path: '/products', query: { type: c.type } }"
            class="category-card perforated-card"
          >
            <span class="category-card-index" aria-hidden="true">{{ c.index }}</span>
            <h3 class="category-card-name">{{ c.name }}</h3>
            <p class="category-card-desc">{{ c.desc }}</p>
          </router-link>
        </div>
      </section>

      <!-- 最新上架 -->
      <section class="latest-section">
        <h2 class="section-title">最新上架</h2>
        <div class="product-grid">
          <ProductCard v-for="p in latestProducts" :key="p.product_id" :product="p" />
        </div>
        <div class="latest-more">
          <router-link to="/products" class="btn btn-outline">查看全部器材</router-link>
        </div>
      </section>

      <!-- 编辑精选 -->
      <section class="picks-section">
        <h2 class="section-title">编辑精选</h2>
        <div class="picks-grid">
          <router-link v-for="(p, i) in editorPicks" :key="p.product_id" :to="`/products/${p.product_id}`" class="pick-card perforated-card">
            <span class="pick-card-index" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <img :src="p.main_image" :alt="p.title" class="pick-card-img" />
            <div class="pick-card-body">
              <p class="pick-card-sub">{{ pickSub(p) }}</p>
              <h3 class="pick-card-title">{{ p.title }}</h3>
              <p class="price"><span class="price__symbol">¥</span>{{ p.price }}</p>
            </div>
          </router-link>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import ProductCard from '../components/ProductCard.vue';
import { categories } from '../mock/categories.js';
import { latestProducts, editorPicks } from '../mock/products.js';

function pickSub(p) {
  if (p.product_type === 'camera') return `${p.brand} ${p.model}`;
  if (p.product_type === 'film') return `${p.brand} · ISO ${p.iso}`;
  return `${p.brand} · ${p.accessory_type}`;
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
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
  padding: var(--sp-5) 0 var(--sp-7);
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

/* ---- 最新上架 ---- */
.latest-section {
  margin-bottom: var(--sp-7);
}
.latest-more {
  margin-top: var(--sp-5);
  text-align: center;
}

/* ---- 编辑精选 ---- */
.picks-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-5);
}
.pick-card {
  position: relative;
  padding: var(--sp-4);
  transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.pick-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-raised);
}
.pick-card-index {
  position: absolute;
  top: var(--sp-3);
  right: var(--sp-4);
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  font-weight: 700;
  color: var(--accent-soft);
  opacity: 0.6;
}
.pick-card-img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.pick-card-body {
  padding-top: var(--sp-3);
}
.pick-card-sub {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: 0.05em;
  color: var(--ink-faint);
}
.pick-card-title {
  font-size: var(--fs-sm);
  font-weight: 600;
  line-height: 1.5;
  margin: var(--sp-1) 0 var(--sp-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ---- 响应式 ---- */
@media (max-width: 768px) {
  .hero { padding: var(--sp-6) 0 var(--sp-5); }
  .hero-title { font-size: var(--fs-xl); }
  .category-grid,
  .picks-grid { grid-template-columns: 1fr; }
}
</style>
