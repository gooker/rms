import React, { memo } from 'react';
import { InputNumber, Select } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';

const { Option } = Select;

const AngleSelector = (props) => {
  const { value, onChange, addonLabel, disabled = false, beforeWidth = 100, width = 100 } = props;

  const addonBefore = (
    <Select value={value} onChange={onChange} style={{ width: beforeWidth }}>
      <Option value={0}>
        {addonLabel ? addonLabel[0] : <FormattedMessage id="app.direction.toRight" />}
      </Option>
      <Option value={90}>
        {addonLabel ? addonLabel[90] : <FormattedMessage id="app.direction.toTop" />}
      </Option>
      <Option value={180}>
        {addonLabel ? addonLabel[180] : <FormattedMessage id="app.direction.toLeft" />}
      </Option>
      <Option value={270}>
        {addonLabel ? addonLabel[270] : <FormattedMessage id="app.direction.toBottom" />}
      </Option>
    </Select>
  );

  return (
    <InputNumber
      disabled={disabled}
      addonBefore={addonBefore}
      addonAfter="°"
      value={value}
      onChange={onChange}
      style={{ width }}
    />
  );
};
export default memo(AngleSelector);
