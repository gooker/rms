import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { throttle } from 'lodash';
import { isNull } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import { RightCategory, HeaderHeight, EditorRightTools, RightToolBarWidth } from '../enums';
import RestPanel from '../PopoverPanel/RestPanel';
import CellPanel from '../PopoverPanel/CellPanel';
import CostPanel from '../PopoverPanel/CostPanel';
import AislePanel from '../PopoverPanel/AislePanel';
import StationPanel from '../PopoverPanel/StationPanel';
import ChargerPanel from '../PopoverPanel/ChargerPanel';
import DeliveryPanel from '../PopoverPanel/DeliveryPanel';
import ElevatorPanel from '../PopoverPanel/ElevatorPanel';
import WorkStationPanel from '../PopoverPanel/WorkStationPanel';
import IntersectionPanel from '../PopoverPanel/IntersectionPanel';
import ViewControllerPanel from '../PopoverPanel/ViewControllerPanel';
import CellTypeConfigurePanel from '../PopoverPanel/CellTypeConfigurePanel';
import EmergencyStopPanel from '../PopoverPanel/EmergencyStopPanel';
import ProgramingPanel from '../PopoverPanel/ProgramingPanel';
import Property from '../PopoverPanel/Property';
import styles from '../editorLayout.module.less';

const EditorBodyRight = (props) => {
  const { dispatch, categoryPanel } = props;
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const htmlDOM = document.getElementById('mapEditorPage');
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        const { height } = htmlDOM.getBoundingClientRect();
        setHeight(height - HeaderHeight);
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
      case RightCategory.Prop:
        return <Property height={height - 10} />;
      case RightCategory.Cell:
        return <CellPanel height={height - 10} />;
      case RightCategory.Cost:
        return <CostPanel height={height - 10} />;
      case RightCategory.CellType:
        return <CellTypeConfigurePanel height={height - 10} />;
      case RightCategory.WorkStation:
        return <WorkStationPanel height={height - 10} />;
      case RightCategory.Charger:
        return <ChargerPanel height={height - 10} />;
      case RightCategory.Station:
        return <StationPanel height={height - 10} />;
      case RightCategory.View:
        return <ViewControllerPanel height={height - 10} />;
      case RightCategory.Aisle:
        return <AislePanel height={height - 10} />;
      case RightCategory.Rest:
        return <RestPanel height={height - 10} />;
      case RightCategory.Delivery:
        return <DeliveryPanel height={height - 10} />;
      case RightCategory.Intersection:
        return <IntersectionPanel height={height - 10} />;
      case RightCategory.Elevator:
        return <ElevatorPanel height={height - 10} />;
      case RightCategory.EmergencyStop:
        return <EmergencyStopPanel height={height - 10} />;
      case RightCategory.Programing:
        return <ProgramingPanel height={height - 10} />;
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
