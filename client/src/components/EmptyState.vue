<template>
  <div class="empty-state">
    <span class="empty-state__mark" aria-hidden="true">◇</span>
    <p class="empty-state__title">{{ title }}</p>
    <p v-if="hint" class="empty-state__hint">{{ hint }}</p>
    <div v-if="$slots.default" class="empty-state__action">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '这里还没有内容' },
  hint: { type: String, default: '' },
});
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-7) var(--sp-5);
  background: var(--paper-deep);
  border: 1px dashed var(--line);
  border-radius: var(--radius-lg);
  text-align: center;
}
.empty-state__mark {
  font-size: var(--fs-xl);
  color: var(--ink-faint);
}
.empty-state__title {
  font-family: var(--font-display);
  font-size: var(--fs-md);
  font-weight: 700;
  color: var(--ink);
}
.empty-state__hint {
  font-size: var(--fs-sm);
  color: var(--ink-faint);
}
.empty-state__action {
  margin-top: var(--sp-3);
}
</style>
