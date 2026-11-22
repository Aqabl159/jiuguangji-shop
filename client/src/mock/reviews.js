// 商品评价演示数据（字段对齐 review 表 + 用户名快照）
// 未来接真实接口后由 GET /api/products/:id/reviews 返回
export const reviews = [
  {
    review_id: 1, product_id: 1, order_id: 5,
    username: '老相机张', rating: 5,
    content: 'FM2 的成色描述很准，快门声音干脆，附件齐全，包装也用心。这台机器手感极好，出片锐利，值这个价。',
    created_at: '2026-11-13 20:30:00',
  },
  {
    review_id: 2, product_id: 1, order_id: 5,
    username: '胶片新人小林', rating: 5,
    content: '第一台胶片机，检测报告每项都写得很清楚，新手拍起来很安心。配的 Gold 200 出片颜色很暖。',
    created_at: '2026-11-14 09:12:00',
  },
  {
    review_id: 3, product_id: 1, order_id: 5,
    username: '暗房老王', rating: 4,
    content: '机器没问题，快门 1.2 万次如描述。美中不足是取景器有一粒微尘，不过不影响取景。整体满意。',
    created_at: '2026-11-15 21:47:00',
  },
  {
    review_id: 4, product_id: 2, order_id: 5,
    username: '路人甲', rating: 4,
    content: 'AE-1 成色不错，海绵已换新不漏光。发货快，包装严实，推荐。',
    created_at: '2026-11-16 13:05:00',
  },
  {
    review_id: 5, product_id: 6, order_id: 5,
    username: '胶片新人小林', rating: 5,
    content: 'Portra 400 名不虚传，肤色还原非常讨喜。有效期到 2027 年，囤了两卷慢慢拍。',
    created_at: '2026-11-17 10:28:00',
  },
  {
    review_id: 6, product_id: 10, order_id: 5,
    username: '老相机张', rating: 4,
    content: 'FD 50/1.4 镜片通透，光圈环手感顺滑。遮光罩一起发来的，很实在。',
    created_at: '2026-11-18 16:33:00',
  },
];

export function getProductReviews(productId) {
  return reviews.filter((r) => r.product_id === Number(productId));
}

export function calcAvg(productId) {
  const list = getProductReviews(productId);
  if (!list.length) return 0;
  return list.reduce((sum, r) => sum + r.rating, 0) / list.length;
}
