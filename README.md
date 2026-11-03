# 旧光集 · 影像器材电商网站

本科毕业设计项目：基于用户体验的"旧光集"影像器材电商网站设计与开发。聚焦复古胶片相机、全新胶卷与相机配件三类影像器材的在线展示与交易，采用 B/S 体系结构与前后端分离方式，基于 MVC 设计模式组织系统结构。

项目完整说明见《旧光集项目README_latest.md》。

## 技术栈

| 层次 | 技术 |
| --- | --- |
| 前端 | Vue 3 + Vite + Vue Router + Pinia + Axios + Element Plus（仅后台） |
| 后端 | Node.js + Express + mysql2 + JWT + bcryptjs + multer |
| 数据库 | MySQL 8.0 |

## 目录结构

```
jiuguangji-shop/
├── server/      # Express 后端（端口 3000）
├── client/      # Vue 3 前端（端口 5173，前台 + 后台路由分离）
├── database/    # 建库建表脚本 schema.sql
└── docs/        # 测试用例表等论文配套文档
```

## 启动步骤

1. 初始化数据库（需要 MySQL root 密码）：
   ```
   mysql -u root -p < database/schema.sql
   ```
2. 配置数据库连接：编辑 `server/.env`（参考 `server/.env.example`），填写数据库密码
3. 启动后端（端口 3000）：
   ```
   cd server
   npm install
   npm run dev
   ```
4. 初始化演示账号：
   ```
   cd server
   npm run seed
   ```
5. 启动前端（端口 5173）：
   ```
   cd client
   npm install
   npm run dev
   ```

## 演示账号

| 角色 | 用户名 | 密码 |
| --- | --- | --- |
| 管理员 | admin | admin123 |
| 普通用户 | demo | demo123 |
