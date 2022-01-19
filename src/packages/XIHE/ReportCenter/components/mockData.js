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
        slightdeviationAMR: 6, //轻微偏移车数
        generaldeviationAMR: 7, // 一般偏移车数
        seriousdeviationAMR: 8, // 严重偏移车数
        dropoutNumAMR: 9, //丢码车数
        errorNumAMR: 10, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 0, // 严重偏移
        throwcodeNum: 0, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 3, //轻微偏移车数
        generaldeviationAMR: 4, // 一般偏移车数
        seriousdeviationAMR: 5, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
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
        slightdeviationAMR: 3, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
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
        slightdeviationAMR: 3, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
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
        slightdeviationAMR: 3, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
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
        slightdeviationAMR: 3, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
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
        slightdeviationAMR: 3, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
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
        slightdeviationAMR: 3, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 4, // 一般偏移
        seriousdeviation: 6, // 严重偏移
        throwcodeNum: 9, //丢码次数
        errorcodeNum: 10, // 错码次数
        slightdeviationAMR: 2, //轻微偏移车数
        generaldeviationAMR: 20, // 一般偏移车数
        seriousdeviationAMR: 15, // 严重偏移车数
        dropoutNumAMR: 10, //丢码车数
        errorNumAMR: 3, //错码车数
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
        slightdeviationAMR: 0, //轻微偏移车数
        generaldeviationAMR: 0, // 一般偏移车数
        seriousdeviationAMR: 0, // 严重偏移车数
        dropoutNumAMR: 0, //丢码车数
        errorNumAMR: 0, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 1, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 1, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 3, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        errorcodeNum: 3, // 错码次数
        slightdeviationAMR: 3, //轻微偏移车数
        generaldeviationAMR: 3, // 一般偏移车数
        seriousdeviationAMR: 0, // 严重偏移车数
        dropoutNumAMR: 3, //丢码车数
        errorNumAMR: 3, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
    ],
    '2022-01-11 11:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 3, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
    ],
    '2022-01-11 12:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 3, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
    ],
    '2022-01-11 13:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 3, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
    ],
    '2022-01-11 14:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 3, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
    ],
    '2022-01-11 15:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 3, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
    ],
    '2022-01-11 16:00': [
      {
        cellId: 1,
        slightdeviation: 0, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 3, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 4, // 一般偏移
        seriousdeviation: 6, // 严重偏移
        errorcodeNum: 10, // 错码次数
        slightdeviationAMR: 2, //轻微偏移车数
        generaldeviationAMR: 20, // 一般偏移车数
        seriousdeviationAMR: 15, // 严重偏移车数
        dropoutNumAMR: 10, //丢码车数
        errorNumAMR: 3, //错码车数
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
        slightdeviationAMR: 10, //轻微偏移车数
        generaldeviationAMR: 10, // 一般偏移车数
        seriousdeviationAMR: 10, // 严重偏移车数
        dropoutNumAMR: 10, //丢码车数
        errorNumAMR: 10, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 4, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 4, // 严重偏移
        errorcodeNum: 1, // 错码次数
        slightdeviationAMR: 4, //轻微偏移车数
        generaldeviationAMR: 1, // 一般偏移车数
        seriousdeviationAMR: 4, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 4, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 6, //轻微偏移
        generaldeviation: 3, // 一般偏移
        seriousdeviation: 6, // 严重偏移
        errorcodeNum: 3, // 错码次数
        slightdeviationAMR: 6, //轻微偏移车数
        generaldeviationAMR: 3, // 一般偏移车数
        seriousdeviationAMR: 6, // 严重偏移车数
        dropoutNumAMR: 3, //丢码车数
        errorNumAMR: 6, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 1, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 1, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 0, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 0, // 严重偏移车数
        dropoutNumAMR: 2, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 0, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 0, //轻微偏移车数
        generaldeviationAMR: 0, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 0, //丢码车数
        errorNumAMR: 3, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 4, //轻微偏移
        generaldeviation: 4, // 一般偏移
        seriousdeviation: 4, // 严重偏移
        errorcodeNum: 4, // 错码次数
        slightdeviationAMR: 4, //轻微偏移车数
        generaldeviationAMR: 4, // 一般偏移车数
        seriousdeviationAMR: 4, // 严重偏移车数
        dropoutNumAMR: 4, //丢码车数
        errorNumAMR: 4, //错码车数
      },
    ],
    '2022-01-15 09:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 10, // 一般偏移
        seriousdeviation: 10, // 严重偏移
        errorcodeNum: 10, // 错码次数
        slightdeviationAMR: 10, //轻微偏移车数
        generaldeviationAMR: 10, // 一般偏移车数
        seriousdeviationAMR: 10, // 严重偏移车数
        dropoutNumAMR: 10, //丢码车数
        errorNumAMR: 10, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 4, //轻微偏移
        generaldeviation: 10, // 一般偏移
        seriousdeviation: 4, // 严重偏移
        errorcodeNum: 10, // 错码次数
        slightdeviationAMR: 4, //轻微偏移车数
        generaldeviationAMR: 10, // 一般偏移车数
        seriousdeviationAMR: 4, // 严重偏移车数
        dropoutNumAMR: 10, //丢码车数
        errorNumAMR: 4, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 6, //轻微偏移
        generaldeviation: 3, // 一般偏移
        seriousdeviation: 6, // 严重偏移
        errorcodeNum: 3, // 错码次数
        slightdeviationAMR: 6, //轻微偏移车数
        generaldeviationAMR: 3, // 一般偏移车数
        seriousdeviationAMR: 6, // 严重偏移车数
        dropoutNumAMR: 3, //丢码车数
        errorNumAMR: 6, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 10, // 严重偏移
        errorcodeNum: 1, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 1, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 0, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 0, // 严重偏移车数
        dropoutNumAMR: 2, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 0, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 0, //轻微偏移车数
        generaldeviationAMR: 0, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 0, //丢码车数
        errorNumAMR: 3, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 1, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 1, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 2, //丢码车数
        errorNumAMR: 4, //错码车数
      },
    ],
    '2022-01-15 10:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 10, // 一般偏移
        seriousdeviation: 10, // 严重偏移
        errorcodeNum: 10, // 错码次数
        slightdeviationAMR: 10, //轻微偏移车数
        generaldeviationAMR: 10, // 一般偏移车数
        seriousdeviationAMR: 10, // 严重偏移车数
        dropoutNumAMR: 10, //丢码车数
        errorNumAMR: 10, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 4, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 4, // 严重偏移
        errorcodeNum: 1, // 错码次数
        slightdeviationAMR: 4, //轻微偏移车数
        generaldeviationAMR: 1, // 一般偏移车数
        seriousdeviationAMR: 4, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 4, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 6, //轻微偏移
        generaldeviation: 3, // 一般偏移
        seriousdeviation: 6, // 严重偏移
        errorcodeNum: 3, // 错码次数
        slightdeviationAMR: 6, //轻微偏移车数
        generaldeviationAMR: 3, // 一般偏移车数
        seriousdeviationAMR: 6, // 严重偏移车数
        dropoutNumAMR: 3, //丢码车数
        errorNumAMR: 6, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 1, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 1, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 0, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 0, // 严重偏移车数
        dropoutNumAMR: 2, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 0, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 0, //轻微偏移车数
        generaldeviationAMR: 0, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 0, //丢码车数
        errorNumAMR: 3, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 4, //轻微偏移
        generaldeviation: 4, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 1, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 2, //丢码车数
        errorNumAMR: 4, //错码车数
      },
    ],
    '2022-01-15 11:00': [
      {
        cellId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 1, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 1, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 2,
        slightdeviation: 4, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 4, // 严重偏移
        errorcodeNum: 1, // 错码次数
        slightdeviationAMR: 4, //轻微偏移车数
        generaldeviationAMR: 1, // 一般偏移车数
        seriousdeviationAMR: 4, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 4, //错码车数
      },
      {
        cellId: 3,
        slightdeviation: 6, //轻微偏移
        generaldeviation: 3, // 一般偏移
        seriousdeviation: 6, // 严重偏移
        errorcodeNum: 3, // 错码次数
        slightdeviationAMR: 6, //轻微偏移车数
        generaldeviationAMR: 3, // 一般偏移车数
        seriousdeviationAMR: 6, // 严重偏移车数
        dropoutNumAMR: 3, //丢码车数
        errorNumAMR: 6, //错码车数
      },
      {
        cellId: 4,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 1, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 1, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 5,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 0, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 0, // 严重偏移车数
        dropoutNumAMR: 2, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 6,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 0, // 一般偏移
        seriousdeviation: 0, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 0, //轻微偏移车数
        generaldeviationAMR: 0, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 0, //丢码车数
        errorNumAMR: 3, //错码车数
      },
      {
        cellId: 7,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 2, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 1, //丢码车数
        errorNumAMR: 1, //错码车数
      },
      {
        cellId: 8,
        slightdeviation: 4, //轻微偏移
        generaldeviation: 4, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        errorcodeNum: 2, // 错码次数
        slightdeviationAMR: 1, //轻微偏移车数
        generaldeviationAMR: 1, // 一般偏移车数
        seriousdeviationAMR: 1, // 严重偏移车数
        dropoutNumAMR: 2, //丢码车数
        errorNumAMR: 4, //错码车数
      },
    ],
  };
}
