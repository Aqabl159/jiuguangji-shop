<template>
  <nav class="breadcrumb" aria-label="面包屑导航">
    <router-link to="/">首页</router-link>
    <template v-for="(item, i) in items" :key="i">
      <span class="breadcrumb__sep" aria-hidden="true">/</span>
      <router-link v-if="item.to" :to="item.to">{{ item.label }}</router-link>
      <span v-else class="breadcrumb__current" :aria-current="i === items.length - 1 ? 'page' : undefined">{{ item.label }}</span>
    </template>
  </nav>
</template>

<script setup>
// 面包屑：items = [{ label, to? }]
defineProps({
  items: { type: Array, default: () => [] },
});
</script>

<style scoped>
.breadcrumb__current { color: var(--ink-soft); }
</style>
