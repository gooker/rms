import React, { memo, useState, useEffect } from 'react';
import { Input, Select, AutoComplete, Row, Col, Button } from 'antd';
import moment from 'moment';
import { GMT2UserTimeZone, isStrictNull } from '@/utils/utils';

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:00:00';
const daysList = [1, 3, 7];

const TimePickerSelector = (props) => {
  const { onChange, defaultFlag } = props;
  const [dateValue, setDateValue] = useState(defaultFlag ? 1 : null);
  const [rangeTime, setRangeTime] = useState([{ value: 1 }, { value: 3 }, { value: 7 }]);
  const [dateType, setDateType] = useState('days');

  useEffect(() => {
    // 默认进页面类型是"天" "1"
    const _time = moment().subtract(1, 'days');
    const formValues = {
      startTime: defaultFlag ? GMT2UserTimeZone(_time).format('YYYY-MM-DD HH:00:00') : null,
      endTime: defaultFlag ? GMT2UserTimeZone(moment()).format('YYYY-MM-DD HH:00:00') : null,
      timeDate: defaultFlag ? 1 : null,
      dateType: 'days',
    };
    onChange(formValues);
  }, []);

  useEffect(() => {
    // 默认进页面类型是"天" "1"- 如果
    let num = dateValue;
    if (isStrictNull(num) && defaultFlag) {
      num = 1;
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
        {/* <Input value="过去" readOnly bordered={false} style={{ width: 60 }} /> */}
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
          <Select value={dateType} onChange={timeTypeChange} style={{ width: 90 }}>
            <Option value="days">天</Option>
            <Option value="hour">小时</Option>
          </Select>
        </Input.Group>
      </Col>
    </Row>
  );
};
export default memo(TimePickerSelector);
