/* eslint-disable no-console */
import { message } from 'antd';
import { isNull } from '@/utils/util';
import { getAngle, getCellMapId, getDistance } from '@/utils/mapUtil';
import { CellEntity, LogicArea, MapEntity, RelationEntity, RouteMap } from '@/entities';
import { NavigationType } from '@/config/config';
import packageJSON from '../../package.json';

export function getMapName(mapData, navigationCellType) {
  switch (navigationCellType) {
    case NavigationType.M_QRCODE:
      return mapData.name;
    case NavigationType.SEER_SLAM:
      return mapData.header.mapName;
    default:
      return null;
  }
}

export function isOldMushinyMap(mapData) {
  const { cellMap } = mapData;
  const firstKey = Object.keys(cellMap)[0];
  return isNull(cellMap[firstKey].navigationType);
}

// 将旧版地图结构转换成新版地图结构
export function convertMushinyOldMapToNew(mapData) {
  try {
    const { version } = packageJSON;
    const { name, desc, cellMap, logicAreaList } = mapData;
    const sectionId = window.localStorage.getItem('sectionId');
    const newMap = new MapEntity({ name, desc, version, sectionId });
    const cellMapValue = Object.values(cellMap);
    logicAreaList.forEach((logic) => {
      const { rangeStart, rangeEnd, routeMap } = logic;
      // 提取点位
      const logicCells = cellMapValue.filter(
        (item) => item.id >= rangeStart && item.id <= rangeEnd,
      );
      logicCells.forEach(({ id, x, y }) => {
        newMap.cellMap[id] = new CellEntity({
          id,
          naviId: id + '',
          navigationType: NavigationType.SEER_SLAM,
          x,
          y,
          nx: x,
          ny: y,
          logicId: logic.id,
          additional: {},
        });
      });

      // 提取逻辑区
      const logicEntity = new LogicArea({ id: logic.id, name: logic.name });
      newMap.logicAreaList.push(logicEntity);

      // 提取逻辑区路线
      Object.values(routeMap).forEach((routeMapItem) => {
        const loopRouteMap = new RouteMap({
          name: routeMapItem.name,
          code: routeMapItem.code,
          desc: routeMapItem.desc,
        });
        if (Array.isArray(routeMapItem.relations)) {
          routeMapItem.relations.forEach((relation) => {
            loopRouteMap.relations.push(
              new RelationEntity({
                cost: relation.cost,
                angle: getAngle(newMap.cellMap[relation.source], newMap.cellMap[relation.target]),
                source: relation.source,
                target: relation.target,
                distance: relation.distance,
              }),
            );
          });
        }
        logicEntity.routeMap[routeMapItem.code] = loopRouteMap;
      });
    });
    return newMap;
  } catch (err) {
    console.log(err);
    message.error(err.message);
    return null;
  }
}

// 提取旧版地图结构中的关键数据: 点位、线条
export function extractCellAndRelationFromOldMap(mapData) {
  return {};
}

/**
 * 仙工地图数据转化工具
 * 1. 第一版只需要关注物理坐标，即线条只关注关系，不关注具体形式，比如: 直线、贝塞尔、圆弧
 * 2. 地图中的坐标点的单位均为米，会保留三位或三位以上小数，即精确到0.001m
 * @param mapData {{}}
 * @param existIds {Array}
 * @param currentLogicArea {Number}
 */
export function SEER(mapData, existIds, currentLogicArea) {
  const ids = [...existIds];
  const instanceNameIdMap = {};
  const result = { cells: [], relations: [] };
  const { advancedPointList, advancedCurveList } = mapData;

  const advancedPointMap = {};
  if (Array.isArray(advancedPointList)) {
    advancedPointList.forEach((item) => {
      advancedPointMap[item.instanceName] = item;
    });
  }

  function createCellEntity(advancedPoint) {
    const { instanceName, pos, dir, ignoreDir } = advancedPoint;
    const id = getCellMapId(ids);
    ids.push(id);
    const cellMapItem = new CellEntity({
      id,
      naviId: instanceName,
      navigationType: NavigationType.SEER_SLAM,
      x: Math.round(pos.x * 1000),
      y: Math.round(pos.y * 1000),
      nx: Math.round(pos.x * 1000),
      ny: Math.round(pos.y * 1000),
      logicId: currentLogicArea,
      additional: { dir: !isNull(dir) ? Math.round(dir * 1000) / 1000 : undefined, ignoreDir },
    });
    instanceNameIdMap[instanceName] = id;
    result.cells.push(cellMapItem);
    return id;
  }

  // relations: 直线、圆弧、贝塞尔
  if (Array.isArray(advancedCurveList)) {
    advancedCurveList.forEach((advancedCurve) => {
      const { className, startPos, endPos, controlPos1, controlPos2 } = advancedCurve;
      let source, target;
      if (isNull(instanceNameIdMap[startPos.instanceName])) {
        source = createCellEntity({ ...advancedPointMap[startPos.instanceName], ...startPos });
      } else {
        source = instanceNameIdMap[startPos.instanceName];
      }

      if (isNull(instanceNameIdMap[endPos.instanceName])) {
        target = createCellEntity(endPos);
      } else {
        target = instanceNameIdMap[endPos.instanceName];
      }

      const relationItem = new RelationEntity({
        type: className,
        source,
        target,
        angle: getAngle(startPos.pos, endPos.pos),
        distance: getDistance(
          { x: startPos.pos.x * 1000, y: startPos.pos.y * 1000 },
          { x: endPos.pos.x * 1000, y: endPos.pos.y * 1000 },
        ),
        control1: { x: controlPos1.x * 1000, y: controlPos1.y * 1000 },
        control2: { x: controlPos2.x * 1000, y: controlPos2.y * 1000 },
      });
      relationItem.angle = Math.round(relationItem.angle);
      relationItem.distance = Math.round(relationItem.distance);
      result.relations.push(relationItem);
    });
  } else {
    throw new Error('"advancedCurveList"字段缺失');
  }
  return result;
}

/**
 * 牧星地图数据转化工具，实际就是重新生成id
 * @param mapData {{}}
 * @param existIds {Array}
 */
export function MUSHINY(mapData, existIds) {
  return { cells: [], relations: [] };
}
