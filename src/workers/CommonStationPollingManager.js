import { getDomainNameByUrl, isNull } from '@/utils/util';
import { NameSpace } from '@/config/config';

// 获取工作站雇佣车
const CommonStationStatePolling = {};
CommonStationStatePolling.getInstance = function (dispatcher,promises) {
  if (isNull(CommonStationStatePolling.instance)) {
    const worker = new Worker(new URL('./workStationPolling.worker.js', import.meta.url));
    worker.onmessage = function ({ data }) {
      const newData = [];
      data.map(({ code, data }) => {
        if (code === '0') {
          newData.push(data);
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
    CommonStationStatePolling.getInstance(dispatcher,promises);
  }

  const workStationURL = getDomainNameByUrl(
    `/${NameSpace.Coordinator}/stationProxy/getStationReport`,
  );

  CommonStationStatePolling.instance.postMessage({
    state: 'start',
    promises,
    url: workStationURL,
    token: window.sessionStorage.getItem('Authorization'),
    sectionId: window.localStorage.getItem('sectionId'),
  });
};

CommonStationStatePolling.terminate = function () {
  if (!isNull(CommonStationStatePolling.instance)) {
    CommonStationStatePolling.instance.postMessage({
      state: 'end',
    });
  }
};

export { CommonStationStatePolling };
