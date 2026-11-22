<template>
  <span class="status-tag" :class="className">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue';
import { orderStatusMap } from '../mock/dicts.js';

const props = defineProps({
  status: { type: String, required: true },
});

const label = computed(() => orderStatusMap[props.status]?.label || props.status);
const className = computed(() => orderStatusMap[props.status]?.className || '');
</script>
