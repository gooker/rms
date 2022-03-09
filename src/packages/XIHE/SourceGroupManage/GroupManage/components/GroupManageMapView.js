import React from 'react';
import * as PIXI from 'pixi.js';
import { Cell, WorkStation, BitText } from '@/entities';
import { getTextureFromResources, loadEditorExtraTextures } from '@/utils/mapUtil';
import { connect } from '@/utils/RmsDva';
import BaseMap from '@/components/BaseMap';
import PixiBuilder from '@/entities/PixiBuilder';
import { CellSize, zIndex } from '@/config/consts';
import commonStyles from '@/common.module.less';

@connect()
class GroupManageMapView extends BaseMap {
  constructor() {
    super();
    this.cellData = {};

    this.idCellMap = new Map();
    this.storageGroupMap = new Map();
    this.areaGroupMap = new Map();
    this.workStationMap = new Map();
    this.commonFunctionMap = new Map();

    this.selectedCells = [];
    this.batchSelectBase = []; // 批量选择的基准点位

    // 高亮
    this.highlightCells = []; // 需要高亮的点位

    this.states = {
      shownPriority: [],
      showCoordinate: false,
    };
  }

  async componentDidMount() {
    // 禁用右键菜单
    const { dispatch } = this.props;
    document.oncontextmenu = (event) => {
      event.preventDefault();
    };

    const htmlDOM = document.getElementById('groupManagePixi');
    const { width, height } = htmlDOM.getBoundingClientRect();
    window.PixiUtils = this.pixiUtils = new PixiBuilder(width, height, htmlDOM, true);
    dispatch({ type: 'mapViewGroup/saveMapContext', payload: this });
    await loadEditorExtraTextures(this.pixiUtils.renderer);
  }


  componentWillUnmount() {
    this.clearMapStage();
    this.idCellMap.clear();
  }

  // 地图初始化
  initMapData = () => {
    this.cellData = {};
    this.idCellMap = new Map();
    this.storageGroupMap = new Map();
    this.areaGroupMap = new Map();
    this.workStationMap = new Map();
    this.commonFunctionMap = new Map();
    this.selectedCells = [];
    this.batchSelectBase = [];
  };

  // 销毁地图所有资源
  destroyMapApp = () => {
    const { cull, renderer, graphicsObject, loader, viewport } = this.pixiUtils;
    // 清理数据对象
    this.initMapData();
    // 清理纹理缓存
    PIXI.utils.destroyTextureCache();
    // 清理Loader
    loader.reset();
    // 清理cull中的对象
    cull.removeList(viewport.children);
    // 销毁viewport
    viewport.destroy(true);
    // 销毁全局graphicsObject
    graphicsObject.destroy(true);
    // 销毁 renderer
    renderer.destroy();
    this.pixiUtils = null;
  };

  // 切换逻辑区标志位
  switchedLogic = () => {
    this.initMapData();
  };

  // ************************ 点位相关 **********************
  renderCells = (cells) => {
    if (cells.length > 0) {
      this.idCellMap.clear();
      cells.forEach(({ id, x, y }) => {
        const cell = new Cell({
          id,
          x,
          y,
          interactive: false,
          showCoordinate: this.states.showCoordinate,
        });
        this.idCellMap.set(id, cell);
        this.pixiUtils.viewportAddChild(cell);
      });
    }
  };

  /**
   * 将选择的点位同步到 Store
   * @param {*} cells 已选中的点位
   */
  onSelectCell = (cells) => {
    const { dispatch } = window.g_app._store;
    dispatch({ type: 'mapViewGroup/updateSelectedCells', payload: cells });
  };

  // 高亮地图点位
  doHighlightCells = (cells) => {
    if (cells.length > 0) {
      this.idCellMap.forEach((cellEntity) => {
        cellEntity.obscure(true);
        cellEntity.scale.set(1, 1);
      });

      // 高亮
      cells.forEach((cellId, index) => {
        const cellEntity = this.idCellMap.get(cellId);
        if (cellEntity) {
          cellEntity.obscure(false);
          cellEntity.scale.set(3, 3);
          index === 0 && this.mapRenderer.mapMoveTo(cellEntity.x, cellEntity.y, 0.1);
        }
      });
    } else {
      this.idCellMap.forEach((cellEntity) => {
        cellEntity.obscure(false);
        cellEntity.scale.set(1, 1);
      });
    }

    this.highlightCells = cells;
    this.refresh();
  };

  // 点位选择
  selectCell = (cell, cull = false) => {
    if (!cull) {
      // Record current clicked cell
      this.currentClickedCell = cell;

      // Cancel all cell selected state
      this.cancelCellSelected();
      this.batchSelectBase = [];

      const selectedCells = [];
      selectedCells.push(cell.id);
      this.selectedCells = selectedCells;
      this.onSelectCell(this.selectedCells.slice());
    } else {
      this.selectedCells = this.selectedCells.filter((id) => id !== cell.id);
      this.onSelectCell(this.selectedCells.slice());
    }
    this.refresh();
  };

  shiftSelectCell = (cell) => {
    const { mapViewGroup } = window.g_app._store.getState();
    const currentCells = mapViewGroup.currentCells;
    const pre = this.currentClickedCell;
    const next = cell;

    // Fetch the selection area
    const xStart = pre.x > next.x ? next.x : pre.x;
    const xEnd = pre.x > next.x ? pre.x : next.x;
    const yStart = pre.y > next.y ? next.y : pre.y;
    const yEnd = pre.y > next.y ? pre.y : next.y;

    // Fetch cell id which included
    const includedCellIds = Object.values(currentCells)
      .filter(({ x, y }) => {
        return x >= xStart && x <= xEnd && y >= yStart && y <= yEnd;
      })
      .map(({ id }) => id);

    // Fetch cell entity from 'idCellMap' and execute 'onSelect' function
    includedCellIds.forEach((id) => {
      const cellEntity = this.idCellMap.get(`${id}`);
      cellEntity && cellEntity.onSelect();
    });

    // Record current clicked cell
    this.currentClickedCell = cell;

    // 添加到基准点
    if (this.batchSelectBase.length > 0) this.batchSelectBase.push(...includedCellIds);

    // 选择回调
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
    if (this.batchSelectBase.length > 0) this.batchSelectBase.push(cell.id);

    // Call Back
    this.onSelectCell(this.selectedCells);
    this.refresh();
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

  // 渲染站点组标记
  renderAreaGroupFlag = (name, cells) => {
    // 组名
    cells.forEach((cellId) => {
      const cellEntity = this.idCellMap.get(cellId);
      if (!cellEntity) return;
      const { x, y } = cellEntity;
      const sprite = new BitText(name, x, y - CellSize.height / 4 - 40, 0x04009a, 220);
      sprite.anchor.set(0.5);
      sprite.zIndex = zIndex.groupName;
      this.pixiUtils.viewportAddChild(sprite);
      this.areaGroupMap.set(`x${x}y${y}area${name}c${cellId}`, sprite);
    });
  };

  clearAreaGroupFlag = () => {
    // 组名
    this.areaGroupMap.forEach((sprite) => {
      this.pixiUtils.viewportRemoveChild(sprite);
      sprite.destroy(true);
    });
    this.areaGroupMap.clear();
  };

  // 渲染储位标记
  renderCellGroupFlag = (name, cells, entry, exit) => {
    // 组名
    [...cells, ...entry, ...exit].forEach((cellId) => {
      const cellEntity = this.idCellMap.get(cellId);
      const { x, y } = cellEntity;
      const sprite = new BitText(name, x, y - CellSize.height / 4 - 40, 0x04009a, 220);
      sprite.anchor.set(0.5);
      sprite.zIndex = zIndex.groupName;
      sprite.alpha = 0.8;
      this.pixiUtils.viewportAddChild(sprite);
      this.storageGroupMap.set(`x${x}y${y}n${name}c${cellId}`, sprite);
    });

    // 入口
    entry.forEach((cellId) => {
      const entryCell = this.idCellMap.get(cellId);
      entryCell &&
        entryCell.plusType(`store_group_in_${cellId}`, getTextureFromResources('enter_cell'));
    });

    // 出口
    exit.forEach((cellId) => {
      const entryCell = this.idCellMap.get(cellId);
      entryCell &&
        entryCell.plusType(`store_group_out_${cellId}`, getTextureFromResources('leave_cell'));
    });
  };

  clearCellGroupFlag = (cells, entry, exit) => {
    // 组名
    this.storageGroupMap.forEach((sprite) => {
      this.pixiUtils.viewportRemoveChild(sprite);
      sprite.destroy(true);
    });
    this.storageGroupMap.clear();

    // 入口
    entry.forEach((cellId) => {
      const entryCell = this.idCellMap.get(cellId);
      entryCell && entryCell.removeType(`store_group_in_${cellId}`);
    });

    // 出口
    exit.forEach((cellId) => {
      const exitCell = this.idCellMap.get(cellId);
      exitCell && exitCell.removeType(`store_group_out_${cellId}`);
    });
  };

  // 工作站
  addWorkStation = (workStationData) => {
    const { x, y, icon, name, angle, direction, stopCellId } = workStationData;

    // 渲染工作站主体
    const workStation = new WorkStation({ x, y, name, angle, direction, icon });
    this.pixiUtils.viewportAddChild(workStation);
    this.workStationMap.set(stopCellId, workStation);

    // 渲染工作站停止点
    const stopCell = this.idCellMap.get(stopCellId);
    stopCell && stopCell.plusType('stop', getTextureFromResources('stop'));
  };

  removeWorkStation = (stopCellId) => {
    const workStation = this.workStationMap.get(stopCellId);
    if (workStation) {
      this.pixiUtils.viewportRemoveChild(workStation);
      workStation.destroy({ children: true });
    }
    const stopCell = this.idCellMap.get(stopCellId);
    stopCell && stopCell.removeType('stop');
  };

  renderWorkStation = (workStationList = []) => {
    // 移除所有 WorkStation
    const stopCellIds = [...this.workStationMap.keys()];
    stopCellIds.forEach((stopCellId) => {
      this.removeWorkStation(stopCellId);
    });

    // 用新数据重新渲染所有 WorkStation
    workStationList.forEach((workStation) => {
      this.addWorkStation(workStation);
    });
  };

  render() {
    return <div id="groupManagePixi" className={commonStyles.monitorBodyMiddle} />;
  }
}
export default GroupManageMapView;
