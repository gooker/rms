import React, { memo } from 'react';
import { Button, Divider, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { CellTypeSetting } from '../enums';
import FormattedMessage from '@/components/FormattedMessage';
import { getCurrentLogicAreaData, getCurrentRouteMapData } from '@/utils/mapUtil';
import { MapSelectableSpriteType } from '@/config/consts';
import styles from '../../popoverPanel.module.less';
import commonStyles from '@/common.module.less';

const CellTypeConfigurePanel = (props) => {
  const { dispatch, height, mapContext, selectCells } = props;

  function setCellType(type, value, scope, texture) {
    dispatch({
      type: 'editor/setCellType',
      payload: { type, scope, operation: value, texture },
    }).then((result) => {
      dispatch({ type: 'editorView/saveForceUpdate' });
      mapContext.updateCells({ type: 'type', payload: result });
    });
  }

  function getValue(type) {
    return props[type] || [];
  }

  return (
    <div style={{ height, width: 400 }} className={commonStyles.categoryPanel}>
      <div>
        <FormattedMessage id={'app.map.function'} />
      </div>
      <div>
        <div className={styles.panelBlock}>
          <div style={{ padding: '0 10px' }}>
            {CellTypeSetting.map(({ type, picture, i18n, scope, texture }) => (
              <div key={type}>
                <div style={{ marginBottom: 15 }}>
                  <div className={commonStyles.flexVerticalCenter} style={{ marginBottom: 5 }}>
                    <img
                      alt={picture}
                      src={`/images/${picture}`}
                      style={{ height: 20, marginRight: 10 }}
                    />
                    <FormattedMessage id={i18n} />
                  </div>
                  <div className={styles.actionTypePanelRow}>
                    <div>
                      <Select
                        mode={'tags'}
                        maxTagCount={5}
                        notFoundContent={null}
                        style={{ width: '100%' }}
                        value={getValue(type)}
                      />
                    </div>
                    <Button
                      disabled={selectCells.length === 0}
                      onClick={() => {
                        setCellType(type, 'add', scope, texture);
                      }}
                    >
                      <PlusOutlined />
                    </Button>
                    <Button
                      danger
                      disabled={selectCells.length === 0}
                      onClick={() => {
                        setCellType(type, 'remove', scope, texture);
                      }}
                    >
                      <DeleteOutlined />
                    </Button>
                  </div>
                </div>
                <Divider style={{ margin: 5, borderTop: '1px solid #b0b0b0' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect(({ editor }) => {
  const { selections, mapContext, forceUpdate } = editor;
  const currentLogicAreaData = getCurrentLogicAreaData();
  const currentRouteMap = getCurrentRouteMapData();

  const storeCellIds = currentLogicAreaData.storeCellIds || [];
  const taskCellIds = currentLogicAreaData.taskCellIds || [];
  const safeAreaCellIds = currentLogicAreaData.safeAreaCellIds || [];
  const rotateCellIds = currentLogicAreaData.rotateCellIds || [];
  const blockCellIds = currentRouteMap.blockCellIds || [];
  const followCellIds = currentRouteMap.followCellIds || [];
  const waitCellIds = currentRouteMap.waitCellIds || [];

  const selectCells = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ id }) => id);

  return {
    mapContext,
    selectCells,
    blockCellIds,
    storeCellIds,
    followCellIds,
    waitCellIds,
    taskCellIds,
    safeAreaCellIds,
    rotateCellIds,
    forceUpdate,
  };
})(memo(CellTypeConfigurePanel));
