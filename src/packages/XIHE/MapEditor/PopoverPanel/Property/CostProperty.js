import React, { memo, useEffect } from 'react';
import { Row, Col, Empty } from 'antd';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { CostColor } from '@/config/consts';
import EditorCard from '@/packages/XIHE/MapEditor/components/EditorCard';

const CostProperty = (props) => {
  const { dispatch, mapContext, data } = props;

  function updateRelationCost(cost) {
    dispatch({
      type: 'editor/updateCost',
      payload: { id: data.id, cost },
    }).then(({ pre, next }) => {
      mapContext.updateLines({ type: 'remove', payload: [pre] });
      mapContext.updateLines({ type: 'add', payload: [next] });
      mapContext.refresh();
    });
  }

  return (
    <>
      <div>
        <FormattedMessage id={'app.map.routeMap'} />
        <FormattedMessage id={'app.common.prop'} />
      </div>
      <div>
        <Row gutter={20} style={{ marginBottom: 40 }}>
          {Object.entries(CostColor).map(([cost, color]) => {
            return (
              <Col key={cost} span={6} style={{ position: 'relative' }}>
                <div
                  onClick={() => updateRelationCost(cost)}
                  style={{ height: 55, cursor: 'pointer', background: color.replace('0x', '#') }}
                />
                {parseInt(cost) === data.cost && (
                  <div
                    style={{
                      background: '#fff',
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      position: 'absolute',
                      left: 34,
                      top: 60,
                    }}
                  />
                )}
              </Col>
            );
          })}
        </Row>

        {/* 地图编程(只显示GLO) */}
        <EditorCard
          label={
            <span style={{ color: '#e8e8e8' }}>
              <FormattedMessage id={'editor.programing'} />
            </span>
          }
        >
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </EditorCard>
      </div>
    </>
  );
};
export default connect(({ editor }) => ({
  mapContext: editor.mapContext,
}))(memo(CostProperty));
