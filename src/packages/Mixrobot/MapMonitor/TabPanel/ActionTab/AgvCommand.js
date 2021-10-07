import React, { useState, useEffect, memo } from 'react';
import { connect } from '@/utils/dva';
import { Form, Select, Input, Divider, Button, message } from 'antd';
import { map } from 'lodash';
import { dealResponse, formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { agvCommand } from '@/services/monitor';
import { fetchWCSAgvList } from '@/services/api';

const formItem = { wrapperCol: { span: 16 }, labelCol: { span: 6 } };

const AgvCommand = (props) => {
  const { sectionId, agvType } = this.props;

  const [agvList, setAgvList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchWCSAgvList(agvType).then((res) => {
      if (!dealResponse(res)) {
        setAgvList(res);
      }
    });
  }, []);

  function sendAgvCommand(params) {
    form.validateFields().then((value) => {
      const { rawCommandHex, agvId } = value;
      if (rawCommandHex != null && agvId != null) {
        const params = {
          rawCommandHex,
          robotIds: agvId,
          sectionId: parseInt(sectionId, 10),
        };
        agvCommand(agvType, params).then((res) => {
          dealResponse(res, 1, '命令操作成功');
        });
      } else {
        message.error(
          formatMessage({
            id: 'app.monitorOperation.agvCommand.paramIncomplete',
          }),
        );
      }
    });
  }

  return (
    <Form form={form}>
      <Form.Item
        {...formItem}
        name={'agvId'}
        label={formatMessage({ id: 'app.monitorOperation.robotId' })}
      >
        <SelectAll
          dataSource={agvList.map((record) => {
            return {
              label: record.robotId,
              key: record.robotId,
              value: record.robotId,
            };
          })}
        />
      </Form.Item>

      <Form.Item
        {...formItem}
        name={'rawCommandHex'}
        label={formatMessage({ id: 'app.monitorOperation.agvCommand.command' })}
      >
        <Input.TextArea style={{ width: 260 }} />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 16, offset: 6 }}>
        <Button onClick={sendAgvCommand}>
          <FormattedMessage id="app.monitorOperation.agvCommand.sendAgvCommand" />
        </Button>
      </Form.Item>
    </Form>
  );
};
export default connect(({ monitor, user }) => ({ monitor, sectionId: user.sectionId }))(
  memo(AgvCommand),
);

const SelectAll = memo((props) => {
  const { value, dataSource: options } = props;
  return (
    <Select
      mode="tags"
      style={{ width: 260 }}
      onChange={(changedValue) => {
        const { onChange } = props;
        onChange && onChange(changedValue);
      }}
      value={value}
      dropdownRender={(menu) => {
        return (
          <div>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div
              style={{ display: 'flex', flexWrap: 'nowrap', padding: 8, textAlign: 'center' }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <a
                style={{
                  flex: 'none',
                  display: 'block',
                  cursor: 'pointer',
                  textAlign: 'center',
                  width: 260,
                }}
                onClick={() => {
                  const { onChange } = props;
                  if (onChange) {
                    onChange && onChange(map(options, 'value'));
                  }
                }}
              >
                <FormattedMessage id="app.monitorOperation.agvCommand.all" />
              </a>
            </div>
          </div>
        );
      }}
    >
      {options.map((element) => (
        <Select.Option key={element.key} value={element.key}>
          {element.label}
        </Select.Option>
      ))}
    </Select>
  );
});
