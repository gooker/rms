import { isStrictNull } from '@/utils/utils';
import { flattenDeep } from 'lodash';

// 处理permisssion.js
export function getSubPermission(item) {
  if (item.children && item.children.length > 0) {
    return {
      ...item,
      title: item.label,
      children: filterPermission(item.children),
    };
  } else {
    return {
      ...item,
      title: item.label,
    };
  }
}

export function filterPermission(data) {
  return data && data.map((item) => getSubPermission(item));
}

// 处理menu的数据

export function showLabelMenu(data, parentName) {
  return data
    .map((item) => {
      if (!item.name) {
        return null;
      }
      let label;
      if (parentName) {
        label = `${parentName}.${item.name}`;
      } else {
        label = `menu.${item.name}`;
      }

      const result = {
        ...item,
        label,
      };
      if (item.routes) {
        result.routes = showLabelMenu(item.routes, label);
      }
      return result;
    })
    .filter(Boolean);
}

// 权限树扁平化
export function flattenMap(array) {
  const result = [];
  array &&
    array.forEach(({ key, children }) => {
      if (isStrictNull(key)) return;
      result.push(key);
      if (children) {
        result.push(flattenMap(children));
      }
    });
  return result;
}
export function handlePermissions(permissions, result) {
  permissions.forEach((record) => {
    if (isStrictNull(record)) return;
    const { key, children } = record;
    if (children != null) {
      result[key] = flattenDeep(flattenMap(children));
      handlePermissions(children, result);
    }
  });
}
