import React, { Component } from 'react';
import { Modal, Input, Table, Button, message, Popconfirm } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { deleteSearchSeek, fetchAllSearchSeeds } from '@/services/latentLifting';
import { formatMessage } from '@/utils/util';
import { getFirstSetItem, getLabelByValue } from '../utils.js';
import FormattedMessage from '@/components/FormattedMessage';
import KpiSearchConditions from './KpiSearchConditions';
import styles from '../TaskKpi.module.less';

export default class KpiSavedSeedModal extends Component {
  state = {
    deleteLoading: false,
    isFetching: false,
    dataSource: [],
    selectedRowKeys: [],
    selectedRows: [],
    pagination: { pageSize: 10, current: 1, total: 0 },
    compareDisabled: true,

    // 查询条件
    searchName: null,
    isBaseHour: false,
    startTime: '',
    endTime: '',
    taskType: 'ALL',
    targetCells: [],
  };

  // 用于实现打开Modal显示最新数据
  UNSAFE_componentWillReceiveProps(newProps) {
    const { visible } = this.props;
    if (visible !== newProps.visible && newProps.visible) {
      this.getSeeds();
    }
  }

  getSeeds = async () => {
    // 这里有个隐藏 Bug, 但是第一版本不需要关注: 表格只会显示 非按小时 和 按小时，不会一起显示
    // 1. 比较 以保存的查询 目前只需要比较 任务类型相同 && 非按小时
    this.setState({ isFetching: true });
    const { startTime, endTime, taskType, targetCells, isBaseHour, searchName, pagination } =
      this.state;
    const requestParam = {};

    // 分页
    requestParam.size = pagination.pageSize;
    requestParam.current = pagination.current || 1;

    // 搜索条件
    if (startTime) requestParam.startTime = startTime;
    if (endTime) requestParam.endTime = endTime;
    if (taskType !== 'ALL') requestParam.taskType = taskType;
    if (searchName && searchName.trim() !== '') requestParam.name = searchName;
    if (targetCells.length > 0) requestParam.targetCellId = targetCells;
    requestParam.hourFlag = isBaseHour;

    const response = await fetchAllSearchSeeds(requestParam);
    this.setState({ isFetching: false });
    if (response && response.list && response.page) {
      const { list, page } = response;
      // 处理分页
      const pagination = { ...this.state.pagination };
      pagination.pageSize = page.size;
      pagination.current = page.currentPage;
      pagination.total = page.totalElements;
      this.setState({ dataSource: list, pagination });
    } else {
      message.error(formatMessage({ id: 'app.report.fetchSavedQueryFail' }));
      this.setState({ dataSource: [] });
    }
  };

  handleTableChange = (pagination) => {
    this.setState({ pagination: { ...pagination } }, this.getSeeds);
  };

  handleDeleteRecord = async (record) => {
    this.setState({ deleteLoading: true });
    await deleteSearchSeek(record.id);
    message.success(formatMessage({ id: 'app.message.operateSuccess' }));
    this.setState({ deleteLoading: false });
    this.getSeeds();
  };

  // 查询条件
  handleInputChange = (ev) => {
    this.setState({ searchName: ev.target.value });
  };

  changeIsBaseHour = (ev) => {
    this.setState({ isBaseHour: ev.target.checked });
  };

  searchTaskTypeChanged = (taskType) => {
    this.setState({ taskType });
  };

  searchTargetCellChanged = (targetCells) => {
    this.setState({ targetCells });
  };

  dateRangePickerChanged = (value, dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    });
  };

  // 条目选择
  handleSelectRows = (selectedRowKeys) => {
    const { dataSource } = this.state;
    const selectedRows = [];
    selectedRowKeys.forEach((index) => {
      selectedRows.push({ ...dataSource[index] });
    });
    //// 判断是否可以进行对比( 任务类型相同 && 非按小时)
    const compareDisabled = this.jugeCompareEnabled(selectedRows);
    this.setState({ selectedRowKeys, selectedRows, compareDisabled });
  };

  jugeCompareEnabled = (selectedRows) => {
    let compareDisabled = false;
    const taskTypeSet = new Set();
    const hourFlagTypeSet = new Set();
    for (const row of selectedRows) {
      const { kpiSearchParam } = row;
      taskTypeSet.add(kpiSearchParam.taskType || 'ALL');
      hourFlagTypeSet.add(kpiSearchParam.hourFlag);
    }

    // 同类型 && 都不是按小时
    compareDisabled =
      selectedRows.length === 1 ||
      (taskTypeSet.size === 1 &&
        hourFlagTypeSet.size === 1 &&
        getFirstSetItem(hourFlagTypeSet) === false);

    return !compareDisabled;
  };

  startComparing = () => {
    const { selectedRows } = this.state;
    this.props.onOk(selectedRows);
  };

  closeModal = () => {
    const { onCancel } = this.props;
    this.setState(
      { selectedRowKeys: [], selectedRows: [], compareDisabled: true, searchName: null },
      onCancel,
    );
  };

  columns = [
    {
      title: formatMessage({ id: 'app.common.name' }),
      dataIndex: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: formatMessage({ id: 'app.common.startTime' }),
      dataIndex: 'kpiSearchParam.startTime',
      align: 'center',
      width: 200,
    },

    {
      title: formatMessage({ id: 'app.common.endTime' }),
      dataIndex: 'kpiSearchParam.endTime',
      align: 'center',
      width: 200,
    },
    {
      title: formatMessage({ id: 'app.report.baseHour' }),
      dataIndex: 'kpiSearchParam.hourFlag',
      align: 'center',
      width: 130,
      render: (text) =>
        text ? formatMessage({ id: 'app.common.true' }) : formatMessage({ id: 'app.common.false' }),
    },
    {
      title: formatMessage({ id: 'app.map.targetCell' }),
      dataIndex: 'kpiSearchParam.targetCellId',
      align: 'center',
      width: 200,
      render: (text) => {
        if (text && Array.isArray(text)) {
          return text.join();
        }
      },
    },
    {
      title: formatMessage({ id: 'app.task.type' }),
      dataIndex: 'kpiSearchParam.taskType',
      align: 'center',
      width: 200,
      render: (text) =>
        text ? getLabelByValue(text) : formatMessage({ id: 'app.report.taskType.all' }),
    },
    {
      title: formatMessage({ id: 'app.common.creator' }),
      dataIndex: 'createdByUser',
      align: 'center',
      width: 200,
    },
    {
      title: formatMessage({ id: 'app.common.creationTime' }),
      dataIndex: 'createTime',
      align: 'center',
      width: 200,
    },
    {
      title: formatMessage({ id: 'app.common.operation' }),
      key: 'operation',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <Popconfirm
          title={formatMessage({ id: 'app.message.delete.confirm' })}
          onConfirm={() => {
            this.handleDeleteRecord(record);
          }}
          okText={formatMessage({ id: 'app.button.confirm' })}
          cancelText={formatMessage({ id: 'app.button.cancel' })}
        >
          <Button type="link" loading={this.state.deleteLoading}>
            <FormattedMessage id={'app.button.delete'} />
          </Button>
        </Popconfirm>
      ),
    },
  ];

  render() {
    const {
      endTime,
      taskType,
      startTime,
      isFetching,
      isBaseHour,
      dataSource,
      pagination,
      targetCells,
      selectedRows,
      compareDisabled,
      selectedRowKeys,
    } = this.state;
    const { visible } = this.props;
    const rowSelection = {
      selectedRowKeys,
      columnTitle: ' ', // 去掉全多选CheckBox
      onChange: this.handleSelectRows,
      getCheckboxProps: () => ({
        disabled: selectedRows.length >= 8,
      }),
    };
    return (
      <Modal
        destroyOnClose
        width={1200}
        title={formatMessage({ id: 'app.report.savedSearchResult' })}
        visible={visible}
        onOk={this.startComparing}
        okText={
          selectedRows.length === 1
            ? formatMessage({ id: 'app.button.check' })
            : formatMessage({ id: 'app.report.compare' })
        }
        okButtonProps={{ disabled: compareDisabled }}
        onCancel={this.closeModal}
      >
        <div className={styles.tools} style={{ marginBottom: '25px' }}>
          <div style={{ width: '150px', marginRight: '10px' }}>
            <Input
              placeholder={formatMessage({ id: 'app.common.name' })}
              onChange={this.handleInputChange}
            />
          </div>
          <KpiSearchConditions
            startTime={startTime}
            endTime={endTime}
            isBaseHour={isBaseHour}
            taskType={taskType}
            targetCells={targetCells}
            changeIsBaseHour={this.changeIsBaseHour}
            searchTaskTypeChanged={this.searchTaskTypeChanged}
            dateRangePickerChanged={this.dateRangePickerChanged}
            searchTargetCellChanged={this.searchTargetCellChanged}
          />
          <div style={{ marginLeft: '25px' }}>
            <Button type="primary" onClick={this.getSeeds}>
              <SearchOutlined /> <FormattedMessage id="app.button.search" />
            </Button>
          </div>
        </div>
        <Table
          bordered
          loading={isFetching}
          columns={this.columns}
          dataSource={dataSource}
          pagination={pagination}
          rowSelection={rowSelection}
          onChange={this.handleTableChange}
          rowKey={(record) => record.id}
        />
      </Modal>
    );
  }
}
