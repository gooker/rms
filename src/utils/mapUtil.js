import * as PIXI from 'pixi.js';
import { LINE_SCALE_MODE, SmoothGraphics } from '@pixi/graphics-smooth';
import * as XLSX from 'xlsx';
import { DashLine } from 'pixi-dashed-line';
import { cloneDeep, find, groupBy, orderBy, pickBy, sortBy } from 'lodash';
import { CoordinateType, LineType, NavigationType } from '@/config/config';
import { CellSize, MapSelectableSpriteType, VehicleState, zIndex } from '@/config/consts';
import { formatMessage, isNull, isStrictNull, offsetByDirection } from '@/utils/util';
import { CellEntity, LogicArea } from '@/entities';
import json from '../../package.json';

// 根据行列数批量生成点位
export function generateCellMapByRowsAndCols(
  rows,
  cols,
  firstID,
  firstPosition,
  distanceX,
  distanceY,
) {
  let id = firstID;
  const cells = [];
  for (let row = 0; row < rows; row++) {
    let innerY = firstPosition.y;
    innerY += row * distanceY;
    for (let col = 0; col < cols; col++) {
      let innerX = firstPosition.x;
      innerX += col * distanceX;
      cells.push(new CellEntity({ id, x: innerX, y: innerY }));
      id += 1;
    }
  }
  return cells;
}

export function getDistance(pos, pos2) {
  return Math.round(Math.sqrt((pos.x - pos2.x) ** 2 + (pos.y - pos2.y) ** 2));
}

// 以数学坐标系为基准的角度
export function getAngle(source, target) {
  const angle = Math.atan2(target.y - source.y, target.x - source.x) * (180 / Math.PI);
  if (angle > 0) {
    return 360 - angle;
  }
  return -angle;
}

/**
 * 现在元素角度显示按照数学坐标系转换
 * 这个方法就是将数学坐标系角度转换成pixi地图的角度
 * 比如: 地图数据里线条朝右是0度，那么地图显示就必须是90度
 */
export function convertAngleToPixiAngle(mathAngle) {
  if (!isStrictNull(mathAngle) && typeof mathAngle === 'number') {
    let pixi;
    if (mathAngle >= 360) {
      mathAngle = mathAngle - 360;
    }
    if (mathAngle >= 0 && mathAngle <= 90) {
      pixi = 90 - mathAngle;
    } else {
      pixi = 450 - mathAngle;
    }
    return pixi;
  }
  return null;
}

// 左右手角度转换
export function getOppositeAngle(angle) {
  let _angle = 360 - angle;
  if (_angle === 360) {
    return 0;
  }
  return _angle;
}

export function getCoordinator(source, angle, r) {
  const rad = (angle * Math.PI) / 180;
  const x = Math.trunc(Math.cos(rad) * r) + source.x;
  const y = -Math.trunc(Math.sin(rad) * r) + source.y;
  return { x, y };
}

export function getKeyByCoordinateType(coordinateType) {
  if (coordinateType === CoordinateType.LAND) {
    return ['x', 'y'];
  }
  return ['nx', 'ny'];
}

export function getLineJson(source, target, cost, type) {
  // 计算基于物理坐标的angle
  const angle = getAngle(
    { x: source.coordinate.x, y: source.coordinate.y },
    { x: target.coordinate.x, y: target.coordinate.y },
  );
  // 计算基于导航坐标的nAngle
  const nAngle = getAngle(
    { x: source.coordinate.nx, y: source.coordinate.ny },
    { x: target.coordinate.nx, y: target.coordinate.ny },
  );
  return {
    type: type || LineType.StraightPath,
    cost,
    nangle: Math.trunc(nAngle),
    angle: Math.trunc(angle),
    source: source.id,
    target: target.id,
    distance: getDistance(source, target),
  };
}

// 判断是否有对头线
function getHasOppositeDirection(relations, source, target) {
  let result = false;
  for (let index = 0; index < relations.length; index++) {
    const element = relations[index];
    if (element.source === target && element.target === source) {
      result = true;
      break;
    }
  }
  return result;
}

// 如果是斜线，要考虑锚点在点位角上
function getLineCorner(relations, beginCell, endCell, angle) {
  let x1;
  let y1;

  switch (true) {
    case angle > 0 && angle < 90: {
      x1 = beginCell.x + CellSize.width / 2;
      y1 = beginCell.y - CellSize.height / 2;
      break;
    }
    case angle > 90 && angle < 180: {
      x1 = beginCell.x + CellSize.width / 2;
      y1 = beginCell.y + CellSize.height / 2;
      break;
    }
    case angle > 180 && angle < 270: {
      x1 = beginCell.x - CellSize.width / 2;
      y1 = beginCell.y + CellSize.height / 2;
      break;
    }
    case angle > 270 && angle < 360: {
      x1 = beginCell.x - CellSize.width / 2;
      y1 = beginCell.y - CellSize.height / 2;
      break;
    }
    default:
      break;
  }
  return { x1, y1 };
}

const CAP_WIDTH = 50;
const CAP_HEIGHT = 150;
export function getCostArrow(length, color) {
  const smoothGraphics = new SmoothGraphics();
  const polygonPath = [
    0,
    0,
    -CAP_WIDTH,
    CAP_HEIGHT,
    -CAP_WIDTH / 2,
    CAP_HEIGHT,
    -CAP_WIDTH / 2,
    length,
    CAP_WIDTH / 2,
    length,
    CAP_WIDTH / 2,
    CAP_HEIGHT,
    CAP_WIDTH,
    CAP_HEIGHT,
  ];
  smoothGraphics.lineStyle(1, color, 1, 1, LINE_SCALE_MODE.NONE);
  smoothGraphics.beginFill(color, 1, true);
  smoothGraphics.drawPolygon(polygonPath);
  smoothGraphics.endFill();
  return smoothGraphics;
}

export function getRelationSelectionBG(width, height) {
  const smoothGraphics = new SmoothGraphics();
  smoothGraphics.lineStyle(0);
  smoothGraphics.beginFill(0xff5722, 1, true);
  smoothGraphics.drawRect(0, 0, width, height);
  smoothGraphics.endFill();
  return smoothGraphics;
}

/**
 * 根据所选的点位，和方向，优先级生成线
 * @param {*} cells cellIds
 * @param {*} dir  方向
 * @param {*} value 优先级
 * TIPS: 这个方法最低效，因为采用穷举法；实际上可以根据dir对点位进行分组，随后按组进行reduce操作
 */
export function batchGenerateLine(cells, dir, value) {
  const result = {};
  if (cells.length === 2) {
    let source, target;
    if (dir === 90) {
      [target, source] = orderBy(cells, 'y');
    } else if (dir === 0) {
      [source, target] = orderBy(cells, 'x');
    } else if (dir === 270) {
      [source, target] = orderBy(cells, 'y');
    } else {
      [target, source] = orderBy(cells, 'x');
    }
    const key = `${source.id}-${target.id}`;
    result[key] = getLineJson(source, target, value);
  }
  if (cells.length > 2) {
    for (let source of cells) {
      for (let target of cells) {
        if (source.id === target.id) {
          continue;
        }
        const key = `${source.id}_${dir}`;
        if (getAngle(source, target) === dir) {
          // 同一个方向可能有多个连接点，但是只取最近的那个点
          if (result[key]) {
            const distance = getDistance(source, target);
            if (result[key].distance > distance) {
              result[key] = getLineJson(source, target, value);
            }
          } else {
            result[key] = getLineJson(source, target, value);
          }
        }
      }
    }
    Object.keys(result).map((key) => {
      const { source, target } = result[key];
      result[`${source}-${target}`] = result[key];
    });
  }
  return result;
}

export function moveCell(cell, angle, distance) {
  let { x, y } = cell;
  let flag = 1;
  if ([90, 180].includes(angle)) {
    flag = -1;
  }
  if ([90, 270].includes(angle)) {
    y = y + flag * distance;
  } else {
    x = x + flag * distance;
  }
  return { x, y };
}

/**
 * 获取二维码ID。该方法只能用来处理牧星点位批量获取ID的场景
 */
export function generateCellIds(cellMap, requiredCount) {
  // 获取已存在的牧星点位导航ID
  const mushinyCells = pickBy(cellMap, { navigationType: NavigationType.M_QRCODE });
  const existNaviIds = Object.values(mushinyCells)
    .map(({ naviId }) => naviId)
    .map((item) => parseInt(item));

  const naviId = [];
  let value = 1;
  for (let i = 0; i < requiredCount; i++) {
    while (existNaviIds.includes(value) || naviId.includes(value)) {
      value += 1;
    }
    naviId.push(value);
  }

  const cellId = [];
  let step = 1;
  for (let i = 0; i < requiredCount; i++) {
    while (cellMap[step] !== undefined || cellId.includes(step)) {
      step += 1;
    }
    cellId.push(step);
  }
  return { cellId, naviId };
}

export function transform(object, oldValue, newValue, isUpdate) {
  if (typeof object === 'string' || typeof object === 'number') {
    if (object === oldValue && isUpdate) {
      return parseInt(newValue, 10);
    }
    return object;
  }
  if (typeof object === 'object') {
    if (Array.isArray(object)) {
      return object.map((record) => {
        return transform(record, oldValue, newValue, isUpdate);
      });
    }
    if (object !== null) {
      const newObject = {};
      Object.keys(object).forEach((key) => {
        const reg = /cellid|source|target|/i;
        const flag = key.match(reg) !== null && key.match(reg)[0] !== '';
        newObject[key] = transform(object[key], oldValue, newValue, flag);
      });
      return newObject;
    }
    return object;
  }
}

/**
 // ********************** 充电桩 ********************* //
 **/
export function generateChargerXY(charger, cellMap) {
  const { angle, chargingCells } = charger;
  const stopCellCollection = chargingCells.map(({ cellId }) => cellMap[cellId]);
  if (stopCellCollection.length === 1) {
    const stopCell = stopCellCollection[0];
    // 充电桩坐标数据不用于后台业务处理，所以这里定位使用pixi定位的坐标，仅供显示用
    const { x, y } = getCoordinator({ x: stopCell.x, y: stopCell.y }, angle, 1000);
    return { x, y, ...charger };
  } else {
    // 如果存在多个充电点，那么充电桩和充电点应该在一条直线，且充电桩距离最近的充电点是1000
    let stopCell;
    if ([0, 180].includes(angle)) {
      const sorted = orderBy(stopCellCollection, 'y'); // 递增排序
      if (angle === 0) {
        stopCell = sorted[0];
      } else {
        stopCell = sorted.at(-1);
      }
    } else {
      const sorted = orderBy(stopCellCollection, 'x'); // 递增排序
      if (angle === 90) {
        stopCell = sorted.at(-1);
      } else {
        stopCell = sorted[0];
      }
    }
    const { x, y } = getCoordinator({ x: stopCell.x, y: stopCell.y }, angle, 1000);
    return { x, y, ...charger };
  }
}

// 将SupportTypes数据转换成DTO数据结构
export function convertSupportTypesToDTO(supportTypes) {
  const $supportTypes = supportTypes
    .map((item) => item.split('@'))
    .map(([key, value]) => ({
      adapterType: key,
      vehicleType: value,
    }));
  const groupedSupportTypes = groupBy($supportTypes, 'adapterType');
  const $$supportTypes = [];
  Object.keys(groupedSupportTypes).forEach((adapterType) => {
    $$supportTypes.push({
      adapterType,
      vehicleTypes: groupedSupportTypes[adapterType].map(({ vehicleType }) => vehicleType),
    });
  });
  return $$supportTypes;
}

export function drawRelationLine(source, target) {
  const relationLine = new PIXI.Graphics();
  relationLine.zIndex = zIndex.targetLine;
  const dash = new DashLine(relationLine, {
    dash: [20, 40],
    width: 20,
    color: 0x0389ff,
  });
  dash.moveTo(source.x, source.y);
  dash.lineTo(target.x, target.y);
  return relationLine;
}

// 根据导航ID获取业务ID(自增ID)
// BUG: 如果两种存在相同的naviID, 那么这里会出现bug
export function getIdByNaviId(naviId, cellMap) {
  if (isNull(cellMap)) {
    console.error(`[RMS]: 'cellMap' loss`);
    return null;
  }
  const item = pickBy(cellMap, (value) => value.naviId === naviId);
  if (item) {
    return Object.values(item)[0]?.id;
  }
  return null;
}

// 根据业务ID获取导航ID
export function getNaviIdById(id, cellMap) {
  if (isNull(cellMap)) {
    console.error(`[RMS]: 'cellMap' loss`);
    return null;
  }
  return cellMap[id]?.naviId;
}

// 将充电桩数据转换成后台数据结构
export function convertChargerToDTO(charger, cellMap, cellCoordinateType) {
  // 这个charger数据是表单数据，避免直接修改值，所以这里clone
  const _charger = cloneDeep(charger);
  _charger.chargingCells = _charger.chargingCells.map((item) => {
    // 这里的cellId是导航ID，需要转换成业务ID
    item.cellId = getIdByNaviId(item.cellId, cellMap);
    if (Array.isArray(item.supportTypes)) {
      item.supportTypes = convertSupportTypesToDTO(item.supportTypes);
    } else {
      item.supportTypes = [];
    }

    // direction --> angle & nangle
    if (cellCoordinateType === CoordinateType.NAVI) {
      item.angle = getOppositeAngle(item.direction);
      item.nangle = item.direction;
    } else {
      item.nangle = item.direction;
      item.nangle = getOppositeAngle(item.direction);
    }
    delete item.direction;
    return item;
  });
  return _charger;
}

export function convertStationToDTO(station, cellMap) {
  const _station = cloneDeep(station);
  _station.stopCellId = getIdByNaviId(_station.stopCellId, cellMap);
  return _station;
}

// 将充电桩后台数据转换成前端数据
export function convertChargerToView(charger, cellMap, cellCoordinateType) {
  if (isStrictNull(charger)) return null;

  // TIPS: 这里的cellId是业务ID，要转成导航ID
  const chargingCells = charger.chargingCells.map(
    ({ cellId, distance, angle, nangle, supportTypes }) => {
      const _supportTypes = supportTypes.map(({ adapterType, vehicleTypes }) =>
        vehicleTypes.map((item) => `${adapterType}@${item}`),
      );
      return {
        cellId: getNaviIdById(cellId, cellMap),
        distance,
        direction: cellCoordinateType === CoordinateType.NAVI ? nangle : angle,
        supportTypes: _supportTypes.flat(),
      };
    },
  );
  return { ...charger, chargingCells };
}

export function convertRestToView(rest) {
  if (isStrictNull(rest)) return null;
  const { cellIds, supportTypes } = rest;
  const _supportTypes = supportTypes.map(({ adapterType, vehicleTypes }) =>
    vehicleTypes.map((item) => `${adapterType}@${item}`),
  );
  return {
    cellIds,
    supportTypes: _supportTypes.flat(),
  };
}

// 将电梯数据转换成地图渲染适用的结构
export function convertElevatorToView(elevatorList) {
  const result = [];
  elevatorList.forEach((record) => {
    const { logicLocations } = record;
    if (logicLocations != null) {
      const logicIds = Object.keys(logicLocations);
      for (let i = 0; i < logicIds.length; i++) {
        const loopLogicAreaId = logicIds[i];
        if (logicLocations[loopLogicAreaId].innerMapping != null) {
          const innerMapping = logicLocations[loopLogicAreaId].innerMapping;
          const replaceCellId = Object.keys(innerMapping)[0]; // 电梯替换点
          result.push({
            ...record.logicLocations[loopLogicAreaId],
            logicAreaId: parseInt(loopLogicAreaId, 10),
            replace: parseInt(replaceCellId, 10),
          });
        }
      }
    }
  });
  return result;
}
// ************************ 地图部分数据转换 - end ************************ //

export function generateLogicCellMap(record, innerCellMap) {
  const result = { ...record };
  Object.keys(innerCellMap).forEach((key) => {
    if (result[innerCellMap[key]] !== null) {
      result[key] = {
        ...result[innerCellMap[key]],
        id: key,
      };
      delete result[innerCellMap[key]];
    }
  });
  return result;
}

/**
 * 验证地图JSON数据是否合法
 * @param {*} mapData 地图JSON数据
 * @returns
 */
export function validateMapData(mapData) {
  // 地图点位类型必须是ID
  const { cellMap } = mapData;
  const cellId = Object.keys(cellMap);
  for (let index = 0; index < cellId.length; index++) {
    const element = cellId[index];
    if (Number.isNaN(parseInt(element, 10))) {
      return false;
    }
  }
  return true;
}

export function convertCadToMap(file) {
  return new Promise((reslove, reject) => {
    const rABS =
      typeof FileReader !== 'undefined' && (FileReader.prototype || {}).readAsBinaryString;

    // 生成地图名称
    let mapName = file.name.split('.');
    mapName.pop();
    mapName = mapName[0];

    // 读取Excel点位信息
    const reader = new FileReader();
    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
    reader.onerror = () => {
      reject(formatMessage({ id: 'app.editor.cad.onerror' }));
    };
    reader.onload = (ev) => {
      let data = ev.target.result;
      if (!rABS) {
        data = new Uint8Array(data);
      }
      const workSheet = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
      const sheet = workSheet.Sheets[workSheet.SheetNames[0]];
      const sheetJSON = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // 筛选 QR 行
      const titleRow = sheetJSON[0];
      const dataRow = sheetJSON.splice(1);
      const nameIndex = titleRow.indexOf('名称');
      if (nameIndex === -1) {
        reject(formatMessage({ id: 'app.editor.cad.nameColumnError' }, { name: '名称' }));
      }
      const qrRow = dataRow.filter((row) => row[nameIndex] === 'STD QR CODE');
      if (qrRow.length === 0) {
        reject(formatMessage({ id: 'app.editor.cad.noQrRow' }, { qr: 'STD QR CODE' }));
      }

      // 组装临时点位
      const xIndex = titleRow.indexOf('位置 X');
      if (xIndex === -1) {
        reject(formatMessage({ id: 'app.editor.cad.xColumnError' }, { x: '位置 X' }));
      }
      const yIndex = titleRow.indexOf('位置 Y');
      if (yIndex === -1) {
        reject(formatMessage({ id: 'app.editor.cad.yColumnError' }, { y: '位置 Y' }));
      }
      let cells = qrRow.map((row, index) => ({
        id: index + 1,
        x: parseInt(row[xIndex], 10),
        y: parseInt(row[yIndex], 10),
        costs: null,
      }));

      // 坐标转换. Excel中点位信息为数学中的标准坐标系(右上为正)，但是PIXI.js的坐标系为右下为正, 所以需要把cells中数据的y轴设置为其负数
      cells = cells.map(({ id, x, y, costs }) => ({ id, x, y: -y, costs }));

      // 排序. 默认地图左上角为原点, 所以需要对数据进行排序然后偏移操作
      cells = sortBy(cells, ['x', 'y']);
      const { x: xOffset, y: yOffset } = cells[0];
      cells = cells.map(({ id, x, y, costs }) => ({ id, x: x - xOffset, y: y - yOffset, costs }));

      // 组装Map数据
      const { version } = json;
      const cellMap = {};
      cells.forEach((cell) => {
        cellMap[cell.id] = { ...cell };
      });

      const routeMap = {
        DEFAULT: {
          code: 'DEFAULT',
          name: formatMessage({ id: 'app.models.default' }),
          desc: formatMessage({ id: 'app.models.description' }),
          relations: [],
          blockCellIds: [],
          followCellIds: [],
          waitCellIds: [],
          nonStopCellIds: [],
        },
      };
      const defaultLogicArea = new LogicArea({ routeMap });
      const logicAreaList = [defaultLogicArea];
      const mapJSON = {
        name: mapName,
        desc: '',
        cellMap,
        logicAreaList,
        elevatorList: [],
        mver: version,
        ever: version,
        sectionId: null,
        activeFlag: false,
      };
      reslove(mapJSON);
    };
  });
}

export function getCurrentLogicAreaData(namespace = 'editor') {
  const dvaStore = window.$$state();
  const namespaceState = dvaStore[namespace];
  const { currentMap, currentLogicArea } = namespaceState;
  return find(currentMap?.logicAreaList || [], { id: currentLogicArea });
}

export function getCurrentRouteMapData(namespace = 'editor') {
  const dvaStore = window.$$state();
  const namespaceState = dvaStore[namespace];
  const { currentRouteMap } = namespaceState;
  const currentLogicAreaData = getCurrentLogicAreaData(namespace);
  if (currentLogicAreaData) {
    return currentLogicAreaData.routeMap?.[currentRouteMap];
  }
  return null;
}

export function syncLineState(cellIds, newCellMap, result) {
  const { shownCellCoordinateType } = window.$$state().editorView;
  const currentRouteMapData = getCurrentRouteMapData();
  let relations = [...(currentRouteMapData.relations || [])];

  // 1. 删除相关曲线
  const { StraightPath, BezierPath, ArcPath } = LineType;
  relations = relations.filter((item) => {
    if (item.type === StraightPath) return true;
    if ([ArcPath, BezierPath].includes(item.type)) {
      if (cellIds.includes(item.source) || cellIds.includes(item.target)) {
        result.line.delete.push(item);
        return false;
      }
      return true;
    }
  });

  // 2. 更新直线
  let newRelations = [];
  let relationsWillUpdate = [];
  relations.forEach((item) => {
    if (cellIds.includes(item.source) || cellIds.includes(item.target)) {
      result.line.delete.push(item);
      relationsWillUpdate.push(item);
    } else {
      newRelations.push(item);
    }
  });

  // 将点位数据转化成getLineJson可用的数据结构
  function convert(_cell) {
    const cell = { ..._cell };
    const [xKey, yKey] = getKeyByCoordinateType(shownCellCoordinateType);
    cell.coordinate = { x: cell.x, y: cell.y, nx: cell.nx, ny: cell.ny };
    cell.x = cell[xKey];
    cell.y = cell[yKey];
    return cell;
  }

  // 重新计算 Distance
  relationsWillUpdate = relationsWillUpdate.map((relation) => {
    const { source, target, cost, type } = relation;
    const sourceCell = convert(newCellMap[source]);
    const targetCell = convert(newCellMap[target]);
    return getLineJson(sourceCell, targetCell, cost, type);
  });

  result.line.add = relationsWillUpdate;
  newRelations = [...newRelations, ...relationsWillUpdate];
  return newRelations;
}

export function addTemporaryId(currentMap) {
  let tid = 1;
  const newMapData = { ...currentMap };
  newMapData.logicAreaList.forEach((logicArea) => {
    const { chargerList, commonList, workstationList } = logicArea;
    // 充电桩
    if (Array.isArray(chargerList)) {
      chargerList.forEach((charger) => {
        charger.tid = tid;
        tid += 1;
      });
    }

    // 通用站点
    if (Array.isArray(commonList)) {
      commonList.forEach((commonItem) => {
        commonItem.tid = tid;
        tid += 1;
      });
    }

    // 工作站
    if (Array.isArray(workstationList)) {
      workstationList.forEach((workstation) => {
        workstation.tid = tid;
        tid += 1;
      });
    }
  });
  return newMapData;
}

export function hasLatentPod(value) {
  return !isNull(value) && value !== '0';
}

/**
 * 将料箱货架布局数据转化为地图渲染可用数据结构
 * @param {*} toteLayoutData
 * @param {*} sizeMapping
 * @returns
 */
export function convertToteLayoutData(toteLayoutData, sizeMapping) {
  const newToteLayoutData = { ...toteLayoutData };
  const rackGroups = newToteLayoutData.rackGroups;
  const rackGroupKeys = Object.keys(rackGroups); // ['AA001',...]
  rackGroupKeys.forEach((rackGroupKey) => {
    const rackGroupData = rackGroups[rackGroupKey];
    const { aisle, line } = rackGroupData;
    const sideKeys = ['leftRack', 'rightRack'];
    sideKeys.forEach((sideKey) => {
      if (rackGroupData[sideKey]) {
        const rack = rackGroupData[sideKey];
        const sideFlag = sideKey === 'leftRack' ? 'L' : 'R';
        const newBins = [];
        rack.bins.forEach((bin) => {
          if (Array.isArray(bin)) {
            // 因为是俯视图，所以只需要取一个元素参与显示就行
            const columnNumber = bin[0].column >= 10 ? `${bin[0].column}` : `0${bin[0].column}`;
            newBins.push({ ...bin[0], code: `${aisle}${line}${sideFlag}C${columnNumber}` });
          }
        });

        // 转换尺寸
        newBins.forEach((bin) => {
          bin.width = sizeMapping?.WIDTH?.[bin.width];
          bin.depth = sizeMapping?.DEPTH?.[bin.depth];
        });

        // 替换原来的bins数据
        rack.bins = newBins;
      }
    });
  });
  return newToteLayoutData;
}

/**
 * 将抛物框表单数据转化为后台数据结构
 * @param {*} currentDumpStation
 * @param {*} existDumpStations
 * @returns
 */
export function covertDumpFormData2Param(currentDumpStation, existDumpStations) {
  const newDumpStation = {};
  if (!isNull(currentDumpStation.dumpX) && !isNull(currentDumpStation.dumpY)) {
    newDumpStation.name = currentDumpStation.name;
    newDumpStation.cellId = currentDumpStation.baseCell;
    newDumpStation.targetCellId = currentDumpStation.targetCell;
    newDumpStation.vehicleDirection = currentDumpStation.vehicleDirection;

    newDumpStation.distance = isNull(currentDumpStation.dumpDistance)
      ? null
      : parseInt(currentDumpStation.dumpDistance, 10);

    newDumpStation.x = parseInt(currentDumpStation.dumpX, 10);
    newDumpStation.y = parseInt(currentDumpStation.dumpY, 10);

    // 处理抛物框
    let currentDumpBasket = currentDumpStation?.dumpBasket ?? [];
    currentDumpBasket = currentDumpBasket.filter(Boolean);
    newDumpStation.dumpBasket = currentDumpBasket.map((basket) => {
      const { key, direction, speed, distance } = basket;
      const _speed = isNull(speed) ? null : parseInt(speed, 10);
      const _distance = isNull(distance) ? 0 : parseInt(distance, 10);
      const { x, y } = offsetByDirection(newDumpStation, direction, _distance);
      const item = { x, y, direction, speed: _speed, distance: _distance };

      /**
       * 生成唯一Key
       * 规则: 起始点ID+字母。字母从A开始递增
       */
      let basketKey = key;
      if (isNull(basketKey)) {
        const { baseCell } = currentDumpStation;
        const dumpStation = find(existDumpStations, { cellId: baseCell });
        if (dumpStation) {
          if (!dumpStation.dumpBasket || !Array.isArray(dumpStation.dumpBasket)) {
            basketKey = `${baseCell}${String.fromCharCode(65)}`;
          } else {
            // 判断当前点位是否已经存在抛物篮
            const cellBasket = find(dumpStation.dumpBasket, { x: item.x, y: item.y });
            if (cellBasket) {
              basketKey = cellBasket.key;
            } else {
              basketKey = `${baseCell}${String.fromCharCode(65 + dumpStation.dumpBasket.length)}`;
            }
          }
        } else {
          basketKey = `${baseCell}${String.fromCharCode(65)}`;
        }
      }
      item.key = basketKey;
      return item;
    });
    return newDumpStation;
  }
  return null;
}

/**
 * 将交汇点表单数据转化为后台数据结构
 * @param {*} formData
 * @returns
 */
const directionMap = { ip0: '0', ip1: '90', ip2: '180', ip3: '270' };
export function covertIntersectionFormData2Param(formData) {
  const { cellId } = formData;
  if (isNull(cellId)) {
    return null;
  }
  const ip = [];
  const result = { cellId, ip, isTrafficCell: formData.isTrafficCell };
  ['ip0', 'ip1', 'ip2', 'ip3'].forEach((key) => {
    let value = formData.hasOwnProperty('ip') ? formData.ip : formData[key];
    value = value ? value.trim() : null;
    if (value) {
      ip.push({
        // 应后台要求，这是不给 0 1 2 3， 需要转换成对应角度
        direction: directionMap[key],
        value,
      });
    }
  });
  return result;
}

/**
 * 获取电梯点对应的原始地图点位
 * @param {*} currentCellId
 * @returns
 */
export function getElevatorMapCellId(currentCellId) {
  const { monitor } = window.$$state();
  const { elevatorCellMap } = monitor;
  const currentLogicAreaData = getCurrentLogicAreaData('monitor');
  if (!currentLogicAreaData) return null;

  // 对小车点位进行转换，如果接受到的电梯替换点就转换成地图原始点位
  const currentLogicId = currentLogicAreaData.id;
  if (elevatorCellMap && elevatorCellMap[currentCellId]) {
    currentCellId = elevatorCellMap[currentCellId][currentLogicId];
  }
  return Number(currentCellId);
}

/**
 * 计算base点到target点的方向distance距离的点位
 * 返回 0 表示两个点没有相同坐标轴(指 相同x 或者 相同y)
 * 返回 1 表示两个点为同一个点
 */
export function getOffsetDistance(base, target, distance) {
  if (base.x === target.x && base.y === target.y) {
    return 1;
  }

  if (base.x === target.x) {
    // Y 轴方向
    // Base在Target下方
    if (base.y > target.y) {
      return { x: base.x, y: base.y - distance };
    }
    // Base在Target上方
    if (base.y < target.y) {
      return { x: base.x, y: base.y + distance };
    }
  } else if (base.y === target.y) {
    // X 轴方向
    // base在target右边
    if (base.x > target.x) {
      return { x: base.x - distance, y: base.y };
    }
    // base在target左边
    if (base.x < target.x) {
      return { x: base.x + distance, y: base.y };
    }
  } else if (base.x === target.x && base.y === target.y) {
    return 1;
  } else {
    return 0;
  }
}

/**
 * 根据Texture key获取Texture实体数据
 * @param {*} key
 * @returns
 */
export function getTextureFromResources(key) {
  const { resources } = PIXI.Loader.shared;
  const spriteSheetBaseName = 'spritesheet';
  const textureKeys = Object.keys(resources);
  let texture;
  // 先正常拿
  if (textureKeys.includes(key)) {
    texture = resources[key].texture;
  } else {
    // 再从SpriteSheets中拿
    const spriteSheets = textureKeys.filter(
      (textureKey) => textureKey.includes(spriteSheetBaseName) && textureKey.endsWith('.json'),
    );
    for (let index = 0; index < spriteSheets.length; index++) {
      const spriteSheetName = spriteSheets[index];
      const textures = resources[spriteSheetName].textures;
      texture = textures && textures[`${key}.png`];
      if (textures && texture) {
        break;
      }
    }
  }

  if (isNull(texture)) {
    texture = PIXI.utils.TextureCache[key];
  }
  return texture;
}

export function switchVehicleState(key, carState) {
  const state = [];
  switch (carState) {
    case VehicleState.working:
      state.push(`${key}_vehicle_green`);
      state.push('on_task');
      break;
    case VehicleState.offline:
      state.push(`${key}_vehicle_grey`);
      state.push('offline');
      break;
    case VehicleState.connecting:
      state.push(`${key}_vehicle_grey`);
      state.push('offline');
      break;
    case VehicleState.waiting:
      state.push(`${key}_vehicle_purple`);
      state.push('waiting');
      break;
    case VehicleState.standBy:
      state.push(`${key}_vehicle`);
      state.push('stand_by');
      break;
    case VehicleState.charging:
      state.push(`${key}_vehicle_yellow`);
      state.push('charging');
      break;
    case VehicleState.error:
      state.push(`${key}_vehicle_red`);
      state.push('error');
      break;
    default:
      break;
  }
  return state;
}

export function switchVehicleBatteryState(battery) {
  let state;
  const batteryInt = parseInt(battery, 10);
  switch (true) {
    case batteryInt === 0:
      state = '0';
      break;
    case batteryInt >= 1 && batteryInt <= 10:
      state = '1-10';
      break;
    case batteryInt >= 11 && batteryInt <= 20:
      state = '11-20';
      break;
    case batteryInt >= 21 && batteryInt <= 40:
      state = '21-40';
      break;
    case batteryInt >= 41 && batteryInt <= 60:
      state = '41-60';
      break;
    case batteryInt >= 61 && batteryInt <= 90: // 90以上现在定义为满
      state = '61-80';
      break;
    case batteryInt >= 91:
      state = '81-100';
      break;
    default:
      break;
  }
  return state;
}

export function explainVehicleStatus(value) {
  const mapping = {
    '-1': VehicleState.offline,
    0: VehicleState.standBy,
    1: VehicleState.working,
    2: VehicleState.charging,
    3: VehicleState.error,
    4: VehicleState.offline,
    5: VehicleState.waiting,
  };
  return mapping[value];
}

export function getCurrentload(data) {
  let currentLoad = {
    loadId: null,
    loadDirection: 0,
    loadUniId: null,
  };
  // 先一个   出现多个的时候再改 王日锋 说就是会有多个载具的情况
  if (data) {
    currentLoad.loadId = data[0]?.l;
    currentLoad.loadDirection = data[0]?.lA;
    currentLoad.loadUniId = data[0]?.lUniId;
  }
  return currentLoad;
}

export function unifyVehicleState(vehicle) {
  /**
   * 1. "c"是点位的业务ID
   * 2. 对小车点位进行转换，如果接受到的电梯替换点就转换成地图原始点位
   */
  let currentCellId = vehicle.c ?? vehicle.currentCellId;
  currentCellId = getElevatorMapCellId(currentCellId);

  return {
    x: vehicle.x,
    y: vehicle.y,
    nx: vehicle.nx,
    ny: vehicle.ny,
    currentCellId,
    logicId: vehicle.lg ?? vehicle.logicId,
    navigationType: vehicle.bd ?? vehicle.navigationType,
    uniqueId: vehicle.rId,
    vehicleType: vehicle.rT,
    vehicleIcon: vehicle.ico,
    battery: vehicle.b ?? vehicle.battery,
    vehicleId: vehicle.r ?? vehicle.vehicleId,
    mainTain: vehicle.m ?? vehicle.maintain,
    manualMode: vehicle.mly ?? vehicle.manualMode,
    vehicleStatus: explainVehicleStatus(vehicle.s) ?? vehicle.vehicleStatus,
    currentDirection: vehicle.rD ?? vehicle.currentDirection,
    ncurrentDirection: vehicle.nRd ?? vehicle.currentDirection,
    loadId: vehicle.l ? getCurrentload(vehicle.l)?.loadId : vehicle.loadId,
    loadDirection: vehicle.l ? getCurrentload(vehicle.l)?.loadDirection : vehicle.loadDirection,
    longSide: vehicle.lS,
    shortSide: vehicle.sS,
    shelfs: vehicle.sf ?? vehicle.shelfs,
    toteCodes: vehicle.tc ?? vehicle.toteCodes, // 车身的料箱
    holdTote: vehicle.ht, // 抱夹的料箱
    sorterPod: vehicle.ro ?? '0,0',
    errorLevel: vehicle.e ?? 0,
  };
}

// 获取框选区域的相关世界信息
export function getSelectionWorldCoordinator(mapDOM, maskDOM, viewportEntity) {
  const x = maskDOM.offsetLeft;
  const y = maskDOM.offsetTop;
  const { width, height } = maskDOM.getBoundingClientRect();
  // 转换坐标
  const { x: rangeWorldStartX, y: rangeWorldStartY } = viewportEntity.toWorld(x, y);
  const { x: rangeWorldEndX, y: rangeWorldEndY } = viewportEntity.toWorld(x + width, y + height);
  return {
    width,
    height,
    worldStartX: parseInt(rangeWorldStartX),
    worldStartY: parseInt(rangeWorldStartY),
    worldEndX: parseInt(rangeWorldEndX),
    worldEndY: parseInt(rangeWorldEndY),
  };
}

/**
 * 注册监控地图Socket回调
 */
export function setMonitorSocketCallback(socketClient, mapContext, dispatch) {
  // 小车状态更新
  socketClient.registerVehicleStatus((data) => {
    data?.map((item) => {
      ///fock/slamLatent
      if (item.rT === 'sorter') {
        // 分拣车状态
        mapContext.updateSorterVehicle([item]);
      }

      if (item.rT === 'latent') {
        // 潜伏式车状态
        mapContext.updateLatentVehicle([item]);
      }

      if (item.rT === 'tote') {
        // 料箱车状态
        mapContext.updateToteVehicle([item]);
      }
    });
  });

  // 货架状态更新

  socketClient.registerLoadStatus((data) => {
    [data]?.map((item) => {
      // 潜伏式车状态
      if (item.lt === 'LOAD_TYPE_LatentJackingLoadType') {
        mapContext.refreshLatentPod(item);
      }
      // 料箱车状态
      if (item.lt === 'tote') {
        mapContext.updateToteState(item);
      }
    });
  });

  // 料箱车身上的货架状态
  socketClient.registerToteStatusCallback((toteStatus) => {
    mapContext.updateToteState(toteStatus);
  });

  // 充电桩状态
  socketClient.registerChargerStatusListener((state) => {
    mapContext.updateChargerState(state);
  });

  // 紧急停止区状态
  socketClient.registerEmergencyStopListener((estops) => {
    mapContext.renderEmergencyStopArea(estops ?? []);
  });

  // 潜伏货架到工作站
  socketClient.registerPodInStation((podInfo) => {
    dispatch({
      type: 'monitor/savePodToWorkStation',
      payload: podInfo,
    });
  });

  // 潜伏车自动任务状态
  socketClient.registerOpenAutoTask((autoTask) => {
    dispatch({
      type: 'monitor/fetchSaveSocketAutomaticTaskStatus',
      payload: JSON.parse(autoTask),
    });
  });

  // 潜伏车任务暂停事件
  socketClient.registerLatentLiftingPauseTaskEvent(() => {
    dispatch({ type: 'monitor/fetchLatentStopMessageList' });
  });
}

// 根据框选范围筛选地图元素
export function filterMapSpriteByRange(currentCells, _startX, _endX, _startY, _endY) {
  const currentLogicArea = getCurrentLogicAreaData();
  const currentRouteMap = getCurrentRouteMapData();
  const selections = [];

  // 点位
  const cellsInRange = currentCells.filter(
    (item) => item.x >= _startX && item.x <= _endX && item.y >= _startY && item.y <= _endY,
  );
  const cellIds = cellsInRange.map(({ id }) => id);
  const cellSelections = cellIds.map((id) => ({ id, type: MapSelectableSpriteType.CELL }));
  selections.push(...cellSelections);

  // 线条
  if (Array.isArray(currentRouteMap.relations)) {
    const costsSelections = currentRouteMap.relations
      .map(({ source, target, cost, type }) => {
        if (cellIds.includes(source) || cellIds.includes(target)) {
          return {
            type: MapSelectableSpriteType.ROUTE,
            id: `${source}-${target}`,
            cost,
            costType: type,
          };
        }
      })
      .filter(Boolean);
    selections.push(...costsSelections);
  }

  // 区域标记
  if (Array.isArray(currentLogicArea.zoneMarker)) {
    const zoneMarkerSelections = currentLogicArea.zoneMarker
      .filter(
        (item) => item.x >= _startX && item.x <= _endX && item.y >= _startY && item.y <= _endY,
      )
      .map(({ code }) => ({ id: code, type: MapSelectableSpriteType.ZONE }));
    selections.push(...zoneMarkerSelections);
  }

  // Label
  if (Array.isArray(currentLogicArea.labels)) {
    const labelsSelections = currentLogicArea.labels
      .filter(
        (item) => item.x >= _startX && item.x <= _endX && item.y >= _startY && item.y <= _endY,
      )
      .map(({ code }) => ({ id: code, type: MapSelectableSpriteType.LABEL }));
    selections.push(...labelsSelections);
  }

  // TODO: 充电桩、工作站、通用站点、电梯、投递点、交汇点

  return selections;
}

// 地图元素内部Label大小自适应
export function adaptLabelSize({ width, height }, labelSize, isRect) {
  let sizeBase = isRect ? 2 : 4;
  let textWidth, textHeight;

  function adjust() {
    if (width >= height) {
      textHeight = height / sizeBase;
      textWidth = (labelSize.width * textHeight) / labelSize.height;
    } else {
      textWidth = width / sizeBase;
      textHeight = (labelSize.height * textWidth) / labelSize.width;
    }
  }

  adjust();
  while (textWidth >= width - 100 || textHeight >= height - 100) {
    sizeBase += 0.1;
    adjust();
  }
  return [textWidth, textHeight];
}

/**
 * 顺序取值, 原理是基于reduce方法判断数组元素是否是顺序的，如果不是顺序的就是插值
 * @param cellIds {Array}
 */
export function getCellMapId(cellIds) {
  if (cellIds.length === 0) return 1;
  const sortedControlCellId = cellIds.sort((a, b) => a - b);
  let result;
  try {
    sortedControlCellId.reduce((pre, next) => {
      if (pre + 1 !== next) {
        result = pre + 1;
        throw new Error('found');
      } else {
        return next;
      }
    });
    return sortedControlCellId[sortedControlCellId.length - 1] + 1;
  } catch (e) {
    return result;
  }
}

///// ******************* 地图点位选择 ********************* /////
export function getCellSelections(namespace = 'editor') {
  const allCells = getCellsWithPosition(namespace);
  const types = allCells.map(({ brand }) => brand);
  return {
    cells: allCells,
    types: [...new Set(types)],
  };
}

// 获取选中的所有点位，包括重合的点位
export function getCellsWithPosition(namespace = 'editor') {
  const { mapContext, selections } = window.$$state()[namespace];
  const selectedCells = selections.filter((item) => item.type === MapSelectableSpriteType.CELL);
  const { xyCellMap } = mapContext;
  const allNaviCells = {};
  selectedCells.forEach(({ x, y }) => {
    const cells = xyCellMap.get(`${x}_${y}`);
    if (Array.isArray(cells)) {
      for (const cell of cells) {
        allNaviCells[cell.id] = cell;
      }
    }
  });
  return Object.values(allNaviCells);
}

export function getNavigationTypes(namespace = 'editor') {
  const types = getCellsWithPosition(namespace).map(({ navigationType }) => navigationType);
  return [...new Set(types)];
}

export function getArrowDistance(distance) {
  if (distance <= 1000) {
    return distance / 2;
  }
  return 500;
}

export function getLockCellBounds(dimension) {
  const { front, rear, left, right } = dimension;
  let width = right + left;
  let height = rear + front;
  return { width, height };
}
