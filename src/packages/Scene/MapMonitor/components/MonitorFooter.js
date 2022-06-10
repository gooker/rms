import React, { memo } from 'react';
import { Row } from 'antd';
import { connect } from '@/utils/RmsDva';
import { FooterHeight } from '@/packages/Scene/MapMonitor/enums';
import MapRatioSlider from '@/packages/Scene/components/MapRatioSlider';
import OperationType from '@/packages/Scene/MapMonitor/components/OperationType';

const MonitorFooter = (props) => {
  const { mapRatio, mapMinRatio, onSliderChange } = props;
  return (
    <Row
      justify={'space-between'}
      style={{ height: FooterHeight, background: '#37393d', position: 'relative' }}
    >
      <MapRatioSlider mapRatio={mapRatio} mapMinRatio={mapMinRatio} onChange={onSliderChange} />
      <OperationType />
    </Row>
  );
};
export default connect(({ monitor }) => ({
  mapMinRatio: monitor.mapMinRatio,
}))(memo(MonitorFooter));
