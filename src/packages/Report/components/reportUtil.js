/*
 *@searchValues 搜索条件数据
 *@param  在接口返回的数据中参数名
 * */
export const filterDataByParam = (loadOriginData, searchValues, param) => {
  const _data = { ...loadOriginData };
  const newData = {};
  Object.entries(_data).forEach(([key, allcellData]) => {
    const _allCellData = [];
    allcellData.forEach((item) => {
      if (Array.isArray(searchValues)) {
        if (searchValues.includes(item[param])) {
          _allCellData.push(item);
        }
      } else {
        if (searchValues === item[param]) {
          _allCellData.push(item);
        }
      }
    });
    newData[key] = _allCellData;
  });
  return newData;
};

/*
 * 时间: 按时 日 月
 * @param {*} allData 数据
 * @param {*} translate 报表所有的key和对应的翻译 {key:value}
 * @param {*} idName 根据id求合 可以是cellId/agvId
 * @param {*} timeType  时间: 按时 日 月
 *
 */
export const filterNewXAixsTime = (allData = {}, timeType) => {
  let xAxisData = []; //// 横坐标
  Object.keys(allData).forEach((key) => {
    if (timeType === 'hour') {
      xAxisData.push(key.substring(0, 16));
    } else if (timeType === 'day') {
      xAxisData.push(key.substring(0, 10));
    } else {
      xAxisData.push(key.substring(0, 7));
    }
  });

  xAxisData = [...new Set(xAxisData)];
  return xAxisData.sort((a, b) => (a >= b ? 1 : -1));
};

export const getNewKey = (key, type) => {
  if (type === 'hour') {
    return key.substring(0, 16);
  } else if (type === 'day') {
    return key.substring(0, 10);
  } else {
    return key.substring(0, 7);
  }
};
