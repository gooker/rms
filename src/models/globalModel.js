import moment from 'moment';
import { fetchUpdateUserCurrentLanguage } from '@/services/SSOService';
import { convertMenuData2RouteData, dealResponse, formatMessage } from '@/utils/util';
import { convertAllMenu, sortAppList } from '@/utils/init';
import { AppCode } from '@/config/config';
import allModuleRouter from '@/config/router';
import { fetchAlertCount } from '@/services/commonService';
import { deleteSysLang } from '@/services/translationService';
import { getSystemLanguage } from '@/packages/Configuration/LanguageManage/translateUtils';
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';

export default {
  namespace: 'global',

  state: {
    // 部分实例对象
    socketClient: null,

    // 标识符
    globalFetching: false, // 获取全局数据
    menuCollapsed: false,
    isFullscreen: false,
    isInnerFullscreen: false,
    textureLoaded: false,
    editI18N: false,

    // 基础信息
    grantedAPP: [],
    currentApp: null,

    // 国际化
    editI18NMode: false, // 标记是否是国际化编辑模式
    editI18NKey: null, // 正在编辑的国际化key
    systemLanguage: [], // 系统支持的语种
    globalLocale: 'zh-CN',
    antdLocale: zhCN,

    // 全局数据
    logo: null,
    copyRight: null,
    alertCount: 0,
    backendVersion: null,
    adapterVersion: null,
    sysAuthInfo: null,

    allTaskTypes: {}, // 任务类型
    allAdaptors: {}, // 所有的适配器
    programing: [], // 所有地图编程元数据
  },

  reducers: {
    saveAllAdaptors(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateStateInBatch(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveBackendVersion(state, { payload }) {
      return {
        ...state,
        backendVersion: payload?.versionMap || {},
        adapterVersion: payload?.adapterServerMap || {},
      };
    },
    updateEditI18NMode(state, { payload }) {
      if (payload) {
        return {
          ...state,
          editI18NMode: true,
        };
      } else {
        return {
          ...state,
          editI18NMode: false,
          editI18NKey: null,
        };
      }
    },
    updateEditI18NKey(state, { payload }) {
      return {
        ...state,
        editI18NKey: payload,
      };
    },

    saveSocketClient(state, { payload }) {
      return {
        ...state,
        socketClient: payload,
      };
    },
    saveSystemLanguage(state, { payload }) {
      return {
        ...state,
        systemLanguage: payload,
      };
    },
    updateMenuCollapsed(state, { payload }) {
      return {
        ...state,
        menuCollapsed: payload,
      };
    },
    updateGlobalFetching(state, { payload }) {
      return {
        ...state,
        globalFetching: payload,
      };
    },
    updateTextureLoaded(state, { payload }) {
      return {
        ...state,
        textureLoaded: payload,
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

    saveCurrentApp(state, { payload }) {
      return {
        ...state,
        currentApp: payload,
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

    updateAlertCount(state, { payload }) {
      return {
        ...state,
        alertCount: payload,
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

    saveSysAuthInfo(state, { payload }) {
      return {
        ...state,
        sysAuthInfo: payload,
      };
    },
  },

  effects: {
    // 页面初始化加载信息，加载网络信息，加载APP应用信息（主应用，子应用）,个人信息
    *initPlatformState(_, { call, put, select }) {
      const { currentUser } = yield select((state) => state.user);

      // 权限数据重新组装
      const permissionMap = {};
      const authorityKeys = currentUser?.authorityKeys ?? [];
      for (let index = 0; index < authorityKeys.length; index++) {
        permissionMap[authorityKeys[index]] = true;
      }

      // 筛选授权的APP
      let grantedAPP = [AppCode.SSO];
      if (currentUser.username !== 'admin') {
        // 约定: authorityKeys 中以 @@_ 开头的key就代表某个模块
        const startsBase = '@@_';
        const additionalApp = authorityKeys
          .filter((item) => item.startsWith(startsBase))
          .map((item) => item.replace(startsBase, ''));
        grantedAPP.push(...additionalApp);
      }

      // 根据grantedApp对allAppModulesRoutesMap进行第一次权限筛选
      const allModuleMenuData = {};
      Object.keys(allModuleRouter).filter((code) => {
        if (grantedAPP.includes(code)) {
          allModuleMenuData[code] = allModuleRouter[code];
        }
      });
      const { allModuleFormattedMenuData, routeLocaleKeyMap } = convertAllMenu(
        currentUser?.adminType ?? 'USER',
        allModuleMenuData,
        permissionMap,
      );
      const routeData = convertMenuData2RouteData(allModuleFormattedMenuData);

      // 保存信息
      // yield put({ type: 'saveLogo', payload: null }); // 保存Logo数据
      // yield put({ type: 'saveCopyRight', payload: null }); // 保存CopyRight数据
      yield put({ type: 'saveGrantedAPx', payload: sortAppList(grantedAPP) }); // 所有授权的APP

      // 保存菜单相关
      yield put({ type: 'menu/saveAllMenuData', payload: allModuleFormattedMenuData }); // 所有子应用的菜单数据
      yield put({ type: 'menu/saveAllRouteData', payload: routeData }); // 所有子应用的菜单路由数据
      yield put({ type: 'menu/saveRouteLocaleKeyMap', payload: routeLocaleKeyMap }); // 用于生成 Tab Label

      const { pathname } = window.location;
      yield put({ type: 'menu/saveTabs', payload: pathname });

      return true;
    },

    *fetchAlertCount(_, { call, put }) {
      const response = yield call(fetchAlertCount);
      if (dealResponse(response)) {
        return;
      }
      yield put({ type: 'updateAlertCount', payload: response });
      return response;
    },

    *updateGlobalLocale({ payload }, { call, put }) {
      const localeValue = require(`@/locales/${payload}`).default;
      const response = yield call(fetchUpdateUserCurrentLanguage, payload);
      if (
        !dealResponse(response, formatMessage({ id: 'app.header.option.switchLanguageSuccess' }))
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

    // 删除语种
    *deleteSystemLang({ payload }, { call, put }) {
      const response = yield call(deleteSysLang, payload);
      if (!dealResponse(response, true)) {
        const systemLanguage = yield call(getSystemLanguage);
        yield put({ type: 'saveSystemLanguage', payload: systemLanguage });
      }
    },
  },
};
