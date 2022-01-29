import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { throttle } from 'lodash';
import { connect } from '@/utils/RcsDva';
import { isNull } from '@/utils/util';
import {
  Category,
  HeaderHeight,
  FooterHeight,
  EditorRightTools,
  RightToolBarWidth,
} from '../enums';
import CellPanel from '../PopoverPanel/CellPanel';
import CostPanel from '../PopoverPanel/CostPanel';
import AislePanel from '../PopoverPanel/AislePanel';
import StationPanel from '../PopoverPanel/StationPanel';
import WorkStationPanel from '../PopoverPanel/WorkStationPanel';
import ViewControllerPanel from '../PopoverPanel/ViewControllerPanel';
import CellTypeConfigurePanel from '../PopoverPanel/CellTypeConfigurePanel';
import ChargerPanel from '../PopoverPanel/ChargerPanel';
import styles from '../editorLayout.module.less';

const EditorBodyRight = (props) => {
  const { dispatch, categoryPanel } = props;
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const htmlDOM = document.getElementById('mapEditorPage');
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        const { height } = htmlDOM.getBoundingClientRect();
        setHeight(height - HeaderHeight - FooterHeight);
      }, 500),
    );
    resizeObserver.observe(htmlDOM);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  function updateEditPanelFlag(category) {
    if (categoryPanel === category) {
      dispatch({ type: 'editor/updateEditPanelVisible', payload: null });
    } else {
      dispatch({ type: 'editor/updateEditPanelVisible', payload: category });
    }
  }

  function renderPanelContent() {
    switch (categoryPanel) {
      case Category.Cell:
        return <CellPanel height={height - 10} />;
      case Category.Cost:
        return <CostPanel height={height - 10} />;
      case Category.CellType:
        return <CellTypeConfigurePanel height={height - 10} />;
      case Category.WorkStation:
        return <WorkStationPanel height={height - 10} />;
      case Category.Charger:
        return <ChargerPanel height={height - 10} />;
      case Category.Station:
        return <StationPanel height={height - 10} />;
      case Category.View:
        return <ViewControllerPanel height={height - 10} />;
      case Category.Aisle:
        return <AislePanel height={height - 10} />;
      default:
        return null;
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ width: `${RightToolBarWidth}px`, height }} className={styles.bodyRightSide}>
        {EditorRightTools.map(({ label, value, icon }) => (
          <Tooltip key={value} placement="right" title={label}>
            <div
              role={'category'}
              className={categoryPanel === value ? styles.contentActive : undefined}
              onClick={() => {
                updateEditPanelFlag(value);
              }}
              style={{ minHeight: '40px' }}
            >
              {icon}
            </div>
          </Tooltip>
        ))}
      </div>
      {!isNull(categoryPanel) ? renderPanelContent() : null}
    </div>
  );
};
export default connect(({ editor }) => ({
  categoryPanel: editor.categoryPanel,
}))(memo(EditorBodyRight));
