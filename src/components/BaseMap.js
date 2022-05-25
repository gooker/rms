import React from 'react';
import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import {
  getAngle,
  getArrowDistance,
  getCoordinat,
  getCurrentRouteMapData,
  getDistance,
  getLineEntityFromMap,
  getTextureFromResources,
} from '@/utils/mapUtil';
import { BitText, Charger, CommonFunction, Dump, DumpBasket, Elevator, Intersection, WorkStation } from '@/entities';
import { isItemOfArray, isNull } from '@/utils/util';
import { coordinateTransformer } from '@/utils/coordinateTransformer';
import MapZoneMarker from '@/entities/MapZoneMarker';
import MapLabelMarker from '@/entities/MapLabelMarker';
import CostArrow from '@/entities/CostArrow';
import { CoordinateType, LineType } from '@/config/config';
import { MapScaleRatio, zIndex, ZoneMarkerType } from '@/config/consts';

const AllPriorities = [10, 20, 100, 1000];

function initState(context) {
  // 多种导航点类型一起显示的时候，同一个点位必定会出现多个导航点，所以value使用数组形式；该对象近用于处理地图元素属性，比如存储点等
  context.idCellMap = new Map(); // {1:Cell}
  context.xyCellMap = new Map(); // {x_y:[Cell]} // 主要用于处理点击某个点位，查看该坐标下有几个点位
  context.idNaviMap = new Map();

  context.idLineMap = new Map(); // {x1_y1_x2_y2: graphics}
  context.idArrowMap = new Map(); // {x_y:arrow}

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
    if (viewport.worldWidth !== 0 && viewport.worldHeight !== 0) {
      viewport.clampZoom({
        minWidth: viewport.worldScreenWidth * viewport.scale.x,
        minHeight: viewport.worldScreenHeight * viewport.scale.y,
        maxWidth: viewport.worldScreenWidth,
        maxHeight: viewport.worldScreenHeight,
      });

      // 返回最小缩小比例
      minMapRatio = viewport.screenWidth / viewport.worldScreenWidth;
    }
    // 记录当前地图世界宽度
    window.sessionStorage.setItem(storageKey, JSON.stringify({ x, y, width, height }));
    return minMapRatio;
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
    Object.values(this.idArrowMap).forEach((innerMap) => {
      innerMap.forEach((line) => {
        if (line.type === LineType.StraightPath) {
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
    // cells.forEach((item) => {
    //   item.cellIds.forEach((cellId) => {
    //     this.renderLineSpecialFlag(
    //       opt === 'add',
    //       `${item.nonStopCell}-${cellId}`,
    //       type,
    //       '$nonStop',
    //       'S',
    //     );
    //   });
    // });
  };

  // ************************ 线条相关 **********************
  /**
   * 绘制线条核心逻辑, 线条只与xy产生绑定关系
   * @param {Array} relationsToRender 即将渲染的线条数据
   * @param { 'land'| 'navi'} renderType 渲染物理坐标的线条还是导航坐标的线条
   * @param {{}} transform 各个地图的转换参数
   */
  renderCostLines(relationsToRender, renderType, transform) {
    // const priority = shownPriority || this.states.shownPriority;
    relationsToRender.forEach((lineData) => {
      const { type, cost, source, target } = lineData;
      const sourceCell = this.idCellMap.get(source);
      const targetCell = this.idCellMap.get(target);
      if (isNull(sourceCell) && isNull(targetCell)) return;

      // 只有显示物理坐标和直线类型线条才会显示直线
      if (renderType === CoordinateType.LAND || type === LineType.StraightPath) {
        // 因为关系线只是连接两个点位，所以无论正向还是反向都可以共用一条线。所以绘制线条时优先检测reverse
        const lineMapKey = `${sourceCell.id}-${targetCell.id}`;
        const lineEntity = this.idLineMap.get(lineMapKey);
        const reverseLineMapKey = `${targetCell.id}-${sourceCell.id}`;
        const reverseLineEntity = this.idLineMap.get(reverseLineMapKey);
        if (isNull(lineEntity) && isNull(reverseLineEntity)) {
          const relationLine = new SmoothGraphics();
          relationLine.lineStyle(2, 0xffffff);
          relationLine.moveTo(sourceCell.x, sourceCell.y);
          relationLine.lineTo(targetCell.x, targetCell.y);
          this.pixiUtils.viewportAddChild(relationLine);
          this.idLineMap.set(lineMapKey, relationLine);
        } else {
          this.idLineMap.set(lineMapKey, reverseLineEntity || lineEntity);
        }

        // 绘制箭头(箭头位置在起始点和终点的连线上，靠近起始点，箭头指向终点)
        const arrowMapKey = `${sourceCell.id}-${targetCell.id}`;
        const arrowExist = this.idArrowMap.get(arrowMapKey);
        if (!isNull(arrowExist)) {
          this.pixiUtils.viewportRemoveChild(arrowExist);
          arrowExist.destroy();
          this.idArrowMap.delete(arrowMapKey);
        }
        const angle = getAngle(sourceCell, targetCell);
        const distance = getDistance(sourceCell, targetCell);
        const offset = getArrowDistance(distance);
        const arrowPosition = getCoordinat(sourceCell, angle, offset);
        const arrow = new CostArrow({
          ...arrowPosition,
          id: arrowMapKey,
          angle,
          cost,
          select: this.select,
        });
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
      const idArrowMap = this.idArrowMap[cost];
      if (idArrowMap instanceof Map) {
        idArrowMap.forEach((line) => {
          line.switchShown(false);
        });
      }
    });
    // 如果指定优先级已经被渲染就修改透明度；如果没有渲染就放到数组中待渲染
    const priorityToRender = [];
    uiFilterData.forEach((cost) => {
      // 首先从 this.idArrowMap 中获取该优先级的线段是否显示
      const specificCostLinesMap = this.idArrowMap[cost];
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
      // if (nonStopCellIds) {
      //   nonStopCellIds.forEach((item) => {
      //     item.cellIds.forEach((cellId) => {
      //       this.renderLineSpecialFlag(
      //         true,
      //         `${item.nonStopCell}-${cellId}`,
      //         'non_stop',
      //         '$nonStop',
      //         'S',
      //       );
      //     });
      //   });
      // }
    }
    nameSpace === 'editor' && this.pipeSwitchLinesShown();
    this.refresh();
  }

  pipeSwitchLinesShown = () => {
    const { blockCellIds } = getCurrentRouteMapData();
    const { hideBlock, shownPriority, shownRelationDir, shownRelationCell } = this.states;
    Object.values(this.idArrowMap).forEach((innerMap) => {
      innerMap.forEach((line) => {
        if (line.type === LineType.StraightPath) {
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

  // 渲染线条特殊标志
  renderLineSpecialFlag = (status, value, textureName, key, size) => {
    const [source, target] = value.split('-');
    const lineEntity = getLineEntityFromMap(this.idArrowMap, source, target);
    if (!lineEntity) return;
    status
      ? lineEntity.plusAction(getTextureFromResources(textureName), key, size)
      : lineEntity.removeAction(key);
  };

  /**
   * 充电桩
   * @param {*} chargerList
   * @param {*} callback 点击回调
   * @param autoSelect
   */
  renderChargers = (chargerList, callback = null, autoSelect = false) => {
    chargerList.forEach((chargerData, index) => {
      if (!chargerData) return;
      const { x, y, name, angle, chargingCells = [] } = chargerData;
      if (x === null || y === null) return;

      const charger = new Charger({
        x,
        y,
        name,
        angle,
        $$formData: { flag: index + 1, ...chargerData },
        // 这里回调在编辑器和监控是不一样的，如果没有传入回调，则默认是编辑器的this.select
        select: typeof callback === 'function' ? callback : this.select,
      });
      autoSelect && charger.onSelect();
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
      $$formData: workStationData, // 原始DB数据
      x,
      y,
      name,
      angle,
      direction,
      icon,
      size,
      stopCellId,
      station,
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
