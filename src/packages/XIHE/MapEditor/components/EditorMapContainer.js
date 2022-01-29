import React, { memo, useEffect } from 'react';
import { throttle } from 'lodash';
import { connect } from '@/utils/RcsDva';
import { isNull } from '@/utils/util';
import EditorMapView from './EditorMapView';
import EditorMask from './EditorMask';
import {
  HeaderHeight,
  FooterHeight,
  LeftCategory,
  LeftToolBarWidth,
  RightToolBarWidth,
} from '../enums';
import { renderChargerList, renderElevatorList, renderWorkstaionlist } from '@/utils/mapUtil';

const EditorMapContainer = (props) => {
  const { dispatch, mapContext } = props;
  const { currentMap, currentLogicArea, currentRouteMap, preRouteMap, leftActiveCategory } = props;

  useEffect(() => {
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        const htmlDOM = document.getElementById('mapEditorPage');
        const { width, height } = htmlDOM.getBoundingClientRect();
        const { mapContext: _mapContext } = window.g_app._store.getState().editor;
        _mapContext &&
          _mapContext.resize(
            width - LeftToolBarWidth - RightToolBarWidth,
            height - HeaderHeight - FooterHeight,
          );
      }, 500),
    );
    resizeObserver.observe(document.getElementById('editorPixi'));

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isNull(mapContext)) return;
    mapContext.clearMapStage();
    mapContext.clearEditorMapData();

    if (currentMap) {
      renderMap();
      renderLogicArea();
      renderRouteMap();
    }
    mapContext.refresh();
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

    mapContext.centerView(cellsToRender);
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
      mapContext.renderRestCells(restCells);
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

    const { dumpStations, backGround, labels, emergencyStopFixedList } = currentLogicAreaData;
    // 抛货点
    if (Array.isArray(dumpStations)) {
      mapContext.renderDumpFunction(dumpStations);
    }

    // 背景(线框&图片)
    if (Array.isArray(backGround)) {
      backGround.forEach((backImgData) => {
        // 线框
        if (backImgData.type === 'wireframe') {
          // 矩形
          if (backImgData.shape === 'Rect') {
            mapContext.drawRectArea(
              backImgData.x,
              backImgData.y,
              backImgData.width,
              backImgData.height,
              backImgData.labelColor,
            );
          } else {
            mapContext.drawCircleArea(
              backImgData.x,
              backImgData.y,
              backImgData.radius,
              backImgData.labelColor,
            );
          }
        } else {
          // 图片
          mapContext.renderImage({
            base64: backImgData.imageUrl,
            x: backImgData.x,
            y: backImgData.y,
            width: backImgData.width,
            height: backImgData.height,
          });
        }
      });
    }

    // 文字标记
    if (Array.isArray(labels)) {
      labels.forEach(({ text, x, y }) => {
        mapContext.renderLabel(text, x, y);
      });
    }

    // 紧急停止区
    // if (Array.isArray(emergencyStopFixedList)) {
    //   const _emergencyStopFixedList = [...emergencyStopFixedList];
    //   _emergencyStopFixedList.forEach((eStop) => {
    //     mapContext.renderFixedEStopFunction(eStop);
    //   });
    // }
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
      case LeftCategory.Image:
      case LeftCategory.Rectangle:
      case LeftCategory.Circle:
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
      style={{ position: 'relative', flex: 1, cursor: getCursorStyle() }}
    >
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
  } = editor;
  return {
    currentMap,
    currentLogicArea,
    currentRouteMap,
    preRouteMap,
    mapContext,
    leftActiveCategory,
  };
})(memo(EditorMapContainer));
