import React from 'react';
import PixiInitializer from '@/utils/PixiInitializer';
import { loadTexturesForMap } from '@/utils/textures';
import {
  getCurveMapKey,
  getLineFromIdLineMap,
  getCurrentRouteMapData,
  getTextureFromResources,
} from '@/utils/mapUtils';
import BaseMap from '@/components/BaseMap';
import { Cell, MapRenderer } from '@/packages/Mixrobot/entities';
import { SpotSize } from '@/config/consts';

/**
 * width: Number
 * height: Number
 * finishNotice: Function: 地图基础资源加载完成后回调
 */
export default class MapView extends BaseMap {
  constructor(props) {
    super(props);

    // 记录显示控制的参数
    this.states = {
      hideBlock: false, // 是否显示不可走点
      shownPriority: [],
      shownRelationDir: ['0', '1', '2', '3'],
      shownRelationCell: [],
      showCoordinate: false,
      showDistance: false,
      mapMode: 'standard',
    };

    // 编辑器相关
    this.selectedCells = []; // The collection of selected Cells data
    this.selectedLines = []; // The collection of selected lines id
    this.batchSelectBase = []; // 批量选择的基准点位
  }

  componentDidMount() {
    // 禁用右键菜单
    document.oncontextmenu = (event) => {
      event.preventDefault();
    };

    this.pixiUtils = new PixiInitializer(this.props.width, this.props.height);
    this.mapRenderer = new MapRenderer(
      this.pixiUtils.viewport,
      this.pixiUtils.callRender,
      this.pixiUtils.renderer,
    );

    loadTexturesForMap(() => {
      this.pixiUtils.activeRender();
      typeof this.props.finishNotice === 'function' && this.props.finishNotice();
    });
  }

  // 切换地图编辑地图显示模式
  changeMapMode = (mode) => {
    this.states.mapMode = mode;

    if (mode === 'standard') {
      SpotSize.height = 100;
      SpotSize.width = 100;
    } else {
      SpotSize.height = 800;
      SpotSize.width = 800;
    }

    // 处理点位
    this.idCellMap.forEach((cell) => {
      cell.switchMode(mode);
      cell.switchCoordinationShown(this.states.showCoordinate);
    });

    // 处理Cost线条
    this.destroyAllLines();
    const relations = getCurrentRouteMapData()?.relations ?? [];
    this.drawLine(relations, relations, this.states.shownPriority, true);

    // 保证 是否显示不可走点 状态一致
    this.switchShowBlock(this.states.hideBlock);

    const { dispatch } = window.g_app._store;
    dispatch({ type: 'editor/saveSelectLines', payload: [] });

    this.mapRenderer.refresh();
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
    this.idCellMap.set(`${id}`, cell);
    this.pixiUtils.viewportAddChild(cell, true, false);
  };

  /**
   * 渲染点位
   * @param {*} cells 需要渲染点位数据
   * @param {*} clear 是否需要清理掉idCellMap数据
   */
  renderCells = (cells, clear = true) => {
    clear && this.idCellMap.clear();
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
        const cellEntity = this.idCellMap.get(`${id}`);
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
    this.mapRenderer.refresh();
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
    this.mapRenderer.refresh();
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

      // Record current clicked cell
      this.currentClickedCell = cell;

      // Cancel all cell selected state
      this.cancelCellSelected(this.selectedCells);
      this.batchSelectBase = [];

      const selectedCells = [];
      selectedCells.push(`${cell.id}`);
      this.selectedCells = selectedCells;
    } else {
      this.selectedCells = this.selectedCells.filter((id) => id !== `${cell.id}`);
    }
    this.onSelectCell(this.selectedCells.slice());
    this.mapRenderer.refresh();
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
        // 排除已隐藏的点
        if (x >= xStart && x <= xEnd && y >= yStart && y <= yEnd) {
          return true;
        }
      })
      .map(({ id }) => `${id}`);

    // Fetch cell entity from 'idCellMap' and execute 'onSelect' function
    includedCellIds.forEach((id) => {
      const cellEntity = this.idCellMap.get(`${id}`);
      cellEntity && cellEntity.onSelect();
    });

    // Record current clicked cell
    this.currentClickedCell = cell;

    // 添加到基准点
    if (this.batchSelectBase.length > 0) this.batchSelectBase.push(...includedCellIds);

    // Call Back
    this.selectedCells = [...new Set([...this.selectedCells, ...includedCellIds])];
    this.onSelectCell(this.selectedCells.slice());
    this.mapRenderer.refresh();
  };

  ctrlSelectCell = (cell) => {
    // Record current clicked cell
    this.currentClickedCell = cell;

    // Add item to collection
    const newSelectedCells = this.selectedCells.slice();
    newSelectedCells.push(`${cell.id}`);
    this.selectedCells = [...new Set(newSelectedCells)];

    // 添加到基准点
    if (this.batchSelectBase.length > 0) this.batchSelectBase.push(`${cell.id}`);

    // Call Back
    this.onSelectCell(this.selectedCells);
    this.mapRenderer.refresh();
  };

  cancelCellSelected = () => {
    const list = this.selectedCells;
    if (list && Array.isArray(list)) {
      list.forEach((id) => {
        const cellEntity = this.idCellMap.get(`${id}`);
        cellEntity && cellEntity.onUnSelect();
      });
    } else {
      this.idCellMap.forEach((cellEntity) => cellEntity.onUnSelect());
    }
    this.selectedCells = [];
  };

  batchSelectBaseLine = () => {
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
        selectedCells.push(cellEntity.id);
      }
    });
    this.selectedCells = [...new Set([...this.selectedCells, ...selectedCells])];
    this.onSelectCell(this.selectedCells.slice());
    this.mapRenderer.refresh();
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
        selectedCells.push(cellEntity.id);
      }
    });
    this.selectedCells = [...new Set([...this.selectedCells, ...selectedCells])];
    this.onSelectCell(this.selectedCells.slice());
    this.mapRenderer.refresh();
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
      const cell = this.idCellMap.get(`${cellId}`);
      cell && cell.onUnSelect();
    });
    this.selectedCells = [];
    this.batchSelectBase = [];
    this.onSelectCell([]);

    isAdded
      ? this.selectedLines.push(id)
      : this.selectedLines.splice(this.selectedLines.indexOf(id), 1);

    this.onSelectLine([...new Set(this.selectedLines)]);
    this.mapRenderer.refresh();
  };

  updateLines = ({ type, payload }) => {
    // 新增
    if (type === 'add') {
      this.drawLine(payload, getCurrentRouteMapData().relations || [], null, true);
    }
    // 删除
    if (type === 'remove') {
      payload.forEach((line) => {
        let relationMapKey;
        if (line.type === 'line') {
          relationMapKey = `${line.source}-${line.target}`;
        } else if (line.type === 'curve') {
          relationMapKey = getCurveMapKey(line);
        } else {
          console.error('Unrecognized Relation Type');
          return;
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
    this.mapRenderer.refresh();
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
    return <div id="pixi" style={{ touchAction: 'none' }} />;
  }
}
