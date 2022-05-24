import React, { memo } from 'react';
import { Select } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { connect } from '@/utils/RmsDva';

const BackZoneSelector = (props) => {
  const { cellGroup, value, onChange } = props;
  const currentValue = { ...value }; // {type:xxx, code:[]}

  function onTypeChange(_value) {
    currentValue.type = _value;
    currentValue.code = [];
    onChange(currentValue);
  }

  function onCodeChange(_value) {
    currentValue.code = _value;
    onChange(currentValue);
  }

  // 第二个下拉框选项
  function renderSecondarySelector() {
    if (currentValue.type === 'CELL') {
      return (
        <Select
          mode='tags'
          value={currentValue?.code || []}
          onChange={onCodeChange}
          style={{ marginLeft: 10, width: 400 }}
          notFoundContent={null}
        />
      );
    } else {
      return (
        <Select
          mode='multiple'
          value={currentValue?.code || []}
          onChange={onCodeChange}
          style={{ marginLeft: 10, width: 400 }}
        >
          {cellGroup.map(({ code }, index) => (
            <Select.Option key={index} value={code}>
              {code}
            </Select.Option>
          ))}
        </Select>
      );
    }
  }

  return (
    <div>
      <Select value={currentValue?.type} onChange={onTypeChange} style={{ width: 150 }}>
        <Select.Option value={'CELL'}>
          <FormattedMessage id={'app.map.cell'} />
        </Select.Option>
        <Select.Option value={'CELL_GROUP'}>
          <FormattedMessage id={'app.map.cellGroup'} />
        </Select.Option>
      </Select>

      {renderSecondarySelector()}
    </div>
  );
};
export default connect(({ customTask }) => ({
  cellGroup: customTask?.modelParams?.CELL_GROUP ?? [],
}))(memo(BackZoneSelector));
