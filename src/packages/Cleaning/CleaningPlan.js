import React, { Component } from 'react';
import { Row, message, Button, Modal, Tag } from 'antd';
import { fetchCleaningPlan, fetchCleaningPlanMode } from '@/services/api';
import { ReloadOutlined } from '@ant-design/icons';
import {
  dealResponse,
  adaptModalWidth,
  adaptModalHeight,
  formatMessage,
  convertToUserTimezone,
} from '@/utils/util';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import CleaningPlanCells from './components/CleaningPlanCells';

class CleaningPlan extends Component {
  state = {
    dataList: [],
    loading: false,
    cellPlanVisible: false,
    modalRecord: null,
    currentMode: null,
    sectionId: window.localStorage.getItem('sectionId'),
  };

  renderColumn = [
    {
      title: <FormattedMessage id="cleaningCenter.plan.cleanarea" />,
      dataIndex: 'area',
      render: (text) => {
        if (Array.isArray(text) && text.length === 0) {
          return (
            <Tag key={'all'} color="#2db7f5">
              <FormattedMessage id="app.questionCenter.all" />
            </Tag>
          );
        }
        return (
          <>
            {text?.map((item) => {
              return (
                <Tag key={item} color="#2db7f5">
                  {item}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    {
      title: <FormattedMessage id="cleaninCenter.targetNum" />,
      dataIndex: 'targetTimes',
      render: (text) => {
        return (
          <>
            {text}
            <FormattedMessage id="app.chargeManagement.times" />
          </>
        );
      },
    },
    {
      title: <FormattedMessage id="cleaninCenter.accumulative" />,
      dataIndex: 'cumulativeCycle',
      render: (text) => {
        return (
          <>
            {text}
            <FormattedMessage id="app.chargeManagement.day" />
          </>
        );
      },
    },

    {
      title: <FormattedMessage id="cleaninCenter.startTime" />,
      dataIndex: 'startTime',
      render: (text) => {
        if (text) {
          return convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
    {
      title: formatMessage({ id: 'cleaninCenter.planCell' }),
      dataIndex: 'planCellList',
      fixed: 'right',
      render: (_, record) => {
        return (
          <Button
            type="link"
            shape="circle"
            icon="eye"
            onClick={() => {
              this.setState({
                cellPlanVisible: true,
                modalRecord: record,
              });
            }}
          />
        );
      },
    },
  ];

  componentDidMount() {
    this.getRenderData();
  }

  getRenderData = async () => {
    this.setState({ loading: true });
    const [resData, modeData] = await Promise.all([fetchCleaningPlan(), fetchCleaningPlanMode()]);

    if (!dealResponse(resData)) {
      this.setState({ dataList: resData });
    } else {
      message.error(formatMessage({ id: 'cleaningCenter.plan.fetchFailed' }));
    }
    if (!dealResponse(modeData)) {
      this.setState({ currentMode: modeData });
    }
    this.setState({ loading: false });
  };

  closeModal = () => {
    this.setState({ cellPlanVisible: false });
  };

  render() {
    const { dataList, loading, modalRecord, cellPlanVisible, currentMode } = this.state;
    return (
      <TablePageWrapper>
        <Row style={{ display: 'flex', flexFlow: 'row nowrap' }}>
          <Button
            type="primary"
            onClick={() => {
              this.getRenderData();
            }}
          >
            <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
          </Button>
          <div style={{ flex: 1, textAlign: 'end' }}>
            <span>
              <FormattedMessage id="cleaninCenter.currentmode" />
              {' :'}
            </span>

            <span style={{ marginLeft: 15 }}>
              {currentMode === 'Normal' && (
                <Tag color="#87d068">
                  <FormattedMessage id="app.activity.normal" />
                </Tag>
              )}
              {currentMode === 'Forbid' && (
                <Tag>
                  <FormattedMessage id="cleaningCenter.mode.Forbid" />
                </Tag>
              )}
              {currentMode === 'Free' && (
                <Tag color="#2db7f5">
                  <FormattedMessage id="app.handwareStatus.standBy" />
                </Tag>
              )}
            </span>
          </div>
        </Row>

        <TableWithPages
          dataSource={dataList}
          columns={this.renderColumn}
          scroll={{ x: 'max-content' }}
          loading={loading}
          rowKey={(_, index) => {
            return index;
          }}
        />
        <Modal
          destroyOnClose
          width={adaptModalWidth()}
          title={formatMessage({ id: 'cleaninCenter.planCell' })}
          visible={cellPlanVisible}
          onCancel={this.closeModal}
          footer={null}
          bodyStyle={{ height: adaptModalHeight(), overflow: 'auto' }}
        >
          <CleaningPlanCells data={modalRecord} />
        </Modal>
      </TablePageWrapper>
    );
  }
}
export default CleaningPlan;
