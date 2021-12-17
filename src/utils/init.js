import intl from 'react-intl-universal';
import { dealResponse, isStrictNull } from '@/utils/utils';
import { AppCode } from '@/config/config';

export function convertRoute2Menu(data, parentAuthority, parentName) {
  return data
    .map((item) => {
      if (!item.name) {
        return null;
      }
      let locale;
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        locale,
      };
      if (item.routes) {
        result.routes = convertRoute2Menu(item.routes, item.authority, locale);
      }
      return result;
    })
    .filter(Boolean);
}

export function getSubMenu(item) {
  if (item.routes && !item.hideInMenu && item.routes.some((child) => child.name)) {
    // eslint-disable-next-line no-use-before-define
    return { ...item, routes: filterMenuData(item.routes) };
  }
  return item;
}

export function filterMenuData(menuData) {
  if (!menuData) {
    return [];
  }
  return menuData.filter((item) => item.name && !item.hideInMenu).map((item) => getSubMenu(item));
}

export function checkPermission(router, permissionMap, appCode, nameSpace) {
  const result = [];
  for (let i = 0; i < router.length; i++) {
    const routerElement = router[i];
    // @调试
    // SSO菜单不参与权限控制
    // if (routerElement.path && appCode !== AppCode.SSO) {
    //   let authKey = null;
    //   authKey = routerElement.path;
    //   if (isStrictNull(routerElement.hook) && !permissionMap[authKey]) {
    //     continue;
    //   }
    // }

    if (routerElement.routes != null) {
      const routes = checkPermission(routerElement.routes, permissionMap, appCode, nameSpace);
      result.push({ ...routerElement, routes });
    } else {
      result.push(routerElement);
    }
  }
  return result;
}

export function getBreadcrumbNameMap(menuData, routerMap = {}) {
  menuData.forEach((menuItem) => {
    if (menuItem.routes) {
      getBreadcrumbNameMap(menuItem.routes, routerMap);
    } else {
      routerMap[menuItem.path] = menuItem;
    }
  });
  return routerMap;
}

export function filterAppByAuthorityKeys(subModules = [], authorityKeys = []) {
  const appCodes = new Set();
  appCodes.add(AppCode.SSO);
  const authorityKeysWithAppcode = authorityKeys.filter((key) => !key.startsWith('/'));
  authorityKeysWithAppcode.forEach((item) => {
    appCodes.add(item.split('/')[0]);
  });
  // @调试
  // return subModules.filter((item) => appCodes.has(item));
  return [...subModules];
}

export function convertToRoute(data, baseContext) {
  return data
    .map((item) => {
      const result = {};
      result.path = `${baseContext}${item.key}`;
      result.icon = item.icon;
      result.name = item.name || item.label;
      result.hideInMenu = item.hideInMenu;
      if (item.routes) {
        result.routes = convertToRoute(item.routes, baseContext);
      }
      return result;
    })
    .filter(Boolean);
}

export function convertAllMenu(adminType, allAppModulesMap, allModuleMenuData, permissionMap) {
  const routeLocaleKeyMap = {};
  // 1. 转换菜单数据到一般路由数据(包括sso筛选逻辑)
  const allRoutes = Object.keys(allModuleMenuData).map((appCode) => {
    let appMenu = allModuleMenuData[appCode];
    // 如果是SSO, 需要根据adminType对菜单数据进行筛选
    if (appCode === AppCode.SSO) {
      appMenu = appMenu.filter((route) => {
        // hook存在则一定有route
        // authority不存在或为空 就没有
        if (getLocalStorageHooks(route.hook)) {
          return true;
        } else if (isStrictNull(route.authority) || route.authority.length === 0) {
          return false;
        } else {
          return route.authority.includes(adminType);
        }
      });
    }
    return { appMenu, appCode };
  });

  //@@@
  // 2. 将一般路由数据转换成最终路由数据, 包括格式化、权限等等
  const allModuleFormattedMenuData = allRoutes.map((appRoute) => {
    const { appMenu, appCode } = appRoute;
    const baseContext = allAppModulesMap[appCode] || '';
    const baseMenuData = convertRoute2Menu(appMenu); // 获取菜单节点名称的国际化key
    const menuData = filterMenuData(baseMenuData); // 筛选掉 hideInMenu 的菜单项
    const result = checkPermission(menuData, permissionMap, appCode, baseContext); // 菜单项权限根据 AuthKey 再一次筛选
    const breadcrumbNameMap = getBreadcrumbNameMap(result);
    return { appCode, menu: result, breadcrumbNameMap };
  });
  return { allModuleFormattedMenuData, routeLocaleKeyMap };
}

export function getLanguage() {
  const cachedLocale = window.localStorage.getItem('currentLocale');
  const browserLocale = navigator.language;
  return cachedLocale || browserLocale;
}

export async function initI18nInstance() {
  const language = getLanguage();
  // TODO: 如果只拉取当前语种 这个应该不需要
  const localLocales = ['zh-CN', 'en-US', 'ko-KR', 'vi-VN'];
  // 1. 读取本地国际化数据
  const locales = {};
  try {
    locales[language] = require(`@/locales/${language}`).default;
  } catch (e) {
    locales[language] = {};
  }

  // 2. 拉取远程国际化数据并进行merge操作 --> 远程覆盖本地
  // TODO: 只拉取当前语种的国际化 appCode;
  const i18nData = []; //await fetchLanguageByAppCode({ appCode: 'portal' });
  if (!dealResponse(i18nData) && Array.isArray(i18nData)) {
    i18nData.forEach(({ languageKey, languageMap }) => {
      const DBLocales = Object.keys(languageMap);
      DBLocales.forEach((dbLocale) => {
        if (!localLocales.includes(dbLocale)) {
          localLocales.push(dbLocale);
          locales[dbLocale] = {};
        }
        locales[dbLocale][languageKey] = languageMap[dbLocale];
      });
    });

    //  远程覆盖本地
    return intl.init({ currentLocale: language, locales });
  } else {
    // 用本地国际化数据先初始化
    console.info('Failed to fetch remote I18N Data, will use local I18n Data');
    return intl.init({ currentLocale: language, locales });
  }
}

// hook -
export function getLocalStorageHooks(hook) {
  // 不存在hook / 不是数组
  if (isStrictNull(hook) || !Array.isArray(hook)) {
    return false;
  }
  const orSet = new Set();
  hook.map((item) => {
    if (window.localStorage.getItem(item) === 'true') {
      orSet.add(1);
    }
  });
  // 只要localstorage存在hook数组里的任一个 当前这个开发者就能看到页面
  if (orSet.has(1)) {
    return true;
  }
  return false;
}
