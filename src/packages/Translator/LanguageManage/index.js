import React from 'react';
import { Row, Col, Card, Form, Select, Button, Dropdown, Menu, Checkbox, Radio, Input,Drawer } from 'antd';
import {
  PlusCircleOutlined,
  ImportOutlined,
  ExportOutlined,
  AppstoreAddOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { formatMessage } from '@/utils/Lang';
import { isNull } from '@/utils/utils';
import AddSysLang from './component/AddSysLang.js';

const { Item: FormItem } = Form;

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
    addLangVisible:false,
    showLanguage: [],
    allLanguage: [
      {
        type: 'zh-CN',
        value: 1,
      },
      {
        type: 'en-US',
        value: 1,
      },
      {
        type: 'ko-KR',
        value: 1,
      },
      {
        type: 'vi-VN',
        value: 1,
      },
    ],
  };

  onModeChange = (e) => {
    this.setState({
      displayMode: e.target.value,
    });
  };

  addLanguage = () => {
    
  };

  addApplication = () => {};
  handleApplication=(value)=>{
    this.setState({
      appCode:value
    })
  }

  render() {
    const { showLanguage, allLanguage, appCode, appList, displayMode } = this.state;
    return (
      <div style={{ padding: 10 }}>
        <Card>
          <Row>
            <Col flex="400px">
              <FormItem
                label={formatMessage({ id: 'app.languageManage.displayMode' })}
                width={'100%'}
              >
                <Radio.Group onChange={this.onModeChange} value={displayMode}>
                  <Radio value="merge">{formatMessage({ id: 'app.languageManage.merge' })}</Radio>
                  <Radio value="standard">
                    {formatMessage({ id: 'app.languageManage.standard' })}
                  </Radio>
                  <Radio value="custom">{formatMessage({ id: 'app.languageManage.custom' })}</Radio>
                </Radio.Group>
              </FormItem>
            </Col>
            <Col flex="auto" style={{ textAlign: 'right' }}>
              <Button
                type="dashed"
                icon={<AppstoreAddOutlined />}
                onClick={() => {
                  this.addApplication();
                }}
              >
                {formatMessage({ id: 'app.languageManage.application' })}
              </Button>
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
                {formatMessage({ id: 'app.languageManage.import' })}
              </Button>
              <Dropdown
                disabled={isNull(appCode)}
                overlay={
                  <Menu onClick={this.export}>
                    <Menu.Item key="standard">
                      {formatMessage({ id: 'app.languageManage.standard' })}
                    </Menu.Item>
                    <Menu.Item key="custom">
                      {formatMessage({ id: 'app.languageManage.custom' })}
                    </Menu.Item>
                    <Menu.Item key="merge">
                      {formatMessage({ id: 'app.languageManage.merge' })}
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button icon={<ExportOutlined />}>
                  {formatMessage({ id: 'app.languageManage.export' })} <DownOutlined />
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
                {formatMessage({ id: 'app.languageManage.save' })}
              </Button>
              <Button
                type="link"
                style={{ cursor: 'pointer', color: '#1890FF', marginLeft: 40 }}
                onClick={() => {
                  this.setState({ showLocalUpdateHistroy: true });
                }}
              >
                {formatMessage({ id: 'app.languageManage.unsaved' })}:
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem label={<span>{formatMessage({ id: 'app.languageManage.language' })}</span>}>
                <Checkbox.Group
                  value={showLanguage}
                  onChange={(value) => {
                    this.setState({ showLanguage: value }, this.generateFilterLanguage);
                  }}
                >
                  {allLanguage.map((record) => (
                    <Checkbox key={record.value} value={record.type}>
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
                 this.setState({addLangVisible:false,})
                }}
              >
                <PlusCircleOutlined />
                新增语言
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={5}>
              <FormItem label={formatMessage({ id: 'app.languageManage.application' })}>
                <Select 
                value={appCode} 
                onChange={this.handleApplication} style={{ width: '100%' }}>
                  {appList.map((record) => (
                    <Select.Option key={record.code} value={record.code}>
                      {record.name}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>

            <Col flex="350px" offset={1}>
              <FormItem label={formatMessage({ id: 'app.languageManage.search' })}>
                <Input
                  allowClear
                  placeholder={formatMessage({
                    id: 'app.languageManage.enterSearchKeywords',
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
                {formatMessage({ id: 'app.languageManage.onlyShowMissing' })}
              </Checkbox>
            </Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 20 }}>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
        
         {/*新增语言  */}
        <Drawer
          title="添加语种"
          destroyOnClose={true}
          maskClosable={false}
          mask={true}
          width={350}
          onClose={()=>{this.setState({addLangVisible:false})}}
          visible={this.state.addLangVisible}
        >
           <AddSysLang></AddSysLang>
        </Drawer>
      </div>
    );
  }
}
export default LanguageManage;
