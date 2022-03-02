/* eslint-disable no-restricted-globals */
let timeInterval;
self.onmessage = ({ data: { state, url, token, sectionId } }) => {
  if (state === 'start') {
    const headers = {
      sectionId,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    };
    timeInterval = setInterval(() => {
      fetch(url, { headers })
        .then((response) => response.json())
        .then((response) => self.postMessage(response));
    }, 60 * 1000);
  } else if (state === 'end') {
    clearInterval(timeInterval);
    timeInterval = null;
  }
};
