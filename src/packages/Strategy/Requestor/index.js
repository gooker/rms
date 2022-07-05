import React from 'react';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { Button, Dropdown, Input, List, Menu, message, Modal, Tabs } from 'antd';
import {
  ApiOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { adaptModalHeight, dealResponse, formatMessage, isNull } from '@/utils/util';
import { getRequestorURLParams, getURL, renderRequestBodyForm } from './requestorUtil';
import { fetchDeleteAPI, fetchRequestorList, fetchSaveAPI, fetchUpdateAPI } from '@/services/commonService';
import RequestorForm from './components/RequestorForm';
import RequestConfig from './components/RequestConfig';
import request from '@/utils/request';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';
import styles from './requestor.module.less';
import RmsConfirm from '@/components/RmsConfirm';

const { TabPane } = Tabs;
const messageKey = 'MESSAGE_KEY';
class Index extends React.Component {
  requestBodyForm = React.createRef();

  state = {
    apiList: [],
    requestConfig: {}, // 当前选中接口的请求配置
    response: {}, // 只针对 "立即执行"

    active: null, // 当前点击的条目
    editing: null, // 当前编辑的接口
    activeKey: null, // Tab
    running: null, // 当前正在执行的API ID

    uploadVisible: false,
    modalVisible: false,
  };

  componentDidMount() {
    this.getApiList();
  }

  getApiList = async () => {
    const response = await fetchRequestorList();
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.requestor.tip.getApi.fail' }));
    } else {
      this.setState({ apiList: response });
    }
  };

  editAPI = (api) => {
    this.setState({ editing: api, modalVisible: true });
  };

  deleteAPI = (api) => {
    const _this = this;
    RmsConfirm({
      content: formatMessage({ id: 'app.requestor.tip.delete.confirm' }),
      onOk: async () => {
        const { active } = _this.state;
        const response = await fetchDeleteAPI([api.id]);
        if (dealResponse(response)) {
          message.error(formatMessage({ id: 'app.requestor.tip.delete.failed' }));
        } else {
          message.success(formatMessage({ id: 'app.requestor.tip.delete.success' }));
          if (active && active.id === api.id) {
            _this.setState({
              active: null,
              activeKey: null,
              requestConfig: {},
            });
          }
          _this.getApiList();
        }
      },
    });
  };

  submit = async (value) => {
    const { editing } = this.state;
    let response;
    if (editing) {
      response = await fetchUpdateAPI(value);
    } else {
      response = await fetchSaveAPI(value);
    }
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.requestor.tip.saveApi.fail' }));
    } else {
      message.success(formatMessage({ id: 'app.requestor.tip.saveApi.success' }));
      this.setState({
        modalVisible: false,
        active: null,
        editing: null,
        activeKey: null,
        requestConfig: {},
      });
      this.getApiList();
    }
  };

  // 选择某个接口
  clickListItem = (api) => {
    const { active } = this.state;
    if (active?.id !== api.id) {
      if (this.requestBodyForm.current) {
        this.requestBodyForm.current.resetFields();
      }
      this.setState({ active: api, activeKey: '1', requestConfig: {} });
    }
  };

  // 渲染接口列表
  renderListItem = (item) => {
    const { active, running } = this.state;
    const { id, name, description, vehicleType } = item;
    return (
      <div
        onClick={() => {
          this.clickListItem(item);
        }}
        className={styles.listItem}
        style={{
          ...(running && active.id === id && { border: '1px solid #31C833' }),
          background: active?.id === id ? '#f0f0f0' : '#fff',
        }}
      >
        <List.Item
          actions={[
            <EditOutlined
              key="edit"
              onClick={(ev) => {
                ev.stopPropagation();
                this.editAPI(item);
              }}
            />,
            <DeleteOutlined
              key="delete"
              onClick={(ev) => {
                ev.stopPropagation();
                this.deleteAPI(item);
              }}
            />,
          ]}
        >
          <List.Item.Meta
            avatar={
              <div className={styles.avatar}>
                {vehicleType ? vehicleType.substring(0, 1) : <ApiOutlined />}
              </div>
            }
            title={name}
            description={description || formatMessage({ id: 'app.requestor.log.noDescription' })}
          />
        </List.Item>
      </div>
    );
  };

  // 运行配置更新回调
  onRequestConfigChanged = (requestConfig) => {
    const _requestConfig = { ...requestConfig };
    if (_requestConfig.endTime) {
      _requestConfig.endTime = _requestConfig.endTime.format('HH:mm:00');
    }
    this.setState({ requestConfig: _requestConfig, response: {} });
  };

  // 管理按钮回调
  onMenuClick = ({ key }) => {
    if (key === 'export') {
      const { apiList } = this.state;
      const file = new File([JSON.stringify(apiList, null, 2)], 'request-api.json', {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(file);
    }
    if (key === 'import') {
      this.setState({ uploadVisible: true });
    }
  };

  // 切换运行时Loading状态
  switchExecuteSpin = (visible, isSuccess, apiID) => {
    if (visible) {
      message.loading({
        content: formatMessage({ id: 'app.requestor.tip.exeuting' }),
        key: messageKey,
        duration: 0,
      });
      this.setState({ running: apiID });
    } else {
      if (isSuccess) {
        message.success({
          content: formatMessage({ id: 'app.requestor.tip.execute.success' }),
          key: messageKey,
          duration: 2,
        });
      } else {
        message.error({
          content: formatMessage({ id: 'app.requestor.tip.execute.failed' }),
          key: messageKey,
          duration: 2,
        });
      }
      this.setState({ running: null });
    }
  };

  // 发送请求
  sendRequest = async () => {
    const { active, requestConfig } = this.state;
    const formValue = this.requestBodyForm.current.getFieldsValue();

    let requestBody;
    // 特殊Case: 对于非{}形式的参数
    if (formValue.placeholder) {
      requestBody = formValue.placeholder;
    } else {
      requestBody = { ...formValue };
    }

    // 解析并替换请求URL中的参数
    let requestURL = active.url;
    const requestURLParams = getRequestorURLParams(requestURL);
    requestURLParams.forEach((param) => {
      requestURL = requestURL.replace(`{{${param}}}`, requestBody[param]);
      delete requestBody[param];
    });

    // 请求器
    async function fetchRequest() {
      return request(requestURL, {
        method: active.method,
        data: requestBody,
        headers: active.header,
      });
    }

    // 开始请求
    this.switchExecuteSpin(true, null, active.id);
    if (requestConfig.category === 0) {
      const response = await fetchRequest();
      if (dealResponse(response)) {
        this.switchExecuteSpin(false, false);
      } else {
        this.setState({ response });
        this.switchExecuteSpin(false, true);
      }
    } else {
      const { interval, endTime } = requestConfig;
      if (interval && interval > 0) {
        this.intervalRequest = setInterval(() => {
          // 指定时间结束
          if (endTime) {
            const endTimeMoment = moment(endTime, 'HH:mm:ss');
            const stopInterval = moment().isAfter(endTimeMoment);
            if (stopInterval) {
              clearInterval(this.intervalRequest);
              this.intervalRequest = null;
              this.switchExecuteSpin(false, true);
            }
          }
          fetchRequest();
        }, interval);
      }
    }
  };

  render() {
    const {
      apiList,
      uploadVisible,
      modalVisible,
      active,
      editing,
      requestConfig,
      activeKey,
      running,
    } = this.state;
    const requestURL = getURL(active?.url);

    const menu = (
      <Menu onClick={this.onMenuClick}>
        <Menu.Item key='export' disabled={apiList.length === 0}>
          <ExportOutlined /> <FormattedMessage id='app.button.download' />
        </Menu.Item>
        <Menu.Item key='import'>
          <ImportOutlined /> <FormattedMessage id='app.button.upload' />
        </Menu.Item>
      </Menu>
    );

    return (
      <div className={commonStyles.commonPageStyle} style={{ flexFlow: 'row nowrap' }}>
        <div className={styles.leftPanel}>
          <div className={styles.leftPanelTop}>
            <Button
              type="primary"
              onClick={() => {
                this.setState({ modalVisible: true });
              }}
            >
              <PlusOutlined /> <FormattedMessage id="app.button.add" />
            </Button>
            <Dropdown arrow overlay={menu}>
              <Button style={{ marginLeft: 20 }} onClick={this.exportAPIList}>
                <FormattedMessage id="app.requestor.manage" />
              </Button>
            </Dropdown>
            <Button style={{ marginLeft: 20 }} onClick={this.getApiList}>
              <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </div>
          <div className={styles.leftPanelBottom}>
            <List itemLayout="horizontal" dataSource={apiList} renderItem={this.renderListItem} />
          </div>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.urlBlock}>
            <span className={styles.urlMethod}>{active?.method}</span>
            <Input
              value={requestURL}
              style={{ flex: 1, height: 40, margin: '0 20px', borderRadius: 5 }}
            />
            <Button
              type="primary"
              // 没有点击API，当前API无法生成URL, 没有选择执行方式、当前正在执行任务
              disabled={
                !active || !requestURL || isNull(requestConfig?.category) || running !== null
              }
              onClick={this.sendRequest}
              style={{ height: 40, borderRadius: 5 }}
            >
              <FormattedMessage id="app.requestor.action.sendRequest" />
            </Button>
          </div>
          <div className={styles.configBlock}>
            <Tabs
              activeKey={activeKey}
              onChange={(tabKey) => {
                this.setState({ activeKey: tabKey });
              }}
            >
              <TabPane
                key="1"
                disabled={!active}
                tab={formatMessage({ id: 'app.requestor.tabs.requestBody' })}
              >
                {renderRequestBodyForm(active, this.requestBodyForm)}
              </TabPane>
              <TabPane
                key="2"
                disabled={!active}
                tab={formatMessage({ id: 'app.requestor.tabs.requestConfig' })}
              >
                <RequestConfig
                  id={active?.id}
                  value={requestConfig}
                  onChange={this.onRequestConfigChanged}
                />
              </TabPane>
              {requestConfig.category === 0 && (
                <TabPane
                  key="3"
                  disabled={!active}
                  tab={formatMessage({ id: 'app.requestor.tabs.requestResponse' })}
                >
                  <div>
                    <pre>{JSON.stringify(this.state.response, null, 4)} </pre>
                  </div>
                </TabPane>
              )}
            </Tabs>
          </div>
        </div>

        {/* 新增 & 更新 */}
        <Modal
          destroyOnClose
          footer={null}
          maskClosable={false}
          visible={modalVisible}
          width={850}
          title={formatMessage({ id: 'app.requestor.add' })}
          onCancel={() => {
            this.setState({ modalVisible: false, editing: null });
          }}
          style={{ top: 30 }}
          bodyStyle={{ maxHeight: adaptModalHeight(), overflow: 'auto' }}
        >
          <RequestorForm apiData={editing} submit={this.submit} />
        </Modal>

        {/* 导入 */}
        {/*<UploadUtils*/}
        {/*  onCancel={() => {*/}
        {/*    this.setState({ uploadVisible: false });*/}
        {/*  }}*/}
        {/*  visible={uploadVisible}*/}
        {/*  analyzeFunction={async (value) => {*/}
        {/*    if (value && Array.isArray(value)) {*/}
        {/*      const requestBody = value.map((item) => ({*/}
        {/*        name: item.name,*/}
        {/*        description: item.description,*/}
        {/*        url: item.url,*/}
        {/*        method: item.method,*/}
        {/*        header: item.header,*/}
        {/*        body: item.body,*/}
        {/*        comment: item.comment,*/}
        {/*        vehicleType: item.vehicleType,*/}
        {/*      }));*/}
        {/*      const response = await fetchBatchSaveAPI(requestBody);*/}
        {/*      if (dealResponse(response)) {*/}
        {/*        message.error(formatMessage({ id: 'app.uploader.uploadFailure' }));*/}
        {/*      } else {*/}
        {/*        message.success(formatMessage({ id: 'app.uploader.uploadSuccess' }));*/}
        {/*        this.setState({ uploadVisible: false });*/}
        {/*        this.getApiList();*/}
        {/*      }*/}
        {/*    }*/}
        {/*  }}*/}
        {/*/>*/}
      </div>
    );
  }
}
export default Index;
