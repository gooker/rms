import { flattenDeep } from 'lodash';
import { formatMessage, isStrictNull } from '@/utils/util';

export function getSubPermission(item) {
  if (item.children) {
    return { ...item, children: filterPermission(item.children) };
  } else {
    return { ...item, title: item.label };
  }
}

export function filterPermission(data) {
  return data && data.map((item) => getSubPermission(item));
}

// 权限树扁平化
export function flattenMap(array) {
  const result = [];
  if (Array.isArray(array)) {
    array.forEach((item) => {
      if (item) {
        const { key, children } = item;
        if (isStrictNull(key)) return;
        result.push(key);
        if (children) {
          result.push(flattenMap(children));
        }
      }
    });
  }
  return result;
}

export function handlePermissions(record, result) {
  function handleRecord(item) {
    if (isStrictNull(item)) return;
    const { key, children } = item;
    if (children != null) {
      result[key] = flattenDeep(flattenMap(children));
      handlePermissions(children, result);
    }
  }
  if (Array.isArray(record)) {
    record.forEach((item) => {
      handleRecord(item);
    });
  } else {
    handleRecord(record);
  }
}

export function generateTreeData(menu, adminType) {
  const { key, title, children } = menu;

  const childrenNode = children
    .map((child) => recursionRenderChild(child, adminType))
    .filter(Boolean);

  return { key, title, children: childrenNode };
}

export function recursionRenderChild(child, adminType) {
  const { key, label, locale, children } = child;
  if (Array.isArray(children)) {
    return {
      key,
      title: label || formatMessage({ id: locale }),
      children: children.map((child) => recursionRenderChild(child, adminType)).filter(Boolean),
    };
  }
  return {
    key,
    title: label || formatMessage({ id: locale }),
  };
}
