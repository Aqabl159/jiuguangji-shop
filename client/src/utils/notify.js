import { ElMessage } from 'element-plus';

// 全站「功能待接入」统一占位反馈（界面先行阶段专用，接后端后移除）
export function notReady(action = '该功能') {
  ElMessage.info(`${action}功能待接入，接入后端后开放`);
}
