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
import { dealResponse, isNull, adjustModalWidth, isStrictNull } from '@/utils/utils';
import { addSysLang, getSysLang, getApplications } from '@/services/translator';
import ExcelTable from './component/ExcelTable.js';
import AddSysLang from './component/AddSysLang.js';
import ImportApplication from './component/ImportApplication';
import commonStyles from '@/common.module.less';
import _ from 'lodash';
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
    showLanguage: ['zh-CN', 'en-US'],
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
    dataList: {
      standard: [
        {
          languageKey: 'wcs.wcsException.task.redoErrorStatusError',
          languageMap: {
            'en-US': 'Tasks is neither cancelled nor completed and cannot be redone',
            'ko-KR': '작업은 취소도 아니고, 완성된 상태도 아니므로, 다시 할 수 없다',
            'vi-VN':
              'Nhiệm vụ không bị hủy bỏ cũng không được hoàn thành và không thể được thực hiện lại',
            'zh-CN': '任务既不是取消,也不是完成状态，不能重做',
          },
        },
        {
          languageKey: 'wcs.agvErrorDefinition.7002.errorName',
          languageMap: {
            'zh-CN': '电量异常',
            'en-US': 'Battery Level Abnormal',
            'ko-KR': '전기량 이상',
            'vi-VN': 'Mức Pin bất thường',
          },
        },
      ],
      custom: [
        {
          languageKey: 'wcs.wcsException.task.redoErrorStatusError',
          languageMap: {
            'en-US': 'Tasks is neithe',
            'ko-KR': '작업은 취소도 아',
            'vi-VN': 'Nhiệm vụ không bị hủy',
            'zh-CN': '任务既',
          },
        },
      ],
    },
    editList: {},
    filterValue: null,
    toggle: false,
  };

  componentDidMount() {
    // this.getSysLanguage();
    // this.getSysApplications();
    // 处理数据 
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

  getDifferenceObj = (object, base) => {
    function changes(object, base) {
      return _.transform(object, function (result, value, key) {
        if (!_.isEqual(value, base[key])) {
          result[key] =
            _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
        }
      });
    }
    return changes(object, base);
  };

  generateColumns = () => {
    const { showLanguage, displayMode } = this.state;
    const columns = [
      {
        title: 'KEY',
        width: 0.3,
        dataIndex: 'languageKey',
        readOnly: true,
      },
    ];
    if (showLanguage.length !== 0) {
      showLanguage.map((record) => {
        columns.push({
          title: record,
          dataIndex: record,
          readOnly: displayMode === 'standard' ? true : false,
        });
      });
    }
    return columns;
  };

  generateData = () => {
    const { displayMode, dataList, editList } = this.state;
    const deepList = _.cloneDeep(dataList);
    let currentData = [];
    if (displayMode === 'merge') {
      const standard = deepList['standard'];
      const custom = deepList['custom'];
      currentData = standard.map((item) => {
        const item_ = { ...item };
        return _.assign(
          item_,
          custom.find((record) => {
            return record && item_.languageKey === record.languageKey;
          }),
        );
      });
    } else {
      currentData = deepList[displayMode];
    }
    const data_ = _.sortBy(currentData, (o) => {
      return o.languageKey;
    });

    const allLanguage = data_.map((record, index) => {
      let record_ = record;
      if (editList && editList[record.languageKey] && displayMode !== 'standard') {
        record_ = editList[record.languageKey];
      }

      return {
        ...record_,
        ...record_.languageMap,
        uniqueKey: index,
      };
    });
    return allLanguage;
  };

  // 语种变化 应用变化 搜索 最后都调用此放大
  generateFilterLanguage = () => {
    const dataSorce = this.generateData();
    const { filterValue, showLanguage, toggle } = this.state;
    const obj = {};
    this.generateColumns().map((record) => {
      if (record.dataIndex) {
        obj[record.dataIndex] = true;
      }
    });
    let result = [];
    if (!isStrictNull(filterValue) && !isStrictNull(filterValue.trim())) {
      result = dataSorce.filter((record) => {
        let flag = false;
        _.forIn(record, (value, key) => {
          if (obj[key]) {
            if (value.toLocaleUpperCase().indexOf(filterValue.trim().toLocaleUpperCase()) !== -1) {
              flag = true;
            }
          }
        });
        return flag;
      });
    } else {
      result = dataSorce;
    }
    if (toggle) {
      result = result.filter((record) => {
        let flag = false;
        for (let index = 0; index < showLanguage.length; index++) {
          const element = showLanguage[index];
          if (isStrictNull(record[element])) {
            flag = true;
          }
        }
        return flag;
      });
    }
    return result;
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
    const {
      showLanguage,
      allLanguage,
      appCode,
      appList,
      displayMode,
      imporVisible,
      toggle,
      editList,
    } = this.state;
    let filterLanguage = [];
    filterLanguage = this.generateFilterLanguage();
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
                value={toggle}
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

          <Row style={{ marginTop: 5 }}>
            <ExcelTable
              loading={false}
              uniqueKey={'languageKey'}
              dataSource={filterLanguage}
              columns={this.generateColumns()}
              onChange={(newDatasource) => {
                // 应该全部比较 全不同才是对的
                const currentlist = { ...editList, ...newDatasource };
                this.setState({
                  editList: { ...editList, ...newDatasource },
                });
              }}
            />
          </Row>
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
          <ImportApplication appList={appList} appCode={appCode} />
        </Modal>
      </div>
    );
  }
}
export default LanguageManage;
