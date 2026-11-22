<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <router-link to="/" class="app-header__logo" aria-label="旧光集首页">
        <span class="app-header__logo-mark" aria-hidden="true"></span>
        <span class="app-header__logo-text">旧光集</span>
      </router-link>

      <nav class="app-header__nav" aria-label="主导航">
        <router-link to="/" class="app-header__link" :class="{ 'app-header__link--active': route.path === '/' }">首页</router-link>
        <router-link to="/products" class="app-header__link" :class="{ 'app-header__link--active': route.path.startsWith('/products') }">全部商品</router-link>
        <router-link to="/orders" class="app-header__link" :class="{ 'app-header__link--active': route.path.startsWith('/orders') }">我的订单</router-link>
      </nav>

      <div class="app-header__right">
        <router-link to="/cart" class="app-header__link app-header__cart" :class="{ 'app-header__link--active': route.path.startsWith('/cart') }">
          <span aria-hidden="true">购物车</span>
          <span class="app-header__badge" :aria-label="`${cartCount} 件商品`">{{ cartCount }}</span>
        </router-link>
        <router-link to="/login" class="app-header__link app-header__link--login">登录 / 注册</router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { cartItems } from '../mock/cart.js';

const route = useRoute();
// 购物车角标为静态演示数（界面先行阶段）
const cartCount = cartItems.length;
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(251, 245, 233, 0.96);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(4px);
}
.app-header__inner {
  display: flex;
  align-items: center;
  gap: var(--sp-5);
  min-height: var(--header-h);
}
.app-header__logo {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
}
.app-header__logo-mark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--accent);
  border-radius: 50%;
  position: relative;
  flex: none;
}
.app-header__logo-mark::before {
  content: '';
  position: absolute;
  inset: 2px;
  background: var(--accent);
  transform: rotate(45deg);
  border-radius: 2px;
}
.app-header__logo-text {
  font-family: var(--font-display);
  font-size: var(--fs-md);
  font-weight: 900;
  letter-spacing: 0.15em;
  color: var(--ink);
}
.app-header__nav {
  display: flex;
  gap: var(--sp-4);
}
.app-header__link {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  padding: var(--sp-2) var(--sp-1);
  font-size: var(--fs-sm);
  color: var(--ink-soft);
  border-bottom: 2px solid transparent;
  transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.app-header__link:hover { color: var(--accent); }
.app-header__link--active {
  color: var(--accent);
  font-weight: 600;
  border-bottom-color: var(--accent);
}
.app-header__right {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  margin-left: auto;
}
.app-header__badge {
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--surface);
  background: var(--accent);
  border-radius: 10px;
}
@media (max-width: 768px) {
  .app-header__inner { flex-wrap: wrap; gap: 0 var(--sp-4); padding: var(--sp-2) 0; }
  .app-header__nav {
    order: 3;
    width: 100%;
    justify-content: space-between;
    border-top: 1px dashed var(--line);
  }
}
</style>
