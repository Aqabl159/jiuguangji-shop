import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL 连接池：所有数据库访问均通过 mysql2 参数化查询执行，防止 SQL 注入
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jiuguangji',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  // DATETIME 以字符串返回，避免时区转换偏移
  dateStrings: true,
});

export default pool;
