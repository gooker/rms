import React, { memo, useEffect, useState } from 'react';
import { DatePicker, Form, Input, Select, Col } from 'antd';
import { convertToUserTimezone, dealResponse, formatMessage } from '@/utils/util';
import { fetchAllVehicleList } from '@/services/commonService';
import TaskSearch from '@/components/TaskSearch';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TaskManagementSearch = (props) => {
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

  function onSearch(values) {
    const _requestParam = { ...values };
    if (values.createDate) {
      _requestParam.createTimeStart = convertToUserTimezone(values.createDate[0]).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      _requestParam.createTimeEnd = convertToUserTimezone(values.createDate[1]).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      delete _requestParam.createDate;
    }
    search(_requestParam, true);
  }

  function renderVehicleTaskTypeOption() {
    return Object.keys(allTaskTypes).map((type) => (
      <Option key={type} value={type}>
        {allTaskTypes[type]}
      </Option>
    ));
  }

  return (
    <TaskSearch form={form} gutter={24} span={6} vehicles={vehicles} onSearch={onSearch}>
      <Form.Item name={'taskId'} label={formatMessage({ id: 'app.task.id' })}>
        <Input allowClear />
      </Form.Item>
      <Form.Item name={'vehicleTaskType'} label={formatMessage({ id: 'app.task.type' })}>
        <Select mode="multiple" allowClear>
          {renderVehicleTaskTypeOption()}
        </Select>
      </Form.Item>
      <Form.Item
        name={'createDate'}
        label={formatMessage({ id: 'app.taskDetail.queryTime' })}
        span={12}
      >
        <RangePicker showTime style={{ width: '100%' }} />
      </Form.Item>
    </TaskSearch>
  );
};
export default memo(TaskManagementSearch);
