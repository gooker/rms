/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Select, Space } from 'antd';
import { find } from 'lodash';
import { isNull } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';

/**
 * vehicle: {code: '车类型', ids: '该类型下的小车id', types: '支持的载具类型'}
 */
const VehicleSelector = (props) => {
  const { dataSource, value, onChange } = props;
  const currentValue = { ...value }; // {type:xxx, code:[]}

  const [vehicleType, setVehicleType] = useState(null);
  const [secondaryVisible, setSecondaryVisible] = useState(false);

  useEffect(() => {
    setSecondaryVisible(currentValue.type !== 'AUTO');
  }, []);

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

  // 小车组第二个下拉框选项
  function renderVehicleGroupOptions() {
    return dataSource.vehicleGroup.map(({ code }) => (
      <Select.Option key={code} value={code}>
        {code}
      </Select.Option>
    ));
  }

  // 选择小车类型
  function cascadeFirstChange(_vehicleType) {
    setVehicleType(_vehicleType);
    onCodeChange([]);
  }

  // 小车类型下拉列表
  function renderCascadeFirstOption() {
    return dataSource.vehicle.map(({ code }) => (
      <Select.Option key={code} value={code}>
        {code}
      </Select.Option>
    ));
  }

  // 类型小车下拉列表
  function renderCascadeSecondOption() {
    if (!isNull(vehicleType)) {
      const vehicle = find(dataSource.vehicle, { code: vehicleType });
      return vehicle.ids.map((vehicleId) => (
        <Select.Option key={vehicleId} value={vehicleId}>
          {vehicleId}
        </Select.Option>
      ));
    }
    return [];
  }

  function renderSecondComponent() {
    switch (currentValue.type) {
      case 'Vehicle':
        return (
          <Space style={{ marginLeft: 10 }}>
            <Select
              value={vehicleType}
              onChange={cascadeFirstChange}
              style={{ width: 160 }}
              placeholder={'请选择小车类型'}
            >
              {renderCascadeFirstOption()}
            </Select>
            <Select
              mode={'multiple'}
              onChange={onCodeChange}
              style={{ width: 300 }}
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
            mode="multiple"
            value={currentValue?.code || []}
            onChange={onCodeChange}
            style={{ marginLeft: 10, width: 360 }}
          >
            {renderVehicleGroupOptions()}
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
        <Select.Option value={'Vehicle'}>
          <FormattedMessage id={'customTask.form.SPECIFY_Vehicle'} />
        </Select.Option>
        <Select.Option value={'Vehicle_GROUP'}>
          <FormattedMessage id={'customTask.form.SPECIFY_GROUP'} />
        </Select.Option>
      </Select>
      {secondaryVisible && renderSecondComponent()}
    </div>
  );
};
export default connect(({ customTask }) => {
  const dataSource = { vehicle: [], vehicleGroup: [] };
  if (customTask.modelParams) {
    dataSource.vehicle = customTask.modelParams?.VEHICLE ?? [];
    dataSource.vehicleGroup = customTask.modelParams?.VEHICLE_GROUP ?? [];
  }
  return { dataSource };
})(memo(VehicleSelector));
