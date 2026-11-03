import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { notFound, errorHandler } from './middleware/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// 全局中间件：跨域支持与 JSON 请求体解析
app.use(cors());
app.use(express.json());

// 商品图片静态目录（数据库只存路径）
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'jiuguangji-server' });
});

// 业务路由按阶段逐步挂载（阶段 1 起）

// 404 与统一错误处理
app.use(notFound);
app.use(errorHandler);

export default app;
