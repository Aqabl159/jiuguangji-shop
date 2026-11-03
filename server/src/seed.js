// 演示数据初始化脚本（阶段 0：管理员与演示用户账号）
// 用法：在 server 目录执行 npm run seed
// 说明：脚本幂等，重复执行不会产生重复数据
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jiuguangji',
  charset: 'utf8mb4',
});

// 演示账号：管理员 admin/admin123，普通用户 demo/demo123
async function seedAccounts() {
  const [rows] = await pool.query('SELECT COUNT(*) AS cnt FROM `user`');
  if (rows[0].cnt > 0) {
    console.log('用户表已有数据，跳过账号初始化');
    return;
  }
  const adminHash = await bcrypt.hash('admin123', 10);
  const demoHash = await bcrypt.hash('demo123', 10);
  await pool.query(
    `INSERT INTO \`user\` (username, password_hash, role, email) VALUES
     ('admin', ?, 'admin', 'admin@jiuguangji.com'),
     ('demo', ?, 'user', 'demo@jiuguangji.com')`,
    [adminHash, demoHash]
  );
  console.log('✔ 演示账号已初始化：admin / admin123（管理员）、demo / demo123（普通用户）');
}

async function main() {
  await seedAccounts();
  await pool.end();
}

main().catch((err) => {
  console.error('✘ 初始化失败：', err.message);
  process.exit(1);
});
