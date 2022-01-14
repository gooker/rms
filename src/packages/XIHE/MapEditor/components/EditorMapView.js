import React from 'react';
import {
  getCurveMapKey,
  getLineFromIdLineMap,
  getCurrentRouteMapData,
  getTextureFromResources,
  loadEditorExtraTextures,
} from '@/utils/mapUtils';
import { connect } from '@/utils/dva';
import { CellSize } from '@/config/consts';
import { Cell } from '@/entities';
import PixiBuilder from '@/utils/PixiBuilder';
import BaseMap from '@/components/BaseMap';
import commonStyles from '@/common.module.less';

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

    // 编辑器相关
    this.selectedCells = []; // The collection of selected Cells data
    this.selectedLines = []; // The collection of selected lines id
    this.batchSelectBase = []; // 批量选择的基准点位
  }

  async componentDidMount() {
    const { dispatch } = this.props;

    // 禁用右键菜单
    document.oncontextmenu = (event) => {
      event.preventDefault();
    };

    const htmlDOM = document.getElementById('editorPixi');
    const { width, height } = htmlDOM.getBoundingClientRect();
    window.PixiUtils = this.pixiUtils = new PixiBuilder(width, height, htmlDOM);
    dispatch({ type: 'editor/saveMapContext', payload: this });
    await loadEditorExtraTextures(this.pixiUtils.renderer);
  }

  componentWillUnmount() {
    this.clearMapStage();
    this.idCellMap.clear();
    this.idLineMap = { 10: new Map(), 20: new Map(), 100: new Map(), 1000: new Map() };
  }

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
    this.drawLine(relations, relations, true, mode, this.states.shownPriority);

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
   * @param {*} clear 是否需要清理掉idCellMap数据
   */
  renderCells = (cells, clear = true) => {
    if (clear) {
      this.idCellMap.clear();
      this.selectedLines = [];
      this.selectedCells = [];
      this.batchSelectBase = [];
    }
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
      this.renderCells(payload, false);
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
        const cellEntity = this.idCellMap.get(cellId);
        if (cellEntity) {
          cellEntity.updateCellId(newCellId);

          // 更新 idCellMap
          this.idCellMap.delete(cellId);
          this.idCellMap.set(`${newCellId}`, cellEntity);
        }
      });
      this.selectedCells = selectedCells.map((id) => `${id}`);
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
      Object.keys(payload).forEach((cellId) => {
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
        const cellEntity = this.idCellMap.get(`${cellId}`);
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
      const cellEntity = this.idCellMap.get(`${cellId}`);
      if (cellEntity) cellEntity.switchShown(!flag);
    });
    this.pipeSwitchLinesShown();
    this.refresh();
  };

  // ************************ 框选 **********************
  rectangleSelection = (cellsInRange) => {
    // 先取消选择已选择的点位
    this.selectedCells.forEach((cellId) => {
      const cellEntity = this.idCellMap.get(cellId);
      cellEntity && cellEntity.onUnSelect();
    });

    // 缓存选择的点位
    this.onSelectCell(cellsInRange);
    this.selectedCells = [...cellsInRange];

    cellsInRange.forEach((cellId) => {
      const cellEntity = this.idCellMap.get(cellId);
      cellEntity && cellEntity.onSelect();
    });
    this.refresh();
  };

  // ************************ 点位 & 线条选择 **********************
  /**
   * 将选择的点位同步到 Store
   * @param {*} cells 已选中的点位
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
    if (!cull) {
      // Clear line selections
      this.selectedLines.forEach((id) => {
        const [, line] = getLineFromIdLineMap(id, this.idLineMap);
        line && line.unSelect();
      });
      this.selectedLines = [];
      this.onSelectLine([]);

      // 标识
      this.currentClickedCell = cell;
      this.batchSelectBase = [];

      // 先取消之前已选择的点位
      this.cancelCellSelected(this.selectedCells);
      this.selectedCells = [cell.id];
    } else {
      this.selectedCells = this.selectedCells.filter((id) => id !== cell.id);
    }
    this.onSelectCell([...this.selectedCells]);
    this.refresh();
  };

  shiftSelectCell = (cell) => {
    const { editor } = window.g_app._store.getState();
    const cells = editor.currentCells;
    const pre = this.currentClickedCell;
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
      const cellEntity = this.idCellMap.get(id);
      cellEntity && cellEntity.onSelect();
    });

    // Record current clicked cell
    this.currentClickedCell = cell;

    // 添加到基准点
    if (this.batchSelectBase.length > 0) this.batchSelectBase.push(...includedCellIds);

    // Call Back
    this.selectedCells = [...new Set([...this.selectedCells, ...includedCellIds])];
    this.onSelectCell(this.selectedCells.slice());
    this.refresh();
  };

  ctrlSelectCell = (cell) => {
    // Record current clicked cell
    this.currentClickedCell = cell;

    // Add item to collection
    const newSelectedCells = this.selectedCells.slice();
    newSelectedCells.push(cell.id);
    this.selectedCells = [...new Set(newSelectedCells)];

    // 添加到基准点
    if (this.batchSelectBase.length > 0) this.batchSelectBase.push(`${cell.id}`);

    // Call Back
    this.onSelectCell(this.selectedCells);
    this.refresh();
  };

  cancelCellSelected = (cells) => {
    console.log('cancelCellSelected: ', cells);
    if (Array.isArray(cells)) {
      cells.forEach((id) => {
        const cellEntity = this.idCellMap.get(id);
        cellEntity && cellEntity.onUnSelect();
      });
    } else {
      this.idCellMap.forEach((cellEntity) => cellEntity.onUnSelect());
    }
    this.selectedCells = [];
    this.onSelectCell([]);
  };

  batchSelectBaseRow = () => {
    // 按行选择的话，只要统计选中点的Y坐标，遍历所有点找出所有与该Y坐标相同的点位即可
    if (this.batchSelectBase.length === 0) this.batchSelectBase = [...this.selectedCells];
    const Ys = new Set();
    this.batchSelectBase.forEach((cellId) => {
      const cellEntity = this.idCellMap.get(cellId);
      cellEntity.onUnSelect();
      Ys.add(cellEntity.y);
    });

    const selectedCells = [];
    this.idCellMap.forEach((cellEntity) => {
      if (Ys.has(cellEntity.y)) {
        cellEntity.onSelect();
        selectedCells.push(`${cellEntity.id}`);
      }
    });
    this.selectedCells = [...new Set([...this.selectedCells, ...selectedCells])];
    this.onSelectCell(this.selectedCells.slice());
    this.refresh();
  };

  batchSelectBaseColumn = () => {
    // 按列选择的话，只要统计选中点的X坐标，遍历所有点找出所有与该X坐标相同的点位即可
    if (this.batchSelectBase.length === 0) this.batchSelectBase = [...this.selectedCells];
    const Xs = new Set();
    this.batchSelectBase.forEach((cellId) => {
      const cellEntity = this.idCellMap.get(cellId);
      cellEntity.onUnSelect();
      Xs.add(cellEntity.x);
    });

    const selectedCells = [];
    this.idCellMap.forEach((cellEntity) => {
      if (Xs.has(cellEntity.x)) {
        cellEntity.onSelect();
        selectedCells.push(`${cellEntity.id}`);
      }
    });
    this.selectedCells = [...new Set([...this.selectedCells, ...selectedCells])];
    this.onSelectCell(this.selectedCells.slice());
    this.refresh();
  };

  // ************************ 线条相关 **********************
  /**
   * 将选择的线条同步到 Store
   * @param {*} lines 已选中的线条
   */
  onSelectLine = (lines) => {
    const { dispatch } = window.g_app._store;
    dispatch({ type: 'editor/saveSelectLines', payload: lines });
  };

  selectLine = (id, isAdded = true) => {
    // 清空所有选中的点位
    this.selectedCells.forEach((cellId) => {
      const cell = this.idCellMap.get(cellId);
      cell && cell.onUnSelect();
    });
    this.selectedCells = [];
    this.batchSelectBase = [];
    this.onSelectCell([]);

    isAdded
      ? this.selectedLines.push(id)
      : this.selectedLines.splice(this.selectedLines.indexOf(id), 1);

    this.onSelectLine([...new Set(this.selectedLines)]);
    this.refresh();
  };

  updateLines = ({ type, payload }) => {
    // 新增
    if (type === 'add') {
      this.drawLine(
        payload,
        null,
        true,
        this.states.mapMode,
        getCurrentRouteMapData().relations || [],
      );
    }
    // 删除
    if (type === 'remove') {
      payload.forEach((line) => {
        let relationMapKey;
        if (line.type === 'line') {
          relationMapKey = `${line.source}-${line.target}`;
        }
        if (line.type === 'curve') {
          relationMapKey = getCurveMapKey(line);
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
      _dirs = ['0', '1', '2', '3'];
    }
    this.states.shownRelationDir = _dirs;
    this.pipeSwitchLinesShown();
  };

  // 根据点位过滤地图上的优先级线条
  filterRelationCell = (cells) => {
    this.states.shownRelationCell = cells;
    this.pipeSwitchLinesShown();
  };

  render() {
    // FBI WARNING: 这里一定要给canvas父容器一个"font-size:0", 否则会被撑开5px左右
    return (
      <div style={{ position: 'relative', flex: 1 }}>
        <div
          id={'mapSelectionMask'}
          className={commonStyles.mapSelectionMask}
          style={{ display: 'none' }}
        />
        <div id="editorPixi" style={{ height: '100%', fontSize: 0 }} />
      </div>
    );
  }
}
export default EditorMapView;
