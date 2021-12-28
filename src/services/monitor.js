import request from '@/utils/request';
import { AppCode, NameSpace } from '@/config/config';

export async function fetchAllScopeActions(sectionId) {
  return request(`/${NameSpace.Coordinator}/actionScope/getAllActionScope`, {
    method: 'GET',
    data: { sectionId },
  });
}

// 新增地图临时不可走点
export async function updateTemporaryBlockCell(payload) {
  return request(`/${NameSpace.Coordinator}/lock/saveTemporaryCell`, {
    method: 'POST',
    data: payload,
  });
}

// 删除地图临时不可走点
export async function deleteTemporaryBlockCell(payload) {
  return request(`/${NameSpace.Coordinator}/lock/deleteTemporaryCell`, {
    method: 'POST',
    data: payload,
  });
}

// 获取地图所有临时不可走点
export async function fetchTemporaryBlockCells() {
  return request(`/${NameSpace.Coordinator}/lock/getTemporaryLockedCells`, {
    method: 'GET',
  });
}

// 获取小车任务路径
export async function fetchAgvTaskPath(robotIds) {
  return request(`/${NameSpace.Coordinator}/traffic/getAllPath/${robotIds.join()}`, {
    method: 'GET',
  });
}

///////////////////////// ******** 潜伏相关接口 ******** //////////////////////////
// 获取已到站的潜伏货架
export async function fetchWorkStationPods() {
  return request(`/${NameSpace.LatentLifting}/agv-task/getWorkStationPods`, {
    method: 'GET',
  });
}

// 获取潜伏车系统参数
export async function fetchLatentLiftingSystemParam() {
  return request(`/${NameSpace.LatentLifting}/formTemplate/getFormTemplate`, {
    method: 'GET',
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
  return request(`/${NameSpace.Tote}/agv-task/autoCallWorkstationTask`, {
    method: 'POST',
    data: params,
  });
}

// 自动释放料箱自动任务
export async function autoReleaseToteTask(params) {
  return request(`/${NameSpace.Tote}/agv-task/autoReleaseWorkstationTask`, {
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
export async function agvEmptyRun(AGVType, params) {
  return request(`/${NameSpace[AppCode[AGVType]]}/agv-task/empty-run`, {
    method: 'POST',
    data: params,
  });
}

// 小车充电
export async function agvTryToCharge(AGVType, params) {
  return request(`/${NameSpace[AppCode[AGVType]]}/agv/action/tryToCharge`, {
    method: 'GET',
    data: params,
  });
}

// 小车回休息区
export async function agvToRest(AGVType, params) {
  return request(`/${NameSpace[AppCode[AGVType]]}/agv-task/goToRest`, {
    method: 'GET',
    data: params,
  });
}

// 小车命令
export async function agvCommand(AGVType, params) {
  return request(`/${NameSpace[AppCode[AGVType]]}/agv/batchSendCommand`, {
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
    method: 'GET',
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
  return request(`/${NameSpace.Tote}/agv-task/autoCallConfig`, {
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

/////////////////////////******** 模拟器 ******** //////////////////////////
// 开启模拟器
export async function openSimulator() {
  return request(`/${NameSpace.Coordinator}/simulator/openSimulator`, {
    method: 'GET',
  });
}

// 关闭模拟器
export async function closeSimulator() {
  return request(`/${NameSpace.Coordinator}/simulator/closeSimulator`, {
    method: 'GET',
  });
}

// 添加虚拟车
export async function addSimulationAgv(params) {
  return request(`/${NameSpace.Coordinator}/simulator/agvLogin`, {
    method: 'POST',
    data: params,
  });
}

// 批量添加模拟车
export async function addSimulationAgvs(params) {
  return request(`/${NameSpace.Coordinator}/simulator/batchAgvLogin`, {
    method: 'POST',
    data: params,
  });
}

// 更新模拟配置
export async function fetchUpdateAGVConfig(params) {
  return request(`/${NameSpace.Coordinator}/simulator/saveAGVConfig`, {
    method: 'POST',
    data: params,
  });
}

// 获取车型模拟车配置
export async function fetchSimulatorAGVConfig(robotType) {
  return request(`/${NameSpace.Coordinator}/simulator/getAGVConfig/${robotType}`, {
    method: 'GET',
  });
}

// 获取模拟器小车
export async function fetchSimulatorLoginAGV() {
  return request(`/${NameSpace.Coordinator}/traffic/getAllAGV`, {
    method: 'GET',
  });
}

// 获取模拟器小车相关状态
export async function fetchSimulatorLoginAGVControlState() {
  return request(`/${NameSpace.Coordinator}/simulator/getAGVControl`, {
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
    `/${NameSpace.Coordinator}/simulator/agvOffLine/${params.sectionId}/${params.robotId}`,
    { method: 'GET' },
  );
}

// 批量删除小车
export async function fetchBatchDeleteSimulatorAgv(params) {
  return request(
    `/${NameSpace.Coordinator}/simulator/batchAgvDelete/${params.logicId}/${params.robotIds}`,
    {
      method: 'DELETE',
    },
  );
}

// 获取模拟器错误消息
export async function fetchSimulatorErrorMessage(params) {
  return request(`/${NameSpace.Coordinator}/simulator/errorMessage`, {
    method: 'POST',
    data: params,
  });
}

export async function fetchSimulatorHistory() {
  return request(`/${NameSpace.Coordinator}/simulator/getSimulator`, {
    method: 'GET',
  });
}

// 获取通道锁信息
export async function getTunnelState() {
  return request(`/${NameSpace.Coordinator}/traffic/getTunnelLock`, {
    method: 'GET',
  });
}

// 删除通道锁
export async function deleteTunnelAgvLock(robotId) {
  return request(`/${NameSpace.Coordinator}/traffic/clearTunnelLock/${robotId}`, {
    method: 'GET',
  });
}