import request from '@/utils/request';
import { NameSpace } from '@/config/config';

// 任务报表
export async function fetchKpiView(params) {
  return request(`/${NameSpace.Coordinator}/traffic/getTaskKpiDTO`, {
    method: 'POST',
    data: params,
  });
}

export async function saveSearchSeek(params) {
  return request(`/${NameSpace.Coordinator}/traffic/saveTaskKpi`, {
    method: 'POST',
    data: params,
  });
}

export async function fetchAllSearchSeeds(params) {
  return request(`/${NameSpace.Coordinator}/traffic/findAllTaskKpi`, {
    method: 'POST',
    data: params,
  });
}

export async function deleteSearchSeek(id) {
  return request(`/${NameSpace.Coordinator}/traffic/deleteTaskKpi/${id}`, {
    method: 'DELETE',
  });
}

// 空等 KPI
export async function fetchWaitingKpiView(params) {
  return request(`/${NameSpace.LatentLifting}/api/getTargetWaitKpiDTO`, {
    method: 'POST',
    body: params,
  });
}

// 站点KPI
export async function getAllMonitorRegion() {
  return request(`/${NameSpace.LatentLifting}/monitor/getAllMonitorRegion`, {
    method: 'GET',
  });
}

export async function getRegionRealtimeReport(param) {
  return request(`/${NameSpace.LatentLifting}/monitor/realtimeStationTaskReport`, {
    method: 'POST',
    body: param,
  });
}

export async function getRegionReport(param) {
  return request(`/${NameSpace.LatentLifting}/monitor/stationTaskReport`, {
    method: 'POST',
    body: param,
  });
}
