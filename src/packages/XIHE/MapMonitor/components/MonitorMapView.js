import React from 'react';
import BaseMap from '@/components/BaseMap';
import { connect } from '@/utils/dva';
import { Cell } from '@/entities';
import PixiBuilder from '@/utils/PixiBuilder';
import { loadTexturesForMap } from '@/utils/textures';
import commonStyles from '@/common.module.less';

@connect(({ global }) => ({
  hasLoadedTextures: global.hasLoadedTextures,
}))
class MonitorMapView extends BaseMap {
  constructor() {
    super();
    // 料箱货架数据 (用来处理 重载地图 时候多个逻辑区的料箱货架渲染问题)
    this.totePodsData = {};

    // 储位组信息
    this.storeCellGroup = {};

    // 记录显示控制的参数
    this.states = {
      showTote: true,
      showCoordinate: false,
      showCellPoint: true,
      shownPriority: [],
      showDistance: false,
      showRealTimeRate: false,
      showBackImg: false,
      emergencyAreashow: true, // 紧急区域
      refreshMap: false,
    };

    // 监控相关
    this.idAGVMap = new Map(); // {carID: [AGVEntity]}
    this.idLatentPodMap = new Map(); // {cellId: [PodEntity]}
    this.idLatentPodInCar = new Map(); // {podId:null} // 用来标识有哪些货架在小车身上
    this.idForkPodMap = new Map(); // {cellId: [PodEntity]}
    this.idTotePodMap = new Map(); // {cellId_L: [PodEntity]} ||  {cellId_R: [PodEntity]}

    // Locks
    this.agvLocksMap = new Map();
    this.cellLocker = null;
    this.TemporaryLockMap = new Map(); // {[x${x}y${y}]: [LockEntity]}

    // 显示小车路径
    this.filteredAGV = [];
    this.showTaskPath = false;
    this.agvTaskMap = new Map(); // {agvID: TaskActions}
    this.agvPathMap = new Map(); // {agvID:[TaskPathEntity]}
    this.agvTargetLineMap = new Map(); // {agvID:PIXI.Graphics}

    // 料箱实时任务
    this.toteTaskRealtimePath = [];

    // 料箱实时状态信息
    this.toteTaskRealtimeState = [];

    // 热度
    this.cellHeatMap = new Map();

    // 小车追踪
    this.trackAGVId = null;

    // 紧急区域
    this.emergencyAreaMap = new Map();

    // 背景图片
    // this.backImgMap = new Map();
    // 站点实时速率
    this.stationRealTimeRateMap = new Map();
  }

  async componentDidMount() {
    const { dispatch, hasLoadedTextures } = this.props;
    const htmlDOM = document.getElementById('monitorPixi');
    const { width, height } = htmlDOM.getBoundingClientRect();
    window.PixiUtils = this.pixiUtils = new PixiBuilder(width, height, htmlDOM);
    if (!hasLoadedTextures) {
      await loadTexturesForMap();
      dispatch({ type: 'global/saveHasLoadedTextures', payload: true });
    }
    dispatch({ type: 'monitor/saveMapContext', payload: this });
  }

  // ************************ 点位相关 **********************
  renderCells = (cells) => {
    if (cells.length > 0) {
      this.idCellMap.clear();
      cells.forEach(({ id, x, y }) => {
        const cell = new Cell({ id, x, y, showCoordinate: this.states.showCoordinate });
        this.idCellMap.set(id, cell);
        this.pixiUtils.viewportAddChild(cell);
      });
    }
  };

  render() {
    // FBI WARNING: 这里一定要给canvas父容器一个"font-size:0", 否则会被撑开5px左右
    return <div id="monitorPixi" className={commonStyles.monitorBodyMiddle} />;
  }
}
export default MonitorMapView;
