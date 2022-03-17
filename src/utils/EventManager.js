class EventManager {
  callbacks = {};

  /**
   * 这个id是用来标记function, 可以便捷取消订阅
   */
  subscribe(type, fn, id) {
    if (typeof fn === 'function') {
      if (!Array.isArray(this.callbacks[type])) {
        this.callbacks[type] = [];
      }
      fn.id = id;
      this.callbacks[type].push(fn);
    } else {
      console.error('subscribe第二个参数必须为function');
    }
  }

  unSubscribe(type, id) {
    if (Array.isArray(this.callbacks[type])) {
      this.callbacks[type] = this.callbacks[type].filter((func) => func.id !== id);
    }
  }

  dispatch(type, payload) {
    if (Array.isArray(this.callbacks[type])) {
      this.callbacks[type].forEach((func) => {
        if (typeof func === 'function') {
          func(payload);
        }
      });
    }
  }

  clear(type) {
    this.callbacks[type] = [];
  }

  clearAll() {
    this.callbacks = Object.fromEntries(Object.keys(this.callbacks).map((item) => [item]));
  }
}

export default new EventManager();
