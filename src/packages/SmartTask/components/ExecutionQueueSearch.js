import React, { memo, useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { dealResponse, formatMessage } from '@/utils/util';
import { fetchAllVehicleList } from '@/services/commonService';
import TaskSearch from '@/components/TaskSearch';

const { Option } = Select;

const ExecutionQueueSearch = (props) => {
  const { search, allTaskTypes } = props;
  const [form] = Form.useForm();
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchAllVehicleList().then((response) => {
      if (!dealResponse(response)) {
        setVehicles(response);
      }
    });
  }, []);

  function renderVehicleTaskTypeOption() {
    return Object.keys(allTaskTypes).map((type) => (
      <Option key={type} value={type}>
        {allTaskTypes[type]}
      </Option>
    ));
  }

  return (
    <TaskSearch form={form} gutter={24} span={8} vehicles={vehicles} onSearch={search}>
      <Form.Item name={'vehicleTaskType'} label={formatMessage({ id: 'app.task.type' })}>
        <Select allowClear mode="multiple">
          {renderVehicleTaskTypeOption()}
        </Select>
      </Form.Item>
      <Form.Item name={'taskId'} label={formatMessage({ id: 'app.task.id' })}>
        <Input />
      </Form.Item>
    </TaskSearch>
  );
};
export default memo(ExecutionQueueSearch);
