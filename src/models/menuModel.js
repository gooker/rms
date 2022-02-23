import { find } from 'lodash';
import { isNull } from '@/utils/util';
import Loadable from '@/components/Loadable';

export default {
  namespace: 'menu',

  state: {
    // 多标签
    activeTab: null,
    tabs: [],

    // 架构基础数据
    allMenuData: [],
    allRouteData: [],
    routeLocaleKeyMap: {},

    // 菜单展开控制
    openKeys: [],
    selectedKeys: [],
    updateOpenKeys: {}, // 手动触发Menu组件更新openKeys字段
  },

  reducers: {
    saveState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    forceUpdateOpenKeys(state) {
      return {
        ...state,
        updateOpenKeys: {},
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

    saveActiveTab(state, { payload }) {
      return {
        ...state,
        activeTab: payload,
      };
    },

    saveTabs(state, { payload }) {
      const { tabs, allRouteData } = state;
      const _tabs = [...tabs];
      const target = find(_tabs, { path: payload });

      if (_tabs.length === 0) {
        _tabs.push({
          path: '/',
          component: '/Portal/Welcome',
          $$component: Loadable(() => import('@/packages/Portal/Welcome')),
        });
      }

      // 如果不存在已经打开的Tab就新增tab数据
      if (isNull(target)) {
        // 处理下'/'的情况
        if (payload === '/') {
          return { ...state, tabs: _tabs, activeTab: payload };
        } else {
          const routeData = find(allRouteData, { path: payload });
          if (routeData) {
            _tabs.push(routeData);
            return { ...state, tabs: _tabs, activeTab: payload };
          }
        }
      } else {
        if (payload === '/') {
          return { ...state, activeTab: payload, openKeys: [], selectedKeys: [] };
        } else {
          return { ...state, activeTab: payload };
        }
      }
    },

    removeTab(state, { payload }) {
      const { tabs } = state;
      const _tabs = tabs.filter((item) => item.path !== payload);
      const lastTabKey = _tabs[_tabs.length - 1].path;
      return { ...state, tabs: _tabs, activeTab: lastTabKey };
    },

    saveAllMenuData(state, action) {
      return {
        ...state,
        allMenuData: action.payload,
      };
    },

    saveAllRouteData(state, action) {
      return {
        ...state,
        allRouteData: action.payload,
      };
    },

    saveRouteLocaleKeyMap(state, action) {
      return {
        ...state,
        routeLocaleKeyMap: action.payload,
      };
    },
  },

  effects: {},
};
