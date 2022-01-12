import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import { connect } from '@/utils/dva';
import { isNull } from '@/utils/utils';
import { EditorRightTools, Category } from '../enums';
import CellPanel from '../PopoverPanel/CellPanel';
import CellTypeConfigure from '../PopoverPanel/CellTypeConfigurePanel';
import WorkStationPanel from '../PopoverPanel/WorkStationPanel';
import commonStyles from '@/common.module.less';
import CostPanel from '../PopoverPanel/CostPanel';
import styles from './editorLayout.module.less';
import StationPanel from '@/packages/XIHE/MapEditor/PopoverPanel/StationPanel';
import ViewController from '@/packages/XIHE/MapEditor/PopoverPanel/ViewController';
import AislePanel from '@/packages/XIHE/MapEditor/PopoverPanel/AislePanel';

const EditorBodyRight = (props) => {
  const { dispatch, categoryPanel } = props;
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const htmlDOM = document.getElementById('editorPixi');
    const { height } = htmlDOM.getBoundingClientRect();
    setHeight(height - 10);
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
        return <CellPanel height={height} />;
      case Category.Cost:
        return <CostPanel height={height} />;
      case Category.CellType:
        return <CellTypeConfigure height={height} />;
      case Category.WorkStation:
        return <WorkStationPanel height={height} />;
      case Category.Station:
        return <StationPanel height={height} />;
      case Category.View:
        return <ViewController height={height} />;
      case Category.Aisle:
        return <AislePanel height={height} />;
      default:
        return null;
    }
  }

  return (
    <div className={classnames(commonStyles.mapBodyRight, styles.bodyRightSide)}>
      {EditorRightTools.map(({ label, value, icon }) => (
        <Tooltip key={value} placement="right" title={label}>
          <div
            role={'category'}
            className={categoryPanel === value ? styles.contentActive : undefined}
            onClick={() => {
              updateEditPanelFlag(value);
            }}
          >
            {icon}
          </div>
        </Tooltip>
      ))}
      {!isNull(categoryPanel) ? renderPanelContent() : null}
    </div>
  );
};
export default connect(({ editor }) => ({
  categoryPanel: editor.categoryPanel,
}))(memo(EditorBodyRight));
