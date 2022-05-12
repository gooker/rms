import React from 'react';
import { reverse } from 'lodash';
import * as PIXI from 'pixi.js';
import {
  getCurrentRouteMapData,
  getTextureFromResources,
  loadEditorExtraTextures,
} from '@/utils/mapUtil';
import { isNull } from '@/utils/util';
import BaseMap from '@/components/BaseMap';
import PixiBuilder from '@/entities/PixiBuilder';
import { Cell, ResizeableEmergencyStop } from '@/entities';
import { CellSize, MapSelectableSpriteType, SelectionType } from '@/config/consts';
import { FooterHeight } from '@/packages/Scene/MapEditor/editorEnums';
import { NavigationTypeView } from '@/config/config';

class EditorMapView extends BaseMap {
  constructor(props) {
    super(props);
    this.scale = 30;
    this.lastScale = null;

    // 记录显示控制的参数
    this.states = {
      mapMode: 'standard',
      shownPriority: [10, 20, 100, 1000],
      shownRelationDir: [0, 1, 2, 3],
      shownRelationCell: [],
      hideBlock: false,
      showCoordinate: false,
      showDistance: false,
      showBackImg: false,
      showEmergencyStop: true,
    };

    // 核心业务逻辑参数
    this.fixedEStopMap = new Map(); // 固定紧急避让区
    this.selectedCells = []; // 缓存选中的点位ID, 用于shift选择
    this.naviCellTypeColor = null; // 不同导航点类型颜色
  }

  async componentDidMount() {
    // 禁用右键菜单
    document.oncontextmenu = (event) => {
      event.preventDefault();
    };

    const htmlDOM = document.getElementById('editorPixi');
    const { width, height } = htmlDOM.getBoundingClientRect();
    this.pixiUtils = new PixiBuilder(width, height, htmlDOM, this.adaptiveMapItem);
    window.EditorPixiUtils = window.PixiUtils = this.pixiUtils;
    window.$$dispatch({ type: 'editor/saveMapContext', payload: this });
    await loadEditorExtraTextures(this.pixiUtils.renderer);
  }

  /**
   * 自适应(scale=0.4为分界线，低于0.4需要做自适应，大于0.4情况下viewport已经可以看清全貌，可以不用自适应)
   * 基准参数: 看清楚点位情况下的pixel值
   * 1. const CellHeight = 217.2;
   *    -- window.EditorPixiUtils.viewport.scale.set(0.4)
   *    -- window.EditorPixiUtils.viewport.options.screenWidth/window.EditorPixiUtils.viewport.worldScreenWidth * 267
   *    -- window.EditorPixiUtils.viewport.children.at(-1).height
   * 2. const navCircleWorldWidth = 140; // 0.4 -- 56px
   *
   *  世界长度转Pixel: viewport.screenWidth / viewport.worldScreenWidth * [世界长度]
   *  Pixel转世界长度: viewport.worldScreenWidth / viewport.screenWidth * [Pixel]
   */
  adaptiveMapItem = () => {
    const { viewport } = this.pixiUtils;
    const { children, screenWidth, worldScreenWidth, scale } = viewport;
    const navCirclePixelWidth = (screenWidth / worldScreenWidth) * 140;

    // 取样
    let worldVisibleBaseSize;
    for (const child of children) {
      if (child instanceof Cell) {
        worldVisibleBaseSize = child.$$size;
        break;
      }
    }
    let cellVisibleBasePixel = (screenWidth / worldScreenWidth) * worldVisibleBaseSize;
    cellVisibleBasePixel = (0.4 / scale.x) * cellVisibleBasePixel;
    const visibleWorldWidth = (worldScreenWidth / screenWidth) * cellVisibleBasePixel;

    // 根据navigationCircleWidth判断是否需要自适应
    if (navCirclePixelWidth < 56) {
      children.forEach((child) => {
        if (child instanceof Cell) {
          // 根据 width和height确定该点位的长宽比
          const { width, height } = child.getBounds();
          const visibleWorldHeight = (visibleWorldWidth * height) / width;
          child.width = visibleWorldWidth;
          child.height = visibleWorldHeight;
        }
      });
    }
  };

  // 数据清理
  clearEditorMapData = () => {
    this.clearEditorRouteData();
  };

  clearEditorRouteData = () => {
    //
  };

  // 切换地图编辑地图显示模式
  changeMapMode = (mode) => {
    this.states.mapMode = mode;

    if (mode === 'standard') {
      CellSize.height = 100;
      CellSize.width = 100;
    } else {
      CellSize.height = 800;
      CellSize.width = 800;
    }

    // 处理点位
    this.idCellMap.forEach((cell) => {
      cell.switchMode(mode);
      cell.switchCoordinationShown(this.states.showCoordinate);
    });

    // 处理Cost线条
    // this.destroyAllLines();
    // const relations = getCurrentRouteMapData()?.relations ?? [];
    // this.renderCostLines(relations, relations, true, mode, this.states.shownPriority);

    // 保证是否显示不可走点 状态一致
    this.switchShowBlock(this.states.hideBlock);
    this.refresh();
  };

  // ************************ 点位相关 **********************
  renderCells = (payload) => {
    if (isNull(this.naviCellTypeColor)) {
      this.naviCellTypeColor = {};
      NavigationTypeView.forEach(({ code, color }) => {
        this.naviCellTypeColor[code] = color;
      });
    }

    payload.forEach((item) => {
      const cell = new Cell({
        ...item,
        color: this.naviCellTypeColor[item.navigationType], // 导航点背景色
        interactive: true,
        select: this.select,
        showCoordinate: this.states.showCoordinate,
      });
      const xyCellMapKey = `${item.x}_${item.y}`;
      if (!Array.isArray(this.xyCellMap.get(xyCellMapKey))) {
        this.xyCellMap.set(xyCellMapKey, [cell]);
      } else {
        this.xyCellMap.get(xyCellMapKey).push(cell);
      }
      this.idCellMap.set(item.id, cell);
      this.pixiUtils.viewportAddChild(cell);
    });
  };

  removeCells = (cellIds) => {
    cellIds.forEach((cellId) => {
      // idCellMap
      const cell = this.idCellMap.get(cellId);
      const xyKey = `${cell.x}_${cell.y}`;
      this.pixiUtils.viewportRemoveChild(cell);
      cell.destroy();
      this.idCellMap.delete(cellId);

      // xyCellMap
      let xyCells = this.xyCellMap.get(xyKey);
      xyCells = xyCells.filter((item) => item.id !== cellId);
      this.xyCellMap.set(xyKey, xyCells);
    });
  };

  updateCells = ({ type, payload }) => {
    // 新增点位
    if (type === 'add') {
      this.renderCells(payload);
    }
    // 删除点位
    if (type === 'remove') {
      this.removeCells(payload);
    }
    // 更新导航ID
    if (type === 'updateNaviId') {
      const { cellId, naviId } = payload;
      const cellEntity = this.idCellMap.get(cellId);
      if (cellEntity) {
        cellEntity.updateNaviId(naviId);
      }
    }
    // 配置点位类型
    if (type === 'type') {
      const { cellIds, cellType, texture } = payload;
      cellIds.forEach((cellId) => {
        const cellEntity = this.idCellMap.get(cellId);
        if (texture) {
          cellEntity.plusType(cellType);
        } else {
          cellEntity.removeType(cellType);
        }
      });
    }

    // *************** 以下待调整 *************** //
    // 移动点位
    if (type === 'move') {
      Object.values(payload).forEach((cellPayload) => {
        const { id, x, y } = cellPayload;
        const cellEntity = this.idCellMap.get(id);
        if (cellEntity) {
          cellEntity.updateCoordination(x, y);
        }
      });
    }

    // 调整码间距
    if (type === 'adjustSpace') {
      Object.keys(payload)
        .map((item) => parseInt(item))
        .forEach((cellId) => {
          const { type: field, coord } = payload[cellId];
          const cellEntity = this.idCellMap.get(cellId);
          if (cellEntity) {
            if (field === 'x') {
              cellEntity.updateCoordination(coord, cellEntity.y);
            } else {
              cellEntity.updateCoordination(cellEntity.x, coord);
            }
          }
        });
    }

    this.refresh();
  };

  // ************************ 地图部分元素显示切换 **********************
  switchShowBlock = (flag) => {
    this.states.hideBlock = flag;
    const { blockCellIds } = getCurrentRouteMapData();
    blockCellIds.forEach((cellId) => {
      const cellEntity = this.idCellMap.get(cellId);
      if (cellEntity) cellEntity.switchShown(!flag);
    });
    this.pipeSwitchLinesShown();
    this.refresh();
  };

  // ************************ 点位 & 线条选择 **********************
  select = (entity, mode) => {
    // Chrome调试会误将this指向Cell, 为了便于调试所以使用_this
    const _this = this;

    // 先判断是否是取消选择
    let selections = [...window.$$state().editor.selections];
    const isCull = selections.includes(entity);
    if (isCull) {
      selections = selections.filter((item) => item !== entity);
    } else {
      if (mode === SelectionType.SINGLE) {
        if (entity instanceof Cell) {
          _this.currentClickedCell = entity;
        }
        selections.forEach((entity) => entity.onUnSelect());
        selections.length = 0;
        selections.push(entity);
      } else if (mode === SelectionType.CTRL) {
        if (entity instanceof Cell) {
          _this.currentClickedCell = entity;
        }
        selections.push(entity);
      } else {
        selections = _this.shiftSelectCell(entity);
      }
    }
    _this.refresh();
    window.$$dispatch({ type: 'editor/updateSelections', payload: selections });
  };

  shiftSelectCell = (cell) => {
    if (isNull(this.currentClickedCell)) return;
    const _this = this;
    const pre = _this.currentClickedCell;
    const next = cell;

    // 确定选择范围
    const xStart = pre.x > next.x ? next.x : pre.x;
    const xEnd = pre.x > next.x ? pre.x : next.x;
    const yStart = pre.y > next.y ? next.y : pre.y;
    const yEnd = pre.y > next.y ? pre.y : next.y;

    // 提取选择范围内的点位ID
    const cells = [..._this.idCellMap.values()];
    const includedCellIds = cells
      .filter((item) => item.type === MapSelectableSpriteType.CELL)
      .filter(({ x, y }) => x >= xStart && x <= xEnd && y >= yStart && y <= yEnd)
      .map(({ id }) => id);

    // 批量选中范围内的点位
    includedCellIds.forEach((id) => {
      const cellEntity = _this.idCellMap.get(id);
      cellEntity && cellEntity.onSelect();
    });

    // 重新缓存当前点击的点位，为了下一次Shift选择做准备
    _this.currentClickedCell = cell;

    // 删除重复点位数据
    const selections = [...window.$$state().editor.selections];
    const storedCellIds = selections
      .filter((item) => item.type === MapSelectableSpriteType.CELL)
      .map(({ id }) => id);

    const additional = includedCellIds
      .filter((id) => !storedCellIds.includes(id))
      .map((cellId) => _this.idCellMap.get(cellId));

    // 数据同步
    return [...selections, ...additional];
  };

  batchSelectCellByDirection = (prop) => {
    let selections = [...window.$$state().editor.selections];
    const baseCellIds = selections
      .filter((item) => item.type === MapSelectableSpriteType.CELL)
      .map(({ id }) => id);

    // 按行选择的话，只要统计选中点的Y坐标，遍历所有点找出所有与该Y坐标相同的点位即可
    if (baseCellIds.length > 0) {
      const XYs = new Set();
      baseCellIds.forEach((cellId) => {
        const cellEntity = this.idCellMap.get(cellId);
        XYs.add(cellEntity[prop]);
      });

      // 符合规则的所有点位ID
      const cellSelected = [];
      this.idCellMap.forEach((cellEntity) => {
        if (XYs.has(cellEntity[prop])) {
          cellEntity.onSelect();
          cellSelected.push(cellEntity.id);
        }
      });

      // 删除重复点位数据
      const storedCellIds = selections
        .filter((item) => item.type === MapSelectableSpriteType.CELL)
        .map(({ id }) => id);

      const additional = cellSelected
        .filter((id) => !storedCellIds.includes(id))
        .map((cellId) => this.idCellMap.get(cellId));

      this.refresh();
      selections = [...selections, ...additional];
      window.$$dispatch({ type: 'editor/updateSelections', payload: selections });
    }
  };

  // ************************ 线条相关 **********************
  updateLines = ({ type, payload }) => {
    // 新增
    if (type === 'add') {
      this.renderCostLines(payload);
    }
    // 删除
    if (type === 'remove') {
      // 删除线条分
      const { lines, arrows } = payload;

      lines.forEach((lineKey) => {
        const reverseLineMapKey = reverse(lineKey.split('_')).join('_');
        const reverseLineEntity = this.idLineMap.get(reverseLineMapKey);
        const lineEntity = this.idLineMap.get(lineKey);
        // 注意不要删除被共用的关系线
        if (isNull(reverseLineEntity) && !isNull(lineEntity)) {
          // 首先从地图上移除
          this.pixiUtils.viewportRemoveChild(lineEntity);
          // 销毁对象
          lineEntity.destroy();
        }
        this.idLineMap.delete(lineKey);
      });

      arrows.forEach((arrowKey) => {
        const arrowEntity = this.idArrowMap.get(arrowKey);
        if (arrowEntity) {
          // 首先从地图上移除
          this.pixiUtils.viewportRemoveChild(arrowEntity);
          // 销毁对象
          arrowEntity.destroy();
          // 剔除对象
          this.idArrowMap.delete(arrowKey);
        }
      });
    }
    this.refresh();
  };

  // 根据方向过滤地图上的优先级线条
  filterRelationDir = (dirs) => {
    let _dirs = [...dirs];
    if (dirs.length === 0 || dirs.length === 4) {
      _dirs = [0, 1, 2, 3];
    }
    this.states.shownRelationDir = _dirs;
    this.pipeSwitchLinesShown();
  };

  // 根据点位过滤地图上的优先级线条
  filterRelationCell = (cells) => {
    this.states.shownRelationCell = cells;
    this.pipeSwitchLinesShown();
  };

  // ************************ 框选相关 **********************
  /**
   * @param selection 选中的元素数据
   * @param remove 是否删除Map里对应的数据
   * @returns {null}
   */
  pickEntityBySelection = (selection, remove) => {
    let entity;
    switch (selection.type) {
      case MapSelectableSpriteType.CELL:
        entity = this.idCellMap.get(selection.id);
        if (remove) {
          this.idCellMap.delete(selection.id);
        }
        break;
      case MapSelectableSpriteType.ROUTE:
        entity = this.idLineMap[selection.cost].get(selection.id);
        if (remove) {
          this.idLineMap[selection.cost].delete(selection.id);
        }
        break;
      case MapSelectableSpriteType.ZONE:
        entity = this.zoneMap.get(selection.id);
        if (remove) {
          this.zoneMap.delete(selection.id);
        }
        break;
      case MapSelectableSpriteType.LABEL:
        entity = this.labelMap.get(selection.id);
        if (remove) {
          this.labelMap.delete(selection.id);
        }
        break;
      default:
        entity = null;
    }
    return entity;
  };

  // ************************ 急停区 **********************
  // 渲染固定紧急避让区
  renderFixedEStopFunction = (data) => {
    const showEmergency = this.states.showEmergencyStop;
    const eData = {
      ...data,
      showEmergency,
      refresh: this.refresh,
      select: this.select,
    };
    const fixedEStop = new ResizeableEmergencyStop(eData);
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

  // 切换急停区显示
  switchEmergencyStopShown = (flag) => {
    this.states.showEmergencyStop = flag;
    this.fixedEStopMap.forEach(function (eStop) {
      eStop.switchEStopsVisible(flag);
    });
    this.refresh();
  };

  deleteAnyTime = (selections) => {
    // 删除元素
    selections.forEach((selection) => {
      const entity = this.pickEntityBySelection(selection, true);
      if (entity) {
        this.pixiUtils.viewportRemoveChild(entity);
        entity.destroy({ children: true });
      }
    });
    this.refresh();
    window.$$dispatch({ type: 'editor/updateSelections', payload: [] });
  };

  render() {
    // FBI WARNING: 这里一定要给canvas父容器一个"font-size:0", 否则会被撑开5px左右
    return (
      <div id="editorPixi" style={{ height: `calc(100% - ${FooterHeight}px)`, fontSize: 0 }} />
    );
  }
}
export default EditorMapView;
