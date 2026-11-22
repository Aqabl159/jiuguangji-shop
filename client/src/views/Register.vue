<template>
  <div class="container register">
    <div class="auth-card perforated-card">
      <p class="stamp register__stamp">旧光集</p>
      <h1 class="auth-title">注册账号</h1>
      <p class="auth-sub">加入暗房，支持邮箱或手机号注册</p>

      <form novalidate @submit.prevent="onSubmit">
        <div class="field">
          <label for="reg-username">用户名</label>
          <input
            id="reg-username"
            v-model.trim="form.username"
            type="text"
            class="input"
            autocomplete="username"
            placeholder="3-20 位字符"
            :aria-invalid="!!errors.username"
            @blur="validateUsername"
          />
          <p v-if="errors.username" class="field-error" role="alert">{{ errors.username }}</p>
        </div>
        <div class="field">
          <label for="reg-password">密码</label>
          <input
            id="reg-password"
            v-model="form.password"
            type="password"
            class="input"
            autocomplete="new-password"
            placeholder="至少 6 位"
            :aria-invalid="!!errors.password"
            @blur="validatePassword"
          />
          <p v-if="errors.password" class="field-error" role="alert">{{ errors.password }}</p>
        </div>
        <div class="field">
          <label for="reg-confirm">确认密码</label>
          <input
            id="reg-confirm"
            v-model="form.confirm"
            type="password"
            class="input"
            autocomplete="new-password"
            placeholder="再次输入密码"
            :aria-invalid="!!errors.confirm"
            @blur="validateConfirm"
          />
          <p v-if="errors.confirm" class="field-error" role="alert">{{ errors.confirm }}</p>
        </div>
        <div class="field">
          <label for="reg-contact">手机号或邮箱</label>
          <input
            id="reg-contact"
            v-model.trim="form.contact"
            type="text"
            class="input"
            autocomplete="email"
            placeholder="二选一填写，用于找回密码"
            :aria-invalid="!!errors.contact"
            @blur="validateContact"
          />
          <p v-if="errors.contact" class="field-error" role="alert">{{ errors.contact }}</p>
        </div>
        <button type="submit" class="btn btn-primary register__submit">注册</button>
      </form>

      <p class="auth-link">已有账号？<router-link to="/login">去登录</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { notReady } from '../utils/notify.js';

// 界面先行阶段：仅表单样式与前端校验，注册为业务动作（占位 toast）
const PHONE_RE = /^1[3-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const form = reactive({ username: '', password: '', confirm: '', contact: '' });
const errors = reactive({ username: '', password: '', confirm: '', contact: '' });

function validateUsername() {
  if (!form.username) {
    errors.username = '请输入用户名';
  } else if (form.username.length < 3 || form.username.length > 20) {
    errors.username = '用户名长度需为 3-20 位';
  } else {
    errors.username = '';
  }
}
function validatePassword() {
  errors.password = form.password.length >= 6 ? '' : '密码至少 6 位';
}
function validateConfirm() {
  errors.confirm = form.confirm === form.password ? '' : '两次输入的密码不一致';
}
function validateContact() {
  if (!form.contact) {
    errors.contact = '请填写手机号或邮箱（二选一）';
  } else if (!PHONE_RE.test(form.contact) && !EMAIL_RE.test(form.contact)) {
    errors.contact = '手机号或邮箱格式不正确';
  } else {
    errors.contact = '';
  }
}

function onSubmit() {
  validateUsername();
  validatePassword();
  validateConfirm();
  validateContact();
  if (errors.username || errors.password || errors.confirm || errors.contact) return;
  notReady('注册');
}
</script>

<style scoped>
.register {
  display: flex;
  justify-content: center;
}
.register__stamp {
  display: block;
  width: fit-content;
  margin: 0 auto var(--sp-3);
}
.register__submit {
  width: 100%;
  margin-top: var(--sp-2);
}
</style>
