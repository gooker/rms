import React, { memo, useState, useEffect } from 'react';
import { Form, Input, Select, Button, Spin } from 'antd';
import { LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RcsDva';
import {
  fetchLogin,
  fetchAppVersion,
  fetchUpdateEnvironment,
  fetchFindLogoByWebAddress,
} from '@/services/global';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { getEnvOptionData, getActiveEnv } from './selector';
import LoginBackPicture from '@/../public/images/login_pic.png';
import Logo from '@/../public/images/logoMain.png';
import styles from './Login.module.less';

const Login = (props) => {
  const { environments, activeEnv, history } = props;
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(null);
  const [appVersion, setAppVersion] = useState(null);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const address = window.location.host;
    const [appLogo, _appVersion] = await Promise.all([
      fetchFindLogoByWebAddress(address),
      fetchAppVersion(),
    ]);
    if (!dealResponse(appLogo)) {
      if (appLogo.code !== '2') {
        setLogo(appLogo);
      }
    }
    if (!dealResponse(_appVersion)) {
      setAppVersion(_appVersion);
    }
  }

  async function onFinish(values) {
    setLoading(true);
    const _values = { ...values };
    delete _values.environment;
    const response = await fetchLogin({ ..._values, type: 'admin' });
    if (!dealResponse(response, false, null, formatMessage({ id: 'app.login.fail' }))) {
      window.localStorage.setItem('Authorization', response.authorization);
      // 如果有environment字段说明需要重新激活一个环境
      if (!isNull(values.environment)) {
        const requestBody = { id: values.environment === 0 ? null : values.environment };
        const updateEnvResponse = await fetchUpdateEnvironment(requestBody);
        if (dealResponse(updateEnvResponse)) {
          return;
        }
      }
      setLoading(false);
      history.push('/');
    }
  }
  return (
    <div className={styles.loginPage}>
      <img src={LoginBackPicture} alt={'login_picture'} className={styles.loginBackPicture} />
      <div className={styles.loginPanel}>
        <div className={styles.logo}>
          <img src={logo || Logo} alt={'logo'} className={styles.logoPicture} />
        </div>
        <div className={styles.loginForm}>
          <Form onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="app.login.username.required" />,
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
                  message: <FormattedMessage id="app.login.password.required" />,
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            {environments.length > 0 && (
              <Form.Item name="environment" initialValue={activeEnv?.id}>
                <Select>
                  {environments.map(({ label, value }) => (
                    <Select.Option key={value} value={value}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            <Form.Item>
              {loading ? (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <Spin indicator={<LoadingOutlined spin style={{ color: '#fff' }} />} />
                </div>
              ) : (
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  <FormattedMessage id={'app.login.button'} />
                </Button>
              )}
            </Form.Item>
          </Form>
          {appVersion && (
            <div style={{ textAlign: 'center', fontSize: 16, color: '#fff' }}>
              v{appVersion.versionMap?.MixRobot?.version}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default connect(({ global }) => ({
  environments: getEnvOptionData(global.environments),
  activeEnv: getActiveEnv(global.environments),
}))(memo(Login));
