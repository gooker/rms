import React from 'react';
import {
  getLineFromIdLineMap,
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
import { connect } from '@/utils/RmsDva';

@connect(({ global }) => ({
  navigationCellType: global.navigationCellType,
}))
class EditorMapView extends BaseMap {
  constructor(props) {
    super(props);

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
    this.selectedCells = []; // 缓存选中的点位ID
    this.naviCellTypeColor = null; // 不同导航点类型颜色
  }

  async componentDidMount() {
    // 禁用右键菜单
    document.oncontextmenu = (event) => {
      event.preventDefault();
    };

    const htmlDOM = document.getElementById('editorPixi');
    const { width, height } = htmlDOM.getBoundingClientRect();
    this.pixiUtils = new PixiBuilder(width, height, htmlDOM, true);
    window.EditorPixiUtils = window.PixiUtils = this.pixiUtils;
    window.$$dispatch({ type: 'editor/saveMapContext', payload: this });
    await loadEditorExtraTextures(this.pixiUtils.renderer);
  }

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
    this.destroyAllLines();
    const relations = getCurrentRouteMapData()?.relations ?? [];
    this.renderCostLines(relations, relations, true, mode, this.states.shownPriority);

    // 保证是否显示不可走点 状态一致
    this.switchShowBlock(this.states.hideBlock);
    this.refresh();
  };

  // ************************ 点位相关 **********************
  renderCells = (payload) => {
    const { navigationCellType } = this.props;
    if (isNull(this.naviCellTypeColor)) {
      this.naviCellTypeColor = {};
      navigationCellType.forEach(({ code, color }) => {
        this.naviCellTypeColor[code] = color;
      });
    }

    payload.forEach((item) => {
      const cell = new Cell({
        type: item.naviCellType, // 标记是哪个厂商小车用的导航点
        id: item.id, // 原始自增ID
        oId: item.oId, // 导航点原始id
        x: item.x,
        y: item.y,
        isControl: item.isControl, // 是否是管控点
        color: this.naviCellTypeColor[item.naviCellType], // 导航点背景色

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
      this.pixiUtils.viewportAddChild(cell);
    });
  };

  removeCells = ([xyId, oIds]) => {
    const cells = this.xyCellMap.get(xyId);
    const hold = [];
    cells.forEach((item) => {
      if (oIds.includes(item.oId)) {
        this.pixiUtils.viewportRemoveChild(item);
        item.destroy();
      } else {
        hold.push(item);
      }
    });
    this.xyCellMap.set(xyId, hold);
  };

  updateCells = ({ type, payload }) => {
    // 新增点位
    if (type === 'add') {
      this.renderCells(payload);
    }
    // 新增管控点
    if (type === 'addControl') {
      if (Array.isArray(payload)) {
        payload.forEach(([xyId, id]) => {
          const cells = this.xyCellMap.get(xyId);
          if (Array.isArray(cells)) {
            cells.forEach((cellEntity) => cellEntity.addControl(id));
          }
        });
      }
    }
    // 取消管控点
    if (type === 'cancelControl') {
      if (Array.isArray(payload)) {
        payload.forEach(([xyId, oIds]) => {
          const cells = this.xyCellMap.get(xyId);
          if (Array.isArray(cells)) {
            cells.forEach((cellEntity) => {
              if (oIds.includes(cellEntity.oId)) {
                cellEntity.removeControl();
              }
            });
          }
        });
      }
    }
    // 删除点位
    if (type === 'remove') {
      payload.forEach((item) => {
        this.removeCells(item);
      });
    }

    // *************** 以下待调整 *************** //
    // 更新地址码
    if (type === 'code') {
      const selectedCells = [];
      Object.keys(payload).forEach((cellId) => {
        const newCellId = payload[cellId];
        selectedCells.push(newCellId);
        const cellEntity = this.idCellMap.get(parseInt(cellId));
        if (cellEntity) {
          cellEntity.updateCellId(newCellId);

          // 更新 idCellMap
          this.idCellMap.delete(cellId);
          this.idCellMap.set(newCellId, cellEntity);
        }
      });
      this.selectedCells = selectedCells;
    }
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
    // 配置点位类型
    if (type === 'type') {
      const { cellIds, cellType, texture } = payload;
      cellIds.forEach((cellId) => {
        const cellEntity = this.idCellMap.get(cellId);
        if (texture) {
          cellEntity.plusType(cellType, getTextureFromResources(texture));
        } else {
          cellEntity.removeType(cellType);
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
    const { editor } = window.$$state();
    const cells = editor.currentCells;

    const pre = _this.currentClickedCell;
    const next = cell;

    // 确定选择范围
    const xStart = pre.x > next.x ? next.x : pre.x;
    const xEnd = pre.x > next.x ? pre.x : next.x;
    const yStart = pre.y > next.y ? next.y : pre.y;
    const yEnd = pre.y > next.y ? pre.y : next.y;

    // 提取选择范围内的点位ID
    const includedCellIds = Object.values(cells)
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
      this.renderCostLines(
        payload,
        getCurrentRouteMapData().relations || [],
        true,
        this.states.mapMode,
      );
    }
    // 删除
    if (type === 'remove') {
      payload.forEach((line) => {
        let relationMapKey;
        if (line.type === 'line') {
          relationMapKey = `${line.source}-${line.target}`;
        }
        const [cost, lineEntity] = getLineFromIdLineMap(relationMapKey, this.idLineMap);
        if (cost && lineEntity) {
          // 首先从地图上移除
          this.pixiUtils.viewportRemoveChild(lineEntity);
          // 销毁对象
          lineEntity.destroy({ children: true });
          // 剔除对象
          this.idLineMap[cost].delete(relationMapKey);
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
