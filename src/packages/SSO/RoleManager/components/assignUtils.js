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
