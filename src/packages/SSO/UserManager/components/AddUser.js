import React, { Component } from 'react';
import { Form, Select, Input, Button, Modal } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, getFormLayout } from '@/utils/util';
import LocalsKeys from '@/locales/LocaleKeys';
import TimeZone from '@/components/TimeZone';
import { generateAdminTypeOptions } from '../userManagerUtils';
import { isStrictNull } from '@/utils/util';

const { Option } = Select;

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 18);

export default class AddUser extends Component {
  formRef = React.createRef();

  state = {
    adminTypeOptions: [],
    timeZoneVisible: false,
    zoneValue: null,
  };

  componentDidMount() {
    const { type, updateRow } = this.props;
    const { setFieldsValue } = this.formRef.current;
    const adminTypeOptions = generateAdminTypeOptions(type);
    let zoneValue = null;
    if (!isStrictNull(updateRow)) {
      zoneValue = updateRow.userTimeZone;
      const params = {
        userType: updateRow.userType || 'USER',
        username: updateRow.username,
        email: updateRow.email,
        language: updateRow.language,
        adminType: updateRow.adminType || 'USER',
        userTimeZone: updateRow.userTimeZone,
        description: updateRow.description,
      };
      setFieldsValue({ ...params });
    }
    this.setState({ adminTypeOptions, zoneValue });
  }

  componentWillUnmount() {
    const { resetFields } = this.formRef.current;
    resetFields();
  }

  setTimezoneInput = () => {
    const { getFieldInstance } = this.formRef.current;
    const ev = getFieldInstance('userTimeZone');
    if (ev && ev.input) {
      ev.input.blur();
    }
  };

  submit = () => {
    const { validateFields } = this.formRef.current;
    const { onAddUser } = this.props;
    validateFields()
      .then((allValues) => {
        onAddUser(allValues);
      })
      .catch(() => {});
  };

  render() {
    const { updateRow } = this.props;
    const { adminTypeOptions, timeZoneVisible, zoneValue } = this.state;
    const localLocales =
      window.localStorage.getItem('locales') || '["zh-CN","en-US","ko-KR","vi-VN"]';
    return (
      <div>
        <Form {...formItemLayout} ref={this.formRef}>
          <Form.Item
            label={<FormattedMessage id="app.common.type" />}
            name="userType"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'sso.user.require.accountType', format: false }),
              },
            ]}
          >
            <Select>
              <Option key="user" value="USER">
                <FormattedMessage id="sso.user" />
              </Option>
              <Option key="app" value="APP">
                <FormattedMessage id="app.module" />
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<FormattedMessage id="sso.user.name" />}
            name="username"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'sso.user.require.username', format: false }),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={<FormattedMessage id="sso.user.email" />}
            name="email"
            rules={[
              {
                type: 'email',
                message: formatMessage({ id: 'sso.user.require.validEmail', format: false }),
              },
              {
                required: true,
                message: formatMessage({ id: 'sso.user.require.email', format: false }),
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* 只有新建用户才显示密码项 */}
          {!updateRow && (
            <Form.Item
              label={<FormattedMessage id="sso.user.password" />}
              name="password"
              rules={[{ required: true }]}
            >
              <Input.Password autoComplete="off" type="password" />
            </Form.Item>
          )}

          {!updateRow && (
            <Form.Item
              label={<FormattedMessage id="sso.user.password2" />}
              name="surePassword"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'sso.user.require.passwordOnceMore',
                    format: false,
                  }),
                },
                {
                  validator: (_, value) => {
                    const { getFieldValue } = this.formRef.current;
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        formatMessage({ id: 'sso.user.require.passwordConsistent', format: false }),
                      ),
                    );
                  },
                },
              ]}
            >
              <Input.Password autoComplete="off" type="password" />
            </Form.Item>
          )}

          <Form.Item
            label={<FormattedMessage id="sso.user.language" />}
            name="language"
            rules={[{ required: true }]}
          >
            <Select>
              {JSON.parse(localLocales).map((locale) => (
                <Option key={locale} value={locale}>
                  {LocalsKeys[locale]}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<FormattedMessage id="sso.user.adminType" />}
            name="adminType"
            rules={[{ required: true }]}
          >
            <Select onChange={this.adminTypeChanged}>
              {adminTypeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="sso.user.timeZone" />}
            name="userTimeZone"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'sso.user.require.userTimeZone', format: false }),
              },
            ]}
          >
            <Input
              readOnly
              autoComplete="off"
              onClick={() => {
                this.setState({ timeZoneVisible: true });
              }}
            />
          </Form.Item>
          <Form.Item label={<FormattedMessage id="app.common.remark" />} name="description">
            <Input />
          </Form.Item>
          <Form.Item {...formItemLayoutNoLabel}>
            <Button onClick={this.submit} type="primary">
              <FormattedMessage id="app.button.submit" />
            </Button>
          </Form.Item>
        </Form>

        {/*********时区分配**********/}
        <Modal
          visible={timeZoneVisible}
          onCancel={() => {
            this.setState(
              {
                timeZoneVisible: false,
              },
              this.setTimezoneInput,
            );
          }}
          width={900}
          destroyOnClose
          footer={null}
          closable={false}
        >
          <TimeZone
            defaultValue={zoneValue}
            onChange={(value) => {
              const { setFieldsValue } = this.formRef.current;
              setFieldsValue({ userTimeZone: value });
              this.setState(
                {
                  zoneValue: value,
                  timeZoneVisible: false,
                },
                this.setTimezoneInput,
              );
            }}
          />
        </Modal>
      </div>
    );
  }
}
