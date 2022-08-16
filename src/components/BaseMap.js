import React from 'react';
import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import {
  drawRelationLine,
  getArrowDistance,
  getCoordinator,
  getDistance,
  getKeyByCoordinateType,
} from '@/utils/mapUtil';
import { BitText, Charger, Dump, DumpBasket, Elevator, Intersection, Station } from '@/entities';
import { isNull } from '@/utils/util';
import {
  convertLandAngle2Pixi,
  convertLandCoordinate2Navi,
  getCoordinateBy2Types,
  transformXYByParams,
} from '@/utils/mapTransformer';
import MapZoneMarker from '@/entities/MapZoneMarker';
import MapLabelMarker from '@/entities/MapLabelMarker';
import CostArrow from '@/entities/CostArrow';
import { CoordinateType, LineType } from '@/config/config';
import { MapScaleRatio, ZoneMarkerType } from '@/config/consts';
import StraightPath from '@/entities/StraightPath';
import { isPlainObject } from 'lodash';

function initState(context) {
  // 多种导航点类型一起显示的时候，同一个点位必定会出现多个导航点，所以value使用数组形式；该对象近用于处理地图元素属性，比如存储点等
  context.idCellMap = new Map(); // {1:Cell}
  context.xyCellMap = new Map(); // {x_y:[Cell]} // 主要用于处理点击某个点位，查看该坐标下有几个点位
  context.idNaviMap = new Map();

  context.idArrowMap = new Map(); // {sourceCellId-targetCellId:arrow}
  context.idLineMap = new Map(); // {sourceCellId-targetCellId: graphics}

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
    this.cellCoordinateType = null; // 当前点位使用的坐标类型
    this.currentLogicArea = null;
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
    this.idArrowMap.forEach((arrow) => {
      arrow.parent && arrow.parent.removeChild(arrow);
      arrow.destroy({ children: true });
    });
    this.idLineMap.forEach((line) => {
      line.parent && line.parent.removeChild(line);
      line.destroy();
    });
  };

  // 渲染地图点位类型 (新增 & 删除)
  renderCellsType = (cells = [], type, opt = 'add') => {
    cells.forEach((cellId) => {
      const cellEntity = this.idCellMap.get(cellId);
      if (cellEntity) {
        opt === 'add' && cellEntity.plusType(type);
        opt === 'remove' && cellEntity.removeType(type);
      }
    });
  };

  // 渲染休息点
  renderRestCells = (rest, opt = 'add') => {
    if (Array.isArray(rest?.cellIds)) {
      this.renderCellsType(rest?.cellIds, 'rest_cell', opt);
    }
  };

  // 渲染不可逗留点
  renderNonStopCells = (cells, opt = 'add') => {
    const cellIds = cells.map((item) => item.nonStopCell);
    this.renderCellsType(cellIds, 'non_stop', opt);
  };

  // ************************ 线条相关 **********************
  /**
   * 绘制线条核心逻辑
   * @param {Array} relationsToRender 即将渲染的线条数据
   * @param { 'land'| 'navi'} coordinateType 渲染物理坐标的线条还是导航坐标的线条
   * @param {{}} transform 各个地图的转换参数
   */
  renderCostLines(relationsToRender, coordinateType, transform) {
    relationsToRender.forEach((lineData) => {
      const { type, cost, source, target, angle, nangle } = lineData;
      const sourceCell = this.idCellMap.get(source);
      const targetCell = this.idCellMap.get(target);
      if (isNull(sourceCell) || isNull(targetCell)) return;

      // 绘制直线
      if (type === LineType.StraightPath) {
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
        // TIPS: getCoordinator计算基于物理坐标系，所以这里使用物理角度
        const arrowPosition = getCoordinator(sourceCell, angle, offset);
        const arrow = new CostArrow({
          ...arrowPosition,
          id: arrowMapKey,
          cost,
          angle: nangle,
          select: this.select,
        });
        arrow.visible = this.getArrowShownValue(arrow);
        this.pixiUtils.viewportAddChild(arrow);
        this.idArrowMap.set(arrowMapKey, arrow);
      }

      // 绘制贝塞尔曲线
      if (type === LineType.BezierPath) {
        const navigationType = sourceCell.navigationType;
        const { control1, control2, ncontrol1, ncontrol2 } = lineData;
        const lineMapKey = `${source}-${target}`;

        let transformedCP1, transformedCP2;
        let sourceX, sourceY, targetX, targetY;
        if (this.cellCoordinateType === CoordinateType.NAVI) {
          // Control Cell
          transformedCP1 = transformXYByParams(
            ncontrol1,
            navigationType,
            transform[navigationType],
          );
          transformedCP2 = transformXYByParams(
            ncontrol2,
            navigationType,
            transform[navigationType],
          );

          // Source Cell
          const result1 = transformXYByParams(
            {
              x: sourceCell.coordinate.nx,
              y: sourceCell.coordinate.ny,
            },
            navigationType,
            transform[navigationType],
          );
          sourceX = result1.x;
          sourceY = result1.y;

          // Target Cell
          const result2 = transformXYByParams(
            {
              x: targetCell.coordinate.nx,
              y: targetCell.coordinate.ny,
            },
            navigationType,
            transform[navigationType],
          );
          targetX = result2.x;
          targetY = result2.y;
        } else {
          // 物理点位模式下依然要显示成导航位置，所以画贝塞尔的控制点在这里也需要转换
          transformedCP1 = convertLandCoordinate2Navi(control1);
          transformedCP2 = convertLandCoordinate2Navi(control2);

          const source = convertLandCoordinate2Navi(sourceCell.coordinate);
          sourceX = source.x;
          sourceY = source.y;

          const target = convertLandCoordinate2Navi(targetCell.coordinate);
          targetX = target.x;
          targetY = target.y;
        }

        const bezier = new SmoothGraphics();
        bezier.lineStyle(3, 0xffffff);
        bezier.moveTo(sourceX, sourceY);
        bezier.bezierCurveTo(
          transformedCP1.x,
          transformedCP1.y,
          transformedCP2.x,
          transformedCP2.y,
          targetX,
          targetY,
        );
        this.pixiUtils.viewportAddChild(bezier);
        this.idLineMap.set(lineMapKey, bezier);
      }

      // 绘制圆弧
      if (type === LineType.ArcPath) {
        // TODO:
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

  renderChargers = (chargerList, onClick, cellMap) => {
    chargerList.forEach((chargerData, index) => {
      const { code, name, chargingCells = [] } = chargerData;

      // 取chargingCells第一个充电点计算充电桩图标位置 -> BUG: 可能有bug
      if (chargingCells.length > 0) {
        // TIPS: 这里的cellId是业务ID
        // TIPS: 当前不管是导航点位和物理点位，最终显示的方式都是在左手，所以每次渲染都用nangle
        const { cellId, nangle, angle, distance } = chargingCells[0];
        if (isNull(cellId)) return;
        const cellData = cellMap[cellId];
        const [xKey, yKey] = getKeyByCoordinateType(this.cellCoordinateType);
        // TIPS: getCoordinator 计算方式是基于物理坐标系，所以这里使用物理角度
        const source = getCoordinator({ x: cellData[xKey], y: cellData[yKey] }, angle, distance);
        const [viewX, viewY] = getCoordinateBy2Types(
          source,
          cellData.navigationType,
          this.cellCoordinateType,
        );

        // 如果选择显示的物理坐标，那么source的坐标为右手坐标，所以要正常显示的话需要转置成左手坐标
        const charger = new Charger({
          x: viewX,
          y: viewY,
          name,
          angle: nangle,
          $$formData: { flag: index + 1, ...chargerData },
          // 这里回调在编辑器和监控是不一样的，如果没有传入回调，则默认是编辑器的this.select
          select: typeof onClick === 'function' ? onClick : this.select,
        });
        this.pixiUtils.viewportAddChild(charger);
        this.chargerMap.set(code, charger);

        // 一个充电桩可能对应多个充电点，所以这里使用数组
        let lines = this.relationshipLines.get(code);
        if (!Array.isArray(lines)) {
          lines = [];
          this.relationshipLines.set(code, lines);
        }
        chargingCells.forEach((chargingCell) => {
          const cellEntity = this.idCellMap.get(chargingCell.cellId);
          if (cellEntity) {
            const relationLine = drawRelationLine(cellEntity, { x: viewX, y: viewY });
            this.pixiUtils.viewportAddChild(relationLine);
            lines.push(relationLine);
          }
        });
      } else {
        console.error('[RMS]: No Charging Cell(s)');
      }
    });
  };

  updateCharger = (charger, cellMap) => {
    if (!charger) return;
    const { code, name, chargingCells = [] } = charger;
    // 取chargingCells第一个充电点计算充电桩图标位置
    const firstChargingCell = chargingCells[0];
    if (firstChargingCell) {
      const { cellId, angle, nangle, distance } = firstChargingCell;
      const cellData = cellMap[cellId];
      const [xKey, yKey] = getKeyByCoordinateType(this.cellCoordinateType);
      const source = { x: cellData[xKey], y: cellData[yKey] };
      // TIPS: getCoordinator 计算方式是基于物理坐标系，所以这里使用物理角度
      const { x: viewX, y: viewY } = getCoordinator(source, angle, distance);
      const chargerEntity = this.chargerMap.get(code);
      chargerEntity.x = viewX;
      chargerEntity.y = viewY;
      chargerEntity.angle = nangle;
      chargerEntity.addName(name);

      // 1. 删除旧的关系线
      let lines = this.relationshipLines.get(code);
      lines.map((sprite) => {
        this.pixiUtils.viewportRemoveChild(sprite);
        sprite.destroy();
      });
      lines.length = 0;

      // 2. 重新渲染关系线
      chargingCells.forEach((chargingCell) => {
        if (chargingCell) {
          const cellEntity = this.idCellMap.get(chargingCell.cellId);
          if (cellEntity) {
            const relationLine = drawRelationLine(cellEntity, { x: viewX, y: viewY });
            this.pixiUtils.viewportAddChild(relationLine);
            lines.push(relationLine);
          }
        }
      });
    } else {
      console.error('[RMS]: No Charging Cell(s)');
    }
  };

  removeCharger = (charger) => {
    if (!charger) return;
    const { code } = charger;

    const chargerEntity = this.chargerMap.get(code);
    if (chargerEntity) {
      this.pixiUtils.viewportRemoveChild(chargerEntity);
      chargerEntity.destroy({ children: true });
    }

    const lines = this.relationshipLines.get(code);
    lines.map((sprite) => {
      this.pixiUtils.viewportRemoveChild(sprite);
      sprite.destroy();
    });
    this.relationshipLines.delete(code);
  };

  /**
   * 渲染 通用站点
   * @param stationList
   * @param {*} callback 点击通用站点回调函数
   * @param cellMap
   */
  renderStation = (stationList, callback = null, cellMap) => {
    stationList.forEach((station) => {
      // 此时这里的stopCellId是业务ID; angle是物理角度
      const { name, code, angle, nangle, offset, stopCellId } = station;
      const { icon, iconAngle, iconWidth, iconHeight } = station;

      const cellData = cellMap[stopCellId];
      const stopCell = this.idCellMap.get(stopCellId);
      if (isNull(cellData) || isNull(stopCell)) {
        console.error(
          `[RMS]: Render Station Error -> cellData: ${cellData}; stopCell: ${stopCell}`,
        );
        return;
      }

      const [xKey, yKey] = getKeyByCoordinateType(this.cellCoordinateType);
      const source = getCoordinator({ x: cellData[xKey], y: cellData[yKey] }, angle, offset);
      const [viewX, viewY] = getCoordinateBy2Types(
        source,
        cellData.navigationType,
        this.cellCoordinateType,
      );
      const commonFunction = new Station({
        x: viewX,
        y: viewY,
        name,
        angle: nangle,
        icon,
        iconAngle: convertLandAngle2Pixi(iconAngle),
        iconWidth,
        iconHeight,
        stopId: stopCellId, // TODO: 未来可能会有多个停止点，比如潜伏料箱场景
        $$formData: station,
        // 这里回调在编辑器和监控是不一样的，如果没有传入回调，则默认是编辑器的this.select
        select: typeof callback === 'function' ? callback : this.select,
      });
      this.pixiUtils.viewportAddChild(commonFunction);
      this.commonFunctionMap.set(code, commonFunction);

      // 渲染站点到停止点之间的关系线
      const dashedLine = drawRelationLine({ x: viewX, y: viewY }, stopCell);
      this.pixiUtils.viewportAddChild(dashedLine);
      this.relationshipLines.set(code, dashedLine);
    });
  };

  updateStation = (station, cellMap) => {
    // 此时这里的stopCellId是业务ID
    const { name, code, angle, nangle, offset, stopCellId } = station;
    const { icon, iconAngle, iconWidth, iconHeight } = station;

    const cellData = cellMap[stopCellId];
    const stopCell = this.idCellMap.get(stopCellId);
    if (isNull(cellData) || isNull(stopCell)) {
      console.error(`[RMS]: Render Station Error -> cellData: ${cellData}; stopCell: ${stopCell}`);
      return;
    }
    const stationSprite = this.commonFunctionMap.get(code);

    // 站点图标调整：位置、角度、图标
    const [xKey, yKey] = getKeyByCoordinateType(this.cellCoordinateType);
    const source = getCoordinator({ x: cellData[xKey], y: cellData[yKey] }, angle, offset);
    const [viewX, viewY] = getCoordinateBy2Types(
      source,
      cellData.navigationType,
      this.cellCoordinateType,
    );
    stationSprite.x = viewX;
    stationSprite.y = viewY;
    stationSprite.angle = nangle;
    stationSprite.updateStationIcon(icon, iconWidth, iconHeight, convertLandAngle2Pixi(iconAngle));
    stationSprite.addName(name);

    /******** 关系线 ********/
    const relationshipLine = this.relationshipLines.get(code);
    if (relationshipLine) {
      this.pixiUtils.viewportRemoveChild(relationshipLine);
      relationshipLine.destroy(true);
      this.relationshipLines.delete(code);
    }
    const dashedLine = drawRelationLine({ x: viewX, y: viewY }, stopCell);
    this.pixiUtils.viewportAddChild(dashedLine);
    this.relationshipLines.set(code, dashedLine);
  };

  removeStation = ({ code }) => {
    const commonFunction = this.commonFunctionMap.get(code);
    if (commonFunction) {
      this.pixiUtils.viewportRemoveChild(commonFunction);
      commonFunction.destroy({ children: true });

      // 删除站点到停止点之间的关系线
      const relationshipLine = this.relationshipLines.get(code);
      if (relationshipLine) {
        this.pixiUtils.viewportRemoveChild(relationshipLine);
        relationshipLine.destroy();
        this.relationshipLines.delete(code);
      }
    }
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

      // 电梯点替换点ID
      doors.forEach((door) => {
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
      const { tunnelName, cells, giveWayCellMap } = channelData;
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
      if (isPlainObject(giveWayCellMap)) {
        Object.entries(giveWayCellMap).forEach(([source, target]) => {
          const arrowEntity = this.idArrowMap.get(`${source}-${target}`);
          if (opt === 'add') {
            arrowEntity && arrowEntity.setProgramingFlag();
          } else {
            arrowEntity && arrowEntity.resetProgramingFlag();
          }
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
