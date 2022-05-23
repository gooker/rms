import React, { memo, useState } from 'react';
import { Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';

const RobotSelector = (props) => {
  const { dataSource, value, onChange } = props;
  const currentValue = { ...value }; // {type:xxx, code:[]}

  const [secondaryVisible, setSecondaryVisible] = useState(false);

  function onTypeChange(_value) {
    setSecondaryVisible(_value !== 'AUTO');
    currentValue.type = _value;
    currentValue.code = [];
    onChange(currentValue);
  }

  function onCodeChange(_value) {
    currentValue.code = _value;
    onChange(currentValue);
  }

  // 第二个下拉框选项
  function renderSecondaryOptions() {
    if (secondaryVisible) {
      if (currentValue.type === 'AGV') {
        const result = [];
        dataSource.TYPE.forEach(({ code, ids }, index1) =>
          result.push(
            <Select.OptGroup key={index1} label={code}>
              {ids.map((id) => (
                <Select.Option key={id} value={id}>
                  {id}
                </Select.Option>
              ))}
            </Select.OptGroup>,
          ),
        );
        return result;
      }
      if (currentValue.type === 'AGV_GROUP') {
        return dataSource.GROUP.map(({ code, ids }, index) => (
          <Select.Option key={index} value={ids}>
            {code}
          </Select.Option>
        ));
      }
      return [];
    }
  }

  return (
    <div>
      <Select value={currentValue?.type} onChange={onTypeChange} style={{ width: 150 }}>
        <Select.Option value={'AUTO'}>
          <FormattedMessage id={'customTask.form.NO_SPECIFY'} />
        </Select.Option>
        <Select.Option value={'AGV'}>
          <FormattedMessage id={'customTask.form.SPECIFY_AGV'} />
        </Select.Option>
        <Select.Option value={'AGV_GROUP'}>
          <FormattedMessage id={'customTask.form.SPECIFY_GROUP'} />
        </Select.Option>
      </Select>

      {secondaryVisible && (
        <Select
          mode='multiple'
          value={currentValue?.code || []}
          onChange={onCodeChange}
          style={{ marginLeft: 10, width: 400 }}
        >
          {renderSecondaryOptions()}
        </Select>
      )}
    </div>
  );
};
export default connect(({ customTask }) => ({
  dataSource: customTask?.modelParams?.AGV ?? { GROUP: [], TYPE: [] },
}))(memo(RobotSelector));
