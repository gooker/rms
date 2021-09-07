/* eslint-disable no-param-reassign */
import intl from 'react-intl-universal';
import { dealResponse, isStrictNull } from '@/utils/utils';
// import { fetchLanguageByAppCode } from '@/services/global';

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
  const multiApiFlag = window.localStorage.getItem('multi-api');
  for (let i = 0; i < router.length; i++) {
    let routerHookFlag = true;
    const routerElement = router[i];
    // SSO菜单不参与权限控制
    if (routerElement.path && appCode !== 'sso') {
      let authKey = null;
      if (nameSapce && routerElement.path.indexOf(`/${nameSapce}`) !== -1) {
        authKey = routerElement.path.replace(`/${nameSapce}`, nameSapce);
      } else {
        authKey = routerElement.path;
      }
      // hook存在 则不参与权限控制
      routerHookFlag = !(routerElement.hook === 'multi-api' && !isStrictNull(multiApiFlag));

      if (routerHookFlag && !permissionMap[authKey]) {
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

export function getBreadcrumbNameMap(menuData, routerMap = {}) {
  menuData.forEach((menuItem) => {
    if (menuItem.children) {
      getBreadcrumbNameMap(menuItem.children, routerMap);
    } else {
      routerMap[menuItem.path] = menuItem;
    }
  });
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

      if (item.children) {
        result.routes = convertToRoute(item.children, baseContext);
      }
      return result;
    })
    .filter(Boolean);
}

export function convertAllMenu(adminType, allAppModulesMap, allModuleMenuData, permissionMap) {
  const routeLocaleKeyMap = {};
  const multiApiFlag = window.localStorage.getItem('multi-api');
  // 1. 转换菜单数据到一般路由数据(包括sso筛选逻辑)
  const allRoutes = Object.keys(allModuleMenuData).map((appCode) => {
    let appMenu = allModuleMenuData[appCode];
    // 如果是SSO, 需要根据adminType对菜单数据进行筛选
    if (appCode === 'sso') {
      appMenu = appMenu.filter((route) => {
        // hook存在则一定有route
        // authority不存在或为空 也有route
        if (
          (route.hook === 'multi-api' && !isStrictNull(multiApiFlag)) ||
          isStrictNull(route.authority) ||
          route.authority.length === 0
        ) {
          return true;
        } else {
          return route.authority.includes(adminType);
        }
      });
    }

    // 获取路由
    return { appMenu, appCode };
  });

  // 2. 将一般路由数据转换成最终路由数据, 包括格式化、权限等等
  const allModuleFormattedMenuData = allRoutes.map((appRoute) => {
    const { appMenu, appCode } = appRoute;
    const baseContext = allAppModulesMap[appCode] || '';
    const baseMenuData = convertRoute2Menu(appMenu); // 获取菜单节点名称
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
    await intl.init({ currentLocale: language, locales });
  } else {
    // 用本地国际化数据先初始化
    await intl.init({ currentLocale: language, locales });
    console.info('Failed to fetch remote I18N Data, will use local I18n Data');
  }
}
