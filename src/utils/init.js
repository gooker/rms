import intl from 'react-intl-universal';
import { dealResponse, isStrictNull } from '@/utils/util';
import { AppCode } from '@/config/config';

export function generateMenuNodeLocaleKey(data, parentName) {
  return data
    .map((item) => {
      if (!item.name) {
        return null;
      }

      let locale;
      if (!isStrictNull(parentName)) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = { ...item, locale };
      if (item.routes) {
        result.routes = generateMenuNodeLocaleKey(item.routes, locale);
      }
      return result;
    })
    .filter(Boolean);
}

export function filterMenuData(menuData) {
  if (!menuData) {
    return [];
  }
  return menuData.filter((item) => item.name && !item.hideInMenu).map((item) => getSubMenu(item));
}

export function getSubMenu(item) {
  if (item.routes && !item.hideInMenu && item.routes.some((child) => child.name)) {
    return { ...item, routes: filterMenuData(item.routes) };
  }
  return item;
}

export function checkPermission(router, permissionMap, appCode) {
  const result = [];
  for (let i = 0; i < router.length; i++) {
    const routerElement = router[i];
    // SSO菜单不参与权限控制
    if (routerElement.path && appCode !== AppCode.SSO) {
      let authKey = null;
      authKey = routerElement.path;
      if (isStrictNull(routerElement.hook) && !permissionMap[authKey]) {
        continue;
      }
    }

    if (routerElement.routes != null) {
      const routes = checkPermission(routerElement.routes, permissionMap, appCode);
      result.push({ ...routerElement, routes });
    } else {
      result.push(routerElement);
    }
  }
  return result;
}

function generateRouteLocaleKeyMap(data, result, parentName) {
  if (Array.isArray(data)) {
    data.forEach((record) => {
      const { path, routes, name } = record;
      if (Array.isArray(routes)) {
        generateRouteLocaleKeyMap(routes, result, `${parentName}.${name}`);
      } else {
        result[path] = parentName ? `${parentName}.${name}` : `${name}`;
      }
    });
  }
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

export function convertAllMenu(adminType, allModuleMenuData, permissionMap) {
  const routeLocaleKeyMap = { '/': 'menu.home' };
  // 1. 根据菜单的hook和authority字段进行第一次权限筛选
  const allRoutes = Object.keys(allModuleMenuData).map((appCode) => {
    let appMenu = allModuleMenuData[appCode];
    // 如果是SSO, 需要根据adminType对菜单数据进行筛选
    if (appCode === AppCode.SSO) {
      appMenu = appMenu.filter((route) => {
        // 权限控制基于 authority 和 hooks，且hooks优先
        // if (Array.isArray(route.hook)) {
        //   return validateHookPermission(route.hook);
        // }
        if (Array.isArray(route.authority)) {
          return route.authority.includes(adminType);
        }
        return false;
      });
    }
    // 组装多标签Label Map -- {路由History: 路由名称国际化Key}
    generateRouteLocaleKeyMap(appMenu, routeLocaleKeyMap, 'menu');
    return { appMenu, appCode };
  });
  // 2. 将一般路由数据转换成最终路由数据, 包括格式化、权限等等
  const allModuleFormattedMenuData = allRoutes.map((appRoute) => {
    const { appMenu, appCode } = appRoute;
    // 菜单项权限根据 AuthKey 再一次筛选
    const grantedMenu = checkPermission(appMenu, permissionMap, appCode);
    // 获取菜单节点名称的国际化key
    const menu = generateMenuNodeLocaleKey(grantedMenu);
    return { appCode, menu };
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

export function validateMenuNodePermission(menuNode, adminType) {
  if (Array.isArray(menuNode.hooks)) {
    return validateHookPermission(menuNode.hooks);
  } else {
    return validateRouteAuthority(menuNode, adminType);
  }
}

export function validateHookPermission(hook) {
  if (isStrictNull(hook) || !Array.isArray(hook)) {
    return false;
  }
  for (let index = 0; index < hook.length; index++) {
    if (window.localStorage.getItem(hook[index]) === 'true') {
      return true;
    }
  }
  return false;
}

export function validateRouteAuthority(record, adminType) {
  return Array.isArray(record?.authority) && record.authority.includes(adminType);
}
