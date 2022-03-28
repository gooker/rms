import React, { memo } from 'react';
import { Form, InputNumber } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';

const CleaningDay = (props) => {
  const { value, onChange } = props;
  function onInputChange(ev, key) {
    const newValue = { ...value, cleanPriority: value?.cleanPriority ?? 5 };
    newValue[key] = ev;
    onChange && onChange(newValue);
  }

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexFlow: 'row nowrap',
      }}
    >
      <Form.Item>
        <InputNumber
          value={value?.day}
          onChange={(ev) => {
            onInputChange(ev, 'day');
          }}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <span style={{ lineHeight: '30px', alignItems: 'center' }}>
        <FormattedMessage id="cleaninCenter.day" /> <FormattedMessage id="cleaninCenter.cleaning" />
      </span>

      <Form.Item>
        <InputNumber
          value={value?.times}
          onChange={(ev) => {
            onInputChange(ev, 'times');
          }}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <span style={{ lineHeight: '30px', alignItems: 'center' }}>
        {' '}
        <FormattedMessage id="cleaninCenter.times" />
      </span>
    </div>
  );
};
export default memo(CleaningDay);
