import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router';
import './assets/styles/theme.css';
import './assets/styles/base.css';
import './assets/styles/retro.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
// Element Plus 供后台管理页面使用
app.use(ElementPlus);
for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, component);
}

app.mount('#app');
