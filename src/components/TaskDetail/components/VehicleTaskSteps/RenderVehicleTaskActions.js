import React, { memo } from 'react';
import { Col, Row } from 'antd';
import TaskStepNode from './TaskStepNode';
import TaskStepEdge from './TaskStepEdge';

const RenderVehicleTaskActions = (props) => {
  const { subTask, translation } = props;
  const { orderNodes, orderEdges } = subTask;

  function renderActionStepItems() {
    if (Array.isArray(orderNodes)) {
      return orderNodes.map((stepItem, index) => {
        if (index > 0) {
          return (
            <>
              <Col key={index}>
                <TaskStepEdge edge={orderEdges[index - 1]} translation={translation} />
              </Col>
              <Col key={index}>
                <TaskStepNode node={stepItem} translation={translation} />
              </Col>
            </>
          );
        }
        return (
          <Col key={index}>
            <TaskStepNode
              node={stepItem}
              edge={index === 0 ? null : orderEdges[index - 1]}
              translation={translation}
            />
          </Col>
        );
      });
    }
    return [];
  }

  return (
    // gutter --> 16+8n(n是自然数)
    <Row gutter={[24, 16]} style={{ display: 'flex', flexFlow: 'row wrap' }}>
      {renderActionStepItems()}
    </Row>
  );
};
export default memo(RenderVehicleTaskActions);
