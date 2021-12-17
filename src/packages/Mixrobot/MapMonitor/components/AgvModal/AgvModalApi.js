import request from '@/utils/request';
import { ApiNameSpace } from '@/config/config';

// 这里有重复接口
// 小车空跑
export async function fetchAgvEmptyRun(params, nameSpace) {
  return request(`/${nameSpace}/agv-task/empty-run`, {
    method: 'POST',
    data: params,
  });
}

// 小车回休息区
export async function fetchAGVToRest(params, nameSpace) {
  return request(`/${nameSpace}/agv-task/goToRest`, {
    method: 'GET',
    data: params,
  });
}

// 小车去充电
export async function fetchGoCharge(params, nameSpace) {
  return request(`/${nameSpace}/agv/action/tryToCharge`, {
    method: 'GET',
    data: params,
  });
}

// 取消小车任务
export async function fetchCancelTask(params, nameSpace) {
  return request(`/${nameSpace}/agv-task/action/cancelTask`, {
    method: 'GET',
    data: params,
  });
}

// 请求重发任务
export async function fetchRestartTask(params, nameSpace) {
  return request(`/${nameSpace}/agv-task/action/restartTask`, {
    method: 'GET',
    data: params,
  });
}

// 请求小车的软件信息
export async function fetchAgvInfoByAgvId(params, namespace) {
  return request(`/${namespace}/agv/${params.sectionId}/${params.agvId}`, {
    method: `GET`,
  });
}

// 请求小车错误日志
export async function fetchAgvErrorRecord(params, namespace) {
  return request(`/${namespace}/api/agvErrorRecord`, {
    method: 'POST',
    data: params,
  });
}

// 重置小车状态
export async function fetchForceStandBy(params, namespace) {
  return request(`/${namespace}/agv/action/forceStandBy`, {
    method: `GET`,
    data: params,
  });
}

// 小车移出地图
export async function fetchMoveoutAGVs(params, namespace) {
  return request(`/${namespace}/agv/robotRemoveFromMap`, {
    method: 'POST',
    data: params,
  });
}

// 发送小车命令
export async function fetchSendAgvHexCommand(params, namespace) {
  return request(`/${namespace}/agv/command`, {
    method: 'POST',
    data: params,
  });
}

// 请求维护小车
export async function fetchMaintain(params, namespace) {
  return request(`/${namespace}/agv/action/maintain`, {
    method: 'GET',
    data: params,
  });
}

// 请求切换小车手动模式
export async function fetchSwitchManualMode(params, namespace) {
  return request(`/${namespace}/agv/action/manualMode`, {
    method: 'GET',
    data: params,
  });
}

// 获取料箱车料箱信息
export async function fetchToteBins(params) {
  return request(`/${ApiNameSpace.Tote}/factory/getRobotToteList`, {
    method: 'GET',
    data: params,
  });
}

// 获取红外料箱池的小车预分配任务
export async function fetchTotePoolCodes(params) {
  return request(`/${ApiNameSpace.Tote}/pool/getToteCodeByAGVId`, {
    method: 'GET',
    data: params,
  });
}

// 查询小车载货情况
// http://apidoc.mushiny.com:8080/web/#/21?page_id=1347
export async function fetchForkLiftLoad(robotId) {
  return request(`/${ApiNameSpace.ForkLifting}/storage/queryAgvLoad/${robotId}`, {
    method: 'GET',
  });
}

// 获取当前小车实时运行信息
export async function fetchAgvRunningInfo(params) {
  return request(`/${ApiNameSpace.Coordinator}/problemHandling/getAgvErrorMessage`, {
    method: 'GET',
    data: params,
  });
}
