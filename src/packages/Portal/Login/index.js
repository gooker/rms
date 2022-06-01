import React, { memo, useEffect, useState } from 'react';
import { Button, Form, Input, Select, Spin } from 'antd';
import { LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { fetchLogin } from '@/services/global';
import requestAPI from '@/utils/requestAPI';
import {
  dealResponse,
  extractNameSpaceInfoFromEnvs,
  getAllEnvironments,
  getCustomEnvironments,
  isNull,
} from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import LoginBackPicture from '@/../public/images/login_pic.png';
import Logo from '@/../public/images/logoMain.png';
import styles from './Login.module.less';

const Login = (props) => {
  const { history } = props;

  const [formRef] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 挂载push函数
    window.history.$$push = history.push;
    const { allEnvs, activeEnv } = getAllEnvironments();
    setOptions(allEnvs);
    formRef.setFieldsValue({ environment: activeEnv });
  }, []);

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
                  message: <FormattedMessage id='app.login.username.required' />,
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
                  message: <FormattedMessage id='app.login.password.required' />,
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item name='environment'>
              <Select>
                {options.map(({ envName, id }) => (
                  <Select.Option key={id} value={id}>
                    {envName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
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
    </div>
  );
};
export default memo(Login);
