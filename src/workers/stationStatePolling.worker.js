/* eslint-disable no-restricted-globals */
/**
 * https://webpack.js.org/guides/web-workers/
 * self 是worker上下文最顶端的 workerGlobalScope 对象本身
 */
let timeInterval;
self.onmessage = ({ data }) => {
  if (data === 'start') {
    timeInterval = setInterval(() => {
      self.postMessage('vehiclePath');
    }, 1000);
  } else {
    timeInterval && clearInterval(timeInterval);
  }
};
