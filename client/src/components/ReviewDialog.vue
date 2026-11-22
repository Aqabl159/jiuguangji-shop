<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="review-dialog"
      role="dialog"
      aria-modal="true"
      :aria-label="`评价${title}`"
      @click.self="close"
      @keydown.esc="close"
    >
      <div class="review-dialog__panel perforated-card">
        <h3 class="review-dialog__title">评价「{{ title }}」</h3>
        <div class="review-dialog__field">
          <label class="review-dialog__label">评分</label>
          <StarRating v-model="rating" :interactive="true" />
        </div>
        <div class="review-dialog__field">
          <label class="review-dialog__label" for="review-content">评价内容</label>
          <textarea
            id="review-content"
            v-model="content"
            class="textarea"
            rows="4"
            maxlength="500"
            placeholder="说说这台器材的使用感受、成色是否与描述一致…"
          ></textarea>
          <span class="review-dialog__count">{{ content.length }}/500</span>
        </div>
        <p v-if="error" class="field-error" role="alert">{{ error }}</p>
        <div class="review-dialog__actions">
          <button type="button" class="btn btn-ghost" @click="close">取消</button>
          <button type="button" class="btn btn-primary" @click="submit">提交评价</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import StarRating from './StarRating.vue';
import { notReady } from '../utils/notify.js';

// 评价弹窗：星级必选、内容必填；提交为业务动作（占位 toast）
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '本单商品' },
});
const emit = defineEmits(['update:visible', 'submit']);

const rating = ref(0);
const content = ref('');
const error = ref('');

function close() {
  emit('update:visible', false);
  rating.value = 0;
  content.value = '';
  error.value = '';
}

function submit() {
  if (rating.value < 1) {
    error.value = '请选择评分（1-5 星）';
    return;
  }
  if (!content.value.trim()) {
    error.value = '请填写评价内容';
    return;
  }
  error.value = '';
  emit('submit', { rating: rating.value, content: content.value.trim() });
  notReady('提交评价');
  close();
}
</script>

<style scoped>
.review-dialog {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-4);
  background: rgba(43, 33, 24, 0.55);
}
.review-dialog__panel {
  width: min(480px, 100%);
  padding: var(--sp-5) var(--sp-5) var(--sp-4);
}
.review-dialog__title {
  font-size: var(--fs-md);
  margin-bottom: var(--sp-4);
}
.review-dialog__field {
  margin-bottom: var(--sp-4);
}
.review-dialog__label {
  display: block;
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--ink-soft);
  margin-bottom: var(--sp-2);
}
.review-dialog__count {
  display: block;
  text-align: right;
  font-size: var(--fs-xs);
  color: var(--ink-faint);
  margin-top: var(--sp-1);
}
.review-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-3);
  margin-top: var(--sp-4);
}
</style>
