/* eslint-disable no-param-reassign */
import intl from 'react-intl-universal';
import { find } from 'lodash';
import { dealResponse } from '@/utils/utils';
import { fetchLanguageByAppCode } from '@/services/global';

export function flattenBreadcrumbNameMap(data, context, result, parentName) {
  if (Array.isArray(data)) {
    data.forEach((record) => {
      const { key, children, name } = record;
      let currentKey = `${key}`;
      if (context !== '' && context != null) {
        currentKey = `${context}${key}`;
      }
      // eslint-disable-next-line no-param-reassign
      result[currentKey] = parentName ? `${parentName}.${name}` : `${name}`;
      if (children != null && children.length > 0) {
        flattenBreadcrumbNameMap(children, context, result, result[currentKey]);
      }
    });
  }
}

export function convertRoute2Menu(data, parentAuthority, parentName) {
  return data
    .map((item) => {
      if (!item.name || !item.path) {
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
        name: intl.formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
      };
      if (item.routes) {
        result.children = convertRoute2Menu(item.routes, item.authority, locale);
      }
      delete result.routes;
      return result;
    })
    .filter(Boolean);
}

export function getSubMenu(item) {
  if (item.children && !item.hideInMenu && item.children.some((child) => child.name)) {
    // eslint-disable-next-line no-use-before-define
    return { ...item, children: filterMenuData(item.children) };
  }
  return item;
}

export function filterMenuData(menuData) {
  if (!menuData) {
    return [];
  }
  return menuData.filter((item) => item.name && !item.hideInMenu).map((item) => getSubMenu(item));
}

export function checkPermission(router, permissionMap, appCode, nameSapce) {
  const result = [];
  for (let i = 0; i < router.length; i++) {
    const routerElement = router[i];
    // SSO菜单不参与权限控制
    if (routerElement.path && appCode !== 'sso') {
      let authKey = null;
      if (nameSapce && routerElement.path.indexOf(`/${nameSapce}`) !== -1) {
        authKey = routerElement.path.replace(`/${nameSapce}`, nameSapce);
      } else {
        authKey = routerElement.path;
      }
      if (!permissionMap[authKey]) {
        continue;
      }
    }

    if (routerElement.children != null) {
      const children = checkPermission(routerElement.children, permissionMap, appCode, nameSapce);
      result.push({ ...routerElement, children });
    } else {
      result.push(routerElement);
    }
  }
  return result;
}

export function getBreadcrumbNameMap(menuData) {
  const routerMap = {};
  const flattenMenuData = (data) => {
    data.forEach((menuItem) => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
}

export function filterAppByAuthorityKeys(subModules = [], authorityKeys = []) {
  const appCodes = new Set();
  appCodes.add('sso');
  const authorityKeysWithAppcode = authorityKeys.filter((key) => !key.startsWith('/'));
  authorityKeysWithAppcode.forEach((item) => {
    appCodes.add(item.split('/')[0]);
  });
  return subModules.filter((item) => appCodes.has(item));
}

export function convertToRoute(data, baseContext) {
  return data
    .map((item) => {
      const result = {};
      result.path = `${baseContext}${item.key}`;
      result.icon = item.icon;
      result.name = item.name || item.label;
      result.hideInMenu = item.hideInMenu;

      // TODO: 这里可以处理下additionalInfo相关的数据

      if (item.children) {
        result.routes = convertToRoute(item.children, baseContext);
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
    const appModuleInfo = allAppModulesMap[appCode];

    // 如果是SSO, 需要根据adminType对菜单数据进行筛选
    if (appCode === 'sso') {
      appMenu = appMenu.filter((route) => route.authority.includes(adminType));
    }

    // 组装Map -- {路由History: 路由名称国际化Key}
    const baseContext = appModuleInfo ? `/${appModuleInfo}` : null;
    flattenBreadcrumbNameMap(appMenu, baseContext, routeLocaleKeyMap, '');

    // 获取路由
    const routes = convertToRoute(appMenu, baseContext);
    return { routes, appCode };
  });

  // 2. 将一般路由数据转换成最终路由数据, 包括格式化、权限等等
  const allModuleFormattedMenuData = allRoutes.map((appRoute) => {
    const { routes, appCode } = appRoute;
    const baseContext = allAppModulesMap[appCode] || '';
    const baseMenuData = convertRoute2Menu(routes); // 获取菜单节点名称
    const menuData = filterMenuData(baseMenuData);
    const result = checkPermission(menuData, permissionMap, appCode, baseContext);
    const breadcrumbNameMap = getBreadcrumbNameMap(result);
    return { appCode, menu: result, breadcrumbNameMap };
  });

  return { allModuleFormattedMenuData, routeLocaleKeyMap };
}

export function getLanguage() {
  const cachedLocale = window.localStorage.getItem('currentLocale'); // user model初始化存的
  const browserLocale = navigator.language;
  const language = cachedLocale || browserLocale;
  return language;
}

export async function initI18nInstance() {
  const language = getLanguage();
  // TODO: 后续通过读取I18n中已配置的语种进行初始化
  const localLocales = ['zh-CN', 'en-US', 'ko-KR', 'vi-VN'];
  // 1. 读取本地国际化数据
  const locales = {};
  try {
    locales[language] = require(`@/locales/${language}`).default;
  } catch (e) {
    locales[language] = {};
  }
  // 用本地国际化数据先初始化
  await intl.init({ currentLocale: language, locales });

  // 2. 拉取远程国际化数据并进行merge操作 --> 远程覆盖本地
  // TODO: 只拉取当前语种的国际化
  const i18nData = await fetchLanguageByAppCode({ appCode: 'portal' });
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
    await intl.init({ currentLocale: language, locales });
  } else {
    console.info('Failed to fetch remote I18N Data, will use local I18n Data');
  }
}

export function getEntryByModuleName(moduleName) {
  const { subModules } = window.g_app._store.getState().global;
  let currentEntry;
  let currentModuleName = moduleName;
  const currentModule = find(subModules, { name: currentModuleName });
  if (currentModule) {
    currentEntry = currentModule.entry;
  } else {
    currentEntry = subModules[0].entry;
    currentModuleName = subModules[0].name;
  }
  return { currentEntry, currentModuleName };
}
