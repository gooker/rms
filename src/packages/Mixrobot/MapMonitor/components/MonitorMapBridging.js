/* eslint-disable no-console */
import React, { memo, useRef, useEffect } from 'react';
import { connect } from '@/utils/dva';
import MonitorMapView from './MonitorMapView';
import {
  getCurrentLogicAreaData,
  getCurrentRouteMapData,
  renderChargerList,
  renderElevatorList,
  renderWorkstaionlist,
} from '@/utils/mapUtils';

const MonitorMapBridging = (props) => {
  const mapRef = useRef(null);

  const { dispatch, width, height } = props;
  const { getMapRef, finishNotice } = props;
  const { currentMap, currentLogicArea, currentRouteMap, preRouteMap } = props;
  const {
    checkAGV,
    checkCharger,
    simpleCheckAgv,
    checkWorkStation,
    checkTunnelGate,
    checkStoreGroup,
  } = props;

  useEffect(() => {
    mapRef.current.clearMapStage();
    mapRef.current.refresh();
    if (currentMap) {
      renderMap();
      renderLogicArea();
      renderRouteMap();
    }
  }, [currentMap, currentLogicArea]);

  useEffect(() => {
    if (currentMap) {
      renderRouteMap();
    }
  }, [currentRouteMap]);

  useEffect(() => {
    mapRef.current.resize(width, height);
    mapRef.current.refresh();
  }, [width, height]);

  function renderMap() {
    // 渲染点位(不渲染电梯内部点)
    const elevatorInnerCells = [];
    if (Array.isArray(currentMap.elevatorList)) {
      currentMap.elevatorList.forEach((item) => {
        elevatorInnerCells.push(...item.innerCellId);
      });
    }

    const cellsToRender = [];
    const { rangeStart, rangeEnd } = getCurrentLogicAreaData('monitor');
    const blockCellIds = getCurrentRouteMapData('monitor')?.blockCellIds || [];
    for (let index = rangeStart; index <= rangeEnd; index++) {
      const cellData = currentMap.cellMap[index];
      if (
        cellData &&
        !blockCellIds.includes(parseInt(cellData.id, 10)) &&
        !elevatorInnerCells.includes(parseInt(cellData.id, 10))
      ) {
        cellsToRender.push(cellData);
      }
    }
    mapRef.current.renderCells(cellsToRender);
    dispatch({ type: 'monitor/saveCurrentCells', payload: cellsToRender });

    // 渲染电梯
    if (Array.isArray(currentMap.elevatorList)) {
      const elevatorData = renderElevatorList(
        currentMap.elevatorList,
        cellsToRender,
        currentLogicArea,
      );
      mapRef.current.renderElevator(elevatorData);
    }

    mapRef.current.centerView(cellsToRender);
    mapRef.current.refresh();
  }

  function renderLogicArea() {
    const currentLogicAreaData = currentMap?.logicAreaList?.[currentLogicArea];
    if (!currentLogicAreaData) return;

    const { restCells, storeCellIds, taskCellIds } = currentLogicAreaData;
    // 休息区
    if (Array.isArray(restCells)) {
      mapRef.current.renderRestCells(restCells);
    }
    // 存储区
    if (Array.isArray(storeCellIds)) {
      mapRef.current.renderCellsType(storeCellIds, 'store_cell');
    }
    // 接任务点
    if (Array.isArray(taskCellIds)) {
      mapRef.current.renderCellsType(taskCellIds, 'get_task');
    }

    const { workstationList, chargerList, commonList } = currentLogicAreaData;
    // 充电桩
    if (Array.isArray(chargerList)) {
      const chargerListData = renderChargerList(chargerList, currentMap.cellMap);
      mapRef.current.renderChargers(chargerListData, true, checkCharger);
    }
    // 工作站
    if (Array.isArray(workstationList)) {
      const workStationListData = renderWorkstaionlist(workstationList, currentMap.cellMap);
      workStationListData.forEach((workStation) => {
        mapRef.current.addWorkStation(workStation, checkWorkStation);
      });
    }
    // 通用站点
    if (Array.isArray(commonList)) {
      mapRef.current.renderCommonFunction(commonList);
    }

    const { intersectionList, dumpStations } = currentLogicAreaData;
    // 交汇点
    if (Array.isArray(intersectionList)) {
      mapRef.current.renderIntersection(intersectionList);
    }
    // 抛货点
    if (Array.isArray(dumpStations)) {
      mapRef.current.renderDumpFunction(dumpStations);
    }
    // 小车 & 货架等
    mapRef.current.reRenderAfterSwitchingLogic();
    mapRef.current.refresh();
  }

  function renderRouteMap() {
    const currentLogicAreaData = currentMap?.logicAreaList?.[currentLogicArea];
    if (!currentLogicAreaData) return;

    // 先清空路线区相关标记
    if (preRouteMap && preRouteMap.code !== currentRouteMap) {
      const { blockCellIds, followCellIds, waitCellIds, nonStopCellIds, tunnels } = preRouteMap;
      // 不可走点
      if (Array.isArray(blockCellIds)) {
        mapRef.current.renderCellsType(blockCellIds, 'block_cell', 'remove');
      }
      // 跟车点
      if (Array.isArray(followCellIds)) {
        mapRef.current.renderCellsType(followCellIds, 'follow_cell', 'remove');
      }
      // 等待点
      if (Array.isArray(waitCellIds)) {
        mapRef.current.renderCellsType(waitCellIds, 'wait_cell', 'remove');
      }
      // 不可逗留点
      if (Array.isArray(nonStopCellIds)) {
        mapRef.current.renderNonStopCells(nonStopCellIds, 'remove');
      }
      // 通道
      if (Array.isArray(tunnels)) {
        mapRef.current.renderTunnel(tunnels, true, 'remove');
      }
      // 清空优先级线条
      mapRef.current.destroyAllLines();
    }

    // 新增当前路线区相关标记
    const currentRouteMapData = currentLogicAreaData.routeMap?.[currentRouteMap];
    if (!currentRouteMapData) return;
    const { blockCellIds, followCellIds, waitCellIds, nonStopCellIds } = currentRouteMapData;
    // 不可走点
    if (Array.isArray(blockCellIds)) {
      mapRef.current.renderCellsType(blockCellIds, 'block_cell');
    }
    // 跟车点
    if (Array.isArray(followCellIds)) {
      mapRef.current.renderCellsType(followCellIds, 'follow_cell');
    }
    // 等待点
    if (Array.isArray(waitCellIds)) {
      mapRef.current.renderCellsType(waitCellIds, 'wait_cell');
    }
    // 不可逗留点
    if (Array.isArray(nonStopCellIds)) {
      mapRef.current.renderNonStopCells(nonStopCellIds);
    }

    const { tunnels, relations } = currentRouteMapData;
    // 通道
    if (Array.isArray(tunnels)) {
      mapRef.current.renderTunnel(tunnels, true);
    }
    // 渲染线条
    mapRef.current.drawLine(relations, relations);
    mapRef.current.refresh();
  }

  return (
    <MonitorMapView
      ref={(ref) => {
        mapRef.current = ref;
        getMapRef(ref);
      }}
      width={width}
      height={height}
      finishNotice={finishNotice}
      checkAGV={checkAGV}
      simpleCheckAgv={simpleCheckAgv}
      checkStoreGroup={checkStoreGroup}
      checkTunnelGate={checkTunnelGate}
    />
  );
};
export default connect((state) => {
  const { currentMap, currentLogicArea, currentRouteMap, preRouteMap } = state.monitor;
  return { currentMap, currentLogicArea, currentRouteMap, preRouteMap };
})(memo(MonitorMapBridging));
