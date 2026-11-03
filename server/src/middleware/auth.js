import jwt from 'jsonwebtoken';

// JWT 鉴权中间件：校验 Authorization 请求头中的令牌，
// 校验通过后将用户 ID 与角色挂载到 req.user，供后续业务使用
export function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/, '');
  if (!token) {
    return res.status(401).json({ message: '未登录，请先登录' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: '登录已过期，请重新登录' });
  }
}

// 管理员角色校验中间件：普通用户令牌访问后台接口返回 403
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: '无权限访问' });
  }
  next();
}
