import intl from 'react-intl-universal';
import history from '@/history';
import requestAPI from '@/utils/requestAPI';
import { fetchNotice, fetchUpdateEnvironment, fetchAllEnvironment } from '@/services/global';
import { fetchUpdateUserCurrentLanguage } from '@/services/user';
import { dealResponse, extractNameSpaceInfoFromEnvs } from '@/utils/utils';
import { filterAppByAuthorityKeys, convertAllMenu } from '@/utils/init';
import find from 'lodash/find';
import allMouduleRouter from '@/config/router';
import moment from 'moment';
import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';
import koKR from 'antd/lib/locale/ko_KR';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';

export default {
  namespace: 'global',

  state: {
    logo: null, // TODO: 暂时为null 后续可能从别的接口获取
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

    // 是否是编辑国际化模式
    editI18N: false,

    globalLocale: 'zh-CN',
    antdLocale: zhCN,
  },

  effects: {
    // 页面初始化加载信息，加载网络信息，加载APP应用信息（主应用，子应用）,个人信息
    *fetchInitialAppStatus(_, { call, put, select }) {
      const { currentUser } = yield select((state) => state.user);
      const adminType = currentUser?.adminType ?? 'USER'; // 用来对SSO菜单进行筛选

      // 1.从allMouduleRouter获取所有module以及routes
      const allAppModulesRoutesMap = { ...allMouduleRouter };
      const subModules = Object.keys(allMouduleRouter);

      // 2.获取所有环境配置信息
      let allEnvironment = yield call(fetchAllEnvironment);
      if (dealResponse(allEnvironment)) {
        allEnvironment = [];
      } else {
        yield put({ type: 'saveAllEnvironments', payload: allEnvironment });
      }

      // 3.获取NameSpace数据 & 并整合运维配置
      // nameSpaceMap从getAllEnvironment中flag为1的 additionalInfos
      let nameSpaceInfo = {}; // 所有的url链接地址信息
      if (allEnvironment.length > 0) {
        const activeNameSpace = allEnvironment.filter(({ flag }) => flag === '1');
        if (activeNameSpace.length > 0) {
          // 若自定义环境出现两个已激活项目, 将默认启用第一项
          nameSpaceInfo = {
            ...extractNameSpaceInfoFromEnvs(activeNameSpace[0]),
          };
        }
      }
      const urlDir = { ...requestAPI(), ...nameSpaceInfo };

      // 4. 将所有模块的路由数据转换成框架可用的菜单数据格式
      const permissionMap = {};
      const authorityKeys = currentUser?.authorityKeys ?? [];
      for (let index = 0; index < authorityKeys.length; index++) {
        permissionMap[authorityKeys[index]] = true;
      }

      // 5. 筛选授权的APP
      const grantedAPP = filterAppByAuthorityKeys(subModules, authorityKeys);
      const allAppModulesMap = {};
      grantedAPP.forEach((module) => {
        allAppModulesMap[module] = module;
      });

      // 6 根据grantedApp对allAppModulesRoutesMap筛选
      const allModuleMenuData = {};
      Object.keys(allAppModulesRoutesMap).filter((code) => {
        if (grantedAPP.includes(code)) {
          allModuleMenuData[code] = allAppModulesRoutesMap[code];
        }
      });
      const { allModuleFormattedMenuData, routeLocaleKeyMap } = convertAllMenu(
        adminType,
        allAppModulesMap,
        allModuleMenuData,
        permissionMap,
      );

      const defaultApp = currentUser.username === 'admin' ? 'sso' : 'mixrobot';

      // 7. 保存信息
      yield put({ type: 'saveLogo', payload: null }); // 保存Logo数据
      yield put({ type: 'saveCopyRight', payload: null }); // 保存CopyRight数据
      yield put({ type: 'saveNameSpacesInfo', payload: urlDir }); // 所有API接口信息
      yield put({ type: 'saveGrantedAPx', payload: { grantedAPP } }); // 所有授权的APP
      yield put({ type: 'saveAllAppModules', payload: allAppModulesMap }); // 所有子应用信息
      yield put({ type: 'saveCurrentApp', payload: defaultApp }); // 默认显示的app
      yield put({ type: 'saveAllMenuData', payload: allModuleFormattedMenuData }); // 所有子应用的菜单数据
      yield put({ type: 'saveRouteLocaleKeyMap', payload: routeLocaleKeyMap }); // 用于生成 Tab Label

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
      if (mixrobot) {
        history.replace('/mixrobot/questionCenter');
        const currentRoute = `/questionCenter`;
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

    // 更新语种
    *updateGlobalLocale({ payload }, { call, put }) {
      let localeValue;
      switch (payload) {
        case 'zh-CN':
          localeValue = zhCN;
          break;
        case 'en-US':
          localeValue = enUS;
          break;
        case 'ko-KR':
          localeValue = koKR;
          break;
        default:
          break;
      }

      const response = yield call(fetchUpdateUserCurrentLanguage, payload);
      if (
        !dealResponse(
          response,
          true,
          intl.formatMessage({ id: 'app.header.option.switchLanguageSuccess' }),
        )
      ) {
        moment.locale(payload);
        yield put({ type: 'updateGlobalLang', payload });
        yield put({ type: 'updateAntedLocale', payload: localeValue });
        window.localStorage.setItem('currentLocale', payload);
        setTimeout(() => {
          window.location.reload();
        }, 500);
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

    saveCurrentApp(state, { payload }) {
      // 当前默认展示的appcode
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
    saveAllMenuData(state, action) {
      return {
        ...state,
        allMenuData: action.payload,
      };
    },

    saveRouteLocaleKeyMap(state, action) {
      return {
        ...state,
        routeLocalekeyMap: action.payload,
      };
    },

    switchEditI18N(state, { payload }) {
      return {
        ...state,
        editI18N: payload,
      };
    },

    updateAntedLocale(state, { payload }) {
      return {
        ...state,
        antdLocale: payload,
      };
    },

    updateGlobalLang(state, { payload }) {
      return {
        ...state,
        globalLocale: payload,
      };
    },
  },
};
