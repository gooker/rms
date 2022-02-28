import React, { memo, useState } from 'react';
import { Table, Empty, Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { releaseLatentPod } from '@/services/monitor';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 450;

const PodToStationMessage = (props) => {
  const { dispatch, podToWorkstationInfo } = props;
  const [executing, setExecuting] = useState(false);

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function release(taskId) {
    setExecuting(true);
    releaseLatentPod({ taskId }).then((res) => {
      if (!dealResponse(res)) {
        message.success(formatMessage({ id: 'monitor.message.releasePodSuccess' }));
        dispatch({
          type: 'monitor/removeWorkStationInfo',
          payload: { taskId },
        });
      }
    });
    setExecuting(false);
  }

  const tableColumn = [
    {
      title: formatMessage({ id: 'editor.cellType.stop' }),
      dataIndex: 'stopCellId',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.direction' }),
      dataIndex: 'direction',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.pod.id' }),
      dataIndex: 'podId',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.pod.direction' }),
      dataIndex: 'podDirection',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.operation' }),
      align: 'center',
      render: (text, record) => (
        <Button
          size="small"
          loading={executing}
          onClick={() => {
            release(record.taskId);
          }}
        >
          <FormattedMessage id="monitor.advancedcarry.released" />
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `calc(50% - ${width / 2}px)`,
      }}
      className={styles.monitorModal}
    >
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.message.podToWorkstationInfo'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        {podToWorkstationInfo && podToWorkstationInfo.length > 0 ? (
          <Table
            bordered
            pagination={false}
            dataSource={podToWorkstationInfo}
            columns={tableColumn}
          />
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
};
export default connect(({ monitor }) => ({
  podToWorkstationInfo: monitor.podToWorkstationInfo || [],
}))(memo(PodToStationMessage));
