-- ============================================================
-- 旧光集影像器材电商网站 · 数据库初始化脚本
-- MySQL 8.0 / utf8mb4
-- 用法：mysql -u root -p < database/schema.sql
-- 说明：脚本幂等，可重复执行（建表用 IF NOT EXISTS，字典种子用 INSERT IGNORE）
-- ============================================================

CREATE DATABASE IF NOT EXISTS jiuguangji
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jiuguangji;

-- ------------------------------------------------------------
-- 1. 用户表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
  user_id       INT PRIMARY KEY AUTO_INCREMENT,
  username      VARCHAR(50)  NOT NULL UNIQUE COMMENT '登录名',
  password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt 哈希',
  phone         VARCHAR(20)  DEFAULT NULL COMMENT '手机号',
  email         VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  role          ENUM('user','admin') NOT NULL DEFAULT 'user' COMMENT '角色',
  avatar        VARCHAR(255) DEFAULT NULL COMMENT '头像路径',
  status        ENUM('active','disabled') NOT NULL DEFAULT 'active' COMMENT '账号状态',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ------------------------------------------------------------
-- 2. 分类表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS category (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(50) NOT NULL COMMENT '分类名称',
  parent_id   INT NOT NULL DEFAULT 0 COMMENT '父分类 ID，0 为一级分类',
  sort        INT NOT NULL DEFAULT 0 COMMENT '排序权重'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

-- ------------------------------------------------------------
-- 3. 成色等级字典表（全站五档成色口径一致）
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS condition_grade (
  grade_code      VARCHAR(20) PRIMARY KEY COMMENT '等级代码',
  grade_name      VARCHAR(20) NOT NULL COMMENT '等级名称',
  appearance_desc VARCHAR(255) NOT NULL COMMENT '外观描述',
  function_desc   VARCHAR(255) NOT NULL COMMENT '功能完整度描述',
  accessory_desc  VARCHAR(255) NOT NULL COMMENT '配件完整度描述'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成色等级字典表';

-- 成色分级对照数据（论文第 3 章设计产出）
INSERT IGNORE INTO condition_grade (grade_code, grade_name, appearance_desc, function_desc, accessory_desc) VALUES
  ('99new', '99 新', '近乎全新，无明显使用痕迹', '全部功能正常', '原包装、说明书齐全'),
  ('95new', '95 新', '极轻微使用痕迹，无明显划痕', '全部功能正常', '主要配件齐全'),
  ('9new',  '9 新',  '正常使用痕迹，轻微划痕', '全部功能正常', '机身与标配镜头'),
  ('85new', '85 新', '明显使用痕迹，局部磨损', '核心功能正常，次要功能不影响使用', '仅机身'),
  ('8new',  '8 新',  '较多磨损与掉漆', '快门测光等核心功能正常，可能有小瑕疵', '仅机身');

-- ------------------------------------------------------------
-- 4. 商品主表（单表承载三类垂直属性，非对应品类字段为 NULL）
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product (
  product_id   INT PRIMARY KEY AUTO_INCREMENT,
  category_id  INT NOT NULL COMMENT '所属分类',
  product_type ENUM('camera','film','accessory') NOT NULL COMMENT '商品品类',
  title        VARCHAR(200) NOT NULL COMMENT '商品标题',
  brand        VARCHAR(50)  NOT NULL COMMENT '品牌',
  main_image   VARCHAR(255) DEFAULT NULL COMMENT '主图路径',
  price        DECIMAL(10,2) NOT NULL COMMENT '售价',
  stock        INT NOT NULL DEFAULT 0 COMMENT '库存',
  status       ENUM('on_sale','off_shelf') NOT NULL DEFAULT 'on_sale' COMMENT '上架状态',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  -- 二手相机垂直属性
  model                VARCHAR(100) DEFAULT NULL COMMENT '相机型号',
  frame_format         ENUM('135','120','instant','other') DEFAULT NULL COMMENT '画幅规格（相机/胶卷共用）',
  shutter_count        INT DEFAULT NULL COMMENT '快门数',
  shutter_status       ENUM('normal','slow','abnormal') DEFAULT NULL COMMENT '快门状态',
  condition_grade_code VARCHAR(20)  DEFAULT NULL COMMENT '成色等级',
  source               ENUM('personal','merchant_checked') DEFAULT NULL COMMENT '器材来源',
  detect_summary       TEXT DEFAULT NULL COMMENT '检测总结短文本',
  -- 胶卷垂直属性
  iso          INT DEFAULT NULL COMMENT '感光度 100/200/400/800/1600',
  expiry_date  DATE DEFAULT NULL COMMENT '有效期',
  storage_note VARCHAR(255) DEFAULT NULL COMMENT '储存条件',
  -- 相机配件垂直属性
  accessory_type   VARCHAR(50)  DEFAULT NULL COMMENT '配件类型',
  compatible_model VARCHAR(200) DEFAULT NULL COMMENT '适配机型',
  is_new           TINYINT(1)   DEFAULT NULL COMMENT '是否全新：1 全新 0 二手',
  KEY idx_category (category_id),
  KEY idx_type_status (product_type, status),
  KEY idx_price (price),
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES category (category_id),
  CONSTRAINT fk_product_grade FOREIGN KEY (condition_grade_code) REFERENCES condition_grade (grade_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品主表';

-- ------------------------------------------------------------
-- 5. 检测项表（仅二手相机使用，一条商品多条记录）
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inspection_item (
  item_id    INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL COMMENT '关联相机商品',
  item_name  VARCHAR(50) NOT NULL COMMENT '检测项：快门/测光/取景器/对焦/漏光/外观',
  result     ENUM('normal','abnormal','untested') NOT NULL DEFAULT 'untested' COMMENT '检测结果',
  note       VARCHAR(255) DEFAULT NULL COMMENT '备注',
  KEY idx_product (product_id),
  CONSTRAINT fk_inspection_product FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='检测项表';

-- ------------------------------------------------------------
-- 6. 商品图表（多角度实拍图）
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_image (
  image_id   INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL COMMENT '关联商品',
  url        VARCHAR(255) NOT NULL COMMENT '图片路径',
  sort       INT NOT NULL DEFAULT 0 COMMENT '排序',
  KEY idx_product (product_id),
  CONSTRAINT fk_image_product FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品图表';

-- ------------------------------------------------------------
-- 7. 购物车表（同一用户同一商品唯一）
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart (
  cart_id    INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT NOT NULL COMMENT '用户',
  product_id INT NOT NULL COMMENT '商品',
  quantity   INT NOT NULL DEFAULT 1 COMMENT '数量',
  UNIQUE KEY uk_user_product (user_id, product_id),
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES `user` (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- ------------------------------------------------------------
-- 8. 订单主表（order 为 MySQL 保留字，统一使用反引号）
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order` (
  order_id         INT PRIMARY KEY AUTO_INCREMENT,
  order_no         VARCHAR(32) NOT NULL UNIQUE COMMENT '订单编号',
  user_id          INT NOT NULL COMMENT '下单用户',
  total_amount     DECIMAL(10,2) NOT NULL COMMENT '订单总额',
  status           ENUM('pending_pay','paid','shipped','completed','cancelled')
                   NOT NULL DEFAULT 'pending_pay' COMMENT '订单状态',
  receiver_name    VARCHAR(50)  NOT NULL COMMENT '收货人',
  receiver_phone   VARCHAR(20)  NOT NULL COMMENT '联系电话',
  receiver_address VARCHAR(255) NOT NULL COMMENT '收货地址',
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  paid_at          DATETIME DEFAULT NULL COMMENT '支付时间',
  KEY idx_user (user_id),
  KEY idx_status (status),
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES `user` (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单主表';

-- ------------------------------------------------------------
-- 9. 订单项表（成交单价快照）
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_item (
  item_id    INT PRIMARY KEY AUTO_INCREMENT,
  order_id   INT NOT NULL COMMENT '关联订单',
  product_id INT DEFAULT NULL COMMENT '商品（删除商品后置空，保留历史快照）',
  price      DECIMAL(10,2) NOT NULL COMMENT '成交单价快照',
  quantity   INT NOT NULL COMMENT '数量',
  KEY idx_order (order_id),
  CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES `order` (order_id) ON DELETE CASCADE,
  CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单项表';

-- ------------------------------------------------------------
-- 10. 评价表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS review (
  review_id  INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL COMMENT '评价商品',
  user_id    INT NOT NULL COMMENT '评价用户',
  order_id   INT NOT NULL COMMENT '关联订单',
  rating     TINYINT NOT NULL COMMENT '评分 1-5',
  content    TEXT COMMENT '评价内容',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评价时间',
  KEY idx_product (product_id),
  KEY idx_user (user_id),
  CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE CASCADE,
  CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES `user` (user_id),
  CONSTRAINT fk_review_order FOREIGN KEY (order_id) REFERENCES `order` (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';

-- ------------------------------------------------------------
-- 分类种子数据（三个一级分类及子分类）
-- ------------------------------------------------------------
INSERT IGNORE INTO category (category_id, name, parent_id, sort) VALUES
  (1,  '二手相机', 0, 1),
  (2,  '全新胶卷', 0, 2),
  (3,  '相机配件', 0, 3),
  (11, '135 单反',   1, 1),
  (12, '120 中画幅', 1, 2),
  (21, '135 胶卷',   2, 1),
  (22, '120 胶卷',   2, 2),
  (31, '镜头',   3, 1),
  (32, '闪光灯', 3, 2),
  (33, '滤镜',   3, 3),
  (34, '肩带',   3, 4);
