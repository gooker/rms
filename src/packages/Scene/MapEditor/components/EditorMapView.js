import React from 'react';
import { reverse } from 'lodash';
import BaseMap from '@/components/BaseMap';
import { getDirByAngle, isItemOfArray, isNull, isStrictNull } from '@/utils/util';
import { Cell, PixiBuilder, ResizeableEmergencyStop } from '@/entities';
import { getCurrentRouteMapData } from '@/utils/mapUtil';
import { loadEditorExtraTextures } from '@/utils/textures';
import { EditorAdaptStorageKey, MapSelectableSpriteType, SelectionType } from '@/config/consts';
import { FooterHeight } from '@/packages/Scene/MapEditor/editorEnums';
import { defaultEditorViewConfig } from '@/models/editorViewModel';

class EditorMapView extends BaseMap {
  constructor(props) {
    super(props);

    // 记录显示控制的参数
    this.states = {
      ...defaultEditorViewConfig,
    };

    // 核心业务逻辑参数
    this.cellCoordinateType = null; // 当前点位使用的坐标类型
    this.fixedEStopMap = new Map(); // 固定紧急避让区
    this.selectedCells = []; // 缓存选中的点位ID, 用于shift选择
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
   * 自适应(scale=0.15为分界线，低于0.15需要做自适应，大于0.15情况下viewport已经可以看清全貌，可以不用自适应)
   * 基准参数: 看清楚点位情况下的pixel值
   * 1. 在scale=0.15的情况下, 点圆的世界宽高是15
   * 2. 点圆的自身尺寸为140
   *
   *    var viewport = window.EditorPixiUtils.viewport
   * 3. viewport.scale.set(0.15)
   * 4. viewport.children.at(-1).navigation.getBounds()
   *
   * 5. 世界长度转Pixel: viewport.screenWidth / viewport.worldScreenWidth * [世界长度]
   * 6. Pixel转世界长度: viewport.worldScreenWidth / viewport.screenWidth * [Pixel]
   */
  adaptiveMapItem = () => {
    // 开始自适应的上限值
    let thresholdValue = window.localStorage.getItem(EditorAdaptStorageKey);
    if (isStrictNull(thresholdValue)) {
      thresholdValue = 15;
    } else {
      thresholdValue = parseInt(thresholdValue);
    }
    const { viewport } = this.pixiUtils;
    const { children, screenWidth, worldScreenWidth } = viewport;
    // 获取当前点圆的尺寸
    const currentCellCircleWidth = (screenWidth / worldScreenWidth) * 140;
    // 根据navigationCircleWidth判断是否需要自适应
    if (currentCellCircleWidth < thresholdValue) {
      children.forEach((child) => {
        if (child instanceof Cell) {
          child.scale.set(thresholdValue / currentCellCircleWidth);
        }
      });
    }
    this.refresh();
  };

  // 数据清理
  clearEditorMapData = () => {
    this.clearEditorRouteData();
  };

  clearEditorRouteData = () => {
    //
  };

  // ************************ 点位相关 **********************
  // 该方法不会进行任何转换，所以传进来的数据必须包含已转换好的xy
  renderCells = (payload) => {
    payload.forEach((item) => {
      const cell = new Cell({
        ...item,
        interactive: true,
        select: this.select,
        showCoordinate: this.states.showCoordinate,
      });

      // 检查显示相关的配置
      const { showCoordinate } = this.states;
      cell.switchCoordinationShown(showCoordinate);

      // 记录数据
      const xyCellMapKey = `${item.x}_${item.y}`;
      if (!Array.isArray(this.xyCellMap.get(xyCellMapKey))) {
        this.xyCellMap.set(xyCellMapKey, [cell]);
      } else {
        this.xyCellMap.get(xyCellMapKey).push(cell);
      }
      this.idCellMap.set(item.id, cell);
      this.pixiUtils.viewportAddChild(cell);
    });
    this.adaptiveMapItem();
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
    const { doClampZoom } = this.props;
    // 新增点位
    if (type === 'add') {
      this.renderCells(payload);
      doClampZoom();
    }
    // 删除点位
    if (type === 'remove') {
      this.removeCells(payload);
      doClampZoom();
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

    // 移动点位
    if (type === 'move') {
      Object.values(payload).forEach((cellPayload) => {
        const { id, x, y } = cellPayload;
        const cellEntity = this.idCellMap.get(id);
        cellEntity && cellEntity.updateCoordination(x, y);
      });
    }

    // *************** 以下待调整 *************** //
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
      const { editor, editorView } = window.$$state();
      this.renderCostLines(
        payload,
        editorView.shownCellCoordinateType,
        editor.currentMap?.transform ?? {},
      );
    }
    // 删除
    if (type === 'remove') {
      const { lines, arrows } = payload;
      lines.forEach((lineKey) => {
        const reverseLineMapKey = reverse(lineKey.split('-')).join('-');
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

  // ************************ 地图元素可见性设置 **********************
  // 切换显示不可走点
  switchShowBlock = (flag) => {
    this.states.hideBlock = flag;
    const { blockCellIds } = getCurrentRouteMapData();
    if (blockCellIds?.length > 0) {
      blockCellIds.forEach((cellId) => {
        const cellEntity = this.idCellMap.get(cellId);
        if (cellEntity) cellEntity.switchShown(!flag);
      });
      this.pipeSwitchArrowsShown();
      this.refresh();
    }
  };

  // 切换显示点关系线
  switchCellsLineShown = (flag) => {
    this.states.showCellsLine = flag;
    this.idLineMap.forEach((line) => {
      line.visible = flag;
    });
    this.refresh();
  };

  pipeSwitchArrowsShown = () => {
    this.idArrowMap.forEach((arrow) => {
      arrow.visible = this.getArrowShownValue(arrow);
    });
  };

  getArrowShownValue = (arrow) => {
    const { blockCellIds } = getCurrentRouteMapData('editor');
    const { hideBlock, shownPriority, showRelationsDir, showRelationsCells } = this.states;

    const { id, cost, angle } = arrow;
    const [source, target] = id.split('-');
    // 是否在显示的优先级Cost范围内
    const priorityCostFlag = shownPriority.includes(cost);
    // 是否在显示的优先级方向范围内
    const priorityDirFlag = showRelationsDir.includes(getDirByAngle(angle));
    // 是否是不可走点的线条 & 没有隐藏显示不可走点
    const isBlockLines = isItemOfArray(
      blockCellIds ?? [],
      [source, target].map((item) => parseInt(item)),
    );
    const blockCellFlag = isBlockLines ? !hideBlock : true;
    // 是否是相关点的线条
    let cellRelevantFlag = true;
    if (showRelationsCells.length > 0) {
      cellRelevantFlag = isItemOfArray(showRelationsCells, [source, target]);
    }
    // 切换显示
    return priorityCostFlag && priorityDirFlag && cellRelevantFlag && blockCellFlag;
  };

  filterArrows(uiFilterData) {
    this.states.shownPriority = uiFilterData;
    this.pipeSwitchArrowsShown();
    this.refresh();
  }

  // 根据方向过滤地图上的优先级线条
  filterRelationDir = (dirs) => {
    this.states.showRelationsDir = [...dirs];
    this.pipeSwitchArrowsShown();
    this.refresh();
  };

  // 根据点位过滤地图上的优先级线条
  filterRelationCell = (cells) => {
    this.states.showRelationsCells = cells;
    this.pipeSwitchArrowsShown();
    this.refresh();
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
    const { showEmergencyStop } = this.states;
    const eData = {
      ...data,
      showEmergency: showEmergencyStop,
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
