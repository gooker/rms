import React, { memo, useState, useEffect } from 'react';
import { Input, Select, AutoComplete, Row, Col, Button } from 'antd';
import moment from 'moment';
import { GMT2UserTimeZone, isStrictNull } from '@/utils/utils';

const { Option } = Select;
// const dateFormat = 'YYYY-MM-DD HH:00:00';

const TimePickerSelector = (props) => {
  const { onChange, defaultType, defaultTime, disabledChangeType } = props;
  const [dateValue, setDateValue] = useState(null);
  const [rangeTime, setRangeTime] = useState([]);
  const [dateType, setDateType] = useState(null);

  useEffect(() => {
    // 默认进页面类型
    const _type = defaultType || 'days';
    let defaultRangeTime = [{ value: 1 }, { value: 3 }, { value: 7 }];
    if (_type === 'hour') {
      defaultRangeTime = [{ value: 1 }, { value: 8 }, { value: 12 }];
    }

    setDateValue(defaultTime);
    setDateType(_type);
    setRangeTime(defaultRangeTime);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 默认进页面类型是"天" "1"- 如果
    let num = dateValue;
    if (isStrictNull(num) && !isStrictNull(defaultTime)) {
      num = defaultTime;
      setDateValue(num);
    }
    const _time = moment().subtract(num, dateType);
    const formValues = {
      startTime: num ? GMT2UserTimeZone(_time).format('YYYY-MM-DD HH:00:00') : null,
      endTime: num ? GMT2UserTimeZone(moment()).format('YYYY-MM-DD HH:00:00') : null,
      timeDate: num,
      dateType,
    };
    onChange(formValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateType]);

  // 时间段类型
  function timeTypeChange(t) {
    if (t === 'hour') {
      setRangeTime([{ value: 1 }, { value: 8 }, { value: 12 }]);
    } else {
      setRangeTime([{ value: 1 }, { value: 3 }, { value: 7 }]);
    }
    setDateType(t);
  }

  // 输入框数字
  function inputChanged(ev) {
    let currentValue = ev;
    if (!isStrictNull(currentValue)) {
      const _currentValue = parseFloat(currentValue);
      setDateValue(_currentValue);

      const _value = moment().subtract(currentValue, dateType);
      const formValues = {
        startTime: GMT2UserTimeZone(_value).format('YYYY-MM-DD HH:00:00'),
        endTime: GMT2UserTimeZone(moment()).format('YYYY-MM-DD HH:00:00'),
        timeDate: _currentValue,
        dateType,
      };
      onChange(formValues);
    } else {
      setDateValue(null);
      onChange({});
    }
  }

  return (
    <Row gutter={8}>
      <Col>
        <Button type="link"> 过去</Button>
      </Col>
      <Col>
        <Input.Group compact>
          <AutoComplete
            allowClear
            style={{
              width: 130,
            }}
            value={dateValue}
            options={rangeTime}
            onChange={inputChanged}
          />
          <Select
            value={dateType}
            onChange={timeTypeChange}
            style={{ width: 90 }}
            disabled={disabledChangeType || false}
          >
            <Option value="days">天</Option>
            <Option value="hour">小时</Option>
          </Select>
        </Input.Group>
      </Col>
    </Row>
  );
};
export default memo(TimePickerSelector);
