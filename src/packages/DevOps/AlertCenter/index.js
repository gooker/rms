import React, { Component } from 'react';
import { Button, Divider, Row, Table, Tag } from 'antd';
import { connect } from '@/utils/RmsDva';
import AlertCenterSearch from './AlertCenterSearch';
import FormattedMessage from '@/components/FormattedMessage';
import { convertToUserTimezone, dealResponse, formatMessage, isNull } from '@/utils/util';
import {
  allUpdateProblemHandling,
  batchUpdateAlertCenter,
  fetchAlertCenterList,
} from '@/services/XIHEService';
import commonStyles from '@/common.module.less';
import TablePageWrapper from '@/components/TablePageWrapper';
import { DisconnectOutlined, ReloadOutlined } from '@ant-design/icons';
import TableWithPages from '@/components/TableWithPages';

const alertType = { TASK_ALERT: 'magenta', Vehicle_ALERT: 'red', SYSTEM_ALERT: 'volcano' };
const alertLevel = { ERROR: 'red', WARN: '#f5df19', INFO: 'blue' };

@connect(({ user }) => ({
  sectionId: user.sectionId,
}))
class QuestionCenter extends Component {
  state = {
    loading: false,
    formValue: {},
    selectedRowKeys: [],
    questionList: [],
    pagination: {
      pageSize: 10,
      current: 1,
      total: 0,
    },
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const { dispatch, sectionId } = this.props;
    const { formValue, pagination } = this.state;
    const params = {
      ...formValue,
      current: pagination.current,
      size: pagination.pageSize,
      sectionId,
    };
    this.setState({ loading: true });
    const response = await fetchAlertCenterList(params);
    if (!dealResponse(response)) {
      const { list, page } = response;
      this.setState({
        questionList: list,
        pagination: { current: page.currentPage, pageSize: page.size, total: page.totalElements },
      });
    }
    dispatch({ type: 'user/fetchNotice', payload: sectionId });
    this.setState({ selectedRowKeys: [], loading: false });
  };

  search = (value) => {
    const formValue = { ...value };
    const pagination = {
      pageSize: 10,
      current: 1,
    };
    this.setState({ formValue, pagination }, () => {
      this.getData();
    });
  };

  handleTableChange = (page) => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: { ...pagination, current: page?.current, pageSize: page?.pageSize },
      },
      () => {
        this.getData();
      },
    );
  };

  onDetail = (record) => {
    //
  };

  onSelectedHandle = async () => {
    const { selectedRowKeys } = this.state;
    const response = await batchUpdateAlertCenter(selectedRowKeys);
    if (!dealResponse(response, true)) {
      this.getData();
    }
  };

  onAllHandle = async () => {
    const response = await allUpdateProblemHandling();
    if (!dealResponse(response, true)) {
      this.getData();
    }
  };

  column = [
    {
      title: formatMessage({ id: 'vehicle.id' }),
      dataIndex: 'vehicleId',
      align: 'center',
      fixed: 'left',
      render: (text, record) => {
        if (!isNull(text)) {
          return (
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => {
                this.onDetail(record);
              }}
            >
              {text}
            </span>
          );
        }
      },
    },
    {
      title: formatMessage({ id: 'app.common.type' }),
      dataIndex: 'alertType',
      align: 'center',
      render: (text) => {
        if (!isNull(text)) {
          return (
            <Tag color={alertType[text]}>{formatMessage({ id: `app.alarmCenter.${text}` })}</Tag>
          );
        }
      },
    },
    {
      title: formatMessage({ id: 'app.task.id' }),
      dataIndex: 'taskId',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.firstTime' }), // 首发时间
      dataIndex: 'createTime',
      align: 'center',
      render: (text) => {
        return !isNull(text) && convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  expandedRowRender = (currentItemData) => {
    if (currentItemData) {
      const itemColumns = [
        {
          title: <FormattedMessage id="app.alarmCenter.code" />,
          dataIndex: 'alertCode',
          align: 'center',
        },
        { title: <FormattedMessage id="app.map.cell" />, dataIndex: 'cellId', align: 'center' },
        {
          title: <FormattedMessage id="app.alarmCenter.count" />,
          dataIndex: 'alertCount',
          align: 'center',
        },
        {
          title: <FormattedMessage id="app.alarmCenter.level" />,
          dataIndex: 'alertItemLevel',
          align: 'center',
          render: (text) => {
            if (!isNull(text)) {
              return <span style={{ color: alertLevel[text] }}>{text}</span>;
            }
          },
        },
        {
          title: <FormattedMessage id="app.common.type" />,
          dataIndex: 'alertItemType',
          align: 'center',
        },
        {
          title: <FormattedMessage id="app.alarmCenter.alertName" />,
          dataIndex: 'alertNameI18NKey',
          align: 'center',
        },
        {
          title: <FormattedMessage id="app.alarmCenter.alertContent" />,
          dataIndex: 'alertContentI18NKey',
          align: 'center',
        },
      ];
      return (
        <Table
          columns={itemColumns}
          dataSource={currentItemData}
          pagination={false}
          rowKey={(_, index) => index}
        />
      );
    }
  };

  render() {
    const { selectedRowKeys, pagination, loading, questionList } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
      getCheckboxProps: (record) => ({
        disabled: record.isHandle,
        name: record.name,
      }),
    };

    return (
      <TablePageWrapper>
        <div>
          <AlertCenterSearch
            search={this.search}
            resetValues={() => {
              this.setState({ formValue: {} });
            }}
          />
          <Divider style={{ margin: '0 0 20px 0' }} />
          <Row className={commonStyles.tableToolLeft}>
            <Button
              disabled={questionList.length === 0}
              onClick={() => {
                this.onAllHandle();
              }}
            >
              <DisconnectOutlined /> <FormattedMessage id={'app.alarmCenter.dismissedAll'} />
            </Button>
            <Button
              onClick={() => {
                this.onSelectedHandle();
              }}
              disabled={selectedRowKeys.length === 0}
            >
              <DisconnectOutlined /> <FormattedMessage id={'app.alarmCenter.dismissedSelected'} />
            </Button>
            <Button type="primary" onClick={this.getData}>
              <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Row>
        </div>
        <TableWithPages
          loading={loading}
          rowKey={({ id }) => id}
          columns={this.column}
          dataSource={questionList}
          rowSelection={rowSelection}
          onChange={this.handleTableChange}
          expandable={{
            expandedRowRender: (record) => this.expandedRowRender(record?.alertItemList),
          }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) =>
              `${formatMessage({ id: 'app.template.tableRecord' }, { count: total })}`,
          }}
        />
      </TablePageWrapper>
    );
  }
}
// 问题处理中心
export default QuestionCenter;
