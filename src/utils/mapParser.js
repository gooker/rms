import { getAngle, getCellMapId, getDistance } from '@/utils/mapUtil';
import { isNull } from '@/utils/util';
import CellEntity from '@/entities/CellEntity';

/**
 * 仙工地图数据转化工具
 * 1. 第一版只需要关注物理坐标，即线条只关注关系，不关注具体形式，比如: 直线、贝塞尔、圆弧
 * 2. 地图中的坐标点的单位均为米，会保留三位或三位以上小数，即精确到0.001m
 * @param mapData {{advancedPointList:Array, advancedLineList:Array, advancedCurveList:Array}}
 * @param existIds {Array}
 * @param currentLogicArea {Number}
 */
export function SEER(mapData, existIds, currentLogicArea) {
  const ids = [...existIds];
  const result = { cells: [], relations: [] };
  const instanceNameIdMap = {};
  const { advancedPointList, advancedCurveList } = mapData;
  advancedPointList.forEach(({ className, instanceName, pos }) => {
    // 导航点只关注LandMark
    if (className === 'LandMark') {
      const id = getCellMapId(ids);
      ids.push(id);
      const cellMapItem = new CellEntity({
        id,
        naviId: instanceName,
        brand: 'SEER',
        x: Math.round(pos.x * 1000),
        y: Math.round(pos.y * 1000),
        nx: Math.round(pos.x * 1000),
        ny: Math.round(pos.y * 1000),
        logicId: currentLogicArea,
      });
      instanceNameIdMap[cellMapItem.naviId] = cellMapItem.id;
      result.cells.push(cellMapItem);
    }
  });

  // relations: 直线、圆弧、贝塞尔
  advancedCurveList.forEach(({ startPos, endPos }) => {
    if (
      !isNull(instanceNameIdMap[startPos.instanceName]) &&
      !isNull(instanceNameIdMap[endPos.instanceName])
    ) {
      const relationItem = {
        type: 'line',
        cost: 10,
        angle: getAngle(startPos.pos, endPos.pos),
        source: instanceNameIdMap[startPos.instanceName],
        target: instanceNameIdMap[endPos.instanceName],
        distance: getDistance(
          { x: startPos.pos.x * 1000, y: startPos.pos.y * 1000 },
          { x: endPos.pos.x * 1000, y: endPos.pos.y * 1000 },
        ),
        bparam1: null,
        bparam2: null,
      };
      relationItem.angle = Math.round(relationItem.angle);
      relationItem.distance = Math.round(relationItem.distance);
      result.relations.push(relationItem);
    }
  });
  return result;
}

/**
 * 牧星地图数据转化工具，实际就是重新生成id
 * @param mapData {{}}
 * @param existIds {Array}
 * @param currentLogicArea {Number}
 */
export function MUSHINY(mapData, existIds, currentLogicArea) {
  return mapData;
}
