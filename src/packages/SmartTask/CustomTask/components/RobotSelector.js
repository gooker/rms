import React, { memo, useState } from 'react';
import { Checkbox, Input, Select, Space } from 'antd';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';

const RobotSelector = (props) => {
  const { dispatch, dataSource, variable, value, onChange, subTaskCode } = props;
  const currentValue = { ...value }; // {type:xxx, code:[]}

  const [useVariable, setUseVariable] = useState(false);
  const [secondaryVisible, setSecondaryVisible] = useState(false);

  function onTypeChange(_value) {
    setSecondaryVisible(_value !== 'AUTO');
    currentValue.type = _value;
    currentValue.code = [];
    onChange(currentValue);

    // 处理下变量Key
    if (useVariable) {
      updateVariable(true);
    }
    if (_value === 'AUTO') {
      setUseVariable(false);
    }
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

  function onCheckboxChange({ target: { checked } }) {
    setUseVariable(checked);
    updateVariable(checked);
  }

  function updateVariable(checked) {
    const _variable = { ...variable };
    // 自动分车不需要配置变量
    if (currentValue.type === 'AUTO') {
      delete _variable[subTaskCode];
    } else {
      if (checked) {
        // AGV 和 AGV_GROUP 互斥
        _variable[subTaskCode] = {};
        _variable[subTaskCode][currentValue.type] = [];
      } else {
        delete _variable[subTaskCode];
      }
    }

    dispatch({ type: 'customTask/updateVariable', payload: _variable });
  }

  return (
    <div>
      <Select value={currentValue?.type} onChange={onTypeChange} style={{ width: 160 }}>
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
        <Space>
          {useVariable ? (
            <Input
              disabled
              value={`@@${currentValue.type}`}
              style={{ marginLeft: 10, width: 160 }}
            />
          ) : (
            <Select
              mode='multiple'
              value={currentValue?.code || []}
              onChange={onCodeChange}
              style={{ marginLeft: 10, width: 320 }}
            >
              {renderSecondaryOptions()}
            </Select>
          )}

          <Checkbox checked={useVariable} onChange={onCheckboxChange}>
            <FormattedMessage id={'customTasks.form.useVariable'} />
          </Checkbox>
        </Space>
      )}
    </div>
  );
};
export default connect(({ customTask }) => {
  const dataSource = { TYPE: [], GROUP: [] };
  if (customTask.modelParams) {
    dataSource.TYPE = customTask.modelParams?.AGV || [];
    dataSource.GROUP = customTask.modelParams?.AGV_GROUP || [];
  }
  return { dataSource, variable: customTask.variable };
})(memo(RobotSelector));
