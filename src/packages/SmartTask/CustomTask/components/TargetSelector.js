import React, { memo, useState } from 'react';
import { Select } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';

const TargetSelector = (props) => {
  const { dataSource, value, onChange } = props;
  const currentValue = { ...value }; // {type:xxx, code:[]}

  const [type, setType] = useState('CELL');

  function onTypeChange(_value) {
    setType(_value);
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

  return (
    <div>
      <Select value={currentValue?.type} onChange={onTypeChange} style={{ width: 150 }}>
        <Select.Option value={'CELL'}>
          <FormattedMessage id={'app.map.cell'} />
        </Select.Option>
        <Select.Option value={'STATION'}>
          <FormattedMessage id={'app.map.station'} />
        </Select.Option>
        <Select.Option value={'STATION_GROUP'}>
          <FormattedMessage id={'app.map.stationGroup'} />
        </Select.Option>
        <Select.Option value={'STORE_GROUP'}>
          <FormattedMessage id={'editor.cellType.storageGroup'} />
        </Select.Option>
      </Select>

      {type === 'CELL' ? (
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
export default memo(TargetSelector);
