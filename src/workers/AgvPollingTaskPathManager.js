import { getDomainNameByUrl, isNull } from '@/utils/util';
import { NameSpace } from '@/config/config';

// 小车任务路径轮询
const AgvPollingTaskPathManager = {};
AgvPollingTaskPathManager.getInstance = function (dispatcher) {
  if (isNull(AgvPollingTaskPathManager.instance)) {
    const worker = new Worker(new URL('./agvPathPolling.worker.js', import.meta.url));
    worker.onmessage = function ({ data }) {
      if (data.code === '0') {
        dispatcher(data.data);
      }
    };
    AgvPollingTaskPathManager.instance = worker;
  }
  return AgvPollingTaskPathManager.instance;
};

AgvPollingTaskPathManager.start = function (agvIds = [], dispatcher) {
  if (isNull(AgvPollingTaskPathManager.instance)) {
    AgvPollingTaskPathManager.getInstance(dispatcher);
  }
  const agvPathURL = getDomainNameByUrl(
    `/${NameSpace.Platform}/traffic/getAllPath/${agvIds.join()}`,
  );
  AgvPollingTaskPathManager.instance.postMessage({
    state: 'start',
    url: agvPathURL,
    token: window.sessionStorage.getItem('token'),
    sectionId: window.localStorage.getItem('sectionId'),
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
