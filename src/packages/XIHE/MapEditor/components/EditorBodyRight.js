import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { connect } from '@/utils/dva';
import { isNull } from '@/utils/utils';
import {
  EditorRightTools,
  Category,
  RightToolBarWidth,
  HeaderHeight,
  FooterHeight,
} from '../enums';
import CellPanel from '../PopoverPanel/CellPanel';
import CellTypeConfigure from '../PopoverPanel/CellTypeConfigurePanel';
import WorkStationPanel from '../PopoverPanel/WorkStationPanel';
import CostPanel from '../PopoverPanel/CostPanel';
import StationPanel from '../PopoverPanel/StationPanel';
import ViewController from '../PopoverPanel/ViewController';
import AislePanel from '../PopoverPanel/AislePanel';
import styles from '../editorLayout.module.less';
import { throttle } from 'lodash';

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
        return <CellTypeConfigure height={height - 10} />;
      case Category.WorkStation:
        return <WorkStationPanel height={height - 10} />;
      case Category.Station:
        return <StationPanel height={height - 10} />;
      case Category.View:
        return <ViewController height={height - 10} />;
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
