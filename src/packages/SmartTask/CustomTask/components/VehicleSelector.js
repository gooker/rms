import React, { memo, useEffect, useState } from 'react';
import { Col, Row, Select } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';

const VehicleSelector = (props) => {
  const { dataSource, value, onChange, width = 640 } = props;
  const currentValue = { ...value }; // {type:xxx, code:[]}

  const [secondaryVisible, setSecondaryVisible] = useState(false);

  useEffect(() => {
    setSecondaryVisible(value?.type !== VehicleOptionType.AUTO);
  }, []);

  const dataSourceMap = {};
  if (Array.isArray(dataSource)) {
    dataSource.forEach(({ key, customTaskDTOS }) => {
      dataSourceMap[key] = customTaskDTOS;
    });
  }

  function onTypeChange(_value) {
    setSecondaryVisible(_value !== VehicleOptionType.AUTO);
    currentValue.type = _value;
    currentValue.code = [];
    onChange(currentValue);
  }

  function onCodeChange(_value) {
    currentValue.code = _value;
    onChange(currentValue);
  }

  function renderVehicleOptions() {
    return dataSourceMap[VehicleOptionType.VEHICLE].map(({ code, name, ids }) => (
      <Select.OptGroup key={code} label={name}>
        {ids?.map((item) => (
          <Select.Option key={item} value={item}>
            {item.split('_').at(-1)}
          </Select.Option>
        ))}
      </Select.OptGroup>
    ));
  }

  // 小车组下拉框选项
  function renderVehicleGroupOptions() {
    return dataSourceMap[VehicleOptionType.VEHICLE_GROUP].map(({ code }) => (
      <Select.Option key={code} value={code}>
        {code}
      </Select.Option>
    ));
  }

  // 小车下拉列表
  function renderSecondComponent() {
    return (
      <Select
        allowClear
        mode={'multiple'}
        value={currentValue?.code || []}
        onChange={onCodeChange}
        style={{ width }}
      >
        {currentValue.type === VehicleOptionType.VEHICLE
          ? renderVehicleOptions()
          : renderVehicleGroupOptions()}
      </Select>
    );
  }

  return (
    <Row gutter={16}>
      <Col>
        <Select value={currentValue?.type} onChange={onTypeChange} style={{ width: 130 }}>
          <Select.Option value={VehicleOptionType.AUTO}>
            <FormattedMessage id={'customTask.form.NO_SPECIFY'} />
          </Select.Option>
          <Select.Option value={VehicleOptionType.VEHICLE}>
            <FormattedMessage id={'customTask.form.SPECIFY_Vehicle'} />
          </Select.Option>
          <Select.Option value={VehicleOptionType.VEHICLE_GROUP}>
            <FormattedMessage id={'customTask.form.SPECIFY_GROUP'} />
          </Select.Option>
        </Select>
      </Col>
      <Col flex={1}>{secondaryVisible && renderSecondComponent()}</Col>
    </Row>
  );
};
export default memo(VehicleSelector);

export const VehicleOptionType = {
  AUTO: 'AUTO',
  VEHICLE: 'VEHICLE',
  VEHICLE_GROUP: 'VEHICLE_GROUP',
};
