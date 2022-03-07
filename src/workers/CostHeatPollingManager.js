import { getDomainNameByUrl, isNull } from '@/utils/util';
import { NameSpace } from '@/config/config';

/**
 * @@@@@@ 单例 @@@@@@
 * 便有在不同地方使用同一个 Worker
 */

// 点位热度轮询
const CostHeatPollingManager = {};
CostHeatPollingManager.getInstance = function (dispatcher) {
  if (isNull(CostHeatPollingManager.instance)) {
    const worker = new Worker(new URL('./costHeatPolling.worker.js', import.meta.url));
    worker.onmessage = function ({ data }) {
      /**
       * TODO
       * 1. 如果token过期就停止
       * 2. 处理错误
       */
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
  const getHeatURL = getDomainNameByUrl(`/${NameSpace.Coordinator}/heat/getHeatMap`);
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
  }
};

export { CostHeatPollingManager };
