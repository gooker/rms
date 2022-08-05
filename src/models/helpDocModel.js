export default {
  namespace: 'help',

  state: {
    currentApp: null,

    // 菜单展开控制
    menuCollapsed: false,
    openKeys: [],
    selectedKeys: [],
  },

  reducers: {
    updateCurrentApp(state, { payload }) {
      return {
        ...state,
        currentApp: payload,
      };
    },

    saveOpenKeys(state, { payload }) {
      return {
        ...state,
        openKeys: payload,
      };
    },

    saveSelectedKeys(state, { payload }) {
      return {
        ...state,
        selectedKeys: payload,
      };
    },

    updateMenuCollapsed(state, { payload }) {
      return {
        ...state,
        menuCollapsed: payload,
      };
    },
  },

  effects: {},
};
