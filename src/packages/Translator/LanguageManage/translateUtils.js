import XLSX from 'xlsx';
import { forIn, sortBy } from 'lodash';
import { isStrictNull, formatMessage } from '@/utils/util';

export function exportTranslate(allShowData, key, appcode) {
  const modeText = {
    merge: formatMessage({ id: 'translator.languageManage.merge' }),
    standard: formatMessage({ id: 'translator.languageManage.standard' }),
    custom: formatMessage({ id: 'translator.languageManage.custom' }),
  };
  const data_ = allShowData.map((record) => {
    return {
      languageKey: record.languageKey,
      ...record.languageMap,
    };
  });
  const textlang = formatMessage({ id: 'translator.languageManage.langpackage' });
  const ws = XLSX.utils.json_to_sheet(data_); /* 新建空workbook，然后加入worksheet */
  const wb = XLSX.utils.book_new(); /*新建book*/
  XLSX.utils.book_append_sheet(wb, ws, 'People'); /* 生成xlsx文件(book,sheet数据,sheet命名) */
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

export function generateOriginData(dataList, allLanguage) {
  let standardData = [];
  if (Array.isArray(dataList.standard)) {
    standardData = [...dataList.standard].map((stItem) => {
      forIn(allLanguage, ({ type }) => {
        if (!stItem.languageMap[type]) {
          stItem.languageMap[type] = null;
        }
      });
      return stItem;
    });
  }

  let customData = [];
  if (Array.isArray(dataList.custom)) {
    customData = [...dataList.custom].map((cuItem) => {
      forIn(allLanguage, ({ type }) => {
        if (!cuItem.languageMap[type]) {
          cuItem.languageMap[type] = null;
        }
      });
      return cuItem;
    });
  }

  // custom里面的key一定在standard里面
  const mergeData = [...standardData].map((item) => {
    let item_ = { ...item };
    const record_ = customData.filter((record) => item_.languageKey === record.languageKey);
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
export function getdataList() {
  return {
    standard: [
      {
        languageKey: 'wcs.wcsException.task.redoErrorStatusError',
        languageMap: {
          'en-US': 'Tasks is neither cancelled nor completed and cannot be redone',
          'ko-KR': '작업은 취소도 아니고, 완성된 상태도 아니므로, 다시 할 수 없다',
          'vi-VN':
            'Nhiệm vụ không bị hủy bỏ cũng không được hoàn thành và không thể được thực hiện lại',
          'zh-CN': '任务既不是取消,也不是完成状态，不能重做',
        },
      },
      {
        languageKey: 'wcs.agvErrorDefinition.7002.errorName',
        languageMap: {
          'zh-CN': '电量异常',
          'en-US': 'Battery Level Abnormal',
          'ko-KR': '전기량 이상',
          'vi-VN': 'Mức Pin bất thường',
        },
      },
      {
        languageKey: 'wcs.transaltor.addApplication',
        languageMap: {
          'en-US': 'Add Application',
          'ko-KR': '',
          'vi-VN': '',
          'zh-CN': '添加应用',
        },
      },
      {
        languageKey: 'menu.authorized',
        languageMap: {
          'en-US': 'User Authority Manager',
          'ko-KR': '권한 관리',
          'vi-VN': 'Nhiệm vụ mm kvb`',
          'zh-CN': '权限管理',
        },
      },
    ],
    custom: [
      {
        languageKey: 'wcs.wcsException.task.redoErrorStatusError',
        languageMap: {
          'en-US': 'Tasks is neithe',
          'ko-KR': '작업은 취소도 아',
          'vi-VN': 'Nhiệm vụ không bị hủy',
          'zh-CN': '任务不能重做',
        },
      },
      {
        languageKey: 'menu.authorized',
        languageMap: {
          'en-US': 'Authorized',
          'ko-KR': '작업은',
          'vi-VN': 'Nhiệm vụ',
          'zh-CN': '权限',
        },
      },
    ],
  };
}
