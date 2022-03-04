export default {
  namespace: 'monitorView',
  state: {
    // 自动轮询成本热度
    showCostPolling: false,
  },
  reducers: {
    savePollingCost(state, action) {
      return {
        ...state,
        showCostPolling: action.payload,
      };
    },
  },
  effects: {},
};
