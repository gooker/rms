import React from 'react';
import * as PIXI from 'pixi.js';
import { sortBy, uniq } from 'lodash';
import {
  getCoordinat,
  getLineGraphics,
  getLineEntityFromMap,
  getCurrentRouteMapData,
  getTextureFromResources,
} from '@/utils/mapUtil';
import {
  Dump,
  Charger,
  BitText,
  Elevator,
  DumpBasket,
  WorkStation,
  Intersection,
  EmergencyStop,
  CommonFunction,
} from '@/entities';
import { isNull, isItemOfArray, dealResponse } from '@/utils/util';
import MapZoneMarker from '@/entities/MapZoneMarker';
import MapLabelMarker from '@/entities/MapLabelMarker';

import {
  CellSize,
  MapSelectableSpriteType,
  WorldScreenRatio,
  zIndex,
  ZoneMarkerType,
} from '@/config/consts';

const AllPriorities = [10, 20, 100, 1000];

function initState(context) {
  context.idCellMap = new Map(); // {cellId: [CellEntity]}
  context.idLineMap = { 10: new Map(), 20: new Map(), 100: new Map(), 1000: new Map() }; //  { cost: new Map({[startCellID-endCellID]: [LineEntity]})}
  context.workStationMap = new Map(); // {stopCellId: [Entity]}
  context.elevatorMap = new Map(); // {[x${x}y${y}]: [Entity]}
  context.intersectionMap = new Map(); // {stopCellId: [Entity]}
  context.commonFunctionMap = new Map(); // {stopCellId: [Entity]}
  context.chargerMap = new Map(); // {[x${x}y${y}]: [Entity]}
  context.dumpMap = new Map(); // 抛物点
  context.dumpBasketMap = new Map(); // 抛物框
  context.relationshipLines = new Map(); // 关系线
  context.backImgMap = new Map(); // 背景图片
  context.fixedEStopMap = new Map(); // 固定紧急避让区
  context.labelMap = new Map(); // 标签
  context.zoneMap = new Map(); // 区域标记
}

export default class BaseMap extends React.Component {
  constructor(props) {
    super(props);
    initState(this);
  }

  refresh = () => {
    this.pixiUtils.callRender();
  };

  resize = (width, height) => {
    this.pixiUtils.renderer.resize(width, height);
    this.pixiUtils.viewport.resize(width, height);
    this.pixiUtils.viewport.fitWorld();
    this.pixiUtils.callRender();
  };

  moveTo = (x, y, scaled) => {
    this.pixiUtils.viewport.moveCenter(x, y);
    if (scaled) {
      this.pixiUtils.viewport.scaled = scaled;
    }
  };

  positionCell = (cellId) => {
    const cellEntity = this.idCellMap.get(cellId);
    if (cellEntity) {
      this.moveTo(cellEntity.x, cellEntity.y, 0.7);
      this.refresh();
      return true;
    } else {
      return false;
    }
  };

  centerView = () => {
    const { viewport } = this.pixiUtils;
    const { x, y, width, height } = viewport.getLocalBounds();
    if (viewport.worldWidth !== 0 && viewport.worldHeight !== 0) {
      viewport.fit(true, width * 1.1, height * 1.1);
      viewport.moveCenter(x + width / 2, y + height / 2);

      // 动态限制地图缩放尺寸
      viewport.clampZoom({
        minWidth: viewport.worldScreenWidth * viewport.scale.x,
        minHeight: viewport.worldScreenHeight * viewport.scale.y,
        maxWidth: viewport.worldScreenWidth,
        maxHeight: viewport.worldScreenHeight,
      });
    }
    // 记录当前地图世界宽度
    window.sessionStorage.setItem('EDITOR_MAP', JSON.stringify({ x, y, width, height }));
    this.refresh();
  };

  // 清空 Stage 所有元素
  clearMapStage = () => {
    this.pixiUtils.viewportRemoveChildren();
    initState(this);
  };

  // 地图点位坐标显示
  switchCoordinationShown = (flag) => {
    this.states.showCoordinate = flag;
    this.idCellMap.forEach((cell) => {
      cell.switchCoordinationShown(flag);
    });
    this.refresh();
  };

  // 切换是否显示优先级距离
  switchDistanceShown = (flag) => {
    this.states.showDistance = flag;
    Object.values(this.idLineMap).forEach((innerMap) => {
      innerMap.forEach((line) => {
        if (line.type === 'line') {
          line.switchDistanceShown(flag);
        }
      });
    });
    this.refresh();
  };

  // 背景图片显示
  switchBackImgShown = (flag) => {
    this.states.showBackImg = flag;
    this.backImgMap.forEach(function (value) {
      value.switchBackImgEntityShown(flag);
    });
    this.refresh();
  };

  // 切换急停区显示
  switchEmergencyStopShown = (flag) => {
    this.states.showEmergencyStop = flag;
    this.fixedEStopMap.forEach(function (eStop) {
      eStop.switchEStopsVisible(flag);
    });
    this.refresh();
  };

  /**
   * 批量切换元素选中状态
   * @param flag 是否选中
   * @param type 元素类型
   * @param list 同类型元素数据列表
   */
  switchSpriteSelected = (flag, type, list) => {
    let dataMap;
    switch (type) {
      case MapSelectableSpriteType.CELL:
        dataMap = this.idCellMap;
        break;
      case MapSelectableSpriteType.ROUTE:
        dataMap = this.idLineMap;
        break;
      case MapSelectableSpriteType.ZONE:
        dataMap = this.zoneMap;
        break;
      case MapSelectableSpriteType.LABEL:
        dataMap = this.labelMap;
        break;
      default:
        dataMap = null;
    }
    if (isNull(dataMap)) return;
    list.forEach(({ id, type, cost }) => {
      let spriteEntity;
      if (type === MapSelectableSpriteType.ROUTE) {
        spriteEntity = dataMap[cost].get(id);
      } else if (type === MapSelectableSpriteType.CELL) {
        spriteEntity = dataMap.get(parseInt(id));
      } else {
        spriteEntity = dataMap.get(id);
      }
      if (spriteEntity) {
        flag ? spriteEntity?.onSelect() : spriteEntity?.onUnSelect();
      }
    });
  };

  // 清空并销毁所有优先级线条
  destroyAllLines = () => {
    Object.values(this.idLineMap).forEach((lineMap) => {
      lineMap.forEach((line) => {
        line.parent && line.parent.removeChild(line);
        line.destroy({ children: true });
      });
      lineMap.clear();
    });
  };

  // 渲染地图点位类型 (新增 & 删除)
  renderCellsType = (cells = [], type, opt = 'add') => {
    cells.forEach((cellId) => {
      const cellEntity = this.idCellMap.get(cellId);
      if (cellEntity) {
        opt === 'add' && cellEntity.plusType(type, getTextureFromResources(type));
        opt === 'remove' && cellEntity.removeType(type);
      }
    });
  };

  // 渲染休息点
  renderRestCells = (rest, opt = 'add') => {
    if (Array.isArray(rest?.cellIds)) {
      rest.cellIds.forEach((cell) => {
        const cellEntity = this.idCellMap.get(cell);
        if (cellEntity) {
          opt === 'add' && cellEntity.plusType('rest_cell', getTextureFromResources('rest_cell'));
          opt === 'remove' && cellEntity.removeType('rest_cell');
        }
      });
    }
  };

  // 渲染不可逗留点
  renderNonStopCells = (cells, opt = 'add') => {
    const type = 'non_stop';
    const cellIds = cells.map((item) => item.nonStopCell);

    cellIds.forEach((cellId) => {
      const cellEntity = this.idCellMap.get(cellId);
      if (cellEntity) {
        opt === 'add' && cellEntity.plusType(type, getTextureFromResources(type));
        opt === 'remove' && cellEntity.removeType(type);
      }
    });
    cells.forEach((item) => {
      item.cellIds.forEach((cellId) => {
        this.renderLineSpecialFlag(
          opt === 'add',
          `${item.nonStopCell}-${cellId}`,
          type,
          '$nonStop',
          'S',
        );
      });
    });
  };

  // ************************ 线条相关 **********************
  /**
   * 绘制线条核心逻辑
   * @param {*} relationsToRender 即将渲染的线条数据
   * @param {*} relations 已渲染的线条数据
   * @param {*} shownPriority 当前展示的成本类型
   * @param {*} interactive 是否可交互  默认false
   * @param {*} shownMode 显示模式  默认standard
   */
  renderCostLines(
    relationsToRender,
    relations,
    interactive = false,
    shownMode = 'standard',
    shownPriority,
  ) {
    const priority = shownPriority || this.states.shownPriority;
    relationsToRender.forEach((lineData) => {
      const { type, cost } = lineData;
      if (!priority.includes(parseInt(cost))) return;
      if (type === 'line') {
        const { source, target, angle } = lineData;
        const sourceCell = this.idCellMap.get(source);
        const targetCell = this.idCellMap.get(target);
        // 此时 sourceCell 和 targetCell 可能是电梯点
        if (sourceCell && targetCell) {
          const line = getLineGraphics(
            relations,
            sourceCell,
            targetCell,
            angle,
            cost,
            interactive ? this.selectLine : null,
            interactive ? this.ctrlSelectLine : null,
            interactive ? this.refresh : null,
            shownMode,
          );
          if (line) {
            line.switchDistanceShown(this.states.showDistance);
            this.pixiUtils.viewportAddChild(line);
            this.idLineMap[cost].set(`${source}-${target}`, line);
          }
        }
      }
    });
  }

  /**
   * 筛选线条
   * @param {*} uiFilterData 筛选结果 e.g. [10,20,100,1000]
   * @param {*} nameSpace 数据模块，默认editor
   */
  filterRelations(uiFilterData, nameSpace = 'editor') {
    this.states.shownPriority = uiFilterData;
    const currentRouteMapData = getCurrentRouteMapData(nameSpace);
    const relations = currentRouteMapData.relations ?? [];
    if (relations.length === 0) return;

    const nonStopCellIds = currentRouteMapData.nonStopCellIds ?? [];
    // 把需要隐藏优先级线条透明度置0
    const hiddenCosts = AllPriorities.filter((item) => !uiFilterData.includes(item));
    hiddenCosts.forEach((cost) => {
      const idLineMap = this.idLineMap[cost];
      if (idLineMap instanceof Map) {
        idLineMap.forEach((line) => {
          line.switchShown(false);
        });
      }
    });
    // 如果指定优先级已经被渲染就修改透明度；如果没有渲染就放到数组中待渲染
    const priorityToRender = [];
    uiFilterData.forEach((cost) => {
      // 首先从 this.idLineMap 中获取该优先级的线段是否显示
      const specificCostLinesMap = this.idLineMap[cost];
      if (!(specificCostLinesMap instanceof Map) || specificCostLinesMap.size === 0) {
        priorityToRender.push(cost);
      } else {
        // 说明该优先级的线段已经渲染过，直接设置透明度
        specificCostLinesMap.forEach((line) => {
          line.switchShown(true);
        });
      }
    });
    // 根据最新数据渲染线段
    if (priorityToRender.length > 0) {
      this.renderCostLines(
        relations,
        relations,
        nameSpace === 'editor',
        'standard',
        priorityToRender,
      ); // TODO: 目前只针对编辑器可点击
      // 渲染不可逗留点Flag
      if (nonStopCellIds) {
        nonStopCellIds.forEach((item) => {
          item.cellIds.forEach((cellId) => {
            this.renderLineSpecialFlag(
              true,
              `${item.nonStopCell}-${cellId}`,
              'non_stop',
              '$nonStop',
              'S',
            );
          });
        });
      }
    }
    nameSpace === 'editor' && this.pipeSwitchLinesShown();
  }

  pipeSwitchLinesShown = () => {
    const { blockCellIds } = getCurrentRouteMapData();
    const { hideBlock, shownPriority, shownRelationDir, shownRelationCell } = this.states;
    Object.values(this.idLineMap).forEach((innerMap) => {
      innerMap.forEach((line) => {
        if (line.type === 'line') {
          const { id, cost, dir } = line;
          const [source, target] = id.split('-');
          // 是否在显示的优先级Cost范围内
          const priorityCostFlag = shownPriority.includes(cost);
          // 是否在显示的优先级方向范围内
          const priorityDirFlag = shownRelationDir.includes(parseInt(dir));
          // 是否是不可走点的线条 & 没有隐藏显示不可走点
          const isBlockLines = isItemOfArray(
            blockCellIds ?? [],
            [source, target].map((item) => parseInt(item)),
          );
          const blockCellFlag = isBlockLines ? !hideBlock : true;
          // 是否是相关点的线条
          let cellRelevantFlag = true;
          if (shownRelationCell.length > 0) {
            cellRelevantFlag = isItemOfArray(shownRelationCell, [source, target]);
          }
          // 切换显示
          line.switchShown(
            priorityCostFlag && priorityDirFlag && cellRelevantFlag && blockCellFlag,
          );
        }
      });
    });
    this.refresh();
  };

  // 渲染线条特殊标志
  renderLineSpecialFlag = (status, value, textureName, key, size) => {
    const [source, target] = value.split('-');
    const lineEntity = getLineEntityFromMap(this.idLineMap, source, target);
    if (!lineEntity) return;
    status
      ? lineEntity.plusAction(getTextureFromResources(textureName), key, size)
      : lineEntity.removeAction(key);
  };

  /**
   * 充电桩
   * @param {*} chargerList
   * @param {*} active 是否可以点击
   * @param {*} check 点击回调
   */
  renderChargers = (chargerList, active = false, check = null) => {
    chargerList.forEach((chargerData) => {
      if (!chargerData) return;
      const { x, y, name, angle, chargingCells = [] } = chargerData;
      if (x === null || y === null) return;
      const charger = new Charger({ x, y, name, angle, active, check });

      // 二维码添加充电点图标
      chargingCells.forEach((chargingCell) => {
        if (chargingCell) {
          const cellEntity = this.idCellMap.get(chargingCell.cellId);
          if (cellEntity) {
            cellEntity.plusType('charger_cell', getTextureFromResources('charger_cell'));

            // 渲染充电桩到充电点之间的关系线
            const relationLine = new PIXI.Graphics();
            relationLine.lineStyle(20, 0x0389ff);
            relationLine.moveTo(x, y);
            relationLine.lineTo(cellEntity.x, cellEntity.y);
            relationLine.zIndex = zIndex.targetLine;
            this.pixiUtils.viewportAddChild(relationLine);
            this.relationshipLines.set(`charger_${name}-${cellEntity.id}`, relationLine);
          }
        }
      });
      // 渲染充电桩
      this.pixiUtils.viewportAddChild(charger);
      this.chargerMap.set(name, charger);
    });
  };

  removeCharger = (charger) => {
    if (!charger) return;
    const { chargingCells = [], name } = charger;

    chargingCells.forEach((chargingCell) => {
      if (chargingCell) {
        const cellEntity = this.idCellMap.get(chargingCell.cellId);
        if (cellEntity) {
          cellEntity.removeType('charger_cell');

          // 删除工作站到停止点之间的关系线
          const relationshipLine = this.relationshipLines.get(`charger_${name}-${cellEntity.id}`);
          if (relationshipLine) {
            this.pixiUtils.viewportRemoveChild(relationshipLine);
            relationshipLine.destroy(true);
          }
        }
      }
    });

    const chargerEntity = this.chargerMap.get(name);
    if (chargerEntity) {
      this.pixiUtils.viewportRemoveChild(chargerEntity);
      chargerEntity.destroy({ children: true });
    }
  };

  // 地图-工作站点击事件

  /**
   * 渲染一个工作站
   * @param {*} workStationData 工作站数据
   * @param {*} check 点击工作站回调函数
   */
  addWorkStation = (workStationData, check) => {
    const {
      x,
      y,
      icon,
      name,
      angle,
      station, // 编码
      direction,
      scanCellId,
      stopCellId,
      bufferCellId,
      rotateCellIds,
      branchPathCellIds,
      size, // width@height
    } = workStationData;

    const workStationParam = {
      x,
      y,
      name,
      angle,
      direction,
      icon,
      size,
      stopCellId,
      station,
      click: this.onWorkStationClick,
    };
    if (!isNull(check) && typeof check === 'function') {
      workStationParam.active = true;
      workStationParam.click = ({flag, color}) => {
        check({ station, name, angle, direction, stopCellId, flag, color });
      };
    }

    const workStation = new WorkStation(workStationParam);
    this.pixiUtils.viewportAddChild(workStation);
    this.workStationMap.set(`${stopCellId}`, workStation);

    // 扫描点
    const scanCell = this.idCellMap.get(scanCellId);
    scanCell && scanCell.plusType('scan_cell', getTextureFromResources('scan_cell'));

    // 停止点
    const stopCell = this.idCellMap.get(stopCellId);
    if (stopCell) {
      stopCell.plusType('stop', getTextureFromResources('stop'));
      // 渲染工作站到停止点之间的关系线
      const dashedLine = new PIXI.Graphics();
      dashedLine.lineStyle(20, 0x0389ff);
      dashedLine.moveTo(x, y);
      dashedLine.lineTo(stopCell.x, stopCell.y);
      dashedLine.zIndex = zIndex.targetLine;
      this.pixiUtils.viewportAddChild(dashedLine);
      this.relationshipLines.set(`workStation_${station}`, dashedLine);
    }

    // 缓冲点
    const bufferCell = this.idCellMap.get(bufferCellId);
    bufferCell && bufferCell.plusType('buffer_cell', getTextureFromResources('buffer_cell'));

    // 旋转点
    if (Array.isArray(rotateCellIds)) {
      rotateCellIds.forEach((cellId) => {
        const rotateCell = this.idCellMap.get(parseInt(cellId));
        rotateCell && rotateCell.plusType('rotate_cell', getTextureFromResources('rotate_cell'));
      });
    }

    // 分叉点
    if (Array.isArray(branchPathCellIds)) {
      branchPathCellIds.forEach((cellId) => {
        const bifurcationCell = this.idCellMap.get(parseInt(cellId));
        bifurcationCell &&
          bifurcationCell.plusType('bifurcation', getTextureFromResources('bifurcation'));
      });
    }
  };

  removeWorkStation = (workStationData) => {
    const { station, scanCellId, stopCellId, bufferCellId, rotateCellIds, branchPathCellIds } =
      workStationData;
    const workStation = this.workStationMap.get(`${stopCellId}`);
    if (workStation) {
      this.pixiUtils.viewportRemoveChild(workStation);
      workStation.destroy({ children: true });
    }

    // Render Scan Cell
    const scanCell = this.idCellMap.get(scanCellId);
    scanCell && scanCell.removeType('scan_cell');

    // Render Stop Cell
    const stopCell = this.idCellMap.get(stopCellId);
    stopCell && stopCell.removeType('stop');

    // Render Buffer Cell
    const bufferCell = this.idCellMap.get(bufferCellId);
    bufferCell && bufferCell.removeType('buffer_cell');

    // Render Rotation Cell
    if (Array.isArray(rotateCellIds)) {
      rotateCellIds.forEach((cellId) => {
        const rotateCell = this.idCellMap.get(parseInt(cellId));
        rotateCell && rotateCell.removeType('rotate_cell');
      });
    }

    // 删除分叉点
    if (Array.isArray(branchPathCellIds)) {
      branchPathCellIds.forEach((cellId) => {
        const bifurcationCell = this.idCellMap.get(parseInt(cellId));
        bifurcationCell && bifurcationCell.removeType('bifurcation');
      });
    }

    // 删除工作站到停止点之间的关系线
    const relationshipLine = this.relationshipLines.get(`workStation_${station}`);
    if (relationshipLine) {
      this.pixiUtils.viewportRemoveChild(relationshipLine);
      relationshipLine.destroy(true);
    }
  };

  /**
   * 渲染 通用站点
   * @param {*} commonList 通用站点数据
   * @param {*} check 点击通用站点回调函数
   */
  renderCommonFunction = (commonList, check) => {
    commonList.forEach((commonFunctionData) => {
      const {
        name = '',
        station,
        angle,
        iconAngle,
        stopCellId,
        icon,
        size,
        offset,
        direction = 0,
      } = commonFunctionData;
      const stopCell = this.idCellMap.get(stopCellId);
      if (!stopCell) return;

      let commonFunction;
      let destinationX;
      let destinationY;

      const _commonPoint = {};
      if (!isNull(check) && typeof check === 'function') {
        _commonPoint.active = true;
        _commonPoint.check = (flag, color) => {
          check(JSON.stringify({ station, name, angle, direction, stopCellId, flag, color }));
        };
      }

      // 兼容旧逻辑(新通用站点必定包含offset数据)
      if (isNull(offset)) {
        destinationX = stopCell.x + commonFunctionData.x;
        destinationY = stopCell.y + commonFunctionData.y;

        commonFunction = new CommonFunction({
          x: destinationX,
          y: destinationY,
          name,
          angle, // 相对于停止点的方向
          iconAngle: angle, // 图标角度，仅用于渲染
          ..._commonPoint,
        });
      } else {
        const { x, y } = getCoordinat(stopCell, angle, offset);
        destinationX = x;
        destinationY = y;
        commonFunction = new CommonFunction({
          x,
          y,
          name,
          angle, // 相对于停止点的方向
          iconAngle, // 图标角度，仅用于渲染
          icon, // 图标类型
          size, // 图标尺寸
          ..._commonPoint,
        });
      }

      // 渲染站点到停止点之间的关系线
      const dashedLine = new PIXI.Graphics();
      dashedLine.lineStyle(20, 0x0389ff);
      dashedLine.moveTo(destinationX, destinationY);
      dashedLine.lineTo(stopCell.x, stopCell.y);
      dashedLine.zIndex = zIndex.targetLine;
      this.pixiUtils.viewportAddChild(dashedLine);
      this.relationshipLines.set(`commonStation_${station}`, dashedLine);

      this.pixiUtils.viewportAddChild(commonFunction);
      this.commonFunctionMap.set(`${stopCellId}`, commonFunction);

      // Render Stop Cell
      stopCell.plusType('stop', getTextureFromResources('stop'));
    });
  };

  removeCommonFunction = ({ station, stopCellId }) => {
    const commonFunction = this.commonFunctionMap.get(`${stopCellId}`);
    if (commonFunction) {
      this.pixiUtils.viewportRemoveChild(commonFunction);
      commonFunction.destroy({ children: true });

      // 删除站点到停止点之间的关系线
      const relationshipLine = this.relationshipLines.get(`commonStation_${station}`);
      if (relationshipLine) {
        this.pixiUtils.viewportRemoveChild(relationshipLine);
        relationshipLine.destroy(true);
      }
    }

    // Render Stop Cell
    const stopCell = this.idCellMap.get(stopCellId);
    stopCell && stopCell.removeType('stop');
  };

  // 交汇点
  renderIntersection = (intersectionList) => {
    intersectionList.forEach(({ cellId, ip, isTrafficCell }) => {
      const interSectionCell = this.idCellMap.get(cellId);
      if (interSectionCell) {
        const { x, y } = interSectionCell;
        const intersection = new Intersection({
          x,
          y,
          cellId,
          directions: ip,
          isTrafficCell,
        });
        this.pixiUtils.viewportAddChild(intersection);
        this.intersectionMap.set(`${cellId}`, intersection);
      }
    });
  };

  removeIntersection = (intersectionData) => {
    const { cellId } = intersectionData;
    const intersection = this.intersectionMap.get(`${cellId}`);
    if (intersection) {
      this.pixiUtils.viewportRemoveChild(intersection);
      intersection.destroy({ children: true });
    }
  };

  // 电梯
  renderElevator = (elevatorList) => {
    elevatorList.forEach((elevatorData) => {
      const { replace, innerMapping, doors = [] } = elevatorData;
      const elevatorCellEntity = this.idCellMap.get(innerMapping[replace]);
      if (!elevatorCellEntity) return;

      const { x, y } = elevatorCellEntity;
      const elevator = new Elevator({ x, y });
      this.pixiUtils.viewportAddChild(elevator);
      this.elevatorMap.set(`x${x}y${y}`, elevator);

      // 渲染电梯出入口、等待点、电梯点
      doors.forEach((door) => {
        const { cellId: entryCellId, leaveCellId, waitCellId } = door;
        // 入口
        if (entryCellId) {
          const cellEntity = this.idCellMap.get(parseInt(entryCellId));
          cellEntity &&
            cellEntity.plusType('elevator_in', getTextureFromResources('entrance_cell'));
        }

        // 出口
        if (leaveCellId) {
          const cellEntity = this.idCellMap.get(parseInt(leaveCellId));
          cellEntity && cellEntity.plusType('elevator_out', getTextureFromResources('exit_cell'));
        }

        // 等待点
        if (waitCellId) {
          const cellEntity = this.idCellMap.get(parseInt(waitCellId));
          cellEntity && cellEntity.plusType('wait_cell', getTextureFromResources('wait_cell'));
        }

        // 电梯点替换点ID
        elevatorCellEntity.addReplaceId(replace);
      });
    });
  };

  removeElevator = (elevatorData) => {
    const { replace, innerMapping, doors = [] } = elevatorData;
    if (replace && innerMapping && doors?.length > 0) {
      const elevatorCellEntity = this.idCellMap.get(parseInt(innerMapping[replace]));
      if (!elevatorCellEntity) return;

      const { x, y } = elevatorCellEntity;
      const elevator = this.elevatorMap.get(`x${x}y${y}`);
      if (elevator) {
        this.pixiUtils.viewportRemoveChild(elevator);
        elevator.destroy({ children: true });
      }

      doors.forEach((door) => {
        const { cellId: entryCellId, waitCellId, leaveCellId } = door;

        if (entryCellId) {
          const cellEntity = this.idCellMap.get(parseInt(entryCellId));
          cellEntity && cellEntity.removeType('elevator_in');
        }

        if (leaveCellId) {
          const cellEntity = this.idCellMap.get(parseInt(leaveCellId));
          cellEntity && cellEntity.removeType('elevator_out');
        }

        if (waitCellId) {
          const cellEntity = this.idCellMap.get(parseInt(waitCellId));
          cellEntity && cellEntity.removeType('wait_cell');
        }

        elevatorCellEntity.addReplaceId(null);
      });
    }
  };

  // 抛物点
  // 渲染抛物点标记
  addDump = (name, x, y) => {
    const dump = new Dump(x, y, name);
    this.pixiUtils.viewportAddChild(dump);
    this.dumpMap.set(`x${x}y${y}`, dump);
  };

  // 删除抛物点
  removeDump = (x, y) => {
    const dump = this.dumpMap.get(`x${x}y${y}`);
    if (dump) {
      this.pixiUtils.viewportRemoveChild(dump);
      dump.destroy({ children: true });
    }
  };

  // 新增抛物框
  addDumpBasket = (key, x, y) => {
    const basket = new DumpBasket(key, x, y);
    this.pixiUtils.viewportAddChild(basket);
    this.dumpBasketMap.set(`x${x}y${y}`, basket);
  };

  renderDumpFunction = (dumpStations) => {
    dumpStations.forEach((dumpData) => {
      // 渲染抛物点
      this.addDump(dumpData.name, dumpData.x, dumpData.y);

      // 渲染抛物框
      dumpData.dumpBasket.forEach((item) => {
        this.addDumpBasket(item.key, item.x, item.y);

        // 渲染抛物点与抛物框之间的虚线
        const dashedLine = new PIXI.Graphics();
        dashedLine.lineStyle(15, 0xdc8758);
        dashedLine.moveTo(dumpData.x, dumpData.y);
        dashedLine.lineTo(item.x, item.y);
        this.pixiUtils.viewportAddChild(dashedLine);
        this.relationshipLines.set(
          `dumpBasket_${dumpData.x}-${dumpData.y}-${item.x}-${item.y}`,
          dashedLine,
        );
      });
    });
  };

  removeDumpFunction = (dumpData) => {
    // 删除抛物点
    this.removeDump(dumpData.x, dumpData.y);

    // 删除抛物框
    dumpData.dumpBasket.forEach((item) => {
      const basket = this.dumpBasketMap.get(`x${item.x}y${item.y}`);
      if (basket) {
        this.pixiUtils.viewportRemoveChild(basket);
        basket.destroy({ children: true });
      }

      // 虚线
      const dashedLine = this.relationshipLines.get(
        `dumpBasket_${dumpData.x}-${dumpData.y}-${item.x}-${item.y}`,
      );
      if (dashedLine) {
        this.pixiUtils.viewportRemoveChild(dashedLine);
        dashedLine.destroy(true);
      }
    });
  };

  // 渲染固定紧急避让区
  renderFixedEStopFunction = (data) => {
    const showEmergency = this.states.showEmergencyStop;
    const eData = {
      ...data,
      showEmergency,
      notShowFixed: true,
      refresh: this.refresh,
      select: (EStop, isAdd) => {
        //
      },
    };
    const fixedEStop = new EmergencyStop(eData);
    this.pixiUtils.viewportAddChild(fixedEStop);
    this.fixedEStopMap.set(`${data.code}`, fixedEStop);
  };

  // 移除固定紧急避让区
  removeFixedEStopFunction = (data) => {
    const { code } = data;
    const fixedEStop = this.fixedEStopMap.get(`${code}`);
    if (fixedEStop) {
      this.pixiUtils.viewportRemoveChild(fixedEStop);
      fixedEStop.destroy({ children: true });
    }
  };

  /**
   * 通道
   * @param newChannelList
   * @param interact Editor点位自身包含点击事件，所以不需要动态添加
   * @param opt
   */
  renderTunnel = (newChannelList = [], interact = false, opt = 'add') => {
    newChannelList.forEach((channelData) => {
      const { tunnelName, cells } = channelData;
      cells.forEach((cellId) => {
        const cellEntity = this.idCellMap.get(cellId);
        const sprite = new BitText(tunnelName, 0, 0, 0xf4f9f9);
        if (cellEntity) {
          if (opt === 'add') {
            cellEntity.plusType(`tunnel_${tunnelName}`, sprite);
            interact && cellEntity.interact(true, true, this.props.checkTunnelGate);
          }

          if (opt === 'remove') {
            cellEntity.removeType(`tunnel_${tunnelName}`, true);
            interact && cellEntity.interact(false, true);
          }
        }
      });
    });
  };

  // 画区域
  drawRectArea({ code, x, y, width, height, color, text }, interactive) {
    const mapZoneMarker = new MapZoneMarker({
      code,
      x,
      y,
      width,
      height,
      text,
      interactive,
      color: color.replace('#', '0x'),
      type: ZoneMarkerType.RECT,
      refresh: this.refresh,
      select: (marker, isAdd) => {
        this.selectMapMarker(marker, isAdd, false);
      },
      ctrlSelect: (marker) => {
        this.selectMapMarker(marker, true, true);
      },
    });
    this.zoneMap.set(code, mapZoneMarker);
    this.pixiUtils.viewportAddChild(mapZoneMarker);
    this.refresh();
  }

  drawCircleArea({ code, x, y, radius, color, text }, interactive) {
    const mapZoneMarker = new MapZoneMarker({
      code,
      x,
      y,
      radius,
      text,
      interactive,
      color: color.replace('#', '0x'),
      type: ZoneMarkerType.CIRCLE,
      refresh: this.refresh,
      select: (marker, isAdd) => {
        this.selectMapMarker(marker, isAdd, false);
      },
      ctrlSelect: (marker) => {
        this.selectMapMarker(marker, true, true);
      },
    });
    this.zoneMap.set(code, mapZoneMarker);
    this.pixiUtils.viewportAddChild(mapZoneMarker);
    this.refresh();
  }

  renderImage({ code, x, y, width, height, data }, interactive) {
    const mapZoneMarker = new MapZoneMarker({
      code,
      x,
      y,
      width,
      height,
      data,
      interactive,
      type: ZoneMarkerType.IMG,
      refresh: this.refresh,
      select: (marker, isAdd) => {
        this.selectMapMarker(marker, isAdd, false);
      },
      ctrlSelect: (marker) => {
        this.selectMapMarker(marker, true, true);
      },
    });
    this.zoneMap.set(code, mapZoneMarker);
    this.pixiUtils.viewportAddChild(mapZoneMarker);
    this.refresh();
  }

  renderLabel({ code, x, y, text, color, width, height }, interactive) {
    const mapLabelMarker = new MapLabelMarker({
      code,
      x,
      y,
      text,
      width,
      height,
      interactive,
      color: color || 0xffffff,
      refresh: this.refresh,
      select: (marker, isAdd) => {
        this.selectMapMarker(marker, isAdd, false);
      },
      ctrlSelect: (marker) => {
        this.selectMapMarker(marker, true, true);
      },
    });
    this.labelMap.set(code, mapLabelMarker);
    this.pixiUtils.viewportAddChild(mapLabelMarker);
    this.refresh();
  }
}
