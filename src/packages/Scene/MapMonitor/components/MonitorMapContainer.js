import React, { memo, useCallback, useEffect } from 'react';
import { debounce, throttle } from 'lodash';
import { connect } from '@/utils/RmsDva';
import EventManager from '@/utils/EventManager';
import { getRandomString, isNull } from '@/utils/util';
import { transformXYByParams } from '@/utils/mapTransformer';
import { MonitorMapSizeKey, ZoneMarkerType } from '@/config/consts';
import MonitorMapView from './MonitorMapView';
import MonitorMask from '@/packages/Scene/MapMonitor/components/MonitorMask';
import MonitorFooter from '@/packages/Scene/MapMonitor/components/MonitorFooter';
import { FooterHeight, HeaderHeight, RightToolBarWidth } from '../enums';
import commonStyles from '@/common.module.less';

const CLAMP_VALUE = 500;
const MonitorMapContainer = (props) => {
  const { dispatch, mapContext, currentLogicArea, currentRouteMap, preRouteMap } = props;
  const { mapRatio, mapMinRatio, currentMap, monitorLoad, shownNavigationCellType } = props;

  useEffect(() => {
    const functionId = getRandomString(8);

    function resize(rect) {
      const { width, height } = rect;
      const { mapContext: _mapContext } = window.$$state().monitor;
      _mapContext.resize(width - RightToolBarWidth, height - HeaderHeight - FooterHeight);
    }

    EventManager.subscribe('resize', resize, functionId);
    return () => {
      EventManager.unsubscribe('resize', functionId);
    };
  }, []);

  useEffect(() => {
    if (isNull(mapContext)) return;
    const { viewport } = mapContext.pixiUtils;
    viewport.setZoom(mapRatio, true);
  }, [mapRatio]);

  useEffect(() => {
    if (isNull(mapContext)) return;
    const { viewport } = mapContext.pixiUtils;
    // 很重要: 一定要先取消旧的clamp，不然新的会无法生效
    viewport.clampZoom(null);

    // 清空相关数据
    mapContext.clearMapStage();
    mapContext.clearMonitorLoad();
    mapContext.refresh();

    if (currentMap) {
      renderMap();
      renderLogicArea();
      renderRouteMap();
      renderMonitorLoad();
      mapContext.centerView();
      doClampZoom();

      // 监听地图缩放比例
      viewport.off('zoomed');
      viewport.on(
        'zoomed',
        debounce(function () {
          dispatch({ type: 'monitor/saveMapRatio', payload: this.scale.x });
        }, 100),
      );

      // 添加事件处理地图跑出Screen
      viewport.off('moved');
      viewport.on(
        'moved',
        throttle(function () {
          const { x, y, width, height } = JSON.parse(
            window.sessionStorage.getItem(MonitorMapSizeKey),
          );
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
  }, [currentMap, currentLogicArea, mapContext]);

  useEffect(() => {
    if (currentMap && !isNull(mapContext)) {
      renderRouteMap();
    }
  }, [currentRouteMap, mapContext]);

  function renderMap() {
    const cellsToRender = Object.values(currentMap.cellMap)
      .filter((item) => shownNavigationCellType.includes(item.navigationType))
      .map((item) =>
        transformXYByParams(item, item.navigationType, currentMap.transform?.[item.navigationType]),
      );
    mapContext.renderCells(cellsToRender);
  }

  const doClampZoom = useCallback(
    function () {
      const { viewport } = mapContext.pixiUtils;
      const minMapRatio = mapContext.clampZoom(viewport, MonitorMapSizeKey);
      dispatch({ type: 'monitor/saveMapMinRatio', payload: minMapRatio });
    },
    [mapContext],
  );

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

    const { workstationList, chargerList, commonList } = currentLogicAreaData;
    // 充电桩
    if (Array.isArray(chargerList)) {
      mapContext.renderChargers(chargerList);
    }
    // 通用站点
    if (Array.isArray(commonList)) {
      mapContext.renderStation(commonList);
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
          mapContext.drawRectArea({ code, x, y, width, height, color, text }, false);
        }

        if (zoneMarkerItem.type === ZoneMarkerType.CIRCLE) {
          const { code, x, y, radius, color, text } = zoneMarkerItem;
          mapContext.drawCircleArea({ code, x, y, radius, color, text }, false);
        }

        if (zoneMarkerItem.type === ZoneMarkerType.IMG) {
          const { code, x, y, width, height, data } = zoneMarkerItem;
          mapContext.renderImage({ code, x, y, width, height, data }, false);
        }
      });
    }

    // 文字标记
    if (Array.isArray(labels)) {
      labels.forEach((item) => {
        mapContext.renderLabel(item, false);
      });
    }

    // 紧急停止区
    if (Array.isArray(emergencyStopFixedList)) {
      mapContext.renderEmergencyStopArea(emergencyStopFixedList);
    }
    mapContext.refresh();
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
    mapContext.renderCostLines(relations);
    mapContext.refresh();
  }

  // 渲染监控里的小车、货架等
  function renderMonitorLoad() {
    if (!isNull(monitorLoad)) {
      const { latentVehicle, latentPod, toteVehicle, toteRack, sorterVehicle, loadList } =
        monitorLoad;
      // mapContext.renderLatentVehicle(latentVehicle);

      mapContext.renderToteVehicle(toteVehicle);

      mapContext.renderSorterVehicle(sorterVehicle);

      if (Array.isArray(loadList)) {
        const currentlatentLoad = loadList?.filter(
          ({ lt }) => lt === 'LOAD_TYPE_LatentJackingLoadType',
        );
        const currentToteLoad = loadList?.filter(({ lt }) => lt === 'tote');
        mapContext.renderLatentPod(currentlatentLoad);
        // mapContext.renderTotePod(currentToteLoad);
      }

      mapContext.renderTotePod(toteRack);

      const { temporaryBlock, emergencyStopList, chargerList } = monitorLoad;
      // 临时不可走点
      mapContext.renderTemporaryLock(temporaryBlock ?? []);

      // 急停区
      // mapContext.renderEmergencyStopArea(emergencyStopList);
      // dispatch({ type: 'monitor/saveEmergencyStopList', payload: emergencyStopList });

      // 渲染充电桩已绑定chargerId标记(这里只是处理已经绑定chargerId的情况)
      if (Array.isArray(chargerList)) {
        chargerList.forEach((item) => {
          mapContext.updateChargerHardware(item.name, item.chargerId, item.id);
          mapContext.updateChargerState({ n: item.name, s: item.chargerStatus });
        });
      }
    }
  }

  function onSliderChange(value) {
    dispatch({ type: 'monitor/saveMapRatio', payload: value });
  }

  return (
    <div id={'monitorPixiContainer'} className={commonStyles.monitorBodyMiddle}>
      <MonitorMapView />
      <MonitorFooter mapRatio={mapRatio} onSliderChange={onSliderChange} />
      <MonitorMask />
    </div>
  );
};
export default connect(({ monitor, monitorView }) => {
  const {
    currentMap,
    currentLogicArea,
    currentRouteMap,
    preRouteMap,
    mapContext,
    mapRatio,
    mapMinRatio,
    monitorLoad,
  } = monitor;
  return {
    currentMap,
    currentLogicArea,
    currentRouteMap,
    preRouteMap,
    mapContext,
    mapRatio,
    mapMinRatio,
    monitorLoad,
    shownNavigationCellType: monitorView.shownNavigationCellType,
  };
})(memo(MonitorMapContainer));
