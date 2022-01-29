import React, { memo } from 'react';
import find from 'lodash/find';
import { Table } from 'antd';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const TaskQueueTaskExpanderRow = memo(function TaskQueueTaskExpanderRow(props) {
  const { toteAGVTaskActionDTOS, toteTaskList } = props;
  let temps = [];
  if (toteAGVTaskActionDTOS) {
    temps = toteAGVTaskActionDTOS.map((record) => {
      const obj = find(toteTaskList, (toteTask) => {
        return toteTask.binCode === record.binCode;
      });
      return {
        toteAGVTaskActionType: record.toteAGVTaskActionType,
        binCode: record.binCode,
        toteCode: record.toteInfoDTO != null ? record.toteInfoDTO.toteCode : '',
        ...obj,
      };
    });
  }

  const end = temps;
  const renderNode = () => {
    const columns = [
      {
        title: formatMessage({ id: 'app.taskDetail.layers' }),
        dataIndex: 'toteAgvlayer',
        render: (text) => {
          if (text === 0) {
            return <FormattedMessage id="app.podManager.toteBinAtHolding" />;
          }
          return <span>{text}</span>;
        },
      },
      {
        title: formatMessage({ id: 'app.taskDetail.action' }),
        dataIndex: 'toteAGVTaskActionType',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.taskDetail.toteCode' }),
        dataIndex: 'toteCode',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.taskDetail.binCode' }),
        dataIndex: 'binCode',
        align: 'center',
      },
    ];
    return <Table dataSource={temps.reverse()} pagination={false} columns={columns} />;
  };

  return (
    <div>
      <div style={{ width: 800 }}>{renderNode(end)}</div>
    </div>
  );
});

export default TaskQueueTaskExpanderRow;
