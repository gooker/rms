import React, { memo, useCallback, useEffect } from 'react';
import { debounce, isPlainObject, throttle } from 'lodash';
import { connect } from '@/utils/RmsDva';
import EditorMask from './EditorMask';
import EditorMapView from './EditorMapView';
import EditorShortcutTool from './EditorShortcutTool';
import { EditorMapSizeKey, ZoneMarkerType } from '@/config/consts';
import EventManager from '@/utils/EventManager';
import { getRandomString, isNull } from '@/utils/util';
import { convertLandCoordinate2Navi, transformXYByParams } from '@/utils/mapTransformer';
import EditorFooter from '@/packages/Scene/MapEditor/components/EditorFooter';
import { FooterHeight, HeaderHeight, LeftCategory, LeftToolBarWidth, RightToolBarWidth } from '../editorEnums';
import styles from '../editorLayout.module.less';
import { CoordinateType } from '@/config/config';
import FormattedMessage from '@/components/FormattedMessage';

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
    shownNavigationType,
    shownCellCoordinateType,
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
    // TIPS: 一定要先取消旧的clamp，不然新的会无法生效
    viewport.clampZoom(null);

    // 清空相关数据
    mapContext.clearMapStage();
    mapContext.clearEditorMapData();
    mapContext.refresh();

    if (currentMap && shownCellCoordinateType && shownNavigationType.length > 0) {
      // 先记录当前点位使用的坐标类型(物理还是导航)
      mapContext.cellCoordinateType = shownCellCoordinateType;
      renderMap();
      renderLogicArea();
      renderRouteMap();
      mapContext.centerView();
      doClampZoom();

      // 监听地图缩放比例
      viewport.off('zoomed');
      viewport.on('zoomed', zoomedCallback());

      // 添加事件处理地图跑出Screen
      viewport.off('moved');
      viewport.on('moved', avoidOffScreen());
    }
  }, [
    currentMap,
    mapContext,
    mapRotation,
    currentLogicArea,
    shownNavigationType,
    shownCellCoordinateType,
  ]);

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

  const doClampZoom = useCallback(
    function() {
      const { viewport } = mapContext.pixiUtils;
      const minMapRatio = mapContext.clampZoom(viewport, EditorMapSizeKey);
      dispatch({ type: 'editor/saveMapMinRatio', payload: minMapRatio });
    },
    [mapContext],
  );

  function avoidOffScreen() {
    return throttle(function() {
      const { x, y, width, height } = JSON.parse(window.sessionStorage.getItem(EditorMapSizeKey));
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
    }, 200);
  }

  function zoomedCallback() {
    return debounce(function() {
      dispatch({ type: 'editor/saveMapRatio', payload: this.scale.x });
    }, 100);
  }

  function renderMap() {
    const cellsToRender = Object.values(currentMap.cellMap)
      .filter((item) => shownNavigationType.includes(item.navigationType))
      .map((item) => {
        if (shownCellCoordinateType === CoordinateType.NAVI) {
          // 除了牧星点，别的厂商导入的地图的导航坐标都是直接从该厂商的导航点坐标转换而来，没有经过任何旋转等(假如有旋转等参数，而且必须不能转换，因为这个数据后台需要用)
          const { x, y } = transformXYByParams({ x: item.nx, y: item.ny }, item.navigationType);
          return {
            ...item,
            x,
            y,
            coordinateType: shownCellCoordinateType,
            coordinate: { x: item.x, y: item.y, nx: item.nx, ny: item.ny },
          };
        } else {
          // TIPS: 地图展示永远是展示导航位置，即使是物理也要转成导航
          return {
            ...item,
            ...convertLandCoordinate2Navi(item),
            coordinateType: shownCellCoordinateType,
            coordinate: { x: item.x, y: item.y, nx: item.nx, ny: item.ny },
          };
        }
      });
    mapContext.renderCells(cellsToRender);

    //TODO: 画原点坐标系
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
    // 停车点
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

    const { chargerList, commonList } = currentLogicAreaData;
    // 充电桩
    if (Array.isArray(chargerList) && chargerList.length > 0) {
      mapContext.renderChargers(chargerList, null, currentMap.cellMap);
    }
    // 通用站点
    if (Array.isArray(commonList)) {
      mapContext.renderStation(commonList, null, currentMap.cellMap);
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
    mapContext.renderCostLines(
      relations || [],
      shownCellCoordinateType,
      currentMap.transform || {},
    );

    // 标记地图编程
    const { programing } = currentRouteMapData;
    if (isPlainObject(programing)) {
      const { cells, relations } = programing;
      mapContext.renderCellsType(
        Object.keys(cells).map((item) => parseInt(item)),
        'programing',
      );
      mapContext.renderRelationProgramingFlag(Object.keys(relations));
    }
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
      <EditorMapView doClampZoom={doClampZoom} />
      <EditorFooter mapRatio={mapRatio} onSliderChange={onSliderChange} />
      <EditorMask />

      {shortcutToolVisible && <EditorShortcutTool />}

      {/* 强化展示当前显示的模式 */}
      <div className={styles.highlightCellCoordinateType}>
        <span>当前点位模式：</span>
        <span>
          {shownCellCoordinateType === CoordinateType.LAND ? (
            <FormattedMessage id='app.map.landCell' />
          ) : (
            <FormattedMessage id='app.map.naviCell' />
          )}
        </span>
      </div>
    </div>
  );
};
export default connect(({ editor, editorView }) => {
  return {
    mapRatio: editor.mapRatio,
    selections: editor.selections,
    currentMap: editor.currentMap,
    mapContext: editor.mapContext,
    preRouteMap: editor.preRouteMap,
    currentRouteMap: editor.currentRouteMap,
    currentLogicArea: editor.currentLogicArea,
    leftActiveCategory: editor.leftActiveCategory,

    mapRotation: editorView.mapRotation,
    shortcutToolVisible: editorView.shortcutToolVisible,
    shownCellCoordinateType: editorView.shownCellCoordinateType,
    shownNavigationType: editorView.shownNavigationType,
  };
})(memo(EditorMapContainer));
