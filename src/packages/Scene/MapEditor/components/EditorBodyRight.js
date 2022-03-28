import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { isNull } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import { RightCategory, EditorRightTools, RightToolBarWidth } from '../enums';
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
        return <Property />;
      case RightCategory.Cell:
        return <CellPanel />;
      case RightCategory.Cost:
        return <CostPanel />;
      case RightCategory.CellType:
        return <CellTypeConfigurePanel />;
      case RightCategory.WorkStation:
        return <WorkStationPanel />;
      case RightCategory.Charger:
        return <ChargerPanel />;
      case RightCategory.Station:
        return <StationPanel />;
      case RightCategory.View:
        return <ViewControllerPanel />;
      case RightCategory.Aisle:
        return <AislePanel />;
      case RightCategory.Rest:
        return <RestPanel />;
      case RightCategory.Delivery:
        return <DeliveryPanel />;
      case RightCategory.Intersection:
        return <IntersectionPanel />;
      case RightCategory.Elevator:
        return <ElevatorPanel />;
      case RightCategory.EmergencyStop:
        return <EmergencyStopPanel />;
      case RightCategory.Programing:
        return <ProgramingPanel />;
      default:
        return null;
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ width: `${RightToolBarWidth}px` }} className={styles.bodyRightSide}>
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
