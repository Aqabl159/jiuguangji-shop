import { createRouter, createWebHistory } from 'vue-router';

// 前台与后台路由分离：后台统一挂载在 /admin/* 下，
// 由路由守卫校验 JWT 中的角色，控制管理员页面访问
const routes = [
  { path: '/', name: 'home', component: () => import('../views/Home.vue') },
  { path: '/products', name: 'products', component: () => import('../views/PagePlaceholder.vue') },
  // 后续阶段在此追加：/products/:id、/cart、/checkout、/orders、/login、/register、/admin/*
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局路由守卫：
// requiresAuth —— 未登录访问购物车/结算/订单时跳转登录页（登录后回跳）
// requiresAdmin —— 非管理员访问后台时拦截
router.beforeEach((to) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (to.meta.requiresAuth && !token) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (to.meta.requiresAdmin && role !== 'admin') {
    return { name: 'home' };
  }
  return true;
});

export default router;
