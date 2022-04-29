import { getAngle, getCellMapId, getDistance } from '@/utils/mapUtil';
import { isNull } from '@/utils/util';
import CellEntity from '@/entities/CellEntity';
import RelationEntity from '@/entities/RelationEntity';
import { RobotBrand } from '@/config/config';

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
      brand: RobotBrand.SEER,
      x: Math.round(pos.x * 1000),
      y: Math.round(pos.y * 1000),
      nx: Math.round(pos.x * 1000),
      ny: Math.round(pos.y * 1000),
      logicId: currentLogicArea,
      additional: { dir: !isNull(dir) ? Math.round(dir * 100) / 100 : undefined, ignoreDir },
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
 * @param currentLogicArea {Number}
 */
export function MUSHINY(mapData, existIds, currentLogicArea) {
  return mapData;
}
