import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 购物车状态：加入商品、修改数量、删除，
// 提交订单前校验库存（阶段 3 接入后端接口）
export const useCartStore = defineStore('cart', () => {
  const items = ref([]);

  const totalCount = computed(() =>
    items.value.reduce((sum, it) => sum + it.quantity, 0)
  );

  const totalPrice = computed(() =>
    items.value.reduce((sum, it) => sum + it.price * it.quantity, 0)
  );

  return { items, totalCount, totalPrice };
});
