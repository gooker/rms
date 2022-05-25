import { getDomainNameByUrl, isNull } from '@/utils/util';
import { NameSpace } from '@/config/config';

// 小车任务路径轮询
const AgvPollingTaskPathManager = {};
AgvPollingTaskPathManager.getInstance = function (dispatcher) {
  if (isNull(AgvPollingTaskPathManager.instance)) {
    const worker = new Worker(new URL('./agvPathPolling.worker.js', import.meta.url));
    worker.onmessage = function ({ data }) {
      if (data && Array.isArray(data)) {
        dispatcher(data);
      }
    };
    AgvPollingTaskPathManager.instance = worker;
  }
  return AgvPollingTaskPathManager.instance;
};

AgvPollingTaskPathManager.start = function (uniqueIds = [], dispatcher) {
  if (isNull(AgvPollingTaskPathManager.instance)) {
    AgvPollingTaskPathManager.getInstance(dispatcher);
  }
  const params = {
    uniqueIds,
  };
  const agvPathURL = getDomainNameByUrl(`/${NameSpace.Platform}/traffic/getPathByUniqueIds`);
  AgvPollingTaskPathManager.instance.postMessage({
    state: 'start',
    url: agvPathURL,
    token: window.sessionStorage.getItem('token'),
    sectionId: window.localStorage.getItem('sectionId'),
    params,
  });
};

AgvPollingTaskPathManager.terminate = function () {
  if (!isNull(AgvPollingTaskPathManager.instance)) {
    AgvPollingTaskPathManager.instance.postMessage({
      state: 'end',
    });
  }
};

export { AgvPollingTaskPathManager };
