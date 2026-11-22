// 购物车演示数据（商品快照字段 + 数量）
// 未来接真实接口后由 GET /api/cart 返回，页面无需改动
export const cartItems = [
  {
    cart_id: 1, product_id: 1, quantity: 1,
    title: '尼康 FM2 机械胶片单反相机（99 新，快门仅 1.2 万次）',
    main_image: '/images/cam-slr-front.svg',
    price: 2680, stock: 1,
  },
  {
    cart_id: 2, product_id: 2, quantity: 1,
    title: '佳能 AE-1 胶片单反相机（95 新，配 FD 50mm 镜头）',
    main_image: '/images/cam-slr-front.svg',
    price: 1580, stock: 3,
  },
  {
    cart_id: 3, product_id: 6, quantity: 2,
    title: '柯达 Portra 400 专业彩色负片（135，36 张）',
    main_image: '/images/film-135-box.svg',
    price: 88, stock: 50,
  },
  {
    cart_id: 4, product_id: 10, quantity: 1,
    title: '佳能 FD 50mm f/1.4 定焦镜头（95 新）',
    main_image: '/images/acc-lens.svg',
    price: 680, stock: 2,
  },
];
