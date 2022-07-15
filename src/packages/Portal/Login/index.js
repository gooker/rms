import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { LoadingOutlined, LockOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { dealResponse, extractNameSpaceInfoFromEnvs, formatMessage, getAllEnvironments, isNull } from '@/utils/util';
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

  /**
   * @type {React.MutableRefObject<HTMLImageElement>}
   */
  const eggRef = React.useRef(null);
  const eggValue = React.useRef({}); // mousedown时记录的clientX
  const controllerRef = React.useRef(null); // axios 取消请求控制器

  const [formRef] = Form.useForm();
  const [allEnvironments, setAllEnvironments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.RMS.push = history.push;

    if (!window.isProductionEnv) {
      window.localStorage.setItem('dev', 'true');
    }

    init();

    /********************* 一个彩蛋 *********************/
    function mousedownCb(ev) {
      eggValue.current.clientX = ev.clientX;
    }
    function dragendCb(ev) {
      const { left, right } = eggRef.current.getBoundingClientRect();
      if (
        eggValue.current.clientX > ev.clientX &&
        eggValue.current.clientX - ev.clientX > left * 0.5
      ) {
        window.localStorage.setItem('dev', 'true');
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
      if (
        ev.clientX > eggValue.current.clientX &&
        ev.clientX - eggValue.current.clientX > right * 0.5
      ) {
        window.localStorage.removeItem('dev');
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
      eggValue.current = {};
    }

    const targetNode = eggRef.current;
    targetNode.addEventListener('pointerdown', mousedownCb);
    targetNode.addEventListener('dragend', dragendCb);
    return () => {
      targetNode.removeEventListener('pointerdown', mousedownCb);
      targetNode.removeEventListener('dragend', dragendCb);
    };
  }, []);

  // 获取所有自定义环境
  async function init() {
    const { allEnvs, activeEnv } = await getAllEnvironments(window.dbContext);
    setAllEnvironments(allEnvs);
    if (window.localStorage.getItem('dev') === 'true') {
      formRef.setFieldsValue({ environment: activeEnv });
    }
  }

  async function updateSelectOptions() {
    const _options = await selectAllDB(window.dbContext);
    setAllEnvironments(_options);
    setVisible(false);
  }

  async function goLogin() {
    formRef.validateFields().then(async (values) => {
      controllerRef.current = new AbortController();
      setLoading(true);
      if (isNull(values.environment)) {
        // 防止存在本地nginx部署问题
        const { activeEnv } = await getAllEnvironments(window.dbContext);
        values.environment = activeEnv;
      }
      let activeEnv = find(allEnvironments, { active: true });
      if (activeEnv.id !== values.environment) {
        allEnvironments.forEach((item) => {
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
      const response = await fetchLogin(values, {
        signal: controllerRef.current.signal,
      });
      if (!dealResponse(response)) {
        window.sessionStorage.setItem('token', response.authorization);
        history.push('/');
      } else {
        setLoading(false);
      }
    });
  }

  function cancelLogin() {
    if (controllerRef.current instanceof AbortController) {
      controllerRef.current.controller.abort();
    }
  }

  return (
    <div className={styles.loginPage}>
      <img src={LoginBackPicture} alt={'login_picture'} className={styles.loginBackPicture} />
      <div className={styles.loginPanel}>
        <div className={styles.logo}>
          <img src={Logo} alt={'logo'} className={styles.logoPicture} ref={eggRef} />
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

            {window.localStorage.getItem('dev') === 'true' && (
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
                      {allEnvironments.map(({ envName, id }) => (
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
            )}

            <Form.Item>
              {loading ? (
                <Button onClick={cancelLogin} style={{ width: '100%' }}>
                  <LoadingOutlined /> <FormattedMessage id={'app.login.cancelLogin'} />
                </Button>
              ) : (
                <Button type='primary' onClick={goLogin} style={{ width: '100%' }}>
                  <FormattedMessage id={'app.login.login'} />
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
