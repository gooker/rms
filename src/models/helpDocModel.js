export default {
  namespace: 'help',

  state: {
    currentApp: null,

    // 菜单展开控制
    openKeys: [],
    selectedKeys: [],
    updateOpenKeys: {}, // 手动触发Menu组件更新openKeys字段
  },

  reducers: {
    updateCurrentApp(state, { payload }) {
      return {
        ...state,
        currentApp: payload,
      };
    },
  },

  effects: {},
};
