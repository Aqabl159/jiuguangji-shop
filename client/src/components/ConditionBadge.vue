<template>
  <span
    v-if="label"
    class="condition-badge"
    :class="`condition-badge--${gradeCode}`"
    :title="tooltip"
  >{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue';
import { conditionGradeMap } from '../mock/dicts.js';

// 成色等级标签：code → 中文名与颜色（双环印鉴样式见 retro.css）
const props = defineProps({
  gradeCode: { type: String, default: '' },
});

const label = computed(() => conditionGradeMap[props.gradeCode]?.name || '');
const tooltip = computed(() => {
  const g = conditionGradeMap[props.gradeCode];
  if (!g) return '';
  return `外观：${g.appearanceDesc}；功能：${g.functionDesc}；配件：${g.accessoryDesc}`;
});
</script>
