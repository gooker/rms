import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { throttle } from 'lodash';
import { saveAs } from 'file-saver';
import { isNull, formatMessage } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import { GroupManageCategory, GroupManageRightTools } from '../groupEnums';

import SwitchMapView from './SwitchMapView';
import GroupManageConfiguration from '../../components/GroupManageConfig';
import StorageConfigTable from '../../components/GroupConfigTable';

import styles from '@/packages/XIHE/MapMonitor/monitorLayout.module.less';

const GroupManageBodyRight = (props) => {
  const { dispatch, categoryPanel, storageConfigData, mapContext } = props;

  const [height, setHeight] = useState(0);
  const [top, setTop] = useState(0);
  const [offsetTop, setOffsetTop] = useState(0);
  const [editItemRecord, setEditItemRecord] = useState(null);

  useEffect(() => {
    const htmlDOM = document.getElementById('groupManagePixi');
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        const { height, top } = htmlDOM.getBoundingClientRect();
        setHeight(height);
        setTop(top);
      }, 500),
    );
    resizeObserver.observe(htmlDOM);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  function updateEditPanelFlag(category) {
    if (categoryPanel === category) {
      dispatch({ type: 'mapViewGroup/saveCategoryPanel', payload: null });
    } else {
      dispatch({ type: 'mapViewGroup/saveCategoryPanel', payload: category });
    }
    dispatch({ type: 'mapViewGroup/saveCategoryModal', payload: null });
    highlightCells([]);
  }

  // 高亮点位
  const highlightCells = (cells) => {
    mapContext.doHighlightCells(cells ?? []);
  };

  // 取消点位选择
  function clearSelection() {
    const { dispatch } = props;
    mapContext.cancelCellSelected();
    dispatch({ type: 'mapViewGroup/updateSelectedCells', payload: [] });
    mapContext.refresh();
  }

  const exportGroupManage = () => {
    const file = new File(
      [JSON.stringify(storageConfigData)],
      `${formatMessage({ id: 'groupManage.manage' })}.json`,
      {
        type: 'text/plain;charset=utf-8',
      },
    );
    saveAs(file);
  };

  function renderPanelContent() {
    switch (categoryPanel) {
      case GroupManageCategory.SelectLogic:
        return <SwitchMapView height={height - 10} width={280} />;
      case GroupManageCategory.StorageConfig:
        return (
          <GroupManageConfiguration
            height={height - 10}
            close={() => {
              dispatch({ type: 'mapViewGroup/saveCategoryPanel', payload: null });
              setEditItemRecord(null);
              highlightCells([]);
            }}
            editItemData={editItemRecord}
            clearSelection={clearSelection}
          />
        );

      case GroupManageCategory.ViewGroupConfig:
        return (
          <StorageConfigTable
            height={height - 10}
            width={380}
            close={(flag, record) => {
              dispatch({ type: 'mapViewGroup/saveCategoryPanel', payload: null });
              highlightCells([]);

              // 编辑组
              if (flag) {
                updateEditPanelFlag(GroupManageCategory.StorageConfig);
                setEditItemRecord(record);
              }
            }}
            clearSelection={clearSelection}
            highLight={highlightCells}
          />
        );
      case GroupManageCategory.Export:
        exportGroupManage();
        break;

      default:
        return null;
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className={styles.bodyRightSide} style={{ height }}>
        {GroupManageRightTools.map(({ label, value, icon, style }) => (
          <Tooltip key={value} placement="right" title={label}>
            <div
              role={'category'}
              style={{ position: 'relative' }}
              className={categoryPanel === value ? styles.categoryActive : undefined}
              onClick={(e) => {
                const { top: categoryTop } = e?.target?.getBoundingClientRect();
                setOffsetTop(categoryTop - top);
                if (
                  value !== GroupManageCategory.Prop ||
                  categoryPanel === GroupManageCategory.Prop
                ) {
                  updateEditPanelFlag(value);
                }
              }}
            >
              {<span style={style}>{icon}</span>}
            </div>
          </Tooltip>
        ))}
      </div>
      {!isNull(categoryPanel) ? renderPanelContent() : null}
    </div>
  );
};
export default connect(({ mapViewGroup }) => ({
  categoryPanel: mapViewGroup.categoryPanel,
  mapContext: mapViewGroup.mapContext,
  storageConfigData: mapViewGroup.storageConfigData,
}))(memo(GroupManageBodyRight));
