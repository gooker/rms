import React, { Component } from 'react';
import {
  Row,
  Col,
  Form,
  Button,
  InputNumber,
  Card,
  Table,
  Input,
  TreeSelect,
  Select,
  Radio,
  Popover,
} from 'antd';
import { isNull, formatMessage, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const FormItem = Form.Item;
const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 16 } };
const rulesValidate = [
  {
    pattern: /^[0-9]*$/,
    message: formatMessage({ id: 'app.taskTrigger.timeRulesMessage' }),
  },
];
class TaskTriggerModal extends Component {
  formRef = React.createRef();

  state = {
    batchUpdateNumvisible: false,
    keyType: 'sourceLimit',
    treeSelectValue: [],
    treeData: [],
    selectedRowKeys: [],
    limitNumData: [],
    searchValue: null,
  };

  componentDidMount() {
    const { getTasksByCustomGroup, updateItem } = this.props;
    const { setFieldsValue } = this.formRef.current;
    this.getTreeData(getTasksByCustomGroup);

    /* 编辑操作赋值 */
    if (updateItem) {
      const setValues = {
        type: updateItem.type,
        describe: updateItem.children[0].describe,
      };
      if (updateItem.type === 'sourceLimit') {
        setValues.sourcegroup = this.getSourceGroupEdit(updateItem.children);
      } else {
        setValues.sourceType = updateItem.children.map(({ groupName }) => groupName);
      }
      this.setState(
        {
          keyType: updateItem.type,
          limitNumData: updateItem.children,
          treeSelectValue:
            updateItem.type === 'sourceLimit' ? this.getSourceGroupEdit(updateItem.children) : [],
        },
        () => {
          setFieldsValue(setValues);
        },
      );
    }
  }

  limitColumns = [
    {
      title: formatMessage({ id: 'taskLimit.currentlimiting' }),
      dataIndex: 'groupName',
      width: '60%',
      render: (text, record) => {
        if (isNull(record.groupTypeName)) {
          return <>{text}</>;
        }
        return <>{`${record.groupTypeName} / ${text}`}</>;
      },
    },
    {
      title: formatMessage({ id: 'taskLimit.num' }),
      dataIndex: 'limitNum',
      render: (text, record) => (
        <InputNumber
          rules={rulesValidate}
          min={0}
          max={1000}
          onChange={(e) => this.onLimitNumChange(e, record)}
          value={text}
        />
      ),
    },
  ];

  // 对customgroup数据处理
  getTreeData = (getTasksByCustomGroup) => {
    const custom = [...getTasksByCustomGroup];
    const currentTreeData = [];

    custom &&
      custom.forEach((item) => {
        const currentTree = {
          title: item.name,
          key: item.name,
          value: item.name,
          children: [],
        };
        Object.entries(item.groupValue)?.map(([code, value]) => {
          currentTree.children.push({
            title: value,
            value: JSON.stringify({
              group: `${item.name}`,
              valueitem: `${value}`,
              groupCode: `${code}`,
              groupType: `${item.groupType}`,
            }),
            key: JSON.stringify({
              group: `${item.name}`,
              valueitem: `${value}`,
              groupCode: `${code}`,
              groupType: `${item.groupType}`,
            }),
          });
        });
        currentTreeData.push(currentTree);
      });
    this.setState({
      treeData: currentTreeData,
    });
  };

  numFilter = (item, group) => {
    const { limitNumData, keyType } = this.state;
    const { tasksByTypeOptions } = this.props;
    let existRow = null;
    if (limitNumData && limitNumData.length > 0) {
      existRow = limitNumData.filter((value) => {
        if (keyType === 'sourceLimit') {
          return value.groupName === item && value.groupTypeName === group;
        }
        return value.groupName === tasksByTypeOptions[item];
      });
    }
    return existRow && existRow.length > 0 ? existRow[0] : null;
  };

  sourceSearch = (text) => {
    this.setState({ searchValue: text });
  };

  onTreeChange = (value) => {
    const currentValue = [...value];
    const limitNumList = [];
    currentValue.forEach((item) => {
      if (isStrictNull(item)) {
        return;
      }
      const { valueitem, group, groupType, groupCode } = JSON.parse(item);
      const existItem = this.numFilter(valueitem, group);
      isNull(existItem)
        ? limitNumList.push({
            groupName: valueitem,
            groupCode,
            groupTypeName: group,
            groupType,
            limitNum: null,
          })
        : limitNumList.push(existItem);
    });

    this.setState({
      treeSelectValue: value,
      limitNumData: limitNumList,
    });
  };

  onAGVTypeChange = (value) => {
    const { tasksByTypeOptions } = this.props;
    const currentValue = [...value];
    const limitNumList = [];
    currentValue.forEach((item) => {
      const existItem = this.numFilter(item);
      isNull(existItem)
        ? limitNumList.push({
            groupName: tasksByTypeOptions[item],
            groupCode: item,
            limitNum: null,
          })
        : limitNumList.push(existItem);
    });

    this.setState({
      limitNumData: limitNumList,
    });
  };

  // 资源限流 类型限流切换
  onTypeChange = (e) => {
    const { keyType } = this.state;
    const { setFieldsValue } = this.formRef.current;
    const setFields = {
      describe: '',
    };
    if (keyType === 'sourceLimit') {
      setFields.sourcegroup = [];
    } else {
      setFields.sourceType = [];
    }

    this.setState(
      {
        keyType: e.target.value,
        limitNumData: [],
        treeSelectValue: [],
        selectedRowKeys: [],
      },
      () => {
        setFieldsValue(setFields);
      },
    );
  };

  // table-手动更改num
  onLimitNumChange = (e, record) => {
    const { limitNumData, keyType } = this.state;
    const currentNumData = [...limitNumData];
    currentNumData.map((item) => {
      if (keyType === 'sourceLimit') {
        if (item.groupName === record.groupName && item.groupTypeName === record.groupTypeName)
          item.limitNum = e;
      } else {
        if (item.groupName === record.groupName) item.limitNum = e;
      }
    });
    this.setState({
      limitNumData: [...currentNumData],
    });
  };

  // 批量更新popover content
  popNumContent = () => {
    return (
      <>
        <InputNumber
          min={0}
          max={1000}
          ref={(el) => {
            this.batchInput = el;
          }}
        />
        <div style={{ marginTop: 16 }}>
          <Button size={'small'} onClick={this.popNumHidden}>
            <FormattedMessage id={'app.button.cancel'} />
          </Button>
          <Button size={'small'} style={{ marginLeft: 16 }} onClick={this.batchUpdateSubmit}>
            <FormattedMessage id={'app.button.confirm'} />
          </Button>
        </div>
      </>
    );
  };

  popNumHidden = () => {
    this.setState({ selectedRowKeys: [], batchUpdateNumvisible: false });
  };

  // 批量更改优先级
  batchUpdateSubmit = () => {
    const newNum = this.batchInput.value;
    const { limitNumData } = this.state;
    limitNumData.map((e) => {
      e.limitNum = isNull(newNum) || newNum === '' ? null : Number(newNum);
    });
    this.setState({
      selectedRowKeys: [],
      batchUpdateNumvisible: false,
      limitNumData: [...limitNumData],
    });
  };

  getSourceGroupEdit = (data) => {
    const currentData = [...data];
    const newData = [];
    currentData.map((item) => {
      newData.push(
        JSON.stringify({
          group: item.groupTypeName,
          valueitem: item.groupName,
          groupCode: item.groupCode,
          groupType: item.groupType,
        }),
      );
    });
    return newData;
  };

  getGroupType = (data) => {
    const currentGroup = [...data];
    const list = new Set();
    currentGroup.map((i) => {
      list.add(i.groupType);
    });
    return Array.from(list);
  };

  render() {
    const { keyType, limitNumData, selectedRowKeys, batchUpdateNumvisible } = this.state;
    const { tasksByTypeOptions, onSubmit, updateItem } = this.props;
    const limitRowSelection = {
      selectedRowKeys,
      onChange: (_selectedRowKeys) => {
        this.setState({ selectedRowKeys: _selectedRowKeys });
      },
    };

    return (
      <>
        <Form
          ref={this.formRef}
          {...formItemLayout}
          style={{
            flex: '1 1 0%',
          }}
        >
          {/* 类型选择 */}
          <Form.Item
            label={formatMessage({ id: 'taskLimit.currentlimiting' })}
            name='type'
            initialValue={keyType}
          >
            <Radio.Group disabled={!!updateItem} onChange={this.onTypeChange}>
              <Radio value="sourceLimit">
                {formatMessage({ id: 'taskLimit.sourcelimitng' })}
              </Radio>
              <Radio value="taskLimit">
                {formatMessage({ id: 'taskLimit.tasklimiting' })}
              </Radio>
            </Radio.Group>
          </Form.Item>

          {keyType === 'sourceLimit' ? (
            <>
              <FormItem
                name='sourcegroup'
                label={formatMessage({ id: 'taskLimit.sourcelimitng' })}
                rules={[{ required: true }]}
                initialValue={this.state.treeSelectValue}
              >
                <TreeSelect
                  maxTagCount={4}
                  allowClear
                  style={{ width: '100%' }}
                  // value={this.state.treeSelectValue}
                  treeCheckable={true}
                  dropdownStyle={{ maxHeight: 500, overflowY: 'auto' }}
                  treeData={this.state.treeData}
                  treeDefaultExpandAll
                  onChange={this.onTreeChange}
                  onSearch={this.sourceSearch}
                />
              </FormItem>
            </>
          ) : (
            <Form.Item
              label={formatMessage({ id: 'taskLimit.tasklimiting' })}
              name='sourceType'
              rules={[{ required: true }]}
            >
              <Select allowClear mode="multiple" maxTagCount={4} onChange={this.onAGVTypeChange}>
                {Object.entries(tasksByTypeOptions)?.map(([key, value]) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <FormItem name="describe" label={formatMessage({ id: 'app.common.description' })}>
            <Input />
          </FormItem>

          <Row>
            <Col span={6} offset={4} style={{ textAlign: 'right', margin: '15px 30px' }}>
              <Button
                type="primary"
                onClick={() => {
                  this.formRef.current
                    .validateFields()
                    .then((values) => {
                      const currentValues = { ...values };
                      currentValues.limitNumData = limitNumData;
                      if (keyType === 'sourceLimit') {
                        currentValues.groupType = this.getGroupType(limitNumData);
                        delete currentValues.sourcegroup;
                      } else {
                        delete currentValues.sourceType;
                      }
                      if (updateItem) currentValues.id = updateItem.id;
                      onSubmit(currentValues);
                    })
                    .catch(() => {});
                }}
              >
                <FormattedMessage id="app.button.save" />
              </Button>
            </Col>
          </Row>
        </Form>

        {limitNumData && limitNumData.length > 0 ? (
          <Card style={{ marginBottom: 15 }}>
            <div style={{ marginBottom: 15 }}>
              <span>{formatMessage({ id: 'taskLimit.limitTips' })}</span>
              <Popover
                destroyTooltipOnHide
                arrowPointAtCenter={true}
                content={this.popNumContent}
                title={formatMessage({ id: 'taskLimit.updateSelectedNum' })}
                trigger='click'
                visible={batchUpdateNumvisible}
              >
                <Button
                  onClick={() => {
                    this.setState({ batchUpdateNumvisible: true });
                  }}
                  disabled={selectedRowKeys.length === 0}
                  style={{
                    float: 'right',
                  }}
                >
                  <FormattedMessage id='taskLimit.batchUpdateNum' />
                </Button>
              </Popover>
            </div>
            <Table
              columns={this.limitColumns}
              dataSource={limitNumData}
              rowSelection={limitRowSelection}
              size="small"
              pagination={false}
              rowKey={(record) => {
                return record.groupName + record.groupTypeName;
              }}
              scroll={{ y: 240 }}
              style={{ padding: '0 0 10px 30px' }}
            />
          </Card>
        ) : (
          ''
        )}
      </>
    );
  }
}
export default TaskTriggerModal;
