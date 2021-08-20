import React from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Select,
  Button,
  Dropdown,
  Menu,
  Checkbox,
  Radio,
  Input,
  Modal,
  Divider,
} from 'antd';
import {
  PlusCircleOutlined,
  ImportOutlined,
  ExportOutlined,
  AppstoreAddOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { formatMessage } from '@/utils/Lang';
import { dealResponse, isNull, adjustModalWidth } from '@/utils/utils';
import { addSysLang, getSysLang, getApplications } from '@/services/translator';
import AddSysLang from './component/AddSysLang.js';
import ImportApplication from './component/ImportApplication';
import commonStyles from '@/common.module.less';
// import styles from './translator.module.less';

const { Item: FormItem } = Form;
const modalWidth = adjustModalWidth() * 0.6;
class LanguageManage extends React.Component {
  state = {
    displayMode: 'merge',
    appCode: null,
    appList: [
      {
        code: 'wcs',
        name: 'WCS_GUI',
      },
      {
        code: 'wcs-service',
        name: 'WCS-Service',
      },
      {
        code: 'map-tool',
        name: 'Map-Tool',
      },
    ],
    imporVisible: false,
    addLangVisible: false,
    showLanguage: [],
    allLanguage: [
      {
        type: 'zh-CN',
        name: 'zh-CN',
      },
      {
        type: 'en-US',
        name: 'en-US',
      },
      {
        type: 'ko-KR',
        name: 'ko-KR',
      },
      {
        type: 'vi-VN',
        name: 'vi-VN',
      },
    ],
  };

  componentDidMount() {
    // this.getSysLanguage();
    // this.getSysApplications();
  }

  onModeChange = (e) => {
    this.setState({
      displayMode: e.target.value,
    });
  };

  // 获取语言
  getSysLanguage = async () => {
    const langData = await getSysLang();
    if (!dealResponse(langData)) {
      this.setState({ allLanguage: langData });
    }
  };

  // 获取应用
  getSysApplications = async () => {
    const moduleData = await getApplications();
    if (!dealResponse(moduleData)) {
      this.setState({ appList: moduleData });
    }
  };

  submitLanguage = async (value) => {
    console.log(value);
    const response = await addSysLang(value);
    if (!dealResponse(response)) {
      this.getSysLanguage();
    }
    this.setState({ addLangVisible: false });
  };

  addApplication = () => {};
  handleApplication = (value) => {
    this.setState({
      appCode: value,
    });
  };

  render() {
    const { showLanguage, allLanguage, appCode, appList, displayMode, imporVisible } = this.state;
    return (
      <div className={commonStyles.globalPageStyle}>
        <Card>
          <Row>
            <Col>
              <FormItem
                label={<span>{formatMessage({ id: 'translator.languageManage.language' })}</span>}
              >
                <Checkbox.Group
                  value={showLanguage}
                  onChange={(value) => {
                    this.setState({ showLanguage: value }, this.generateFilterLanguage);
                  }}
                >
                  {allLanguage.map((record) => (
                    <Checkbox key={record.name} value={record.type}>
                      {record.type}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </FormItem>
            </Col>

            <Col offset={1}>
              <Button
                style={{ width: '100%' }}
                type="link"
                onClick={() => {
                  this.setState({ addLangVisible: true });
                }}
                icon={<PlusCircleOutlined />}
              >
                {formatMessage({ id: 'translator.languageManage.addlanguage' })}
              </Button>
            </Col>

            <Col flex="auto" className={commonStyles.textRight}>
              <Button
                type="link"
                style={{ cursor: 'pointer', color: '#1890FF', marginLeft: 40 }}
                onClick={() => {
                  this.setState({ showLocalUpdateHistroy: true });
                }}
              >
                {formatMessage({ id: 'translator.languageManage.unsaved' })}:
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <FormItem label={formatMessage({ id: 'translator.languageManage.application' })}>
                <Select
                  value={appCode}
                  onChange={this.handleApplication}
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                        <Button
                          style={{ marginLeft: 'auto', textAlign: 'right' }}
                          type="link"
                          icon={<AppstoreAddOutlined />}
                          onClick={() => {
                            this.addApplication();
                          }}
                        >
                          {formatMessage({ id: 'translator.languageManage.addapplication' })}
                        </Button>
                      </div>
                    </div>
                  )}
                >
                  {appList.map((record) => (
                    <Select.Option key={record.code} value={record.code}>
                      {record.name}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>

            <Col flex="none" offset={1}>
              <FormItem label={formatMessage({ id: 'app.button.search' })}>
                <Input
                  allowClear
                  placeholder={formatMessage({
                    id: 'translator.languageManage.enterSearchKeywords',
                  })}
                  onChange={({ target: { value } }) => {
                    this.setState({ filterValue: value }, this.generateFilterLanguage);
                  }}
                />
              </FormItem>
            </Col>
            <Col offset={1}>
              <Checkbox
                value="0"
                onChange={({ target: { checked } }) => {
                  this.setState({ toggle: checked }, this.generateFilterLanguage);
                }}
              >
                {formatMessage({ id: 'translator.languageManage.onlyShowMissing' })}
              </Checkbox>
            </Col>
            <Col flex="auto" className={commonStyles.textRight}>
              <Button
                style={{ margin: '0 20px 0 20px' }}
                icon={<ImportOutlined />}
                disabled={isNull(appCode)}
                onClick={() => {
                  this.setState({
                    imporVisible: true,
                  });
                }}
              >
                {formatMessage({ id: 'app.button.import' })}
              </Button>
              <Dropdown
                disabled={isNull(appCode)}
                overlay={
                  <Menu onClick={this.export}>
                    <Menu.Item key="standard">
                      {formatMessage({ id: 'translator.languageManage.standard' })}
                    </Menu.Item>
                    <Menu.Item key="custom">
                      {formatMessage({ id: 'translator.languageManage.custom' })}
                    </Menu.Item>
                    <Menu.Item key="merge">
                      {formatMessage({ id: 'translator.languageManage.merge' })}
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button icon={<ExportOutlined />}>
                  {formatMessage({ id: 'app.button.export' })} <DownOutlined />
                </Button>
              </Dropdown>

              <Button
                style={{ marginLeft: 20 }}
                disabled={isNull(appCode)}
                type="primary"
                onClick={() => {
                  const { dispatch } = this.props;
                  dispatch({
                    type: 'languageManage/synchronousData',
                    payload: { appCode },
                  }).then((response) => {
                    this.setState({
                      differ: true,
                      targetData: response,
                    });
                  });
                }}
              >
                {formatMessage({ id: 'app.button.save' })}
              </Button>
            </Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 20 }}>
          <Row>
            <Col>
              <FormItem
                label={formatMessage({ id: 'translator.languageManage.displayMode' })}
                width={'100%'}
              >
                <Radio.Group onChange={this.onModeChange} value={displayMode}>
                  <Radio value="merge">
                    {formatMessage({ id: 'translator.languageManage.merge' })}
                  </Radio>
                  <Radio value="standard">
                    {formatMessage({ id: 'translator.languageManage.standard' })}
                  </Radio>
                  <Radio value="custom">
                    {formatMessage({ id: 'translator.languageManage.custom' })}
                  </Radio>
                </Radio.Group>
              </FormItem>
            </Col>
          </Row>

          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>

        {/*新增语言  */}
        <Modal
          title="添加语种"
          destroyOnClose={true}
          maskClosable={false}
          mask={true}
          width={550}
          onCancel={() => {
            this.setState({ addLangVisible: false });
          }}
          footer={null}
          visible={this.state.addLangVisible}
        >
          <AddSysLang allLanguage={allLanguage} onAddLang={this.submitLanguage} />
        </Modal>

        {/* 导入 */}
        <Modal
          width={modalWidth}
          footer={null}
          destroyOnClose
          visible={imporVisible}
          onCancel={() => {
            this.setState({
              imporVisible: false,
            });
          }}
        >
          <ImportApplication />
        </Modal>
      </div>
    );
  }
}
export default LanguageManage;
