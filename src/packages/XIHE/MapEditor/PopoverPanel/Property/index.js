import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import { isNull } from '@/utils/util';
import { MapSelectableSpriteType } from '@/config/consts';
import CellProperty from './CellProperty';
import MapProperty from './MapProperty';
import styles from '../../editorLayout.module.less';
import CostProperty from '@/packages/XIHE/MapEditor/PopoverPanel/Property/CostProperty';

const Property = (props) => {
  const { height, selection } = props;

  function renderContent() {
    if (!isNull(selection)) {
      const { type } = selection;
      switch (type) {
        case MapSelectableSpriteType.CELL:
          return <CellProperty data={selection} />;
        case MapSelectableSpriteType.ROUTE:
          return <CostProperty data={selection} />;
        default:
          return <MapProperty />;
      }
    } else {
      return <MapProperty />;
    }
  }

  return (
    <div style={{ height }} className={styles.categoryPanel}>
      {renderContent()}
    </div>
  );
};
export default connect(({ editor }) => ({
  selection: editor.selections[0],
}))(memo(Property));
