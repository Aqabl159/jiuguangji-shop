// ============================================================
// 演示商品数据：字段严格对齐数据库 product 表 schema，
// 非对应品类的垂直属性一律为 null（单表可空方案）。
// 未来接真实接口后，仅需替换本文件的数据来源。
// ============================================================
import { conditionGradeMap } from './dicts.js';

function camera(p) {
  return {
    product_type: 'camera', category_id: 1, status: 'on_sale',
    iso: null, expiry_date: null, storage_note: null,
    accessory_type: null, compatible_model: null, is_new: null,
    ...p,
  };
}

function film(p) {
  return {
    product_type: 'film', category_id: 2, status: 'on_sale',
    model: null, shutter_count: null, shutter_status: null,
    condition_grade_code: null, source: null, detect_summary: null,
    accessory_type: null, compatible_model: null, is_new: null,
    ...p,
  };
}

function accessory(p) {
  return {
    product_type: 'accessory', category_id: 3, status: 'on_sale',
    model: null, frame_format: null, shutter_count: null, shutter_status: null,
    source: null, detect_summary: null,
    iso: null, expiry_date: null, storage_note: null,
    ...p,
  };
}

export const products = [
  camera({
    product_id: 1,
    title: '尼康 FM2 机械胶片单反相机（99 新，快门仅 1.2 万次）',
    brand: '尼康', model: 'FM2',
    main_image: '/images/cam-slr-front.svg',
    price: 2680, stock: 1,
    created_at: '2026-11-12 10:00:00', updated_at: '2026-11-18 09:30:00',
    frame_format: '135', shutter_count: 12345, shutter_status: 'normal',
    condition_grade_code: '99new', source: 'merchant_checked',
    detect_summary: '全机经商家逐项验货：快门各档速度正常，测光精准，皮腔完好无漏光。附原包装与说明书，适合收藏与日常使用。',
    images: ['/images/cam-slr-front.svg', '/images/cam-slr-top.svg', '/images/cam-slr-dial.svg'],
    inspection_items: [
      { item_name: '快门', result: 'normal', note: '各档速度正常' },
      { item_name: '测光', result: 'normal', note: null },
      { item_name: '取景器', result: 'normal', note: '微尘，不影响取景' },
      { item_name: '对焦', result: 'normal', note: null },
      { item_name: '漏光', result: 'normal', note: '皮腔完好' },
      { item_name: '外观', result: 'normal', note: '近乎全新' },
    ],
  }),
  camera({
    product_id: 2,
    title: '佳能 AE-1 胶片单反相机（95 新，配 FD 50mm 镜头）',
    brand: '佳能', model: 'AE-1',
    main_image: '/images/cam-slr-front.svg',
    price: 1580, stock: 3,
    created_at: '2026-11-14 15:20:00', updated_at: '2026-11-17 11:00:00',
    frame_format: '135', shutter_count: 28410, shutter_status: 'normal',
    condition_grade_code: '95new', source: 'personal',
    detect_summary: '个人自用机器，极轻微使用痕迹。快门测光正常，反光板干净，附机身盖与肩带。',
    images: ['/images/cam-slr-front.svg', '/images/cam-slr-top.svg', '/images/cam-slr-dial.svg'],
    inspection_items: [
      { item_name: '快门', result: 'normal', note: null },
      { item_name: '测光', result: 'normal', note: '需配 6V 电池' },
      { item_name: '取景器', result: 'normal', note: null },
      { item_name: '对焦', result: 'normal', note: null },
      { item_name: '漏光', result: 'normal', note: '后盖海绵已换新' },
      { item_name: '外观', result: 'normal', note: '极轻微使用痕迹' },
    ],
  }),
  camera({
    product_id: 3,
    title: '宾得 67 中画幅单反相机（9 新，120 画幅）',
    brand: '宾得', model: '67',
    main_image: '/images/cam-slr-front.svg',
    price: 4980, stock: 2,
    created_at: '2026-11-10 09:00:00', updated_at: '2026-11-16 16:40:00',
    frame_format: '120', shutter_count: 15420, shutter_status: 'slow',
    condition_grade_code: '9new', source: 'merchant_checked',
    detect_summary: '机身整体成色良好，快门 1/30 以下低速档略偏慢，日常拍摄影响有限，介意慎拍。',
    images: ['/images/cam-slr-front.svg', '/images/cam-slr-top.svg', '/images/cam-slr-dial.svg'],
    inspection_items: [
      { item_name: '快门', result: 'abnormal', note: '低速档偏慢约 1/3 档' },
      { item_name: '测光', result: 'normal', note: null },
      { item_name: '取景器', result: 'normal', note: null },
      { item_name: '对焦', result: 'normal', note: null },
      { item_name: '漏光', result: 'normal', note: null },
      { item_name: '外观', result: 'normal', note: '正常使用痕迹，轻微划痕' },
    ],
  }),
  camera({
    product_id: 4,
    title: '徕卡 M3 旁轴相机（85 新，经典双拨机身）',
    brand: '徕卡', model: 'M3',
    main_image: '/images/cam-rf-front.svg',
    price: 12800, stock: 2,
    created_at: '2026-11-08 14:00:00', updated_at: '2026-11-15 10:10:00',
    frame_format: '135', shutter_count: null, shutter_status: 'abnormal',
    condition_grade_code: '85new', source: 'personal',
    detect_summary: '收藏级机身，外观有明显岁月痕迹。快门核心档位可用，测光机构未测（以未检计），建议搭配外置测光表使用。',
    images: ['/images/cam-rf-front.svg', '/images/cam-rf-top.svg', '/images/cam-slr-dial.svg'],
    inspection_items: [
      { item_name: '快门', result: 'abnormal', note: '1/1000 档偏快' },
      { item_name: '测光', result: 'untested', note: '本机无内测光' },
      { item_name: '取景器', result: 'normal', note: '黄斑清晰' },
      { item_name: '对焦', result: 'normal', note: null },
      { item_name: '漏光', result: 'normal', note: null },
      { item_name: '外观', result: 'normal', note: '明显使用痕迹，局部磨损' },
    ],
  }),
  camera({
    product_id: 5,
    title: '宝丽来 SX-70 拍立得相机（8 新，一代经典）',
    brand: '宝丽来', model: 'SX-70',
    main_image: '/images/cam-instant-front.svg',
    price: 1280, stock: 4,
    created_at: '2026-11-06 11:30:00', updated_at: '2026-11-13 15:00:00',
    frame_format: 'instant', shutter_count: null, shutter_status: 'normal',
    condition_grade_code: '8new', source: 'personal',
    detect_summary: '机身较多磨损与掉漆，出片正常。折叠机构顺畅，附原装皮盒。',
    images: ['/images/cam-instant-front.svg', '/images/cam-instant-back.svg', '/images/cam-slr-dial.svg'],
    inspection_items: [
      { item_name: '快门', result: 'normal', note: null },
      { item_name: '测光', result: 'normal', note: null },
      { item_name: '取景器', result: 'normal', note: null },
      { item_name: '对焦', result: 'normal', note: null },
      { item_name: '漏光', result: 'normal', note: '皮腔完好' },
      { item_name: '外观', result: 'normal', note: '较多磨损与掉漆' },
    ],
  }),
  film({
    product_id: 6,
    title: '柯达 Portra 400 专业彩色负片（135，36 张）',
    brand: '柯达',
    main_image: '/images/film-135-box.svg',
    price: 88, stock: 50,
    created_at: '2026-11-15 08:00:00', updated_at: '2026-11-18 08:00:00',
    frame_format: '135', iso: 400, expiry_date: '2027-05-31',
    storage_note: '冷藏保存，拍摄前提前 1 小时回温',
    images: ['/images/film-135-box.svg', '/images/film-135-canister.svg'],
  }),
  film({
    product_id: 7,
    title: '伊尔福 HP5 Plus 400 黑白负片（135，36 张）',
    brand: '伊尔福',
    main_image: '/images/film-135-canister.svg',
    price: 52, stock: 40,
    created_at: '2026-11-13 13:40:00', updated_at: '2026-11-16 09:00:00',
    frame_format: '135', iso: 400, expiry_date: '2026-11-30',
    storage_note: '常温避光保存即可',
    images: ['/images/film-135-canister.svg', '/images/film-135-box.svg'],
  }),
  film({
    product_id: 8,
    title: '柯达 Gold 200 彩色负片（135，36 张）',
    brand: '柯达',
    main_image: '/images/film-135-box.svg',
    price: 62, stock: 60,
    created_at: '2026-11-16 10:20:00', updated_at: '2026-11-17 14:00:00',
    frame_format: '135', iso: 200, expiry_date: '2027-03-31',
    storage_note: '常温避光保存，避免高温潮湿',
    images: ['/images/film-135-box.svg', '/images/film-135-canister.svg'],
  }),
  film({
    product_id: 9,
    title: '富士 Velvia 100 反转片（120，6×7 十张）',
    brand: '富士',
    main_image: '/images/film-120-box.svg',
    price: 95, stock: 12,
    created_at: '2026-11-09 16:50:00', updated_at: '2026-11-14 10:30:00',
    frame_format: '120', iso: 100, expiry_date: '2026-08-31',
    storage_note: '冷藏保存，全程冷链运输',
    images: ['/images/film-120-box.svg', '/images/film-120-spool.svg'],
  }),
  accessory({
    product_id: 10,
    title: '佳能 FD 50mm f/1.4 定焦镜头（95 新）',
    brand: '佳能',
    main_image: '/images/acc-lens.svg',
    price: 680, stock: 2,
    created_at: '2026-11-11 12:00:00', updated_at: '2026-11-16 15:20:00',
    accessory_type: '镜头', compatible_model: '佳能 FD 卡口系列（AE-1 / FTb 等）',
    is_new: 0, condition_grade_code: '95new',
    images: ['/images/acc-lens.svg', '/images/acc-lens-hood.svg', '/images/acc-filter.svg'],
  }),
  accessory({
    product_id: 11,
    title: '美兹 Metz 45 CL-4 手柄闪光灯（9 新）',
    brand: '美兹',
    main_image: '/images/acc-flash.svg',
    price: 420, stock: 3,
    created_at: '2026-11-07 17:10:00', updated_at: '2026-11-15 11:40:00',
    accessory_type: '闪光灯', compatible_model: '通用热靴（各品牌胶片单反）',
    is_new: 0, condition_grade_code: '9new',
    images: ['/images/acc-flash.svg'],
  }),
  accessory({
    product_id: 12,
    title: '手工植鞣革真皮相机肩带（全新，通用型）',
    brand: '旧光集定制',
    main_image: '/images/acc-strap.svg',
    price: 128, stock: 30,
    created_at: '2026-11-17 09:10:00', updated_at: '2026-11-17 09:10:00',
    accessory_type: '肩带', compatible_model: '通用（两侧耳扣）',
    is_new: 1, condition_grade_code: null,
    images: ['/images/acc-strap.svg'],
  }),
];

export function getProductById(id) {
  return products.find((p) => p.product_id === Number(id));
}

export function getProductsByType(type) {
  if (!type) return products;
  return products.filter((p) => p.product_type === type);
}

// 最新上架：按创建时间倒序
export const latestProducts = [...products]
  .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
  .slice(0, 6);

// 编辑精选：徕卡 M3 / 尼康 FM2 / 柯达 Portra 400
export const editorPicks = [4, 1, 6].map((id) => getProductById(id));

// 详情页成色完整描述（字典 JOIN 效果）
export function getConditionGrade(product) {
  return conditionGradeMap[product.condition_grade_code] || null;
}
