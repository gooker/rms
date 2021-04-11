import React from 'react';
import { Col, Tag } from 'antd';

const RenderAgvTaskActions = ({ taskActions = [], currentType }) => {
  if (taskActions != null) {
    return taskActions.map((item, index) => {
      const { actions, cellId } = item;
      let col = Math.ceil(JSON.stringify(actions).length / 65) * 6;
      if (col > 24) {
        col = 24;
      }
      if (currentType === 'LatentLifting') {
        col = 8;
      }

      return (
        <Col key={`${index}taskAction`} style={{ marginBottom: 20 }} span={col}>
          <span style={{ marginRight: 2, width: 40, display: 'inline-block' }}>{index + 1}.</span>
          <div style={{ display: 'inline-block' }}>
            <Tag color="#2db7f5">{cellId}</Tag>
          </div>
          <div style={{ display: 'inline-block' }}>
            {(() => {
              return actions.map((record, innderIndex) => {
                const { action, params } = record;
                const result = [];
                result.push(
                  <span style={{ marginRight: 2 }} key={`${innderIndex}action`}>
                    {action}
                  </span>,
                );
                params.forEach((p, idx) => {
                  result.push(
                    <span style={{ marginLeft: 7 }} key={`${idx}params`}>
                      {p}
                    </span>,
                  );
                });
                return <Tag key={`${innderIndex}tag`}>{result}</Tag>;
              });
            })()}
          </div>
        </Col>
      );
    });
  }
  return null;
};
export default RenderAgvTaskActions;
