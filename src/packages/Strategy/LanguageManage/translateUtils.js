import XLSX from 'xlsx';
import { forIn, sortBy, findIndex } from 'lodash';
import { isStrictNull, formatMessage, dealResponse, sortLanguages } from '@/utils/util';
import { getSysLang } from '@/services/translator';

export async function getSystemLanguage() {
  let systemLanguage = await getSysLang();
  if (!dealResponse(systemLanguage, false, false)) {
    // Tips: 如果未来有一些特殊的操作，比如隐藏某些语言，可以在这里操作existLanguages
    systemLanguage = sortLanguages(systemLanguage);
  } else {
    systemLanguage = [
      { code: 'zh-CN', name: '中文' },
      { code: 'en-US', name: 'English' },
    ];
  }
  return systemLanguage;
}

export function exportTranslate(allShowData, key, appcode, showLanguage) {
  const modeText = {
    merge: formatMessage({ id: 'translator.languageManage.merge' }),
    standard: formatMessage({ id: 'translator.languageManage.standard' }),
    custom: formatMessage({ id: 'translator.languageManage.custom' }),
  };
  const data_ = allShowData.map((record) => {
    const currentlangMap = {};
    forIn(record.languageMap, (value, key) => {
      if (showLanguage.includes(key)) {
        currentlangMap[key] = value;
      }
    });
    return {
      languageKey: record.languageKey,
      ...currentlangMap,
    };
  });
  const textlang = formatMessage({ id: 'translator.languageManage.langPackage' });
  const ws = XLSX.utils.json_to_sheet(data_); /* 新建空workbook，然后加入worksheet */
  const wb = XLSX.utils.book_new(); /*新建book*/
  XLSX.utils.book_append_sheet(wb, ws, 'common'); /* 生成xlsx文件(book,sheet数据,sheet命名) */
  XLSX.writeFile(wb, `${modeText[key]}${textlang}-${appcode}.xlsx`); /*写文件(book,xlsx文件名称)*/
}

export function generatefilterValue(
  filterValue,
  dataSorce,
  shownColumns,
  showMissingTranslate,
  showLanguage,
) {
  let result = [];
  // 搜索框是否有内容
  if (!isStrictNull(filterValue?.trim())) {
    result = dataSorce.filter((record) => {
      let flag = false;
      forIn(record, (value, key) => {
        if (!isStrictNull(value) && shownColumns[key]) {
          if (value.indexOf(filterValue.trim()) !== -1) {
            flag = true;
          }
        }
      });
      return flag;
    });
  } else {
    result = dataSorce;
  }

  // 是否勾选显示缺少翻译的checkbox
  if (showMissingTranslate) {
    result = result.filter((record) => {
      let flag = false;
      for (let index = 0; index < showLanguage.length; index++) {
        const element = showLanguage[index];
        flag = isStrictNull(record[element]);
      }
      return flag;
    });
  }
  return result;
}

//
export function generateUpdateDataToSave(updateData) {
  const saveMap = {};
  updateData.map((record) => {
    forIn(record, (value, key) => {
      const languageKey = record['languageKey'];
      if (key !== 'languageKey') {
        if (saveMap[key] == null) {
          saveMap[key] = {};
        }
        saveMap[key][languageKey] = value;
      }
    });
  });
  return saveMap;
}

// 根据后端数据 转换成前端需要的
export function generateMaptoArray(dataList) {
  let newData = [];
  dataList?.map(({ languageKey, languageMap }) => {
    Object.entries(languageMap).forEach(([key, value]) => {
      let filterKey = newData.find((item) => item.languageKey === key);
      let index = findIndex(newData, (record) => record.languageKey === key);
      if (filterKey) {
        filterKey.languageMap[languageKey] = value;
        newData.splice(index, 1, filterKey);
      } else {
        newData.push({
          languageKey: key,
          languageMap: {
            [languageKey]: value,
          },
        });
      }
    });
  });
  return newData;
}
export function generateOriginData(dataList, allLanguage) {
  let standardData = [];
  if (Array.isArray(dataList.Standard)) {
    standardData = generateMaptoArray(dataList.Standard);
  }

  let customData = [];
  if (Array.isArray(dataList.Custom)) {
    customData = dataList.Custom?.map((cuItem) => {
      const currentItem = { ...cuItem };
      forIn(allLanguage, ({ code }) => {
        if (!currentItem.languageMap[code]) {
          currentItem.languageMap[code] = '';
        }
      });
      return currentItem;
    });
  }

  // custom里面的key一定在standard里面
  const mergeData = [...standardData].map((item) => {
    let item_ = { ...item };
    const record_ = customData.filter((record) => item.languageKey === record.languageKey);
    if (record_.length > 0) {
      item_ = record_[0];
    }
    return item_;
  });

  return {
    standardData: sortBy(standardData, (o) => {
      return o.languageKey;
    }),
    customData: sortBy(customData, (o) => {
      return o.languageKey;
    }),
    mergeData: sortBy(mergeData, (o) => {
      return o.languageKey;
    }),
  };
}
