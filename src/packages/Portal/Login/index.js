import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import { LoadingOutlined, LockOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { dealResponse, extractNameSpaceInfoFromEnvs, formatMessage, getAllEnvironments } from '@/utils/util';
import requestAPI from '@/utils/requestAPI';
import { selectAllDB, updateDB } from '@/utils/IndexDBUtil';
import { fetchLogin } from '@/services/SSOService';
import FormattedMessage from '@/components/FormattedMessage';
import EnvironmentManager from '@/packages/Portal/EnvironmentManger';
import LoginBackPicture from '@/../public/images/login_pic.png';
import Logo from '@/../public/images/logoMain.png';
import styles from './Login.module.less';

const Login = (props) => {
  const { history } = props;

  const [formRef] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 挂载push函数
    window.RMS.push = history.push;
    init();

    async function init() {
      const { allEnvs, activeEnv } = await getAllEnvironments(window.dbContext);
      setOptions(allEnvs);
      formRef.setFieldsValue({ environment: activeEnv });
    }
  }, []);

  async function updateSelectOptions() {
    const _options = await selectAllDB(window.dbContext);
    setOptions(_options);
    setVisible(false);
  }

  async function goLogin() {
    formRef.validateFields().then(async (values) => {
      setLoading(true);
      let activeEnv = find(options, { active: true });
      if (activeEnv.id !== values.environment) {
        options.forEach((item) => {
          if (item.id !== 'default') {
            const dbLoad = { ...item, active: item.id === values.environment };
            updateDB(window.dbContext, dbLoad);
            if (dbLoad.active) {
              activeEnv = dbLoad;
            }
          }
        });
      }
      if (values.environment === 'default') {
        window.nameSpacesInfo = requestAPI();
      } else {
        window.nameSpacesInfo = extractNameSpaceInfoFromEnvs(activeEnv);
      }

      const response = await fetchLogin({ ...values, type: 'admin' });
      if (!dealResponse(response)) {
        window.sessionStorage.setItem('token', response.authorization);
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
              name="username"
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
              name="password"
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
                  name="environment"
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
                  <Spin indicator={<LoadingOutlined spin style={{ color: '#ffffff' }} />} />
                </div>
              ) : (
                <Button type="primary" onClick={goLogin} style={{ width: '100%' }}>
                  <FormattedMessage id={'app.login.button'} />
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>

      {/*  环境配置 */}
      <Modal
        destroyOnClose
        width={'60vw'}
        visible={visible}
        style={{ top: 30 }}
        maskClosable={false}
        closable={false}
        title={<FormattedMessage id='environmentManager.management' />}
        onOk={updateSelectOptions}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <EnvironmentManager />
      </Modal>
    </div>
  );
};
export default memo(Login);
