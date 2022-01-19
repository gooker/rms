export function getScanCodedata() {
  // 1.按照小时来
  // 2.按码号-是从每个日期里找到该key求和
  // mockdate 过去7小时 1-7号车

  // tip: 数据一定要排序 外层日期要排序 里面cellId也要排序
  return {
    '2022-01-19 12:00': [
      {
        robotId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 2,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 0, //丢码次数
        errorcodeNum: 0, // 错码次数
        deviatiocode: 0, // 偏移码数
        dropoutcode: 0, //丢码码数，错码码数
        errorcode: 0, //错码码数
      },
      {
        robotId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 1, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 3, //丢码码数，错码码数
        errorcode: 3, //错码码数
      },
      {
        robotId: 4,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 2, // 错码次数
        deviatiocode: 2, // 偏移码数
        dropoutcode: 2, //丢码码数，错码码数
        errorcode: 2, //错码码数
      },
      {
        robotId: 5,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 6,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 7,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
    ],
    '2022-01-19 13:00': [
      {
        robotId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 2,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 0, //丢码次数
        errorcodeNum: 0, // 错码次数
        deviatiocode: 0, // 偏移码数
        dropoutcode: 0, //丢码码数，错码码数
        errorcode: 0, //错码码数
      },
      {
        robotId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 1, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 3, //丢码码数，错码码数
        errorcode: 3, //错码码数
      },
      {
        robotId: 4,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 2, // 错码次数
        deviatiocode: 2, // 偏移码数
        dropoutcode: 2, //丢码码数，错码码数
        errorcode: 2, //错码码数
      },
      {
        robotId: 5,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 6,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 7,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
    ],
    '2022-01-19 14:00': [
      {
        robotId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 1, // 偏移码数
        dropoutcode: 1, //丢码码数，
        errorcode: 1, //错码码数
      },
      {
        robotId: 2,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        deviatiocode: 2, // 偏移码数
        dropoutcode: 0, //丢码码数，错码码数
        errorcode: 2, //错码码数
      },
      {
        robotId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 1, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 3, //丢码码数，错码码数
        errorcode: 3, //错码码数
      },
      {
        robotId: 4,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 2, // 错码次数
        deviatiocode: 2, // 偏移码数
        dropoutcode: 2, //丢码码数，错码码数
        errorcode: 2, //错码码数
      },
      {
        robotId: 5,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 5, // 偏移码数
        dropoutcode: 5, //丢码码数，错码码数
        errorcode: 5, //错码码数
      },
      {
        robotId: 6,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 7,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
    ],
    '2022-01-19 15:00': [
      {
        robotId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 2,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 0, //丢码次数
        errorcodeNum: 0, // 错码次数
        deviatiocode: 0, // 偏移码数
        dropoutcode: 0, //丢码码数，错码码数
        errorcode: 0, //错码码数
      },
      {
        robotId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 1, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 3, //丢码码数，错码码数
        errorcode: 3, //错码码数
      },
      {
        robotId: 4,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 2, // 错码次数
        deviatiocode: 2, // 偏移码数
        dropoutcode: 2, //丢码码数，错码码数
        errorcode: 2, //错码码数
      },
      {
        robotId: 5,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 6,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 7,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
    ],
    '2022-01-19 16:00': [
      {
        robotId: 1,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 1, // 一般偏移
        seriousdeviation: 1, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 1, // 错码次数
        deviatiocode: 1, // 偏移码数
        dropoutcode: 1, //丢码码数，错码码数
        errorcode: 1, //错码码数
      },
      {
        robotId: 2,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 0, //丢码次数
        errorcodeNum: 0, // 错码次数
        deviatiocode: 0, // 偏移码数
        dropoutcode: 0, //丢码码数，错码码数
        errorcode: 0, //错码码数
      },
      {
        robotId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 0, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 1, // 错码次数
        deviatiocode: 0, // 偏移码数
        dropoutcode: 3, //丢码码数，错码码数
        errorcode: 1, //错码码数
      },
      {
        robotId: 4,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 2, // 错码次数
        deviatiocode: 2, // 偏移码数
        dropoutcode: 2, //丢码码数，错码码数
        errorcode: 2, //错码码数
      },
      {
        robotId: 5,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 6,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 10, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 7,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        deviatiocode: 2, // 偏移码数
        dropoutcode: 2, //丢码码数，错码码数
        errorcode: 2, //错码码数
      },
    ],
    '2022-01-19 17:00': [
      {
        robotId: 1,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 1, // 错码次数
        deviatiocode: 2, // 偏移码数
        dropoutcode: 1, //丢码码数，错码码数
        errorcode: 2, //错码码数
      },
      {
        robotId: 2,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 0, //丢码次数
        errorcodeNum: 0, // 错码次数
        deviatiocode: 20, // 偏移码数
        dropoutcode: 0, //丢码码数，错码码数
        errorcode: 0, //错码码数
      },
      {
        robotId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 0, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 1, // 错码次数
        deviatiocode: 0, // 偏移码数
        dropoutcode: 3, //丢码码数，错码码数
        errorcode: 1, //错码码数
      },
      {
        robotId: 4,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 2, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 2, //丢码码数，错码码数
        errorcode: 2, //错码码数
      },
      {
        robotId: 5,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 1, // 偏移码数
        dropoutcode: 1, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 6,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 1, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 7,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        deviatiocode: 2, // 偏移码数
        dropoutcode: 20, //丢码码数，错码码数
        errorcode: 2, //错码码数
      },
    ],
    '2022-01-19 17:00': [
      {
        robotId: 1,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 1, // 错码次数
        deviatiocode: 2, // 偏移码数
        dropoutcode: 1, //丢码码数，错码码数
        errorcode: 2, //错码码数
      },
      {
        robotId: 2,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 0, //丢码次数
        errorcodeNum: 0, // 错码次数
        deviatiocode: 20, // 偏移码数
        dropoutcode: 0, //丢码码数，错码码数
        errorcode: 0, //错码码数
      },
      {
        robotId: 3,
        slightdeviation: 3, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 0, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 1, // 错码次数
        deviatiocode: 0, // 偏移码数
        dropoutcode: 3, //丢码码数，错码码数
        errorcode: 1, //错码码数
      },
      {
        robotId: 4,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 2, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 2, //丢码码数，错码码数
        errorcode: 2, //错码码数
      },
      {
        robotId: 5,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 1, // 偏移码数
        dropoutcode: 1, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 6,
        slightdeviation: 1, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 3, // 严重偏移
        throwcodeNum: 1, //丢码次数
        errorcodeNum: 5, // 错码次数
        deviatiocode: 10, // 偏移码数
        dropoutcode: 1, //丢码码数，错码码数
        errorcode: 10, //错码码数
      },
      {
        robotId: 7,
        slightdeviation: 2, //轻微偏移
        generaldeviation: 2, // 一般偏移
        seriousdeviation: 2, // 严重偏移
        throwcodeNum: 2, //丢码次数
        errorcodeNum: 2, // 错码次数
        deviatiocode: 2, // 偏移码数
        dropoutcode: 20, //丢码码数，错码码数
        errorcode: 2, //错码码数
      },
    ],
  };
}

// 小车离线次数 时长
export function getRobotOfflinedata() {
  return {
    '2022-01-19 12:00': [
      {
        robotId: 1,
        offlineTimes: 2,
        offlinetime: 50,
      },
      {
        robotId: 2,
        offlineTimes: 0,
        offlinetime: 0,
      },
      {
        robotId: 3,
        offlineTimes: 1,
        offlinetime: 5,
      },
      {
        robotId: 4,
        offlineTimes: 3,
        offlinetime: 30,
      },
      {
        robotId: 5,
        offlineTimes: 1,
        offlinetime: 2,
      },
      {
        robotId: 6,
        offlineTimes: 4,
        offlinetime: 10,
      },
      {
        robotId: 7,
        offlineTimes: 0,
        offlinetime: 0,
      },
    ],
    '2022-01-19 13:00': [
      {
        robotId: 1,
        offlineTimes: 0,
        offlinetime: 0,
      },
      {
        robotId: 2,
        offlineTimes: 0,
        offlinetime: 0,
      },
      {
        robotId: 3,
        offlineTimes: 1,
        offlinetime: 5,
      },
      {
        robotId: 4,
        offlineTimes: 3,
        offlinetime: 30,
      },
      {
        robotId: 5,
        offlineTimes: 2,
        offlinetime: 4,
      },
      {
        robotId: 6,
        offlineTimes: 4,
        offlinetime: 4,
      },
      {
        robotId: 7,
        offlineTimes: 2,
        offlinetime: 4,
      },
    ],
    '2022-01-19 14:00': [
      {
        robotId: 1,
        offlineTimes: 2,
        offlinetime: 50,
      },
      {
        robotId: 2,
        offlineTimes: 0,
        offlinetime: 0,
      },
      {
        robotId: 3,
        offlineTimes: 1,
        offlinetime: 5,
      },
      {
        robotId: 4,
        offlineTimes: 3,
        offlinetime: 30,
      },
      {
        robotId: 5,
        offlineTimes: 1,
        offlinetime: 2,
      },
      {
        robotId: 6,
        offlineTimes: 4,
        offlinetime: 10,
      },
      {
        robotId: 7,
        offlineTimes: 0,
        offlinetime: 0,
      },
    ],
    '2022-01-19 15:00': [
      {
        robotId: 1,
        offlineTimes: 2,
        offlinetime: 50,
      },
      {
        robotId: 2,
        offlineTimes: 0,
        offlinetime: 0,
      },
      {
        robotId: 3,
        offlineTimes: 1,
        offlinetime: 5,
      },
      {
        robotId: 4,
        offlineTimes: 3,
        offlinetime: 30,
      },
      {
        robotId: 5,
        offlineTimes: 1,
        offlinetime: 2,
      },
      {
        robotId: 6,
        offlineTimes: 4,
        offlinetime: 10,
      },
      {
        robotId: 7,
        offlineTimes: 0,
        offlinetime: 0,
      },
    ],
    '2022-01-19 16:00': [
      {
        robotId: 1,
        offlineTimes: 1,
        offlinetime: 10,
      },
      {
        robotId: 2,
        offlineTimes: 10,
        offlinetime: 30,
      },
      {
        robotId: 3,
        offlineTimes: 0,
        offlinetime: 0,
      },
      {
        robotId: 4,
        offlineTimes: 3,
        offlinetime: 30,
      },
      {
        robotId: 5,
        offlineTimes: 2,
        offlinetime: 4,
      },
      {
        robotId: 6,
        offlineTimes: 4,
        offlinetime: 10,
      },
      {
        robotId: 7,
        offlineTimes: 1, // 次数
        offlinetime: 1, //时长
      },
    ],
    '2022-01-19 17:00': [
      {
        robotId: 1,
        offlineTimes: 1,
        offlinetime: 1,
      },
      {
        robotId: 2,
        offlineTimes: 10,
        offlinetime: 3,
      },
      {
        robotId: 3,
        offlineTimes: 0,
        offlinetime: 20,
      },
      {
        robotId: 4,
        offlineTimes: 3,
        offlinetime: 30,
      },
      {
        robotId: 5,
        offlineTimes: 2,
        offlinetime: 4,
      },
      {
        robotId: 6,
        offlineTimes: 4,
        offlinetime: 1,
      },
      {
        robotId: 7,
        offlineTimes: 1, // 次数
        offlinetime: 8, //时长
      },
    ],
    '2022-01-19 18:00': [
      {
        robotId: 1,
        offlineTimes: 1,
        offlinetime: 1,
      },
      {
        robotId: 2,
        offlineTimes: 10,
        offlinetime: 3,
      },
      {
        robotId: 3,
        offlineTimes: 0,
        offlinetime: 20,
      },
      {
        robotId: 4,
        offlineTimes: 3,
        offlinetime: 30,
      },
      {
        robotId: 5,
        offlineTimes: 2,
        offlinetime: 4,
      },
      {
        robotId: 6,
        offlineTimes: 4,
        offlinetime: 1,
      },
      {
        robotId: 7,
        offlineTimes: 1, // 次数
        offlinetime: 8, //时长
      },
    ],
  };
}

// 小车状态错误次数 时长
export function getRobotStatuserrordata() {
  return {
    '2022-01-19 12:00': [
      {
        robotId: 7,
        errorTimes: 2,
        errortime: 4,
      },
      {
        robotId: 2,
        errorTimes: 0,
        errortime: 0,
      },
      {
        robotId: 3,
        errorTimes: 6,
        errortime: 10,
      },
      {
        robotId: 5,
        errorTimes: 1,
        errortime: 1,
      },
      {
        robotId: 1,
        errorTimes: 2,
        errortime: 2,
      },
      {
        robotId: 6,
        errorTimes: 0,
        errortime: 0,
      },
      {
        robotId: 4,
        errorTimes: 1,
        errortime: 1,
      },
    ],
    '2022-01-19 13:00': [
      {
        robotId: 1,
        errorTimes: 2,
        errortime: 4,
      },
      {
        robotId: 2,
        errorTimes: 0,
        errortime: 0,
      },
      {
        robotId: 3,
        errorTimes: 6,
        errortime: 10,
      },
      {
        robotId: 4,
        errorTimes: 1,
        errortime: 1,
      },
      {
        robotId: 5,
        errorTimes: 2,
        errortime: 6,
      },
      {
        robotId: 6,
        errorTimes: 0,
        errortime: 0,
      },
      {
        robotId: 7,
        errorTimes: 1,
        errortime: 1,
      },
    ],
    '2022-01-19 14:00': [
      {
        robotId: 1,
        errorTimes: 2,
        errortime: 4,
      },
      {
        robotId: 2,
        errorTimes: 0,
        errortime: 0,
      },
      {
        robotId: 3,
        errorTimes: 6,
        errortime: 10,
      },
      {
        robotId: 4,
        errorTimes: 1,
        errortime: 1,
      },
      {
        robotId: 5,
        errorTimes: 2,
        errortime: 6,
      },
      {
        robotId: 6,
        errorTimes: 50,
        errortime: 50,
      },
      {
        robotId: 7,
        errorTimes: 1,
        errortime: 1,
      },
    ],
    '2022-01-19 15:00': [
      {
        robotId: 1,
        errorTimes: 2,
        errortime: 4,
      },
      {
        robotId: 2,
        errorTimes: 0,
        errortime: 0,
      },
      {
        robotId: 3,
        errorTimes: 6,
        errortime: 10,
      },
      {
        robotId: 4,
        errorTimes: 1,
        errortime: 1,
      },
      {
        robotId: 5,
        errorTimes: 2,
        errortime: 6,
      },
      {
        robotId: 6,
        errorTimes: 0,
        errortime: 0,
      },
      {
        robotId: 7,
        errorTimes: 1,
        errortime: 1,
      },
    ],
    '2022-01-19 16:00': [
      {
        robotId: 1,
        errorTimes: 2,
        errortime: 4,
      },
      {
        robotId: 5,
        errorTimes: 0,
        errortime: 0,
      },
      {
        robotId: 3,
        errorTimes: 6,
        errortime: 10,
      },
      {
        robotId: 4,
        errorTimes: 1,
        errortime: 1,
      },
      {
        robotId: 2,
        errorTimes: 2,
        errortime: 6,
      },
      {
        robotId: 6,
        errorTimes: 0,
        errortime: 0,
      },
      {
        robotId: 7,
        errorTimes: 1,
        errortime: 1,
      },
    ],
    '2022-01-19 17:00': [
      {
        robotId: 1,
        errorTimes: 20,
        errortime: 8,
      },
      {
        robotId: 2,
        errorTimes: 4,
        errortime: 4,
      },
      {
        robotId: 7,
        errorTimes: 0,
        errortime: 0,
      },
      {
        robotId: 4,
        errorTimes: 1,
        errortime: 1,
      },
      {
        robotId: 5,
        errorTimes: 2,
        errortime: 6,
      },
      {
        robotId: 6,
        errorTimes: 10,
        errortime: 10,
      },
      {
        robotId: 3,
        errorTimes: 10,
        errortime: 10,
      },
    ],
    '2022-01-19 18:00': [
      {
        robotId: 1,
        errorTimes: 20,
        errortime: 8,
      },
      {
        robotId: 2,
        errorTimes: 4,
        errortime: 4,
      },
      {
        robotId: 7,
        errorTimes: 0,
        errortime: 0,
      },
      {
        robotId: 4,
        errorTimes: 1,
        errortime: 1,
      },
      {
        robotId: 5,
        errorTimes: 2,
        errortime: 6,
      },
      {
        robotId: 6,
        errorTimes: 10,
        errortime: 10,
      },
      {
        robotId: 3,
        errorTimes: 10,
        errortime: 10,
      },
    ],
  };
}

// 小车故障 4001 4002 2021等

export function getRobotFaultdata() {
  return {
    '2022-01-19 12:00': [
      {
        robotId: 1,
        4001: 2,
        4002: 3,
        2021: 11,
        4003: 0,
        5001: 2,
        5002: 1,
        5003: 2,
      },
      {
        robotId: 2,
        4001: 1,
        4002: 1,
        2021: 1,
        4003: 1,
        5001: 1,
        5002: 1,
        5003: 1,
      },
      {
        robotId: 3,
        4001: 2,
        4002: 2,
        2021: 2,
        4003: 2,
        5001: 2,
        5002: 2,
        5003: 2,
      },
      {
        robotId: 4,
        4001: 1,
        4002: 2,
        2021: 3,
        4003: 0,
        5001: 0,
        5002: 1,
        5003: 2,
      },
      {
        robotId: 5,
        4001: 1,
        4002: 1,
        2021: 1,
        4003: 1,
        5001: 2,
        5002: 1,
        5003: 0,
      },
      {
        robotId: 6,
        4001: 2,
        4002: 3,
        2021: 4,
        4003: 2,
        5001: 1,
        5002: 1,
        5003: 1,
      },
      {
        robotId: 7,
        4001: 10,
        4002: 2,
        2021: 0,
        4003: 4,
        5001: 3,
        5002: 3,
        5003: 1,
      },
    ],
    '2022-01-19 13:00': [
      {
        robotId: 1,
        4001: 2,
        4002: 3,
        2021: 11,
        4003: 0,
        5001: 2,
        5002: 1,
        5003: 2,
      },
      {
        robotId: 2,
        4001: 1,
        4002: 1,
        2021: 1,
        4003: 1,
        5001: 1,
        5002: 1,
        5003: 1,
      },
      {
        robotId: 3,
        4001: 2,
        4002: 2,
        2021: 2,
        4003: 2,
        5001: 2,
        5002: 2,
        5003: 2,
      },
      {
        robotId: 4,
        4001: 1,
        4002: 2,
        2021: 3,
        4003: 0,
        5001: 0,
        5002: 1,
        5003: 2,
      },
      {
        robotId: 5,
        4001: 1,
        4002: 1,
        2021: 1,
        4003: 1,
        5001: 2,
        5002: 1,
        5003: 0,
      },
      {
        robotId: 6,
        4001: 2,
        4002: 3,
        2021: 4,
        4003: 2,
        5001: 1,
        5002: 1,
        5003: 1,
      },
      {
        robotId: 7,
        4001: 10,
        4002: 2,
        2021: 0,
        4003: 4,
        5001: 3,
        5002: 3,
        5003: 1,
      },
    ],
    '2022-01-19 14:00': [
      {
        robotId: 1,
        4001: 2,
        4002: 3,
        2021: 11,
        4003: 0,
        5001: 2,
        5002: 1,
        5003: 2,
      },
      {
        robotId: 2,
        4001: 1,
        4002: 1,
        2021: 1,
        4003: 1,
        5001: 1,
        5002: 1,
        5003: 1,
      },
      {
        robotId: 3,
        4001: 2,
        4002: 2,
        2021: 2,
        4003: 2,
        5001: 2,
        5002: 2,
        5003: 2,
      },
      {
        robotId: 4,
        4001: 1,
        4002: 2,
        2021: 3,
        4003: 0,
        5001: 0,
        5002: 1,
        5003: 2,
      },
      {
        robotId: 5,
        4001: 1,
        4002: 1,
        2021: 1,
        4003: 1,
        5001: 2,
        5002: 1,
        5003: 0,
      },
      {
        robotId: 6,
        4001: 2,
        4002: 3,
        2021: 4,
        4003: 2,
        5001: 1,
        5002: 1,
        5003: 1,
      },
      {
        robotId: 7,
        4001: 10,
        4002: 2,
        2021: 0,
        4003: 4,
        5001: 3,
        5002: 3,
        5003: 1,
      },
    ],
    '2022-01-19 15:00': [
      {
        robotId: 1,
        4001: 2,
        4002: 3,
        2021: 11,
        4003: 0,
        5001: 2,
        5002: 1,
        5003: 2,
      },
      {
        robotId: 2,
        4001: 1,
        4002: 1,
        2021: 1,
        4003: 1,
        5001: 1,
        5002: 1,
        5003: 1,
      },
      {
        robotId: 3,
        4001: 2,
        4002: 2,
        2021: 2,
        4003: 2,
        5001: 2,
        5002: 2,
        5003: 2,
      },
      {
        robotId: 4,
        4001: 1,
        4002: 2,
        2021: 3,
        4003: 0,
        5001: 0,
        5002: 1,
        5003: 2,
      },
      {
        robotId: 5,
        4001: 1,
        4002: 1,
        2021: 1,
        4003: 1,
        5001: 2,
        5002: 1,
        5003: 0,
      },
      {
        robotId: 6,
        4001: 2,
        4002: 3,
        2021: 4,
        4003: 2,
        5001: 1,
        5002: 1,
        5003: 1,
      },
      {
        robotId: 7,
        4001: 10,
        4002: 2,
        2021: 0,
        4003: 4,
        5001: 3,
        5002: 3,
        5003: 1,
      },
    ],
    '2022-01-19 16:00': [
      {
        robotId: 1,
        4001: 2,
        4002: 3,
        2021: 11,
        4003: 0,
        5001: 2,
        5002: 1,
        5003: 2,
      },
      {
        robotId: 2,
        4001: 1,
        4002: 1,
        2021: 1,
        4003: 1,
        5001: 1,
        5002: 1,
        5003: 1,
      },
      {
        robotId: 3,
        4001: 2,
        4002: 2,
        2021: 2,
        4003: 2,
        5001: 2,
        5002: 2,
        5003: 2,
      },
      {
        robotId: 4,
        4001: 1,
        4002: 2,
        2021: 3,
        4003: 0,
        5001: 0,
        5002: 1,
        5003: 2,
      },
      {
        robotId: 5,
        4001: 1,
        4002: 1,
        2021: 1,
        4003: 1,
        5001: 2,
        5002: 1,
        5003: 0,
      },
      {
        robotId: 6,
        4001: 2,
        4002: 3,
        2021: 4,
        4003: 2,
        5001: 1,
        5002: 1,
        5003: 1,
      },
      {
        robotId: 7,
        4001: 10,
        4002: 2,
        2021: 0,
        4003: 4,
        5001: 3,
        5002: 3,
        5003: 1,
      },
    ],
    '2022-01-19 17:00': [
      {
        robotId: 1,
        4001: 2,
        4002: 3,
        2021: 11,
        4003: 0,
        5001: 2,
        5002: 1,
        5003: 2,
      },
      {
        robotId: 2,
        4001: 1,
        4002: 1,
        2021: 1,
        4003: 1,
        5001: 1,
        5002: 1,
        5003: 1,
      },
      {
        robotId: 3,
        4001: 2,
        4002: 2,
        2021: 2,
        4003: 2,
        5001: 2,
        5002: 2,
        5003: 2,
      },
      {
        robotId: 4,
        4001: 1,
        4002: 2,
        2021: 3,
        4003: 0,
        5001: 0,
        5002: 1,
        5003: 2,
      },
      {
        robotId: 5,
        4001: 1,
        4002: 1,
        2021: 1,
        4003: 1,
        5001: 2,
        5002: 1,
        5003: 0,
      },
      {
        robotId: 6,
        4001: 2,
        4002: 3,
        2021: 4,
        4003: 2,
        5001: 1,
        5002: 1,
        5003: 1,
      },
      {
        robotId: 7,
        4001: 10,
        4002: 2,
        2021: 0,
        4003: 4,
        5001: 3,
        5002: 3,
        5003: 1,
      },
    ],
    '2022-01-19 18:00': [
      {
        robotId: 1,
        4001: 2,
        4002: 3,
        2021: 11,
        4003: 0,
        5001: 2,
        5002: 1,
        5003: 2,
      },
      {
        robotId: 2,
        4001: 1,
        4002: 1,
        2021: 1,
        4003: 1,
        5001: 1,
        5002: 1,
        5003: 1,
      },
      {
        robotId: 3,
        4001: 2,
        4002: 2,
        2021: 2,
        4003: 2,
        5001: 2,
        5002: 2,
        5003: 2,
      },
      {
        robotId: 4,
        4001: 1,
        4002: 2,
        2021: 3,
        4003: 0,
        5001: 0,
        5002: 1,
        5003: 2,
      },
      {
        robotId: 5,
        4001: 1,
        4002: 1,
        2021: 1,
        4003: 1,
        5001: 2,
        5002: 1,
        5003: 0,
      },
      {
        robotId: 6,
        4001: 2,
        4002: 3,
        2021: 4,
        4003: 2,
        5001: 1,
        5002: 1,
        5003: 1,
      },
      {
        robotId: 7,
        4001: 10,
        4002: 2,
        2021: 0,
        4003: 4,
        5001: 3,
        5002: 3,
        5003: 1,
      },
    ],
  };
}
