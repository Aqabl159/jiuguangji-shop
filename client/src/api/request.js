import axios from 'axios';
import { ElMessage } from 'element-plus';

// 统一 Axios 实例：
// 请求拦截器自动携带 JWT；响应拦截器统一处理错误与登录失效
const request = axios.create({ baseURL: '/api', timeout: 10000 });

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || '网络异常，请稍后重试';
    // 401：登录失效，清除本地登录态并回到登录页
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userInfo');
      if (!location.pathname.startsWith('/login')) {
        location.href = '/login';
      }
    }
    ElMessage.error(message);
    return Promise.reject(error);
  }
);

export default request;
