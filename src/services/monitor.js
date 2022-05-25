import request from '@/utils/request';
import { NameSpace } from '@/config/config';

// 新增地图临时不可走点
export async function updateTemporaryBlockCell(payload) {
  return request(`/${NameSpace.Platform}/lock/saveTemporaryCell`, {
    method: 'POST',
    data: payload,
  });
}

// 删除地图临时不可走点
export async function deleteTemporaryBlockCell(payload) {
  return request(`/${NameSpace.Platform}/lock/deleteTemporaryCell`, {
    method: 'POST',
    data: payload,
  });
}

// 获取地图所有临时不可走点
export async function fetchTemporaryBlockCells() {
  return request(`/${NameSpace.Platform}/lock/getTemporaryLockedCells`, {
    method: 'GET',
  });
}

/****显示路径 start*****/
// 根据小车 获取小车的任务路径(单个)
export async function getPathActionByAgvId(vehicleId, vehicleType) {
  return request(`/${NameSpace.Platform}/traffic/getPathByVehicleId/${vehicleId}/${vehicleType}`, {
    method: 'GET',
  });
}
//  根据小车 获取小车的任务路径(批量)
export async function getAllPathByIds(params) {
  return request(`/${NameSpace.Platform}/traffic/getPathByUniqueIds`, {
    method: 'GET',
    data: params,
  });
}

// 获取小车的任务路径
export async function getAllPath(logicId) {
  return request(`/${NameSpace.Platform}/traffic/getAllLockedCells/${logicId}`, { method: 'GET' });
}

///////////////////////// ******** 潜伏相关接口 ******** //////////////////////////
// 获取已到站的潜伏货架
export async function fetchWorkStationPods() {
  return request(`/${NameSpace.LatentLifting}/agv-task/getWorkStationPods`, {
    method: 'GET',
  });
}

// 获取潜伏车系统参数
export async function fetchLatentLiftingSystemParam(params) {
  return request(`/${NameSpace.LatentLifting}/formTemplate/getFormTemplate`, {
    method: 'GET',
    data: params,
  });
}

// 获取地图潜伏任务暂停事件
export async function fetchLatentPausedEventList(params) {
  return request(`/${NameSpace.LatentLifting}/agv-task/getPauseTaskEvent`, {
    method: 'GET',
    data: params,
  });
}

// 潜伏车自动释放
export async function fetchAutoReleasePod(params) {
  return request(`/${NameSpace.LatentLifting}/agv-task/autoReleasePod`, {
    method: 'POST',
    data: params,
  });
}

// 设置潜伏货架
export async function fetchSetPod(params) {
  return request(`/${NameSpace.LatentLifting}/pod/batch`, {
    method: 'POST',
    data: params,
  });
}

// 删除潜伏货架
export async function fetchDeletePod(params) {
  return request(`/${NameSpace.LatentLifting}/pod/deletePod/${params.sectionId}`, {
    method: 'POST',
    data: [params.podId],
  });
}

// 批量更新地图潜伏货架
export async function batchUpdateLatentPod(params) {
  return request(`/${NameSpace.LatentLifting}/pod/deletePodBySectionId/${params.sectionId}`, {
    method: 'DELETE',
    data: params,
  });
}

///////////////////////// ******** 料箱相关接口 ******** //////////////////////////
// 料箱搬运
export async function toteToWorkstation(map) {
  return request(`/tote/agv-task/tote-to-workstation`, {
    method: 'POST',
    data: map,
  });
}

// 料箱自动任务
export async function autoCallToteTask(params) {
  return request(`/${NameSpace.Platform}/agv-task/autoCallWorkstationTask`, {
    method: 'POST',
    data: params,
  });
}

// 自动释放料箱自动任务
export async function autoReleaseToteTask(params) {
  return request(`/${NameSpace.Platform}/agv-task/autoReleaseWorkstationTask`, {
    method: 'POST',
    data: params,
  });
}

/////////////////////////******** 小车动作相关 ******** //////////////////////////
// 潜伏车搬运
export async function fetchPodToCell(params) {
  return request(`/${NameSpace.LatentLifting}/agv-task/pod-to-cell`, {
    method: 'POST',
    data: params,
  });
}

// 小车空跑
export async function agvEmptyRun(params) {
  const sectionId = window.localStorage.getItem('sectionId');
  return request(`/${NameSpace.Platform}/task/empty-run`, {
    method: 'POST',
    data: { ...params, sectionId },
  });
}

// 小车充电
export async function agvTryToCharge(AGVType, params) {
  return request(`/${NameSpace[AGVType]}/agv/action/tryToCharge`, {
    method: 'GET',
    data: params,
  });
}

// 小车回休息区
export async function agvToRest(AGVType, params) {
  return request(`/${NameSpace[AGVType]}/agv-task/goToRest`, {
    method: 'GET',
    data: params,
  });
}

// 小车命令
export async function agvCommand(AGVType, params) {
  return request(`/${NameSpace[AGVType]}/agv/batchSendCommand`, {
    method: 'POST',
    data: params,
  });
}

// 发送小车命令
export async function agvRemoteControl(AGVType, params) {
  return request(`/${NameSpace[AGVType]}/agv/command`, {
    method: 'POST',
    data: params,
  });
}

// 呼叫潜伏货架到工作站
export async function latentPodToWorkStation(payload) {
  return request(`/${NameSpace.LatentLifting}/agv-task/pod-to-workstation`, {
    method: 'POST',
    data: payload,
  });
}

// 潜伏高级搬运
export async function advancedLatnetHandling(params) {
  return request(`/${NameSpace.LatentLifting}/agv-task/super-pod-to-cell`, {
    method: 'POST',
    data: params,
  });
}

// 潜伏高级搬运（释放）
export async function releaseAdvancedLatnetHandling(params) {
  return request(`/${NameSpace.LatentLifting}/agv-task/superCarryReleasePod`, {
    method: 'POST',
    data: params,
  });
}

// 工作站自动任务(潜伏)
export async function autoCallLatentPodToWorkstation(params) {
  return request(`/${NameSpace.LatentLifting}/agv-task/autoCallPodToWorkstation`, {
    method: 'POST',
    data: params,
  });
}

// 恢复潜伏暂停的任务
export async function resumeLatentPausedTask(params) {
  return request(`/${NameSpace.LatentLifting}/agv-task/agvResumeTaskRun`, {
    method: 'POST',
    data: params,
  });
}

// 潜伏自动释放
export async function releaseLatentPod(params) {
  return request(`/${NameSpace.LatentLifting}/agv-task/releasePod`, {
    method: 'POST',
    data: params,
  });
}

// 保存工作站自动任务配置(潜伏)
export async function saveLatentAutomaticTaskConfig(params) {
  return request(`/${NameSpace.LatentLifting}/agv-task/saveAutoConfig`, {
    method: 'POST',
    data: params,
  });
}

// @Refact: 工作站自动任务(潜伏)
export async function fetchLatentAutoTaskConfig() {
  return request(`/${NameSpace.LatentLifting}/agv-task/getAutoTaskConfig`, {
    method: 'GET',
  });
}

// 工作站自动任务(料箱)
export async function fetchToteAutoTaskConfig() {
  return request(`/${NameSpace.Platform}/agv-task/autoCallConfig`, {
    method: 'GET',
  });
}

// 工作站自动任务(叉车)
export async function fetchForkliftAutoTaskConfig() {
  return request(`/${NameSpace.ForkLifting}/agv-task/autoCallConfig`, {
    method: 'GET',
  });
}

// 切换叉车自动呼叫状态
export async function fetchForkLiftAutoCall(params) {
  return request(`/${NameSpace.ForkLifting}/agv-task/autoCarryTask`, {
    method: 'POST',
    data: params,
  });
}

// 分拣车去拣货
export async function sorterToPick(params) {
  return request(`/${NameSpace.Sorter}/agv-task/fetch-pod`, {
    method: 'POST',
    data: params,
  });
}

// 分拣车去抛货
export async function sorterToThrow(params) {
  return request(`/${NameSpace.Sorter}/agv-task/throw-pod`, {
    method: 'POST',
    data: params,
  });
}

// 叉车获取空货位或者满货位数据
export async function fetchEmptyAndFullStorage() {
  return request(`/${NameSpace.ForkLifting}/storage/getEmptyAndFullStorageDTO`, {
    method: 'GET',
  });
}

// 叉车搬运
export async function forkPodToTarget(param) {
  return request(`/${NameSpace.ForkLifting}/agv-task/forkPalletToTarget`, {
    method: 'POST',
    data: param,
  });
}

// 分拣车去拣货
export async function fetchSorterToPick(params) {
  return request(`/${NameSpace.Sorter}/agv-task/pick-up`, {
    method: 'POST',
    data: params,
  });
}

// 分拣车去抛货
export async function fetchSorterToThrow(params) {
  return request(`/${NameSpace.Sorter}/agv-task/deliver`, {
    method: 'POST',
    data: params,
  });
}

/////////////////////////******** 模拟器 ******** //////////////////////////
// 开启模拟器
export async function openSimulator() {
  return request(`/${NameSpace.Platform}/simulator/openSimulator`, {
    method: 'GET',
  });
}

// 关闭模拟器
export async function closeSimulator() {
  return request(`/${NameSpace.Platform}/simulator/closeSimulator`, {
    method: 'GET',
  });
}

// 添加虚拟车
export async function addSimulationAgv(params) {
  return request(`/${NameSpace.Platform}/simulator/agvLogin`, {
    method: 'POST',
    data: params,
  });
}

// 批量添加模拟车
export async function addSimulationAgvs(params) {
  return request(`/${NameSpace.Platform}/simulator/batchAgvLogin`, {
    method: 'POST',
    data: params,
  });
}

// 更新模拟配置
export async function fetchUpdateAGVConfig(params) {
  return request(`/${NameSpace.Platform}/simulator/saveAGVConfig`, {
    method: 'POST',
    data: params,
  });
}

// 获取车型模拟车配置
export async function fetchSimulatorAGVConfig(robotType) {
  return request(`/${NameSpace.Platform}/simulator/getAGVConfig/${robotType}`, {
    method: 'GET',
  });
}

// 获取模拟器小车相关状态
export async function fetchSimulatorLoginAGVControlState() {
  return request(`/${NameSpace.Platform}/simulator/getAGVControl`, {
    method: 'GET',
  });
}

// 模拟小车松急停
export async function fetchRunAGV(robotId) {
  return request(`/coordinator/simulator/runAGV/${robotId}`, {
    method: 'GET',
  });
}

// 模拟小车拍急停
export async function fetchStopAGV(robotId) {
  return request(`/coordinator/simulator/stopAGV/${robotId}`, {
    method: 'GET',
  });
}

// 模拟小车开机
export async function fetchOpenAGV(robotId) {
  return request(`/coordinator/simulator/openAGV/${robotId}`, {
    method: 'GET',
  });
}

// 模拟小车关机
export async function fetchCloseAgv(robotId) {
  return request(`/coordinator/simulator/closeAGV/${robotId}`, {
    method: 'GET',
  });
}

// 下线小车
export async function fetchSimulatorAgvOffLine(params) {
  return request(
    `/${NameSpace.Platform}/simulator/agvOffLine/${params.sectionId}/${params.robotId}`,
    { method: 'GET' },
  );
}

// 批量删除小车
export async function fetchBatchDeleteSimulatorAgv(params) {
  return request(
    `/${NameSpace.Platform}/simulator/batchAgvDelete/${params.logicId}/${params.robotIds}`,
    {
      method: 'DELETE',
    },
  );
}

// 获取模拟器错误消息
export async function fetchSimulatorErrorMessage(params) {
  return request(`/${NameSpace.Platform}/simulator/errorMessage`, {
    method: 'POST',
    data: params,
  });
}

export async function fetchSimulatorHistory() {
  return request(`/${NameSpace.Platform}/simulator/getSimulator`, {
    method: 'GET',
  });
}

// 获取通道锁信息
export async function getTunnelState() {
  return request(`/${NameSpace.Platform}/traffic/getTunnelLock`, {
    method: 'GET',
  });
}

// 删除通道锁
export async function deleteTunnelAgvLock(robotId) {
  return request(`/${NameSpace.Platform}/traffic/clearTunnelLock/${robotId}`, {
    method: 'GET',
  });
}

// 工作站
// 任务数据
export async function fetchWorkStationInstrument(params) {
  return request(`/${NameSpace.LatentLifting}/agv-task/getWorkStationInstrument`, {
    method: 'GET',
    data: params,
  });
}

// 最近30次等待时间
export async function fetchWorkStationPre30Waiting(params) {
  return request(`/${NameSpace.LatentLifting}/api/getStopWaitKpiDTO`, {
    method: 'POST',
    data: params,
  });
}

// 获取通用站点的到站次数在途小车
export async function fetchCommonPointInstrument(params) {
  return request(`/${NameSpace.Platform}/stationProxy/getStationReport`, {
    method: 'GET',
    data: params,
  });
}
// 获取通用站点30s数据
export async function fetchCommonPointPre30Waiting(params) {
  return request(`/${NameSpace.Platform}/stationProxy/getStopWaitKpiDTO`, {
    method: 'POST',
    data: params,
  });
}

// 获取站点查询实时速率
export async function fetchStationRealTimeRate(params) {
  return request(`/${NameSpace.Platform}/stationProxy/getRealTimeRate`, {
    method: 'GET',
    data: params,
  });
}
