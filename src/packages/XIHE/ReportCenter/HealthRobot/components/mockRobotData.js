export function getScanCodedata() {
  // 1.按照小时来
  // 2.按码号-是从每个日期里找到该key求和
  // mockdate 过去5小时 1-7号车

  // tip: 数据一定要排序 外层日期要排序 里面cellId也要排序
  return {
    '2022-01-15 12:00': [
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
    '2022-01-15 13:00': [
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
    '2022-01-15 14:00': [
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
    '2022-01-15 15:00': [
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
    '2022-01-15 16:00': [
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
  };
}

// 小车离线次数 时常
export function getRobotOfflinedata() {
  return {
    '2022-01-15 12:00': [
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
    '2022-01-15 13:00': [
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
    '2022-01-15 14:00': [
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
    '2022-01-15 15:00': [
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
    '2022-01-15 16:00': [
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
        offlineTimes: 1,
        offlinetime: 1,
      },
    ],
  };
}
