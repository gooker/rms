import React from 'react';
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Radio,
  Row,
} from 'antd';
import {
  DeleteOutlined,
  DownOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';
import { cloneDeep, findIndex } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import { adjustModalWidth, dealResponse, formatMessage, isNull, isStrictNull } from '@/utils/util';
import { addSysLang, getTranslationByCode, updateSysTranslation } from '@/services/translator';
import RmsConfirm from '@/components/RmsConfirm';
import {
  exportTranslate,
  generatefilterValue,
  generateOriginData,
  generateUpdateDataToSave,
} from './translateUtils';
import EditableTable from './component/EditableCell/EditableTable';
import AddSysLangModal from './component/AddSysLang.js';
import ImportApplicationModal from './component/ImportApplication';
import UpdateEditListModal from './component/UpdateEditListModal';
import DeleteSysLang from './component/DeleteSysLang';
import DiffToSaveModal from './component/DiffToSaveModal';
import { connect } from '@/utils/RmsDva';
import styles from './translator.module.less';
import commonStyles from '@/common.module.less';

const { Item: FormItem } = Form;

@connect(({ global }) => ({
  systemLanguage: global.systemLanguage,
}))
class LanguageManage extends React.Component {
  state = {
    appCode: 'FE',
    frontedStandard: [], // 前端原始数据
    displayMode: ['custom', 'standard'],

    loading: false,
    importVisible: false,
    addLangVisible: false,
    deleteLangVisible: false,
    diffToVisible: false,

    showLanguage: [],
    dataList: {},
    standardData: [],
    customData: [],
    mergeData: [],
    editList: {},
    filterValue: null,
    showMissingTranslate: false,
    pagination: {
      pageSize: 10,
      current: 1,
    },
  };

  componentDidMount() {
    this.getSysLanguage();
  }

  // 获取语言
  getSysLanguage = async () => {
    const { systemLanguage } = this.props;
    const frontedStandard = [];
    systemLanguage.map(({ code }) => {
      let languageMap = {};
      try {
        languageMap = require(`@/locales/${code}`)?.default;
      } catch (error) {
        languageMap = {};
      }
      // 当前语言没有翻译，可以直接从zh-CN拿key
      if (Object.keys(languageMap).length === 0) {
        const zhKeyMap = require(`@/locales/zh-CN`)?.default;
        Object.entries(zhKeyMap).map(([key, value]) => {
          languageMap[key] = '';
        });
      }
      frontedStandard.push({ languageKey: code, languageMap });
    });
    this.setState(
      {
        frontedStandard,
        showLanguage: systemLanguage.map(({ code }) => code),
      },
      this.getTranslateList,
    );
  };

  // 根据appcode获取翻译列表-list
  getTranslateList = async () => {
    const { appCode, frontedStandard } = this.state;
    this.setState({ loading: true });
    const list = await getTranslationByCode(appCode);
    if (!dealResponse(list)) {
      const currentList = { ...list };
      if (appCode === 'FE') {
        currentList.Standard = frontedStandard;
      }
      this.setState({ dataList: currentList }, this.getStandardAndCustomData);
    }
    this.setState({ loading: false });
  };

  getStandardAndCustomData = () => {
    const { systemLanguage } = this.props;
    const { dataList } = this.state;
    /*切换应用 根据后端返回的数据 以及目前前端勾选的语言 初始化数据
     *        后端返回的数据 没有该语言 前端赋值为null
     * 原因: 1.交互问题 保持所有数据的key一致;
     *      2：场景: 新添加一个语言 如果之前有100条数据 那么会造成未保存的就是100条(languagemap不一样)
     *
     *** custom里面的key一定在standard里面
     * *
     * */
    const dataArray = generateOriginData(dataList, systemLanguage);
    const { standardData, customData, mergeData } = dataArray;
    this.setState({
      standardData: [...standardData],
      customData: [...customData],
      mergeData: [...mergeData],
      loading: false,
    });
  };

  onModeChange = (e) => {
    this.setState({
      displayMode: e,
    });
  };

  isMerge = (mode) => {
    return !!(mode.includes('standard') && mode.includes('custom'));
  };

  tableColumns = () => {
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
          disabled: !this.isMerge(displayMode),
        });
      });
    }
    return columns;
  };

  generateData = () => {
    const { displayMode, standardData, customData, mergeData, editList } = this.state;
    let allShowData = [];
    if (this.isMerge(displayMode)) {
      allShowData = mergeData;
    } else if (displayMode.toString() === 'standard') {
      allShowData = standardData;
    } else if (displayMode.toString() === 'custom') {
      allShowData = customData;
    }

    return [...allShowData].map((record) => {
      let _record = { ...record };
      if (
        this.isMerge(displayMode) &&
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
  };

  // 语种变化 应用变化 搜索 最后都调用此放大
  generateFilterLanguage = () => {
    const dataSorce = this.generateData();
    const { filterValue, showLanguage, showMissingTranslate } = this.state;
    // 当前列表的coiumns 在对应的value中搜索
    const shownColumns = {};
    this.tableColumns().map((record) => {
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
    if (text !== newValue) {
      currentValue = cloneDeep(record);
      currentValue[field] = newValue;
      currentValue.languageMap[field] = currentValue[field];

      const key = currentValue['languageKey'];
      result[key] = currentValue;

      // 拿到key对应的源数据

      const changedSet = new Set(); // 比较是否有修改
      const originalRow = mergeData.find((item) => item.languageKey === key);
      let newLanguageMap = { ...currentValue.languageMap };
      Object.entries(newLanguageMap).forEach(([key, value]) => {
        // 防止原始数据是'' 或者null
        if (isStrictNull(originalRow.languageMap[key]) && !isStrictNull(value)) {
          changedSet.add(1);
        }
        if (!isStrictNull(originalRow.languageMap[key]) && value !== originalRow.languageMap[key]) {
          changedSet.add(1);
        }
      });

      // 源数据和修改后的数据相同 则不放入未保存的对象中
      if (changedSet.size === 1 && changedSet.has(1)) {
        currentlist = { ...editList, ...result };
      } else {
        delete currentlist[key];
      }

      this.setState({
        editList: currentlist,
      });
    }
  };

  //导出
  exportExecl = (type) => {
    const { standardData, customData, mergeData, appCode, showLanguage } = this.state;
    const { key } = type;
    let allShowData = [];
    if (key === 'merge') {
      allShowData = mergeData;
    } else if (key === 'standard') {
      allShowData = standardData;
    } else {
      allShowData = customData;
    }

    exportTranslate(allShowData, key, appCode, showLanguage);
  };

  // 导入
  importTranslation = async (data) => {
    // 1.判断key是否存在standard 不存在删除 (如果语种key不在系统中 也要删除)
    // 2.有修改的翻译留下来
    const { standardData, appCode } = this.state;
    const { systemLanguage } = this.props;
    const allSysLang = systemLanguage.map(({ code }) => code);
    const { merge, languages: exportLanguages } = data;
    const newExportLanguages = [];
    const deleteLangKey = [];

    exportLanguages.forEach(({ languageKey, languageMap }) => {
      if (isNull(languageKey)) return;
      let filterKey = standardData.find((item) => item.languageKey === languageKey);
      let index = findIndex(standardData, (record) => record.languageKey === languageKey);
      if (index >= 0) {
        let newLanguageMap = { ...languageMap };
        const changedSet = new Set(); // 比较是否有修改
        Object.entries(newLanguageMap).forEach(([key, value]) => {
          if (!allSysLang.includes(key)) {
            delete newLanguageMap[key];
          } else {
            if (value !== filterKey.languageMap[key]) {
              changedSet.add(1);
            }
          }
        });
        if (changedSet.size === 1 && changedSet.has(1)) {
          newExportLanguages.push({
            languageKey,
            ...newLanguageMap,
          });
        }
      } else {
        deleteLangKey.push(languageKey);
      }
    });

    const translationDetail = generateUpdateDataToSave(newExportLanguages);
    const response = await updateSysTranslation({
      appCode,
      merge,
      translationDetail,
    });
    if (!dealResponse(response, true)) {
      this.setState({ importVisible: false }, this.getTranslateList);
    }
  };

  // 添加新的语言
  submitLanguage = async (value) => {
    const response = await addSysLang(value);
    if (!dealResponse(response)) {
      this.getSysLanguage();
      this.setState({ addLangVisible: false, editList: {} }, this.getTranslateList);
    }
  };

  // 切换应用
  handleApplication = (e) => {
    const value = e.target.value;
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
      this.setState(
        { appCode: value, pagination: { pageSize: 10, current: 1 } },
        this.getTranslateList,
      );
    }
  };

  // 保存-update
  makeSureUpdate = async () => {
    const { editList, appCode } = this.state;
    const currenUpdate = Object.values(editList).map((record) => {
      return {
        languageKey: record.languageKey,
        ...record.languageMap,
      };
    });

    const translationDetail = generateUpdateDataToSave(currenUpdate);
    const response = await updateSysTranslation({ appCode, merge: true, translationDetail });
    if (!dealResponse(response, true)) {
      this.setState({ diffToVisible: false, editList: {} }, this.getTranslateList);
    }
  };

  render() {
    const {
      showLanguage,
      appCode,
      displayMode,
      importVisible,
      diffToVisible,
      editList,
      loading,
      pagination,
      showMissingTranslate,
    } = this.state;
    const { systemLanguage } = this.props;
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
                {systemLanguage.map((record) => (
                  <Checkbox key={record.code} value={record.code}>
                    {record.name}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </FormItem>
          </Col>
          <Col offset={1}>
            {/* 新增语种 */}
            <Button
              type="link"
              onClick={() => {
                this.setState({ addLangVisible: true });
              }}
            >
              <PlusCircleOutlined /> <FormattedMessage id="translator.languageManage.addLanguage" />
            </Button>

            {/* 删除语种 */}
            {window.localStorage.getItem('dev') === 'true' && (
              <Button
                danger
                type="link"
                onClick={() => {
                  this.setState({ deleteLangVisible: true });
                }}
              >
                <DeleteOutlined />{' '}
                <FormattedMessage id="translator.languageManage.deleteLanguage" />
              </Button>
            )}
          </Col>

          <Col flex={1}>
            <Row justify={'end'}>
              <Button
                type="link"
                onClick={() => {
                  this.setState({ showEditVisible: true });
                }}
              >
                <FormattedMessage id="translator.languageManage.unsaved" />:{' '}
                {Object.keys(editList).length}
              </Button>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label={<FormattedMessage id="app.module" />}>
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                onChange={this.handleApplication}
                value={appCode}
                options={[
                  {
                    label: formatMessage({ id: 'translator.languageManage.frontend' }),
                    value: 'FE',
                  },
                  {
                    label: formatMessage({ id: 'translator.languageManage.backend' }),
                    value: 'BE',
                  },
                ]}
              />
            </FormItem>
          </Col>

          <Col flex="auto">
            <Button
              style={{ margin: '0 20px 0 20px' }}
              disabled={isNull(appCode)}
              onClick={() => {
                this.setState({
                  importVisible: true,
                });
              }}
            >
              <ImportOutlined /> <FormattedMessage id="app.button.import" />
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
              style={{ marginLeft: 20 }}
              disabled={Object.keys(editList).length === 0}
              type="primary"
              onClick={() => {
                this.setState({
                  diffToVisible: true,
                });
              }}
            >
              <SaveOutlined /> <FormattedMessage id="app.button.save" />
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
        <Divider />
        <Row>
          <Col flex="auto">
            <FormItem
              label={<FormattedMessage id="translator.languageManage.displayMode" />}
              width={'100%'}
            >
              <Checkbox.Group onChange={this.onModeChange} value={displayMode}>
                <Checkbox
                  value="standard"
                  disabled={displayMode.length === 1 && displayMode.toString() === 'standard'}
                >
                  <FormattedMessage id="translator.languageManage.standard" />
                </Checkbox>
                <Checkbox
                  value="custom"
                  disabled={displayMode.length === 1 && displayMode.toString() === 'custom'}
                >
                  <FormattedMessage id="translator.languageManage.custom" />
                </Checkbox>
              </Checkbox.Group>
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
          columns={this.tableColumns()}
          onChange={this.updateEditList}
          pagination={pagination}
          handlePagination={(value) => {
            this.setState({ pagination: value });
          }}
        />

        {/* 新增语言  */}
        <AddSysLangModal
          existKeys={Object.values(systemLanguage).map(({ code }) => code)}
          onAddLang={this.submitLanguage}
          visible={this.state.addLangVisible}
          onCancel={() => {
            this.setState({ addLangVisible: false });
          }}
        />

        {/* 删除语言 */}
        <DeleteSysLang
          visible={this.state.deleteLangVisible}
          onCancel={() => {
            this.setState({ deleteLangVisible: false });
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
          columns={systemLanguage}
          deleteHandle={(values) => {
            this.setState({
              editList: values,
            });
          }}
        />

        {/* 对比 */}
        <Modal
          width={adjustModalWidth()}
          footer={null}
          destroyOnClose
          visible={diffToVisible}
          onCancel={() => {
            this.setState({
              diffToVisible: false,
            });
          }}
        >
          <DiffToSaveModal
            originData={this.state.mergeData}
            editList={editList}
            allLanguage={systemLanguage.map(({ code }) => code)}
            makeSureUpdate={this.makeSureUpdate}
          />
        </Modal>

        {/* 导入 */}
        <ImportApplicationModal
          visible={importVisible}
          onCancel={() => {
            this.setState({
              importVisible: false,
            });
          }}
          onOk={this.importTranslation}
        />
      </div>
    );
  }
}
export default LanguageManage;
