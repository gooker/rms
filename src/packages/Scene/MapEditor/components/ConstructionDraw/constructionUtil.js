import { uniq, sortBy, split } from 'lodash';
import XLSX from 'xlsx';
import { Parser } from 'json2csv';
import { isStrictNull, formatMessage } from '@/utils/util';

// 距离线段 样式
export const styleDistance = {
  stroke: '#000', // 描边颜色，默认null
  lineWidth: 1, // 线宽， 默认1
  textFill: '#32373a',
  textAlign: 'center',
  fontWeight: 700,
  fontSize: 12,
};

export const getAllallCellsMap = (
  showBlockedallCellsFlag,
  cellMap,
  elevatorList,
  currentRouteMapData,
  currentLogicArea,
) => {
  // 配置选项是不带不可走点 要提前过滤
  let newCellMap = {};
  const blockCellIds = currentRouteMapData?.blockCellIds || []; // 不可走点
  if (showBlockedallCellsFlag) {
    Object.keys(cellMap).forEach((id) => {
      const currentItem = cellMap[id];
      if (!blockCellIds.includes(currentItem.id)) {
        newCellMap[currentItem.id] = currentItem;
      }
    });
  } else {
    newCellMap = { ...cellMap };
  }

  const { rangeStart, rangeEnd } = currentLogicArea;
  Object.keys(newCellMap).forEach((cellIdStr) => {
    const { id } = newCellMap[cellIdStr];
    if (id < rangeStart || id > rangeEnd) {
      delete newCellMap[cellIdStr];
    }
  });

  const currentCellMap = { ...newCellMap };
  // 2.如果存在电梯点的话 要把点位 替换成当前的电梯代号
  const logicId = currentLogicArea.id;
  const elevatorId = [];
  if (elevatorList && elevatorList.length > 0) {
    Object.values(newCellMap).forEach((value) => {
      elevatorList.forEach((record) => {
        const { innerCellId, logicLocations } = record;
        if (currentCellMap[innerCellId[0]]) {
          delete currentCellMap[innerCellId[0]]; // 注意: 把电梯点位 在该位置删除了
        }

        if (
          logicLocations &&
          logicLocations[logicId] &&
          logicLocations[logicId].innerMapping &&
          value.id === Number(logicLocations[logicId].innerMapping[innerCellId])
        ) {
          currentCellMap[value.id] = { ...value, id: Number(innerCellId[0]) };
          elevatorId.push(Number(innerCellId[0]));
        }
      });
    });
  }

  const elementNum = getCellInfo(newCellMap);
  return { elementNum, currentCellMap, elevatorId };
};

export const getCellInfo = (allCells) => {
  if (allCells && Object.keys(allCells).length > 0) {
    // Sort all points x & y
    const uniqueXs = uniq(
      Object.keys(allCells)
        .map((id) => allCells[id])
        .map((cell) => cell.x),
    );
    const Xs = sortBy(uniqueXs, (x) => x);

    const uniqueYs = uniq(
      Object.keys(allCells)
        .map((id) => allCells[id])
        .map((cell) => cell.y),
    );
    const Ys = sortBy(uniqueYs, (y) => y);

    const length = Object.keys(allCells).length;

    const minX = Xs[0];
    const minY = Ys[0];
    const maxX = Xs[Xs.length - 1];
    const maxY = Ys[Ys.length - 1];

    const elementsWidth = maxX - minX + 100;
    const elementsHeight = maxY - minY + 100;

    return { elementsWidth, elementsHeight, minX, minY, length };
  }
};

export const exportCells = (currentRouteMapData, currentLogicArea, cellMap) => {
  const { rangeStart, rangeEnd } = currentLogicArea;
  const blockCellIds = currentRouteMapData.blockCellIds || []; // 不可走点
  const currentCellsMap = { ...cellMap };
  Object.keys(currentCellsMap).forEach((cellIdStr) => {
    const { id } = currentCellsMap[cellIdStr];
    if (id < rangeStart || id > rangeEnd) {
      delete currentCellsMap[cellIdStr];
    }
  });
  const uniqueXs = uniq(Object.keys(currentCellsMap).map((id) => currentCellsMap[id]));
  uniqueXs.forEach((item, index) => {
    if (isStrictNull(item)) return;
    if (blockCellIds.includes(item.id)) {
      uniqueXs[index] = { ...item, blockedStatus: formatMessage({ id: 'app.common.true' }) };
    } else {
      uniqueXs[index] = { ...item, blockedStatus: formatMessage({ id: 'app.common.false' }) };
    }
  });
  const sortIds = sortBy(uniqueXs, (id) => id);
  const fields = [
    {
      label: formatMessage({ id: 'app.monitorOperation.cell' }),
      value: 'id',
    },
    {
      label: 'x',
      value: 'x',
    },
    {
      label: 'y',
      value: 'y',
    },
    {
      label: formatMessage({ id: 'app.constructiondrawing.blockedStatus' }),
      value: 'blockedStatus',
    },
  ];

  const opts = { fields };
  const parser = new Parser(opts);
  const data = parser.parse(sortIds);
  const splitString = '\n';
  const arrayCSV = split(data, splitString).map((record) => {
    return split(record, ',').map((obj) => {
      return obj.replace(/"/g, '');
    });
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(arrayCSV);
  XLSX.utils.book_append_sheet(wb, ws, 'cells');
  XLSX.writeFile(wb, `${formatMessage({ id: 'app.constructiondrawing.codeData' })}.xlsx`);
};
