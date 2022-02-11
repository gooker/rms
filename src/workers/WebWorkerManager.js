import { getDomainNameByUrl, isNull } from '@/utils/util';
import { NameSpace } from '@/config/config';
import AlertCountPollingWorker from './alertCountPolling.worker';

/**
 * @@@@@@ 单例 @@@@@@
 * 便有在不同地方使用同一个 Worker
 */

// 告警中心告警信息数量轮询
const AlertCountPolling = {};
AlertCountPolling.getInstance = function (dispatcher) {
  if (isNull(AlertCountPolling.instance)) {
    const worker = new Worker(new URL('./alertCountPolling.worker.js', import.meta.url));
    worker.onmessage = function ({ data }) {
      dispatcher(data);
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
    `/${NameSpace.Coordinator}/alertCenter/getAlertCenterCount`,
  );
  AlertCountPolling.instance.postMessage({
    state: 'start',
    url: alertCountURL,
    token: window.localStorage.getItem('Authorization'),
    sectionId: window.localStorage.getItem('sectionId'),
  });
};

AlertCountPolling.terminate = function () {
  if (!isNull(AlertCountPolling.instance)) {
    AlertCountPolling.instance.postMessage({
      state: 'end',
    });
  }
};

export { AlertCountPolling };
