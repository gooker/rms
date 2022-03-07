import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import classnames from 'classnames';
import { isNull } from '@/utils/util';
import { MapSelectableSpriteType } from '@/config/consts';
import WorkStationProperty from './WorkStationProperty';
import styles from '../../monitorLayout.module.less';
import MonitorHeaderRightTools from '../../components/MonitorHeaderRightTools';

const Property = (props) => {
  const { height, selection } = props;

  function renderContent() {
    if (!isNull(selection)) {
      const { type } = selection;
      switch (type) {
        case MapSelectableSpriteType.WORKSTATION:
          return <WorkStationProperty data={selection} />;
        case MapSelectableSpriteType.STATION:
          return <WorkStationProperty data={selection} />;
        default:
          return <></>;
      }
    } else {
      return <></>;
    }
  }

  return (
    <div style={{ height }} className={styles.categoryPanel}>
      {renderContent()}
    </div>
  );
};
export default connect(({ monitor }) => ({
  selection:  monitor.selections[0],
}))(memo(Property));
