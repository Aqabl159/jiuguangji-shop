<template>
  <div class="container product-list">
    <!-- 页头 -->
    <div class="page-head">
      <BreadcrumbNav :items="[{ label: '全部商品' }]" />
      <h1 class="page-head__title">{{ pageTitle }}</h1>
      <p class="product-list__count">共 {{ list.length }} 件器材</p>
    </div>

    <!-- 搜索条 -->
    <div class="product-list__search">
      <input
        v-model="keyword"
        type="search"
        class="input"
        placeholder="搜索器材标题、品牌或型号"
        aria-label="搜索器材"
      />
      <button type="button" class="btn btn-primary" @click="onSearch">搜索</button>
    </div>

    <!-- 分类 Tab -->
    <div class="tab-bar" role="tablist" aria-label="器材分类">
      <router-link
        v-for="tab in tabs"
        :key="tab.type"
        :to="{ path: '/products', query: tab.type ? { type: tab.type } : {} }"
        class="tab-item"
        :class="{ 'tab-item--active': tab.type === currentType }"
      >{{ tab.label }}</router-link>
    </div>

    <div class="product-list__layout">
      <!-- 筛选面板 -->
      <aside class="filter-panel perforated-card" aria-label="筛选条件">
        <h2 class="filter-panel__title">筛选</h2>
        <div v-for="group in filterGroups" :key="group.key" class="filter-group">
          <p class="filter-title">{{ group.title }}</p>
          <button
            v-for="opt in group.options"
            :key="opt"
            type="button"
            class="filter-option"
            @click="onFilter(group.title, opt)"
          >{{ opt }}</button>
        </div>
      </aside>

      <!-- 商品网格 -->
      <div class="product-list__main">
        <div v-if="list.length" class="product-grid">
          <ProductCard v-for="p in list" :key="p.product_id" :product="p" />
        </div>
        <EmptyState v-else title="没有找到符合条件的器材" hint="换个分类或关键词试试" />

        <!-- 分页（静态演示） -->
        <nav class="pagination" aria-label="分页">
          <button type="button" class="page-btn" disabled aria-label="上一页">‹</button>
          <button type="button" class="page-btn page-btn--active" aria-current="page" @click="onPage(1)">1</button>
          <button type="button" class="page-btn" @click="onPage(2)">2</button>
          <button type="button" class="page-btn" @click="onPage(3)">3</button>
          <button type="button" class="page-btn" @click="onPage(4)">4</button>
          <button type="button" class="page-btn" @click="onPage(5)">5</button>
          <button type="button" class="page-btn" disabled aria-label="下一页">›</button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import BreadcrumbNav from '../components/BreadcrumbNav.vue';
import ProductCard from '../components/ProductCard.vue';
import EmptyState from '../components/EmptyState.vue';
import { categories, getCategoryByType } from '../mock/categories.js';
import { getProductsByType } from '../mock/products.js';
import { filterOptions } from '../mock/dicts.js';
import { notReady } from '../utils/notify.js';

// 界面先行阶段：分类 Tab 走路由生效；筛选/搜索/分页为业务动作（占位 toast）
const route = useRoute();
const keyword = ref('');

const tabs = [{ label: '全部', type: '' }, ...categories.map((c) => ({ label: c.name, type: c.type }))];

const currentType = computed(() => route.query.type || '');
const list = computed(() => getProductsByType(currentType.value));

const pageTitle = computed(() => {
  if (!currentType.value) return '全部器材';
  return getCategoryByType(currentType.value)?.name || '全部器材';
});

const filterGroups = computed(() => filterOptions[currentType.value || 'all']);

function onSearch() {
  notReady('搜索');
}
function onFilter(group, opt) {
  notReady(`按「${group} · ${opt}」筛选`);
}
function onPage(n) {
  notReady(`跳转到第 ${n} 页`);
}
</script>

<style scoped>
.product-list__count {
  margin-top: var(--sp-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--ink-faint);
}
.product-list__search {
  display: flex;
  gap: var(--sp-3);
  margin: var(--sp-4) 0 var(--sp-5);
}
.product-list__search .input { max-width: 420px; }
.product-list__layout {
  display: grid;
  grid-template-columns: 232px 1fr;
  gap: var(--sp-5);
  margin-top: var(--sp-5);
}
.filter-panel {
  align-self: start;
  padding: var(--sp-4) var(--sp-5);
}
.filter-panel__title {
  font-size: var(--fs-md);
  letter-spacing: 0.08em;
  padding-bottom: var(--sp-3);
  border-bottom: 1px solid var(--line);
}
@media (max-width: 768px) {
  .product-list__layout { grid-template-columns: 1fr; }
  .product-list__search { flex-direction: column; }
  .product-list__search .input { max-width: none; }
}
</style>
