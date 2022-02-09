import React, { Component } from 'react';
import { connect } from '@/utils/RmsDva';
import find from 'lodash/find';
import {
  Button,
  Input,
  InputNumber,
  Checkbox,
  Form,
  Table,
  Select,
  Radio,
  Switch,
  Popover,
} from 'antd';
import ButtonMultiSelect from './ButtonMultiSelect';
import { isStrictNull,formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
const tailFormItemLayout = { wrapperCol: { offset: 6, span: 18 } };
const FormItem = Form.Item;

@connect(({ mapViewGroup }) => ({
  selectedCells: mapViewGroup.selectedCells,
  storageConfigData: mapViewGroup.storageConfigData,
  currentLogicAreaId: mapViewGroup.currentLogicArea.id,
  groupJson: mapViewGroup.groupJson,
}))
class GroupManageConfiguration extends Component {
  mapRef = React.createRef();

  batchInput = '';

  tableTilte = ''; // 用于初始化优先级表格的title

  constructor(props) {
    super(props);
    const currentData = props.groupJson && props.groupJson[0].formContent;
    const textData = currentData.filter((item) => item.dataSource === true);
    this.tableTilte = textData[0].labelName;

    this.state = {
      groupType: '',
      typeName: '',
      groupData: [], // 当前的显示form
      belongGroup: [], //
      prioritytableTilte: this.tableTilte,
      // 优先级表头
      priorityColumns: [
        {
          title: this.tableTilte, // formatMessage({ id: 'app.groupManage.element' }),
          dataIndex: 'item',
        },
        {
          title: formatMessage({ id: 'app.groupManage.grouppriority' }),
          dataIndex: 'priority',
          render: (text, record) => (
            <InputNumber
              min={1}
              max={100}
              onChange={this.onPriorityChange(text, record)}
              value={text}
            />
          ),
        },
      ],
      priorityData: [],
      selectedRowKeys: [],
      batchEditPriorityvisible: false,
      editGroupItemFlag: false,
    };
  }

  componentDidMount() {
    const { editItemData, groupJson } = this.props;
    /**
     * 这是跳过来的编辑 操作
     * 没有做input禁止输入操作 但是类型groupType不可以切换
     *
     * *保存的时候 1.根据groupType 去比较groupName或者key 存在就替换
     *            2.不存在直接新增加一条记录
     * */
    if (editItemData) {
      const { setFieldsValue } = this.mapRef.current;
      const groupData = groupJson.filter((item) => item.value === editItemData.groupType)[0]
        .formContent;

      const formInitValue = {};
      groupData.forEach(({ fieldName }) => {
        formInitValue[fieldName] = editItemData[fieldName];
      });
      formInitValue.groupType = editItemData.groupType;

      this.setState(
        {
          groupType: editItemData.groupType,
          typeName: editItemData.typeName,
          groupData,
          editGroupItemFlag: true,
          priorityData: editItemData.priority,
          selectedRowKeys: [],
        },
        () => {
          setFieldsValue(formInitValue);
        },
      );
    }
  }

  // 根据传入的点位 拿到对应的优先级
  priorityFilter = (item) => {
    const { priorityData } = this.state;
    let priorityaRow = null;
    if (priorityData && priorityData.length > 0) {
      priorityaRow = priorityData.filter((value) => {
        return value.item === item;
      });
    }
    return priorityaRow && priorityaRow.length > 0 ? priorityaRow[0].priority : null;
  };

  // table表格-手动更改优先级
  onPriorityChange = (value, record) => {
    return (e) => {
      const { priorityData } = this.state;
      priorityData.map((item) => {
        if (item.item === record.item) item.priority = e;
      });
      this.setState({
        priorityData: [...priorityData],
      });
    };
  };

  // 点位改变
  handleChange = (value) => {
    const selectedCellsCopy = [...value]; // 目前的点位
    const newCopyData = [];
    selectedCellsCopy.map((item, index) => {
      const priorityaRow = this.priorityFilter(item);
      newCopyData.push({ item, priority: priorityaRow || 5 });
    });
    this.setState({
      priorityData: [...newCopyData],
      selectedRowKeys: [],
    });
  };

  // 切换组别
  groupTypeChange = (groupType) => {
    const { groupJson: belongGroup } = this.props; // groupData
    const { priorityColumns } = this.state;
    const { setFieldsValue } = this.mapRef.current;
    const groupData = belongGroup.filter((item) => item.value === groupType)[0].formContent;
    const typeName = belongGroup.filter((item) => item.value === groupType)[0].label;
    const formInitValue = {};
    groupData.forEach(({ fieldName, defaultValue }) => {
      formInitValue[fieldName] = defaultValue;
    });

    // 更改table的title
    const textData = groupData.filter((item) => item.dataSource === true);
    this.tableTilte = textData[0].labelName;
    priorityColumns.forEach((record) => {
      if (record.dataIndex === 'item') record.title = this.tableTilte;
    });
    this.setState(
      { groupType, typeName, groupData, priorityData: [], selectedRowKeys: [], priorityColumns },
      () => {
        setFieldsValue(formInitValue);
      },
    );
  };

  // groupName不能重复 组内比
  groupNameValidator = (_, value) => {
    const { storageConfigData } = this.props;
    const { groupType } = this.state;
    const newStorageConfigData = [...storageConfigData];

    // 在此组内比较
    const storageGroup = newStorageConfigData
      .filter((item) => item.groupType === groupType)
      .map((item) => ({ ...item }));

    if (!storageGroup || Object.keys(storageGroup).length === 0) {
      return Promise.resolve();
    }

    const existAreasName = storageGroup.map(({ groupName }) => groupName);
    // 名称不可以重复
    if (value && existAreasName.includes(value)) {
      return Promise.reject(formatMessage({ id: 'app.groupManage.repeatGroupname' }));
    }
    return Promise.resolve();
  };

  // 唯一key不能重复 全部组比
  groupKeyValidator = (rule, value) => {
    const { storageConfigData } = this.props;
    const storageGroup = [...storageConfigData];
    if (!storageGroup || Object.keys(storageGroup).length === 0) {
      return Promise.resolve();
    }
    const existAreasKey = storageGroup.map(({ key }) => key);
    // 唯一key不可以重复
    if (value && existAreasKey.includes(value)) {
      return Promise.reject(formatMessage({ id: 'app.groupManage.repeatGroupkey' }));
    } else {
      return Promise.resolve();
    }
  };

  // 新增保存-分组管理
  createGroupSubmit = () => {
    const { editGroupItemFlag } = this.state;
    const { dispatch, groupJson, close, clearSelection, editItemData } = this.props;
    const { priorityData, typeName } = this.state;
    this.mapRef.current.validateFields().then((values) => {
      // canView
      const groupJsonItem = find(groupJson, { value: values.groupType });
      const canView = !!groupJsonItem.canView;
      values.canView = canView;

      // 为null情况
      const _typeName = isStrictNull(typeName) ? groupJsonItem.label : typeName;

      values.priority = priorityData;
      values.typeName = _typeName;
      // 如果是编辑更新 要把mapId id放进去
      if (editGroupItemFlag && editItemData) {
        values.mapId = editItemData.mapId;
        values.id = editItemData.id;
      }
      dispatch({ type: 'mapViewGroup/fetchAddStorageConfigurations', payload: values }).then(() => {
        close();
        clearSelection();
      });
    });
  };

  renderFormItemContent = (content) => {
    const { type, options, defaultValue, isisabled, onChange } = content;

    if (type === 'select') {
      return <Select defaultValue={defaultValue} options={options} />;
    }
    if (type === 'multiSelect') {
      return <Select mode="tags" options={options} onChange={onChange} maxTagCount={4} />;
    }
    if (type === 'btnMultiSelect') {
      // 点位
      return <ButtonMultiSelect onClick={onChange} valueChange={onChange} />;
    }
    if (type === 'switch') {
      return <Switch />;
    }
    if (type === 'string') {
      return <Input disabled={!!isisabled} />;
    }

    if (type === 'number') {
      return <InputNumber min={1} />;
    }
    if (type === 'checkbox') {
      if (options.length === 0) {
        return <Checkbox />;
      }
      return <Checkbox.Group options={options} />;
    }
    if (type === 'radio') {
      return <Radio.Group options={options} />;
    }
  };

  renderGroup = (record) => {
    const { groupType, editGroupItemFlag } = this.state;
    return record.map(
      ({
        labelName,
        options,
        valuePropName,
        defaultValue,
        fieldName,
        type,
        isRequired,
        dataSource,
      }) => {
        const rules = [];
        let isisabled = false; // 编辑的时候 让组名和key不能编辑
        if (isRequired) {
          rules.push({
            required: true,
          });
          if (fieldName === 'groupName') {
            if (editGroupItemFlag) {
              isisabled = !isisabled;
            } else {
              rules.push({ validator: this.groupNameValidator });
            }
          }

          if (fieldName === 'key') {
            if (editGroupItemFlag) {
              isisabled = !isisabled;
            } else {
              rules.push({ validator: this.groupKeyValidator });
            }
          }
        }
        const param = { type, options, defaultValue, isisabled };
        if (dataSource) {
          param.onChange = (value) => {
            this.handleChange(value);
          };
        }

        return (
          <FormItem
            label={labelName}
            name={fieldName}
            key={`${groupType}-${fieldName}`}
            valuePropName={valuePropName || 'value'}
            initialValue={defaultValue}
            rules={rules}
          >
            {this.renderFormItemContent(param)}
          </FormItem>
        );
      },
    );
  };

  // 批量更新popover content
  popContent = () => {
    return (
      <FormItem {...tailFormItemLayout} label="优先级" name="priority" key="priority" noStyle>
        <InputNumber
          min={1}
          max={100}
          ref={(el) => {
            this.batchInput = el;
          }}
        />
        <div style={{ marginTop: 16 }}>
          <Button size={'small'} onClick={this.popHidden}>
            <FormattedMessage id={'app.groupManage.cancel'} />
          </Button>
          <Button size={'small'} style={{ marginLeft: 16 }} onClick={this.popSubmit}>
            <FormattedMessage id={'app.taskDetail.sure'} />
          </Button>
        </div>
      </FormItem>
    );
  };

  popHidden = () => {
    this.setState({ selectedRowKeys: [], batchEditPriorityvisible: false });
  };

  // 批量更改优先级
  popSubmit = () => {
    // console.log(this.batchInput.value)
    const newPriority = this.batchInput.value;
    const { priorityData } = this.state;
    priorityData.map((e) => {
      e.priority = Number(newPriority);
    });
    this.setState({
      selectedRowKeys: [],
      batchEditPriorityvisible: false,
      priorityData: [...priorityData],
    });
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const { groupJson } = this.props;
    const initGroupData = groupJson && groupJson[0].formContent;
    const initGroupType = groupJson && groupJson[0].value;
    const {
      groupData,
      groupType,
      priorityColumns,
      priorityData,
      selectedRowKeys,
      batchEditPriorityvisible,
      editGroupItemFlag,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    // 初始化 读取默认的 类似车辆组
    return (
      <Form {...formItemLayout} ref={this.mapRef}>
        <FormItem
          label={formatMessage({ id: 'app.groupManage.belonggroup' })}
          name="groupType"
          rules={[{ required: true }]}
          initialValue={groupType || initGroupType}
        >
          <Select
            placeholder={formatMessage({ id: 'app.groupManage.pleaseSelect' })}
            style={{ width: '100%' }}
            showSearch
            onChange={this.groupTypeChange}
            options={groupJson}
            disabled={!!editGroupItemFlag}
          ></Select>
        </FormItem>

        {/*  渲染出formitem */}
        {this.renderGroup(groupData && groupData.length > 0 ? groupData : initGroupData)}

        <FormItem {...tailFormItemLayout}>
          <Button type={'primary'} onClick={this.createGroupSubmit}>
            <FormattedMessage id={'app.storageManage.save'} />
          </Button>
        </FormItem>

        {/* 优先级表格 */}
        <div>
          <div style={{ marginBottom: 16 }}>
            <Popover
              destroyTooltipOnHide
              arrowPointAtCenter={true}
              content={this.popContent}
              title={formatMessage({ id: 'app.groupManage.updateSelectedPriority' })}
              trigger="click"
              visible={batchEditPriorityvisible}
            >
              <Button
                key={`${groupType}--btn`}
                onClick={() => {
                  this.setState({ batchEditPriorityvisible: true });
                }}
                style={{ visibility: selectedRowKeys.length === 0 ? 'hidden' : 'visible' }}
              >
                <FormattedMessage id={'app.groupManage.batchUpdate'} />
              </Button>
            </Popover>
          </div>

          <Table
            columns={priorityColumns}
            dataSource={priorityData}
            rowSelection={rowSelection}
            size="small"
            pagination={false}
            rowKey={(record) => record.item}
            rowClassName="priority-row"
            scroll={{ y: 240 }}
            style={{ padding: '0 0 10px 30px', width: 300 }}
          />
        </div>
      </Form>
    );
  }
}
export default GroupManageConfiguration;
