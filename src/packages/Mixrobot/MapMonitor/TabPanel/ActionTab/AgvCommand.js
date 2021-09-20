import React, { Component } from 'react';
import { fetchAgvCommand } from '@/services/command';
import { fetchAgvList } from '@/services/car';
import { Form, Select, Input, Divider, Button, message } from 'antd';
import { connect } from 'umi';
import _map from 'lodash/map';
import { dealResponse } from '@/utils/utils';
import intl from 'react-intl-universal';
import FormattedMessage from '@/components/FormattedMessage';

const formItem = { wrapperCol: { span: 16 }, labelCol: { span: 6 } };

@connect(({ monitor, user }) => ({ monitor, sectionId: user.sectionId }))
class AgvCommand extends Component {
  formRef = React.createRef();

  state = {
    agvList: [],
  };

  sendAgvCommand = (params) => {
    fetchAgvCommand(params).then((res) => {
      dealResponse(res, 1, '命令操作成功');
    });
  };

  componentDidMount() {
    fetchAgvList().then((res) => {
      if (!dealResponse(res)) {
        this.setState({ agvList: res });
      }
    });
  }

  render() {
    const { agvList } = this.state;
    return (
      <Form ref={this.formRef}>
        <Form.Item
          {...formItem}
          name={'agvId'}
          label={intl.formatMessage({ id: 'app.monitorOperation.robotId' })}
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
          label={intl.formatMessage({ id: 'app.monitorOperation.agvCommand.command' })}
        >
          <Input.TextArea style={{ width: 260 }} />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 16, offset: 6 }}>
          <Button
            onClick={() => {
              const { sectionId } = this.props;
              const { validateFields } = this.formRef.current;
              validateFields().then((value) => {
                const { rawCommandHex, agvId } = value;
                if (rawCommandHex != null && agvId != null) {
                  const params = {
                    rawCommandHex,
                    robotIds: agvId,
                    sectionId: parseInt(sectionId, 10),
                  };
                  this.sendAgvCommand(params);
                } else {
                  message.error(
                    intl.formatMessage({
                      id: 'app.monitorOperation.agvCommand.paramIncomplete',
                    }),
                  );
                }
              });
            }}
          >
            <FormattedMessage id="app.monitorOperation.agvCommand.sendAgvCommand" />
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default AgvCommand;

const SelectAll = (props) => {
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
                    onChange(_map(options, 'value'));
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
};
