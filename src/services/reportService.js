import request from '@/utils/request';
import { NameSpace } from '@/config/config';

// 任务报表
export async function fetchKpiView(params) {
  return request(`/${NameSpace.Platform}/traffic/getTaskKpiDTO`, {
    method: 'POST',
    data: params,
  });
}

export async function saveSearchSeek(params) {
  return request(`/${NameSpace.Platform}/traffic/saveTaskKpi`, {
    method: 'POST',
    data: params,
  });
}

export async function fetchAllSearchSeeds(params) {
  return request(`/${NameSpace.Platform}/traffic/findAllTaskKpi`, {
    method: 'POST',
    data: params,
  });
}

export async function deleteSearchSeek(id) {
  return request(`/${NameSpace.Platform}/traffic/deleteTaskKpi/${id}`, {
    method: 'DELETE',
  });
}

// 空等 KPI
export async function fetchWaitingKpiView(params) {
  return request(`/${NameSpace.Platform}/api/getTargetWaitKpiDTO`, {
    method: 'POST',
    body: params,
  });
}

// 站点KPI
export async function getAllMonitorRegion() {
  return request(`/${NameSpace.Platform}/monitor/getAllMonitorRegion`, {
    method: 'GET',
  });
}

export async function getRegionRealtimeReport(param) {
  return request(`/${NameSpace.Platform}/monitor/realtimeStationTaskReport`, {
    method: 'POST',
    body: param,
  });
}

export async function getRegionReport(param) {
  return request(`/${NameSpace.Platform}/monitor/stationTaskReport`, {
    method: 'POST',
    body: param,
  });
}

/**** 报表中心 ****/
export async function saveReportGroup(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/reportForm/saveFormTemplate`, {
    method: 'POST',
    body: { ...params, sectionId: window.localStorage.getItem('sectionId') },
  });
}

export async function deleteReportGroup(vehicleType, id) {
  return request(`/${NameSpace[vehicleType]}/reportForm/deleteFormTemplateById`, {
    method: 'GET',
    body: { id, sectionId: window.localStorage.getItem('sectionId') },
  });
}

export async function fetchReportGroupList(vehicleType) {
  return request(`/${NameSpace[vehicleType]}/reportForm/getFormTemplateByUserId`, {
    method: 'GET',
    data: { sectionId: window.localStorage.getItem('sectionId') },
  });
}

export async function fetchDimensionDictionary(vehicleType) {
  return request(`/${NameSpace[vehicleType]}/reportForm/getDimensionDictionary`, {
    method: `GET`,
  });
}

export async function fetchReportGroupDataById(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/reportForm/getFormTemplateById`, {
    method: `GET`,
    data: { ...params, sectionId: window.localStorage.getItem('sectionId') },
  });
}

//获取报表数据源
export async function fetchReportSourceURL(vehicleType) {
  return request(`/${NameSpace[vehicleType]}/reportForm/getFormSource`, {
    method: 'GET',
    data: { sectionId: window.localStorage.getItem('sectionId') },
  });
}

//获取报表数据源详情(包含维度、筛选等等)
export async function fetchReportSourceDetail(vehicleType, id) {
  return request(`/${NameSpace[vehicleType]}/reportForm/getSourceDescribe`, {
    method: `GET`,
    body: { id, sectionId: window.localStorage.getItem('sectionId') },
  });
}

// 获取报表组报表数据
export async function fetchReportDetailByUrl(params) {
  return request(params.url, {
    method: 'POST',
    data: params,
  });
}
