import React, { Component } from 'react';
import { Select, DatePicker, Input, Button, Row, Table, Tag } from 'antd';
import { saveAs } from 'file-saver';
import { Parser } from 'json2csv';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, GMT2UserTimeZone } from '@/utils/utils';
import { fetchUserLoginHistory } from '@/services/user';
import commonStyles from '@/common.module.less';
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
      title: <FormattedMessage id="sso.user.type.username" />,
      dataIndex: 'username',
      align: 'center',
      fixed: 'left',
    },
    {
      title: <FormattedMessage id="userLoginHistory.type" />,
      dataIndex: 'type',
      align: 'center',
      render: (text) => (
        <Tag type="text" color={text === 'login' ? '#04B431' : ''}>
          {text}
        </Tag>
      ),
    },

    {
      title: <FormattedMessage id="app.taskDetail.operatingTime" />,
      dataIndex: 'operationTime',
      align: 'center',
      // sorter:true,
      render: (text) => {
        return text && GMT2UserTimeZone(text).format('YYYY-MM-DD HH:mm:ss');
      },
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
    // if (sorter?.order) {
    //   pages[sorter.field] = sorter.order === 'ascend' ? 'ASC' : 'DESC';
    // }
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
      <div className={commonStyles.commonPageStyle}>
        <Row style={{ marginBottom: 20 }}>
          <Select
            style={{ width: 100 }}
            allowClear
            placeholder={formatMessage({ id: 'userLoginHistory.type', format: false })}
            onChange={(value) => {
              this.setState({ type: value });
            }}
          >
            <Select.Option value="login">Login</Select.Option>
            <Select.Option value="logout">Logout</Select.Option>
          </Select>
          <Input
            allowClear
            style={{ width: 150, margin: '0 15px' }}
            placeholder={formatMessage({ id: 'sso.user.type.username', format: false })}
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
        </Row>
        <Table
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
      </div>
    );
  }
}
