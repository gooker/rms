import React, { Component } from 'react';
import { Table, Row, Button, Divider, Tag } from 'antd';
import { connect } from '@/utils/RmsDva';
import QuestionSearch from './QuestionSearch';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, GMT2UserTimeZone, isNull } from '@/utils/util';
import {
  allUpdateProblemHandling,
  batchUpdateAlertCenter,
  fetchAlertCenterList,
} from '@/services/XIHE';
import styles from './questionCenter.module.less';

const alertType = { TASK_ALERT: 'magenta', AGV_ALERT: 'red', SYSTEM_ALERT: 'volcano' };
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
    this.setState({ formValue }, () => {
      this.getData();
    });
  };

  handleTableChange = (page) => {
    const { pagination } = this.state;
    this.setState({
      pagination: { ...pagination, current: page?.current, pageSize: page?.pageSize },
    });
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
      title: formatMessage({ id: 'app.agv.id' }),
      dataIndex: 'agvId',
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
            <Tag color={alertType[text]}>{formatMessage({ id: `app.alertCenter.${text}` })}</Tag>
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
        return !isNull(text) && GMT2UserTimeZone(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  expandedRowRender = (currentItemData) => {
    if (currentItemData) {
      const itemColumns = [
        {
          title: <FormattedMessage id="app.alertCenter.code" />,
          dataIndex: 'alertCode',
          align: 'center',
        },
        { title: <FormattedMessage id="app.map.cell" />, dataIndex: 'cellId', align: 'center' },
        {
          title: <FormattedMessage id="app.alertCenter.count" />,
          dataIndex: 'alertCount',
          align: 'center',
        },
        {
          title: <FormattedMessage id="app.alertCenter.level" />,
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
          title: <FormattedMessage id="app.alertCenter.alertName" />,
          dataIndex: 'alertNameI18NKey',
          align: 'center',
        },
        {
          title: <FormattedMessage id="app.alertCenter.alertContent" />,
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
      <div className={styles.commonPageStyle}>
        <div className={styles.toolBar}>
          <QuestionSearch
            search={this.search}
            resetValues={() => {
              this.setState({ formValue: {} });
            }}
          />
          <Divider />
          <Row>
            <Button
              disabled={questionList.length === 0}
              onClick={() => {
                this.onAllHandle();
              }}
            >
              <FormattedMessage id={'app.alertCenter.dismissedAll'} />
            </Button>
            <Button
              onClick={() => {
                this.onSelectedHandle();
              }}
              disabled={selectedRowKeys.length === 0}
            >
              <FormattedMessage id={'app.alertCenter.dismissedSelected'} />
            </Button>
            <Button type="primary" onClick={this.getData}>
              <FormattedMessage id="app.button.refresh" />
            </Button>
          </Row>
        </div>
        <div className={styles.tableWrapper}>
          <Table
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total) =>
                `${formatMessage({ id: 'app.common.tableRecord' }, { count: total })}`,
            }}
            columns={this.column}
            dataSource={questionList}
            rowSelection={rowSelection}
            onChange={this.handleTableChange}
            loading={loading}
            rowKey={({ id }) => id}
            expandable={{
              expandedRowRender: (record) => this.expandedRowRender(record?.alertItemList),
            }}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>
    );
  }
}
// 问题处理中心
export default QuestionCenter;
