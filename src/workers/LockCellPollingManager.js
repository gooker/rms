import { getDomainNameByUrl, isNull } from '@/utils/util';
import { NameSpace } from '@/config/config';

/**
 * @@@@@@ 单例 @@@@@@
 * 便有在不同地方使用同一个 Worker
 */

// 点位锁格轮询
const LockCellPolling = {};
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

export { LockCellPolling };
