import React, { useState } from 'react';
import { Row, Divider, Rate, Modal, Badge, Button } from 'antd';
import { FormattedMessage, formatMessage } from '@/utils/Lang';
import taskQueueStyles from '@/components/pages/TaskQueue/taskQueue.module.less';
import updateTaskPriorityStyles from './updateTaskPriority.module.less';

const UpdateTaskPriority = (props) => {
  const { visible, close, selectedRow, onSubmit } = props;

  const [priorityValue, setPriorityValue] = useState(0);

  const rateTip = [
    <FormattedMessage id={'app.taskQueue.priorityMin'} />,
    <FormattedMessage id="app.taskQueue.priorityNumber" values={{ number: 2 }} />,
    <FormattedMessage id="app.taskQueue.priorityNumber" values={{ number: 3 }} />,
    <FormattedMessage id="app.taskQueue.priorityNumber" values={{ number: 4 }} />,
    <FormattedMessage id="app.taskQueue.priorityNumber" values={{ number: 5 }} />,
    <FormattedMessage id="app.taskQueue.priorityNumber" values={{ number: 6 }} />,
    <FormattedMessage id="app.taskQueue.priorityNumber" values={{ number: 7 }} />,
    <FormattedMessage id="app.taskQueue.priorityNumber" values={{ number: 8 }} />,
    <FormattedMessage id="app.taskQueue.priorityNumber" values={{ number: 9 }} />,
    <FormattedMessage id={'app.taskQueue.priorityMax'} />,
  ];

  function renderModalContent() {
    return selectedRow.map(({ taskId, jobPriority }) => {
      return (
        <Badge showZero count={jobPriority} style={{ background: '#2FC25B' }}>
          <span
            className={taskQueueStyles.agvStatusBadge}
            style={{ color: '#000', background: '#ccc' }}
          >
            *{taskId.substr(taskId.length - 6, 6)}
          </span>
        </Badge>
      );
    });
  }

  return (
    <Modal
      destroyOnClose
      width={600}
      visible={visible}
      onCancel={close}
      bodyStyle={{ padding: 12 }}
      title={formatMessage({ id: 'app.taskQueue.renice' })}
      footer={
        <Button type="primary" onClick={onSubmit} style={{ width: '100%' }}>
          <FormattedMessage id="app.button.confirm" />
        </Button>
      }
    >
      {selectedRow.length > 1 ? (
        <div>
          <Row className={updateTaskPriorityStyles.badge}>{renderModalContent()}</Row>
          <Divider orientation="center">
            {formatMessage({ id: 'app.taskQueue.resetPriority' })}
          </Divider>
        </div>
      ) : null}

      <Row type="flex" justify="space-around" align="middle" style={{ position: 'relative' }}>
        <Rate
          allowClear={false}
          count={10}
          tooltips={rateTip}
          value={priorityValue}
          onChange={(value) => setPriorityValue(value)}
        />
      </Row>
    </Modal>
  );
};

export default React.memo(UpdateTaskPriority);
