import React, { memo, useEffect, useState } from 'react';
import { Form, Select } from 'antd';
import TaskSearch from '@/components/TaskSearch';
import { fetchAllVehicleList } from '@/services/commonService';
import { dealResponse, formatMessage, generateVehicleTypeOptions } from '@/utils/util';

const StandardTaskPoolSearch = (props) => {
  const { search } = props;

  const [form] = Form.useForm();
  const [vehicles, setVehicles] = useState([]);
  const [typeVehicles, setTypeVehicles] = useState([]);

  useEffect(() => {
    fetchAllVehicleList().then((response) => {
      if (!dealResponse(response)) {
        setVehicles(response);
      }
    });
  }, []);

  function getTypeVehicles(type) {
    const _typeVehicles = vehicles.filter((item) => item.vehicleType === type);
    setTypeVehicles(_typeVehicles);
  }

  return (
    <TaskSearch form={form} onSearch={search}>
      {/* 车辆类型 */}
      <Form.Item
        name={'vehicleType'}
        label={formatMessage({ id: 'app.vehicleType' })}
        getValueFromEvent={(value) => {
          getTypeVehicles(value);
          return value;
        }}
      >
        <Select allowClear>{generateVehicleTypeOptions(vehicles)}</Select>
      </Form.Item>

      {/* 车辆编码 */}
      <Form.Item name={'vehicleCode'} label={formatMessage({ id: 'vehicle.code' })}>
        <Select allowClear mode={'tags'}>
          {typeVehicles.map(({ vehicleId }) => (
            <Select.Option key={vehicleId} value={vehicleId}>
              {vehicleId}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </TaskSearch>
  );
};
export default memo(StandardTaskPoolSearch);
