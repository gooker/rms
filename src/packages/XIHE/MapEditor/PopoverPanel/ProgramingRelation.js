import React, { memo } from 'react';
import { Button, Col, Divider, Form, Input, Row, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/util';
import commonStyle from '@/common.module.less';
import ActionDefiner from '@/packages/XIHE/MapEditor/components/ActionDefiner';

const ProgramingRelation = (props) => {
  const { data, actions } = props;
  const [formRef] = Form.useForm();

  return (
    <div style={{ paddingTop: 20 }}>
      <Form labelWrap form={formRef} layout={'vertical'}>
        <Form.Item name={'relationCode'} label={<FormattedMessage id={'app.map.route'} />}>
          <Select>
            <Select.Option>111</Select.Option>
          </Select>
        </Form.Item>
        {/* 起点 */}
        <Form.Item name="begin" label={formatMessage({ id: 'editor.program.relation.begin' })}>
          <ActionDefiner data={actions} />
        </Form.Item>
        {/* 起点 */}
        <Form.Item name="end" label={formatMessage({ id: 'editor.program.relation.end' })}>
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
export default memo(ProgramingRelation);
