import React, { memo, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { formatMessage } from '@/utils/util';
import { connect } from '@/utils/RmsDva';

const VehicleFormComponent = (props) => {
  const { value, onChange, allVehicles } = props;
  const [typeOption, setTypeOption] = useState([]);

  function getVehicleType(ev) {
    const vehicleId = ev.target.value;
    const allVehicleType = allVehicles.filter((item) => item.vehicleId === vehicleId);

    const newValue = { ...value };
    newValue['vehicleId'] = vehicleId;
    newValue['vehicleType'] = '';
    setTypeOption(allVehicleType);
    onChange && onChange(newValue);
  }

  function onInputChange(ev, key) {
    const newValue = { ...value };
    newValue[key] = ev;
    onChange && onChange(newValue);
  }

  return (
    // <div
    //   style={{
    //     display: 'flex',
    //     flex: 1,
    //     flexFlow: `${uiType} nowrap`,
    //   }}
    // >
    <>
      <Form.Item
        label={formatMessage({ id: 'vehicle.id' })}
        name={'vehicleId'}
        rules={[{ required: true }]}
        initialValue={value?.vehicleId}
      >
        <Input onChange={getVehicleType} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label={formatMessage({ id: 'app.vehicleType' })}
        name="vehicleType"
        initialValue={value?.vehicleType}
        rules={[{ required: true }]}
      >
        <Select
          onChange={(ev) => {
            onInputChange(ev, 'vehicleType');
          }}
          style={{ width: '100%' }}
        >
          {typeOption.map((record) => (
            <Select.Option key={record.vehicleType} value={record.vehicleType}>
              {record.vehicleType}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>

    // </div>
  );
};
export default connect(({ monitor }) => ({
  allVehicles: monitor.allVehicles,
}))(memo(VehicleFormComponent));
