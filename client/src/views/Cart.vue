<template>
  <div class="container cart">
    <div class="page-head">
      <BreadcrumbNav :items="[{ label: '购物车' }]" />
      <h1 class="page-head__title">购物车</h1>
    </div>

    <EmptyState v-if="!rows.length" title="购物车还是空的" hint="去挑一台旧相机，或囤几卷胶卷">
      <router-link to="/products" class="btn btn-outline">去逛逛</router-link>
    </EmptyState>

    <template v-else>
      <div class="cart__layout">
        <!-- 购物车条目 -->
        <section class="cart__list perforated-card" aria-label="购物车商品">
          <div v-for="(row, i) in rows" :key="row.cart_id" class="receipt-row">
            <router-link :to="`/products/${row.product_id}`">
              <img :src="row.main_image" :alt="row.title" class="receipt-row__img" />
            </router-link>
            <div class="receipt-row__main">
              <router-link :to="`/products/${row.product_id}`" class="receipt-row__title">{{ row.title }}</router-link>
              <p class="receipt-row__sub">
                <span class="price"><span class="price__symbol">¥</span>{{ row.price }}</span>
                <span> · 库存 {{ row.stock }} 件</span>
              </p>
            </div>
            <QuantityStepper v-model="rows[i].quantity" :max="row.stock" />
            <p class="receipt-row__amount">¥{{ row.price * rows[i].quantity }}</p>
            <button type="button" class="btn btn-ghost btn-sm" :aria-label="`删除 ${row.title}`" @click="onRemove(row.title)">删除</button>
          </div>
        </section>

        <!-- 合计 -->
        <aside class="summary-card perforated-card cart__summary" aria-label="金额合计">
          <h2 class="summary-card__title">金额明细</h2>
          <div class="summary-row">
            <span>商品金额</span>
            <span class="summary-row__value">¥{{ goodsTotal }}</span>
          </div>
          <div class="summary-row">
            <span>运费</span>
            <span class="summary-row__value">{{ goodsTotal >= 199 ? '免运费' : '¥12' }}</span>
          </div>
          <div class="summary-row">
            <span>实付</span>
            <span class="summary-total__value">¥{{ payableTotal }}</span>
          </div>
          <p class="cart__ship-note">满 ¥199 免运费，从暗房寄出的每一件都包得严严实实</p>
          <router-link to="/checkout" class="btn btn-primary cart__checkout">去结算</router-link>
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import BreadcrumbNav from '../components/BreadcrumbNav.vue';
import QuantityStepper from '../components/QuantityStepper.vue';
import EmptyState from '../components/EmptyState.vue';
import { cartItems } from '../mock/cart.js';
import { notReady } from '../utils/notify.js';

// 界面先行阶段：步进器为展示型交互（本地生效）；删除为业务动作（占位 toast）
const rows = ref(cartItems.map((item) => ({ ...item })));

const goodsTotal = computed(() =>
  rows.value.reduce((sum, r) => sum + r.price * r.quantity, 0)
);
const payableTotal = computed(() => goodsTotal.value + (goodsTotal.value >= 199 ? 0 : 12));

function onRemove(title) {
  notReady(`删除「${title}」`);
}
</script>

<style scoped>
.cart__layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--sp-5);
  align-items: start;
}
.cart__list {
  padding: 0 var(--sp-5);
}
.cart__summary {
  position: sticky;
  top: calc(var(--header-h) + var(--sp-4));
}
.cart__ship-note {
  margin: var(--sp-3) 0;
  font-size: var(--fs-xs);
  color: var(--ink-faint);
}
.cart__checkout {
  width: 100%;
}
@media (max-width: 900px) {
  .cart__layout { grid-template-columns: 1fr; }
}
</style>
