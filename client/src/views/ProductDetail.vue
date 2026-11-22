<template>
  <div class="container product-detail">
    <!-- 商品不存在 -->
    <EmptyState
      v-if="!product"
      title="这张底片找不到"
      hint="该商品可能已下架或地址有误"
    >
      <router-link to="/products" class="btn btn-outline">返回商品列表</router-link>
    </EmptyState>

    <template v-else>
      <!-- 页头 -->
      <div class="page-head">
        <BreadcrumbNav :items="[{ label: categoryName, to: { path: '/products', query: { type: product.product_type } } }, { label: product.title }]" />
      </div>

      <div class="detail-layout">
        <!-- 左：画廊 -->
        <section class="gallery" aria-label="商品图片">
          <img :src="mainImage" :alt="product.title" class="gallery__main" />
          <div class="gallery__thumbs">
            <button
              v-for="(img, i) in product.images"
              :key="i"
              type="button"
              class="gallery__thumb"
              :class="{ 'gallery__thumb--active': img === mainImage }"
              :aria-label="`查看第 ${i + 1} 张图片`"
              @click="mainImage = img"
            >
              <img :src="img" :alt="`${product.title} 图 ${i + 1}`" />
            </button>
          </div>
        </section>

        <!-- 右：商品信息（按品类差异化渲染） -->
        <section class="info">
          <p class="info__sub">{{ subtitle }}</p>
          <h1 class="info__title">{{ product.title }}</h1>
          <div class="info__price-row">
            <span class="price price--lg"><span class="price__symbol">¥</span>{{ product.price }}</span>
            <span class="info__stock" :class="{ 'info__stock--low': product.stock <= 5 }">
              {{ product.stock > 0 ? `库存 ${product.stock} 件` : '已售罄' }}
            </span>
          </div>

          <!-- 成色与新旧 -->
          <div class="info__badges">
            <ConditionBadge v-if="showGrade" :grade-code="product.condition_grade_code" />
            <span v-if="product.is_new === 1" class="status-tag status-tag--completed">全新</span>
            <span v-if="product.product_type === 'accessory' && product.is_new === 0" class="status-tag status-tag--paid">二手</span>
          </div>

          <!-- ======== 二手相机 ======== -->
          <template v-if="product.product_type === 'camera'">
            <table class="spec-table">
              <tbody>
                <tr>
                  <th scope="row">画幅规格</th>
                  <td>{{ frameFormatLabel }}</td>
                </tr>
                <tr>
                  <th scope="row">快门状态</th>
                  <td><span class="status-tag" :class="shutterState.className">{{ shutterState.label }}</span></td>
                </tr>
                <tr>
                  <th scope="row">快门数</th>
                  <td>
                    <span v-if="product.shutter_count != null" class="lcd">{{ product.shutter_count }}</span>
                    <span v-else class="info__na">未记录</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">器材来源</th>
                  <td><span class="status-tag" :class="sourceState.className">{{ sourceState.label }}</span></td>
                </tr>
              </tbody>
            </table>

            <!-- 检测项清单 -->
            <div class="info__block">
              <h2 class="info__block-title">逐项检测报告</h2>
              <table class="spec-table inspect-table">
                <thead>
                  <tr>
                    <th scope="col">检测项</th>
                    <th scope="col">结果</th>
                    <th scope="col">备注</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in product.inspection_items" :key="item.item_name">
                    <td>{{ item.item_name }}</td>
                    <td><span :class="detectState(item.result).className">{{ detectState(item.result).label }}</span></td>
                    <td class="inspect-table__note">{{ item.note || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 检测总结 -->
            <div class="note-block">
              <p class="note-block__title">检测总结</p>
              <p>{{ product.detect_summary }}</p>
            </div>

            <!-- 成色等级说明 -->
            <div v-if="grade" class="info__block">
              <h2 class="info__block-title">成色等级说明 · {{ grade.name }}</h2>
              <ul class="grade-desc">
                <li><span>外观</span>{{ grade.appearanceDesc }}</li>
                <li><span>功能</span>{{ grade.functionDesc }}</li>
                <li><span>配件</span>{{ grade.accessoryDesc }}</li>
              </ul>
            </div>
          </template>

          <!-- ======== 全新胶卷 ======== -->
          <template v-else-if="product.product_type === 'film'">
            <div class="iso-display">
              <span class="iso-display__num">{{ product.iso }}</span>
              <span class="iso-display__unit">ISO</span>
            </div>
            <table class="spec-table">
              <tbody>
                <tr>
                  <th scope="row">画幅规格</th>
                  <td>{{ frameFormatLabel }}</td>
                </tr>
                <tr>
                  <th scope="row">有效期至</th>
                  <td><span class="expiry-stamp">{{ product.expiry_date }}</span></td>
                </tr>
              </tbody>
            </table>
            <div class="note-block">
              <p class="note-block__title">储存条件</p>
              <p>{{ product.storage_note }}</p>
            </div>
          </template>

          <!-- ======== 相机配件 ======== -->
          <template v-else>
            <table class="spec-table">
              <tbody>
                <tr>
                  <th scope="row">配件类型</th>
                  <td>{{ product.accessory_type }}</td>
                </tr>
                <tr>
                  <th scope="row">适配机型</th>
                  <td>{{ product.compatible_model }}</td>
                </tr>
              </tbody>
            </table>
            <div v-if="grade" class="info__block">
              <h2 class="info__block-title">成色等级说明 · {{ grade.name }}</h2>
              <ul class="grade-desc">
                <li><span>外观</span>{{ grade.appearanceDesc }}</li>
                <li><span>功能</span>{{ grade.functionDesc }}</li>
                <li><span>配件</span>{{ grade.accessoryDesc }}</li>
              </ul>
            </div>
          </template>

          <!-- 加购区 -->
          <div class="info__buy">
            <QuantityStepper v-model="quantity" :max="product.stock" />
            <button type="button" class="btn btn-primary info__buy-btn" @click="onAddToCart">加入购物车</button>
          </div>
        </section>
      </div>

      <!-- 用户评价 -->
      <section class="reviews">
        <h2 class="section-title">用户评价</h2>
        <div v-if="reviews.length" class="reviews__body">
          <div class="reviews__summary perforated-card">
            <p class="reviews__avg">{{ avg.toFixed(1) }}</p>
            <StarRating :model-value="Math.round(avg)" />
            <p class="reviews__count">共 {{ reviews.length }} 条评价</p>
          </div>
          <ul class="reviews__list">
            <li v-for="r in reviews" :key="r.review_id" class="review-item">
              <div class="review-item__head">
                <span class="review-item__user">{{ r.username }}</span>
                <StarRating :model-value="r.rating" />
                <span class="review-item__date">{{ r.created_at }}</span>
              </div>
              <p class="review-item__content">{{ r.content }}</p>
            </li>
          </ul>
        </div>
        <EmptyState v-else title="还没有评价" hint="完成订单后即可评价本商品" />
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import BreadcrumbNav from '../components/BreadcrumbNav.vue';
import ConditionBadge from '../components/ConditionBadge.vue';
import StarRating from '../components/StarRating.vue';
import QuantityStepper from '../components/QuantityStepper.vue';
import EmptyState from '../components/EmptyState.vue';
import { getProductById, getConditionGrade } from '../mock/products.js';
import { getProductReviews, calcAvg } from '../mock/reviews.js';
import { getCategoryByType } from '../mock/categories.js';
import { frameFormatMap, shutterStatusMap, detectResultMap, sourceMap } from '../mock/dicts.js';
import { notReady } from '../utils/notify.js';

// 界面先行阶段：缩略图切换为展示型交互（本地生效）；加购为业务动作（占位 toast）
const route = useRoute();
const product = computed(() => getProductById(route.params.id));

const mainImage = ref('');
// 商品变化（切换路由）时重置主图
watch(
  () => route.params.id,
  () => {
    mainImage.value = product.value?.images?.[0] || '';
  },
  { immediate: true }
);

const quantity = ref(1);

const categoryName = computed(() => getCategoryByType(product.value?.product_type)?.name || '');
const subtitle = computed(() => {
  const p = product.value;
  if (!p) return '';
  if (p.product_type === 'camera') return `${p.brand} ${p.model} · ${frameFormatMap[p.frame_format]?.label || ''}`;
  if (p.product_type === 'film') return `${p.brand} · 135/120 胶卷`;
  return `${p.brand}`;
});
const frameFormatLabel = computed(() => frameFormatMap[product.value?.frame_format]?.label || '—');
const shutterState = computed(() => shutterStatusMap[product.value?.shutter_status] || { label: '—', className: '' });
const sourceState = computed(() => sourceMap[product.value?.source] || { label: '—', className: '' });
const showGrade = computed(
  () => product.value?.condition_grade_code
    && (product.value.product_type === 'camera' || product.value.product_type === 'accessory')
);
const grade = computed(() => (product.value ? getConditionGrade(product.value) : null));

const reviews = computed(() => (product.value ? getProductReviews(product.value.product_id) : []));
const avg = computed(() => (product.value ? calcAvg(product.value.product_id) : 0));

function detectState(result) {
  return detectResultMap[result] || { label: '—', className: '' };
}

function onAddToCart() {
  notReady('加入购物车');
}
</script>

<style scoped>
.product-detail {
  padding-bottom: var(--sp-7);
}

/* ---- 画廊 ---- */
.detail-layout {
  display: grid;
  grid-template-columns: minmax(320px, 1.1fr) 1fr;
  gap: var(--sp-6);
}
.gallery__main {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface);
}
.gallery__thumbs {
  display: flex;
  gap: var(--sp-2);
  margin-top: var(--sp-3);
  flex-wrap: wrap;
}
.gallery__thumb {
  width: 76px;
  height: 57px;
  padding: 0;
  border: 2px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  transition: border-color var(--dur) var(--ease);
}
.gallery__thumb--active { border-color: var(--accent); }
.gallery__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ---- 信息区 ---- */
.info__sub {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  letter-spacing: 0.06em;
  color: var(--ink-faint);
}
.info__title {
  font-size: var(--fs-xl);
  line-height: 1.4;
  margin: var(--sp-2) 0 var(--sp-3);
}
.info__price-row {
  display: flex;
  align-items: baseline;
  gap: var(--sp-3);
  margin-bottom: var(--sp-3);
}
.info__stock {
  font-size: var(--fs-sm);
  color: var(--success);
}
.info__stock--low { color: var(--warn); }
.info__badges {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-bottom: var(--sp-4);
}
.info__na { color: var(--ink-faint); }

.info__block { margin-top: var(--sp-5); }
.info__block-title {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--fs-md);
  margin-bottom: var(--sp-3);
}
.info__block-title::before {
  content: '';
  width: 7px;
  height: 7px;
  background: var(--accent);
  transform: rotate(45deg);
  flex: none;
}

/* 检测表 */
.inspect-table th,
.inspect-table td { font-size: var(--fs-sm); }
.inspect-table__note { color: var(--ink-soft); }

/* 成色说明 */
.grade-desc {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  font-size: var(--fs-sm);
  color: var(--ink-soft);
}
.grade-desc li {
  display: flex;
  gap: var(--sp-3);
  padding: var(--sp-2) var(--sp-3);
  background: var(--paper-deep);
  border-radius: var(--radius);
}
.grade-desc span {
  flex: none;
  width: 3em;
  font-weight: 600;
  color: var(--ink);
}

/* 胶卷感光度大字 */
.iso-display {
  display: flex;
  align-items: baseline;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}
.iso-display__num {
  font-family: var(--font-mono);
  font-size: 44px;
  font-weight: 700;
  color: var(--accent);
}
.iso-display__unit {
  font-family: var(--font-mono);
  font-size: var(--fs-md);
  color: var(--ink-faint);
}

/* 有效期日期章印 */
.expiry-stamp {
  display: inline-block;
  padding: 1px 10px;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--danger);
  border: 2px dashed var(--danger);
  border-radius: var(--radius);
  transform: rotate(-2deg);
}

/* 加购区 */
.info__buy {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  margin-top: var(--sp-5);
  padding-top: var(--sp-4);
  border-top: 1px dashed var(--line);
}
.info__buy-btn { flex: 1; max-width: 260px; }

/* ---- 评价区 ---- */
.reviews {
  margin-top: var(--sp-7);
}
.reviews__body {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--sp-5);
  align-items: start;
}
.reviews__summary {
  padding: var(--sp-5);
  text-align: center;
}
.reviews__avg {
  font-family: var(--font-mono);
  font-size: var(--fs-hero);
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
  margin-bottom: var(--sp-2);
}
.reviews__count {
  margin-top: var(--sp-2);
  font-size: var(--fs-xs);
  color: var(--ink-faint);
}
.reviews__list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}
.review-item {
  padding: var(--sp-4) var(--sp-5);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}
.review-item__head {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
  margin-bottom: var(--sp-2);
}
.review-item__user {
  font-weight: 600;
  font-size: var(--fs-sm);
}
.review-item__date {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--ink-faint);
}
.review-item__content {
  font-size: var(--fs-sm);
  color: var(--ink-soft);
  line-height: 1.8;
}

@media (max-width: 900px) {
  .detail-layout { grid-template-columns: 1fr; }
  .reviews__body { grid-template-columns: 1fr; }
}
</style>
