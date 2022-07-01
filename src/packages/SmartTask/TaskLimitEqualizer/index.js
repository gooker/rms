import React, { Component } from 'react';
import { Button, Modal, Row, Spin, Table } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';
import {
  deleteTaskLimit,
  fetchActiveMap,
  getTaskLimit,
  getVehicleTasksByCustomGroup,
  getVehicleTasksByType,
  saveTaskLimit,
} from '@/services/commonService';
import TaskLimitModal from './TaskLimitModal';
import commonStyles from '@/common.module.less';

class TaskTrigger extends Component {
  state = {
    checkedType: [],
    getTasksByType: {}, // 任务类型限流
    getTasksByCustomGroup: [], // 资源组限流
    taskLimitings: [],
    loading: false,
    selectedRows: [],
    selectedRowKeys: [],
    updateLimitRecord: null,
    limitModalVisible: false, // 任务限流弹框
    mapId: null,
    page: {
      current: 1,
      size: 10,
    },
  };

  formRef = React.createRef();

  columns = [
    {
      title: <FormattedMessage id="app.common.name" />,
      dataIndex: 'groupName',
      width: '25%',
    },
    {
      title: <FormattedMessage id="app.common.description" />,
      dataIndex: 'describe',
      render: (text, record) => <>{record && record.children ? record.children[0].describe : ''}</>,
    },
    {
      title: <FormattedMessage id="taskLimit.quantity" />,
      dataIndex: 'limitNum',
    },
    {
      title: <FormattedMessage id="app.common.operation" />,
      dataIndex: 'key',
      render: (_, record) => {
        return (
          <>
            {record && record.children ? (
              <Button
                type="link"
                onClick={() => {
                  this.updateGroupItem(record);
                }}
              >
                <FormattedMessage id="app.button.edit" />
              </Button>
            ) : (
              ''
            )}
          </>
        );
      },
    },
  ];

  componentDidMount() {
    this.getVehicleTasks();
  }

  getVehicleTasks = async () => {
    this.setState({ loading: true });
    const originalMapData = await fetchActiveMap();
    if (dealResponse(dealResponse, 1)) {
      const payload = { mapId: originalMapData.id };
      this.getVehicleTaskLists(originalMapData.id);
      // 根据mapId 获取资源组限流
      const response = await getVehicleTasksByCustomGroup(payload);
      if (!dealResponse(response, 1)) {
        this.setState({
          getTasksByCustomGroup: response,
        });
      }
    }
    this.setState({ loading: false });
    const getTasksByType = await getVehicleTasksByType(); // 类型限流
    if (!dealResponse(getTasksByType)) {
      this.setState({
        getTasksByType,
        mapId: originalMapData.id,
      });
    }
  };

  getVehicleTaskLists = async (mapId, type) => {
    // 列表接口
    const query = {};
    if (!isNull(mapId)) query.mapId = mapId;
    if (!isNull(type)) query.type = type;
    const responseLists = await getTaskLimit({ ...query });
    let taskLists = [];
    if (!dealResponse(responseLists)) {
      const currentLists = [...responseLists];
      currentLists.map((item) => {
        let sourceItem = { children: [...item.limitDatas] };
        if (isNull(item.name) && item?.limitDatas) {
          sourceItem = {
            groupName: formatMessage({ id: 'app.common.type' }),
            type: 'taskLimit',
          };
        } else {
          sourceItem = {
            groupName: item.name,
            type: 'sourceLimit',
          };
        }
        taskLists = [...taskLists, sourceItem];
      });

      this.setState({
        taskLimitings: [...taskLists],
      });
    }
  };

  handleLimitModal = () => {
    const { getTasksByCustomGroup, getTasksByType } = this.state;
    this.setState({
      limitModalVisible: true,
      getTasksByCustomGroup,
      getTasksByType,
    });
  };

  // 保存
  taskLimitSubmit = async (values) => {
    const { mapId } = this.state;
    const currentValues = { ...values };
    currentValues.mapId = mapId;
    const response = await saveTaskLimit(currentValues);
    if (!dealResponse(response, 1)) {
      this.setState({
        limitModalVisible: false,
        updateLimitRecord: null,
      });
      this.getVehicleTaskLists(mapId);
    }
  };

  // 编辑
  updateGroupItem = (record) => {
    this.setState({
      limitModalVisible: true,
      updateLimitRecord: record,
    });
  };

  checkBoxOnChange = (checkedValues) => {
    this.setState({ checkedType: checkedValues });
  };

  search = () => {
    const { mapId } = this.state;
    this.getVehicleTaskLists(mapId);
  };

  // 任务取消
  onDelete = () => {
    const { selectedRows } = this.state;
    const currentseleteRows = selectedRows.filter((item) => isNull(item.children));
    const _this = this;

    RmsConfirm({
      content: formatMessage({ id: 'app.message.doubleConfirm' }),
      onOk: async () => {
        // delete 调接口
        const deleteIds = currentseleteRows.map(({ id }) => id);
        const deleteResult = await deleteTaskLimit([...deleteIds]);
        if (!dealResponse(deleteResult, 1)) {
          _this.setState({
            selectedRowKeys: [],
            selectedRows: [],
          });
          _this.search();
        }
      },
      onCancel() {
        _this.setState({
          selectedRowKeys: [],
          selectedRows: [],
        });
      },
    });
  };

  render() {
    const {
      taskLimitings,
      loading,
      selectedRowKeys,
      limitModalVisible,
      updateLimitRecord,
      getTasksByType,
      getTasksByCustomGroup,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      checkStrictly: false,
      onChange: (_selectedRowKeys, _selectedRows) => {
        this.setState({ selectedRows: _selectedRows, selectedRowKeys: _selectedRowKeys });
      },
    };

    return (
      <div className={commonStyles.commonPageStyle}>
        <Spin spinning={loading}>
          <Row style={{ marginBottom: 20 }}>
            <Button
              disabled={selectedRowKeys.length === 0}
              onClick={() => {
                this.onDelete();
              }}
            >
              <FormattedMessage id="app.button.delete" />
            </Button>

            <Button
              type="primary"
              style={{ marginLeft: 15 }}
              onClick={() => {
                this.handleLimitModal();
              }}
            >
              <FormattedMessage id="app.button.add" />
            </Button>
          </Row>

          <Table
            pagination={false}
            rowSelection={rowSelection}
            columns={this.columns}
            dataSource={taskLimitings}
            rowKey={'groupName'}
          />
        </Spin>

        {/*  新增 编辑的弹窗 */}
        <Modal
          visible={limitModalVisible}
          footer={null}
          destroyOnClose
          maskClosable={false}
          title={
            !updateLimitRecord
              ? formatMessage({ id: 'app.button.add' })
              : formatMessage({ id: 'app.button.update' })
          }
          width={550}
          onCancel={() => {
            this.setState({ limitModalVisible: false, updateLimitRecord: null });
          }}
          style={{ top: 10 }}
        >
          {
            <TaskLimitModal
              onSubmit={this.taskLimitSubmit}
              updateItem={updateLimitRecord}
              tasksByTypeOptions={getTasksByType}
              getTasksByCustomGroup={getTasksByCustomGroup}
            />
          }
        </Modal>
      </div>
    );
  }
}
export default TaskTrigger;
