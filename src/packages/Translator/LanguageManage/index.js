import React from 'react';
import {
  Row,
  Col,
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
import XLSX from 'xlsx';
import { formatMessage } from '@/utils/Lang';
import { dealResponse, isNull, adjustModalWidth, isStrictNull } from '@/utils/utils';
import { addSysLang, getSysLang, getApplications } from '@/services/translator';
import ExcelTable from './component/ExcelTable.js';
import AddSysLang from './component/AddSysLang.js';
import ImportApplication from './component/ImportApplication';
import commonStyles from '@/common.module.less';
import { sortBy, cloneDeep, forIn } from 'lodash';

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
    standardData: [],
    customData: [],
    mergeData: [],
    editList: {},
    filterValue: null,
    toggle: false,
  };

  componentDidMount() {
    // this.getSysLanguage();
    // this.getSysApplications();
    // 处理3种状态的初始化数据
    const { dataList } = this.state;
    const standardData = dataList['standard'];
    const customData = dataList['custom'];
    const mergeData = [...standardData].map((item) => {
      let item_ = { ...item };
      const record_ = customData.filter((record) => item_.languageKey === record.languageKey);
      if (record_.length > 0) {
        item_ = record_[0];
      }
      return item_;
    });

    this.setState({
      standardData: sortBy(standardData, (o) => {
        return o.languageKey;
      }),
      customData: sortBy(customData, (o) => {
        return o.languageKey;
      }),
      mergeData: sortBy(mergeData, (o) => {
        return o.languageKey;
      }),
    });
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
          readOnly: displayMode === 'merge' ? false : true,
        });
      });
    }
    return columns;
  };

  generateData = () => {
    const { displayMode, standardData, customData, mergeData, editList } = this.state;
    let allShowData = [];
    if (displayMode === 'merge') {
      allShowData = mergeData;
    } else if (displayMode === 'standard') {
      allShowData = standardData;
    } else {
      allShowData = customData;
    }

    const showData_ = cloneDeep(allShowData).map((record, index) => {
      let record_ = { ...record };
      if (
        displayMode === 'merge' &&
        editList &&
        Object.keys(editList).includes(record.languageKey)
      ) {
        record_ = editList[record.languageKey];
      }

      return {
        ...record_,
        ...record_.languageMap,
        uniqueKey: index,
      };
    });
    return showData_;
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
        forIn(record, (value, key) => {
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

  //
  exportExecl = (type) => {
    const { standardData, customData, mergeData, appCode } = this.state;
    const { key } = type;
    let allShowData = [];
    if (key === 'merge') {
      allShowData = mergeData;
    } else if (key === 'standard') {
      allShowData = standardData;
    } else {
      allShowData = customData;
    }
    const modeText = {
      merge: formatMessage({ id: 'translator.languageManage.merge' }),
      standard: formatMessage({ id: 'translator.languageManage.standard' }),
      custom: formatMessage({ id: 'translator.languageManage.custom' }),
    };
    const data_ = allShowData.map((record) => {
      return {
        languageKey: record.languageKey,
        ...record.languageMap,
      };
    });
    const ws = XLSX.utils.json_to_sheet(data_); /* 新建空workbook，然后加入worksheet */
    const wb = XLSX.utils.book_new(); /*新建book*/
    XLSX.utils.book_append_sheet(wb, ws, 'People'); /* 生成xlsx文件(book,sheet数据,sheet命名) */
    XLSX.writeFile(wb, `${modeText[key]}语言文件包-${appCode}.xlsx`); /*写文件(book,xlsx文件名称)*/
  };

  // 导入
  importApplicate = (data) => {
    const obj = {};
    const { standardData } = this.state;
    standardData.map((record) => {
      obj[record.languageKey] = record.languageMap;
    });
  };

  submitLanguage = async (value) => {
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
      mergeData,
    } = this.state;
    const filterLanguage = this.generateFilterLanguage() || [];
    return (
      <div className={commonStyles.globalPageStyle}>
        <div>
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
                {`${formatMessage({ id: 'translator.languageManage.unsaved' })} :
                   ${Object.keys(editList).length}
                  `}
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
                  <Menu onClick={this.exportExecl}>
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
        </div>
        <div style={{ marginTop: 20 }}>
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
              mergeData={mergeData}
              onChange={(newDatasource, flag) => {
                // 应该全部比较 全不同才是对的
                const key = Object.keys(newDatasource);
                let currentlist = { ...editList };
                if (flag && key) {
                  delete currentlist[key[0]];
                } else {
                  currentlist = { ...editList, ...newDatasource };
                }
                this.setState({
                  editList: currentlist,
                });
              }}
            />
          </Row>
        </div>

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
          <ImportApplication
            appList={appList}
            appCode={appCode}
            importApplicate={this.importApplicate}
          />
        </Modal>
      </div>
    );
  }
}
export default LanguageManage;
