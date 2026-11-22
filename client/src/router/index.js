import { createRouter, createWebHistory } from 'vue-router';

// 前台与后台路由分离：后台统一挂载在 /admin/* 下，
// 由路由守卫校验 JWT 中的角色，控制管理员页面访问。
//
// 界面先行阶段说明：购物车/结算/订单路由暂不挂 meta.requiresAuth，
// 未登录也可直接访问；阶段 3 接入后端时给这三条路由补回
// `meta: { requiresAuth: true }` 即恢复登录拦截，守卫代码无需改动。
const routes = [
  { path: '/', name: 'home', component: () => import('../views/Home.vue') },
  { path: '/products', name: 'products', component: () => import('../views/ProductList.vue') },
  { path: '/products/:id', name: 'product-detail', component: () => import('../views/ProductDetail.vue') },
  { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'register', component: () => import('../views/Register.vue') },
  { path: '/cart', name: 'cart', component: () => import('../views/Cart.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('../views/Checkout.vue') },
  { path: '/orders', name: 'orders', component: () => import('../views/Orders.vue') },
  { path: '/orders/:id', name: 'order-detail', component: () => import('../views/OrderDetail.vue') },
  // 404 兜底（含 /admin/*，后台阶段再挂真实后台路由）
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFound.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 页面切换回到顶部
  scrollBehavior() {
    return { top: 0 };
  },
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
