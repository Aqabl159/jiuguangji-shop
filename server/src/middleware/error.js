// 404 兜底：未匹配到任何路由
export function notFound(req, res) {
  res.status(404).json({ message: '接口不存在' });
}

// 统一错误处理：所有控制器抛出的错误在此集中响应
export function errorHandler(err, req, res, next) {
  console.error('[server error]', err);
  res.status(err.status || 500).json({ message: err.message || '服务器内部错误' });
}
