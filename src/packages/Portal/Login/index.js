import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Select, Spin } from 'antd';
import { LoadingOutlined, LockOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import requestAPI from '@/utils/requestAPI';
import {
  adjustModalWidth,
  dealResponse,
  extractNameSpaceInfoFromEnvs,
  formatMessage,
  getAllEnvironments,
  getCustomEnvironments,
  getRandomString,
  isNull,
} from '@/utils/util';
import { fetchLogin } from '@/services/SSO';
import FormattedMessage from '@/components/FormattedMessage';
import LoginBackPicture from '@/../public/images/login_pic.png';
import Logo from '@/../public/images/logoMain.png';
import AddEnvironmentModal from '@/packages/SSO/EnvironmentManger/components/AddEnvironmentModal';
import styles from './Login.module.less';

const Login = (props) => {
  const { history } = props;

  const [formRef] = Form.useForm();
  const [modalRef] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 挂载push函数
    window.history.$$push = history.push;
    const { allEnvs, activeEnv } = getAllEnvironments();
    setOptions(allEnvs);
    formRef.setFieldsValue({ environment: activeEnv });
  }, []);

  function addEnvironment() {
    modalRef.validateFields().then((value) => {
      const _options = [...options];
      _options.push({ ...value, id: getRandomString(10) });
      window.localStorage.setItem(
        'customEnvs',
        JSON.stringify(_options.filter((item) => item.id !== 'default')),
      );
      setOptions(_options);
      setVisible(false);
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
    });
  }

  async function goLogin() {
    formRef.validateFields().then(async (values) => {
      setLoading(true);
      if (!isNull(values.environment)) {
        let active;
        const customEnvs = getCustomEnvironments().map((item) => {
          if (item.id === values.environment) {
            active = { ...item, flag: '1' };
            return active;
          } else {
            return { ...item, flag: '0' };
          }
        });
        window.localStorage.setItem('customEnvs', JSON.stringify(customEnvs));
        if (values.environment === 'default') {
          window.nameSpacesInfo = requestAPI();
        } else {
          window.nameSpacesInfo = extractNameSpaceInfoFromEnvs(active);
        }
      }

      const response = await fetchLogin({ ...values, type: 'admin' });
      if (!dealResponse(response)) {
        window.sessionStorage.setItem('token', response.authorization);
        setLoading(false);
        history.push('/');
      } else {
        setLoading(false);
      }
    });
  }

  return (
    <div className={styles.loginPage}>
      <img src={LoginBackPicture} alt={'login_picture'} className={styles.loginBackPicture} />
      <div className={styles.loginPanel}>
        <div className={styles.logo}>
          <img src={Logo} alt={'logo'} className={styles.logoPicture} />
        </div>
        <div className={styles.loginForm}>
          <Form form={formRef}>
            <Form.Item
              name='username'
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'app.login.username.required' }),
                },
              ]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'app.login.password.required' }),
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <Row gutter={10}>
              <Col flex={1}>
                <Form.Item
                  name='environment'
                  rules={[
                    {
                      required: true,
                      message: formatMessage({ id: 'app.login.password.environment' }),
                    },
                  ]}
                >
                  <Select>
                    {options.map(({ envName, id }) => (
                      <Select.Option key={id} value={id}>
                        {envName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Button
                  icon={<SettingOutlined style={{ color: '#7d7d7d' }} />}
                  onClick={() => {
                    setVisible(true);
                  }}
                />
              </Col>
            </Row>
            <Form.Item>
              {loading ? (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <Spin indicator={<LoadingOutlined spin style={{ color: '#fff' }} />} />
                </div>
              ) : (
                <Button type='primary' onClick={goLogin} style={{ width: '100%' }}>
                  <FormattedMessage id={'app.login.button'} />
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>

      {/*  新增环境配置 */}
      <Modal
        destroyOnClose
        width={adjustModalWidth() * 0.7}
        visible={visible}
        title={<FormattedMessage id='environmentManager.add' />}
        onOk={addEnvironment}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <AddEnvironmentModal formRef={modalRef} />
      </Modal>
    </div>
  );
};
export default memo(Login);
