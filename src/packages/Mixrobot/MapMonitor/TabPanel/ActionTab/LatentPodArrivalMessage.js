import React, { PureComponent } from 'react';
import { connect } from '@/utils/dva';
import { Row, Table, Button } from 'antd';
import { releaseLatentPod } from '@/services/monitor';
import { dealResponse, formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';

@connect(({ monitor }) => ({ monitor }))
class LatentPodArrivalMessage extends PureComponent {
  release = (taskId) => {
    releaseLatentPod({ taskId }).then((res) => {
      if (!dealResponse(res)) {
        const { dispatch } = this.props;
        dispatch({
          type: 'monitor/removeWorkStationInfo',
          payload: { taskId },
        });
      }
    });
  };

  tableColumn = [
    {
      title: formatMessage({ id: 'app.monitorOperation.stopCellId' }),
      dataIndex: 'stopCellId',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.monitorOperation.direction' }),
      dataIndex: 'direction',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.monitorOperation.podId' }),
      dataIndex: 'podId',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.monitorOperation.podDirection' }),
      dataIndex: 'podDirection',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.monitorOperation.operate' }),
      align: 'center',
      render: (text, record) => (
        <Button
          size="small"
          onClick={() => {
            this.release(record.taskId);
          }}
        >
          <FormattedMessage id="app.monitorOperation.release" />
        </Button>
      ),
    },
  ];

  render() {
    const {
      monitor: { podToWorkstationInfo },
    } = this.props;
    return (
      <Row style={{ widt: '100%' }}>
        {podToWorkstationInfo && podToWorkstationInfo.length > 0 && (
          <Table
            bordered
            pagination={false}
            dataSource={podToWorkstationInfo}
            columns={this.tableColumn}
          />
        )}
      </Row>
    );
  }
}
export default LatentPodArrivalMessage;
