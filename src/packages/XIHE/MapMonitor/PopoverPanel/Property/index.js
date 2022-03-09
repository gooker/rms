import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import { isNull } from '@/utils/util';
import { MapSelectableSpriteType } from '@/config/consts';
import { AGVType } from '@/config/config';
import WorkStationProperty from './WorkStationProperty';
import CommonStationProperty from './CommonStationProperty';
import AGVElementProp from './AgvProperty';

import styles from '../../monitorLayout.module.less';

const Property = (props) => {
  const { height, width,selection } = props;

  function renderContent() {
    if (!isNull(selection)) {
      const { type } = selection;
      switch (type) {
        case MapSelectableSpriteType.WORKSTATION:
          return <WorkStationProperty data={selection} />;
        case MapSelectableSpriteType.STATION:
          return <CommonStationProperty data={selection} />;
        case AGVType.LatentLifting:
          return <AGVElementProp data={selection} type={AGVType.LatentLifting}/>;
        case AGVType.Sorter:
          return <AGVElementProp data={selection} type={AGVType.Sorter} />;
        default:
          return <></>;
      }
    } else {
      return <></>;
    }
  }

  return (
    <div style={{ height,width }} className={styles.categoryPanel}>
      {renderContent()}
    </div>
  );
};
export default connect(({ monitor }) => ({
  selection: monitor.selections[0],
  checkingElement: monitor.checkingElement,
}))(memo(Property));
