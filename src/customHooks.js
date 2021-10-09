import { useRef, useEffect } from 'react';

export function useMountInterval(callback, interval = 500) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, []);
}

// Modal尺寸自适应逻辑
function getWindowWidthDpr() {
  const { width } = window.screen;
  const a = (width - 1440) / 1440;
  if (a > 0) {
    return a + 1;
  }
  return 1;
}

function getWindowHeighthDpr() {
  const { height } = window.screen;
  const a = (height - 900) / 900;
  if (a > 0) {
    return a + 1;
  }
  return 1;
}

export const UseMonitorModalSize = () => {
  const widthDpr = getWindowWidthDpr();
  const heightDpr = getWindowHeighthDpr();

  let width = 600 * widthDpr;
  let height = 500 * heightDpr;

  width = width > 900 ? 900 : width;
  height = height > 600 ? 600 : height;

  return [width, height];
};
