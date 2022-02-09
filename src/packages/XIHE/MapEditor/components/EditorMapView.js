import React from 'react';
import {
  getLineFromIdLineMap,
  getCurrentRouteMapData,
  getTextureFromResources,
  loadEditorExtraTextures,
} from '@/utils/mapUtil';
import { connect } from '@/utils/RmsDva';
import { CellSize, MapSelectableSpriteType } from '@/config/consts';
import { Cell } from '@/entities';
import PixiBuilder from '@/entities/PixiBuilder';
import BaseMap from '@/components/BaseMap';

@connect()
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
    this.cellXMap = new Map(); // {[x]:[Cell]}
    this.cellYMap = new Map(); // {[y]:[Cell]}

    // 选择相关
    this.selectedCells = []; // 缓存选中的点位ID
    this.selections = []; // 选中的元素数据
  }

  async componentDidMount() {
    const { dispatch } = this.props;

    // 禁用右键菜单
    document.oncontextmenu = (event) => {
      event.preventDefault();
    };

    const htmlDOM = document.getElementById('editorPixi');
    const { width, height } = htmlDOM.getBoundingClientRect();
    window.PixiUtils = this.pixiUtils = new PixiBuilder(width, height, htmlDOM, false);
    dispatch({ type: 'editor/saveMapContext', payload: this });
    await loadEditorExtraTextures(this.pixiUtils.renderer);
  }

  // 数据清理
  clearEditorMapData = () => {
    this.cellXMap.clear();
    this.cellYMap.clear();
    this.selectedCells = [];
    this.clearEditorRouteData();
    this.onSelectCell([]);
  };

  clearEditorRouteData = () => {
    this.cellCostMap.clear();
    this.onSelectLine([]);
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

    // 保证 是否显示不可走点 状态一致
    this.switchShowBlock(this.states.hideBlock);

    const { dispatch } = window.g_app._store;
    dispatch({ type: 'editor/saveSelectLines', payload: [] });

    this.refresh();
  };

  // ************************ 点位相关 **********************
  addCell = (id, x, y) => {
    const cell = new Cell({
      id,
      x,
      y,
      showCoordinate: this.states.showCoordinate,
      select: this.selectCell,
      shiftSelect: this.shiftSelectCell,
      ctrlSelect: this.ctrlSelectCell,
      interactive: true,
    });
    if (cell.mode !== this.states.mapMode) {
      cell.switchMode(this.states.mapMode);
    }
    this.idCellMap.set(id, cell);
    this.pixiUtils.viewportAddChild(cell);
  };

  /**
   * 渲染点位
   * @param {*} cells 需要渲染点位数据
   */
  renderCells = (cells) => {
    cells.forEach((cellData) => {
      this.addCell(cellData.id, cellData.x, cellData.y);
    });
  };

  removeCells = (cells) => {
    if (cells.length > 0) {
      cells.forEach((cellId) => {
        const cellEntity = this.idCellMap.get(cellId);
        // 首先从地图上移除
        this.pixiUtils.viewportRemoveChild(cellEntity);
        // 销毁对象
        cellEntity.destroy({ children: true });
        // 剔除对象
        this.idCellMap.delete(cellId);
      });
    }
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
  cancelAllSelection = () => {
    const { dispatch } = window.g_app._store;
    this.rangeSelection(this.selections, false);
    this.selections = [];
    dispatch({ type: 'editor/updateSelections', payload: [] });
  };

  /**
   * 将选择的点位同步到 Store
   * @param {*} cells 已选中的点位ID
   */
  onSelectCell = (cells) => {
    const { dispatch } = window.g_app._store;
    dispatch({ type: 'editor/saveSelectCells', payload: cells });
  };

  /**
   * 点位单击回调
   * @param {*} cell 需要选中的点位
   * @param {*} cull 是否是取消选择
   */
  selectCell = (cell, cull = false) => {
    // Chrome调试会误将this指向Cell, 为了便于调试所以使用_this
    const _this = this;
    const { dispatch } = window.g_app._store;
    // 选中操作
    if (!cull) {
      _this.cancelAllSelection();
      // 更新标识
      _this.currentClickedCell = cell;
      _this.selections = [{ id: cell.id, type: MapSelectableSpriteType.CELL }];
    } else {
      _this.selections = _this.selections.filter(
        (item) => item.id !== cell.id || item.type !== MapSelectableSpriteType.CELL,
      );
    }
    _this.rangeSelection(_this.selections);
    _this.refresh();
    dispatch({ type: 'editor/updateSelections', payload: [..._this.selections] });
  };

  shiftSelectCell = (cell) => {
    const _this = this;
    const { dispatch, getState } = window.g_app._store;
    const { editor } = getState();
    const cells = editor.currentCells;
    const pre = _this.currentClickedCell;
    const next = cell;

    // Fetch the selection area
    const xStart = pre.x > next.x ? next.x : pre.x;
    const xEnd = pre.x > next.x ? pre.x : next.x;
    const yStart = pre.y > next.y ? next.y : pre.y;
    const yEnd = pre.y > next.y ? pre.y : next.y;

    // Fetch cell id which included
    const includedCellIds = Object.values(cells)
      .filter(({ x, y }) => {
        if (x >= xStart && x <= xEnd && y >= yStart && y <= yEnd) {
          return true;
        }
      })
      .map(({ id }) => id);

    // Fetch cell entity from 'idCellMap' and execute 'onSelect' function
    includedCellIds.forEach((id) => {
      const cellEntity = _this.idCellMap.get(id);
      cellEntity && cellEntity.onSelect();
    });

    // Record current clicked cell
    _this.currentClickedCell = cell;

    // 删除重复点位数据
    const storedCellIds = this.selections
      .filter((item) => item.type === MapSelectableSpriteType.CELL)
      .map(({ id }) => id);
    const additional = includedCellIds
      .filter((id) => !storedCellIds.includes(id))
      .map((cellId) => ({
        id: cellId,
        type: MapSelectableSpriteType.CELL,
      }));

    // 数据同步
    _this.refresh();
    _this.selections = [..._this.selections, ...additional];
    dispatch({ type: 'editor/updateSelections', payload: [..._this.selections] });
  };

  ctrlSelectCell = (cell) => {
    const _this = this;
    const { dispatch } = window.g_app._store;

    // 记录当前点击的点
    this.currentClickedCell = cell;

    // 数据同步
    _this.refresh();
    _this.selections = [..._this.selections, { id: cell.id, type: MapSelectableSpriteType.CELL }];
    dispatch({ type: 'editor/updateSelections', payload: [..._this.selections] });
  };

  batchSelectCellByDirection = (prop) => {
    const { dispatch } = window.g_app._store;
    const baseCellIds = this.selections
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
      const storedCellIds = this.selections
        .filter((item) => item.type === MapSelectableSpriteType.CELL)
        .map(({ id }) => id);

      const additional = cellSelected
        .filter((id) => !storedCellIds.includes(id))
        .map((cellId) => ({
          id: cellId,
          type: MapSelectableSpriteType.CELL,
        }));
      this.refresh();
      this.selections = [...this.selections, ...additional];
      dispatch({ type: 'editor/updateSelections', payload: [...this.selections] });
    }
  };

  // ************************ 线条相关 **********************
  /**
   * 将选择的线条同步到 Store
   * @param {*} lines 已选中的线条ID
   */
  onSelectLine = (lines) => {
    const { dispatch } = window.g_app._store;
    dispatch({ type: 'editor/saveSelectLines', payload: lines });
  };

  selectLine = (id, isAdded = true) => {
    //
  };

  ctrlSelectLine = (line) => {
    //
  };

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
  rangeSelection(selections, selected = true) {
    if (Array.isArray(selections)) {
      this.selections = selections;
      selections.forEach((selection) => {
        let entity;
        switch (selection.type) {
          case MapSelectableSpriteType.CELL:
            entity = this.idCellMap.get(selection.id);
            break;
          case MapSelectableSpriteType.COST:
            entity = this.idLineMap[selection.cost].get(`${selection.source}-${selection.target}`);
            break;
          case MapSelectableSpriteType.ZONE:
            entity = this.zoneMap.get(selection.code);
            break;
          case MapSelectableSpriteType.LABEL:
            entity = this.labelMap.get(selection.code);
            break;
          default:
            entity = null;
        }
        if (entity) {
          selected ? entity.onSelect() : entity.onUnSelect();
        }
      });
      this.refresh();
    }
  }

  render() {
    // FBI WARNING: 这里一定要给canvas父容器一个"font-size:0", 否则会被撑开5px左右
    return <div id="editorPixi" style={{ height: '100%', fontSize: 0 }} />;
  }
}
export default EditorMapView;
