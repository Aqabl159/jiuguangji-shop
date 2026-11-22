<template>
  <div class="container orders">
    <div class="page-head">
      <BreadcrumbNav :items="[{ label: '我的订单' }]" />
      <h1 class="page-head__title">我的订单</h1>
    </div>

    <!-- 状态 Tab -->
    <div class="tab-bar" role="tablist" aria-label="订单状态筛选">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        class="tab-item"
        :class="{ 'tab-item--active': activeTab === tab.value }"
        role="tab"
        :aria-selected="activeTab === tab.value"
        @click="activeTab = tab.value"
      >{{ tab.label }}</button>
    </div>

    <!-- 订单列表 -->
    <EmptyState v-if="!filtered.length" title="没有相关订单" hint="换个状态筛选看看" />
    <ul v-else class="orders__list">
      <li v-for="order in filtered" :key="order.order_id" class="order-card perforated-card">
        <router-link :to="`/orders/${order.order_id}`" class="order-card__inner">
          <div class="order-card__head">
            <span class="order-card__no">{{ order.order_no }}</span>
            <span class="order-card__date">{{ order.created_at }}</span>
            <OrderStatusTag :status="order.status" />
          </div>
          <div class="order-card__body">
            <div class="order-card__items">
              <img
                v-for="item in order.items"
                :key="item.product_id"
                :src="item.main_image"
                :alt="item.title"
                :title="item.title"
                class="order-card__thumb"
              />
              <p class="order-card__titles">{{ order.items.map((i) => i.title).join(' / ') }}</p>
            </div>
            <p class="order-card__amount">
              <span class="order-card__amount-label">共 {{ totalCount(order) }} 件 · 实付</span>
              <span class="price price--lg"><span class="price__symbol">¥</span>{{ order.total_amount }}</span>
            </p>
          </div>
          <div class="order-card__actions" @click.prevent>
            <template v-if="order.status === 'pending_pay'">
              <button type="button" class="btn btn-primary btn-sm" @click="onAction('模拟支付')">去支付</button>
              <button type="button" class="btn btn-danger btn-sm" @click="onAction('取消订单')">取消订单</button>
            </template>
            <button v-else-if="order.status === 'shipped'" type="button" class="btn btn-primary btn-sm" @click="onAction('确认收货')">确认收货</button>
            <button
              v-else-if="order.status === 'completed' && !order.reviewed"
              type="button"
              class="btn btn-outline btn-sm"
              @click="openReview(order)"
            >评价本单</button>
          </div>
        </router-link>
      </li>
    </ul>

    <!-- 评价弹窗 -->
    <ReviewDialog
      v-model:visible="reviewVisible"
      :title="reviewTitle"
      @submit="onReviewSubmit"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import BreadcrumbNav from '../components/BreadcrumbNav.vue';
import OrderStatusTag from '../components/OrderStatusTag.vue';
import EmptyState from '../components/EmptyState.vue';
import ReviewDialog from '../components/ReviewDialog.vue';
import { orders } from '../mock/orders.js';
import { orderStatusMap } from '../mock/dicts.js';
import { notReady } from '../utils/notify.js';

// 界面先行阶段：状态 Tab 为展示型交互（本地过滤生效）；支付/取消/收货为业务动作（占位 toast）
const tabs = [
  { label: '全部', value: '' },
  ...Object.entries(orderStatusMap).map(([value, info]) => ({ label: info.label, value })),
];

const activeTab = ref('');
const filtered = computed(() =>
  activeTab.value ? orders.filter((o) => o.status === activeTab.value) : orders
);

const reviewVisible = ref(false);
const reviewTitle = ref('');

function totalCount(order) {
  return order.items.reduce((sum, it) => sum + it.quantity, 0);
}

function onAction(action) {
  notReady(action);
}

function openReview(order) {
  reviewTitle.value = order.items[0]?.title || '本单商品';
  reviewVisible.value = true;
}

function onReviewSubmit() {
  // 提交提示已在 ReviewDialog 内部统一处理（notReady）
}
</script>

<style scoped>
.orders__list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  margin-top: var(--sp-5);
}
.order-card {
  overflow: hidden;
  transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.order-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-raised);
}
.order-card__inner {
  display: block;
  padding: var(--sp-4) var(--sp-5);
}
.order-card__head {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
  padding-bottom: var(--sp-3);
  border-bottom: 1px dashed var(--line);
}
.order-card__no {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--ink);
}
.order-card__date {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--ink-faint);
}
.order-card__head .status-tag { margin-left: auto; }
.order-card__body {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-3) 0;
}
.order-card__items {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex: 1;
  min-width: 0;
}
.order-card__thumb {
  width: 52px;
  height: 39px;
  object-fit: cover;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  flex: none;
}
.order-card__titles {
  font-size: var(--fs-xs);
  color: var(--ink-soft);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.order-card__amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: none;
}
.order-card__amount-label {
  font-size: var(--fs-xs);
  color: var(--ink-faint);
}
.order-card__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-3);
  padding-top: var(--sp-3);
  border-top: 1px dashed var(--line);
}
@media (max-width: 768px) {
  .order-card__body { flex-direction: column; align-items: flex-start; }
  .order-card__amount { flex-direction: row; gap: var(--sp-2); align-items: baseline; }
}
</style>
