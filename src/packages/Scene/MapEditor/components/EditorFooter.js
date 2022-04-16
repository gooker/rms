import React, { memo } from 'react';
import { Row } from 'antd';
import { connect } from '@/utils/RmsDva';
import { FooterHeight } from '@/packages/Scene/MapEditor/editorEnums';
import MapRatioSlider from '@/packages/Scene/components/MapRatioSlider';
import NavigationCellTypeSelector from '@/packages/Scene/components/NavigationCellTypeSelector';
import styles from './editorFooter.module.less';

const EditorFooter = (props) => {
  const { mapRatio, mapMinRatio, onSliderChange } = props;
  return (
    <Row
      style={{ height: FooterHeight }}
      className={styles.editorFooterContainer}
      justify={'space-between'}
    >
      <MapRatioSlider mapRatio={mapRatio} mapMinRatio={mapMinRatio} onChange={onSliderChange} />
      <NavigationCellTypeSelector />
    </Row>
  );
};
export default connect(({ editor }) => ({
  mapMinRatio: editor.mapMinRatio,
}))(memo(EditorFooter));
