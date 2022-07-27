import { getDomainNameByUrl, isNull } from '@/utils/util';
import { NameSpace } from '@/config/config';

/**
 * @@@@@@ 单例 @@@@@@
 * 便有在不同地方使用同一个 Worker
 */

const AlertCountPolling = {}; // 告警中心告警信息数量轮询
const VehiclePollingTaskPathManager = {}; // 小车任务路径轮询
const LockCellPolling = {}; // 点位锁格轮询
const CommonStationStatePolling = {}; // 获取通用站点雇佣车
const WorkStationStatePolling = {}; // 获取工作站雇佣车
const CostHeatPollingManager = {}; // 点位热度轮询
const StationRatePolling = {}; // 站点速率轮询
const VehicleUpgradeProgress = {}; // 车辆固件升级进度轮询
const VehicleLisPolling = {}; // 获取所有小车 轮询

// @@@ 告警中心告警信息数量轮询
AlertCountPolling.getInstance = function (dispatcher) {
  if (isNull(AlertCountPolling.instance)) {
    const worker = new Worker(new URL('./alertCountPolling.worker.js', import.meta.url));
    worker.onmessage = function ({ data }) {
      /**
       * TODO
       * 1. 如果token过期就停止
       * 2. 处理错误
       */
      if (data && typeof data === 'number') {
        dispatcher(data);
      }
    };
    AlertCountPolling.instance = worker;
  }
  return AlertCountPolling.instance;
};

AlertCountPolling.start = function (dispatcher) {
  if (isNull(AlertCountPolling.instance)) {
    AlertCountPolling.getInstance(dispatcher);
  }
  const alertCountURL = getDomainNameByUrl(
    `/${NameSpace.Platform}/alertCenter/getAlertCenterCount`,
  );
  AlertCountPolling.instance.postMessage({
    state: 'start',
    url: alertCountURL,
    token: window.sessionStorage.getItem('token'),
    sectionId: window.localStorage.getItem('sectionId'),
  });
};

AlertCountPolling.terminate = function () {
  console.log('Closing Alert Count Polling...');
  if (!isNull(AlertCountPolling.instance)) {
    AlertCountPolling.instance.postMessage({
      state: 'end',
    });
    AlertCountPolling.instance.terminate();
    AlertCountPolling.instance = null;
  }
};

// @@@ 小车任务路径
VehiclePollingTaskPathManager.getInstance = function (dispatcher) {
  if (isNull(VehiclePollingTaskPathManager.instance)) {
    const worker = new Worker(new URL('./vehiclePathPolling.worker.js', import.meta.url));
    worker.onmessage = function ({ data }) {
      if (data && Array.isArray(data)) {
        dispatcher(data);
      }
    };
    VehiclePollingTaskPathManager.instance = worker;
  }
  return VehiclePollingTaskPathManager.instance;
};

VehiclePollingTaskPathManager.start = function (uniqueIds = [], dispatcher) {
  if (isNull(VehiclePollingTaskPathManager.instance)) {
    VehiclePollingTaskPathManager.getInstance(dispatcher);
  }
  const params = {
    uniqueIds,
  };
  const vehiclePathURL = getDomainNameByUrl(`/${NameSpace.Platform}/traffic/getPathByUniqueIds`);
  VehiclePollingTaskPathManager.instance.postMessage({
    state: 'start',
    url: vehiclePathURL,
    token: window.sessionStorage.getItem('token'),
    sectionId: window.localStorage.getItem('sectionId'),
    params,
  });
};

VehiclePollingTaskPathManager.terminate = function () {
  if (!isNull(VehiclePollingTaskPathManager.instance)) {
    VehiclePollingTaskPathManager.instance.postMessage({
      state: 'end',
    });
    VehiclePollingTaskPathManager.instance.terminate();
    VehiclePollingTaskPathManager.instance = null;
  }
};

// @@@ 点位锁格轮询
LockCellPolling.getInstance = function (dispatcher) {
  if (isNull(LockCellPolling.instance)) {
    const worker = new Worker(new URL('./lockCellPolling.worker.js', import.meta.url));
    worker.onmessage = function ({ data }) {
      /**
       * TODO
       * 1. 如果token过期就停止
       * 2. 处理错误
       */
      if (data && Array.isArray(data)) {
        dispatcher(data);
      }
    };
    LockCellPolling.instance = worker;
  }
  return LockCellPolling.instance;
};

LockCellPolling.start = function (params, dispatcher) {
  if (isNull(LockCellPolling.instance)) {
    LockCellPolling.getInstance(dispatcher);
  }
  const lockCellURL = getDomainNameByUrl(`/${NameSpace.Platform}/lock/getLockCellsByUniqueIds`);
  LockCellPolling.instance.postMessage({
    state: 'start',
    url: lockCellURL,
    token: window.sessionStorage.getItem('token'),
    sectionId: window.localStorage.getItem('sectionId'),
    params,
  });
};

LockCellPolling.terminate = function () {
  if (!isNull(LockCellPolling.instance)) {
    LockCellPolling.instance.postMessage({
      state: 'end',
    });
    LockCellPolling.instance.terminate();
    LockCellPolling.instance = null;
  }
};

//  @@@ 获取通用站点雇佣车
CommonStationStatePolling.getInstance = function (dispatcher) {
  if (isNull(CommonStationStatePolling.instance)) {
    const worker = new Worker(new URL('./workStationPolling.worker.js', import.meta.url));
    worker.onmessage = function ({ data: { response, requestParam } }) {
      const newData = [];
      response.map(({ code, data }, index) => {
        if (code === '0') {
          newData.push({ ...data, ...requestParam[index] });
        }
      });
      dispatcher(newData);
    };
    CommonStationStatePolling.instance = worker;
  }
  return CommonStationStatePolling.instance;
};

CommonStationStatePolling.start = function (promises, dispatcher) {
  if (isNull(CommonStationStatePolling.instance)) {
    CommonStationStatePolling.getInstance(dispatcher);
  }

  const workStationURL = getDomainNameByUrl(`/${NameSpace.Platform}/stationProxy/getStationReport`);

  CommonStationStatePolling.instance.postMessage({
    state: 'start',
    requestParam: promises,
    url: workStationURL,
    token: window.sessionStorage.getItem('token'),
    sectionId: window.localStorage.getItem('sectionId'),
  });
};

CommonStationStatePolling.terminate = function () {
  if (!isNull(CommonStationStatePolling.instance)) {
    CommonStationStatePolling.instance.postMessage({
      state: 'end',
    });

    CommonStationStatePolling.instance.terminate();
    CommonStationStatePolling.instance = null;
  }
};

//  @@@ 获取工作站雇佣车
WorkStationStatePolling.getInstance = function (dispatcher) {
  if (isNull(WorkStationStatePolling.instance)) {
    const worker = new Worker(new URL('./workStationPolling.worker.js', import.meta.url));
    worker.onmessage = function ({ data: { response, requestParam } }) {
      const newData = [];
      response.map(({ code, data }, index) => {
        if (code === '0') {
          newData.push({ ...data, ...requestParam[index] });
        }
      });
      dispatcher(newData);
    };
    WorkStationStatePolling.instance = worker;
  }
  return WorkStationStatePolling.instance;
};

WorkStationStatePolling.start = function (promises, dispatcher) {
  if (isNull(WorkStationStatePolling.instance)) {
    WorkStationStatePolling.getInstance(dispatcher);
  }

  const workStationURL = getDomainNameByUrl(
    `/${NameSpace.Platform}/vehicle-task/getWorkStationInstrument`,
  );

  WorkStationStatePolling.instance.postMessage({
    state: 'start',
    requestParam: promises,
    url: workStationURL,
    token: window.sessionStorage.getItem('token'),
    sectionId: window.localStorage.getItem('sectionId'),
  });
};

WorkStationStatePolling.terminate = function () {
  if (!isNull(WorkStationStatePolling.instance)) {
    WorkStationStatePolling.instance.postMessage({
      state: 'end',
    });

    WorkStationStatePolling.instance.terminate();
    WorkStationStatePolling.instance = null;
  }
};

//  @@@ 点位热度轮询
CostHeatPollingManager.getInstance = function (dispatcher) {
  if (isNull(CostHeatPollingManager.instance)) {
    const worker = new Worker(new URL('./costHeatPolling.worker.js', import.meta.url));
    worker.onmessage = function ({ data }) {
      if (data.code === '0') {
        dispatcher(data.data);
      }
    };
    CostHeatPollingManager.instance = worker;
  }
  return CostHeatPollingManager.instance;
};

CostHeatPollingManager.start = function (params, dispatcher) {
  if (isNull(CostHeatPollingManager.instance)) {
    CostHeatPollingManager.getInstance(dispatcher);
  }
  const getHeatURL = getDomainNameByUrl(`/${NameSpace.Platform}/heat/getHeatMap`);
  CostHeatPollingManager.instance.postMessage({
    state: 'start',
    url: getHeatURL,
    token: window.sessionStorage.getItem('token'),
    sectionId: window.localStorage.getItem('sectionId'),
    params,
  });
};

CostHeatPollingManager.terminate = function () {
  if (!isNull(CostHeatPollingManager.instance)) {
    CostHeatPollingManager.instance.postMessage({
      state: 'end',
    });

    CostHeatPollingManager.instance.terminate();
    CostHeatPollingManager.instance = null;
  }
};

// @@@  站点速率轮询
StationRatePolling.getInstance = function (dispatcher) {
  if (isNull(StationRatePolling.instance)) {
    const worker = new Worker(new URL('./stationRatePolling.worker.js', import.meta.url));
    worker.onmessage = function ({ data }) {
      if (data.code === '0') {
        dispatcher(data.data);
      }
    };
    StationRatePolling.instance = worker;
  }
  return StationRatePolling.instance;
};

StationRatePolling.start = function (dispatcher) {
  if (isNull(StationRatePolling.instance)) {
    StationRatePolling.getInstance(dispatcher);
  }
  const rateURL = getDomainNameByUrl(`/${NameSpace.Platform}/stationProxy/getRealTimeRate`);
  StationRatePolling.instance.postMessage({
    state: 'start',
    url: rateURL,
    token: window.sessionStorage.getItem('token'),
    sectionId: window.localStorage.getItem('sectionId'),
  });
};

StationRatePolling.terminate = function () {
  if (!isNull(StationRatePolling.instance)) {
    StationRatePolling.instance.postMessage({
      state: 'end',
    });

    StationRatePolling.instance.terminate();
    StationRatePolling.instance = null;
  }
};

// @@@ 车辆固件升级进度
VehicleUpgradeProgress.getInstance = function (dispatcher) {
  if (isNull(VehicleUpgradeProgress.instance)) {
    const worker = new Worker(
      new URL('./vehicleFirmWareUpgradePolling.worker.js', import.meta.url),
    );
    worker.onmessage = function ({ data }) {
      if (data && Array.isArray(data)) {
        dispatcher(data);
      }
    };
    VehicleUpgradeProgress.instance = worker;
  }
  return VehicleUpgradeProgress.instance;
};

VehicleUpgradeProgress.start = function (dispatcher) {
  if (isNull(VehicleUpgradeProgress.instance)) {
    VehicleUpgradeProgress.getInstance(dispatcher);
  }
  const fireWareURL = getDomainNameByUrl(`/${NameSpace.Platform}/vehicle/file/getFirmwareList`);
  VehicleUpgradeProgress.instance.postMessage({
    state: 'start',
    url: fireWareURL,
    token: window.sessionStorage.getItem('token'),
    sectionId: window.localStorage.getItem('sectionId'),
  });
};

VehicleUpgradeProgress.terminate = function () {
  if (!isNull(VehicleUpgradeProgress.instance)) {
    VehicleUpgradeProgress.instance.postMessage({
      state: 'end',
    });
    VehicleUpgradeProgress.instance.terminate();
    VehicleUpgradeProgress.instance = null;
  }
};

// @@@VehicleLisPolling
VehicleLisPolling.getInstance = function (dispatcher) {
  if (isNull(VehicleLisPolling.instance)) {
    const worker = new Worker(
      new URL('./vehicleFirmWareUpgradePolling.worker.js', import.meta.url),
    );
    worker.onmessage = function ({ data }) {
      if (data && Array.isArray(data)) {
        dispatcher(data);
      }
    };
    VehicleLisPolling.instance = worker;
  }
  return VehicleLisPolling.instance;
};

VehicleLisPolling.start = function (dispatcher) {
  if (isNull(VehicleLisPolling.instance)) {
    VehicleLisPolling.getInstance(dispatcher);
  }
  const fireWareURL = getDomainNameByUrl(`/${NameSpace.Platform}/vehicle/getAllVehicles`);
  VehicleLisPolling.instance.postMessage({
    state: 'start',
    url: fireWareURL,
    token: window.sessionStorage.getItem('token'),
    sectionId: window.localStorage.getItem('sectionId'),
  });
};

VehicleLisPolling.terminate = function () {
  if (!isNull(VehicleLisPolling.instance)) {
    VehicleLisPolling.instance.postMessage({
      state: 'end',
    });
    VehicleLisPolling.instance.terminate();
    VehicleLisPolling.instance = null;
  }
};

export {
  AlertCountPolling,
  VehiclePollingTaskPathManager,
  LockCellPolling,
  CommonStationStatePolling,
  WorkStationStatePolling,
  CostHeatPollingManager,
  StationRatePolling,
  VehicleUpgradeProgress,
  VehicleLisPolling,
};
