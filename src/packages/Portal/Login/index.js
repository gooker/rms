import React, { memo, useState, useEffect } from 'react';
import { Form, Input, Select, Button, Spin } from 'antd';
import { LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { fetchLogin, fetchUpdateEnvironment } from '@/services/global';
import { dealResponse, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { getEnvOptionData, getActiveEnv } from './selector';
import LoginBackPicture from '@/../public/images/login_pic.png';
import Logo from '@/../public/images/logoMain.png';
import styles from './Login.module.less';
import requestAPI from '@/utils/requestAPI';
import { getLocalStorageEnv } from '@/utils/init';

const Login = (props) => {
  const { environments, activeEnv, history } = props;
  const [loading, setLoading] = useState(false);

  // 挂载push函数
  window.history.$$push = history.push;

  useEffect(() => {
    init();
  }, []);

  async function init() {
    // 刚进入页面需要首先处理namespace数据
    let urlDir = { ...requestAPI() }; // 所有的url链接地址信息
    const envs = getLocalStorageEnv();
    urlDir = { ...urlDir, ...envs };
    window.sessionStorage.setItem('nameSpacesInfo', JSON.stringify(urlDir));
  }

  async function onFinish(values) {
    setLoading(true);
    const _values = { ...values };
    delete _values.environment;
    const response = await fetchLogin({ ..._values, type: 'admin' });
    if (!dealResponse(response)) {
      window.sessionStorage.setItem('token', response.authorization);
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
    } else {
      setLoading(false);
    }
  }
  return (
    <div className={styles.loginPage}>
      <img src={LoginBackPicture} alt={'login_picture'} className={styles.loginBackPicture} />
      <div className={styles.loginPanel}>
        <div className={styles.logo}>
          <img src={Logo} alt={'logo'} className={styles.logoPicture} />
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
        </div>
      </div>
    </div>
  );
};
export default connect(({ global }) => ({
  environments: getEnvOptionData(global.environments),
  activeEnv: getActiveEnv(global.environments),
}))(memo(Login));
