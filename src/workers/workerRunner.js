import { isNull } from '@/utils/utils';

// 小车任务路径轮询线程
const AgvPathWorker = function () {};
AgvPathWorker.getInstance = function (dispatcher) {
  if (isNull(AgvPathWorker.instance)) {
    AgvPathWorker.instance = new Worker(new URL('./agvPathPolling.js', import.meta.url));
    AgvPathWorker.instance.onmessage = ({ data }) => {
      dispatcher(data);
    };
  }
  return AgvPathWorker.instance;
};

// 工作站状态轮询线程
const WorkStationWorker = function () {};
WorkStationWorker.getInstance = function (dispatcher) {
  if (isNull(WorkStationWorker.instance)) {
    WorkStationWorker.instance = new Worker(
      new URL('./workStationStatePolling.js', import.meta.url),
    );
    WorkStationWorker.instance.onmessage = ({ data }) => {
      dispatcher(data);
    };
  }
  return WorkStationWorker.instance;
};

// 通用站点状态轮询线程
const StationWorker = function () {};
StationWorker.getInstance = function (dispatcher) {
  if (isNull(StationWorker.instance)) {
    StationWorker.instance = new Worker(new URL('./workStationStatePolling.js', import.meta.url));
    StationWorker.instance.onmessage = ({ data }) => {
      dispatcher(data);
    };
  }
  return StationWorker.instance;
};

export { AgvPathWorker, WorkStationWorker, StationWorker };
