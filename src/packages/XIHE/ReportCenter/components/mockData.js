export function getQrcodedata() {
  // 1.按照小时来
  // 2.按码号-是从每个日期里找到该key求和
  // mockdate 过去7天 1-8号码

  // tip: 数据一定要排序 外层日期要排序 里面cellId也要排序
  return {
    '2022-01-03 10:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        lightdeviationCar: 6, //轻微偏移车数
        slightdeviationCar: 7, // 一般偏移车数
        seriousdeviationCar: 8, // 严重偏移车数
        dropoutNumCar: 9, //丢码车数
        errorNumCar: 10, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 0, // 严重偏移
        throwcodeNum: 0, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 3, //轻微偏移车数
        slightdeviationCar: 4, // 一般偏移车数
        seriousdeviationCar: 5, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
    ],
    '2022-01-03 11:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 5, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 3, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
    ],
    '2022-01-03 12:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 5, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 3, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
    ],
    '2022-01-03 13:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 5, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 3, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
    ],
    '2022-01-03 14:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 5, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 3, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
    ],
    '2022-01-03 15:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 5, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 3, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
    ],
    '2022-01-03 16:00': [
      {
        cellId: 1,
        slightdeviation: 0, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 5, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 3, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 4, // 一般偏移
        seriousdeviation: 6, // 严重偏移
        throwcodeNum: 9, //丢码次数
        errorcodeNum: 10, // 错码次数
        lightdeviationCar: 2, //轻微偏移车数
        slightdeviationCar: 20, // 一般偏移车数
        seriousdeviationCar: 15, // 严重偏移车数
        dropoutNumCar: 10, //丢码车数
        errorNumCar: 3, //错码车数
      },
    ],
  };
}

export function getLatentPoQrcodedata() {
  return {
    '2022-01-11 10:00': [
      {
        cellId: 1,
        slightdeviation: 10, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 0, // 严重偏移
        errorcodeNum: 0, // 错码次数
        lightdeviationCar: 0, //轻微偏移车数
        slightdeviationCar: 0, // 一般偏移车数
        seriousdeviationCar: 0, // 严重偏移车数
        dropoutNumCar: 0, //丢码车数
        errorNumCar: 0, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 1, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 1, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 3, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        errorcodeNum: 3, // 错码次数
        lightdeviationCar: 3, //轻微偏移车数
        slightdeviationCar: 3, // 一般偏移车数
        seriousdeviationCar: 0, // 严重偏移车数
        dropoutNumCar: 3, //丢码车数
        errorNumCar: 3, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
    ],
    '2022-01-11 11:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 3, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
    ],
    '2022-01-11 12:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 3, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
    ],
    '2022-01-11 13:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 3, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
    ],
    '2022-01-11 14:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 3, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
    ],
    '2022-01-11 15:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 3, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
    ],
    '2022-01-11 16:00': [
      {
        cellId: 1,
        slightdeviation: 0, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 3, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 4, // 一般偏移
        seriousdeviation: 6, // 严重偏移
        errorcodeNum: 10, // 错码次数
        lightdeviationCar: 2, //轻微偏移车数
        slightdeviationCar: 20, // 一般偏移车数
        seriousdeviationCar: 15, // 严重偏移车数
        dropoutNumCar: 10, //丢码车数
        errorNumCar: 3, //错码车数
      },
    ],
  };
}

export function getToteQrcodedata() {
  return {
    '2022-01-15 08:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 10, // 一般偏移
        seriousdeviation: 10, // 严重偏移
        errorcodeNum: 10, // 错码次数
        lightdeviationCar: 10, //轻微偏移车数
        slightdeviationCar: 10, // 一般偏移车数
        seriousdeviationCar: 10, // 严重偏移车数
        dropoutNumCar: 10, //丢码车数
        errorNumCar: 10, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 4, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 4, // 严重偏移
        errorcodeNum: 1, // 错码次数
        lightdeviationCar: 4, //轻微偏移车数
        slightdeviationCar: 1, // 一般偏移车数
        seriousdeviationCar: 4, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 4, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 6, //轻微偏移
        generaldeviation: 3, // 一般偏移
        seriousdeviation: 6, // 严重偏移
        errorcodeNum: 3, // 错码次数
        lightdeviationCar: 6, //轻微偏移车数
        slightdeviationCar: 3, // 一般偏移车数
        seriousdeviationCar: 6, // 严重偏移车数
        dropoutNumCar: 3, //丢码车数
        errorNumCar: 6, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 1, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 1, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 0, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 0, // 严重偏移车数
        dropoutNumCar: 2, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 0, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 0, //轻微偏移车数
        slightdeviationCar: 0, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 0, //丢码车数
        errorNumCar: 3, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 4, //轻微偏移
        generaldeviation: 4, // 一般偏移
        seriousdeviation: 4, // 严重偏移
        errorcodeNum: 4, // 错码次数
        lightdeviationCar: 4, //轻微偏移车数
        slightdeviationCar: 4, // 一般偏移车数
        seriousdeviationCar: 4, // 严重偏移车数
        dropoutNumCar: 4, //丢码车数
        errorNumCar: 4, //错码车数
      },
    ],
    '2022-01-15 09:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 10, // 一般偏移
        seriousdeviation: 10, // 严重偏移
        errorcodeNum: 10, // 错码次数
        lightdeviationCar: 10, //轻微偏移车数
        slightdeviationCar: 10, // 一般偏移车数
        seriousdeviationCar: 10, // 严重偏移车数
        dropoutNumCar: 10, //丢码车数
        errorNumCar: 10, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 4, //轻微偏移
        generaldeviation: 10, // 一般偏移
        seriousdeviation: 4, // 严重偏移
        errorcodeNum: 10, // 错码次数
        lightdeviationCar: 4, //轻微偏移车数
        slightdeviationCar: 10, // 一般偏移车数
        seriousdeviationCar: 4, // 严重偏移车数
        dropoutNumCar: 10, //丢码车数
        errorNumCar: 4, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 6, //轻微偏移
        generaldeviation: 3, // 一般偏移
        seriousdeviation: 6, // 严重偏移
        errorcodeNum: 3, // 错码次数
        lightdeviationCar: 6, //轻微偏移车数
        slightdeviationCar: 3, // 一般偏移车数
        seriousdeviationCar: 6, // 严重偏移车数
        dropoutNumCar: 3, //丢码车数
        errorNumCar: 6, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 10, // 严重偏移
        errorcodeNum: 1, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 1, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 0, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 0, // 严重偏移车数
        dropoutNumCar: 2, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 0, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 0, //轻微偏移车数
        slightdeviationCar: 0, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 0, //丢码车数
        errorNumCar: 3, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 1, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 1, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 2, //丢码车数
        errorNumCar: 4, //错码车数
      },
    ],
    '2022-01-15 10:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 10, // 一般偏移
        seriousdeviation: 10, // 严重偏移
        errorcodeNum: 10, // 错码次数
        lightdeviationCar: 10, //轻微偏移车数
        slightdeviationCar: 10, // 一般偏移车数
        seriousdeviationCar: 10, // 严重偏移车数
        dropoutNumCar: 10, //丢码车数
        errorNumCar: 10, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 4, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 4, // 严重偏移
        errorcodeNum: 1, // 错码次数
        lightdeviationCar: 4, //轻微偏移车数
        slightdeviationCar: 1, // 一般偏移车数
        seriousdeviationCar: 4, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 4, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 6, //轻微偏移
        generaldeviation: 3, // 一般偏移
        seriousdeviation: 6, // 严重偏移
        errorcodeNum: 3, // 错码次数
        lightdeviationCar: 6, //轻微偏移车数
        slightdeviationCar: 3, // 一般偏移车数
        seriousdeviationCar: 6, // 严重偏移车数
        dropoutNumCar: 3, //丢码车数
        errorNumCar: 6, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 1, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 1, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 0, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 0, // 严重偏移车数
        dropoutNumCar: 2, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 0, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 0, //轻微偏移车数
        slightdeviationCar: 0, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 0, //丢码车数
        errorNumCar: 3, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 4, //轻微偏移
        generaldeviation: 4, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 1, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 2, //丢码车数
        errorNumCar: 4, //错码车数
      },
    ],
    '2022-01-15 11:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 1, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 1, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 4, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 4, // 严重偏移
        errorcodeNum: 1, // 错码次数
        lightdeviationCar: 4, //轻微偏移车数
        slightdeviationCar: 1, // 一般偏移车数
        seriousdeviationCar: 4, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 4, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 6, //轻微偏移
        generaldeviation: 3, // 一般偏移
        seriousdeviation: 6, // 严重偏移
        errorcodeNum: 3, // 错码次数
        lightdeviationCar: 6, //轻微偏移车数
        slightdeviationCar: 3, // 一般偏移车数
        seriousdeviationCar: 6, // 严重偏移车数
        dropoutNumCar: 3, //丢码车数
        errorNumCar: 6, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 1, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 1, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 0, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 0, // 严重偏移车数
        dropoutNumCar: 2, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 0, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 0, //轻微偏移车数
        slightdeviationCar: 0, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 0, //丢码车数
        errorNumCar: 3, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 2, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 1, //丢码车数
        errorNumCar: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 4, //轻微偏移
        generaldeviation: 4, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        lightdeviationCar: 1, //轻微偏移车数
        slightdeviationCar: 1, // 一般偏移车数
        seriousdeviationCar: 1, // 严重偏移车数
        dropoutNumCar: 2, //丢码车数
        errorNumCar: 4, //错码车数
      },
    ],
  };
}
