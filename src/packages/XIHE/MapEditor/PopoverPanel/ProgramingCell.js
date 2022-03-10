import React, { memo } from 'react';
import { Button, Divider, Form, Input } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { SearchOutlined } from '@ant-design/icons';
import RichInput from '@/packages/XIHE/components/RichInput';
import ActionDefiner from '../components/ActionDefiner';

const ProgramingCell = (props) => {
  const { data, actions } = props;
  const [formRef] = Form.useForm();

  return (
    <div style={{ paddingTop: 20 }}>
      <Form labelWrap form={formRef} layout={'vertical'}>
        <Form.Item name={'cellCode'} label={<FormattedMessage id={'app.map.cell'} />}>
          <RichInput />
        </Form.Item>

        {/* 到达前*/}
        <Form.Item
          name={'beforeArrive'}
          label={<FormattedMessage id={'editor.program.cell.beforeArrive'} />}
        >
          <ActionDefiner data={actions} />
        </Form.Item>

        {/* 到达后*/}
        <Form.Item name={'arrived'} label={<FormattedMessage id={'editor.program.cell.arrived'} />}>
          <ActionDefiner data={actions} />
        </Form.Item>

        {/* 离开前*/}
        <Form.Item
          name={'beforeLeave'}
          label={<FormattedMessage id={'editor.program.cell.beforeLeave'} />}
        >
          <ActionDefiner data={actions} />
        </Form.Item>

        <Form.Item>
          <Button type="primary">
            <FormattedMessage id={'app.button.confirm'} />
          </Button>
        </Form.Item>
      </Form>
      <Divider style={{ background: '#a3a3a3' }} />
      <Input prefix={<SearchOutlined />} />
    </div>
  );
};
export default memo(ProgramingCell);
