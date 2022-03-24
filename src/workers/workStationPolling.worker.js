/* eslint-disable no-restricted-globals */
/**
 * https://webpack.js.org/guides/web-workers/
 * self 是worker上下文最顶端的 workerGlobalScope 对象本身
 */
let timeInterval;
self.onmessage = ({ data: { state, requestParam = [], url, token, sectionId } }) => {
  if (state === 'start') {
    const headers = {
      sectionId,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    };

    timeInterval = setInterval(() => {
      const newPromises = [];
      requestParam.forEach(({ stopCellId, stopDirection }) => {
        newPromises.push(
          fetch(`${url}?stopCellId=${stopCellId}&stopDirection=${stopDirection}`, {
            headers,
            method: 'GET',
          })
            .then((res) => res.json())
            .catch((err) =>
              console.log(
                `Worker: workStationPolling(${stopCellId}-${stopDirection}) => ${err.message}`,
              ),
            ),
        );
      });
      Promise.all(newPromises).then((response) => {
        return self.postMessage({ response, requestParam });
      });
    }, 10 * 1000);
  } else {
    timeInterval && clearInterval(timeInterval);
  }
};
