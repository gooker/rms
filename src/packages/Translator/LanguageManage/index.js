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
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';
import XLSX from 'xlsx';
import { sortBy, cloneDeep, forIn, isEqual } from 'lodash';
import { formatMessage } from '@/utils/Lang';
import { dealResponse, isNull, adjustModalWidth, isStrictNull } from '@/utils/utils';
import {
  addApplication,
  addSysLang,
  getSysLang,
  getApplications,
  getTranslationBycode,
} from '@/services/translator';
import EditableTable from './component/EditableCell/EditableTable';
import AddSysLang from './component/AddSysLang.js';
import AddApplication from './component/AddApplication';
import ImportApplication from './component/ImportApplication';
import UpdateEditListModal from './component/UpdateEditListModal';
import commonStyles from '@/common.module.less';
import styles from './translator.module.less';

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
    loading: false,
    imporVisible: false,
    addLangVisible: false,
    addAppVisbible: false,
    showLanguage: ['zh-CN', 'en-US', 'ko-KR', 'vi-VN'],
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
        {
          languageKey: 'wcs.transaltor.addApplication',
          languageMap: {
            'en-US': 'Add Application',
            'ko-KR': '',
            'vi-VN': '',
            'zh-CN': '添加应用',
          },
        },
        {
          languageKey: 'menu.commonSet.commonInfo',
          languageMap: {
            'zh-CN': '个人设置',
            'en-US': 'User Setting',
            'ko-KR': '개인 설정',
            'vi-VN': 'Mức Pinx bất thường',
          },
        },
        {
          languageKey: 'menu.authorized',
          languageMap: {
            'en-US': 'User Authority Manager',
            'ko-KR': '권한 관리',
            'vi-VN': 'Nhiệm vụ mm kvb`',
            'zh-CN': '权限管理',
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
            'zh-CN': '任务不能重做',
          },
        },
        {
          languageKey: 'menu.authorized',
          languageMap: {
            'en-US': 'Authorized',
            'ko-KR': '작업은',
            'vi-VN': 'Nhiệm vụ',
            'zh-CN': '权限',
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

    // 处理3种状态的初始化数据 暂时放在这里 有接口的时候 应该是调完list 处理的 todo 之后要去掉
    this.getStansardAndCsutomData();
  }

  onModeChange = (e) => {
    this.setState({
      displayMode: e.target.value,
    });
  };

  // 获取语言
  getSysLanguage = async (flag) => {
    const langData = await getSysLang();
    if (!dealResponse(langData)) {
      this.setState({ allLanguage: langData }, flag && this.getTranslateList);
    }
  };

  // 获取应用
  getSysApplications = async () => {
    const moduleData = await getApplications();
    if (!dealResponse(moduleData)) {
      this.setState({ appList: moduleData });
    }
  };

  // 获取翻译内容-list
  getTranslateList = async () => {
    const { appCode } = this.state;
    this.setState({ loading: true });
    const list = await getTranslationBycode({ appCode: appCode });
    if (!dealResponse(list)) {
      // 拿到的数据处理 todo 有接口  顺序要调整 方法放在里面
      this.setState({ dataList: list });
    }
    this.getStansardAndCsutomData();
  };

  getStansardAndCsutomData = () => {
    const { dataList, allLanguage } = this.state;
    // allLanguage.push({
    //   type: 'hahah',
    // });
    // console.time('sum');
    const standardData = [...dataList['standard']].map((stItem) => {
      forIn(allLanguage, ({ type }) => {
        if (!stItem.languageMap[type]) {
          stItem.languageMap[type] = null;
        }
      });
      return stItem;
    });
    const customData = [...dataList['custom']].map((cuItem) => {
      forIn(allLanguage, ({ type }) => {
        if (!cuItem.languageMap[type]) {
          cuItem.languageMap[type] = null;
        }
      });
      return cuItem;
    });
    // console.timeEnd('sum');

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
      loading: false,
    });
  };

  generateColumns = () => {
    const { showLanguage, displayMode } = this.state;
    const columns = [
      {
        title: 'KEY',
        field: 'languageKey',
        disabled: true,
      },
    ];
    if (showLanguage.length !== 0) {
      showLanguage.map((record) => {
        columns.push({
          title: record,
          field: record,
          disabled: displayMode === 'merge' ? false : true,
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

    const showData_ = [...allShowData].map((record, index) => {
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
      if (record.field) {
        obj[record.field] = true;
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

  updateEditList = (field, index, record, newValue, text) => {
    const { mergeData, editList } = this.state;

    let currentlist = { ...editList };
    const result = {};
    let currentValue = {};
    let flag = false;
    if (text !== newValue) {
      currentValue = cloneDeep(record);
      currentValue[field] = newValue;
      currentValue.languageMap[field] = currentValue[field];

      const key = currentValue['languageKey'];
      result[key] = currentValue;
      const originalRow = mergeData.find((item) => item.languageKey === key);
      if (originalRow) {
        flag = isEqual(currentValue.languageMap, originalRow.languageMap);
      }

      if (flag && key) {
        delete currentlist[key];
      } else {
        currentlist = { ...editList, ...result };
      }
      // console.log('edit', currentlist);
      this.setState({
        editList: currentlist,
      });
    }
  };

  // todo 导出
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

  // todo 导入
  importApplicate = (data) => {
    const notEqual = {};
    const currentObj = {};
    const { standardData } = this.state;
    standardData.map((record) => {
      currentObj[record.languageKey] = record.languageMap;
    });
    // 找到不同的
    const importObj = data.languages;
    // 1.导入的数据 找到之前不存在的key
    forIn(importObj, (value, key) => {
      // 源数据存在key
      if (currentObj[key]) {
        // 1.改变 2.没改变
        if (!isEqual(currentObj[key], value)) {
          notEqual[key] = importObj[key];
        }
      } else {
        // 源数据不存在 一定是新增的
        notEqual[key] = value;
      }
    });
  };

  // 添加新的语言
  submitLanguage = async (value) => {
    const response = await addSysLang(value);
    if (!dealResponse(response)) {
      // 获取所有的语言 拉list接口 todo 要验证
      this.getSysLanguage(true);
      this.setState({ addLangVisible: false });
    }
  };

  // 切换应用
  handleApplication = (value) => {
    const { editList } = this.state;
    const _this = this;
    if (Object.keys(editList).length >= 1) {
      Modal.confirm({
        title: 'Tips',
        icon: <ExclamationCircleOutlined />,
        content: formatMessage({ id: 'translator.languageManage.applicationTips' }),
        okText: formatMessage({ id: 'translator.languageManage.toSave' }),
        cancelText: formatMessage({ id: 'translator.languageManage.nocontinue' }),
        onOk() {
          // _this.setState({
          //   appCode: appCode,
          // });
        },
        onCancel() {
          // todo list接口
          _this.setState(
            {
              appCode: value,
            },
            _this.getTranslateList,
          );
        },
      });
    } else {
      this.setState(
        {
          appCode: value,
        },
        this.getTranslateList,
      );
      // todo list接口
    }
  };

  // 添加新的应用
  addApplicateChange = async (data) => {
    const { code } = data;
    const addNewResponse = await addApplication({ ...data });
    if (!dealResponse(addNewResponse)) {
      this.setState(
        {
          addAppVisbible: false,
          appCode: code,
        },
        this.getTranslateList,
      );
    }
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
      showEditVisible,
      loading,
    } = this.state;
    const filterLanguage = this.generateFilterLanguage() || [];
    return (
      <div className={classnames(commonStyles.globalPageStyle, styles.translator)}>
        <>
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
                  this.setState({ showEditVisible: true });
                }}
              >
                {`${formatMessage({ id: 'translator.languageManage.unsaved' })} :
                   ${Object.keys(editList).length}
                  `}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem label={formatMessage({ id: 'translator.languageManage.application' })}>
                <Select
                  style={{ width: '190px' }}
                  value={appCode}
                  onChange={this.handleApplication}
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                        <Button
                          style={{ margin: '0 auto', textAlign: 'center' }}
                          type="link"
                          icon={<AppstoreAddOutlined />}
                          onClick={() => {
                            this.setState({
                              addAppVisbible: true,
                            });
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

            <Col flex="auto">
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
                disabled={isNull(appCode) && Object.keys(editList).length === 0}
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
            <Col>
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
            <Col style={{ marginLeft: 30 }}>
              <Checkbox
                value={toggle}
                onChange={({ target: { checked } }) => {
                  this.setState({ toggle: checked }, this.generateFilterLanguage);
                }}
              >
                {formatMessage({ id: 'translator.languageManage.onlyShowMissing' })}
              </Checkbox>
            </Col>
          </Row>
        </>
        <Divider></Divider>
        <>
          <Row>
            <Col>
              <FormItem
                label={formatMessage({ id: 'translator.languageManage.displayMode' })}
                width={'100%'}
              >
                <Radio.Group onChange={this.onModeChange} value={displayMode}>
                  <Radio value="merge">
                    {formatMessage({ id: 'translator.languageManage.merge' })}
                    {/* <span style={{fontSize:'12px',transform:[`scale(0.8)`]}}>可编辑</span> */}
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

          <EditableTable
            loading={loading}
            value={filterLanguage}
            columns={this.generateColumns()}
            onChange={this.updateEditList}
          />
        </>

        {/*新增语言  */}
        <Modal
          title={formatMessage({ id: 'translator.languageManage.addlanguage' })}
          destroyOnClose={true}
          maskClosable={false}
          mask={true}
          width={450}
          onCancel={() => {
            this.setState({ addLangVisible: false });
          }}
          footer={null}
          visible={this.state.addLangVisible}
        >
          <AddSysLang allLanguage={allLanguage} onAddLang={this.submitLanguage} />
        </Modal>

        {/* 新增应用 */}
        <Modal
          title={formatMessage({ id: 'translator.languageManage.addapplication' })}
          destroyOnClose={true}
          maskClosable={false}
          mask={true}
          width={450}
          onCancel={() => {
            this.setState({ addAppVisbible: false });
          }}
          footer={null}
          visible={this.state.addAppVisbible}
        >
          <AddApplication addApplicateChange={this.addApplicateChange} />
        </Modal>

        {/* 未保存 */}
        <Modal
          width={1000}
          footer={null}
          destroyOnClose
          visible={showEditVisible}
          onCancel={() => {
            this.setState({
              showEditVisible: false,
            });
          }}
        >
          <UpdateEditListModal source={editList} columns={allLanguage} onChange={(value) => {}} />
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
