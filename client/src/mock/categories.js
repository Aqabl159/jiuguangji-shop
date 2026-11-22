// 商品分类（对齐 category 表一级分类种子数据）
// 首页分类卡片与列表页分类 Tab 共用；未来改从 GET /api/categories 加载
export const categories = [
  { category_id: 1, name: '二手相机', type: 'camera', index: '01', desc: '成色分级 · 快门检测 · 多角度实拍' },
  { category_id: 2, name: '全新胶卷', type: 'film', index: '02', desc: '感光度 · 有效期 · 储存条件说明' },
  { category_id: 3, name: '相机配件', type: 'accessory', index: '03', desc: '镜头 · 闪光灯 · 滤镜 · 肩带' },
];

export function getCategoryByType(type) {
  return categories.find((c) => c.type === type);
}
