// ============================================================
// 字典映射：页面中文标签与状态颜色的唯一事实源
// 未来接入后端后，成色字典改从 GET /api/condition-grades 加载
// ============================================================

// 成色等级（对齐 condition_grade 表五档种子数据）
export const conditionGradeMap = {
  '99new': { name: '99 新', appearanceDesc: '近乎全新，无明显使用痕迹', functionDesc: '全部功能正常', accessoryDesc: '原包装、说明书齐全' },
  '95new': { name: '95 新', appearanceDesc: '极轻微使用痕迹，无明显划痕', functionDesc: '全部功能正常', accessoryDesc: '主要配件齐全' },
  '9new':  { name: '9 新',  appearanceDesc: '正常使用痕迹，轻微划痕', functionDesc: '全部功能正常', accessoryDesc: '机身与标配镜头' },
  '85new': { name: '85 新', appearanceDesc: '明显使用痕迹，局部磨损', functionDesc: '核心功能正常，次要功能不影响使用', accessoryDesc: '仅机身' },
  '8new':  { name: '8 新',  appearanceDesc: '较多磨损与掉漆', functionDesc: '快门测光等核心功能正常，可能有小瑕疵', accessoryDesc: '仅机身' },
};

// 订单状态（对齐 order.status 枚举）
export const orderStatusMap = {
  pending_pay: { label: '待付款', className: 'status-tag--pending-pay' },
  paid:        { label: '已付款', className: 'status-tag--paid' },
  shipped:     { label: '已发货', className: 'status-tag--shipped' },
  completed:   { label: '已完成', className: 'status-tag--completed' },
  cancelled:   { label: '已取消', className: 'status-tag--cancelled' },
};

// 快门状态（对齐 product.shutter_status 枚举）
export const shutterStatusMap = {
  normal:   { label: '快门正常', className: 'state--ok' },
  slow:     { label: '快门偏慢', className: 'state--warn' },
  abnormal: { label: '快门异常', className: 'state--bad' },
};

// 检测结果（对齐 inspection_item.result 枚举）
export const detectResultMap = {
  normal:   { label: '正常', className: 'state--ok' },
  abnormal: { label: '异常', className: 'state--bad' },
  untested: { label: '未检', className: 'state--muted' },
};

// 器材来源（对齐 product.source 枚举）
export const sourceMap = {
  personal:         { label: '个人闲置', className: 'state--muted' },
  merchant_checked: { label: '商家验货', className: 'state--ok' },
};

// 画幅规格（对齐 product.frame_format 枚举）
export const frameFormatMap = {
  '135':     { label: '135 全画幅' },
  '120':     { label: '120 中画幅' },
  instant:   { label: '拍立得' },
  other:     { label: '其他' },
};

// ---- 列表页筛选选项（未来由接口按品类返回） ----
export const filterOptions = {
  camera: [
    { title: '品牌', key: 'brand', options: ['尼康', '佳能', '宾得', '徕卡', '宝丽来'] },
    { title: '画幅', key: 'frame_format', options: ['135', '120', '拍立得'] },
    { title: '成色等级', key: 'grade', options: ['99 新', '95 新', '9 新', '85 新', '8 新'] },
    { title: '价格区间', key: 'price', options: ['1000 元以下', '1000 - 3000 元', '3000 - 8000 元', '8000 元以上'] },
  ],
  film: [
    { title: '品牌', key: 'brand', options: ['柯达', '伊尔福', '富士'] },
    { title: '感光度', key: 'iso', options: ['ISO 100', 'ISO 200', 'ISO 400', 'ISO 800', 'ISO 1600'] },
    { title: '画幅规格', key: 'frame_format', options: ['135', '120'] },
    { title: '价格区间', key: 'price', options: ['50 元以下', '50 - 100 元', '100 元以上'] },
  ],
  accessory: [
    { title: '配件类型', key: 'accessory_type', options: ['镜头', '闪光灯', '滤镜', '肩带'] },
    { title: '适配品牌', key: 'compatible', options: ['佳能', '尼康', '通用'] },
    { title: '价格区间', key: 'price', options: ['200 元以下', '200 - 500 元', '500 元以上'] },
  ],
  all: [
    { title: '品牌', key: 'brand', options: ['尼康', '佳能', '宾得', '徕卡', '宝丽来', '柯达', '伊尔福', '富士'] },
    { title: '价格区间', key: 'price', options: ['500 元以下', '500 - 3000 元', '3000 元以上'] },
  ],
};

// 商品品类（对齐 product.product_type 枚举）
export const productTypeMap = {
  camera:    { label: '二手相机' },
  film:      { label: '全新胶卷' },
  accessory: { label: '相机配件' },
};
