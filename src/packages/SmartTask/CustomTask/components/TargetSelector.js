import React, { memo } from 'react';
import { Select } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { connect } from '@/utils/RmsDva';

const TargetSelector = (props) => {
  const { modelParams, value, onChange } = props;
  const currentValue = value || { type: null, code: [] }; // {type:xxx, code:[]}

  function onTypeChange(_value) {
    currentValue.type = _value;
    currentValue.code = [];
    onChange({ ...currentValue });
  }

  function onCodeChange(_value) {
    currentValue.code = _value;
    onChange({ ...currentValue });
  }

  // 第二个下拉框选项
  function renderSecondaryOptions() {
    if (currentValue.type) {
      return modelParams[currentValue.type].map(({ code }, index) => (
        <Select.Option key={index} value={code}>
          {code}
        </Select.Option>
      ));
    }
    return [];
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
        <Select.Option value={'STATION'}>
          <FormattedMessage id={'app.map.station'} />
        </Select.Option>
        <Select.Option value={'STATION_GROUP'}>
          <FormattedMessage id={'app.map.stationGroup'} />
        </Select.Option>
        <Select.Option value={'LOAD'}>
          <FormattedMessage id={'app.object.load'} />
        </Select.Option>
        <Select.Option value={'LOAD_GROUP'}>
          <FormattedMessage id={'app.object.loadGroup'} />
        </Select.Option>
      </Select>

      {currentValue.type === 'CELL' ? (
        <Select
          mode='tags'
          value={currentValue?.code || []}
          onChange={onCodeChange}
          style={{ marginLeft: 10, width: 300 }}
          notFoundContent={null}
        />
      ) : (
        <Select
          mode='multiple'
          value={currentValue?.code || []}
          onChange={onCodeChange}
          style={{ marginLeft: 10, width: 300 }}
        >
          {renderSecondaryOptions()}
        </Select>
      )}
    </div>
  );
};
export default connect(({ customTask }) => ({
  modelParams: customTask.modelParams?.TARGET || {
    CELL: [],
    CELL_GROUP: [],
    STATION: [],
    STATION_GROUP: [],
    LOAD: [],
    LOAD_GROUP: [],
  },
}))(memo(TargetSelector));
