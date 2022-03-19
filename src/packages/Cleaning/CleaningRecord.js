import React, { Component } from 'react';
import { Table, Row, message, Tag, Button, Icon } from 'antd';
import { fetchCleaningTaskHistory } from '@/services/api';
import { dealResponse, convertToUserTimezone, formatMessage } from '@/utils/util';
import CleaningRecordSearch from './components/CleaningRecordSearch';
import FormattedMessage from '@/components/FormattedMessage';

class CleaningRecord extends Component {
  state = {
    dataList: [],
    loading: false,
    page: {
      current: 1,
      size: 10,
    },
    searchParams: {},
    sectionId: window.localStorage.getItem('sectionId'),
  };

  renderColumn = [
    {
      title: formatMessage({ id: 'app.lock.cellId' }),
      dataIndex: 'cellId',
      fixed: 'left',
    },

    {
      title: <FormattedMessage id="cleaninCenter.status" />,
      dataIndex: 'isSuccess',
      render: (text) => {
        if (text) {
          return (
            <Tag color="green">
              <FormattedMessage id="app.batchFirmwareUpgrade.success" />
            </Tag>
          );
        }
        return (
          <Tag color="#f50">
            <FormattedMessage id="app.activity.TaskError" />
          </Tag>
        );
      },
    },

    {
      title: <FormattedMessage id="cleaninCenter.isSkip" />,
      dataIndex: 'isSkip',
      render: (text) => {
        if (text) {
          return <FormattedMessage id="app.chargeManger.yes" />;
        }
        return <FormattedMessage id="app.chargeManger.no" />;
      },
    },
    {
      title: formatMessage({ id: 'cleaninCenter.isDropby' }),
      dataIndex: 'isPassCell',
      render: (text) => {
        if (text) {
          return <FormattedMessage id="app.chargeManger.yes" />;
        }
        return <FormattedMessage id="app.chargeManger.no" />;
      },
    },
    {
      title: formatMessage({ id: 'cleaningCenter.isCleanMissCode' }),
      dataIndex: 'isCleanMissCode',
      render: (text) => {
        if (text) {
          return <FormattedMessage id="app.chargeManger.yes" />;
        }
        return <FormattedMessage id="app.chargeManger.no" />;
      },
    },
    {
      title: formatMessage({ id: 'cleaninCenter.fail.reason' }),
      dataIndex: 'failReason',
    },
    {
      title: <FormattedMessage id="cleaninCenter.cleaningtime" />,
      dataIndex: 'cleaningTime',
      render: (text) => {
        if (text) {
          return convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
  ];

  componentDidMount() {
    const { page } = this.state;
    this.getRenderData({ ...page });
  }

  getRenderData = async (params) => {
    const { page, searchParams } = this.state;
    this.setState({ loading: true });
    const currentParams = { ...page, ...searchParams, ...params };
    const resData = await fetchCleaningTaskHistory(currentParams);

    if (resData && !dealResponse(resData)) {
      this.setState({
        dataList: [...resData?.list],
        page: {
          current: resData?.page?.currentPage,
          size: resData?.page?.size,
          totalElements: resData?.page?.totalElements,
        },
      });
    } else {
      message.error(formatMessage({ id: 'cleaningCenter.history.fetchFailed' }));
    }
    this.setState({ loading: false });
  };

  searchHandle = (values) => {
    const { cellId, cleaningDate } = values;
    let cleaningTimeStart = null;
    let cleaningTimeEnd = null;
    if (cleaningDate != null && cleaningDate[0] && cleaningDate[1]) {
      cleaningTimeStart = convertToUserTimezone(values.cleaningDate[0], 1).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      cleaningTimeEnd = convertToUserTimezone(values.cleaningDate[1], 1).format(
        'YYYY-MM-DD HH:mm:ss',
      );
    }
    const searchParams = { cellId, cleaningTimeStart, cleaningTimeEnd };
    this.setState({ searchParams });
  };

  render() {
    const { dataList, page, loading } = this.state;
    return (
      <div style={{ padding: 24 }}>
        <Row style={{ marginBottom: 5, paddingTop: 5 }}>
          <CleaningRecordSearch searchData={this.getRenderData} searchHandle={this.searchHandle} />
        </Row>
        <Row>
          <Button
            type="primary"
            onClick={() => {
              this.getRenderData();
            }}
          >
            <Icon type="reload" /> <FormattedMessage id="form.flash" />
          </Button>
        </Row>
        <Row style={{ margin: 5, paddingTop: 5 }}>
          <Table
            dataSource={dataList}
            columns={this.renderColumn}
            scroll={{ x: 'max-content' }}
            loading={loading}
            rowKey={(record) => {
              return record.id;
            }}
            pagination={{
              showTotal: (total) =>
                `${formatMessage({ id: 'app.common.tableRowCount' }, { value: total })}`,
              current: page?.current,
              total: page?.totalElements,
              onChange: (current, size) => {
                let _this = this;
                const _page = { current, size };
                this.setState({ page: _page }, () => {
                  _this.getRenderData(_page);
                });
              },
            }}
          />
        </Row>
      </div>
    );
  }
}
export default CleaningRecord;
