import app from './app.js';

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`旧光集后端服务已启动: http://localhost:${PORT}`);
});
