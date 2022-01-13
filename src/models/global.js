import intl from 'react-intl-universal';
import requestAPI from '@/utils/requestAPI';
import { fetchNotice, fetchUpdateEnvironment, fetchAllEnvironment } from '@/services/global';
import { fetchUpdateUserCurrentLanguage } from '@/services/user';
import { dealResponse, extractNameSpaceInfoFromEnvs } from '@/utils/utils';
import { filterAppByAuthorityKeys, convertAllMenu } from '@/utils/init';
import allModuleRouter from '@/config/router';
import moment from 'moment';
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';

export default {
  namespace: 'global',

  state: {
    // 路由history实例
    history: null,

    // Socket实例
    socketClient: null,

    logo: null,
    copyRight: null,
    notification: 0,

    // 全屏
    isFullscreen: false,
    isInnerFullscreen: false,

    // 架构基础数据
    tabs: [],
    grantedAPP: [],
    subModules: [],
    environments: [],
    menuSelectKeys: [],

    currentApp: null,
    currentEnv: null,

    // 是否是编辑国际化模式
    editI18N: false,

    // 国际化
    globalLocale: 'zh-CN',
    antdLocale: zhCN,

    // 全局数据
    allTaskTypes: {},

    // 记录是否已经加载了纹理
    hasLoadedTextures: false,
  },

  effects: {
    // 页面初始化加载信息，加载网络信息，加载APP应用信息（主应用，子应用）,个人信息
    *initAppAuthority(_, { call, put, select }) {
      const { currentUser } = yield select((state) => state.user);
      const adminType = currentUser?.adminType ?? 'USER'; // 用来对SSO菜单进行筛选

      // 1.从allModuleRouter获取所有module以及routes
      const allAppModulesRoutesMap = { ...allModuleRouter };
      const subModules = Object.keys(allModuleRouter);

      // 2.获取所有环境配置信息
      let allEnvironment = yield call(fetchAllEnvironment);
      if (dealResponse(allEnvironment)) {
        allEnvironment = [];
      } else {
        yield put({ type: 'saveAllEnvironments', payload: allEnvironment });
      }

      // 3.获取NameSpace数据 & 并整合运维配置
      let urlDir = { ...requestAPI() }; // 所有的url链接地址信息
      if (allEnvironment.length > 0) {
        const activeNameSpace = allEnvironment.filter(({ flag }) => flag === '1');
        if (activeNameSpace.length > 0) {
          // 若自定义环境出现两个已激活项目, 将默认启用第一项
          urlDir = {
            ...urlDir,
            ...extractNameSpaceInfoFromEnvs(activeNameSpace[0]),
          };
        }
      }

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

      // 6 根据grantedApp对allAppModulesRoutesMap进行第一次权限筛选
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

      // 7. 保存信息
      yield put({ type: 'saveLogo', payload: null }); // 保存Logo数据
      yield put({ type: 'saveCopyRight', payload: null }); // 保存CopyRight数据
      yield put({ type: 'saveGrantedAPx', payload: grantedAPP }); // 所有授权的APP
      yield put({ type: 'saveAllAppModules', payload: allAppModulesMap }); // 所有子应用信息
      yield put({ type: 'saveAllMenuData', payload: allModuleFormattedMenuData }); // 所有子应用的菜单数据
      yield put({ type: 'saveRouteLocaleKeyMap', payload: routeLocaleKeyMap }); // 用于生成 Tab Label
      window.localStorage.setItem('nameSpacesInfo', JSON.stringify(urlDir));
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
      //
    },

    // 更新语种
    *updateGlobalLocale({ payload }, { call, put }) {
      const localeValue = require(`@/locales/${payload}`).default;
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
    saveHasLoadedTextures(state, { payload }) {
      return {
        ...state,
        hasLoadedTextures: payload,
      };
    },
    saveSocketClient(state, { payload }) {
      return {
        ...state,
        socketClient: payload,
      };
    },
    saveHistory(state, { payload }) {
      return {
        ...state,
        history: payload,
      };
    },
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

    changeFullScreen(state, { payload }) {
      return {
        ...state,
        isFullscreen: payload,
      };
    },

    changeInnerFullScreen(state, { payload }) {
      return {
        ...state,
        isInnerFullscreen: payload,
      };
    },

    saveAllAppModules(state, { payload }) {
      return {
        ...state,
        subModules: payload,
      };
    },

    saveCurrentApp(state, { payload }) {
      return {
        ...state,
        currentApp: payload,
      };
    },

    saveMenuSelectKeys(state, { payload }) {
      return {
        ...state,
        menuSelectKeys: payload,
      };
    },

    saveTabs(state, { payload }) {
      return {
        ...state,
        tabs: payload,
      };
    },

    saveGrantedAPx(state, { payload }) {
      return {
        ...state,
        grantedAPP: payload,
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

    updateAllTaskTypes(state, { payload }) {
      return {
        ...state,
        allTaskTypes: payload,
      };
    },
  },
};
