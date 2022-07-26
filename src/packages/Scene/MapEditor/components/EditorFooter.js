import React, { memo } from 'react';
import { Row } from 'antd';
import { connect } from '@/utils/RmsDva';
import { FooterHeight } from '@/packages/Scene/MapEditor/editorEnums';
import MapRatioSlider from '@/packages/Scene/components/MapRatioSlider';
import MapShownModeSelector from '@/packages/Scene/components/MapShownModeSelector';
import styles from './editorFooter.module.less';

const EditorFooter = (props) => {
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
      type: 'editorView/updateShownNavigationCellType',
      payload: type,
    });
  }

  return (
    <Row
      style={{ height: FooterHeight }}
      className={styles.editorFooterContainer}
      justify={'space-between'}
    >
      <MapRatioSlider mapRatio={mapRatio} mapMinRatio={mapMinRatio} onChange={onSliderChange} />
      <MapShownModeSelector
        onCellCoordinateTypeChanged={onCellCoordinateTypeChanged}
        onNavigationTypeChanged={onNavigationTypeChanged}
        shownCellCoordinateType={shownCellCoordinateType}
        shownNavigationType={shownNavigationType}
      />
    </Row>
  );
};
export default connect(({ editor, editorView }) => ({
  mapMinRatio: editor.mapMinRatio,
  shownNavigationType: editorView.shownNavigationType,
  shownCellCoordinateType: editorView.shownCellCoordinateType,
}))(memo(EditorFooter));
