import React, { memo } from 'react';
import { Button, Divider, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { CellTypeSetting } from '../enums';
import FormattedMessage from '@/components/FormattedMessage';
import editorStyles from '../editorLayout.module.less';
import commonStyles from '@/common.module.less';
import styles from './popoverPanel.module.less';
import { getCurrentLogicAreaData, getCurrentRouteMapData } from '@/utils/mapUtil';

const CellTypeConfigurePanel = (props) => {
  const { dispatch, height, mapContext, selectCells } = props;

  function setCellType(type, value, scope, texture) {
    dispatch({
      type: 'editor/setCellType',
      payload: { type, scope, operation: value, texture },
    }).then((result) => {
      // TIP: 这个dispatch只是为了触发这个组件rerender, 不然select框不更新
      dispatch({ type: 'editor/saveSelectCells', payload: [...selectCells] });
      mapContext.updateCells({ type: 'type', payload: result });
    });
  }

  function getValue(type) {
    return props[type] || [];
  }

  return (
    <div style={{ height, width: 400 }} className={editorStyles.categoryPanel}>
      <div>
        <FormattedMessage id={'app.map.feature'} />
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
                      src={`/textures/${picture}`}
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
  const currentLogicAreaData = getCurrentLogicAreaData();
  const currentRouteMap = getCurrentRouteMapData();

  const storeCellIds = currentLogicAreaData.storeCellIds || [];
  const taskCellIds = currentLogicAreaData.taskCellIds || [];
  const safeAreaCellIds = currentLogicAreaData.safeAreaCellIds || [];
  const rotateCellIds = currentLogicAreaData.rotateCellIds || [];
  const blockCellIds = currentRouteMap.blockCellIds || [];
  const followCellIds = currentRouteMap.followCellIds || [];
  const waitCellIds = currentRouteMap.waitCellIds || [];

  return {
    mapContext: editor.mapContext,
    selectCells: editor.selectCells,

    blockCellIds,
    storeCellIds,
    followCellIds,
    waitCellIds,
    taskCellIds,
    safeAreaCellIds,
    rotateCellIds,
  };
})(memo(CellTypeConfigurePanel));
