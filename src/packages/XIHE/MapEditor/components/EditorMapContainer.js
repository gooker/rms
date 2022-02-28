import React, { memo, useEffect, useRef } from 'react';
import { throttle } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { isNull } from '@/utils/util';
import EditorMask from './EditorMask';
import EditorMapView from './EditorMapView';
import EditorShortcutTool from './EditorShortcutTool';
import { ZoneMarkerType } from '@/config/consts';
import { HeaderHeight, LeftCategory, LeftToolBarWidth, RightToolBarWidth } from '../enums';
import { renderChargerList, renderElevatorList, renderWorkstaionlist } from '@/utils/mapUtil';
import styles from '../editorLayout.module.less';

const EditorMapContainer = (props) => {
  const { dispatch, mapContext, showShortcutTool } = props;
  const { currentMap, currentLogicArea, currentRouteMap, preRouteMap, leftActiveCategory } = props;
  const worldSize = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        const htmlDOM = document.getElementById('mapEditorPage');
        if (htmlDOM && mapContext) {
          const { width, height } = htmlDOM.getBoundingClientRect();
          mapContext.resize(width - LeftToolBarWidth - RightToolBarWidth, height - HeaderHeight);
        }
      }, 500),
    );
    resizeObserver.observe(document.getElementById('editorPixi'));

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isNull(mapContext)) return;
    const { viewport } = mapContext.pixiUtils;
    // 很重要: 一定要先取消旧的clamp，不然新的会无法生效
    viewport.clampZoom({});

    // 清空相关数据
    mapContext.clearMapStage();
    mapContext.clearEditorMapData();

    if (currentMap) {
      renderMap();
      renderLogicArea();
      renderRouteMap();
      mapContext.centerView();

      // 动态限制地图缩放尺寸
      viewport.clampZoom({
        minWidth: viewport.worldScreenWidth * viewport.scale.x,
        minHeight: viewport.worldScreenHeight * viewport.scale.y,
        maxWidth: viewport.worldScreenWidth,
        maxHeight: viewport.worldScreenHeight,
      });

      worldSize.current.width = viewport.worldWidth;
      worldSize.current.height = viewport.worldHeight;

      viewport.off('moved');
      viewport.on(
        'moved',
        throttle(function () {
          if (this.top >= worldSize.current.height - 1500) {
            this.top = worldSize.current.height - 1500;
          }
          if (this.bottom <= 1500) {
            this.bottom = 1500;
          }
          if (this.left >= worldSize.current.width - 1500) {
            this.left = worldSize.current.width - 1500;
          }
          if (this.right <= 1500) {
            this.right = 1500;
          }
        }, 200),
      );
    }
  }, [currentMap, currentLogicArea]);

  useEffect(() => {
    if (currentMap && !isNull(mapContext)) {
      mapContext.clearEditorRouteData();
      renderRouteMap();
      mapContext.refresh();
    }
  }, [currentRouteMap]);

  function renderMap() {
    dispatch({ type: 'editor/saveState', payload: { selectCells: [], selectLines: [] } });
    // 渲染点位(不渲染电梯内部点)
    const elevatorInnerCells = [];
    if (Array.isArray(currentMap.elevatorList)) {
      currentMap.elevatorList.forEach((item) => {
        elevatorInnerCells.push(...item.innerCellId);
      });
    }

    const cellsToRender = [];
    const { rangeStart, rangeEnd } = currentMap?.logicAreaList?.[currentLogicArea];
    for (let index = rangeStart; index <= rangeEnd; index++) {
      const cellData = currentMap.cellMap[index];
      if (cellData && !elevatorInnerCells.includes(cellData.id)) {
        cellsToRender.push(cellData);
      }
    }
    mapContext.renderCells(cellsToRender);
    dispatch({ type: 'editor/saveCurrentCells', payload: cellsToRender });

    // 渲染电梯
    if (Array.isArray(currentMap.elevatorList)) {
      const elevatorData = renderElevatorList(
        currentMap.elevatorList,
        cellsToRender,
        currentLogicArea,
      );
      const logicElevator = elevatorData?.filter((item) => item.logicAreaId === currentLogicArea);
      mapContext.renderElevator(logicElevator || []);
    }
  }

  function renderLogicArea() {
    dispatch({ type: 'editor/saveState', payload: { selectCells: [], selectLines: [] } });
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

    const { workstationList, chargerList, commonList } = currentLogicAreaData;
    // 充电桩
    if (Array.isArray(chargerList)) {
      const chargerListData = renderChargerList(chargerList, currentMap.cellMap);
      mapContext.renderChargers(chargerListData);
    }
    // 工作站
    if (Array.isArray(workstationList)) {
      const workStationListData = renderWorkstaionlist(workstationList, currentMap.cellMap);
      workStationListData.forEach((workStation) => {
        mapContext.addWorkStation(workStation);
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
    mapContext.renderCostLines(relations, relations, true);
  }

  // 地图区域鼠标样式
  function getCursorStyle() {
    let cursorStyle;
    switch (leftActiveCategory) {
      case LeftCategory.Drag:
        cursorStyle = 'grab';
        break;
      case LeftCategory.Choose:
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

  return (
    <div
      id={'editorPixiContainer'}
      className={styles.editorBodyMiddle}
      style={{ cursor: getCursorStyle() }}
    >
      {showShortcutTool && <EditorShortcutTool />}
      <EditorMask />
      <EditorMapView />
    </div>
  );
};
export default connect(({ editor }) => {
  const {
    currentMap,
    currentLogicArea,
    currentRouteMap,
    preRouteMap,
    mapContext,
    leftActiveCategory,
    showShortcutTool,
  } = editor;
  return {
    currentMap,
    currentLogicArea,
    currentRouteMap,
    preRouteMap,
    mapContext,
    leftActiveCategory,
    showShortcutTool,
  };
})(memo(EditorMapContainer));
