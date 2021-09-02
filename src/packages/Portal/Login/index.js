import React, { Component } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { connect } from '@/utils/dva';
import history from '@/history';
import { fetchFindLogoByWebAddress, fetchLogin, fetchUpdateEnvironment } from '@/services/global';
import { dealResponse, formatMessage, isNull } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './Login.module.less';
import LoginBackPicture from '../images/login_pic.png';
import Logo from '../images/logoMain.png';
import { getEnvOptionData, getActiveEnv } from './selector';
@connect(({ global }) => ({
  environments: getEnvOptionData(global.environments),
  activeEnv: getActiveEnv(global.environments),
}))
class Login extends Component {
  state = {
    logo: null,
    loading: false,
  };

  async componentDidMount() {
    const address = window.location.host;
    const response = await fetchFindLogoByWebAddress(address);
    if (dealResponse(response)) {
      this.setState({ logo: null });
    } else {
      if (response.code !== '2') {
        this.setState({ logo: response });
      }
    }
  }

  onFinish = async (values) => {
    this.setState({ loading: true });

    // 开始登陆
    const _values = { ...values };
    delete _values.environment;
    const response = await fetchLogin({ ..._values, type: 'admin' });

    this.setState({ loading: false });
    if (dealResponse(response)) {
      message.error(formatMessage({ id: response.message || 'app.login.fail' }));
    } else {
      window.localStorage.setItem('Authorization', response.authorization);
      // 如果有environment字段说明需要重新激活一个环境
      if (!isNull(values.environment)) {
        let requestBody = { appCode: 'MixRobot' };
        if (values.environment !== '0') {
          requestBody = { appCode: 'MixRobot', id: values.environment };
        }
        const updateEnvResponse = await fetchUpdateEnvironment(requestBody);
        if (dealResponse(updateEnvResponse)) {
          return;
        }
      }
      // TODO:
      //   await initI18nInstance();
      history.push('/');
    }
  };

  render() {
    const { logo, loading } = this.state;
    const { environments, activeEnv } = this.props;
    return (
      <div className={styles.loginPage}>
        <img src={LoginBackPicture} alt={'login_picture'} className={styles.loginBackPicture} />
        <div className={styles.loginPanel}>
          <div className={styles.logo}>
            <img src={logo || Logo} alt={'logo'} className={styles.logoPicture} />
          </div>
          <div className={styles.loginForm}>
            <Form onFinish={this.onFinish}>
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
              {environments && environments.length > 0 && (
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
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ width: '100%' }}
                >
                  <FormattedMessage id={'app.login.button'} />
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
