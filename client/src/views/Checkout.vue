<template>
  <div class="container checkout">
    <div class="page-head">
      <BreadcrumbNav :items="[{ label: '购物车', to: '/cart' }, { label: '结算' }]" />
      <h1 class="page-head__title">确认订单</h1>
    </div>

    <div class="checkout__layout">
      <!-- 收货信息 -->
      <section class="checkout__form perforated-card" aria-label="收货信息">
        <h2 class="checkout__form-title">收货信息</h2>
        <form novalidate @submit.prevent="onSubmit">
          <div class="field">
            <label for="co-name">收货人</label>
            <input
              id="co-name"
              v-model.trim="form.name"
              type="text"
              class="input"
              autocomplete="name"
              placeholder="请输入收货人姓名"
              :aria-invalid="!!errors.name"
              @blur="validateName"
            />
            <p v-if="errors.name" class="field-error" role="alert">{{ errors.name }}</p>
          </div>
          <div class="field">
            <label for="co-phone">联系电话</label>
            <input
              id="co-phone"
              v-model.trim="form.phone"
              type="tel"
              class="input"
              autocomplete="tel"
              placeholder="请输入 11 位手机号"
              :aria-invalid="!!errors.phone"
              @blur="validatePhone"
            />
            <p v-if="errors.phone" class="field-error" role="alert">{{ errors.phone }}</p>
          </div>
          <div class="field">
            <label for="co-address">收货地址</label>
            <textarea
              id="co-address"
              v-model.trim="form.address"
              class="textarea"
              rows="3"
              autocomplete="street-address"
              placeholder="省 / 市 / 区 / 街道 / 门牌号"
              :aria-invalid="!!errors.address"
              @blur="validateAddress"
            ></textarea>
            <p v-if="errors.address" class="field-error" role="alert">{{ errors.address }}</p>
          </div>
          <button type="submit" class="btn btn-primary checkout__submit">提交订单</button>
        </form>
      </section>

      <!-- 订单明细 -->
      <aside class="checkout__summary" aria-label="订单明细">
        <div class="summary-card perforated-card">
          <h2 class="summary-card__title">订单明细</h2>
          <div v-for="item in items" :key="item.cart_id" class="receipt-row checkout__row">
            <img :src="item.main_image" :alt="item.title" class="receipt-row__img" />
            <div class="receipt-row__main">
              <p class="receipt-row__title">{{ item.title }}</p>
              <p class="receipt-row__sub">数量 × {{ item.quantity }}</p>
            </div>
            <p class="receipt-row__amount">¥{{ item.price * item.quantity }}</p>
          </div>
          <div class="summary-row">
            <span>商品金额</span>
            <span class="summary-row__value">¥{{ goodsTotal }}</span>
          </div>
          <div class="summary-row">
            <span>运费</span>
            <span class="summary-row__value">{{ goodsTotal >= 199 ? '免运费' : '¥12' }}</span>
          </div>
          <div class="summary-total">
            <span>实付金额</span>
            <span class="summary-total__value">¥{{ payableTotal }}</span>
          </div>
          <p class="checkout__pay-note">支付为模拟流程：提交订单后进入「待付款」，点击模拟支付即完成付款</p>
          <p class="stamp checkout__stamp">旧光集</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import BreadcrumbNav from '../components/BreadcrumbNav.vue';
import { cartItems } from '../mock/cart.js';
import { notReady } from '../utils/notify.js';

// 界面先行阶段：表单仅本地校验，提交订单为业务动作（占位 toast）
const PHONE_RE = /^1[3-9]\d{9}$/;

const items = cartItems;
const form = reactive({ name: '', phone: '', address: '' });
const errors = reactive({ name: '', phone: '', address: '' });

const goodsTotal = computed(() =>
  items.reduce((sum, it) => sum + it.price * it.quantity, 0)
);
const payableTotal = computed(() => goodsTotal.value + (goodsTotal.value >= 199 ? 0 : 12));

function validateName() {
  errors.name = form.name ? '' : '请输入收货人姓名';
}
function validatePhone() {
  errors.phone = PHONE_RE.test(form.phone) ? '' : '请输入正确的 11 位手机号';
}
function validateAddress() {
  errors.address = form.address.length >= 5 ? '' : '请输入详细收货地址';
}

function onSubmit() {
  validateName();
  validatePhone();
  validateAddress();
  if (errors.name || errors.phone || errors.address) return;
  notReady('提交订单');
}
</script>

<style scoped>
.checkout__layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: var(--sp-5);
  align-items: start;
}
.checkout__form {
  padding: var(--sp-5) var(--sp-6);
}
.checkout__form-title {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--fs-md);
  margin-bottom: var(--sp-4);
  padding-bottom: var(--sp-3);
  border-bottom: 1px solid var(--line);
}
.checkout__form-title::before {
  content: '';
  width: 8px;
  height: 8px;
  background: var(--accent);
  transform: rotate(45deg);
  flex: none;
}
.checkout__submit {
  width: 100%;
  margin-top: var(--sp-2);
}
.checkout__row {
  padding: var(--sp-3) 0;
}
.checkout__pay-note {
  margin: var(--sp-3) 0;
  font-size: var(--fs-xs);
  color: var(--ink-faint);
  line-height: 1.7;
}
.checkout__stamp {
  display: block;
  width: fit-content;
  margin: var(--sp-2) auto 0;
}
@media (max-width: 900px) {
  .checkout__layout { grid-template-columns: 1fr; }
}
</style>
