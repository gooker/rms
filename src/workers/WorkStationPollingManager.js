import { getDomainNameByUrl, isNull } from '@/utils/util';
import { NameSpace } from '@/config/config';

// 获取工作站雇佣车
const WorkStationStatePolling = {};
WorkStationStatePolling.getInstance = function (dispatcher,promises) {
  if (isNull(WorkStationStatePolling.instance)) {
    const worker = new Worker(new URL('./workStationStatePolling.worker.js', import.meta.url));
    worker.onmessage = function ({ data }) {
      const newData = [];
      data.map(({ code, data }) => {
        if (code === '0') {
          newData.push(data);
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
    WorkStationStatePolling.getInstance(dispatcher,promises);
  }

  const workStationURL = getDomainNameByUrl(
    `/${NameSpace.LatentLifting}/agv-task/getWorkStationInstrument`,
  );

  WorkStationStatePolling.instance.postMessage({
    state: 'start',
    promises,
    url: workStationURL,
    token: window.sessionStorage.getItem('Authorization'),
    sectionId: window.localStorage.getItem('sectionId'),
  });
};

WorkStationStatePolling.terminate = function () {
  if (!isNull(WorkStationStatePolling.instance)) {
    WorkStationStatePolling.instance.postMessage({
      state: 'end',
    });
  }
};

export { WorkStationStatePolling };
