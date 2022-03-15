class EventManager {
  callbacks = {};

  subscribe(type, fn) {
    if (!Array.isArray(this.callbacks[type])) {
      this.callbacks[type] = [];
    }
    this.callbacks[type].push(fn);
  }

  unSubscribe(type, fn) {
    if (Array.isArray(this.callbacks[type])) {
      this.callbacks[type] = this.callbacks[type].filter((func) => func !== fn);
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
