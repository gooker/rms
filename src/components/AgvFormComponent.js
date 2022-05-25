import React, { memo, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { formatMessage } from '@/utils/util';

const AGVFormComponent = (props) => {
  const { value, onChange, allAGVs } = props;
  const [typeOption, setTypeOption] = useState([]);

  function getAgvType(ev) {
    const agvId = ev.target.value;
    const allAgvType = allAGVs.filter((item) => item.agvId === agvId);

    const newValue = { ...value };
    newValue['agvId'] = agvId;
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
        label={formatMessage({ id: 'app.agv.id' })}
        name={'agvId'}
        rules={[{ required: true }]}
        initialValue={value?.agvId}
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
export default memo(AGVFormComponent);
