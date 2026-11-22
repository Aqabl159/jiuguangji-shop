<template>
  <div class="stepper">
    <button
      type="button"
      class="stepper__btn"
      aria-label="减少数量"
      :disabled="modelValue <= min"
      @click="change(-1)"
    >−</button>
    <span class="stepper__value" aria-live="polite">{{ modelValue }}</span>
    <button
      type="button"
      class="stepper__btn"
      aria-label="增加数量"
      :disabled="modelValue >= max"
      @click="change(1)"
    >+</button>
  </div>
</template>

<script setup>
// 数量步进器：仅本地数字变化（界面先行阶段，不持久化、不校验后端库存）
const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 99 },
});
const emit = defineEmits(['update:modelValue']);

function change(delta) {
  const next = props.modelValue + delta;
  if (next < props.min || next > props.max) return;
  emit('update:modelValue', next);
}
</script>

<style scoped>
.stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  overflow: hidden;
}
.stepper__btn {
  width: 36px;
  height: 36px;
  font-size: var(--fs-md);
  color: var(--ink);
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
.stepper__btn:hover:not(:disabled) {
  background: var(--accent-tint);
  color: var(--accent);
}
.stepper__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.stepper__value {
  min-width: 40px;
  text-align: center;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  border-left: 1px solid var(--line);
  border-right: 1px solid var(--line);
}
</style>
