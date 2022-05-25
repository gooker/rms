/* eslint-disable no-restricted-globals */
/**
 * https://webpack.js.org/guides/web-workers/
 * self 是worker上下文最顶端的 workerGlobalScope 对象本身
 */
let timeInterval;
self.onmessage = ({ data: { state, url, token, sectionId, params } }) => {
  if (state === 'start') {
    const headers = {
      sectionId,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    };

    const { uniqueIds } = params;
    timeInterval = setInterval(() => {
      fetch(`${url}?uniqueIds=${uniqueIds}`, { headers })
        .then((response) => response.json())
        .then((response) => self.postMessage(response))
        .catch((err) => console.log(`Worker: agvPathPolling => ${err.message}`));
    }, 5 * 1000);
  } else if (state === 'end') {
    clearInterval(timeInterval);
    timeInterval = null;
  }
};
