import React from 'react';
import { connect } from '@/utils/RmsDva';
import { Table, Divider, Button, Popconfirm, Row, Tag, Form, Select, Badge, Col } from 'antd';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import styles from '../GroupManage/groupManage.module.less';

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 11 } };
const { Item: FormItem } = Form;
const { Option } = Select;
@connect(({ mapViewGroup }) => ({
  dataSource: mapViewGroup.storageConfigData,
  groupJson: mapViewGroup.groupJson,
}))
class StorageConfigTable extends React.PureComponent {
  state = {
    formRef: React.createRef(),
    groupType: '',
    dataTable: [],
  };

  columns = [
    {
      title: formatMessage({ id: 'sourcemanage.agvgroup.name' }),
      dataIndex: 'groupName',
      align: 'center',
      width: 100,
    },
    {
      title: formatMessage({ id: 'app.map.cell' }),
      dataIndex: 'priority',
      width: 150,
      align: 'center',
      render: (text, record) =>
        record.priority &&
        record.priority.map((item) => (
          <Badge
            count={item.priority}
            key={item.item}
            size="small"
            overflowCount={999}
            offset={[-12, 2]}
            style={{ boxShadow: 'none' }}
          >
            <Tag style={{ margin: '6px 3px' }}>{item.item}</Tag>
          </Badge>
        )),
    },
    {
      title: formatMessage({ id: 'groupManage.key' }),
      align: 'center',
      dataIndex: 'key',
      width: 100,
      ellipsis: true,
    },
    {
      title: formatMessage({ id: 'app.common.operation' }),
      align: 'center',
      width: 110,
      fixed: 'right',
      render: (text, record) => (
        <>
          <Popconfirm
            placement="topRight"
            title={formatMessage({ id: 'app.message.delete.confirm' })}
            onConfirm={() => {
              this.deleteGroupItem(record);
            }}
          >
            <DeleteOutlined />
          </Popconfirm>
          <Divider type="vertical" />
          <EditOutlined
            onClick={() => {
              this.updateGroupItem(record);
            }}
          />
          {record.canView && (
            <>
              <Divider type="vertical" />
              <EyeOutlined
                onClick={() => {
                  const { highLight } = this.props;
                  highLight(record.ids);
                }}
              />
            </>
          )}
        </>
      ),
    },
  ];

  // 删除单条
  deleteGroupItem = (data) => {
    const { dispatch, highLight } = this.props;
    const { dataTable } = this.state;
    // 这是是更改存在redux中的数据
    dispatch({ type: 'mapViewGroup/fetchDeleteStorageGroup', payload: { ...data } });
    highLight([]);
    const newData = dataTable && dataTable.filter((item) => item.id !== data.id);
    this.setState({
      dataTable: [...newData],
    });
  };

  //  删除此分组的全部记录
  deleteAllGroup = () => {
    const { dispatch } = this.props;
    const { groupType } = this.state;
    // 这是是更改存在redux中的数据
    dispatch({ type: 'mapViewGroup/fetchDeleteAllStorageGroup', payload: { groupType } });
    const newData = [];
    this.setState({
      dataTable: [...newData],
    });
  };

  // 编辑
  updateGroupItem = (record) => {
    const { close } = this.props;
    close(true, record);
    // 关闭当前的窗口
    // 打开新增的窗口
    // 赋值
  };

  // 根据dataSource filter 当前groupType的数据
  getTypeData = (type) => {
    const { dataSource = [] } = this.props;
    const currentTableData = dataSource
      .filter((item) => item.groupType === type)
      .map((item) => ({ ...item }));
    return currentTableData || [];
  };

  render() {
    const { dataTable, formRef, groupType } = this.state;
    const { highLight, groupJson, height, width } = this.props;
    return (
      <div style={{ height, width }} className={styles.categoryPanel}>
        <div>
          <FormattedMessage id={'groupManage.config.detail'} />
        </div>
        <div>
          <Form ref={formRef}>
            <Row>
              <Col span={18}>
                <FormItem
                  {...formItemLayout}
                  label={formatMessage({ id: 'editor.emergency.group' })}
                  name="belongGroup"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    placeholder={formatMessage({ id: 'app.common.select' })}
                    style={{ width: '100%' }}
                    values={groupType}
                    showSearch
                    onChange={(values) => {
                      highLight([]);
                      const newData = this.getTypeData(values);
                      this.setState({ groupType: values, dataTable: [...newData] });
                    }}
                  >
                    {groupJson.map((item) => (
                      <Option key={item.value} values={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={6}>
                <Popconfirm
                  title={formatMessage({ id: 'groupManage.tip.deleteGroupAll' })}
                  onConfirm={this.deleteAllGroup}
                  okText={formatMessage({ id: 'app.button.confirm' })}
                  cancelText={formatMessage({ id: 'app.button.cancel' })}
                >
                  <Button type="primary" disabled={dataTable.length === 0}>
                    <FormattedMessage id={'groupManage.button.deleteGroup'} />
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
          </Form>

          <Table
            pagination={false}
            columns={this.columns}
            rowKey="id"
            dataSource={dataTable}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>
    );
  }
}
export default StorageConfigTable;
