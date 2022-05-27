/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Checkbox, Select, Space } from 'antd';
import { find } from 'lodash';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { isNull } from '@/utils/util';

/**
 * agv: {code: '车类型', ids: '该类型下的小车id', types: '支持的载具类型'}
 */
const RobotSelector = (props) => {
  const { dispatch, form, dataSource, variable, value, onChange, subTaskCode } = props;
  const currentValue = { ...value }; // {type:xxx, code:[]}

  const [agvType, setAgvType] = useState(null);
  const [useVariable, setUseVariable] = useState(false);
  const [secondaryVisible, setSecondaryVisible] = useState(false);

  useEffect(() => {
    setUseVariable(!isNull(variable[subTaskCode]));
    setSecondaryVisible(currentValue.type !== 'AUTO');
  }, []);

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

  // 小车组第二个下拉框选项
  function renderAgvGroupOptions() {
    return dataSource.agvGroup.map(({ code }) => (
      <Select.Option key={code} value={code}>
        {code}
      </Select.Option>
    ));
  }

  // 可使用变量
  function onCheckboxChange({ target: { checked } }) {
    setUseVariable(checked);
    updateVariable(checked);
    form.validateFields();
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

  // 选择小车类型
  function cascadeFirstChange(_agvType) {
    setAgvType(_agvType);
    onCodeChange([]);
  }

  // 小车类型下拉列表
  function renderCascadeFirstOption() {
    return dataSource.agv.map(({ code }) => (
      <Select.Option key={code} value={code}>
        {code}
      </Select.Option>
    ));
  }

  // 类型小车下拉列表
  function renderCascadeSecondOption() {
    if (!isNull(agvType)) {
      const agv = find(dataSource.agv, { code: agvType });
      return agv.ids.map((agvId) => (
        <Select.Option key={agvId} value={agvId}>
          {agvId}
        </Select.Option>
      ));
    }
    return [];
  }

  function renderSecondComponent() {
    switch (currentValue.type) {
      case 'AGV':
        return (
          <Space style={{ marginLeft: 10 }}>
            <Select
              value={agvType}
              onChange={cascadeFirstChange}
              style={{ width: 160 }}
              placeholder={'请选择小车类型'}
            >
              {renderCascadeFirstOption()}
            </Select>
            <Select
              mode={'multiple'}
              onChange={onCodeChange}
              style={{ width: 360 }}
              placeholder={'请选择小车'}
              value={currentValue.code}
            >
              {renderCascadeSecondOption()}
            </Select>
          </Space>
        );
      default:
        return (
          <Select
            mode='multiple'
            value={currentValue?.code || []}
            onChange={onCodeChange}
            style={{ marginLeft: 10, width: 360 }}
          >
            {renderAgvGroupOptions()}
          </Select>
        );
    }
  }

  return (
    <div>
      <Select value={currentValue?.type} onChange={onTypeChange} style={{ width: 130 }}>
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
          {renderSecondComponent()}
          <Checkbox checked={useVariable} onChange={onCheckboxChange}>
            <FormattedMessage id={'customTasks.form.useVariable'} />
          </Checkbox>
        </Space>
      )}
    </div>
  );
};
export default connect(({ customTask }) => {
  const dataSource = { agv: [], agvGroup: [] };
  if (customTask.modelParams) {
    dataSource.agv = customTask.modelParams?.AGV || [];
    dataSource.agvGroup = customTask.modelParams?.AGV_GROUP || [];
  }
  return { dataSource, variable: customTask.variable };
})(memo(RobotSelector));
