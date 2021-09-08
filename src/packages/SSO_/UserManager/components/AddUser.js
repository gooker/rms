import React, { Component } from 'react';
import { Form, Select, Input, Button,Modal } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/Lang';
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
  state={
    adminTypeOptions:[],
    levelOptions:[],
    selectedUserType:null,
    timeZoneVisible:false,
    zoneValue:null,
  }
  componentDidMount() {
    const {type,updateRow}=this.props;
    const { setFieldsValue } = this.formRef.current;
    const levelOptions = generateLevelOptions(type);
    const adminTypeOptions = generateAdminTypeOptions(type);
    let selectedUserType='USER';
    let zoneValue=null;
    if(!isStrictNull(updateRow)){
       selectedUserType=updateRow.userType;
       zoneValue=updateRow.userTimeZone;
    }else{
        setFieldsValue({
            userType:selectedUserType
        })
    }
    this.setState({ adminTypeOptions, levelOptions,selectedUserType,zoneValue});
  }
  submit = (values) => {
    const { validateFields } = this.formRef.current;
    const { onAddUser } = this.props;
    validateFields().then((allValues) => {
      onAddUser(allValues);
    });
  };
  render() {
    const { updateRow } = this.props;
    const { adminTypeOptions, levelOptions,selectedUserType ,timeZoneVisible,zoneValue} = this.state;
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
                message: formatMessage({ id: 'sso.user.require.accountType' }),
              },
            ]}
            getValueFromEvent={(ev) => {
                this.setState({ selectedUserType:ev});
                return ev;
              }}
          >
            <Select>
              <Option key="user" value="USER">
                <FormattedMessage id="sso.user.account.user" />
              </Option>
              <Option key="app" value="APP">
                <FormattedMessage id="sso.user.account.app" />
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="sso.user.type.username" />}
            name="username"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'sso.user.require.username' }),
              },
            ]}
          >
            <Input style={{ display: 'none' }} />
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="sso.user.account.email" />}
            name="email"
            rules={[
              {
                type: 'email',
                message: formatMessage({ id: 'sso.user.require.validEmail' }),
              },
              { required: true, message: formatMessage({ id: 'sso.user.require.email' }) },
            ]}
          >
            <Input autoComplete="off" />
          </Form.Item>

          {/* 只有新建用户才显示密码项 */}
          {!updateRow && (
            <Form.Item
              label={formatMessage({ id: 'sso.user.account.password' })}
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
              label={formatMessage({ id: 'sso.user.account.password2' })}
              name="surePassword"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'sso.user.require.passwordOnceMore' }),
                },
                {
                  validator: (_, value) => {
                    const { getFieldValue } = this.formRef.current;
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(formatMessage({id: "sso.user.require.passwordConsistent" })),
                    );
                  },
                },
              ]}
            >
              <Input.Password autoComplete="off" type="password" />
            </Form.Item>
          )}

          <Form.Item
            label={formatMessage({ id: 'sso.user.account.language' })}
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
            label={formatMessage({ id: 'sso.user.account.adminType' })}
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
              label={formatMessage({ id: 'sso.user.account.level' })}
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
            label={formatMessage({ id: 'sso.user.account.userTimeZone' })}
            name="userTimeZone"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'sso.user.require.userTimeZone' }),
              },
            ]}
          >
            <Input
              autoComplete="off"
             
              onClick={(e) => {
                this.setState({ timeZoneVisible: true ,input:e});
              }}
            />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'sso.user.account.description' })}
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
            <FormattedMessage id="sso.user.action.submit" />
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
              () => {
                // const { input } = this.state;
                // input.blur();
                // setTimeout(() => {
                //   this.setState({ timeZoneInput: true });
                // }, 600);
              }
            );
          }}
          width={900}
          destroyOnClose
          footer={null}
          closable={false}
        >
          <TimeZone
            defaultValue={zoneValue}
            onChange={value => {
              const { setFieldsValue } = this.formRef.current;
              setFieldsValue({ userTimeZone: value });
              this.setState(
                {
                  zoneValue:value,
                  timeZoneVisible: false,
                //   timeZoneInput: false,
                },
                () => {
                //   const { input } = this.state;
                //   input.blur();
                //   setTimeout(() => {
                //     this.setState({ timeZoneInput: true });
                //   }, 600);
                }
              );
            }}
          />
        </Modal>
      </div>
    );
  }
}
