import React, { Component } from 'react';
import { Badge, Button, Col, Divider, Row, Tooltip } from 'antd';
import { convertToUserTimezone, dealResponse, formatMessage, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchLatentToteOrders, updateLatentToteOrder } from '@/services/latentToteService';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import RmsConfirm from '@/components/RmsConfirm';
import Dictionary from '@/utils/Dictionary';
import LatentToteOrderSearch from './LatentToteOrderSearch';
import UpdateToteOrderTaskComponent from './UpdateToteOrderTaskComponent';
import commonStyles from '@/common.module.less';
import styles from '../taskOrder.module.less';

const TaskStatus = Dictionary('latentToteOrderStatus');
const TaskStatusColor = Dictionary('latentToteStatusColor');

class LatentToteOrderComponent extends Component {
  state = {
    formValues: {}, // 保存查询表单的值
    loading: false,
    selectedRows: [],
    selectedRowKeys: [],

    dataSource: [],
    page: { currentPage: 1, size: 10, totalElements: 0 },
    updateVisible: false,
  };

  componentDidMount() {
    this.getData();
  }

  columns = [
    {
      title: formatMessage({ id: 'app.task.id' }),
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
      render: (text) => {
        return (
          <Tooltip title={text}>
            <span className={commonStyles.textLinks}>
              {text ? '*' + text.substr(text.length - 6, 6) : null}
            </span>
          </Tooltip>
        );
      },
    },

    {
      title: formatMessage({ id: 'latentTote.mainStationCode' }),
      dataIndex: 'mainStationCode',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.task.state' }),
      dataIndex: 'toteOrderStatus',
      align: 'center',
      render: (text) => {
        if (!isStrictNull(text)) {
          return (
            <Badge color={TaskStatusColor[text]} text={formatMessage({ id: TaskStatus[text] })} />
          );
        } else {
          return <FormattedMessage id="app.taskDetail.notAvailable" />;
        }
      },
    },
    {
      title: <FormattedMessage id="app.task.type" />,
      dataIndex: 'toteHandleType',
      render: (text) => {
        if (isStrictNull(text)) return '-';
        return formatMessage({ id: `app.simulateTask.toteTaskType.${text}` });
      },
    },
    {
      title: formatMessage({ id: 'app.common.priority' }),
      dataIndex: 'priority',
      align: 'center',
    },

    {
      title: formatMessage({ id: 'app.taskDetail.createUser' }),
      dataIndex: 'createdByUser',
      align: 'center',
    },

    {
      title: formatMessage({ id: 'app.common.creationTime' }),
      dataIndex: 'createTime',
      align: 'center',
      render: (text) => {
        if (!text) {
          return <span>{formatMessage({ id: 'app.taskDetail.notAvailable' })}</span>;
        }
        return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: formatMessage({ id: 'app.common.updateTime' }),
      dataIndex: 'updateTime',
      align: 'center',
      render: (text) => {
        if (!text) {
          return <span>{formatMessage({ id: 'app.taskDetail.notAvailable' })}</span>;
        }
        return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
  ];

  expandColumns = [
    {
      title: formatMessage({ id: 'app.pod.id' }),
      dataIndex: 'podId',
    },
    {
      title: formatMessage({ id: 'app.taskDetail.binCode' }),
      dataIndex: 'binCode',
    },
    {
      title: formatMessage({ id: 'app.taskDetail.toteCode' }),
      dataIndex: 'toteCode',
    },
    {
      title: formatMessage({ id: 'app.pod.direction' }),
      dataIndex: 'face',
    },
    {
      title: formatMessage({ id: 'app.common.angle' }),
      dataIndex: 'angle',
    },
    {
      title: formatMessage({ id: 'app.map.workStation' }),
      dataIndex: 'stationCode',
    },
    {
      title: formatMessage({ id: 'latentTote.targetTime' }),
      dataIndex: 'targetTimeStamp',
      render: (text) => {
        if (!text) {
          return <span>{formatMessage({ id: 'app.taskDetail.notAvailable' })}</span>;
        }
        return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
  ];

  /**
   * 查询方法
   * @param {*} values 查询条件
   * @param {*} firstPage 查询成功后是否跳转到第一页
   */
  getData = async (values, firstPage) => {
    const {
      page: { currentPage, size },
    } = this.state;

    this.setState({ loading: true, selectedRows: [], selectedRowKeys: [] });

    let requestValues;
    if (values) {
      requestValues = { ...values };
      this.setState({ formValues: values });
    } else {
      requestValues = { ...this.state.formValues };
    }

    const params = { current: !!firstPage ? 1 : currentPage, size, ...requestValues };
    const response = await fetchLatentToteOrders(params);
    if (!dealResponse(response)) {
      const { list, page } = response;
      const currentList = list?.map((item) => {
        const {
          binTote: { id, ...otherBintote },
        } = item;
        return { ...item, ...otherBintote, binToteId: id };
      });
      this.setState({ dataSource: currentList ?? [], page });
    }
    this.setState({ loading: false });
  };

  handleTableChange = (pagination) => {
    const page = { ...this.state.page, currentPage: pagination.current, size: pagination.pageSize };
    this.setState({ page }, () => {
      this.getData(null, false);
    });
  };

  openCancelTaskConfirm = async () => {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.cancelTask.confirm' }),
      onOk: this.cancelTask,
    });
  };

  cancelTask = async () => {
    const { selectedRowKeys } = this.state;
    const requestBody = {
      id: selectedRowKeys[0],
      editType: 'CANCEL',
    };
    const response = await updateLatentToteOrder(requestBody);
    if (!dealResponse(response, 1)) {
      this.setState({ selectedRowKeys: [], selectedRows: [] }, this.getData);
    }
  };

  rowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  render() {
    const { loading, selectedRowKeys, selectedRows, dataSource, page, updateVisible } = this.state;
    return (
      <TablePageWrapper>
        <LatentToteOrderSearch search={this.getData} />
        <div className={styles.taskSearchDivider}>
          <Row>
            <Divider />

            <Col flex="auto" className={commonStyles.tableToolLeft}>
              <Button
                danger
                disabled={selectedRowKeys.length !== 1}
                onClick={this.openCancelTaskConfirm}
                style={{ marginBottom: 10 }}
              >
                <FormattedMessage id={'app.taskDetail.cancelTask'} />
              </Button>
              <Button
                disabled={selectedRowKeys.length !== 1}
                onClick={() => {
                  this.setState({ updateVisible: true });
                }}
                style={{ marginBottom: 10 }}
              >
                <FormattedMessage id={'app.button.edit'} />
              </Button>
            </Col>
          </Row>

          <TableWithPages
            loading={loading}
            scroll={{ x: 'max-content' }}
            rowKey={(record) => record.id}
            dataSource={dataSource}
            columns={this.columns}
            rowSelection={{ selectedRowKeys, onChange: this.rowSelectChange }}
            pagination={{
              current: page.currentPage,
              pageSize: page.size,
              total: page.totalElements || 0,
              showTotal: (total) =>
                formatMessage({ id: 'app.common.tableRecord' }, { count: total }),
            }}
            onChange={this.handleTableChange}
            expandColumns={this.expandColumns}
            // expandColumnsKey={'binTote'}
            expandColumnsSpan={6}
          />

          {updateVisible && (
            <UpdateToteOrderTaskComponent
              visible={updateVisible}
              updateRecord={selectedRows[0]}
              onClose={() => {
                this.setState({ updateVisible: false, selectedRows: [], selectedRowKeys: [] });
              }}
              onRefresh={this.getData}
            />
          )}
        </div>
      </TablePageWrapper>
    );
  }
}
export default LatentToteOrderComponent;
