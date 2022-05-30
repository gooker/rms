import React, { memo, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { formatMessage } from '@/utils/util';
import { connect } from '@/utils/RmsDva';

const AGVFormComponent = (props) => {
  const { value, onChange, allAGVs } = props;
  const [typeOption, setTypeOption] = useState([]);

  function getAgvType(ev) {
    const vehicleId = ev.target.value;
    const allAgvType = allAGVs.filter((item) => item.vehicleId === vehicleId);

    const newValue = { ...value };
    newValue['vehicleId'] = vehicleId;
    newValue['agvType'] = '';
    setTypeOption(allAgvType);
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
        label={formatMessage({ id: 'app.vehicle.id' })}
        name={'vehicleId'}
        rules={[{ required: true }]}
        initialValue={value?.vehicleId}
      >
        <Input onChange={getAgvType} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label={formatMessage({ id: 'app.agvType' })}
        name="agvType"
        initialValue={value?.agvType}
        rules={[{ required: true }]}
      >
        <Select
          onChange={(ev) => {
            onInputChange(ev, 'agvType');
          }}
          style={{ width: '100%' }}
        >
          {typeOption.map((record) => (
            <Select.Option key={record.agvType} value={record.agvType}>
              {record.agvType}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>

    // </div>
  );
};
export default connect(({ monitor }) => ({
  allAGVs: monitor.allAGVs,
}))(memo(AGVFormComponent));
