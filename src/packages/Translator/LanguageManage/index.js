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
  Divider,
} from 'antd';
import {
  PlusCircleOutlined,
  ImportOutlined,
  ExportOutlined,
  AppstoreAddOutlined,
  DownOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';
import { cloneDeep, isEqual } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, isNull, formatMessage } from '@/utils/util';
import {
  addSysLang,
  getSysLang,
  addApplication,
  getApplications,
  updateTranslations,
  getTranslationBycode,
} from '@/services/translator';
import RmsConfirm from '@/components/RmsConfirm';
import {
  getdataList,
  exportTranslate,
  generateOriginData,
  generatefilterValue,
} from './translateUtils';
import EditableTable from './component/EditableCell/EditableTable';
import AddSysLangModal from './component/AddSysLang.js';
import AddApplicationModal from './component/AddApplication';
import ImportApplicationModal from './component/ImportApplication';
import UpdateEditListModal from './component/UpdateEditListModal';
import DiffToSaveModal from './component/DiffToSaveModal';
import commonStyles from '@/common.module.less';
import styles from './translator.module.less';

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
    loading: false,
    imporVisible: false,
    addLangVisible: false,
    addAppVisbible: false,
    diffToVisible: false,

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
    dataList: getdataList(),
    standardData: [],
    customData: [],
    mergeData: [],
    editList: {},
    filterValue: null,
    showMissingTranslate: false,
  };

  componentDidMount() {
    // TODO: 调接口的时候去掉注释
    // this.getSysLanguage();
    // this.getSysApplications();
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

  // 获取所有应用
  getSysApplications = async () => {
    const moduleData = await getApplications();
    if (!dealResponse(moduleData)) {
      this.setState({ appList: moduleData });
    }
  };

  // 根据appcode获取翻译列表-list
  getTranslateList = async () => {
    const { appCode } = this.state;
    this.setState({ loading: true });
    const list = await getTranslationBycode({ appCode: appCode });
    if (!dealResponse(list)) {
      this.setState({ dataList: list });
    }
    // TODO: 拿到的数据处理  顺序要调整 方法放在里面
    this.getStansardAndCsutomData();
  };

  getStansardAndCsutomData = () => {
    const { dataList, allLanguage } = this.state;
    /*切换应用 根据后端返回的数据 以及目前前端勾选的语言 初始化数据
     *        后端返回的数据 没有该语言 前端赋值为null
     * 原因: 1.交互问题 保持所有数据的key一致;
     *      2：场景: 新添加一个语言 如果之前有100条数据 那么会造成未保存的就是100条(languagemap不一样)
     *
     *** custom里面的key一定在standard里面
     * *
     * */
    const dataArray = generateOriginData(dataList, allLanguage);
    const { standardData, customData, mergeData } = dataArray;
    this.setState({
      standardData: [...standardData],
      customData: [...customData],
      mergeData: [...mergeData],
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
      let _record = { ...record };
      if (
        displayMode === 'merge' &&
        editList &&
        Object.keys(editList).includes(record.languageKey)
      ) {
        _record = editList[record.languageKey];
      }

      return {
        ..._record,
        ..._record.languageMap,
      };
    });
    return showData_;
  };

  // 语种变化 应用变化 搜索 最后都调用此放大
  generateFilterLanguage = () => {
    const dataSorce = this.generateData();
    const { filterValue, showLanguage, showMissingTranslate } = this.state;
    // 当前列表的coiumns 在对应的value中搜索
    const shownColumns = {};
    this.generateColumns().map((record) => {
      if (record.field) {
        shownColumns[record.field] = true;
      }
    });

    return generatefilterValue(
      filterValue,
      dataSorce,
      shownColumns,
      showMissingTranslate,
      showLanguage,
    );
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

      // 拿到key对应的源数据
      const originalRow = mergeData.find((item) => item.languageKey === key);
      if (originalRow) {
        flag = isEqual(currentValue.languageMap, originalRow.languageMap);
      }
      // 源数据和修改后的数据相同 则不放入未保存的对象中
      if (flag && key) {
        delete currentlist[key];
      } else {
        currentlist = { ...editList, ...result };
      }
      this.setState({
        editList: currentlist,
      });
    }
  };

  //导出
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

    exportTranslate(allShowData, key, appCode);
  };

  // 导入
  importApplicate = async (data) => {
    const _this = this;
    const respones = await updateTranslations({
      ...data,
      saveType: 'all',
    });
    if (!dealResponse(respones)) {
      _this.setState({ imporVisible: false }, _this.getTranslateList);
    }
    // TODO: 接口调完需要删除
    _this.setState({ imporVisible: false });
  };

  // 添加新的语言
  submitLanguage = async (value) => {
    const response = await addSysLang(value);
    if (!dealResponse(response)) {
      this.getSysLanguage(true);
      this.setState({ addLangVisible: false, editList: {} }, this.getTranslateList);
    }
  };

  // 切换应用
  handleApplication = (value) => {
    const { editList, appCode } = this.state;
    const _this = this;
    if (Object.keys(editList).length >= 1) {
      RmsConfirm({
        content: formatMessage({ id: 'translator.languageManage.applicationTips', format: false }),
        okText: formatMessage({ id: 'app.common.true', format: false }),
        cancelText: formatMessage({ id: 'app.common.false', format: false }),
        onOk() {
          _this.setState({ appCode, diffToVisible: true });
        },
        onCancel() {
          _this.setState({ appCode: value, editList: {} }, _this.getTranslateList);
        },
      });
    } else {
      this.setState({ appCode: value }, this.getTranslateList);
    }
  };

  // 添加新的应用
  addApplicateChange = async (data) => {
    const { code } = data;
    const addNewResponse = await addApplication({ ...data });
    if (!dealResponse(addNewResponse)) {
      this.setState({ addAppVisbible: false, appCode: code }, this.getTranslateList);
    }
  };

  // 保存-update
  makeSureUpdate = async () => {
    const { editList, appCode } = this.state;
    const currenUpdate = Object.values(editList).map((record) => {
      return {
        languageKey: record.languageKey,
        languageMap: { ...record.languageMap },
      };
    });

    const respones = await updateTranslations({
      appCode,
      currenUpdate,
      saveType: 'part',
    });
    if (!dealResponse(respones)) {
      this.setState({ diffToVisible: false, editList: {} }, this.getTranslateList);
    }
    // TODO: 需要删除
    this.setState({ diffToVisible: false, editList: {} });
  };

  render() {
    const {
      showLanguage,
      allLanguage,
      appCode,
      appList,
      displayMode,
      imporVisible,
      showMissingTranslate,
      editList,
      loading,
    } = this.state;
    const filterLanguage = this.generateFilterLanguage() || [];
    return (
      <div className={classnames(commonStyles.commonPageStyle, styles.translator)}>
        <Row>
          <Col>
            <FormItem label={<FormattedMessage id="translator.languageManage.language" />}>
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
            >
              <PlusCircleOutlined /> <FormattedMessage id="translator.languageManage.addlanguage" />
            </Button>
          </Col>

          <Col flex="auto">
            <Button
              type="link"
              style={{ cursor: 'pointer', color: '#1890FF', marginLeft: 40 }}
              onClick={() => {
                this.setState({ showEditVisible: true });
              }}
            >
              <FormattedMessage id="translator.languageManage.unsaved" />:
              {Object.keys(editList).length}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label={<FormattedMessage id="translator.languageManage.application" />}>
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
                        <FormattedMessage id="translator.languageManage.addapplication" />
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
              {' '}
              <FormattedMessage id="app.button.import" />
            </Button>

            <Dropdown
              disabled={isNull(appCode)}
              overlay={
                <Menu onClick={this.exportExecl}>
                  <Menu.Item key="standard">
                    <FormattedMessage id="translator.languageManage.standard" />
                  </Menu.Item>
                  <Menu.Item key="custom">
                    <FormattedMessage id="translator.languageManage.custom" />
                  </Menu.Item>
                  <Menu.Item key="merge">
                    <FormattedMessage id="translator.languageManage.merge" />
                  </Menu.Item>
                </Menu>
              }
            >
              <Button icon={<ExportOutlined />}>
                {' '}
                <FormattedMessage id="app.button.export" />
                <DownOutlined />
              </Button>
            </Dropdown>

            <Button
              icon={<SaveOutlined />}
              style={{ marginLeft: 20 }}
              disabled={Object.keys(editList).length === 0}
              type="primary"
              onClick={() => {
                this.setState({
                  diffToVisible: true,
                });
              }}
            >
              {' '}
              <FormattedMessage id="app.button.save" />
            </Button>
          </Col>
          <Col>
            <FormItem label={<FormattedMessage id="app.button.search" />}>
              <Input
                allowClear
                placeholder={formatMessage({
                  id: 'translator.languageManage.enterSearchKeywords',
                  format: false,
                })}
                onChange={({ target: { value } }) => {
                  this.setState({ filterValue: value }, this.generateFilterLanguage);
                }}
              />
            </FormItem>
          </Col>
        </Row>
        <Divider></Divider>
        <Row>
          <Col flex="auto">
            <FormItem
              label={<FormattedMessage id="translator.languageManage.displayMode" />}
              width={'100%'}
            >
              <Radio.Group onChange={this.onModeChange} value={displayMode}>
                <Radio value="merge">
                  <FormattedMessage id="translator.languageManage.merge" />
                </Radio>
                <Radio value="standard">
                  <FormattedMessage id="translator.languageManage.standard" />
                </Radio>
                <Radio value="custom">
                  <FormattedMessage id="translator.languageManage.custom" />
                </Radio>
              </Radio.Group>
            </FormItem>
          </Col>
          <Col>
            <Checkbox
              value={showMissingTranslate}
              onChange={({ target: { checked } }) => {
                this.setState({ showMissingTranslate: checked }, this.generateFilterLanguage);
              }}
            >
              <FormattedMessage id="translator.languageManage.onlyShowMissing" />
            </Checkbox>
          </Col>
        </Row>
        <EditableTable
          loading={loading}
          value={filterLanguage}
          columns={this.generateColumns()}
          onChange={this.updateEditList}
        />

        {/*新增语言  */}
        <AddSysLangModal
          allLanguage={allLanguage}
          onAddLang={this.submitLanguage}
          visible={this.state.addLangVisible}
          onCancel={() => {
            this.setState({ addLangVisible: false });
          }}
        />

        {/* 新增应用 */}

        <AddApplicationModal
          addApplicateChange={this.addApplicateChange}
          visible={this.state.addAppVisbible}
          onCancel={() => {
            this.setState({ addAppVisbible: false });
          }}
        />

        {/* 未保存 */}
        <UpdateEditListModal
          visible={this.state.showEditVisible}
          onCancel={() => {
            this.setState({
              showEditVisible: false,
            });
          }}
          source={editList}
          columns={allLanguage}
          onChange={(values) => {}}
        />

        {/* 对比 */}
        <DiffToSaveModal
          visible={this.state.diffToVisible}
          originData={this.state.mergeData}
          editList={editList}
          allLanguage={allLanguage.map(({ type }) => type)}
          makeSureUpdate={this.makeSureUpdate}
          onCancel={() => {
            this.setState({
              diffToVisible: false,
            });
          }}
        />

        {/* 导入 */}
        <ImportApplicationModal
          visible={imporVisible}
          onCancel={() => {
            this.setState({
              imporVisible: false,
            });
          }}
          appList={appList}
          appCode={appCode}
          importApplicate={this.importApplicate}
        />
      </div>
    );
  }
}
export default LanguageManage;
