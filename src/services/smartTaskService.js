import { NameSpace } from '@/config/config';
import request from '@/utils/request';

// ***************** 快捷任务 ***************** //
// 保存快捷任务
export function saveQuickTask(param) {
  return request(`/${NameSpace.Platform}/quickTask/saveQuickTask`, {
    method: 'POST',
    data: param,
  });
}

// 获取当前用户创建的快捷任务，包括别人分享的
export function fetchVisibleQuickTasks() {
  return request(`/${NameSpace.Platform}/quickTask/getUserQuickTasks`, {
    method: 'GET',
  });
}

// 根据id获取快捷任务信息
export function fetchQuickTaskById(id) {
  return request(`/${NameSpace.Platform}/quickTask/getQuickTaskById`, {
    method: 'GET',
    data: { id },
  });
}

// 删除快捷任务
export function deleteQuickTask(ids) {
  return request(`/${NameSpace.Platform}/quickTask/deleteQuickTask`, {
    method: 'POST',
    data: ids,
  });
}

// 保存快捷任务组
export function saveQuickTaskGroup(param) {
  return request(`/${NameSpace.Platform}/quickTask/saveQuickTaskGroup`, {
    method: 'POST',
    data: param,
  });
}

// 获取所有快捷任务组
export function fetchAllQuickTaskGroups() {
  return request(`/${NameSpace.Platform}/quickTask/getQuickTaskGroups`, {
    method: 'GET',
  });
}

// 获取所有快捷任务组
export function deleteQuickTaskGroup(ids) {
  return request(`/${NameSpace.Platform}/quickTask/deleteQuickTaskGroup`, {
    method: 'POST',
    data: ids,
  });
}
