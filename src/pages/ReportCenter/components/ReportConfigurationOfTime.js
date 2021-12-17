import React, { memo } from 'react';
import { Col, Row, InputNumber, Select } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { Colors } from '@/config/consts';

const ReportConfigurationOfTime = (props) => {
  const { value, onChange } = props;

  function onFieldChange(fieldType, fieldValue) {
    const _value = { ...value };
    _value[fieldType] = fieldValue;
    onChange(_value);
  }

  return (
    <Row>
      <Col style={{ marginRight: 10, lineHeight: '32px', color: Colors.blue, fontWeight: 600 }}>
        <FormattedMessage id={'app.reportCenter.recently'} />
      </Col>
      <Col span={6}>
        <InputNumber
          min={1}
          value={value.number}
          onChange={(_value) => {
            onFieldChange('number', _value);
          }}
        />
      </Col>
      <Col span={4}>
        <Select
          value={value.dateType}
          onChange={(_value) => {
            onFieldChange('dateType', _value);
          }}
        >
          <Select.Option value="hour">
            <FormattedMessage id="app.time.hours" />
          </Select.Option>
          <Select.Option value="day">
            <FormattedMessage id="app.time.day" />
          </Select.Option>
          <Select.Option value="month">
            <FormattedMessage id="app.time.month" />
          </Select.Option>
        </Select>
      </Col>
    </Row>
  );
};
export default memo(ReportConfigurationOfTime);
