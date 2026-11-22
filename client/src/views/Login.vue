<template>
  <div class="container login">
    <div class="auth-card perforated-card">
      <p class="stamp login__stamp">旧光集</p>
      <h1 class="auth-title">会员登录</h1>
      <p class="auth-sub">欢迎回到暗房，旧相机正在等你</p>

      <form novalidate @submit.prevent="onSubmit">
        <div class="field">
          <label for="login-username">用户名</label>
          <input
            id="login-username"
            v-model.trim="form.username"
            type="text"
            class="input"
            autocomplete="username"
            placeholder="请输入用户名"
            :aria-invalid="!!errors.username"
            @blur="validateUsername"
          />
          <p v-if="errors.username" class="field-error" role="alert">{{ errors.username }}</p>
        </div>
        <div class="field">
          <label for="login-password">密码</label>
          <input
            id="login-password"
            v-model="form.password"
            type="password"
            class="input"
            autocomplete="current-password"
            placeholder="请输入密码"
            :aria-invalid="!!errors.password"
            @blur="validatePassword"
          />
          <p v-if="errors.password" class="field-error" role="alert">{{ errors.password }}</p>
        </div>
        <button type="submit" class="btn btn-primary login__submit">登录</button>
      </form>

      <p class="auth-link">还没有账号？<router-link to="/register">立即注册</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { notReady } from '../utils/notify.js';

// 界面先行阶段：仅表单样式与前端校验，登录为业务动作（占位 toast）
const form = reactive({ username: '', password: '' });
const errors = reactive({ username: '', password: '' });

function validateUsername() {
  errors.username = form.username ? '' : '请输入用户名';
}
function validatePassword() {
  errors.password = form.password ? '' : '请输入密码';
}

function onSubmit() {
  validateUsername();
  validatePassword();
  if (errors.username || errors.password) return;
  notReady('登录');
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
}
.login__stamp {
  display: block;
  width: fit-content;
  margin: 0 auto var(--sp-3);
}
.login__submit {
  width: 100%;
  margin-top: var(--sp-2);
}
</style>
