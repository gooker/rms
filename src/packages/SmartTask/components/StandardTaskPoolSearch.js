import React, { memo, useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { fetchAllVehicleList } from '@/services/commonService';
import { dealResponse, formatMessage } from '@/utils/util';
import TaskSearch from '@/components/TaskSearch';
import FormattedMessage from '@/components/FormattedMessage';

const StandardTaskPoolSearch = (props) => {
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
      <Select.Option key={type} value={type}>
        {allTaskTypes[type]}
      </Select.Option>
    ));
  }

  return (
    <TaskSearch form={form} gutter={24} span={8} vehicles={vehicles} onSearch={search}>
      <Form.Item name={'vehicleTaskType'} label={formatMessage({ id: 'app.task.type' })}>
        <Select allowClear mode='multiple'>
          {renderVehicleTaskTypeOption()}
        </Select>
      </Form.Item>
      <Form.Item name={'taskId'} label={formatMessage({ id: 'app.task.id' })}>
        <Input allowClear />
      </Form.Item>
      <Form.Item name={'taskStatus'} label={formatMessage({ id: 'app.task.state' })}>
        <Select allowClear>
          <Select.Option value={'New'}>
            <FormattedMessage id={'app.task.state.New'} />
          </Select.Option>
          <Select.Option value={'Executing'}>
            <FormattedMessage id={'app.task.state.Executing'} />
          </Select.Option>
          <Select.Option value={'Wait'}>
            <FormattedMessage id={'app.task.state.Wait'} />
          </Select.Option>
        </Select>
      </Form.Item>
    </TaskSearch>
  );
};
export default memo(StandardTaskPoolSearch);
