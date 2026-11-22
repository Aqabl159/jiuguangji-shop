// 订单演示数据：6 单覆盖全部 5 种状态（completed 一单已评、一单未评，演示评价入口）
// 字段对齐 order / order_item 表；未来接真实接口后由 GET /api/orders 返回
export const orders = [
  {
    order_id: 1,
    order_no: 'JGJ202611210930011234',
    status: 'pending_pay',
    total_amount: 2680,
    receiver_name: '陈晓光', receiver_phone: '13800001234',
    receiver_address: '辽宁省大连市甘井子区软件园路 8 号 A2 座 501 室',
    created_at: '2026-11-21 09:30:01',
    paid_at: null, shipped_at: null, completed_at: null,
    reviewed: false,
    items: [
      { product_id: 1, title: '尼康 FM2 机械胶片单反相机（99 新，快门仅 1.2 万次）', main_image: '/images/cam-slr-front.svg', price: 2680, quantity: 1 },
    ],
  },
  {
    order_id: 2,
    order_no: 'JGJ202611190845029721',
    status: 'paid',
    total_amount: 1756,
    receiver_name: '陈晓光', receiver_phone: '13800001234',
    receiver_address: '辽宁省大连市甘井子区软件园路 8 号 A2 座 501 室',
    created_at: '2026-11-19 08:45:02', paid_at: '2026-11-19 08:50:17',
    shipped_at: null, completed_at: null,
    reviewed: false,
    items: [
      { product_id: 2, title: '佳能 AE-1 胶片单反相机（95 新，配 FD 50mm 镜头）', main_image: '/images/cam-slr-front.svg', price: 1580, quantity: 1 },
      { product_id: 6, title: '柯达 Portra 400 专业彩色负片（135，36 张）', main_image: '/images/film-135-box.svg', price: 88, quantity: 2 },
    ],
  },
  {
    order_id: 3,
    order_no: 'JGJ202611171402357418',
    status: 'shipped',
    total_amount: 4980,
    receiver_name: '林晚风', receiver_phone: '13911112222',
    receiver_address: '北京市朝阳区望京街道花家地南里 12 号楼 3 单元 402',
    created_at: '2026-11-17 14:02:35', paid_at: '2026-11-17 14:10:58',
    shipped_at: '2026-11-18 10:30:00', completed_at: null,
    reviewed: false,
    items: [
      { product_id: 3, title: '宾得 67 中画幅单反相机（9 新，120 画幅）', main_image: '/images/cam-slr-front.svg', price: 4980, quantity: 1 },
    ],
  },
  {
    order_id: 4,
    order_no: 'JGJ202611121055206613',
    status: 'completed',
    total_amount: 808,
    receiver_name: '林晚风', receiver_phone: '13911112222',
    receiver_address: '北京市朝阳区望京街道花家地南里 12 号楼 3 单元 402',
    created_at: '2026-11-12 10:55:20', paid_at: '2026-11-12 11:01:44',
    shipped_at: '2026-11-13 09:20:00', completed_at: '2026-11-16 18:05:32',
    reviewed: false,
    items: [
      { product_id: 10, title: '佳能 FD 50mm f/1.4 定焦镜头（95 新）', main_image: '/images/acc-lens.svg', price: 680, quantity: 1 },
      { product_id: 12, title: '手工植鞣革真皮相机肩带（全新，通用型）', main_image: '/images/acc-strap.svg', price: 128, quantity: 1 },
    ],
  },
  {
    order_id: 5,
    order_no: 'JGJ202611081630425599',
    status: 'completed',
    total_amount: 1824,
    receiver_name: '林晚风', receiver_phone: '13911112222',
    receiver_address: '北京市朝阳区望京街道花家地南里 12 号楼 3 单元 402',
    created_at: '2026-11-08 16:30:42', paid_at: '2026-11-08 16:35:10',
    shipped_at: '2026-11-09 09:00:00', completed_at: '2026-11-13 20:12:08',
    reviewed: true,
    items: [
      { product_id: 1, title: '尼康 FM2 机械胶片单反相机（99 新，快门仅 1.2 万次）', main_image: '/images/cam-slr-front.svg', price: 2680, quantity: 1 },
      { product_id: 8, title: '柯达 Gold 200 彩色负片（135，36 张）', main_image: '/images/film-135-box.svg', price: 62, quantity: 1 },
    ],
  },
  {
    order_id: 6,
    order_no: 'JGJ202611071115098730',
    status: 'cancelled',
    total_amount: 128,
    receiver_name: '陈晓光', receiver_phone: '13800001234',
    receiver_address: '辽宁省大连市甘井子区软件园路 8 号 A2 座 501 室',
    created_at: '2026-11-07 11:15:09',
    paid_at: null, shipped_at: null, completed_at: null,
    reviewed: false,
    items: [
      { product_id: 12, title: '手工植鞣革真皮相机肩带（全新，通用型）', main_image: '/images/acc-strap.svg', price: 128, quantity: 1 },
    ],
  },
];

export function getOrderById(id) {
  return orders.find((o) => o.order_id === Number(id));
}
