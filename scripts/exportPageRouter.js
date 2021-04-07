const { join } = require('path');
const { writeFile, mkdirSync, exists } = require('fs');
const babelTransForm = require('./babelTransForm');

const pageRouter = babelTransForm(join(__dirname, '../', 'config/router.config.js'));
const menu = babelTransForm(join(__dirname, '../', 'src/locales/zh-CN/menu.js'));
const packageInfo = babelTransForm(join(__dirname, '../', './package.json'));
const permissionInfo = babelTransForm(join(__dirname, '../', 'src/PermissionInfo'));
const distDirection = join(__dirname, '../', 'dist');

const permissionInfoMap = {};
permissionInfo.default.forEach(record => {
  permissionInfoMap[record.page] = record;
});

const getPageTree = function(array, parentName) {
  const result = [];
  array.forEach(record => {
    if ((record.routes || record.component) && record.path) {
      const obj = {};
      obj.key = record.path;
      let name = 'menu' + '.' + record.name;
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

const AuthorityTree = function(array, parentName, appCode) {
  const result = [];
  array.forEach(record => {
    if ((record.routes || record.component) && record.path) {
      const obj = {};
      obj.key = appCode + record.path;
      let name = 'menu' + '.' + record.name;
      if (parentName != null) {
        name = parentName + '.' + record.name;
      }
      obj.label = menu.default[name];
      obj.icon = record.icon;
      obj.name = record.name;
      if (record.routes) {
        obj.children = AuthorityTree(record.routes, name, appCode);
      }
      if (permissionInfoMap[record.path] != null) {
        if (obj.children == null) {
          obj.children = [];
        }
        if (permissionInfoMap[record.path].children != null) {
          permissionInfoMap[record.path].children.forEach(record => {
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

if (pageRouter.default && Array.isArray(pageRouter.default)) {
  let menu = [];
  let authTree = [];

  pageRouter.default.forEach(router => {
    const subMenu = getPageTree(router.routes);
    menu.push(...subMenu);
  });

  pageRouter.default.forEach(router => {
    const subAuthTree = AuthorityTree(router.routes, null, packageInfo.appCode);
    authTree.push(...subAuthTree);
  });

  const info = {
    appCode: packageInfo.appCode,
    version: packageInfo.version,
    moduleType: packageInfo.moduleType,
    moduleName: packageInfo.name,
    baseContext: packageInfo.baseContext,
    menu,
    authTree,
  };

  exists(distDirection, function(exists) {
    if (!exists) {
      mkdirSync(distDirection);
    }
    writeFile(`${distDirection}/appInfo.json`, JSON.stringify(info, null, 2), error => {
      if (error) {
        throw error;
      }
    });
  });
}
