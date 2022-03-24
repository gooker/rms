import React, { memo, useState, useEffect } from 'react';
import { Row, Tag, DatePicker } from 'antd';
import moment from 'moment';
import { formatMessage, convertToUserTimezone, isStrictNull } from '@/utils/util';

const MomentRangeFormat = 'YYYY-MM-DD HH';
const { RangePicker } = DatePicker;
//本小时，上1小时，今天，昨天，本周，上周，本月，上月，最近三个月
const CustomData = {
  // currentHour: 'currentHour',
  lastHour: 'lastHour',
  today: 'today',
  yesterday: 'yesterday',
  currentWeek: 'currentWeek',
  lastWeek: 'lastWeek',
  currentMonth: 'currentMonth',
  lastMonth: 'lastMonth',
  lastthreeMonths: 'lastthreeMonths',
};
const CustomDay = [
  // {
  //   key: CustomData.currentHour,
  //   name: formatMessage({ id: 'reportCenter.currentHour' }),
  // },
  {
    key: CustomData.lastHour,
    name: formatMessage({ id: 'reportCenter.lastHour' }),
  },
  {
    key: CustomData.today,
    name: formatMessage({ id: 'reportCenter.today' }),
  },
  {
    key: CustomData.yesterday,
    name: formatMessage({ id: 'reportCenter.yesterday' }),
  },
  {
    key: CustomData.currentWeek,
    name: formatMessage({ id: 'reportCenter.currentWeek' }),
  },
  {
    key: CustomData.lastWeek,
    name: formatMessage({ id: 'reportCenter.lastWeek' }),
  },
  {
    key: CustomData.currentMonth,
    name: formatMessage({ id: 'reportCenter.currentMonth' }),
  },
  {
    key: CustomData.lastMonth,
    name: formatMessage({ id: 'reportCenter.lastMonth' }),
  },
  {
    key: CustomData.lastthreeMonths,
    name: formatMessage({ id: 'reportCenter.lastthreeMonths' }),
  },
];

const DatePickerSelector = (props) => {
  const { onChange } = props;
  const [dateValue, setDateValue] = useState(null);
  const [pickVisible, setPickVisible] = useState(false);

  useEffect(() => {
    // 默认进页面时间区间
    const defaultHour = moment().subtract(1, 'hours');
    const start = convertToUserTimezone(defaultHour).format('YYYY-MM-DD HH:00:00');
    const endTime = convertToUserTimezone(defaultHour).format('YYYY-MM-DD HH:59:59');
    setDateValue([moment(start), moment(endTime)]);
    onChange([moment(start), moment(endTime)]);
  }, []);

  function tagClick(ev) {
    const customDay = ev.target.dataset.value;
    if (!isStrictNull(customDay)) {
      const result = {};
      switch (customDay) {
        case CustomData.currentHour:
          //本小时
          const currentHour = moment();
          result.startTime = convertToUserTimezone(currentHour).format('YYYY-MM-DD HH:00:00');
          result.endTime = convertToUserTimezone(moment()).format('YYYY-MM-DD HH:mm:ss');
          break;
        case CustomData.lastHour:
          //上1小时
          const prevHour = moment().subtract(1, 'hours');
          result.startTime = convertToUserTimezone(prevHour).format('YYYY-MM-DD HH:00:00');
          result.endTime = convertToUserTimezone(prevHour).format('YYYY-MM-DD HH:59:59');
          break;
        case CustomData.today:
          //今天
          const currentDay = moment();
          result.startTime = convertToUserTimezone(currentDay).format('YYYY-MM-DD 00:00:00');
          result.endTime = convertToUserTimezone(currentDay).format('YYYY-MM-DD HH:mm:ss');
          break;
        case CustomData.yesterday:
          //昨天
          const prevDay = moment().subtract(1, 'days');
          result.startTime = convertToUserTimezone(prevDay).format('YYYY-MM-DD 00:00:00');
          result.endTime = convertToUserTimezone(prevDay).format('YYYY-MM-DD 23:59:59');
          break;
        case CustomData.currentWeek:
          //本周
          //startOf('week')-一周指的是周日-周六
          //startOf('isoWeek')-一周指的是周一-周日
          const start = moment().week(moment().week()).startOf('isoWeek'); // 周一日期
          const end = moment().week(moment().week()).endOf('isoWeek'); // 周日日期
          result.startTime = convertToUserTimezone(start).format('YYYY-MM-DD 00:00:00');
          result.endTime = convertToUserTimezone(end).format('YYYY-MM-DD 23:59:59');
          break;
        case CustomData.lastWeek:
          //上周
          const prevWeekStart = moment()
            .week(moment().week() - 1)
            .startOf('isoWeek');
          const endWeekStart = moment()
            .week(moment().week() - 1)
            .endOf('isoWeek');
          result.startTime = convertToUserTimezone(prevWeekStart).format('YYYY-MM-DD 00:00:00');
          result.endTime = convertToUserTimezone(endWeekStart).format('YYYY-MM-DD 23:59:59');
          break;
        case CustomData.currentMonth:
          //本月
          const monthStart = moment().month(moment().month()).startOf('month');
          const monthEnd = moment().month(moment().month()).endOf('month');
          result.startTime = convertToUserTimezone(monthStart).format('YYYY-MM-DD HH:mm:00');
          result.endTime = convertToUserTimezone(monthEnd).format('YYYY-MM-DD HH:mm:ss');
          break;
        case CustomData.lastMonth:
          //上月
          const prevMonthStart = moment()
            .month(moment().month() - 1)
            .startOf('month');
          const prevMonthEnd = moment()
            .month(moment().month() - 1)
            .endOf('month');
          result.startTime = convertToUserTimezone(prevMonthStart).format('YYYY-MM-DD HH:mm:00');
          result.endTime = convertToUserTimezone(prevMonthEnd).format('YYYY-MM-DD HH:mm:ss');
          break;
        case CustomData.lastthreeMonths:
          //最近三个月
          const lastMonthStart = moment()
            .month(moment().month() - 2)
            .startOf('month');
          const lastMonthEnd = moment(); //moment().month(moment().month()).endOf('month');
          result.startTime = convertToUserTimezone(lastMonthStart).format('YYYY-MM-DD HH:mm:00');
          result.endTime = convertToUserTimezone(lastMonthEnd).format('YYYY-MM-DD HH:mm:ss');
          break;
        default:
          // const defaultHour = moment();
          const defaultHour = moment().subtract(1, 'hours');
          result.startTime = convertToUserTimezone(defaultHour).format('YYYY-MM-DD HH:00:00');
          result.endTime = convertToUserTimezone(moment()).format('YYYY-MM-DD HH:mm:ss');
          break;
      }
      setPickVisible(false);

      setDateValue([moment(result.startTime), moment(result.endTime)]);
      onChange([moment(result.startTime), moment(result.endTime)]);
    }
  }

  function dataRangePickerChanged(value, dateString) {
    setDateValue(value);
    onChange(value);
  }

  return (
    <Row gutter={8}>
      <RangePicker
        value={dateValue}
        style={{ width: '100%' }}
        showTime={{ format: 'HH' }}
        format={MomentRangeFormat}
        open={pickVisible}
        onOpenChange={(status) => {
          setPickVisible(status);
        }}
        onChange={dataRangePickerChanged}
        renderExtraFooter={() => {
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'start',
                padding: '5px 0',
                flexFlow: 'row wrap',
              }}
            >
              {CustomDay?.map(({ key, name }) => (
                <>
                  <Tag
                    color="blue"
                    size="small"
                    key={key}
                    data-value={key}
                    onClick={tagClick}
                    style={{ cursor: 'pointer', margin: 5 }}
                  >
                    {name}
                  </Tag>
                </>
              ))}
            </div>
          );
        }}
      />
    </Row>
  );
};
export default memo(DatePickerSelector);
