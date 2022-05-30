import React, { memo, useEffect, useState } from 'react';
import { Checkbox, Select, Space } from 'antd';
import { isNull, isSubArray } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';

const TargetSelector = (props) => {
  const { dispatch, showVar, form, dataSource, value, onChange, variable, subTaskCode } = props;
  const currentValue = value || { type: null, code: [] }; // {type:xxx, code:[]}

  const [useVariable, setUseVariable] = useState(false);

  useEffect(() => {
    setUseVariable(!isNull(variable[subTaskCode]));
  }, []);

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
      // 如果选择的载具，需要与对应的车型进行筛选
      if (['LOAD', 'LOAD_GROUP'].includes(currentValue.type)) {
        const vehicleSelection = form.getFieldValue(['START', 'vehicle']);
        // 自动分车或者使用了变量，则不需要筛选
        if (vehicleSelection.type !== 'AUTO' && isNull(variable.START)) {
          // 获取分车所支持的所有的载具类型
          let validLoadTypes = [];
          if (vehicleSelection.type === 'Vehicle' && vehicleSelection.code.length > 0) {
            const vehicleType = dataSource.Vehicle.filter((item) =>
              item.ids.includes(vehicleSelection.code[0]),
            );
            validLoadTypes = validLoadTypes.concat(vehicleType[0]?.types || []);
          }
          if (vehicleSelection.type === 'Vehicle_GROUP' && vehicleSelection.code.length > 0) {
            for (const item of dataSource.Vehicle_GROUP) {
              if (vehicleSelection.code.includes(item.code)) {
                validLoadTypes.push(...(item.types ?? []));
              }
            }
          }

          // 生成返回值
          if (currentValue.type === 'LOAD') {
            return validLoadTypes.map((loadType) => (
              <Select.Option key={loadType} value={loadType}>
                {loadType}
              </Select.Option>
            ));
          } else {
            // 对 dataSource的LOAD_GROUP进行筛选，LOAD_GROUP所有数据的types必须为validLoadTypes的子集
            const loadGroup = dataSource.LOAD_GROUP.filter((item) =>
              isSubArray(item.types, validLoadTypes),
            );
            return loadGroup.map(({ code }) => (
              <Select.Option key={code} value={code}>
                {code}
              </Select.Option>
            ));
          }
        }
      }
      return dataSource[currentValue.type].map(({ code }, index) => (
        <Select.Option key={index} value={code}>
          {code}
        </Select.Option>
      ));
    }

    return [];
  }

  function onCheckboxChange({ target: { checked } }) {
    setUseVariable(checked);
    updateVariable(checked);
    form.validateFields();
  }

  function updateVariable(checked) {
    const _variable = { ...variable };
    if (checked) {
      // Vehicle 和 Vehicle_GROUP 互斥
      _variable[subTaskCode] = {};
      _variable[subTaskCode][currentValue.type] = [];
    } else {
      delete _variable[subTaskCode];
    }
    dispatch({ type: 'customTask/updateVariable', payload: _variable });
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

      <Space>
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

        {showVar && (
          <Checkbox
            checked={useVariable}
            onChange={onCheckboxChange}
            disabled={isNull(currentValue.type)}
          >
            <FormattedMessage id={'customTasks.form.useVariable'} />
          </Checkbox>
        )}
      </Space>
    </div>
  );
};
export default connect(({ customTask }) => ({
  variable: customTask.variable,
  dataSource: customTask.modelParams || {
    Vehicle: [],
    Vehicle_GROUP: [],
    CELL: [],
    CELL_GROUP: [],
    STATION: [],
    STATION_GROUP: [],
    LOAD: [],
    LOAD_GROUP: [],
  },
}))(memo(TargetSelector));