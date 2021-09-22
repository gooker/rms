import intl from 'react-intl-universal';
import * as XLSX from 'xlsx';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import LogicArea from '@/pages/MapTool/entities/LogicArea';
import { isNull, isStrictNull } from '@/utils/utils';
import json from '../../package.json';

// 根据行列数批量生成点位
export function generateCellMapByRowsAndCols(
  rows,
  cols,
  firtID,
  firtPostion,
  distanceX,
  distanceY,
  start,
  end,
  currentLogicId,
) {
  let id = firtID;
  const cells = [];
  for (let row = 0; row < rows; row++) {
    let innerY = firtPostion.y;
    innerY += row * distanceY;
    for (let col = 0; col < cols; col++) {
      let innerX = firtPostion.x;
      innerX += col * distanceX;
      // 当前没有传入id或者极端的id值不在当前的逻辑视图内不会赋值
      if (id !== null && parseInt(id, 10) < end && !(parseInt(id, 10) < start)) {
        cells.push({
          id,
          x: innerX,
          y: innerY,
        });
      } else {
        const tempId = `L${currentLogicId}X${innerX}Y${innerY}`;
        cells.push({
          tempId,
          x: innerX,
          y: innerY,
        });
      }
      id += 1;
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

export function renderWorkstaionlist(workstationList, cellMap) {
  return workstationList.map((record) => {
    const { stopCellId, angle, offset } = record;
    if (!isStrictNull(stopCellId) && !isStrictNull(angle)) {
      const stopCell = cellMap[stopCellId];
      if (!isNull(stopCell)) {
        const { x, y } = getCoordinat({ x: stopCell.x, y: stopCell.y }, angle, offset || 1900);
        return {
          ...record,
          x,
          y,
        };
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
      reject(intl.formatMessage({ id: 'app.editor.cad.onerror' }));
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
        reject(intl.formatMessage({ id: 'app.editor.cad.nameColumnError' }, { name: '名称' }));
      }
      const qrRow = dataRow.filter((row) => row[nameIndex] === 'STD QR CODE');
      if (qrRow.length === 0) {
        reject(intl.formatMessage({ id: 'app.editor.cad.noQrRow' }, { qr: 'STD QR CODE' }));
      }

      // 组装临时点位
      const xIndex = titleRow.indexOf('位置 X');
      if (xIndex === -1) {
        reject(intl.formatMessage({ id: 'app.editor.cad.xColumnError' }, { x: '位置 X' }));
      }
      const yIndex = titleRow.indexOf('位置 Y');
      if (yIndex === -1) {
        reject(intl.formatMessage({ id: 'app.editor.cad.yColumnError' }, { y: '位置 Y' }));
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
          name: intl.formatMessage({ id: 'app.models.default' }),
          desc: intl.formatMessage({ id: 'app.models.description' }),
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
  // monitor
  const dvaStore = window.g_app._store.getState();
  const namespaceState = dvaStore[namespace];
  const { currentMap, currentLogicArea } = namespaceState;
  const currentLogicAreaData = find(currentMap?.logicAreaList || [], { id: currentLogicArea });
  return currentLogicAreaData;
}

export function getCurrentRouteMapData(namespace = 'editor') {
  const dvaSore = window.g_app._store.getState();
  const namespaceState = dvaSore[namespace];
  const { currentRouteMap } = namespaceState;
  const currentLogicAreaData = getCurrentLogicAreaData(namespace);
  if (currentLogicAreaData) {
    return currentLogicAreaData.routeMap?.[currentRouteMap];
  }
  return null;
}

export function getDispatchFromGlobal() {
  return window.g_app._store.dispatch;
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
