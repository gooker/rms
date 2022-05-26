/* eslint-disable no-restricted-globals */

/**
 * https://webpack.js.org/guides/web-workers/
 * self 是worker上下文最顶端的 workerGlobalScope 对象本身
 */
let intervalInstance;
self.onmessage = ({ data: { state, url, token, sectionId, params } }) => {
  if (state === 'start') {
    const headers = {
      sectionId,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    };

    const { logicId, ids } = params;
    intervalInstance = setInterval(() => {
      fetch(`${url}/${logicId}?uniqueIds=${ids}`, {
        headers,
        method: 'GET',
      })
        .then((response) => response.json())
        .then((response) => self.postMessage(response))
        .catch((err) => console.log(`Worker: lockCellPolling => ${err.message}`));
    }, 1000);
  } else if (state === 'end') {
    clearInterval(intervalInstance);
    intervalInstance = null;
  } else {
    //
  }
};
