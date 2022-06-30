import React, { memo, useEffect, useState } from 'react';
import { Form, Input, message, Select } from 'antd';
import { formatMessage } from '@/utils/util';
import { connect } from '@/utils/RmsDva';

const VehicleFormComponent = (props) => {
  const { allVehicles, form, dispatch } = props;
  const [typeOption, setTypeOption] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  useEffect(() => {
    dispatch({ type: 'monitor/refreshAllVehicleList' });
  }, []);

  useEffect(() => {
    setVehicleList(allVehicles);
  }, [allVehicles]);

  function getVehicleType(ev) {
    const vehicleId = ev.target.value;
    const currentVehicleInfo = vehicleList.filter((item) => item.vehicleId === vehicleId);
    if (currentVehicleInfo?.length === 0) {
      message.info(formatMessage({ id: 'vehicle.noExist.tip' }, { vehicle: vehicleId }));
    }
    form.setFieldsValue({
      vehicleType: null,
      vehicleId,
    });

    setTypeOption(currentVehicleInfo);
  }

  function onInputChange(ev, key) {
    form.setFieldsValue({
      vehicleType: ev,
    });
  }

  return (
    <>
      <Form.Item
        label={formatMessage({ id: 'vehicle.id' })}
        name={'vehicleId'}
        rules={[{ required: true }]}
      >
        <Input onChange={getVehicleType} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label={formatMessage({ id: 'app.vehicleType' })}
        name="vehicleType"
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
  );
};
export default connect(({ monitor }) => ({
  allVehicles: monitor.allVehicles,
}))(memo(VehicleFormComponent));
