<template>
  <router-link :to="`/products/${product.product_id}`" class="product-card perforated-card">
    <div class="product-card__img-wrap">
      <img :src="product.main_image" :alt="product.title" class="product-card__img" />
    </div>
    <div class="product-card__body">
      <p class="product-card__sub">{{ subtitle }}</p>
      <h3 class="product-card__title">{{ product.title }}</h3>
      <div class="product-card__meta">
        <ConditionBadge v-if="showGrade" :grade-code="product.condition_grade_code" />
        <span v-if="isNew" class="status-tag status-tag--completed">全新</span>
      </div>
      <div class="product-card__foot">
        <span class="price"><span class="price__symbol">¥</span>{{ product.price }}</span>
        <span v-if="lowStock" class="product-card__stock">仅剩 {{ product.stock }} 件</span>
        <span v-else class="product-card__stock">有货</span>
      </div>
      <button type="button" class="btn btn-outline btn-sm product-card__cart" @click.prevent.stop="onAdd">
        加入购物车
      </button>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';
import ConditionBadge from './ConditionBadge.vue';
import { frameFormatMap } from '../mock/dicts.js';
import { notReady } from '../utils/notify.js';

// 商品卡：整卡进详情；加购为业务动作（占位 toast）
const props = defineProps({
  product: { type: Object, required: true },
});

const subtitle = computed(() => {
  const p = props.product;
  if (p.product_type === 'camera') return `${p.brand} ${p.model} · ${frameFormatMap[p.frame_format]?.label || ''}`;
  if (p.product_type === 'film') return `${p.brand} · ISO ${p.iso}`;
  return `${p.brand} · ${p.accessory_type}`;
});

const showGrade = computed(
  () => props.product.product_type === 'camera'
    || (props.product.product_type === 'accessory' && !props.product.is_new)
);
const isNew = computed(() => props.product.is_new === 1);
const lowStock = computed(() => props.product.stock > 0 && props.product.stock <= 5);

function onAdd() {
  notReady('加入购物车');
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-raised);
}
.product-card__img-wrap {
  margin: var(--sp-3) var(--sp-3) 0;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
}
.product-card__img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: transform var(--dur) var(--ease);
}
.product-card:hover .product-card__img { transform: scale(1.03); }
.product-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-4) var(--sp-4);
}
.product-card__sub {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: 0.05em;
  color: var(--ink-faint);
}
.product-card__title {
  font-size: var(--fs-sm);
  font-weight: 600;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.9em;
}
.product-card__meta {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  min-height: 24px;
}
.product-card__foot {
  display: flex;
  align-items: baseline;
  gap: var(--sp-2);
  margin-top: auto;
}
.product-card__stock {
  font-size: var(--fs-xs);
  color: var(--ink-faint);
}
.product-card__cart {
  margin-top: var(--sp-3);
  width: 100%;
}
</style>
