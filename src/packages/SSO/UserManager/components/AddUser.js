import React, { Component } from 'react';
import { Form, Select, Input, Button, Modal } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/utils';
import LocalsKeys from '@/locales/LocaleKeys';
import TimeZone from '@/components/TimeZone';

import { generateAdminTypeOptions, generateLevelOptions } from '../userManagerUtils';
import { isStrictNull } from '@/utils/utils';
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 15,
  },
};

export default class AddUser extends Component {
  formRef = React.createRef();
  state = {
    adminTypeOptions: [],
    levelOptions: [],
    selectedUserType: null,
    timeZoneVisible: false,
    zoneValue: null,
  };
  componentDidMount() {
    const { type, updateRow } = this.props;
    const { setFieldsValue } = this.formRef.current;
    const levelOptions = generateLevelOptions(type);
    const adminTypeOptions = generateAdminTypeOptions(type);
    let selectedUserType = 'USER';
    let zoneValue = null;
    if (!isStrictNull(updateRow)) {
      selectedUserType = updateRow.userType || 'USER';
      zoneValue = updateRow.userTimeZone;
      const params = {
        userType: selectedUserType,
        username: updateRow.username,
        email: updateRow.email,
        language: updateRow.language,
        adminType: updateRow.adminType || 'USER',
        userTimeZone: updateRow.userTimeZone,
        description: updateRow.description,
      };
      if (selectedUserType === 'USER') {
        params.level = updateRow.level;
      }
      setFieldsValue({ ...params });
    } else {
      setFieldsValue({
        userType: selectedUserType,
        username: null,
        password: null,
      });
    }
    this.setState({ adminTypeOptions, levelOptions, selectedUserType, zoneValue });
  }

  setTimezoneInput = () => {
    const { getFieldInstance } = this.formRef.current;
    const ev = getFieldInstance('userTimeZone');
    if (ev && ev.input) {
      ev.input.blur();
    }
  };

  submit = (values) => {
    const { validateFields } = this.formRef.current;
    const { onAddUser } = this.props;
    validateFields().then((allValues) => {
      onAddUser(allValues);
    });
  };
  render() {
    const { updateRow } = this.props;
    const { adminTypeOptions, levelOptions, selectedUserType, timeZoneVisible, zoneValue } =
      this.state;
    const localLocales =
      window.localStorage.getItem('locales') || '["zh-CN","en-US","ko-KR","vi-VN"]';
    return (
      <div>
        <Form {...formItemLayout} ref={this.formRef}>
          <Form.Item
            label={<FormattedMessage id="sso.user.account.type" />}
            name="userType"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'sso.user.require.accountType', format: false }),
              },
            ]}
            getValueFromEvent={(ev) => {
              this.setState({ selectedUserType: ev });
              return ev;
            }}
          >
            <Select>
              <Option key="user" value="USER">
                <FormattedMessage id="sso.user.type.user" />
              </Option>
              <Option key="app" value="APP">
                <FormattedMessage id="translator.languageManage.application" />
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="sso.user.type.username" />}
            name="username"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'sso.user.require.username', format: false }),
              },
            ]}
          >
            <Input
              autoComplete="off"
              readOnly
              onFocus={() => {
                const { getFieldInstance } = this.formRef.current;
                const ev = getFieldInstance('username');
                if (ev && ev.input) {
                  ev.input.readOnly = false;
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="sso.user.account.email" />}
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
            <Input autoComplete="off" />
          </Form.Item>

          {/* 只有新建用户才显示密码项 */}
          {!updateRow && (
            <Form.Item
              label={<FormattedMessage id="sso.user.account.password" />}
              name="password"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password autoComplete="off" type="password" />
            </Form.Item>
          )}
          {!updateRow && (
            <Form.Item
              label={<FormattedMessage id="sso.user.account.password2" />}
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
            label={<FormattedMessage id="translator.languageManage.language" />}
            name="language"
            rules={[
              {
                required: true,
              },
            ]}
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
            label={<FormattedMessage id="sso.user.list.adminType" />}
            name="adminType"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select onChange={this.adminTypeChanged}>
              {adminTypeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {selectedUserType === 'USER' && (
            <Form.Item
              label={<FormattedMessage id="sso.user.account.level" />}
              name="level"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select>
                {levelOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            label={<FormattedMessage id="sso.user.account.userTimeZone" />}
            name="userTimeZone"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'sso.user.require.userTimeZone', format: false }),
              },
            ]}
          >
            <Input
              autoComplete="off"
              readOnly
              onClick={() => {
                this.setState({ timeZoneVisible: true });
              }}
            />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="app.common.remark" />}
            name="description"
          >
            <Input />
          </Form.Item>
        </Form>
        <div
          style={{
            marginTop: 60,
            textAlign: 'center',
          }}
        >
          <Button onClick={this.submit} type="primary">
            <FormattedMessage id="app.button.submit" />
          </Button>
        </div>
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
