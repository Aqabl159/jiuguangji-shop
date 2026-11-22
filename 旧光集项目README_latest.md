# "旧光集"影像器材电商网站 README

## 1. 项目概述

本项目为本科毕业设计（论文）课题"基于用户体验的'旧光集'影像器材电商网站设计与开发"的系统说明文档。

网站聚焦复古胶片相机、全新胶卷与相机配件三类影像复古器材的在线展示与交易，采用 B/S 体系结构与前后端分离方式，基于 MVC 设计模式组织系统结构。设计阶段以 Garrett 用户体验五层模型为主线，落地 UCD 理念与 Nielsen 可用性评估；开发阶段围绕"需求分析—系统设计—开发实现—测试验证"完整闭环推进。

项目要解决的核心问题有三个：二手相机的真伪、成色与功能状态缺乏标准化描述；胶卷有效期、储存条件等关键信息展示不足；垂直商品多维筛选效率低、用户决策成本高。对应的设计回应是：建立成色分级字典与检测项清单、在商品主表之外按品类扩展垂直属性表、组合关键词搜索与多条件筛选。

## 2. 技术栈

### 2.1 总体技术选型

| 层次 | 技术 / 工具 | 在系统中的用途 |
| --- | --- | --- |
| 体系结构 | B/S、前后端分离 | 浏览器访问前端，前端通过 RESTful API 与后端交互 |
| 设计模式 | MVC | Vue 组件承担视图，Express 路由与控制器承担控制层，MySQL 与业务服务承担模型层 |
| 前端基础 | HTML5、CSS3、JavaScript（ES6+） | 页面语义结构、复古视觉样式、响应式布局、原生交互 |
| 前端框架 | Vue 3 | 首页、商品列表、详情、购物车、结算、订单、后台管理页面组件化开发 |
| 前端路由 | Vue Router | 前台与后台路由分离，路由守卫控制管理员页面访问 |
| 前端状态管理 | Pinia | 购物车状态、登录用户信息、筛选条件跨页面共享 |
| 前端请求 | Axios | 统一调用 RESTful API，请求拦截器自动携带 JWT，响应拦截器统一处理错误 |
| 前台样式 | CSS3 自定义属性、Flex/Grid、响应式布局 | 保留胶片暗房复古视觉，不引入通用组件库默认样式 |
| 后台样式 | Element Plus | 后台表格、表单、对话框，提高管理端开发效率 |
| 后端运行时 | Node.js | 后端服务运行环境 |
| 后端框架 | Express | 组织路由、控制器、中间件，提供 RESTful API |
| 接口风格 | RESTful | 商品、购物车、订单、用户、评价、后台管理资源接口，JSON 数据交互 |
| 身份认证 | JWT | 登录后签发令牌，令牌中携带用户 ID 与角色（user/admin） |
| 密码安全 | bcrypt | 用户密码哈希存储，不落明文 |
| 文件上传 | multer | 二手相机多角度实拍图、胶卷图、配件图上传，文件存服务器静态目录，数据库只存路径 |
| 数据库 | MySQL 8.0 | 业务数据存储，使用 E-R 模型与关系规范化设计 |
| 数据库访问 | mysql2 | 参数化查询，订单创建与库存扣减使用事务 |
| 跨域与调试 | CORS、Postman | 前后端分离开发阶段的跨域处理与接口联调 |
| 原型工具 | Axure / Figma | 低保真与高保真原型，核心页面迭代 |
| 版本管理 | Git | 代码版本管理 |
| 测试工具 | 功能测试用例表、SUS 量表 | 第 5 章功能测试与可用性测试数据来源 |

### 2.2 几点选型说明

Pinia 与 Element Plus 是开题报告中未明确写出的技术，但属于 Vue 3 生态标配与后台开发效率工具。论文第 2 章中 Pinia 用一句话带过（"购物车与登录态通过 Pinia 集中管理"），Element Plus 解释为"前台保留自定义 CSS 以维持复古视觉，后台为提高开发效率采用组件库"，避免被理解为技术栈偏离开题。

## 3. 系统功能模块

### 3.1 前台用户端

用户注册与登录支持邮箱或手机号注册，bcrypt 哈希存储密码，登录后 JWT 存入 localStorage，Axios 拦截器自动携带。未登录用户可浏览商品与搜索，加入购物车或下单时跳转登录。

首页承担品牌展示与复古视觉入口，包含分类导航、最新上架商品、推荐商品三个区块。分类导航固定三类：二手相机、全新胶卷、相机配件。

商品列表页支持关键词搜索（匹配标题、品牌、型号）与多维组合筛选。二手相机筛选维度为品牌、画幅（135/120）、成色等级、价格区间；胶卷筛选维度为品牌、感光度（100/200/400/800/1600）、画幅规格、价格区间；配件筛选维度为配件类型、适配品牌、价格区间。筛选条件组合使用，结果分页展示。

商品详情页按品类差异化渲染。二手相机详情包含多角度实拍图轮播、品牌型号画幅、快门状态与快门数、成色等级标签、器材来源、检测项清单表格、检测总结、加入购物车入口。胶卷详情包含型号、感光度、画幅规格、有效期、储存条件说明。配件详情包含配件类型、适配机型、新旧状态。

购物车支持加入商品、修改数量、删除、查看总价，提交前校验库存。结算页填写收货人、联系电话、收货地址，确认订单金额后提交订单，订单创建与库存扣减在同一数据库事务中完成。

模拟支付流程为：订单提交后进入"待付款"状态，用户点击模拟支付按钮后订单状态改为"已付款"，不接入支付宝或微信真实支付网关。

我的订单页展示订单列表与详情，按状态筛选。已完成订单可对商品进行评分（1-5 星）与文字评价，评价在商品详情页展示。

### 3.2 后台管理端

管理员登录后进入后台，路由守卫校验 JWT 中的 role 字段，普通用户 token 访问后台接口返回 403。

商品管理模块支持商品新增、编辑、上下架、删除。新增商品时先选分类（相机/胶卷/配件），表单按品类动态加载对应扩展字段。二手相机录入时同时维护成色等级、快门状态、器材来源与检测项清单，并上传多角度实拍图。胶卷录入时维护感光度、画幅规格、有效期与储存条件。

分类管理维护三个一级分类及必要子分类。订单管理查看订单列表与详情，按状态筛选，对已付款订单执行"发货"操作，将状态推进到"已发货"。用户管理查看用户列表与角色，必要时禁用或启用普通用户。

### 3.3 系统支撑机制

库存一致性方面，下单时在数据库事务中先查询库存是否充足，再创建订单记录与订单项，并扣减商品库存，任一步失败整体回滚，避免超卖。

订单状态机流转为：待付款 → 已付款 → 已发货 → 已完成；待付款可由用户取消变为已取消。模拟支付触发"待付款→已付款"，后台发货触发"已付款→已发货"，订单收货确认（简化为后台或用户手动）触发"已发货→已完成"。

安全方面，所有数据库访问使用 mysql2 参数化查询，避免 SQL 注入；用户密码 bcrypt 哈希存储；后台接口统一校验管理员角色。

## 4. 数据库设计

### 4.1 设计思路

商品相关数据采用单表承载方案。product 主表存放所有商品共有的字段，同时把二手相机、胶卷、配件三类的垂直属性（画幅、快门状态、感光度、有效期、配件类型等）以可空字段的形式直接挂在主表上，非对应品类的字段一律为 NULL。这样做表结构简单、查询不用 JOIN 扩展表，适合毕业设计体量；字段命名上通过品类前缀或语义区分，配合 product_type 字段在前后端控制哪些字段必填、哪些字段展示。

二手相机的检测项进一步独立成 inspection_item 表，一条商品对应多条检测记录，前台渲染为检测清单表格，比一段自由文本更具标准化与可信度。成色等级单独建 condition_grade 字典表，保证全网站五档成色口径一致。

### 4.2 数据表清单

**用户表 user**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| user_id | INT, PK, AUTO_INCREMENT | 用户 ID |
| username | VARCHAR(50), UNIQUE | 登录名 |
| password_hash | VARCHAR(255) | bcrypt 哈希 |
| phone | VARCHAR(20) | 手机号 |
| email | VARCHAR(100) | 邮箱 |
| role | ENUM('user','admin') | 角色 |
| avatar | VARCHAR(255) | 头像路径 |
| status | ENUM('active','disabled') | 账号状态 |
| created_at | DATETIME | 注册时间 |

**分类表 category**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| category_id | INT, PK | 分类 ID |
| name | VARCHAR(50) | 二手相机 / 全新胶卷 / 相机配件 |
| parent_id | INT, DEFAULT 0 | 父分类 ID |
| sort | INT | 排序权重 |

**商品主表 product**

主表承载所有品类的共有字段与垂直属性字段，垂直属性字段对非对应品类为 NULL。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| product_id | INT, PK | 商品 ID |
| category_id | INT, FK | 所属分类 |
| product_type | ENUM('camera','film','accessory') | 商品品类 |
| title | VARCHAR(200) | 商品标题 |
| brand | VARCHAR(50) | 品牌 |
| main_image | VARCHAR(255) | 主图路径 |
| price | DECIMAL(10,2) | 售价 |
| stock | INT | 库存 |
| status | ENUM('on_sale','off_shelf') | 上架状态 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |
| **以下为二手相机垂直属性** | | |
| model | VARCHAR(100) | 相机型号（相机类必填） |
| frame_format | ENUM('135','120','instant','other') | 画幅规格（相机/胶卷共用） |
| shutter_count | INT | 快门数（仅相机） |
| shutter_status | ENUM('normal','slow','abnormal') | 快门状态（仅相机） |
| condition_grade_code | VARCHAR(20), FK | 成色等级，关联 condition_grade（相机/二手配件） |
| source | ENUM('personal','merchant_checked') | 器材来源：个人闲置 / 商家验货（仅相机） |
| detect_summary | TEXT | 检测总结短文本（仅相机） |
| **以下为胶卷垂直属性** | | |
| iso | INT | 感光度（仅胶卷：100/200/400/800/1600） |
| expiry_date | DATE | 有效期（仅胶卷） |
| storage_note | VARCHAR(255) | 储存条件：冷藏 / 常温避光等（仅胶卷） |
| **以下为相机配件垂直属性** | | |
| accessory_type | VARCHAR(50) | 配件类型：镜头 / 闪光灯 / 滤镜 / 肩带等（仅配件） |
| compatible_model | VARCHAR(200) | 适配机型（仅配件） |
| is_new | TINYINT(1) | 是否全新（仅配件，1 全新 0 二手） |


**成色等级字典表 condition_grade**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| grade_code | VARCHAR(20), PK | 等级代码（99new / 95new / 9new / 85new / 8new） |
| grade_name | VARCHAR(20) | 等级名称 |
| appearance_desc | VARCHAR(255) | 外观描述 |
| function_desc | VARCHAR(255) | 功能完整度描述 |
| accessory_desc | VARCHAR(255) | 配件完整度描述 |

**检测项表 inspection_item**（仅二手相机使用）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| item_id | INT, PK | 检测项 ID |
| product_id | INT, FK | 关联相机商品 |
| item_name | VARCHAR(50) | 快门 / 测光 / 取景器 / 对焦 / 漏光 / 外观 |
| result | ENUM('normal','abnormal','untested') | 检测结果 |
| note | VARCHAR(255) | 备注 |

**商品图表 product_image**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| image_id | INT, PK | 图片 ID |
| product_id | INT, FK | 关联商品 |
| url | VARCHAR(255) | 图片路径 |
| sort | INT | 排序 |

**购物车表 cart**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| cart_id | INT, PK | 购物车项 ID |
| user_id | INT, FK | 用户 |
| product_id | INT, FK | 商品 |
| quantity | INT | 数量 |
| UNIQUE(user_id, product_id) |  | 同一用户同一商品唯一 |

**订单主表 order**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| order_id | INT, PK | 订单 ID |
| order_no | VARCHAR(32), UNIQUE | 订单编号 |
| user_id | INT, FK | 下单用户 |
| total_amount | DECIMAL(10,2) | 订单总额 |
| status | ENUM('pending_pay','paid','shipped','completed','cancelled') | 订单状态 |
| receiver_name | VARCHAR(50) | 收货人 |
| receiver_phone | VARCHAR(20) | 联系电话 |
| receiver_address | VARCHAR(255) | 收货地址 |
| created_at | DATETIME | 下单时间 |
| paid_at | DATETIME | 支付时间 |

**订单项表 order_item**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| item_id | INT, PK | 订单项 ID |
| order_id | INT, FK | 关联订单 |
| product_id | INT, FK | 商品 |
| price | DECIMAL(10,2) | 成交单价（快照） |
| quantity | INT | 数量 |

**评价表 review**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| review_id | INT, PK | 评价 ID |
| product_id | INT, FK | 评价商品 |
| user_id | INT, FK | 评价用户 |
| order_id | INT, FK | 关联订单 |
| rating | TINYINT | 评分 1-5 |
| content | TEXT | 评价内容 |
| created_at | DATETIME | 评价时间 |

### 4.3 成色分级对照表

论文第 3 章直接给出这张对照表，作为"建立标准化二手相机信息模型"的设计产出。

| 等级 | 外观 | 功能 | 配件 |
| --- | --- | --- | --- |
| 99 新 | 近乎全新，无明显使用痕迹 | 全部功能正常 | 原包装、说明书齐全 |
| 95 新 | 极轻微使用痕迹，无明显划痕 | 全部功能正常 | 主要配件齐全 |
| 9 新 | 正常使用痕迹，轻微划痕 | 全部功能正常 | 机身与标配镜头 |
| 85 新 | 明显使用痕迹，局部磨损 | 核心功能正常，次要功能不影响使用 | 仅机身 |
| 8 新 | 较多磨损与掉漆 | 快门测光等核心功能正常，可能有小瑕疵 | 仅机身 |

## 5. 论文第 4 章组织方式

第 4 章按"功能 + 设计依据 + 实现要点 + 效果图"组织，分五节。每节配 1-2 张实际运行截图（不是原型图），并在全章贴 5 段关键代码，其中三段后台两段前端，符合"代码展示必须包含后台代码"的要求。

**第一节 前台商品浏览与多维检索实现**
写首页、分类导航、商品列表、关键词搜索、组合筛选、分页。说明筛选条件如何对应相机与胶卷的垂直属性。效果图放商品列表页与筛选面板截图。代码段贴后端商品列表多条件组合筛选的 Controller 与参数化 SQL 查询（约 20 行）。

**第二节 二手相机信息标准化与详情页实现**
写成色分级标签、检测项清单表格、多角度实拍图轮播、器材来源、快门状态如何结构化渲染。说明这些设计如何降低信息不对称。效果图放二手相机详情页截图。代码段贴 Vue 商品详情组件按 product_type 动态渲染对应垂直属性区块（相机显示快门与成色，胶卷显示感光度与有效期）与检测项清单的片段（约 20 行）。

**第三节 购物车、结算与订单交易闭环实现**
写加入购物车、数量修改、库存校验、提交订单、模拟支付、订单状态展示。重点说明订单创建与库存扣减的事务一致性。效果图放购物车页、结算页、我的订单列表截图。代码段贴后端订单创建事务代码（BEGIN/COMMIT、插入 order、插入 order_item、扣减 product.stock，约 25 行）。

**第四节 评价管理与前台配套功能实现**
写已完成订单评价、评分与文字评价、详情页评价展示。说明评价作为信任机制的一部分。效果图放商品详情页评价区块截图。代码段贴 JWT 鉴权中间件（校验 token、读取 role、挂载到 req.user，约 15 行）。

**第五节 后台管理功能实现**
写管理员登录与路由守卫、商品 CRUD、按品类动态表单、订单发货操作、用户管理、图片上传。效果图放后台商品编辑页与订单管理列表截图。代码段贴 Pinia 购物车 action（addToCart、updateQuantity、removeItem，约 20 行）。

## 6. 开发顺序与里程碑（详细路线）

按导师评语"优先完成核心交易流程模块，规避初期功能冗余杂乱"，开发严格按**依赖顺序**推进：认证 → 商品数据链路（后台录入 → 演示数据 → 前台浏览）→ 交易闭环 → 评价 → 后台收尾 → 测试截图。扩展功能（收藏、评价审核、数据看板）若时间不够直接砍掉，不影响核心闭环。每一阶段结束有明确验收点，验收通过才进入下一阶段。

与原计划的顺序差异说明：① 用户认证从"骨架阶段"独立成第一阶段，因为交易与后台全部依赖 JWT；② 分类管理、用户管理的后台页面推迟到阶段 5 收尾，避免初期功能冗余（其只读接口仍在阶段 2 提供，供筛选面板使用）；③ 演示数据 seed 提到前台浏览之前，保证前台开发有真实形态的数据可测。

### 6.0 通用编码约定

| 约定 | 说明 |
| --- | --- |
| 后端分层 | routes/（路由挂载 + 参数接收）→ controllers/（业务逻辑，直接使用 mysql2 连接池），本系统体量不设独立 service 层 |
| 接口风格 | RESTful，统一前缀 /api；控制器抛错统一 `throw { status, message }`，由 errorHandler 中间件兜底响应 |
| 接口返回 | 成功：单条返回数据对象、操作返回 `{ message }`、列表返回 `{ list, total }`；失败：`{ message }` + 对应 HTTP 状态码 |
| 鉴权 | 前台用户接口挂 auth 中间件；后台 `/api/admin/*` 全部挂 auth + requireAdmin |
| SQL 安全 | 一律参数化查询；订单创建、支付、取消、收货、商品+检测项写入等涉及多表写操作的必须用事务 |
| 前端分层 | api/ 封装接口函数（统一引用 request 实例）→ stores/ 管跨页状态 → views/ 页面组件；后台页面用 Element Plus，前台页面用 retro.css 自定义样式 |
| 字段校验 | 必填/格式校验以**后端为准**（防绕过），前端只做交互提示；品类型必填差异集中在 product_type 分支 |

### 6.1 阶段 0：工程骨架 ✅ 已完成

- [x] MySQL 建库建表 schema.sql（10 张表 + 五档成色字典 + 分类种子）
- [x] Express 骨架：CORS、JSON 解析、/uploads 静态目录、/api/health、404 与统一错误处理
- [x] JWT 中间件 auth / requireAdmin（尚无路由使用）
- [x] 前端骨架：Vue 3 + Vite + Pinia + Router + Axios + Element Plus、Vite 代理、复古主题三件套、user/cart store、首页静态版、路由守卫
- [x] seed.js 演示账号 admin / demo

### 6.2 阶段 1：用户认证闭环（约 3 天，一切功能的前提）

**后端**
1. 新建 `server/src/controllers/auth.controller.js`：
   - `register`：校验 username（3-20 位）、password（≥6 位）、phone/email 至少其一且格式合法；用户名唯一性检查；bcrypt.hash(10)；插入 role='user'、status='active'；签发 JWT（payload：{ userId, role }，有效期 7 天）
   - `login`：按用户名查询；bcrypt.compare 校验；status='disabled' 拒绝登录；签发 JWT
   - `me`：按 req.user.userId 返回用户信息（脱敏，不含 password_hash）
2. 新建 `server/src/routes/auth.routes.js`：`POST /api/auth/register`、`POST /api/auth/login`、`GET /api/auth/me`（挂 auth）
3. app.js 挂载路由

**前端**
4. 新建 `client/src/api/auth.js`：register / login / me 接口函数
5. 新建 `client/src/views/Login.vue`、`Register.vue`：表单 + 错误提示；登录成功调 userStore.setLogin；支持 `?redirect=` 回跳；已登录访问登录页直接回首页
6. router 增加 /login、/register 路由，验证守卫：未登录访问 requiresAuth 页面跳登录并携带 redirect

**验收**：Postman 全接口通过；demo 登录成功并回跳；重复注册/错误密码有明确提示；401 时拦截器清登录态跳登录页。

### 6.3 阶段 2：商品数据链路（约 2 周，后台录入 → 演示数据 → 前台浏览）

**2.1 分类与字典接口（公开，前后台共用）**
- `category.controller.js`：`GET /api/categories`（含 parent_id 的扁平列表）
- `condition_grade.controller.js`：`GET /api/condition-grades`（五档成色，供筛选面板与后台表单下拉）

**2.2 后台商品管理（按品类动态校验 + 图片上传）**

后端：
- 新建 `server/src/middleware/upload.js`：multer diskStorage 存 server/uploads/，白名单 jpg/jpeg/png/webp，单图 ≤5MB，文件名加时间戳防冲突
- 新建 `server/src/controllers/admin/product.controller.js`：
  - `GET /api/admin/products`：全状态列表，keyword/type/status 筛选 + 分页
  - `POST /api/admin/products`：按 product_type 动态校验（camera 必填 model、frame_format、condition_grade_code、source；film 必填 iso、expiry_date、storage_note；accessory 必填 accessory_type、is_new）；事务写 product + inspection_item（删除重建）+ product_image
  - `PUT /api/admin/products/:id`：同上
  - `PATCH /api/admin/products/:id/status`：上/下架
  - `DELETE /api/admin/products/:id`：删除（检测项/图片表已级联）
  - `POST /api/admin/upload`：单图上传，返回路径
- 新建 `server/src/routes/admin.routes.js`：挂 auth + requireAdmin

前端后台：
- `client/src/views/admin/AdminLayout.vue`：侧边导航（商品/分类/订单/用户）+ 顶栏退出登录
- `client/src/views/admin/ProductList.vue`：Element Plus 表格 + 搜索 + 上/下架 + 编辑 + 删除
- `client/src/views/admin/ProductEdit.vue`：新建/编辑共用；先选 product_type，表单按品类动态渲染——camera：成色下拉（读字典）、画幅、快门数/状态、来源、检测项清单行编辑器（6 个固定检测项 + result + note）、多图上传（el-upload）；film：感光度、有效期、储存条件；accessory：配件类型、适配机型、是否全新
- router 增加 /admin/*，meta.requiresAdmin

**2.3 演示数据 seed（支撑前台开发与论文截图）**
- seed.js 扩展 seedProducts()：12 条商品（相机 5、胶卷 4、配件 3），覆盖全部筛选维度取值；每条相机配 5-6 条检测项、3-5 张图（先用本地占位图，论文截图前替换实拍图）；库存设梯度值（留一件 1 库存商品供超卖测试）

**2.4 前台商品浏览**

后端 `server/src/controllers/product.controller.js`：
- `GET /api/products`：参数化组合筛选——keyword（title/brand/model LIKE）、category_id、product_type、brand、priceMin/priceMax、相机 frame_format/condition_grade_code、胶卷 iso/frame_format、配件 accessory_type/is_new；排序（最新/价格）；分页返回 `{ list, total }`
- `GET /api/products/:id`：商品 + 成色字典 JOIN + product_image（按 sort）+ inspection_item；仅 on_sale 可见

前端：
- `client/src/views/ProductList.vue`：左侧筛选面板（按当前分类动态显示维度）+ 搜索框 + 商品卡片网格 + 分页；筛选条件同步 URL query（可分享、可回退）
- `client/src/views/ProductDetail.vue`：图片轮播 + 按 product_type 差异化渲染（相机：快门/成色标签/来源/检测清单表格/检测总结；胶卷：感光度/画幅/有效期/储存条件；配件：类型/适配机型/新旧）+ 加入购物车按钮（未登录跳登录）
- Home.vue 分类卡片与最新上架改为接口数据
- router 增加 /products/:id

**验收**：三类商品筛选组合结果正确；详情页三类渲染正确；图片经 /uploads 代理可访问；分页正确。

### 6.4 阶段 3：交易闭环（约 1.5 周，核心，含事务与超卖防护）

**3.1 购物车**

后端 `server/src/controllers/cart.controller.js`（全部挂 auth）：
- `GET /api/cart`：JOIN product 返回当前价与库存
- `POST /api/cart`：加入（同一用户同一商品 upsert 数量，UNIQUE 键兜底）
- `PUT /api/cart/:productId`：修改数量（0 视为删除；校验不超过库存）
- `DELETE /api/cart/:productId`

前端：
- stores/cart.js 补全 action：fetchCart / addToCart / updateQuantity / removeItem
- `client/src/views/Cart.vue`：勾选商品 + 数量步进器 + 删除 + 合计 + 去结算
- 首页/详情页"加入购物车"按钮接入

**3.2 结算与订单创建（事务核心）**

后端 `server/src/controllers/order.controller.js`：
- `POST /api/orders`：body 含 items[{productId, quantity}] + 收货人三字段；事务流程：BEGIN → SELECT ... FOR UPDATE 逐项锁库存并校验充足（不足返回具体商品名）→ 按当前价计算总额 → INSERT order（order_no = JGJ+时间戳+随机 4 位，status='pending_pay'）→ 批量 INSERT order_item（价格快照）→ UPDATE product 扣库存 → 删除对应购物车项 → COMMIT；任一步失败 ROLLBACK
- `GET /api/orders`：列表（状态筛选 + 分页）
- `GET /api/orders/:id`：详情（校验归属）
- `POST /api/orders/:id/pay`：模拟支付，校验 pending_pay → paid + paid_at（事务）
- `POST /api/orders/:id/cancel`：仅 pending_pay 可取消，事务回补库存
- `POST /api/orders/:id/confirm`：shipped → completed（确认收货）

前端：
- `client/src/views/Checkout.vue`：收货人/电话/地址表单 + 订单明细 + 金额确认 + 提交（防重复提交）
- `client/src/views/Orders.vue`：状态 Tab（全部/待付款/已付款/已发货/已完成/已取消）+ 订单卡片
- `client/src/views/OrderDetail.vue`：状态时间线 + 订单项 + 收货信息 + 按状态显示操作按钮（支付/取消/确认收货）

**3.3 后台订单管理（发货）**
- `GET /api/admin/orders`（状态筛选 + 分页）、`GET /api/admin/orders/:id`
- `POST /api/admin/orders/:id/ship`：paid → shipped
- `client/src/views/admin/OrderList.vue`：表格 + 状态标签 + 发货按钮 + 详情对话框

**验收**：下单后库存正确扣减；库存不足拦截；**超卖测试**——库存 1 时并发两单只成一单；取消订单库存回补；状态机无非法流转（已发货不可取消）。

### 6.5 阶段 4：评价闭环（约 3 天）

后端 `server/src/controllers/review.controller.js`：
- `POST /api/reviews`：校验订单归属、status='completed'、商品在订单项中、同一订单同一商品未评过；rating 1-5
- `GET /api/products/:id/reviews`：商品评价列表（JOIN 用户名，分页）
- 商品详情接口附带评价数量与均分

前端：
- ProductDetail.vue 评价区块：均分 + 评价列表
- OrderDetail.vue：已完成订单显示"评价"入口 → 弹窗（星级 + 文字）提交；已评价置灰

**验收**：未完成订单不能评价；重复评价被拦截；详情页评价即时可见。

### 6.6 阶段 5：后台收尾与测试截图（约 1 周）

- 分类管理：`GET/POST/PUT/DELETE /api/admin/categories` + `client/src/views/admin/CategoryList.vue`（一级三类与子分类维护，有商品的分类禁止删除）
- 用户管理：`GET /api/admin/users`（分页/搜索）、`PATCH /api/admin/users/:id/status`（禁用/启用，禁用用户拒绝登录）+ `client/src/views/admin/UserList.vue`
- 全链路联调：注册→登录→浏览→筛选→加购→下单→支付→发货→确认收货→评价 完整走通
- 测试：执行功能测试用例表（15-20 条）；SUS 量表可用性测试
- 截图：论文第 4 章五节全部效果图（实际运行截图）
- 演示数据打磨：真实照片替换占位图、文案润色

## 7. 范围边界

本项目严格控制在开题报告范围内，明确以下不做项：

- 支付为模拟支付，不接入支付宝、微信等真实支付网关；
- 物流仅记录订单状态，不接入真实物流查询接口；
- 不实现拍卖、社交社区、直播带货、推荐算法等开题未要求的功能；
- 成色分级采用人工录入的受控等级，不实现基于图像的自动成色识别；
- 不做用户收藏夹、商品数据看板等扩展功能，除非核心交易链路提前完成且时间充裕。

## 8. 与开题报告的一致性

本项目技术路线与功能设计严格对应开题报告：

- B/S 体系结构与 MVC 设计模式；
- HTML5、CSS3、JavaScript、Vue.js 前端技术；
- Node.js 提供 RESTful API；
- MySQL 作为数据存储；
- 用户注册登录、商品浏览搜索、购物车、订单管理、模拟支付、评价管理；
- 后台商品、订单、用户、分类管理；
- 二手相机信息标准化、成色分级、多角度实拍；
- 胶卷有效期与储存条件展示；
- 多维检索机制；
- 用户体验设计与可用性测试。

Pinia、Element Plus、mysql2、multer 等为生态标配工具，不构成开题之外的大型功能模块。论文写作、系统实现与开题内容保持一致。
