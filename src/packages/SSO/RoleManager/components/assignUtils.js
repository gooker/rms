import { formatMessage, isNull, isStrictNull } from '@/utils/util';
import { flattenDeep } from 'lodash';
import { validateMenuNodePermission } from '@/utils/init';

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

  return {
    key,
    title,
    children: children.map((child) => recursionRenderChild(child, adminType)).filter(Boolean),
  };
}

export function recursionRenderChild(child, adminType) {
  const { key, label, locale, children } = child;
  // 原始菜单数据肯定有国际化key
  const isAdditional = isNull(locale);
  if (isAdditional || validateMenuNodePermission(child, adminType)) {
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
}
