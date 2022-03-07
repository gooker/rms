import { getDomainNameByUrl, isNull } from '@/utils/util';
import { NameSpace } from '@/config/config';

// 获取工作站雇佣车
const WorkStationStatePolling = {};
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
    `/${NameSpace.LatentLifting}/agv-task/getWorkStationInstrument`,
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
  }
};

export { WorkStationStatePolling };
