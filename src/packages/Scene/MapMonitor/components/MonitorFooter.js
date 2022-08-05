import React, { memo } from 'react';
import { Row } from 'antd';
import { connect } from '@/utils/RmsDva';
import { FooterHeight } from '@/packages/Scene/MapMonitor/MonitorConts';
import MapRatioSlider from '@/packages/Scene/components/MapRatioSlider';
import OperationType from '@/packages/Scene/MapMonitor/components/OperationType';
import MapShownModeSelector from '@/packages/Scene/components/MapShownModeSelector';

const MonitorFooter = (props) => {
  const {
    dispatch,
    mapRatio,
    mapMinRatio,
    onSliderChange,
    shownNavigationType,
    shownCellCoordinateType,
  } = props;

  function onCellCoordinateTypeChanged(type) {
    dispatch({ type: 'editorView/updateShownCellCoordinateType', payload: type });
  }

  function onNavigationTypeChanged(type) {
    dispatch({
      type: 'editorView/updateShownNavigationType',
      payload: type,
    });
  }

  return (
    <Row
      justify={'space-between'}
      style={{ height: FooterHeight, background: '#37393d', position: 'relative' }}
    >
      <MapRatioSlider mapRatio={mapRatio} mapMinRatio={mapMinRatio} onChange={onSliderChange} />
      <OperationType />
      <MapShownModeSelector
        onCellCoordinateTypeChanged={onCellCoordinateTypeChanged}
        onNavigationTypeChanged={onNavigationTypeChanged}
        shownCellCoordinateType={shownCellCoordinateType}
        shownNavigationType={shownNavigationType}
      />
    </Row>
  );
};
export default connect(({ monitor, monitorView }) => ({
  mapMinRatio: monitor.mapMinRatio,
  shownNavigationType: monitorView.shownNavigationType,
  shownCellCoordinateType: monitorView.shownCellCoordinateType,
}))(memo(MonitorFooter));
