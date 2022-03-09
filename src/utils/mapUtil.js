import * as PIXI from 'pixi.js';
import { LINE_SCALE_MODE, SmoothGraphics } from '@pixi/graphics-smooth';
import * as XLSX from 'xlsx';
import { find, groupBy, sortBy } from 'lodash';
import { LineArrow, LogicArea } from '@/entities';
import { formatMessage, isNull, isStrictNull, offsetByDirection } from '@/utils/util';
import {
  AGVState,
  CellSize,
  ToteAGVSize,
  SorterAGVSize,
  TaskPathColor,
  EStopStateColor,
  MapSelectableSpriteType,
} from '@/config/consts';
import {
  getAgvSelectBorderTexture,
  getCellHeatTexture,
  getEStopTexture,
  getIntersectionDirectionTexture,
  getQrCodeSelectBorderTexture,
  getRectLock,
  getTaskPathTexture,
} from '@/utils/textures';
import json from '../../package.json';

// 根据行列数批量生成点位
export function generateCellMapByRowsAndCols(
  rows,
  cols,
  firstID,
  firstPosition,
  distanceX,
  distanceY,
  start,
  end,
) {
  let id = firstID;
  const cells = [];
  for (let row = 0; row < rows; row++) {
    let innerY = firstPosition.y;
    innerY += row * distanceY;
    for (let col = 0; col < cols; col++) {
      let innerX = firstPosition.x;
      innerX += col * distanceX;
      if (parseInt(id, 10) >= start && parseInt(id, 10) <= end) {
        cells.push({ id, x: innerX, y: innerY });
        id += 1;
      }
    }
  }
  return cells;
}

export function getDistance(pos, pos2) {
  return Math.sqrt((pos.x - pos2.x) ** 2 + (pos.y - pos2.y) ** 2);
}

/**
 * 计算 p2点相对p1地点的角度，，也就是相对y轴正方向(标准数学坐标系)的顺时针角度
 * @param p1 from
 * @param p2 to
 * @returns {number}
 */
export function getAngle(p1, p2) {
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x); // 弧度 -0.6435011087932844, 即 2*Math.PI - 0.6435011087932844
  const theta = angle * (180 / Math.PI) + 90; // Math.atan2是按x轴的逆向角度，转换为按Y轴的正向角度
  if (theta < 0) {
    return 360 + theta;
  }
  return theta;
}

/**
 * 根据目标点、角度和距离计算坐标
 * @param {*} target 点对象
 * @param {*} angle 角度
 * @param {*} r 距离
 */
export function getCoordinat(target, angle, r) {
  const x = Math.floor(Math.cos(Math.PI * (angle / 180) - Math.PI / 2) * r) + target.x;
  const y = Math.floor(Math.sin(Math.PI * (angle / 180) - Math.PI / 2) * r) + target.y;
  return { x, y };
}

export function getLineJson(source, target, cost) {
  return {
    source: source.id,
    target: target.id,
    type: 'line',
    angle: getAngle(source, target),
    cost,
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
 * 获取当前线条的起始点坐标和角度
 * @param {*} relations
 * @param {*} beginCell
 * @param {*} endCell
 * @param {*} angle
 * @returns {{distance: number, length: number, fromX: number, fromY: number}}
 */
function getLineAnchor(relations, beginCell, endCell, angle) {
  let fromX;
  let fromY;
  let length;

  // 计算线条起点
  if (getHasOppositeDirection(relations, beginCell.id, endCell.id)) {
    fromX = (beginCell.x + endCell.x) / 2;
    fromY = (beginCell.y + endCell.y) / 2;
  } else {
    switch (angle) {
      case 0: {
        fromX = beginCell.x;
        fromY = beginCell.y - CellSize.height / 2;
        break;
      }
      case 90: {
        fromX = beginCell.x + CellSize.height / 2;
        fromY = beginCell.y;
        break;
      }
      case 180: {
        fromX = beginCell.x;
        fromY = beginCell.y + CellSize.width / 2;
        break;
      }
      case 270: {
        fromX = beginCell.x - CellSize.height / 2;
        fromY = beginCell.y;
        break;
      }
      default: {
        const data = getLineCorner(relations, beginCell, endCell, angle);
        fromX = data.x1;
        fromY = data.y1;
        break;
      }
    }
  }

  // 计算线条长度
  if ([0, 90, 180, 270].includes(angle)) {
    length = calculateCellDistance({ x: fromX, y: fromY }, endCell) - CellSize.height / 2;
  } else {
    length =
      calculateCellDistance({ x: fromX, y: fromY }, endCell) -
      Math.sqrt(CellSize.height ** 2 + CellSize.width ** 2) / 2;
  }

  const distance = calculateCellDistance(beginCell, endCell);
  return { fromX, fromY, length, distance };
}

/**
 * 获取线条实例
 * @param relations
 * @param beginCell
 * @param endCell
 * @param lineAngle
 * @param cost
 * @param select
 * @param ctrlSelect
 * @param refresh
 * @param mapMode
 * @returns {LineArrow}
 */
export function createRelation(
  relations,
  beginCell,
  endCell,
  lineAngle,
  cost,
  select,
  ctrlSelect,
  refresh,
  mapMode,
) {
  const interactive = !isNull(select) || !isNull(ctrlSelect);
  const { fromX, fromY, length, distance } = getLineAnchor(
    relations,
    beginCell,
    endCell,
    lineAngle,
  );
  return new LineArrow({
    id: `${beginCell.id}-${endCell.id}`,
    fromX,
    fromY,
    lineAngle,
    cost,
    length,
    distance,
    interactive,
    refresh,
    select,
    ctrlSelect,
    isClassic: mapMode === 'standard',
    mapMode: mapMode,
  });
}

/**
 * 根据所选的点位，和方向，优先级生成线
 * @param {*} targetPoints cellIds
 * @param {*} dir  方向
 * @param {*} value 优先级
 * @returns
 */
export function batchGenerateLine(targetPoints, dir, value) {
  const result = {};
  if (targetPoints.length > 2) {
    for (let index = 0; index < targetPoints.length; index++) {
      const element = targetPoints[index];
      for (let j = 0; j < targetPoints.length; j++) {
        const point = targetPoints[j];
        const key = `${element.id}-${dir}`; // 标记key值
        if (element.id === point.id) {
          continue;
        }
        if (getAngle(element, point) === dir) {
          if (result[key]) {
            const newDistance = getDistance(element, point);
            if (result[key].distance > newDistance) {
              result[key] = {
                source: element.id,
                target: point.id,
                type: 'line',
                angle: getAngle(element, point),
                cost: value,
                distance: newDistance,
              };
            }
          } else {
            const newDistance = getDistance(element, point);
            result[key] = {
              source: element.id,
              target: point.id,
              type: 'line',
              angle: getAngle(element, point),
              cost: value,
              distance: newDistance,
            };
          }
        }
      }
    }
    const endResult = {};
    Object.keys(result).map((key) => {
      const { source, target } = result[key];
      const newkey = `${source}-${target}`;
      endResult[newkey] = result[key];
    });
    return endResult;
  }
  if (targetPoints.length === 2) {
    if (dir === 0) {
      if (targetPoints[0].y > targetPoints[1].y) {
        const key = `${targetPoints[0].id}-${targetPoints[1].id}`;
        result[key] = getLineJson(targetPoints[0], targetPoints[1], value);
      } else if (targetPoints[0].y < targetPoints[1].y) {
        const key = `${targetPoints[1].id}-${targetPoints[0].id}`;
        result[key] = getLineJson(targetPoints[1], targetPoints[0], value);
      }
    } else if (dir === 90) {
      if (targetPoints[0].x > targetPoints[1].x) {
        const key = `${targetPoints[1].id}-${targetPoints[0].id}`;
        result[key] = getLineJson(targetPoints[1], targetPoints[0], value);
      } else if (targetPoints[0].x < targetPoints[1].x) {
        const key = `${targetPoints[0].id}-${targetPoints[1].id}`;
        result[key] = getLineJson(targetPoints[0], targetPoints[1], value);
      }
    } else if (dir === 180) {
      if (targetPoints[0].y > targetPoints[1].y) {
        const key = `${targetPoints[1].id}-${targetPoints[0].id}`;
        result[key] = getLineJson(targetPoints[1], targetPoints[0], value);
      } else if (targetPoints[0].y < targetPoints[1].y) {
        const key = `${targetPoints[0].id}-${targetPoints[1].id}`;
        result[key] = getLineJson(targetPoints[0], targetPoints[1], value);
      }
    } else {
      if (targetPoints[0].x < targetPoints[1].x) {
        const key = `${targetPoints[1].id}-${targetPoints[0].id}`;
        result[key] = getLineJson(targetPoints[1], targetPoints[0], value);
      } else if (targetPoints[0].x > targetPoints[1].x) {
        const key = `${targetPoints[0].id}-${targetPoints[1].id}`;
        result[key] = getLineJson(targetPoints[0], targetPoints[1], value);
      }
    }
  } else {
    return {};
  }
  return result;
}

export function countChargerCellWeight(array) {
  if (array.length === 0) {
    return 0;
  }
  let count = 0;
  if (array.includes('All')) {
    count += 1000;
  }
  if (array.includes('AGV-800')) {
    count += 100;
  }
  if (array.includes('TOTE')) {
    count += 10;
  }
  return count;
}

/**
 * 移动点位位置
 * @param {*} target 点位JSON数据
 * @param {*} distance 移动距离
 * @param {*} dir 移动方向
 * @returns 新增的点位JSON数据
 */
export function moveCell(target, distance, dir) {
  const result = { ...target };
  let flag = 1;
  if ([0, 3].includes(dir)) {
    flag = -1;
  }
  if ([0, 2].includes(dir)) {
    result.y = target.y + flag * distance;
  } else {
    result.x = target.x + flag * distance;
  }
  return result;
}

/**
 * 根据参数获取点位ID
 * @param cellMap
 * @param start
 * @param loopStep
 * @param step
 * @param way
 * @returns {[]|*}
 */
export function generateCellId(cellMap, start, loopStep, step, way) {
  let newId = start + loopStep.loop * step;
  if (way === 'subtract') {
    newId = start - loopStep.loop * step;
  }
  // 没找到就可以使用
  if (cellMap[newId] === undefined) {
    loopStep.loop += 1;
    return newId;
  }
  loopStep.loop += 1;
  return generateCellId(cellMap, start, loopStep, step);
}

/**
 * 无参数获取点位ID
 * @param cellMap
 * @param requiredCount
 * @returns {[]}
 */
export function generateCellIds(cellMap, requiredCount) {
  const cellId = [];
  let step = 1;
  for (let i = 0; i < requiredCount; i++) {
    while (cellMap[step] !== undefined || cellId.includes(step)) {
      step += 1;
    }
    cellId.push(step);
  }
  return cellId;
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

export function transformCurveData(lineData) {
  /**
   *  cost: 10
   *  type: "curve"
   *  source: primary
   *  target: third
   *  bparam1: secondary.x
   *  bparam2: secondary.y,
   *  angle:angle
   * */
  if (lineData.type === 'line') return lineData;
  const { type, cost, angle, primary, secondary, third } = lineData;
  return {
    cost,
    type,
    angle,
    source: primary,
    target: third,
    bparam1: secondary.x,
    bparam2: secondary.y,
  };
}

// ************************ 地图部分数据转换 ************************ //
export function renderCommonList(commonList, cellMap) {
  return commonList.map((record) => {
    const { stopCellId, x, y } = record;
    if (stopCellId) {
      const stopCell = cellMap[stopCellId];
      if (!isNull(stopCell)) {
        return {
          ...record,
          x: stopCell.x + x,
          y: stopCell.y + y,
        };
      }
      return record;
    }
    return record;
  });
}

export function renderWorkStationList(workstationList, cellMap) {
  return workstationList.map((record) => {
    const { stopCellId, angle, offset } = record;
    if (!isStrictNull(stopCellId) && !isStrictNull(angle)) {
      const stopCell = cellMap[stopCellId];
      if (!isNull(stopCell)) {
        const { x, y } = getCoordinat({ x: stopCell.x, y: stopCell.y }, angle, offset || 1900);
        return { ...record, x, y };
      }
      return record;
    }
    return record;
  });
}

export function renderChargerList(chargerList, cellMap) {
  return chargerList
    .map((record) => {
      if (!record) return null;
      const { chargingCells, angle } = record;
      if (isNull(chargingCells) || isNull(angle)) return null;
      if (Array.isArray(chargingCells)) {
        const result = [];
        for (let index = 0; index < chargingCells.length; index++) {
          const element = chargingCells[index];
          if (element && element.cellId) {
            const agvTypes = element.agvTypes || [];
            result.push({
              agvTypes,
              cellId: element.cellId,
              zIndex: countChargerCellWeight(agvTypes || []),
            });
          }
        }
        if (result.length > 0) {
          const { cellId, agvTypes } = sortBy(result, 'zIndex')[result.length - 1];
          if (cellMap[cellId]) {
            let distance = 850;
            if (agvTypes.includes('All') || agvTypes.includes('AGV800')) {
              distance = 650;
            }
            const { x, y } = getCoordinat(cellMap[cellId], angle, distance);
            return { ...record, x, y };
          }
        }
        return null;
      }
      return null;
    })
    .filter(Boolean);
}

export function renderElevatorList(elevatorList) {
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

export function getLogicCellMap(record, ele, currentLogic) {
  let innerMappings = {};
  for (let index = 0; index < ele.length; index++) {
    const element = ele[index];
    const { logicLocations } = element;

    if (logicLocations && logicLocations[currentLogic.id]?.innerMapping) {
      innerMappings = {
        ...innerMappings,
        ...logicLocations[currentLogic.id].innerMapping,
      };
    }
  }
  return generateLogicCellMap(record, innerMappings);
}

export function mergeStorageRack(storageRack) {
  const { angle, virtualStorages } = storageRack;
  const result = { angle, columns: [] };
  const group = groupBy(
    virtualStorages,
    (storage) => `${storage.coordinate.x}_${storage.coordinate.y}`,
  );
  Object.values(group).forEach((value) => {
    result.columns.push({
      x: value[0].coordinate.x,
      y: value[0].coordinate.y,
      cellId: value[0].storageCellId,
      disabled: value[0].disabled,
      code: value[0].storageBaseCode.slice(0, 8),
      width: value[0].size.width,
      height: value[0].size.depth,
    });
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

export function getTunnelGateCells(entrance, exit) {
  const gateSet = new Set();
  entrance.forEach((item) => {
    const [source] = item.split('-');
    gateSet.add(source);
  });
  exit.forEach((item) => {
    const [, target] = item.split('-');
    gateSet.add(target);
  });
  return [...gateSet];
}

export function formatTunnelStateDataSource(targetCunnelName, response) {
  const result = [];
  const tunnels = Object.values(response);
  tunnels.forEach(({ tunnelName, in: entrance, out: exit, lockOn, lockOnRobot }) => {
    if (tunnelName !== targetCunnelName) return;
    const resultItem = { tunnelName, in: [], out: [] };
    if (lockOn && lockOnRobot != null) {
      // 如果通道被锁，那么只需要简单显示该小车ID即可，不需要显示对应的入口或者出口
      resultItem.in.push(lockOnRobot);
      resultItem.out.push(lockOnRobot);
    } else {
      Object.keys(entrance).forEach((item) => {
        resultItem.in.push({
          code: item, // 入口或者出口ID
          agvs: entrance[item],
        });
      });
      Object.keys(exit).forEach((item) => {
        resultItem.out.push({
          code: item,
          agvs: exit[item],
        });
      });
    }

    if (resultItem.in.length > 0 || resultItem.out.length > 0) {
      result.push(resultItem);
    }
  });
  return result;
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

export function calculateCellDistance(cell1, cell2) {
  if (cell1.x === cell2.x) {
    return Math.abs(cell1.y - cell2.y);
  }
  if (cell1.y === cell2.y) {
    return Math.abs(cell1.x - cell2.x);
  }

  return Number.parseInt(Math.sqrt((cell1.x - cell2.x) ** 2 + (cell1.y - cell2.y) ** 2), 10);
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
  const currentRouteMapData = getCurrentRouteMapData();
  let relations = [...(currentRouteMapData.relations || [])];
  // 1. 删除相关曲线
  relations = relations.filter((item) => {
    if (item.type === 'line') return true;
    if (item.type === 'curve') {
      if (cellIds.includes(`${item.source}`) || cellIds.includes(`${item.target}`)) {
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
    if (cellIds.includes(`${item.source}`) || cellIds.includes(`${item.target}`)) {
      result.line.delete.push(item);
      relationsWillUpdate.push(item);
    } else {
      newRelations.push(item);
    }
  });

  // 重新计算 Distance
  relationsWillUpdate = relationsWillUpdate.map((relation) => {
    const { source, target } = relation;
    const newDistance = calculateCellDistance(newCellMap[source], newCellMap[target]);
    const angle = getAngle(newCellMap[source], newCellMap[target]);
    return { ...relation, angle, distance: newDistance };
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

export function getCurveMapKey(lineData) {
  return `${lineData.source}_${lineData.target}_${lineData.bparam1}_${lineData.bparam2}`;
}

export function getCurveString(lineData) {
  return `${lineData.source}_${lineData.target}_${lineData.bparam1}_${lineData.bparam2}`;
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
    newDumpStation.agvDirection = currentDumpStation.agvDirection;

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
  return currentCellId;
}

/**
 * 根据起点和终点获取线条数据
 * @param {*} idLineMap
 * @param {*} source
 * @param {*} target
 * @returns
 */
export function getLineEntityFromMap(idLineMap, source, target) {
  let line = null;
  Object.keys(idLineMap).forEach((cost) => {
    const lineMaps = idLineMap[cost];
    const key = `${source}-${target}`;
    if (lineMaps.has(key)) {
      line = lineMaps.get(key);
    }
  });
  return line;
}

/**
 * 根据线条ID从Map对象获取线条数据
 * @param {*} lineId
 * @param {*} idLineMap
 * @returns
 */
export function getLineFromIdLineMap(lineId, idLineMap) {
  const keys = Object.keys(idLineMap);
  let result = [];
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const map = idLineMap[key];
    const line = map.get(lineId);
    if (line) {
      result = [key, line]; // [cost, LineEntity]
      break;
    }
  }
  return result;
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

export function switchAGVState(key, carState) {
  const state = [];
  switch (carState) {
    case AGVState.working:
      state.push(`${key}_agv_green`);
      state.push('on_task');
      break;
    case AGVState.offline:
      state.push(`${key}_agv_grey`);
      state.push('offline');
      break;
    case AGVState.connecting:
      state.push(`${key}_agv_grey`);
      state.push('offline');
      break;
    case AGVState.waiting:
      state.push(`${key}_agv_purple`);
      state.push('waiting');
      break;
    case AGVState.standBy:
      state.push(`${key}_agv`);
      state.push('stand_by');
      break;
    case AGVState.charging:
      state.push(`${key}_agv_yellow`);
      state.push('charging');
      break;
    case AGVState.error:
      state.push(`${key}_agv_red`);
      state.push('error');
      break;
    default:
      break;
  }
  return state;
}

export function switchAGVBatteryState(battery) {
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

export function explainAgvStatus(value) {
  const mapping = {
    '-1': AGVState.offline,
    0: AGVState.standBy,
    1: AGVState.working,
    2: AGVState.charging,
    3: AGVState.error,
    4: AGVState.offline,
    5: AGVState.waiting,
  };
  return mapping[value];
}

export function unifyAgvState(agv) {
  // 对小车点位进行转换，如果接受到的电梯替换点就转换成地图原始点位
  let currentCellId = agv.c ?? agv.currentCellId;
  currentCellId = getElevatorMapCellId(currentCellId);

  return {
    x: agv.x,
    y: agv.y,
    currentCellId,
    battery: agv.b ?? agv.battery,
    robotId: agv.r ?? agv.robotId,
    mainTain: agv.m ?? agv.maintain,
    manualMode: agv.mly ?? agv.manualMode,
    agvStatus: explainAgvStatus(agv.s) ?? agv.agvStatus,
    currentDirection: agv.rD ?? agv.currentDirection,
    podId: agv.p ?? agv.podId,
    podDirection: agv.pD ?? agv.podDirection,
    hasPod: agv.hp,
    longSide: agv.lS,
    shortSide: agv.sS,
    shelfs: agv.sf ?? agv.shelfs,
    toteCodes: agv.tc ?? agv.toteCodes, // 车身的料箱
    holdTote: agv.ht, // 抱夹的料箱
    sorterPod: agv.ro ?? '0,0',
    errorLevel: agv.e ?? 0,
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
  // 潜伏式车状态
  socketClient.registerLatentAGVStatus((allAgvStatus) => {
    mapContext.updateLatentAGV(allAgvStatus);
  });

  // 潜伏式货架状态
  socketClient.registerLatentPodStatus((podStatus) => {
    mapContext.refreshLatentPod(podStatus);
  });

  // 料箱车状态
  socketClient.registerToteAGVStatus((toteAGVStatus) => {
    mapContext.updateToteAGV(toteAGVStatus);
  });

  // 料箱车身上的货架状态
  socketClient.registerToteStatusCallback((toteStatus) => {
    mapContext.updateToteState(toteStatus);
  });

  // 分拣车状态
  socketClient.registerSorterAGVStatus((sorterStatus) => {
    mapContext.updateSorterAGV(sorterStatus);
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
    dispatch({ type: 'monitor/fetchLatentSopMessageList' });
  });
}

// 加载编辑器额外的自定义Texture
export function loadEditorExtraTextures(renderer) {
  return new Promise((resolve) => {
    // 点位选中的Texture
    PIXI.Texture.addToCache(
      getQrCodeSelectBorderTexture(renderer, true),
      'cellSelectBorderTexture',
    );

    // 交汇点
    PIXI.Texture.addToCache(getIntersectionDirectionTexture(renderer), 'intersectionDirection');

    // 急停区
    PIXI.Texture.addToCache(getEStopTexture(EStopStateColor.inactive.fillColor), '_EStopInactive');
    PIXI.Texture.addToCache(
      getEStopTexture(EStopStateColor.active.safe.fillColor),
      '_EStopActiveSafe',
    );
    PIXI.Texture.addToCache(
      getEStopTexture(EStopStateColor.active.unSafe.fillColor),
      '_EStopActiveUnsafe',
    );
    resolve();
  });
}

// 加载监控额外的自定义Texture
export function loadMonitorExtraTextures(renderer) {
  return new Promise((resolve) => {
    // 背景
    PIXI.Texture.addToCache(getAgvSelectBorderTexture(), 'agvSelectBorderTexture');

    // 交汇点
    PIXI.Texture.addToCache(getIntersectionDirectionTexture(renderer), 'intersectionDirection');

    // 任务路径
    PIXI.Texture.addToCache(getTaskPathTexture(TaskPathColor.passed), '_passedTaskPath');
    PIXI.Texture.addToCache(getTaskPathTexture(TaskPathColor.locked), '_lockedTaskPath');
    PIXI.Texture.addToCache(getTaskPathTexture(TaskPathColor.future), '_futureTaskPath');

    // 小车锁格
    PIXI.Texture.addToCache(getRectLock(1050, 1050), 'LatentRectLock');
    PIXI.Texture.addToCache(getRectLock(ToteAGVSize.width, ToteAGVSize.height), 'ToteRectLock');
    PIXI.Texture.addToCache(
      getRectLock(SorterAGVSize.width, SorterAGVSize.height),
      'SorterRectLock',
    );

    // 点位成本热度
    PIXI.Texture.addToCache(getCellHeatTexture('0x3366FF'), '_cellHeat1');
    PIXI.Texture.addToCache(getCellHeatTexture('0x5984C3'), '_cellHeat2');
    PIXI.Texture.addToCache(getCellHeatTexture('0x7FA387'), '_cellHeat3');
    PIXI.Texture.addToCache(getCellHeatTexture('0xA5C14B'), '_cellHeat4');
    PIXI.Texture.addToCache(getCellHeatTexture('0xC9D04B'), '_cellHeat5');
    PIXI.Texture.addToCache(getCellHeatTexture('0xEEE04B'), '_cellHeat6');
    PIXI.Texture.addToCache(getCellHeatTexture('0xF4B042'), '_cellHeat7');
    PIXI.Texture.addToCache(getCellHeatTexture('0xF87636'), '_cellHeat8');
    PIXI.Texture.addToCache(getCellHeatTexture('0xF03C2B'), '_cellHeat9');
    PIXI.Texture.addToCache(getCellHeatTexture('0xCF2723'), '_cellHeat10');

    // 急停区
    PIXI.Texture.addToCache(getEStopTexture(EStopStateColor.inactive.fillColor), '_EStopInactive');
    PIXI.Texture.addToCache(
      getEStopTexture(EStopStateColor.active.safe.fillColor),
      '_EStopActiveSafe',
    );
    PIXI.Texture.addToCache(
      getEStopTexture(EStopStateColor.active.unSafe.fillColor),
      '_EStopActiveUnsafe',
    );

    resolve();
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
