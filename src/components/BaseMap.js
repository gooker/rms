import React from 'react';
import * as PIXI from 'pixi.js';
import {
  getCoordinat,
  getLineEntityFromMap,
  getCurrentRouteMapData,
  getTextureFromResources,
} from '@/utils/mapUtils';
import { getLineGraphics } from '@/utils/textures';
import { isNull, isItemOfArray } from '@/utils/utils';
import { CellSize, WorldScreenRatio, zIndex } from '@/config/consts';
import {
  Dump,
  Charger,
  BitText,
  Elevator,
  DumpBasket,
  WorkStation,
  Intersection,
  RollerStation,
  CommonFunction,
  BackImg,
  EmergencyStop,
} from '@/entities';
import { sortBy, uniq } from 'lodash';

const AllPriorities = [10, 20, 100, 1000];

export default class BaseMap extends React.Component {
  constructor(props) {
    super(props);
    this.idCellMap = new Map(); // {cellId: [CellEntity]}
    this.idLineMap = { 10: new Map(), 20: new Map(), 100: new Map(), 1000: new Map() }; //  { cost: new Map({[startCellID-endCellID]: [LineEntity]})}
    this.workStationMap = new Map(); // {stopCellId: [Entity]}
    this.elevatorMap = new Map(); // {[x${x}y${y}]: [Entity]}
    this.intersectionMap = new Map(); // {stopCellId: [Entity]}
    this.commonFunctionMap = new Map(); // {stopCellId: [Entity]}
    this.chargerMap = new Map(); // {[x${x}y${y}]: [Entity]}
    this.dumpMap = new Map();
    this.dumpBasketMap = new Map();
    this.rollerMap = new Map();
    this.relationshipLines = new Map(); // 关系线
    this.backImgMap = new Map(); // 背景图片
    this.fixedEStopMap = new Map(); // 固定紧急避让区
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

  centerView = (cells) => {
    if (cells && Object.keys(cells).length > 0) {
      // Sort all points x & y
      const uniqueXs = uniq(
        Object.keys(cells)
          .map((id) => cells[id])
          .map((cell) => cell.x),
      );
      const Xs = sortBy(uniqueXs, (x) => x);

      const uniqueYs = uniq(
        Object.keys(cells)
          .map((id) => cells[id])
          .map((cell) => cell.y),
      );
      const Ys = sortBy(uniqueYs, (y) => y);

      // Get Min and Max
      const minX = Xs[0];
      const minY = Ys[0];
      const maxX = Xs[Xs.length - 1];
      const maxY = Ys[Ys.length - 1];

      // Map elements Area
      const elementsWidth = maxX - minX + CellSize.width;
      const elementsHeight = maxY - minY + CellSize.height;

      const worldWidth = elementsWidth * WorldScreenRatio;
      const worldHeight = elementsHeight * WorldScreenRatio;

      this.pixiUtils.viewport.worldWidth = worldWidth;
      this.pixiUtils.viewport.worldHeight = worldHeight;
      this.pixiUtils.viewport.fitWorld(false);

      this.pixiUtils.viewport.moveCenter(minX + elementsWidth / 2, minY + elementsHeight / 2);

      return { worldWidth, worldHeight };
    }
  };

  // 清空 Stage 所有元素
  clearMapStage = () => {
    this.pixiUtils.viewportRemoveChildren();
  };

  // 地图点位坐标显示
  switchCoordinationShown = (flag) => {
    this.states.showCoordinate = flag;
    this.idCellMap.forEach((cell) => {
      cell.switchCoordinationShown(flag);
    });
    this.pixiUtils.refresh();
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
    this.pixiUtils.refresh();
  };

  // 背景图片显示
  switchBackImgShown = (flag) => {
    this.states.showBackImg = flag;
    this.backImgMap.forEach(function (value) {
      value.switchBackImgEntityShown(flag);
    });
    this.pixiUtils.refresh();
  };

  // 切换急停区显示
  switchEmergencyStopShown = (flag) => {
    this.states.showEmergencyStop = flag;
    this.fixedEStopMap.forEach(function (eStop) {
      eStop.switchEstopsShown(flag);
    });
    this.pixiUtils.refresh();
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
  renderRestCells = (restCells, opt = 'add') => {
    restCells.forEach((item) => {
      if (item?.cellIds) {
        item.cellIds.forEach((cell) => {
          const cellEntity = this.idCellMap.get(cell);
          if (cellEntity) {
            opt === 'add' && cellEntity.plusType('rest_cell', getTextureFromResources('rest_cell'));
            opt === 'remove' && cellEntity.removeType('rest_cell');
          }
        });
      }
    });
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
  drawLine(
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
   * @param {*} relations 当前relations数据
   * @param {*} uiFilterData 筛选结果 e.g. [10,20,100,1000]
   * @param {*} nameSpace 数据模块，默认editor
   */
  filterRelations(relations = [], uiFilterData, nameSpace = 'editor') {
    this.states.shownPriority = uiFilterData;
    if (relations.length === 0) return;
    const nonStopCellIds = getCurrentRouteMapData(nameSpace)?.nonStopCellIds ?? [];
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
      this.drawLine(relations, relations, nameSpace === 'editor', 'standard', priorityToRender); // TODO: 目前只针对编辑器可点击
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
          const priorityCostFlag = shownPriority.includes(`${cost}`);
          // 是否在显示的优先级方向范围内
          const priorityDirFlag = shownRelationDir.includes(dir);
          // 是否是不可走点的线条 & 没有隐藏显示不可走点
          const isBlockLines = isItemOfArray(
            blockCellIds ?? [],
            [source, target].map((item) => parseInt(item, 10)),
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
        } else {
          // 贝塞尔曲线
          const { primary, third, cost } = line;
          const source = primary.id;
          const target = third.id;

          const priorityCostFlag = shownPriority.includes(`${cost}`);
          const isBlockLines = isItemOfArray(
            blockCellIds ?? [],
            [source, target].map((item) => parseInt(item, 10)),
          );
          const blockCellFlag = isBlockLines ? !hideBlock : true;

          let cellRelevantFlag = true;
          if (shownRelationCell.length > 0) {
            cellRelevantFlag = isItemOfArray(shownRelationCell, [source, target]);
          }

          line.switchShown(priorityCostFlag && cellRelevantFlag && blockCellFlag);
        }
      });
    });
    this.pixiUtils.refresh();
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
    };
    if (!isNull(check) && typeof check === 'function') {
      workStationParam.active = true;
      workStationParam.check = (flag, color) => {
        check(JSON.stringify({ station, name, angle, direction, stopCellId, flag, color }));
      };
    }
    const workStation = new WorkStation(workStationParam);
    this.pixiUtils.viewportAddChild(workStation);
    this.workStationMap.set(`${stopCellId}`, workStation);

    // Render Scan Cell
    const scanCell = this.idCellMap.get(scanCellId);
    scanCell && scanCell.plusType('scan_cell', getTextureFromResources('scan_cell'));

    // Render Stop Cell
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

    // Render Buffer Cell
    const bufferCell = this.idCellMap.get(bufferCellId);
    bufferCell && bufferCell.plusType('buffer_cell', getTextureFromResources('buffer_cell'));

    // Render Rotation Cell
    if (Array.isArray(rotateCellIds)) {
      rotateCellIds.forEach((cellId) => {
        const rotateCell = this.idCellMap.get(cellId);
        rotateCell && rotateCell.plusType('round', getTextureFromResources('round'));
      });
    }
  };

  removeWorkStation = (workStationData) => {
    const { station, scanCellId, stopCellId, bufferCellId, rotateCellIds } = workStationData;
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
        const rotateCell = this.idCellMap.get(cellId);
        rotateCell && rotateCell.removeType('round');
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
   * @param {*} workStationData 通用站点数据
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

  // 背景图片 eg:cad背景
  renderBackImgFunction = (backImgData) => {
    //this.states.showBackImg
    // console.log(this.states.showBackImg);
    const showBackImg = this.states.showBackImg;
    const backData = { ...backImgData, showBackImg };
    const backImg = new BackImg(backData);
    this.pixiUtils.viewportAddChild(backImg);
    this.backImgMap.set(`${backImgData.x}_${backImgData.y}_${backImgData.type}`, backImg);
  };

  removeBackImgFunction = (backImgData) => {
    const { x, y, type } = backImgData;
    const backImg = this.backImgMap.get(`${x}_${y}_${type}`);
    if (backImg) {
      this.pixiUtils.viewportRemoveChild(backImg);
      backImg.destroy(true);
    }
  };
  //

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
          const cellEntity = this.idCellMap.get(entryCellId);
          cellEntity && cellEntity.plusType('elevator_in', getTextureFromResources('elevator_in'));
        }

        // 出口
        if (leaveCellId) {
          const cellEntity = this.idCellMap.get(leaveCellId);
          cellEntity &&
            cellEntity.plusType('elevator_out', getTextureFromResources('elevator_out'));
        }

        // 等待点
        if (waitCellId) {
          const cellEntity = this.idCellMap.get(waitCellId);
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
      const elevatorCellEntity = this.idCellMap.get(innerMapping[replace]);
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
          const cellEntity = this.idCellMap.get(entryCellId);
          cellEntity && cellEntity.removeType('elevator_in');
        }

        if (leaveCellId) {
          const cellEntity = this.idCellMap.get(leaveCellId);
          cellEntity && cellEntity.removeType('elevator_out');
        }

        if (waitCellId) {
          const cellEntity = this.idCellMap.get(waitCellId);
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
    const eData = { ...data, showEmergency, notShowFixed: true };
    const fixedEstop = new EmergencyStop(eData);
    this.pixiUtils.viewportAddChild(fixedEstop);
    this.fixedEStopMap.set(`${data.code}`, fixedEstop);
  };

  // 移除固定紧急避让区
  removeFixedEStopFunction = (data) => {
    const { code } = data;
    const fixE = this.fixedEStopMap.get(`${code}`);
    if (fixE) {
      this.pixiUtils.viewportRemoveChild(fixE);
      fixE.destroy({ children: true });
    }
  };

  // 滚筒站
  removeRollerFunction = (rollerStation) => {
    const { binCellId } = rollerStation;
    const cellEntity = this.idCellMap.get(binCellId);
    if (cellEntity) {
      const { x, y } = cellEntity;
      const roller = this.rollerMap.get(`x${x}y${y}`);
      if (roller) {
        this.pixiUtils.viewportRemoveChild(roller);
        roller.destroy({ children: true });
      }
    }
  };

  renderRollerFunction = (rollerStationList) => {
    rollerStationList.forEach(({ binCellId, binCellIdType }) => {
      const cellEntity = this.idCellMap.get(binCellId);
      if (cellEntity) {
        let texture;
        if (binCellIdType === 'IN') {
          texture = getTextureFromResources('roller_in');
        } else {
          texture = getTextureFromResources('roller_out');
        }
        const { x, y } = cellEntity;
        const roller = new RollerStation(texture, x, y);
        this.pixiUtils.viewportAddChild(roller);
        this.rollerMap.set(`x${x}y${y}`, roller);
      }
    });
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
            interact && cellEntity.interact(true, true, false, this.props.checkTunnelGate);
          }

          if (opt === 'remove') {
            cellEntity.removeType(`tunnel_${tunnelName}`, true);
            interact && cellEntity.interact(false, true);
          }
        }
      });
    });
  };
}
