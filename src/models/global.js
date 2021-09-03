import { message } from 'antd';
import intl from 'react-intl-universal';
import history from '@/history';
import getUrlDir from '@/utils/urlDir';
import {
  fetchFindAppByWebAddress,
  fetchAllAppModules,
  fetchNotice,
  fetchUpdateEnvironment,
  fetchAllEnvironment,
} from '@/services/global';
import { dealResponse, extractNameSpaceInfoFromEnvs } from '@/utils/utils';
import { filterAppByAuthorityKeys, convertAllMenu } from '@/utils/init';
import find from 'lodash/find';

export default {
  namespace: 'global',

  state: {
    logo: null,
    copyRight: null,

    notification: 0,

    collapsed: false,
    isFullscreen: false,
    iframeLoading: false,

    tabs: [],
    subModules: [],
    environments: [],
    nameSpacesInfo: {},

    grantedAPP: [],

    currentApp: null,
    currentEnv: null,
    currentRoute: null,

  },

  effects: {
    // 页面初始化加载信息，加载网络信息，加载APP应用信息（主应用，子应用）,个人信息
    *fetchInitialAppStatus(_, { call, put, select }) {
      const { currentUser } = yield select((state) => state.user);
      const adminType = currentUser?.adminType ?? 'USER'; // 用来对SSO菜单进行筛选
      let nameSpaceInfo = {}; // 所有的url链接地址信息
      const subModules = []; // 所有的子app信息
      const allModuleMenuData = {}; // 所有的菜单信息

      // 获取微前端配置列表
      // TODO:
      const ssoWebAddress = 'localhost:7000'; // window.location.host;
      const currentApp = yield call(fetchFindAppByWebAddress, ssoWebAddress);

      // 获取所有模块列表
      const allAppModules = yield call(fetchAllAppModules);
      if (dealResponse(allAppModules)) {
        message.error(intl.formatMessage({ id: 'app.subModule.fetch.failed' }));
        return false;
      }

      // 这里需要额外处理系统初始化情况，需要跳转到配置页面
      // 1. 用户名为admin; 2. 未查询到webAddress相关配置 或者 sso模块不存在
      const ssoModule = find(allAppModules, { appCode: 'sso' });
      if (currentUser.username === 'admin' && (currentApp.code === '2' || !ssoModule)) {
        history.push(`/init?app=${currentApp.code === '2'}&module=${!ssoModule}`);
        return false;
      }

      // 获取所有环境配置信息
      let allEnvironment = yield call(fetchAllEnvironment);
      if (dealResponse(allEnvironment)) {
        allEnvironment = [];
      } else {
        yield put({ type: 'saveAllEnvironments', payload: allEnvironment });
      }

      // 1. 数据转换 --> {[appCode]: appEntity}
      const allAppModulesMap = {};
      allAppModules.forEach((appModule) => {
        allAppModulesMap[appModule.appCode] = appModule;
      });

      // 2 获取NameSpace数据 & 并整合运维配置
      const { nameSpaceMap: defaultNameSpaceMap, logo, copyRight } = currentApp;
      let currentDefaultNameSpace = null;
      if (allEnvironment.length > 0) {
        const activeNameSpace = allEnvironment.filter(({ flag }) => flag === '1');
        currentDefaultNameSpace=activeNameSpace.length>=1?activeNameSpace[0].appCode:null;
        if (activeNameSpace.length === 0) {
          nameSpaceInfo = { ...defaultNameSpaceMap };
        } else if (activeNameSpace.length === 1) {
          nameSpaceInfo = {
            ...defaultNameSpaceMap,
            ...extractNameSpaceInfoFromEnvs(activeNameSpace[0]),
          };
        } else {
          console.warn('当前自定义环境出现两个已激活项目, 将默认启用第一项');
          nameSpaceInfo = {
            ...defaultNameSpaceMap,
            ...extractNameSpaceInfoFromEnvs(activeNameSpace[0]),
          };
        }
      } else {
        nameSpaceInfo = { ...defaultNameSpaceMap };
      }
      const urlDir = { ...getUrlDir(), ...nameSpaceInfo };

      // 3. 转换当前App的所有模块信息并收集部分信息
      const { subModelList: subModuleList = [] } = currentApp;
      for (let i = 0; i < subModuleList.length; i++) {
        const { moduleCode: itemModuleCode, webAddress } = subModuleList[i];
        const appModule = allAppModulesMap[itemModuleCode];
        if (appModule === undefined) {
          continue;
        }
        subModules.push({
          name: appModule.baseContext,
          base: appModule.baseContext,
          entry: `${webAddress}/#/${itemModuleCode}`,
        });
        allModuleMenuData[itemModuleCode] = allAppModulesMap[itemModuleCode].menu;
      }

      // 4. 将所有模块的路由数据转换成框架可用的菜单数据格式
      const permissionMap = {};
      const authorityKeys = currentUser?.authorityKeys ?? [];
      for (let index = 0; index < authorityKeys.length; index++) {
        permissionMap[authorityKeys[index]] = true;
      }
      const { allModuleFormattedMenuData, routeLocaleKeyMap } = convertAllMenu(
        adminType,
        allAppModulesMap,
        allModuleMenuData,
        permissionMap,
      );

      // 5. 筛选授权的APP和API
      const grantedAPP = filterAppByAuthorityKeys(subModules, authorityKeys);

      // 6. 保存信息
      yield put({ type: 'saveLogo', payload: logo }); // 保存Logo数据
      yield put({ type: 'saveCopyRight', payload: copyRight }); // 保存CopyRight数据
      yield put({ type: 'saveNameSpacesInfo', payload: urlDir }); // 所有API接口信息
      yield put({ type: 'saveGrantedAPx', payload: { grantedAPP } }); // 所有授权的APP
      yield put({ type: 'saveAllAppModules', payload: subModules }); // 所有子应用信息
      yield put({ type: 'saveCurrentApp', payload: currentDefaultNameSpace }); // 默认显示的app
      yield put({ type: 'menu/saveAllMenuData', payload: allModuleFormattedMenuData }); // 所有子应用的菜单数据
      yield put({ type: 'menu/saveRouteLocaleKeyMap', payload: routeLocaleKeyMap }); // 用于生成 Tab Label

      return true;
    },

    *fetchUpdateEnvironment({ payload }, { call }) {
      let response = null;
      if (payload.id === 0) {
        response = yield call(fetchUpdateEnvironment, { appCode: 'MixRobot', id: '' });
      } else {
        response = yield call(fetchUpdateEnvironment, { appCode: 'MixRobot', id: payload.id });
      }
      return !dealResponse(
        response,
        true,
        intl.formatMessage({ id: 'app.header.option.switchEnvSuccess' }),
      );
    },

    *fetchNotice({ payload }, { call, put }) {
      const response = yield call(fetchNotice, payload);
      if (dealResponse(response)) {
        return;
      }
      yield put({ type: 'fetchNoticeEffect', payload: response });
      return response;
    },

    *goToQuestionCenter(_, { put, select }) {
      const { subModules, tabs } = yield select((state) => state.global);
      const { routeLocalekeyMap } = yield select((state) => state.menu);
      const mixrobot = find(subModules, { name: 'mixrobot' });
      if (mixrobot && mixrobot.entry) {
        history.replace('/mixrobot/questionCenter');
        const currentRoute = `${mixrobot.entry}/questionCenter`;
        yield put({ type: 'saveCurrentIframeRoute', payload: currentRoute });
        const tab = find(tabs, { route: currentRoute });
        if (!tab) {
          const newTabs = [...tabs];
          const pathname = currentRoute.split('/#')[1].split('?')[0];
          newTabs.push({ localeKey: routeLocalekeyMap[pathname], route: currentRoute });
          yield put({ type: 'saveTabs', payload: newTabs });
        }
      }
    },
  },

  reducers: {
    updateEnvironment(state, { payload }) {
      return {
        ...state,
        currentEnv: payload,
      };
    },

    saveAllEnvironments(state, { payload }) {
      return {
        ...state,
        environments: [{ envName: 'default', id: 0 }, ...payload],
      };
    },

    clearEnvironments(state) {
      return {
        ...state,
        environments: [],
      };
    },

    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },

    changeFullScreen(state, { payload }) {
      return {
        ...state,
        isFullscreen: payload,
      };
    },

    saveAllAppModules(state, { payload }) {
      return {
        ...state,
        subModules: payload,
      };
    },

    saveNameSpacesInfo(state, { payload }) {
      return {
        ...state,
        nameSpacesInfo: payload,
      };
    },

    saveCurrentApp(state, { payload }) { // 当前默认展示的appcode
      return {
        ...state,
        currentApp: payload,
      };
    },

    saveIframeLoading(state, { payload }) {
      return {
        ...state,
        iframeLoading: payload,
      };
    },

    saveTabs(state, { payload }) {
      return {
        ...state,
        tabs: payload,
      };
    },

    saveCurrentIframeRoute(state, { payload }) {
      return {
        ...state,
        currentRoute: payload,
      };
    },

    saveGrantedAPx(state, { payload }) {
      return {
        ...state,
        grantedAPP: payload.grantedAPP,
      };
    },

    saveLogo(state, { payload }) {
      return {
        ...state,
        logo: payload,
      };
    },

    saveCopyRight(state, { payload }) {
      return {
        ...state,
        copyRight: payload,
      };
    },

    fetchNoticeEffect(state, { payload }) {
      return {
        ...state,
        notification: payload,
      };
    },
  },
};
