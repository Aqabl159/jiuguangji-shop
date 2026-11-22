<template>
  <div class="star-rating" role="group" :aria-label="`${modelValue} 星`">
    <button
      v-for="n in 5"
      :key="n"
      type="button"
      class="star-rating__star"
      :class="{ 'star-rating__star--on': n <= modelValue, 'star-rating__star--interactive': interactive }"
      :aria-label="`${n} 星`"
      :disabled="!interactive"
      @click="pick(n)"
    >★</button>
  </div>
</template>

<script setup>
// 星级：只读展示 + 可点（评价弹窗）；整星 1-5，金色点亮
defineProps({
  modelValue: { type: Number, default: 0 },
  interactive: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue']);

function pick(n) {
  emit('update:modelValue', n);
}
</script>

<style scoped>
.star-rating {
  display: inline-flex;
  gap: var(--sp-1);
}
.star-rating__star {
  padding: 2px;
  font-size: 18px;
  line-height: 1;
  color: var(--line);
  transition: color var(--dur) var(--ease), transform var(--dur) var(--ease);
}
.star-rating__star--on { color: var(--gold); }
.star-rating__star--interactive {
  cursor: pointer;
  min-width: 28px;
  min-height: 28px;
}
.star-rating__star--interactive:hover {
  color: var(--gold);
  transform: scale(1.15);
}
.star-rating__star:disabled { cursor: default; }
</style>
