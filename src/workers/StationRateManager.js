import { getDomainNameByUrl, isNull } from '@/utils/util';
import { NameSpace } from '@/config/config';

// 站点速率轮询
const StationRatePolling = {};
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
  const rateURL = getDomainNameByUrl(`/${NameSpace.Coordinator}/stationProxy/getRealTimeRate`);
  StationRatePolling.instance.postMessage({
    state: 'start',
    url: rateURL,
    token: window.sessionStorage.getItem('Authorization'),
    sectionId: window.localStorage.getItem('sectionId'),
  });
};

StationRatePolling.terminate = function () {
  if (!isNull(StationRatePolling.instance)) {
    StationRatePolling.instance.postMessage({
      state: 'end',
    });
  }
};

export { StationRatePolling };
