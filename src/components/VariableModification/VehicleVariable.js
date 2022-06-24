/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Col, Row, Select } from 'antd';
import { find } from 'lodash';
import { isNull } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';

const VehicleVariable = (props) => {
  const { dataSource, value, onChange } = props;
  const currentValue = { ...value }; // {type:xxx, code:[]}

  const [vehicleType, setVehicleType] = useState(null);
  const [secondaryVisible, setSecondaryVisible] = useState(false);

  useEffect(() => {
    setSecondaryVisible(currentValue.type !== 'AUTO');
    const vehicle = value.code[0];
    if (vehicle) {
      for (const dataSourceElement of dataSource.vehicle) {
        if (dataSourceElement.ids.includes(vehicle)) {
          setVehicleType(dataSourceElement.code);
          break;
        }
      }
    }
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
      case 'VEHICLE':
        return [
          <Select
            key={'type'}
            value={vehicleType}
            onChange={cascadeFirstChange}
            style={{ width: 160 }}
            placeholder={'请选择小车类型'}
          >
            {renderCascadeFirstOption()}
          </Select>,
          <Select
            key={'vehicle'}
            mode={'multiple'}
            onChange={onCodeChange}
            placeholder={'请选择小车'}
            value={currentValue.code}
          >
            {renderCascadeSecondOption()}
          </Select>,
        ];
      default:
        return [
          <Select
            key={'vehicleGroup'}
            mode='multiple'
            value={currentValue?.code || []}
            onChange={onCodeChange}
          >
            {renderVehicleGroupOptions()}
          </Select>,
        ];
    }
  }

  const secondComponent = renderSecondComponent();
  const firstComponent = (
    <Select disabled value={currentValue?.type} onChange={onTypeChange} style={{ width: 130 }}>
      <Select.Option value={'AUTO'}>
        <FormattedMessage id={'customTask.form.NO_SPECIFY'} />
      </Select.Option>
      <Select.Option value={'VEHICLE'}>
        <FormattedMessage id={'customTask.form.SPECIFY_Vehicle'} />
      </Select.Option>
      <Select.Option value={'VEHICLE_GROUP'}>
        <FormattedMessage id={'customTask.form.SPECIFY_GROUP'} />
      </Select.Option>
    </Select>
  );

  if (secondComponent.length === 1) {
    return (
      <Row gutter={10}>
        <Col>{firstComponent}</Col>
        <Col>{secondaryVisible && renderSecondComponent()}</Col>
      </Row>
    );
  }
  return (
    <div>
      <Row gutter={10}>
        <Col>{firstComponent}</Col>
        <Col>{secondComponent[0]}</Col>
      </Row>
      <Row style={{ marginTop: 10 }}>{secondComponent[1]}</Row>
    </div>
  );
};
export default connect(({ quickTask }) => {
  const dataSource = { vehicle: [], vehicleGroup: [] };
  if (quickTask.modelParam) {
    dataSource.vehicle = quickTask.modelParam?.VEHICLE ?? [];
    dataSource.vehicleGroup = quickTask.modelParam?.VEHICLE_GROUP ?? [];
  }
  return { dataSource };
})(memo(VehicleVariable));
