const { join } = require('path');
const babelTransForm = require('./babelTransForm');
const { writeFile, mkdirSync, exists } = require('fs');

const distFolderPath = join(__dirname, '../', 'dist');
const routeFolderPath = babelTransForm(
  join(__dirname, '../', 'src/config/router/sorter.router.js'),
);
const packageInfo = babelTransForm(join(__dirname, '../', './package.json'));
const menu = babelTransForm(join(__dirname, '../', 'src/locales/zh-CN/menu.js'));
const permissionInfoFilePath = babelTransForm(join(__dirname, '../', 'src/config/PermissionInfo'));

const permissionInfoMap = {};
permissionInfoFilePath &&
  permissionInfoFilePath.default.forEach((record) => {
    permissionInfoMap[record.page] = record;
  });

// 生成菜单树
const getPageTree = function (array, parentName) {
  const result = [];
  array.forEach((record) => {
    if ((record.routes || record.component) && record.name) {
      const obj = {};
      obj.key = record.path || record.name;
      let name = 'menu.' + record.name;
      if (parentName != null) {
        name = parentName + '.' + record.name;
      }
      obj.label = menu.default[name];
      obj.icon = record.icon;
      obj.name = record.name;
      obj.authority = record.authority;
      obj.hideInMenu = record.hideInMenu;
      obj.additionalInfo = record.additionalInfo;
      if (record.routes) {
        obj.children = getPageTree(record.routes, name);
      }
      result.push(obj);
    }
  });
  return result;
};
// 生成权限树
const AuthorityTree = function (array, parentName, appCode) {
  const result = [];
  array.forEach((record) => {
    if ((record.routes || record.component) && record.name) {
      const obj = {};
      obj.key = appCode + (record.path || record.name);
      let name = 'menu.' + record.name;
      if (parentName != null) {
        name = parentName + '.' + record.name;
      }
      obj.label = menu.default[name];
      obj.icon = record.icon;
      obj.name = record.name;
      if (record.routes) {
        obj.children = AuthorityTree(record.routes, name, appCode);
      }
      if (record.path && permissionInfoMap[record.path] != null) {
        if (obj.children == null) {
          obj.children = [];
        }
        if (permissionInfoMap[record.path].children != null) {
          permissionInfoMap[record.path].children.forEach((record) => {
            obj.children.push(record);
          });
        } else {
          obj.children.push(permissionInfoMap[record.path]);
        }
      }
      result.push(obj);
    }
  });
  return result;
};

if (routeFolderPath.default && Array.isArray(routeFolderPath.default)) {
  let menu = [];
  let authTree = [];

  // routeFolderPath.default.forEach((router) => {
  //   const subMenu = getPageTree(router.routes);
  //   menu.push(...subMenu);
  // });
  // routeFolderPath.default.forEach((router) => {
  //   const subAuthTree = AuthorityTree(router.routes, null, packageInfo.appCode);
  //   authTree.push(...subAuthTree);
  // });

  const subMenu = getPageTree(routeFolderPath.default);
  menu.push(...subMenu);

  const subAuthTree = AuthorityTree(routeFolderPath.default, null, packageInfo.appCode);
  authTree.push(...subAuthTree);

  const info = {
    appCode: packageInfo.appCode,
    version: packageInfo.version,
    moduleType: packageInfo.moduleType,
    moduleName: packageInfo.name,
    baseContext: packageInfo.baseContext,
    menu,
    authTree,
  };

  exists(distFolderPath, function (exists) {
    if (!exists) {
      mkdirSync(distFolderPath);
    }
    writeFile(`${distFolderPath}/appInfo.json`, JSON.stringify(info, null, 2), (error) => {
      if (error) {
        throw error;
      }
    });
  });
}
