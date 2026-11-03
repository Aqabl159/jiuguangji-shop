import { defineStore } from 'pinia';
import { ref } from 'vue';

// 登录用户状态：JWT 与用户信息持久化在 localStorage，
// Axios 拦截器自动携带令牌，路由守卫读取角色
export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '');
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'));

  function setLogin(tokenValue, user) {
    token.value = tokenValue;
    userInfo.value = user;
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('role', user.role);
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  function logout() {
    token.value = '';
    userInfo.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userInfo');
  }

  return { token, userInfo, setLogin, logout };
});
