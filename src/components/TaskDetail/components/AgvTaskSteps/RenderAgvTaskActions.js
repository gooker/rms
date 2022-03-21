import React from 'react';
import { Row, Col } from 'antd';
import TaskStepItems from './TaskStepItem';

/**
 * 每个子任务的任务步骤
 * stepTaskStatus ==='New', 全部显示黄色
 * stepTaskStatus ==='Executing', 根据index标记颜色
 * 其他状态都显示 灰色
 */

const RenderAgvTaskActions = (props) => {
  const { subTask, translation } = props;
  const { stepTaskStatus, taskActionsDTO } = subTask;
  const { pathIndex, endPathIndex, actionIndex, endActionIndex } = subTask;

  // 判断该点位步骤目前处于什么状态
  function definePathStepType(currentIndex) {
    if (stepTaskStatus === 'New') {
      return 'future';
    } else if (stepTaskStatus === 'Executing') {
      if (currentIndex < pathIndex) {
        return 'passed';
      }
      if (currentIndex >= pathIndex && currentIndex <= endPathIndex) {
        return 'locked';
      }
      if (currentIndex > endPathIndex) {
        return 'future';
      }
    } else {
      return 'passed';
    }
  }

  function renderActionStepItems() {
    if (Array.isArray(taskActionsDTO)) {
      return taskActionsDTO.map((stepItem, index) => {
        return (
          <Col key={index}>
            {/* 这个组件数据可以收敛，但是没空做，后续优化跟上 */}
            <TaskStepItems
              cellIndex={index}
              data={stepItem}
              nextData={taskActionsDTO[index + 1]} // 可能包含上一个步骤最后一个动作的结束时间
              pathIndex={pathIndex}
              endPathIndex={endPathIndex}
              pathStepType={definePathStepType(index)}
              actionIndex={actionIndex}
              endActionIndex={endActionIndex}
              translation={translation}
            />
          </Col>
        ); // 点位 -- 动作[参数]
      });
    }
    return [];
  }

  return (
    // gutter --> 16+8n(n是自然数)
    <Row gutter={[32, 16]} style={{ display: 'flex', flexFlow: 'row wrap' }}>
      {renderActionStepItems()}
    </Row>
  );
};
export default RenderAgvTaskActions;
