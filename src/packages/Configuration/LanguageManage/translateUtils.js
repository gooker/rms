import XLSX from 'xlsx';
import { find, findIndex, forIn, groupBy, mergeWith } from 'lodash';
import { convertMapArrayToMap, dealResponse, formatMessage, isStrictNull, sortLanguages } from '@/utils/util';
import { getSysLang } from '@/services/translationService';

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
    const currentLangMap = {};
    forIn(record.languageMap, (value, key) => {
      if (showLanguage.includes(key)) {
        currentLangMap[key] = value;
      }
    });
    return {
      languageKey: record.languageKey,
      ...currentLangMap,
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

// 将后端数据转换成前端需要的格式
export function generateMapToArray(dataList, allLanguageKeys) {
  let newData = [];
  const dataListMap = convertMapArrayToMap(dataList, 'languageKey', 'languageMap');
  // 这里已中文翻译的key为准
  for (const languageKey in dataListMap['zh-CN']) {
    const languageMap = {};
    allLanguageKeys.forEach((lang) => {
      languageMap[lang] = dataListMap[lang][languageKey];
    });
    newData.push({ languageKey, languageMap });
  }
  return newData;
}

export function generateOriginData(dataList, allLanguage) {
  const allLanguageKeys = allLanguage.map(({ code }) => code);
  let standardData = [];
  if (Array.isArray(dataList.Standard)) {
    standardData = generateMapToArray(dataList.Standard, allLanguageKeys);
  }

  let customData = [];
  if (Array.isArray(dataList.Custom)) {
    const custom = dataList.Custom.map((item) => {
      const key = Object.keys(item.languageMap)[0];
      return { key, ...item };
    });
    const customGroup = groupBy(custom, 'key');
    customData = Object.entries(customGroup).map(([languageKey, translations]) => {
      const result = { languageKey, languageMap: {} };
      allLanguageKeys.forEach((lang) => {
        const translation = find(translations, { languageKey: lang });
        if (translation) {
          result['languageMap'][lang] = translation['languageMap'][languageKey];
        } else {
          result['languageMap'][lang] = '';
        }
      });
      return result;
    });
  }

  // custom里面的key一定在standard里面
  const mergeData = [...standardData];
  [...customData].forEach((item) => {
    const standardIndex = findIndex(standardData, { languageKey: item.languageKey });
    if (standardIndex > -1) {
      const standard = standardData[standardIndex];
      const replaceItem = {
        ...standard,
        languageMap: mergeWith(standard.languageMap, item.languageMap, (objValue, srcValue) => {
          if (isStrictNull(srcValue)) {
            return objValue;
          }
          return srcValue;
        }),
      };
      mergeData.splice(standardIndex, 1, replaceItem);
    } else {
      mergeData.push(item);
    }
  });

  return { standardData, customData, mergeData };
}
