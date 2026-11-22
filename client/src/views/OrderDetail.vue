<template>
  <div class="container order-detail">
    <EmptyState
      v-if="!order"
      title="这张订单不存在"
      hint="订单号可能有误，或该订单已被移除"
    >
      <router-link to="/orders" class="btn btn-outline">返回我的订单</router-link>
    </EmptyState>

    <template v-else>
      <div class="page-head">
        <BreadcrumbNav :items="[{ label: '我的订单', to: '/orders' }, { label: order.order_no }]" />
        <div class="order-detail__head">
          <h1 class="page-head__title">订单详情</h1>
          <div class="order-detail__head-meta">
            <OrderStatusTag :status="order.status" />
            <span class="order-detail__no">{{ order.order_no }}</span>
          </div>
        </div>
      </div>

      <div class="order-detail__layout">
        <div class="order-detail__main">
          <!-- 状态时间线 -->
          <section class="timeline-card perforated-card" aria-label="订单进度">
            <h2 class="timeline-card__title">订单进度</h2>
            <ol class="timeline">
              <li
                v-for="step in steps"
                :key="step.label"
                class="timeline__step"
                :class="`timeline__step--${step.state}`"
              >
                <span class="timeline__dot" aria-hidden="true"></span>
                <div class="timeline__text">
                  <p class="timeline__label">{{ step.label }}</p>
                  <p v-if="step.time" class="timeline__time">{{ step.time }}</p>
                </div>
              </li>
            </ol>
          </section>

          <!-- 订单项 -->
          <section class="items-card perforated-card" aria-label="订单商品">
            <h2 class="items-card__title">订单商品</h2>
            <div v-for="item in order.items" :key="item.product_id" class="receipt-row">
              <router-link :to="`/products/${item.product_id}`">
                <img :src="item.main_image" :alt="item.title" class="receipt-row__img" />
              </router-link>
              <div class="receipt-row__main">
                <router-link :to="`/products/${item.product_id}`" class="receipt-row__title">{{ item.title }}</router-link>
                <p class="receipt-row__sub">
                  <span class="price"><span class="price__symbol">¥</span>{{ item.price }}</span>
                  <span> × {{ item.quantity }}</span>
                </p>
              </div>
              <p class="receipt-row__amount">¥{{ item.price * item.quantity }}</p>
            </div>
          </section>
        </div>

        <aside class="order-detail__side">
          <!-- 收货信息 -->
          <div class="summary-card perforated-card">
            <h2 class="summary-card__title">收货信息</h2>
            <dl class="receiver">
              <div class="receiver__row"><dt>收货人</dt><dd>{{ order.receiver_name }}</dd></div>
              <div class="receiver__row"><dt>联系电话</dt><dd>{{ order.receiver_phone }}</dd></div>
              <div class="receiver__row"><dt>收货地址</dt><dd>{{ order.receiver_address }}</dd></div>
            </dl>
          </div>

          <!-- 金额 -->
          <div class="summary-card perforated-card">
            <h2 class="summary-card__title">金额明细</h2>
            <div class="summary-row">
              <span>商品金额</span>
              <span class="summary-row__value">¥{{ order.total_amount }}</span>
            </div>
            <div class="summary-row">
              <span>运费</span>
              <span class="summary-row__value">{{ order.total_amount >= 199 ? '免运费' : '¥12' }}</span>
            </div>
            <div class="summary-total">
              <span>实付</span>
              <span class="summary-total__value">¥{{ order.total_amount }}</span>
            </div>
          </div>

          <!-- 操作区 -->
          <div class="order-detail__actions">
            <template v-if="order.status === 'pending_pay'">
              <button type="button" class="btn btn-primary" @click="onAction('模拟支付')">模拟支付</button>
              <button type="button" class="btn btn-danger" @click="onAction('取消订单')">取消订单</button>
            </template>
            <button v-else-if="order.status === 'shipped'" type="button" class="btn btn-primary" @click="onAction('确认收货')">确认收货</button>
            <button
              v-else-if="order.status === 'completed' && !order.reviewed"
              type="button"
              class="btn btn-outline"
              @click="reviewVisible = true"
            >评价本单</button>
          </div>
        </aside>
      </div>

      <ReviewDialog
        v-model:visible="reviewVisible"
        :title="order.items[0]?.title || '本单商品'"
        @submit="onReviewSubmit"
      />
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import BreadcrumbNav from '../components/BreadcrumbNav.vue';
import OrderStatusTag from '../components/OrderStatusTag.vue';
import EmptyState from '../components/EmptyState.vue';
import ReviewDialog from '../components/ReviewDialog.vue';
import { getOrderById } from '../mock/orders.js';
import { notReady } from '../utils/notify.js';

// 界面先行阶段：时间线为展示型渲染；支付/取消/收货为业务动作（占位 toast）
const route = useRoute();
const order = computed(() => getOrderById(route.params.id));
const reviewVisible = ref(false);

// 按状态派生时间线节点：done=已完成 / current=当前节点 / future=未到达
const STATUS_INDEX = { pending_pay: 1, paid: 2, shipped: 3, completed: 4 };

const steps = computed(() => {
  const o = order.value;
  if (!o) return [];
  if (o.status === 'cancelled') {
    return [
      { label: '提交订单', time: o.created_at, state: 'done' },
      { label: '订单已取消', time: null, state: 'cancelled' },
    ];
  }
  const current = STATUS_INDEX[o.status] ?? 1;
  const nodes = [
    { label: '提交订单', time: o.created_at },
    { label: '付款', time: o.paid_at },
    { label: '发货', time: o.shipped_at },
    { label: '确认收货', time: o.completed_at },
  ];
  return nodes.map((n, i) => ({
    ...n,
    state: i < current ? 'done' : i === current ? 'current' : 'future',
  }));
});

function onAction(action) {
  notReady(action);
}

function onReviewSubmit() {
  // 提交提示已在 ReviewDialog 内部统一处理（notReady）
}
</script>

<style scoped>
.order-detail__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--sp-3);
}
.order-detail__head-meta {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.order-detail__no {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--ink-faint);
}
.order-detail__layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--sp-5);
  align-items: start;
}
.order-detail__main {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}
.timeline-card,
.items-card {
  padding: var(--sp-5);
}
.timeline-card__title,
.items-card__title {
  font-size: var(--fs-md);
  margin-bottom: var(--sp-4);
  padding-bottom: var(--sp-3);
  border-bottom: 1px solid var(--line);
}

/* 时间线 */
.timeline {
  display: flex;
  flex-direction: column;
}
.timeline__step {
  position: relative;
  display: flex;
  gap: var(--sp-4);
  padding-bottom: var(--sp-5);
}
.timeline__step:last-child { padding-bottom: 0; }
.timeline__step::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 18px;
  bottom: 0;
  width: 2px;
  background: var(--line);
}
.timeline__step:last-child::before { display: none; }
.timeline__dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--line);
  background: var(--surface);
  flex: none;
  margin-top: 2px;
  z-index: 1;
}
.timeline__step--done .timeline__dot {
  background: var(--accent);
  border-color: var(--accent);
}
.timeline__step--current .timeline__dot {
  border-color: var(--gold);
  box-shadow: 0 0 0 4px rgba(185, 138, 47, 0.25);
}
.timeline__step--cancelled .timeline__dot {
  background: var(--danger);
  border-color: var(--danger);
}
.timeline__label {
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--ink);
}
.timeline__step--future .timeline__label { color: var(--ink-faint); }
.timeline__step--cancelled .timeline__label { color: var(--danger); }
.timeline__step--current .timeline__label { color: var(--accent); }
.timeline__time {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--ink-faint);
  margin-top: var(--sp-1);
}

/* 收货信息 */
.receiver { display: flex; flex-direction: column; }
.receiver__row {
  display: flex;
  gap: var(--sp-3);
  padding: var(--sp-2) 0;
  font-size: var(--fs-sm);
}
.receiver__row dt {
  flex: none;
  width: 4.5em;
  color: var(--ink-soft);
}
.receiver__row dd { color: var(--ink); }

.order-detail__side {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}
.order-detail__actions {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.order-detail__actions .btn { width: 100%; }

@media (max-width: 900px) {
  .order-detail__layout { grid-template-columns: 1fr; }
}
</style>
