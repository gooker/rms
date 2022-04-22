import React, { memo, useEffect } from 'react';
import { throttle } from 'lodash';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import { connect } from '@/utils/RmsDva';
import { getRandomString, isNull } from '@/utils/util';
import EditorMask from './EditorMask';
import EditorMapView from './EditorMapView';
import EditorShortcutTool from './EditorShortcutTool';
import { ZoneMarkerType } from '@/config/consts';
import EventManager from '@/utils/EventManager';
import { renderChargerList, renderWorkStationList } from '@/utils/mapUtil';
import {
  FooterHeight,
  HeaderHeight,
  LeftCategory,
  LeftToolBarWidth,
  RightToolBarWidth,
} from '../editorEnums';
import styles from '../editorLayout.module.less';
import EditorFooter from '@/packages/Scene/MapEditor/components/EditorFooter';
import { coordinateTransformer } from '@/utils/coordinateTransformer';

const CLAMP_VALUE = 500;
const EditorMapContainer = (props) => {
  const { dispatch, mapRatio, mapContext, shortcutToolVisible } = props;
  const {
    currentMap,
    currentLogicArea,
    currentRouteMap,
    preRouteMap,
    mapRotation,
    leftActiveCategory,
    navigationCellType,
    shownNavigationCellType,
  } = props;

  useEffect(() => {
    const functionId = getRandomString(8);
    function resize(rect) {
      const { width, height } = rect;
      const { mapContext: _mapContext } = window.$$state().editor;
      _mapContext.resize(
        width - LeftToolBarWidth - RightToolBarWidth,
        height - HeaderHeight - FooterHeight,
      );
    }
    EventManager.subscribe('resize', resize, functionId);
    return () => {
      EventManager.unsubscribe('resize', functionId);
    };
  }, []);

  useEffect(() => {
    if (isNull(mapContext)) return;
    const { viewport } = mapContext.pixiUtils;
    // 很重要: 一定要先取消旧的clamp，不然新的会无法生效
    viewport.clampZoom(null);

    // 清空相关数据
    mapContext.clearMapStage();
    mapContext.clearEditorMapData();

    if (currentMap) {
      renderMap();
      renderLogicArea();
      renderRouteMap();
      const minMapRatio = mapContext.centerView('EDITOR_MAP');
      dispatch({ type: 'editor/saveMapMinRatio', payload: minMapRatio });

      // 监听地图缩放比例
      viewport.off('zoomed-end');
      viewport.on('zoomed-end', function () {
        dispatch({ type: 'editor/saveMapRatio', payload: this.scale.x });
      });

      // 添加事件处理地图跑出Screen
      viewport.off('moved');
      viewport.on(
        'moved',
        throttle(function () {
          const { x, y, width, height } = JSON.parse(window.sessionStorage.getItem('EDITOR_MAP'));
          const topLimit = y + (height - CLAMP_VALUE);
          if (this.top >= topLimit) {
            this.top = topLimit;
          }

          const bottomLimit = y + CLAMP_VALUE;
          if (this.bottom <= bottomLimit) {
            this.bottom = bottomLimit;
          }

          const leftLimit = x + (width - CLAMP_VALUE);
          if (this.left >= leftLimit) {
            this.left = leftLimit;
          }

          const rightLimit = x + CLAMP_VALUE;
          if (this.right <= rightLimit) {
            this.right = rightLimit;
          }
        }, 200),
      );
    }
  }, [mapContext, currentMap, currentLogicArea, shownNavigationCellType, mapRotation]);

  useEffect(() => {
    if (currentMap && !isNull(mapContext)) {
      mapContext.clearEditorRouteData();
      renderRouteMap();
      mapContext.refresh();
    }
  }, [currentRouteMap]);

  useEffect(() => {
    if (isNull(mapContext)) return;
    const { viewport } = mapContext.pixiUtils;
    viewport.setZoom(mapRatio, true);
  }, [mapRatio]);

  function renderMap() {
    const cellsToRender = Object.values(currentMap.cellMap)
      .filter((item) => shownNavigationCellType.includes(item.brand))
      .map((item) =>
        coordinateTransformer(item, {
          ...currentMap.transform[item.brand],
          pixiAngle: mapRotation,
        }),
      );
    mapContext.renderCells(cellsToRender);

    // TODO: 画原点坐标系
    // const { viewport } = mapContext.pixiUtils;
    // const { width, height } = viewport.getLocalBounds();
    // const coordinatorSystem = new SmoothGraphics();
    // coordinatorSystem.lineStyle(30, 0xffffff);
    // coordinatorSystem.moveTo(0, -height / 2);
    // coordinatorSystem.lineTo(0, height / 2);
    // coordinatorSystem.moveTo(-width / 2, 0);
    // coordinatorSystem.lineTo(width / 2, 0);
    // mapContext.pixiUtils.viewportAddChild(coordinatorSystem);
  }

  function renderLogicArea() {
    const currentLogicAreaData = currentMap?.logicAreaList?.[currentLogicArea];
    if (!currentLogicAreaData) return;

    const {
      restCells,
      taskCellIds,
      storeCellIds,
      rotateCellIds,
      safeAreaCellIds,
      intersectionList,
    } = currentLogicAreaData;
    // 休息区
    if (Array.isArray(restCells)) {
      restCells.forEach((item) => {
        mapContext.renderRestCells(item);
      });
    }
    // 存储区
    if (Array.isArray(storeCellIds)) {
      mapContext.renderCellsType(storeCellIds, 'store_cell');
    }
    // 接任务点
    if (Array.isArray(taskCellIds)) {
      mapContext.renderCellsType(taskCellIds, 'get_task');
    }
    // 安全区
    if (Array.isArray(safeAreaCellIds)) {
      mapContext.renderCellsType(safeAreaCellIds, 'safe_cell');
    }
    // 旋转点
    if (Array.isArray(rotateCellIds)) {
      mapContext.renderCellsType(rotateCellIds, 'round');
    }
    // 交汇点
    if (Array.isArray(intersectionList)) {
      mapContext.renderIntersection(intersectionList);
    }

    const { chargerList, workstationList, commonList } = currentLogicAreaData;
    // 充电桩
    if (Array.isArray(chargerList)) {
      const chargerListData = renderChargerList(chargerList, currentMap.cellMap);
      mapContext.renderChargers(chargerListData);
    }
    // 工作站
    if (Array.isArray(workstationList)) {
      const workStationListData = renderWorkStationList(workstationList, currentMap.cellMap);
      workStationListData.forEach((workStation, index) => {
        mapContext.addWorkStation({ flag: index + 1, ...workStation });
      });
    }
    // 通用站点
    if (Array.isArray(commonList)) {
      mapContext.renderCommonFunction(commonList);
    }

    const { dumpStations, zoneMarker, labels, emergencyStopFixedList } = currentLogicAreaData;
    // 抛货点
    if (Array.isArray(dumpStations)) {
      mapContext.renderDumpFunction(dumpStations);
    }
    // 背景(线框&图片)
    if (Array.isArray(zoneMarker)) {
      zoneMarker.forEach((zoneMarkerItem) => {
        // 线框
        if (zoneMarkerItem.type === ZoneMarkerType.RECT) {
          const { code, x, y, width, height, color, text } = zoneMarkerItem;
          mapContext.drawRectArea({ code, x, y, width, height, color, text }, true);
        }

        if (zoneMarkerItem.type === ZoneMarkerType.CIRCLE) {
          const { code, x, y, radius, color, text } = zoneMarkerItem;
          mapContext.drawCircleArea({ code, x, y, radius, color, text }, true);
        }

        if (zoneMarkerItem.type === ZoneMarkerType.IMG) {
          const { code, x, y, width, height, data } = zoneMarkerItem;
          mapContext.renderImage({ code, x, y, width, height, data }, true);
        }
      });
    }
    // 文字标记
    if (Array.isArray(labels)) {
      labels.forEach((item) => {
        mapContext.renderLabel(item, true);
      });
    }
    // 紧急停止区
    if (Array.isArray(emergencyStopFixedList)) {
      const _emergencyStopFixedList = [...emergencyStopFixedList];
      _emergencyStopFixedList.forEach((eStop) => {
        mapContext.renderFixedEStopFunction(eStop);
      });
    }
  }

  function renderRouteMap() {
    const currentLogicAreaData = currentMap?.logicAreaList?.[currentLogicArea];
    if (!currentLogicAreaData) return;

    // 先清空路线区相关标记
    if (preRouteMap && preRouteMap.code !== currentRouteMap) {
      const { blockCellIds, followCellIds, waitCellIds, nonStopCellIds, tunnels } = preRouteMap;
      // 不可走点
      if (Array.isArray(blockCellIds)) {
        mapContext.renderCellsType(blockCellIds, 'block_cell', 'remove');
      }
      // 跟车点
      if (Array.isArray(followCellIds)) {
        mapContext.renderCellsType(followCellIds, 'follow_cell', 'remove');
      }
      // 等待点
      if (Array.isArray(waitCellIds)) {
        mapContext.renderCellsType(waitCellIds, 'wait_cell', 'remove');
      }
      // 不可逗留点
      if (Array.isArray(nonStopCellIds)) {
        mapContext.renderNonStopCells(nonStopCellIds, 'remove');
      }
      // 通道
      if (Array.isArray(tunnels)) {
        mapContext.renderTunnel(tunnels, false, 'remove');
      }
      // 清空优先级线条
      mapContext.destroyAllLines();
    }

    // 新增当前路线区相关标记
    const currentRouteMapData = currentLogicAreaData.routeMap?.[currentRouteMap];
    if (!currentRouteMapData) return;
    const { blockCellIds, followCellIds, waitCellIds } = currentRouteMapData;
    // 不可走点
    if (Array.isArray(blockCellIds)) {
      mapContext.renderCellsType(blockCellIds, 'block_cell');
    }
    // 跟车点
    if (Array.isArray(followCellIds)) {
      mapContext.renderCellsType(followCellIds, 'follow_cell');
    }
    // 等待点
    if (Array.isArray(waitCellIds)) {
      mapContext.renderCellsType(waitCellIds, 'wait_cell');
    }

    const { nonStopCellIds, tunnels, relations } = currentRouteMapData;
    // 不可逗留点
    if (Array.isArray(nonStopCellIds)) {
      mapContext.renderNonStopCells(nonStopCellIds);
    }
    // 通道
    if (Array.isArray(tunnels)) {
      mapContext.renderTunnel(tunnels);
    }
    // 渲染线条
    mapContext.renderCostLines(relations, true);
  }

  // 地图区域鼠标样式
  function getCursorStyle() {
    let cursorStyle;
    switch (leftActiveCategory) {
      case LeftCategory.Drag:
        cursorStyle = 'grab';
        break;
      case LeftCategory.Font:
      case LeftCategory.Rectangle:
      case LeftCategory.Circle:
      case LeftCategory.Image:
        cursorStyle = 'crosshair';
        break;
      default:
        cursorStyle = 'default';
    }
    return cursorStyle;
  }

  function onSliderChange(value) {
    dispatch({ type: 'editor/saveMapRatio', payload: value });
  }

  return (
    <div
      id={'editorPixiContainer'}
      className={styles.editorBodyMiddle}
      style={{ cursor: getCursorStyle() }}
    >
      <EditorMapView navigationCellType={navigationCellType} />
      <EditorFooter mapRatio={mapRatio} onSliderChange={onSliderChange} />
      <EditorMask />

      {shortcutToolVisible && <EditorShortcutTool />}
    </div>
  );
};
export default connect(({ editor, editorView }) => {
  const {
    mapRatio,
    currentMap,
    currentLogicArea,
    currentRouteMap,
    preRouteMap,
    mapContext,
    leftActiveCategory,
    selections,
  } = editor;
  return {
    mapRatio,
    currentMap,
    currentLogicArea,
    currentRouteMap,
    preRouteMap,
    mapContext,
    leftActiveCategory,
    selections,
    mapRotation: editorView.mapRotation,
    shortcutToolVisible: editorView.shortcutToolVisible,
    shownNavigationCellType: editorView.shownNavigationCellType,
  };
})(memo(EditorMapContainer));
