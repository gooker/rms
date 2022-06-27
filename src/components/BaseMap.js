import React from 'react';
import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import {
  convertAngleToPixiAngle,
  getArrowDistance,
  getCoordinator,
  getDistance,
  getTextureFromResources,
} from '@/utils/mapUtil';
import { BitText, Charger, CommonFunction, Dump, DumpBasket, Elevator, Intersection, WorkStation } from '@/entities';
import { isNull } from '@/utils/util';
import { coordinateTransformer } from '@/utils/coordinateTransformer';
import MapZoneMarker from '@/entities/MapZoneMarker';
import MapLabelMarker from '@/entities/MapLabelMarker';
import CostArrow from '@/entities/CostArrow';
import { CoordinateType, LineType } from '@/config/config';
import { MapScaleRatio, zIndex, ZoneMarkerType } from '@/config/consts';
import StraightPath from '@/entities/StraightPath';

function initState(context) {
  // 多种导航点类型一起显示的时候，同一个点位必定会出现多个导航点，所以value使用数组形式；该对象近用于处理地图元素属性，比如存储点等
  context.idCellMap = new Map(); // {1:Cell}
  context.xyCellMap = new Map(); // {x_y:[Cell]} // 主要用于处理点击某个点位，查看该坐标下有几个点位
  context.idNaviMap = new Map();

  context.idLineMap = new Map(); // {sourceCellId-targetCellId: graphics}
  context.idArrowMap = new Map(); // {sourceCellId-targetCellId:arrow}

  context.workStationMap = new Map(); // {stopCellId: [Entity]}
  context.elevatorMap = new Map(); // {[x${x}y${y}]: [Entity]}
  context.intersectionMap = new Map(); // {stopCellId: [Entity]}
  context.commonFunctionMap = new Map(); // {stopCellId: [Entity]}
  context.chargerMap = new Map(); // {[x${x}y${y}]: [Entity]}
  context.dumpMap = new Map(); // 抛物点
  context.dumpBasketMap = new Map(); // 抛物框
  context.relationshipLines = new Map(); // 关系线
  context.backImgMap = new Map(); // 背景图片
  context.labelMap = new Map(); // 标签
  context.zoneMap = new Map(); // 区域标记
}

export default class BaseMap extends React.PureComponent {
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
      viewport.fit(true, width * MapScaleRatio, height * MapScaleRatio);
      viewport.moveCenter(x + width / 2, y + height / 2);
    }
    this.refresh();
  };

  // 动态限制地图缩放尺寸
  clampZoom = (viewport, storageKey) => {
    const { x, y, width, height } = viewport.getLocalBounds();
    let minMapRatio;
    viewport.clampZoom({
      minWidth: viewport.worldScreenWidth * viewport.scale.x,
      minHeight: viewport.worldScreenHeight * viewport.scale.y,
      maxWidth: viewport.worldScreenWidth,
      maxHeight: viewport.worldScreenHeight,
    });
    // 返回最小缩小比例
    minMapRatio = viewport.screenWidth / viewport.worldScreenWidth;
    // 记录当前地图世界宽度
    window.sessionStorage.setItem(storageKey, JSON.stringify({ x, y, width, height }));
    return minMapRatio;
  };

  // 清空 Stage 所有元素
  clearMapStage = () => {
    this.pixiUtils.viewportRemoveChildren();
    initState(this);
  };

  ///////////////// 地图元素可见性设置 /////////////////
  // 地图点位坐标显示
  switchCoordinationShown = (flag) => {
    this.states.showCoordinate = flag;
    this.idCellMap.forEach((cell) => {
      cell.switchCoordinationShown(flag);
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
  ///////////////// 地图元素可见性设置 /////////////////

  // 清空并销毁所有优先级线条
  destroyAllLines = () => {
    Object.values(this.idArrowMap).forEach((lineMap) => {
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
  };

  // ************************ 线条相关 **********************
  /**
   * 绘制线条核心逻辑
   * @param {Array} relationsToRender 即将渲染的线条数据
   * @param { 'land'| 'navi'} renderType 渲染物理坐标的线条还是导航坐标的线条
   * @param {{}} transform 各个地图的转换参数
   */
  renderCostLines(relationsToRender, renderType, transform) {
    relationsToRender.forEach((lineData) => {
      const { type, cost, source, target, angle } = lineData;
      const sourceCell = this.idCellMap.get(source);
      const targetCell = this.idCellMap.get(target);
      if (isNull(sourceCell) && isNull(targetCell)) return;

      // 只有显示物理坐标和直线类型线条才会显示直线
      if (renderType === CoordinateType.LAND || type === LineType.StraightPath) {
        const distance = getDistance(sourceCell, targetCell);
        // 因为关系线只是连接两个点位，所以无论正向还是反向都可以共用一条线。所以绘制线条时优先检测reverse
        const lineMapKey = `${source}-${target}`;
        const lineEntity = this.idLineMap.get(lineMapKey);
        const reverseLineMapKey = `${targetCell.id}-${sourceCell.id}`;
        const reverseLineEntity = this.idLineMap.get(reverseLineMapKey);
        if (isNull(lineEntity) && isNull(reverseLineEntity)) {
          const relationLine = new StraightPath({ sourceCell, targetCell, distance });
          relationLine.visible = this.states.showCellsLine;
          this.pixiUtils.viewportAddChild(relationLine);
          this.idLineMap.set(lineMapKey, relationLine);
        } else {
          this.idLineMap.set(lineMapKey, reverseLineEntity || lineEntity);
        }

        // 绘制箭头(箭头位置在起始点和终点的连线上，靠近起始点，箭头指向终点)
        const arrowMapKey = lineMapKey;
        const arrowExist = this.idArrowMap.get(arrowMapKey);
        if (!isNull(arrowExist)) {
          this.pixiUtils.viewportRemoveChild(arrowExist);
          arrowExist.destroy();
          this.idArrowMap.delete(arrowMapKey);
        }
        const offset = getArrowDistance(distance);
        const arrowPosition = getCoordinator(sourceCell, angle, offset);
        const arrow = new CostArrow({
          ...arrowPosition,
          id: arrowMapKey,
          cost,
          angle: convertAngleToPixiAngle(angle),
          select: this.select,
        });
        arrow.visible = this.getArrowShownValue(arrow);
        this.pixiUtils.viewportAddChild(arrow);
        this.idArrowMap.set(arrowMapKey, arrow);
      }

      // 绘制曲线(贝塞尔和圆弧)
      const navigationType = sourceCell.navigationType;
      if (renderType === CoordinateType.NAVI && type === LineType.BezierPath) {
        const { control1, control2 } = lineData;
        const lineMapKey = `${source}-${target}`;
        const transformedCP1 = coordinateTransformer(
          control1,
          navigationType,
          transform[navigationType],
        );
        const transformedCP2 = coordinateTransformer(
          control2,
          navigationType,
          transform[navigationType],
        );

        const bezier = new SmoothGraphics();
        bezier.lineStyle(3, 0xffffff);
        bezier.moveTo(sourceCell.x, sourceCell.y);
        bezier.bezierCurveTo(
          transformedCP1.x,
          transformedCP1.y,
          transformedCP2.x,
          transformedCP2.y,
          targetCell.x,
          targetCell.y,
        );
        this.pixiUtils.viewportAddChild(bezier);
        this.idLineMap.set(lineMapKey, bezier);

        // TODO: 绘制箭头
      }

      // TODO: 绘制圆弧
      if (renderType === CoordinateType.NAVI && type === LineType.ArcPath) {
        //
      }
    });
  }

  renderRelationProgramingFlag = (ids, opt = 'add') => {
    if (Array.isArray(ids)) {
      ids.forEach((lineMapKey) => {
        const relationEntity = this.idArrowMap.get(lineMapKey);
        if (relationEntity) {
          opt === 'add' && relationEntity.setProgramingFlag();
          opt === 'remove' && relationEntity.resetProgramingFlag();
        }
      });
    }
  };

  renderChargers = (chargerList, callback = null) => {
    chargerList.forEach((chargerData, index) => {
      if (!chargerData) return;
      const { x, y, name, angle, chargingCells = [] } = chargerData;
      if (x === null || y === null) return;
      const charger = new Charger({
        x,
        y,
        name,
        angle: convertAngleToPixiAngle(angle),
        $$formData: { flag: index + 1, ...chargerData },
        // 这里回调在编辑器和监控是不一样的，如果没有传入回调，则默认是编辑器的this.select
        select: typeof callback === 'function' ? callback : this.select,
      });
      this.pixiUtils.viewportAddChild(charger);
      this.chargerMap.set(name, charger);

      // 渲染充电桩到充电点之间的关系线
      chargingCells.forEach((chargingCell) => {
        if (chargingCell) {
          const cellEntity = this.idCellMap.get(chargingCell.cellId);
          if (cellEntity) {
            const relationLine = new PIXI.Graphics();
            relationLine.lineStyle(40, 0x0389ff);
            relationLine.moveTo(x, y);
            relationLine.lineTo(cellEntity.x, cellEntity.y);
            relationLine.zIndex = zIndex.targetLine;
            this.pixiUtils.viewportAddChild(relationLine);
            this.relationshipLines.set(`charger_${name}-${cellEntity.id}`, relationLine);
          }
        }
      });
    });
  };

  removeCharger = (charger) => {
    if (!charger) return;
    const { chargingCells = [], name } = charger;

    chargingCells.forEach((chargingCell) => {
      if (chargingCell) {
        const cellEntity = this.idCellMap.get(chargingCell.cellId);
        if (cellEntity) {
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
   * @param workStationData 工作站数据
   * @param callback 点击回调
   * @param autoSelect 新增完是否有选中样式
   */
  addWorkStation = (workStationData, callback, autoSelect = false) => {
    const {
      x,
      y,
      icon,
      name,
      angle,
      station, // 编码
      direction,
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
      direction,
      icon,
      size,
      stopCellId,
      station,
      angle: convertAngleToPixiAngle(angle),
      $$formData: workStationData, // 原始DB数据
      // 这里回调在编辑器和监控是不一样的，如果没有传入回调，则默认是编辑器的this.select
      select: typeof callback === 'function' ? callback : this.select,
    };
    const workStation = new WorkStation(workStationParam);
    autoSelect && workStation.onSelect();
    this.pixiUtils.viewportAddChild(workStation);
    this.workStationMap.set(`${stopCellId}`, workStation);

    // 扫描点
    const scanCell = this.idCellMap.get(stopCellId);
    scanCell && scanCell.plusType('scan_cell', getTextureFromResources('scan_cell'));

    // 停止点
    const stopCell = this.idCellMap.get(stopCellId);
    if (stopCell) {
      stopCell.plusType('stop', getTextureFromResources('stop'));
      // 渲染工作站到停止点之间的关系线
      const dashedLine = new PIXI.Graphics();
      dashedLine.lineStyle(40, 0x0389ff);
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
   * @param {*} callback 点击通用站点回调函数
   * @param autoSelect 新增完是否有选中样式
   */
  renderCommonFunction = (commonList, callback = null, autoSelect = false) => {
    commonList.forEach((commonFunctionData, index) => {
      const {
        name = '',
        station,
        angle,
        iconAngle,
        stopCellId,
        icon,
        size,
        offset,
      } = commonFunctionData;
      const stopCell = this.idCellMap.get(stopCellId);
      if (!stopCell) return;

      let commonFunction;
      let destinationX;
      let destinationY;

      const callbackOption = {
        // 这里回调在编辑器和监控是不一样的，如果没有传入回调，则默认是编辑器的this.select
        select: typeof callback === 'function' ? callback : this.select,
      };

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
          $$formData: commonFunctionData,
          ...callbackOption,
        });
      } else {
        const { x, y } = getCoordinator(stopCell, angle, offset);
        destinationX = x;
        destinationY = y;
        commonFunction = new CommonFunction({
          x,
          y,
          name,
          angle, // 相对于停止点的方向
          iconAngle: convertAngleToPixiAngle(iconAngle), // 图标角度，仅用于渲染
          icon, // 图标类型
          size, // 图标尺寸
          $$formData: commonFunctionData,
          ...callbackOption,
        });
      }
      autoSelect && commonFunction.onSelect();
      this.pixiUtils.viewportAddChild(commonFunction);
      this.commonFunctionMap.set(`${stopCellId}`, commonFunction);

      // 渲染站点到停止点之间的关系线
      const dashedLine = new PIXI.Graphics();
      dashedLine.lineStyle(40, 0x0389ff);
      dashedLine.moveTo(destinationX, destinationY);
      dashedLine.lineTo(stopCell.x, stopCell.y);
      dashedLine.zIndex = zIndex.targetLine;
      this.pixiUtils.viewportAddChild(dashedLine);
      this.relationshipLines.set(`commonStation_${station}`, dashedLine);

      // 标记停止点
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
    intersectionList.forEach((intersectionData, index) => {
      const { cellId, ip, isTrafficCell } = intersectionData;
      const interSectionCell = this.idCellMap.get(cellId);
      if (interSectionCell) {
        const { x, y } = interSectionCell;
        const intersection = new Intersection({
          x,
          y,
          cellId,
          directions: ip,
          isTrafficCell,
          select: this.select,
          $$formData: { flag: index + 1, ...intersectionData },
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
  renderElevator = (elevatorList, autoSelect = false) => {
    return elevatorList.map((elevatorData, index) => {
      const { replace, innerMapping, doors = [] } = elevatorData;
      const elevatorCellEntity = this.idCellMap.get(innerMapping[replace]);
      if (!elevatorCellEntity) return;

      const { x, y } = elevatorCellEntity;
      const elevator = new Elevator({
        id: index,
        x,
        y,
        $$formData: { flag: index + 1, ...elevatorData },
        select: this.select,
      });

      autoSelect && elevator.onSelect();
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

      return elevator;
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

  // ************************* 投递点 ************************* //
  // 渲染抛物点标记
  addDump = ({ name, x, y, callback, $$formData }) => {
    const dump = new Dump({
      x,
      y,
      name,
      $$formData,
      select: typeof callback === 'function' ? callback : this.select,
    });
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
  addDumpBasket = ({ name, x, y }) => {
    const basket = new DumpBasket(name, x, y);
    this.pixiUtils.viewportAddChild(basket);
    this.dumpBasketMap.set(`x${x}y${y}`, basket);
  };

  renderDumpFunction = (dumpStations, callback) => {
    dumpStations.forEach((dumpData, index) => {
      // 渲染抛物点
      this.addDump({
        name: dumpData.name,
        x: dumpData.x,
        y: dumpData.y,
        callback,
        $$formData: { flag: index + 1, ...dumpData },
      });

      // 渲染抛物框
      dumpData.dumpBasket.forEach((item) => {
        this.addDumpBasket({ name: item.key, x: item.x, y: item.y });

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

  /**
   * 通道
   * @param newChannelList
   * @param interact Editor点位自身包含点击事件，所以不需要动态添加
   * @param opt
   */
  renderTunnel = (newChannelList = [], interact = false, opt = 'add') => {
    newChannelList.forEach((channelData) => {
      const { tunnelName, cells, giveWayCellMap, giveWayRelationMap } = channelData;
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
      if (!isNull(giveWayCellMap)) {
        Object.entries(giveWayCellMap).forEach(([source, target]) => {
          const arrowEntity = this.idArrowMap.get(`${source}-${target}`);
          arrowEntity && arrowEntity.setProgramingFlag();
        });
      }
      if (!isNull(giveWayRelationMap)) {
        Object.values(giveWayRelationMap).forEach(({ source, target }) => {
          const arrowEntity = this.idArrowMap.get(`${source}-${target}`);
          arrowEntity && arrowEntity.setProgramingFlag();
        });
      }
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
      select: this.select,
      refresh: this.refresh,
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
      select: this.select,
      refresh: this.refresh,
    });
    this.zoneMap.set(code, mapZoneMarker);
    this.pixiUtils.viewportAddChild(mapZoneMarker);
    this.refresh();
  }

  renderImage({ code, x, y, width, height, data }, interactive) {
    const mapZoneMarker = new MapZoneMarker({
      type: ZoneMarkerType.IMG,
      code,
      x,
      y,
      width,
      height,
      data,
      interactive,
      select: this.select,
      refresh: this.refresh,
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
      select: this.select,
      refresh: this.refresh,
    });
    this.labelMap.set(code, mapLabelMarker);
    this.pixiUtils.viewportAddChild(mapLabelMarker);
    this.refresh();
  }
}
