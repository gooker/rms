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

    const { type, startTime, endTime } = params;
    intervalInstance = setInterval(() => {
      fetch(`${url}?type=${type}&startTime=${startTime}&endTime=${endTime}`, {
        headers,
        method: 'GET',
      })
        .then((response) => response.json())
        .then((response) => self.postMessage(response));
    }, 10 * 1000);
  } else if (state === 'end') {
    clearInterval(intervalInstance);
    intervalInstance = null;
  } else {
    //
  }
};
