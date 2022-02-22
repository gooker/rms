import React, { Component } from 'react';
import { DatePicker, Input, Button } from 'antd';
import { saveAs } from 'file-saver';
import { Parser } from 'json2csv';
import moment from 'moment';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import { dealResponse, formatMessage } from '@/utils/util';
import { fetchUserLoginHistory } from '@/services/SSO';
import TableWidthPages from '@/components/TableWidthPages';

const { RangePicker } = DatePicker;

export default class UserLoginHistory extends Component {
  state = {
    type: null,
    username: null,
    startTime: null,
    endTime: null,
    historySource: [],
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },

    loading: false,
  };

  getColumn = [
    {
      title: <FormattedMessage id="sso.user.name" />,
      dataIndex: 'username',
      align: 'center',
      fixed: 'left',
    },
    {
      title: <FormattedMessage id="sso.user.loginTime" />,
      dataIndex: 'operationTime',
      align: 'center',
      render: (text) => new moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: <FormattedMessage id="app.common.remark" />,
      dataIndex: 'comment',
      align: 'center',
    },
  ];

  componentDidMount() {
    this.getHistory();
  }

  getHistory = async () => {
    this.setState({ loading: true });
    const {
      pagination: { current, size, operationTime },
      type,
      username,
      startTime,
      endTime,
    } = this.state;
    const response = await fetchUserLoginHistory({
      current,
      size,
      type,
      username,
      startTime,
      endTime,
      operationTime,
    });
    if (!dealResponse(response)) {
      const { page } = response;
      this.setState({
        historySource: response.list,
        pagination: {
          current: page.currentPage,
          size: page.size,
          total: page.totalElements || 0,
        },
      });
    }
    this.setState({ loading: false });
  };

  handleTableChange = (pagination, _, sorter) => {
    const pages = {
      current: pagination.current,
      size: pagination.pageSize,
    };
    this.setState({ pagination: pages }, () => {
      this.getHistory();
    });
  };

  exportHistory = () => {
    const { historySource } = this.state;
    const fields = [];
    this.getColumn.map(({ title, dataIndex }) => {
      fields.push({
        label: formatMessage({ id: title.props.id }),
        value: dataIndex,
      });
    });
    const Json2csvParser = new Parser({ fields });
    const csvData = Json2csvParser.parse(historySource);
    const blob = new Blob(['\uFEFF' + csvData], { type: 'text/plain;charset=utf-8;' });
    saveAs(blob, `${formatMessage({ id: 'userLoginHistory.outputFile' })}.csv`);
  };

  render() {
    const { loading, pagination, historySource } = this.state;
    return (
      <TablePageWrapper>
        <div>
          <Input
            allowClear
            style={{ width: 150, marginRight: 15 }}
            placeholder={formatMessage({ id: 'sso.user.name', format: false })}
            onChange={(e) => {
              this.setState({ username: e.target.value });
            }}
          />
          <RangePicker
            style={{ width: '25%' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={[
              formatMessage({ id: 'app.taskDetail.startTime', format: false }),
              formatMessage({ id: 'app.taskDetail.endTime', format: false }),
            ]}
            onChange={(rangeValue) => {
              this.setState({
                startTime: rangeValue ? rangeValue[0].format('YYYY-MM-DD HH:mm:ss') : null,
                endTime: rangeValue ? rangeValue[1].format('YYYY-MM-DD HH:mm:ss') : null,
              });
            }}
          />

          <Button type="primary" style={{ margin: '0 20px' }} onClick={this.getHistory}>
            <FormattedMessage id="app.button.search" />
          </Button>
          <Button onClick={this.exportHistory}>
            <FormattedMessage id="app.button.export" />
          </Button>
        </div>
        <TableWidthPages
          bordered
          columns={this.getColumn}
          rowKey="id"
          dataSource={historySource}
          scroll={{ x: 'max-content' }}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.size,
            total: pagination.total || 0,
          }}
          onChange={this.handleTableChange}
        />
      </TablePageWrapper>
    );
  }
}
