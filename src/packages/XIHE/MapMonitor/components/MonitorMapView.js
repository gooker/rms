import React from 'react';
import { message } from 'antd';
import { find } from 'lodash';
import * as PIXI from 'pixi.js';
import { AGVType } from '@/config/config';
import PixiBuilder from '@/entities/PixiBuilder';
import {
  dealResponse,
  formatMessage,
  getToteLayoutBaseParam,
  isEqual,
  isNull,
  isStrictNull,
} from '@/utils/util';
import {
  AGVState,
  ElementType,
  GeoLockColor,
  LatentPodSize,
  ToteAGVSize,
  zIndex,
} from '@/config/consts';
import BaseMap from '@/components/BaseMap';
import {
  convertToteLayoutData,
  getCurrentLogicAreaData,
  getElevatorMapCellId,
  getTextureFromResources,
  hasLatentPod,
  loadMonitorExtraTextures,
  unifyAgvState,
} from '@/utils/mapUtil';
import {
  BitText,
  Cell,
  EmergencyStop,
  GeoLock,
  LatentAGV,
  LatentPod,
  OpenLock,
  SorterAGV,
  TaskPath,
  TemporaryLock,
  ToteAGV,
  TotePod,
  RealtimeRate,
} from '@/entities';
import commonStyles from '@/common.module.less';
import { Category } from '@/packages/XIHE/MapMonitor/enums';
import { fetchAgvInfo } from '@/services/api';
import { SmoothGraphics } from '@pixi/graphics-smooth';

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
      shownPriority: [10, 20, 100, 1000],
      showDistance: false,
      showRealTimeRate: false,
      showBackImg: false,
      emergencyAreaShown: true, // 紧急区域
    };

    // 监控相关
    this.idAGVMap = new Map(); // {carID: [AGVEntity]}
    this.idLatentPodMap = new Map(); // {cellId: [PodEntity]}
    this.idLatentPodInCar = new Map(); // {podId:null} // 用来标识有哪些货架在小车身上
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
    this.agvTargetLineMap = new Map(); // {agvID:SmoothGraphics}

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
    const { dispatch } = this.props;
    const htmlDOM = document.getElementById('monitorPixi');
    const { width, height } = htmlDOM.getBoundingClientRect();
    window.PixiUtils = this.pixiUtils = new PixiBuilder(width, height, htmlDOM, true);
    dispatch({ type: 'monitor/saveMapContext', payload: this });
    await loadMonitorExtraTextures(this.pixiUtils.renderer);
  }

  componentWillUnmount() {
    this.clearMapStage();
    this.idCellMap.clear();
    this.idAGVMap.clear();
    this.idLatentPodMap.clear();
    this.idLineMap = { 10: new Map(), 20: new Map(), 100: new Map(), 1000: new Map() };
  }

  // ************************ 可见性控制相关 **********************
  // 地图点位显示
  switchCellShown = (flag) => {
    this.states.showCellPoint = flag;
    this.idCellMap.forEach((cell) => {
      cell.switchShown(flag);
    });
  };

  // 地图料箱显示
  switchToteShown = (flag) => {
    this.states.showTote = flag;
    this.idTotePodMap.forEach((tote) => tote.switchShown(flag));
  };

  // 站点实时速率显示
  switchStationRealTimeRateShown = (flag) => {
    this.states.showRealTimeRate = flag;
    this.stationRealTimeRateMap.forEach(function (value) {
      value.switchStationRateEntityShown(flag);
    });
  };

  // 背景显示
  switchBackImgShown = (flag) => {
    this.states.showBackImg = flag;
    this.backImgMap.forEach(function (value) {
      value.switchBackImgEntityShown(flag);
    });
  };

  // 紧急区域
  emergencyAreaShown = (flag) => {
    this.states.emergencyAreaShown = flag;
    this.emergencyAreaMap.forEach((eStop) => {
      eStop.switchEStopsVisible(flag);
    });
  };

  // 追踪小车
  trackAGV = (agvId) => {
    this.trackAGVId = agvId;
  };

  // 定位:type --> 小车、点位、货架
  locationElements = (type, id) => {
    let x;
    let y;
    let scaled;
    switch (type) {
      case 'cell': {
        const cellEntity = this.idCellMap.get(Number(id));
        if (cellEntity) {
          x = cellEntity.x;
          y = cellEntity.y;
          scaled = 0.7;
        }
        break;
      }
      case 'robot': {
        const robot = this.idAGVMap.get(`${id}`);
        if (robot) {
          x = robot.x;
          y = robot.y;
          scaled = 0.3;
        }
        break;
      }
      case 'pod': {
        const pod = this.idLatentPodMap.get(`${id}`);
        if (pod) {
          x = pod.x;
          y = pod.y;
          scaled = 0.3;
        } else {
          // 如果地上的潜伏货架没有符合条件的就查看潜伏车身上的货架
          const agvId = this.idLatentPodInCar.get(id);
          if (isNull(agvId)) return;
          const agvEntity = this.idAGVMap.get(`${agvId}`);
          x = agvEntity.x;
          y = agvEntity.y;
          scaled = 0.3;
        }
        break;
      }
      default:
        break;
    }
    if (!isNull(x) && !isNull(y)) {
      this.moveTo(x, y, scaled);
      this.refresh();
    }
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

  // ************************ 临时不可走点锁 **********************
  // 渲染临时不可走点锁
  renderTemporaryLock = (inputData) => {
    // 清除所有的临时不可走点
    this.clearTemporaryLock();

    // 渲染新的临时不可走点
    inputData.forEach((lock) => {
      const cellEntity = this.idCellMap.get(lock.cellId);
      if (cellEntity) {
        const { x, y } = cellEntity;
        const texture = getTextureFromResources('tmp_block_lock');
        const locker = new TemporaryLock(texture, x, y);
        this.pixiUtils.viewportAddChild(locker);
        this.TemporaryLockMap.set(`x${x}y${y}`, locker);
      }
    });
    this.refresh();
  };

  // 清除临时不可走点锁
  clearTemporaryLock = () => {
    this.TemporaryLockMap.forEach((locker) => {
      this.pixiUtils.viewportRemoveChild(locker);
      locker.destroy({ children: true });
    });
    this.TemporaryLockMap.clear();
    this.refresh();
  };

  // 地图元素点击事件
  onAgvClick = async ({ type, id }) => {
    const { dispatch } = this.props;
    const response = await fetchAgvInfo(type, id);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.message.fetchDataFailed' }));
    } else {
      const { mongodbAGV = {}, redisAGV = {} } = response;
      dispatch({
        type: 'monitor/saveCheckingElement',
        payload: { type: ElementType.AGV, payload: { ...mongodbAGV, ...redisAGV } },
      });
    }
  };

  // ************************ 站点报表速率显示 ********************** //
  renderCommonStationRate = (allData) => {
    const showRealTimeRate = this.states.showRealTimeRate;
    const currentMap = new Map([...this.commonFunctionMap, ...this.workStationMap]);
    allData.forEach((currentdata) => {
      const stopCellId = currentdata.stationCellId;
      const _station = currentMap.get(`${stopCellId}`);
      const cellEntity = this.idCellMap.get(`${stopCellId}`);
      if (isNull(_station) || !cellEntity) return;
      // 如果4个显示都为null 则直接return
      const { goodsRate, agvRate, waitTime, agvAndTaskProportion } = currentdata;
      if (
        isStrictNull(agvRate) &&
        isStrictNull(goodsRate) &&
        isStrictNull(waitTime) &&
        isStrictNull(agvAndTaskProportion)
      )
        return;
      const _currentdata = {
        ...currentdata,
        showRealTimeRate,
        x: _station?.x,
        y: _station?.y || 0,
        iconwidth: _station?.width || 0,
        iconheight: _station?.height || 0,
        angle: _station?.$angle || 0,
      };
      let _entity = this.stationRealTimeRateMap.get(`${stopCellId}`);
      if (!isNull(_entity)) {
        this.pixiUtils.viewportRemoveChild(_entity);
        _entity.destroy(true);
        this.stationRealTimeRateMap.delete(`${stopCellId}`);
      }
      // 新增
      const newEntity = new RealtimeRate(_currentdata);
      this.pixiUtils.viewportAddChild(newEntity);
      this.stationRealTimeRateMap.set(`${stopCellId}`, newEntity);
    });
    this.refresh();
  };

  // ************************ 小车 & 货架相关 **********************
  updateAgvCommonState = (agvc, agvState, agvEntity, agvType) => {
    const { x, y, robotId, battery, mainTain, manualMode, errorLevel } = agvState;
    const { agvStatus, currentCellId, currentDirection } = agvState;

    // 判断该 robotId 对应的小车是否是潜伏车
    if (agvEntity.type !== agvType) {
      console.warn(
        `检测到小车ID冲突. 目标ID: [${robotId}], 目标小车类型: [${agvEntity.type}]; 实际应该是: [${agvType}]`,
      );
      return;
    }

    // 1. 如果小车数据【agv.c】与 currentCellId 不一致说小车当前在电梯中；
    // 2. 此时需要对比 currentCellId 对应的点位位置与 x,y 是否一样; 一样表示在当前逻辑区，不一样表示当前小车不在这个逻辑区需要隐藏
    // 3. 但是有个隐藏bug，如果楼层间的电梯都处于同一个点位那么这个逻辑就会失效，就得要求后台在小车消息中加sectionId
    const cellEntity = this.idCellMap.get(currentCellId);
    if (cellEntity) {
      if (agvc !== currentCellId) {
        if (cellEntity.x !== x || cellEntity.y !== y) {
          this.pixiUtils.viewportRemoveChild(agvEntity);
          agvEntity.__gui__on__map = false;
          return;
        }
      }
      if (!agvEntity.__gui__on__map) {
        agvEntity.__gui__on__map = true;
        this.pixiUtils.viewportAddChild(agvEntity);
      }
    } else {
      // 如果找不到点位，那就说明现在小车在别的逻辑区
      this.pixiUtils.viewportRemoveChild(agvEntity);
      agvEntity.__gui__on__map = false;
      return;
    }

    // 更新位置
    agvEntity.x = x;
    agvEntity.y = y;
    agvEntity.currentCellId = currentCellId;

    // 更新小车状态
    if (agvStatus && agvEntity.state !== agvStatus) {
      agvEntity.updateAGVState(agvStatus);
    }

    // 手动模式
    if (manualMode !== agvEntity.manualMode) {
      agvEntity.updateManuallyMode(manualMode);
    }

    // 更新小车方向
    if (!isNull(currentDirection)) {
      agvEntity.angle = currentDirection;
    }

    // 刷新行驶路线
    this.showTaskPath && this.updateTaskPath(`${robotId}`);

    // 更新小车电池状态
    if (battery && agvEntity.battery !== battery) {
      agvEntity.updateBatteryState(battery);
    }

    // 更新小车错误等级(0:无错误; 1:error错误;  2:warn错误; 3:info错误)
    if (agvEntity.errorLevel !== errorLevel) {
      agvEntity.updateErrorLevel(errorLevel);
    }

    // 更新小车维护中状态
    if (agvEntity.mainTain !== !!mainTain) {
      agvEntity.updateMainTainState(mainTain);
    }

    // 执行跟踪
    robotId === `${this.trackAGVId}` && this.moveTo(agvEntity.x, agvEntity.y, 0.1);
  };

  // ********** 潜伏车 ********** //
  addLatentAGV = (latentAGVData) => {
    // 如果点位未渲染好直接退出
    if (this.idCellMap.size === 0) return;
    // 这里需要一个检查，因为在页面存在车的情况下刷新页面，socket信息可能比小车列表数据来得快，所以update**AGV就会创建一台车[offline]
    // 但是一旦小车列表数据到了后会再次渲染出相同的小车, 所以这里需要检查当前id的车是否存在。如果小车存在就更新，如果小车不存在且点位存在就新建小车
    let latentAGV = this.idAGVMap.get(`${latentAGVData.robotId}`);
    const cellEntity = this.idCellMap.get(latentAGVData.currentCellId);
    if (latentAGV) {
      this.updateLatentAGV([latentAGVData]);
      return latentAGV;
    }
    latentAGV = new LatentAGV({
      id: latentAGVData.robotId,
      x: latentAGVData.x || cellEntity?.x,
      y: latentAGVData.y || cellEntity?.y,
      battery: latentAGVData.battery || 0,
      errorLevel: latentAGVData.errorLevel || 0,
      state: latentAGVData.agvStatus ?? AGVState.offline,
      mainTain: latentAGVData.mainTain,
      manualMode: latentAGVData.manualMode,
      cellId: latentAGVData.currentCellId,
      angle: latentAGVData.currentDirection,
      active: true,
      click: this.onAgvClick,
    });
    cellEntity && this.pixiUtils.viewportAddChild(latentAGV);
    this.idAGVMap.set(`${latentAGVData.robotId}`, latentAGV);
    return latentAGV;
  };

  renderLatentAGV = (latentAGVList) => {
    if (Array.isArray(latentAGVList)) {
      latentAGVList.forEach((latentAGVData) => {
        const latentAGV = this.idAGVMap.get(`${latentAGVData.robotId}`);
        if (isNull(latentAGV)) {
          this.addLatentAGV(latentAGVData);
        }
      });
    }
  };

  updateLatentAGV = (allAgvStatus) => {
    for (const agv of allAgvStatus) {
      const unifiedAgvState = unifyAgvState(agv);
      const {
        x,
        y,
        podId,
        robotId,
        battery,
        mainTain,
        agvStatus,
        podDirection,
        currentCellId,
        currentDirection,
        errorLevel,
      } = unifiedAgvState;

      if (isNull(currentCellId)) return;

      // 首先处理删除小车的情况
      if (currentCellId === -1) {
        this.removeLatentAGV(robotId);
        this.refresh();
        return;
      }

      let latentAGV = this.idAGVMap.get(`${robotId}`);
      // 如果小车不存在
      if (isNull(latentAGV)) {
        // 新增小车: 登陆小车的第一条信息没有【状态】值, 就默认【离线】
        latentAGV = this.addLatentAGV({
          x,
          y,
          robotId,
          mainTain,
          currentCellId,
          currentDirection,
          battery: battery || 0,
          agvStatus: agvStatus || 'Offline',
          errorLevel: errorLevel || 0,
        });
      }
      if (isNull(latentAGV)) return;

      // 更新通用状态
      this.updateAgvCommonState(agv.c, unifiedAgvState, latentAGV, AGVType.LatentLifting);

      // 卸货: podId不存在但是小车还有货物的时候需要卸货 --> {robotId: "x", currentCellId: 46, currentDirection: 0, mainTain: false, battery: 54, podId: 0}
      if (!hasLatentPod(podId) && latentAGV && latentAGV.pod) {
        this.idLatentPodInCar.delete(latentAGV.pod.id);
        latentAGV.downPod();
      }

      // 刷新小车上货架的状态
      if (hasLatentPod(podId)) {
        this.refreshLatentPod({
          podId,
          robotId,
          cellId: currentCellId,
          direction: podDirection,
          h: 1050, // 下车身上的货架不需要展示尺寸，所以随便给个数值
          w: 1050,
        });
      }

      latentAGV.dirty = true;
      this.refresh();
    }
  };

  removeLatentAGV = (robotId) => {
    const latentAGV = this.idAGVMap.get(`${robotId}`);
    if (latentAGV) {
      // 如果现在身上驮着货架就要放下
      if (latentAGV.podId) {
        const podId = latentAGV.podId;
        const podAngle = latentAGV.pod.angle;
        latentAGV.downPod();
        // 删除该货架在车身的标记
        this.idLatentPodInCar.delete(podId);
        // 将该货架刷新到地上
        this.refreshLatentPod({ podId, cellId: latentAGV.currentCellId, direction: podAngle });
      }
      this.pixiUtils.viewportRemoveChild(latentAGV);
      latentAGV.destroy({ children: true });
      this.idAGVMap.delete(`${robotId}`);
    }
  };

  // ********** 潜伏货架 ********** //
  addLatentPod = (latentPodData) => {
    if (this.idCellMap.size === 0) return;
    const { podId, cellId, angle, width, length: height } = latentPodData;
    const cellEntity = this.idCellMap.get(cellId);
    // 这里需要做一次检查: 因为小车的状态信息可能比货架信息来的早, 一旦某货架和小车已经存在绑定关系
    // 就会在渲染的小车上渲染出该货架, 但后到的货架信息会在该点重新渲染正常状态的货架从而造成一个地图上存在两个相同的货架
    const exist = this.idLatentPodInCar.has(podId);
    if (!exist) {
      const latentPod = new LatentPod({
        id: podId,
        cellId,
        width,
        height,
        angle: angle || 0,
        x: cellEntity ? cellEntity.x : null,
        y: cellEntity ? cellEntity.y : null,
      });
      latentPod.dirty = true;
      cellEntity && this.pixiUtils.viewportAddChild(latentPod);
      this.idLatentPodMap.set(`${podId}`, latentPod);
    }
  };

  renderLatentPod = (latentPodList) => {
    if (Array.isArray(latentPodList)) {
      latentPodList.forEach((latentPod) => {
        this.addLatentPod(latentPod);
      });
      this.refresh();
    }
  };

  refreshLatentPod = (podStatus) => {
    const { podId, robotId, cellId: currentCellId, direction: podDirection = 0 } = podStatus;
    const width = podStatus.w || LatentPodSize.width;
    const height = podStatus.h || LatentPodSize.height;

    if (currentCellId === -1) {
      // 删除Pod
      const latentPod = this.idLatentPodMap.get(`${podId}`);
      if (latentPod) {
        this.pixiUtils.viewportRemoveChild(latentPod);
        latentPod.destroy({ children: true });
        this.idLatentPodMap.delete(`${podId}`);
        this.refresh();
      }
      return;
    }

    // 如果当前车找不到点位就不做任何更新
    const cellEntity = this.idCellMap.get(currentCellId);
    if (!cellEntity) return;

    if (robotId) {
      // 如果有货架绑定在车上，那么此时货架要么在点位上要么在车上
      const latentAGV = this.idAGVMap.get(`${robotId}`);
      if (latentAGV) {
        let latentPod;
        if (latentAGV.pod) {
          // 如果在小车上只需要更新部分数据
          latentPod = latentAGV.pod;
        } else {
          // 地上的货架和新建的货架都需要更新大量的数据，所以这里放在一起无差别处理
          latentPod = this.idLatentPodMap.get(`${podId}`);
          if (!latentPod) {
            if (cellEntity) {
              latentPod = new LatentPod({
                id: podId,
                angle: podDirection,
                cellId: currentCellId,
                x: cellEntity.x,
                y: cellEntity.y,
                width,
                height,
              });
            } else {
              return;
            }
          }
          latentPod.position.set(0, 0);
          latentPod.setAlpha(0.9);
          latentPod.width = LatentPodSize.width / 2;
          latentPod.height = LatentPodSize.height / 2;
          // 标记该潜伏货架正在小车身上
          this.idLatentPodInCar.set(`${podId}`, robotId);
          latentAGV.upPod(latentPod);
          this.idLatentPodMap.delete(`${podId}`);
        }
        latentPod.visible = true;
        latentPod.cellId = currentCellId;
        latentPod.setAlgle(podDirection);
      }
    } else {
      // 首先看这个pod是否已经存在, 不存在的话再添加, 存在的话可能是更新位置
      const latentPod = this.idLatentPodMap.get(`${podId}`);
      if (latentPod) {
        latentPod.x = cellEntity.x;
        latentPod.y = cellEntity.y;
        latentPod.resize(width, height);
        latentPod.setAlgle(podDirection);
      } else {
        this.addLatentPod({
          id: podId,
          cellId: currentCellId,
          angle: podDirection,
          width,
          length: height,
        });
      }
    }
    this.refresh();
  };

  // ********** 料箱车 ********** //
  addToteAGV = (toteAGVData) => {
    // 如果点位未渲染好直接退出
    if (this.idCellMap.size === 0) return;
    // 这里需要一个检查，因为在页面存在车的情况下刷新页面，socket信息可能比小车列表数据来得快，所以update**AGV就会创建一台车[offline]
    // 但是一旦小车列表数据到了后会再次渲染出相同的小车, 所以这里需要检查当前id的车是否存在。如果小车存在就更新，如果小车不存在且点位存在就新建小车
    let toteAGV = this.idAGVMap.get(`${toteAGVData.robotId}`);
    const cellEntity = this.idCellMap.get(toteAGVData.currentCellId);
    if (toteAGV) {
      this.updateToteAGV([toteAGVData]);
      return toteAGV;
    }
    const { checkAGV, simpleCheckAgv } = this.props;
    toteAGV = new ToteAGV({
      x: toteAGVData.x || cellEntity.x,
      y: toteAGVData.y || cellEntity.y,
      id: toteAGVData.robotId,
      cellId: toteAGVData.currentCellId,
      angle: toteAGVData.currentDirection,
      shelfs: toteAGVData.shelfs || 0,
      battery: toteAGVData.battery || 0,
      errorLevel: toteAGVData.errorLevel || 0,
      state: toteAGVData.agvStatus || AGVState.offline,
      manualMode: toteAGVData.manualMode,
      toteCodes: toteAGVData.toteCodes || [null],
      active: true,
      checkAGV,
      simpleCheckAgv,
    });
    cellEntity && this.pixiUtils.viewportAddChild(toteAGV);
    this.idAGVMap.set(`${toteAGVData.robotId}`, toteAGV);

    return toteAGV;
  };

  renderToteAGV = (toteAGVList) => {
    if (Array.isArray(toteAGVList)) {
      toteAGVList.forEach((toteAGVData) => {
        const toteAGV = this.idAGVMap.get(`${toteAGVData.robotId}`);
        if (isNull(toteAGV)) {
          this.addToteAGV(toteAGVData);
        }
      });
    }
  };

  removeToteAGV = (robotId) => {
    const toteAGV = this.idAGVMap.get(`${robotId}`);
    if (toteAGV) {
      this.pixiUtils.viewportRemoveChild(toteAGV);
      toteAGV.destroy({ children: true });
      this.idAGVMap.delete(`${robotId}`);
    }
  };

  updateToteAGV = (toteAGVStatus) => {
    for (const agv of toteAGVStatus) {
      const unifiedAgvState = unifyAgvState(agv);
      const {
        x,
        y,
        robotId,
        battery,
        shelfs,
        mainTain,
        holdTote,
        toteCodes,
        agvStatus,
        currentCellId,
        currentDirection,
        errorLevel,
      } = unifiedAgvState;

      if (isNull(currentCellId)) return;

      // 首先处理删除小车的情况
      if (currentCellId === -1) {
        this.removeToteAGV(robotId);
        this.refresh();
        return;
      }

      let toteAGV = this.idAGVMap.get(`${robotId}`);
      // 如果小车不存在
      if (isNull(toteAGV)) {
        // 新增小车: 登陆小车的第一条信息没有【状态】值, 就默认【离线】
        toteAGV = this.addToteAGV({
          x,
          y,
          robotId,
          shelfs,
          mainTain,
          toteCodes,
          currentCellId,
          currentDirection,
          battery: battery || 0,
          agvStatus: agvStatus || 'Offline',
          errorLevel: errorLevel || 0,
        });
      }
      if (isNull(toteAGV)) return;

      // 更新通用状态
      this.updateAgvCommonState(agv.c, unifiedAgvState, toteAGV, AGVType.Tote);

      // 更新料箱车货架
      if (shelfs && toteAGV.shelfs !== shelfs) {
        toteAGV.refreshShelfs(shelfs);
      }

      // 更新料箱车料箱
      if (toteCodes && !isEqual(toteAGV.toteCodes, toteCodes)) {
        toteAGV.updateTotes(toteCodes);
      }

      // 更新抱夹料箱
      toteAGV.updateHolding(holdTote);

      // 渲染料箱任务实时路径(北斗七星图)
      if (Array.isArray(this.toteTaskRealtimeData) && this.toteTaskRealtimeData.length > 0) {
        const realtime = find(this.toteTaskRealtimeData, { rid: robotId });
        realtime && this.renderToteTaskRealtimePaths(robotId, x, y, realtime.bcodes ?? []);
      }

      toteAGV.dirty = true;
      this.refresh();
    }
  };

  // 更新料箱车车上货架显示效果和抱夹显示效果
  updateToteState = (toteState) => {
    const { robotId, toteCodes, holdingTote } = toteState;
    const toteAGV = this.idAGVMap.get(`${robotId}`);
    if (toteAGV) {
      toteAGV.updateTotes(toteCodes);
      toteAGV.updateHolding(holdingTote);
      this.refresh();
    }
  };

  // ********** 料箱货架 ********** //
  addTotePod = (totePodData) => {
    /**
     * @Update 更新方法使其支持四个方向: 2020年07月28日
     * @Tip 这里的 leftRack 和 rightRack 是相当于小车的方向
     * @agvDirection === 0 向上
     * @agvDirection === 1 向右
     * @agvDirection === 2 向下
     * @agvDirection === 3 向左
     */
    this.totePodsData = totePodData;
    const _this = this;
    if (!totePodData.rackGroups) return;
    Object.keys(totePodData.rackGroups).forEach((rack) => {
      // 巷道数据, 包含车辆方向和料箱数据
      const rackGroupData = totePodData.rackGroups[rack];
      const { agvDirection, leftRack, rightRack } = rackGroupData;
      // 左侧料箱货架
      if (leftRack && leftRack.bins) {
        const { angle, XBase, YBase, offset, adapte } = getToteLayoutBaseParam(agvDirection, 'L');
        leftRack.bins.forEach((bin) => {
          const cellEntity = _this.idCellMap.get(bin.binCellId);
          if (cellEntity && !bin.disable) {
            let x;
            let y;
            if (adapte === 'X') {
              x = cellEntity.x + XBase * (bin.depth / 2 + ToteAGVSize.width / 2 + 150);
              y = cellEntity.y + YBase * offset;
            } else {
              x = cellEntity.x + XBase * offset;
              y = cellEntity.y + YBase * (bin.depth / 2 + ToteAGVSize.width / 2 + 150);
            }
            const totePod = new TotePod({
              x,
              y,
              angle,
              side: 'L',
              checkTote: this.props.checkTote,
              ...bin,
            });
            totePod.switchShown(this.states.showTote);
            _this.pixiUtils.viewportAddChild(totePod);
            _this.idTotePodMap.set(bin.code, totePod);
          }
        });
      }
      // 右侧料箱货架
      if (rightRack && rightRack.bins) {
        const { angle, XBase, YBase, offset, adapte } = getToteLayoutBaseParam(agvDirection, 'R');
        rightRack.bins.forEach((bin) => {
          const cellEntity = _this.idCellMap.get(bin.binCellId);
          if (cellEntity && !bin.disable) {
            let x;
            let y;
            if (adapte === 'X') {
              x = cellEntity.x + XBase * (bin.depth / 2 + ToteAGVSize.width / 2 + 150);
              y = cellEntity.y + YBase * offset;
            } else {
              x = cellEntity.x + XBase * offset;
              y = cellEntity.y + YBase * (bin.depth / 2 + ToteAGVSize.width / 2 + 150);
            }
            const totePod = new TotePod({
              x,
              y,
              angle,
              side: 'R',
              checkTote: this.props.checkTote,
              ...bin,
            });
            _this.pixiUtils.viewportAddChild(totePod);
            _this.idTotePodMap.set(bin.code, totePod);
          }
        });
      }
    });
  };

  renderTotePod = (toteLayoutData) => {
    const rackGroups = toteLayoutData?.rackGroups;
    if (!rackGroups) return;
    const newTotePodData = convertToteLayoutData(toteLayoutData);
    this.addTotePod(newTotePodData);
  };

  // ********** 分拣车 ********** //
  addSorterAGV = (sorterAGVData) => {
    // 如果点位未渲染好直接退出
    if (this.idCellMap.size === 0) return;
    // 这里需要一个检查，因为在页面存在车的情况下刷新页面，socket信息可能比小车列表数据来得快，所以update**AGV就会创建一台车[offline]
    // 但是一旦小车列表数据到了后会再次渲染出相同的小车, 所以这里需要检查当前id的车是否存在。如果小车存在就更新，如果小车不存在且点位存在就新建小车
    let sorterAGV = this.idAGVMap.get(`${sorterAGVData.robotId}`);
    const cellEntity = this.idCellMap.get(sorterAGVData.currentCellId);
    if (sorterAGV) {
      this.updateSorterAGV([sorterAGVData]);
      return sorterAGV;
    }
    const { checkAGV, simpleCheckAgv } = this.props;
    sorterAGV = new SorterAGV({
      id: sorterAGVData.robotId,
      x: sorterAGVData.x || cellEntity.x,
      y: sorterAGVData.y || cellEntity.y,
      battery: sorterAGVData.battery || 0,
      errorLevel: sorterAGVData.errorLevel || 0,
      state: sorterAGVData.agvStatus ?? AGVState.offline,
      mainTain: sorterAGVData.mainTain,
      manualMode: sorterAGVData.manualMode,
      cellId: sorterAGVData.currentCellId,
      angle: sorterAGVData.currentDirection,
      active: true,
      checkAGV,
      simpleCheckAgv,
    });
    cellEntity && this.pixiUtils.viewportAddChild(sorterAGV);
    this.idAGVMap.set(`${sorterAGVData.robotId}`, sorterAGV);
    return sorterAGV;
  };

  renderSorterAGV = (sorterAGVList) => {
    if (Array.isArray(sorterAGVList)) {
      sorterAGVList.forEach((sorterAGVData) => {
        const sorterAGV = this.idAGVMap.get(`${sorterAGVData.robotId}`);
        if (isNull(sorterAGV)) {
          this.addSorterAGV(sorterAGVData);
        }
      });
    }
  };

  updateSorterAGV = (allAgvStatus) => {
    for (const agv of allAgvStatus) {
      const unifiedAgvState = unifyAgvState(agv);
      const {
        x,
        y,
        robotId,
        battery,
        mainTain,
        agvStatus,
        sorterPod,
        currentCellId,
        currentDirection,
        errorLevel,
      } = unifiedAgvState;

      if (isNull(currentCellId)) return;

      // 首先处理删除小车的情况
      if (currentCellId === -1) {
        this.removeSorterAGV(robotId);
        this.refresh();
        return;
      }

      let sorterAGV = this.idAGVMap.get(`${robotId}`);
      // 如果小车不存在
      if (isNull(sorterAGV)) {
        // 新增小车: 登陆小车的第一条信息没有【状态】值, 就默认【离线】
        sorterAGV = this.addSorterAGV({
          x,
          y,
          robotId,
          mainTain,
          currentCellId,
          currentDirection,
          battery: battery || 0,
          errorLevel: errorLevel || 0,
          agvStatus: agvStatus || 'Offline',
        });
      }
      if (isNull(sorterAGV)) return;

      // 更新通用状态
      this.updateAgvCommonState(agv.c, unifiedAgvState, sorterAGV, AGVType.Sorter);

      // 更新小车车身货架
      sorterAGV.updatePod(sorterPod);

      sorterAGV.dirty = true;
      this.refresh();
    }
  };

  removeSorterAGV = (robotId) => {
    const sorterAGV = this.idAGVMap.get(`${robotId}`);
    if (sorterAGV) {
      this.pixiUtils.viewportRemoveChild(sorterAGV);
      sorterAGV.destroy({ children: true });
      this.idAGVMap.delete(`${robotId}`);
    }
  };

  // ************************ 渲染小车锁格 ********************** //
  renderLockCell = (inputData) => {
    // 清除所有的几何锁
    this.clearAllLocks();

    // 渲染新的所有指定类型的锁
    inputData.forEach((lockData) => {
      // 校验锁格数据，尤其是宽高
      if (!lockData.height || !lockData.width) {
        message.error(
          formatMessage(
            { id: 'monitor.tip.LockDataAbnormal' },
            {
              detail: `robotId: ${lockData.robotId}; Height: ${lockData.height}; Width: ${lockData.width}`,
            },
          ),
        );
      }
      const { lockType, locked } = lockData;
      const color = locked ? GeoLockColor[lockType] : GeoLockColor.WillLocked;
      let geoLock;
      if (lockData.boxAction === 'GOTO_ROTATING') {
        geoLock = new OpenLock({ ...lockData, color });
      } else {
        geoLock = new GeoLock({ ...lockData, color });
      }
      this.agvLocksMap.set(
        `r${lockData.robotId}x${lockData.posX}y${lockData.posY}t${Math.random()}`, // 防止重复key导致覆盖
        geoLock,
      );
      this.pixiUtils.viewportAddChild(geoLock);
    });
  };

  clearAllLocks = () => {
    this.agvLocksMap.forEach((locker) => {
      this.pixiUtils.viewportRemoveChild(locker);
      if (locker instanceof OpenLock) {
        locker.destroy(true);
      } else {
        if (locker.shape === 'Rectangle') {
          locker.destroy({ children: true });
        } else {
          locker.destroy(true);
        }
      }
    });
    this.agvLocksMap.clear();
  };

  // ************************ 渲染点位锁格 ********************** //
  renderCellLocks = (lockData) => {
    // 清除所有的几何锁
    this.clearCellLocks();
    if (!lockData) return;

    // 渲染新的所有指定类型的锁
    // 校验锁格数据，尤其是宽高
    if (!lockData.height || !lockData.width) {
      message.error(
        formatMessage(
          { id: 'monitor.tip.LockDataAbnormal' },
          {
            detail: `robotId: ${lockData.robotId}; Height: ${lockData.height}; Width: ${lockData.width}`,
          },
        ),
      );
    }
    const { lockType, locked } = lockData;
    const color = locked ? GeoLockColor[lockType] : GeoLockColor.WillLocked;
    let geoLock;
    if (lockData.boxAction === 'GOTO_ROTATING') {
      geoLock = new OpenLock({ ...lockData, color });
    } else {
      geoLock = new GeoLock({ ...lockData, color });
    }
    this.cellLocker = geoLock;
    this.pixiUtils.viewportAddChild(geoLock);
  };

  clearCellLocks = () => {
    if (isNull(this.cellLocker)) return;
    this.pixiUtils.viewportRemoveChild(this.cellLocker);
    if (this.cellLocker instanceof OpenLock) {
      this.cellLocker.destroy(true);
    } else {
      if (this.cellLocker.shape === 'Rectangle') {
        this.cellLocker.destroy({ children: true });
      } else {
        this.cellLocker.destroy(true);
      }
    }
    this.cellLocker = null;
  };

  // ************************ 渲染小车行驶路径路径 ********************** //
  registerShowTaskPath = (agvTasks = [], showTaskPath) => {
    this.filteredAGV = window.g_app._store.getState().monitorView.selectAgv;
    this.showTaskPath = showTaskPath;

    // 前置处理
    if (!this.showTaskPath) {
      // 清除所有路线数据缓存
      this.agvTaskMap.clear();
      // 清除掉所有的路线
      this.agvPathMap.forEach((paths) => {
        paths.forEach((path) => {
          this.pixiUtils.viewportRemoveChild(path);
          path.destroy({ children: true });
        });
        paths.length = 0;
      });
      this.agvPathMap.clear();
    } else {
      // 根据最新的agvTasks来确定目前需要渲染的小车任务路径，删除不需要渲染的路径. 比如：搜索 100，101小车，但是101小车没有任务路径，所以返回值不会包含101小车的数据
      const agvToRenderPath = agvTasks.map((agvTask) => `${agvTask.r}`);
      const agvToSplit = [];
      [...this.agvPathMap.keys()].forEach((agvId) => {
        if (!agvToRenderPath.includes(agvId)) {
          agvToSplit.push(agvId);
          const paths = this.agvPathMap.get(agvId);
          paths.forEach((path) => {
            this.pixiUtils.viewportRemoveChild(path);
            path.destroy({ children: true });
          });
        }
      });
      agvToSplit.forEach((agvId) => {
        this.agvPathMap.delete(agvId);
        this.agvTaskMap.delete(agvId);
      });
    }

    // 缓存当前执行的任务
    agvTasks.forEach((agvTask) => {
      // 现在只会在路径发生变化的时候才会发送路径点位cId, 所以这里只会保存包含cId的消息, 不包含cId的消息只会用来更新si和ei字段
      if (agvTask.hasOwnProperty('c')) {
        this.agvTaskMap.set(`${agvTask.r}`, agvTask);
      } else {
        // 否则只是更改 startIndex(si) 和 endIndex(ei)
        const storedAGVTask = this.agvTaskMap.get(`${agvTask.r}`);
        if (storedAGVTask) {
          storedAGVTask.si = agvTask.si;
          storedAGVTask.ei = agvTask.ei;
        }
      }
    });
    this.refresh();
  };

  updateTaskPath = (robotId) => {
    // 清除路径线
    const paths = this.agvPathMap.get(robotId);
    if (paths && paths.length > 0) {
      paths.forEach((path) => {
        this.pixiUtils.viewportRemoveChild(path);
        path.destroy({ children: true });
      });
    }
    this.agvPathMap.delete(robotId);

    // 清除目标线
    const targetLineSprite = this.agvTargetLineMap.get(robotId);
    if (targetLineSprite) {
      this.pixiUtils.viewportRemoveChild(targetLineSprite);
      targetLineSprite.destroy(true);
      this.agvTargetLineMap.delete(robotId);
    }

    // 渲染新的路线
    if (!this.filteredAGV.includes(robotId)) return;
    this.renderTaskPaths(robotId);
    this.refresh();
  };

  renderTaskPaths = (agvId) => {
    const { showFullPath, showTagetLine } = window.g_app._store.getState().monitorView.routeView;

    // 渲染新的路径
    const _this = this;
    const agvTaskMessage = this.agvTaskMap.get(agvId);
    if (agvTaskMessage) {
      const { si: currentCellIdIndex, ei: endIndex, c: cellIds } = agvTaskMessage;
      const types = { passed: [], locked: [], future: [] };
      const pathCellIds = cellIds.map((id) => `${id}`);

      // 确定区间
      // 只要是走过的线段都是灰色的
      if (showFullPath) {
        const tmpPassed = pathCellIds.slice(0, currentCellIdIndex + 1);
        tmpPassed.length > 0 &&
          tmpPassed.reduce((pre, next) => {
            types.passed.push({ start: pre, end: next });
            return next;
          });
      }

      // 已经锁中的为绿色
      const tmpLocked = pathCellIds.slice(currentCellIdIndex, endIndex + 1);
      tmpLocked.length > 0 &&
        tmpLocked.reduce((pre, next) => {
          types.locked.push({ start: pre, end: next });
          return next;
        });

      // 将要走的是黄色
      if (showFullPath) {
        const tmpFuture = pathCellIds.slice(endIndex, pathCellIds.length + 1);
        tmpFuture.length > 0 &&
          tmpFuture.reduce((pre, next) => {
            types.future.push({ start: pre, end: next });
            return next;
          });
      }

      // 开始渲染
      Object.keys(types).forEach((typeKey) => {
        types[typeKey].forEach((path) => {
          _this.addTaskPath(
            agvId,
            getElevatorMapCellId(path.start),
            getElevatorMapCellId(path.end),
            typeKey,
          );
        });
      });

      // 渲染小车到目标点的连线
      if (showTagetLine) {
        const agvData = this.idAGVMap.get(agvId);
        let lineEnd = pathCellIds[pathCellIds.length - 1];
        lineEnd = getElevatorMapCellId(lineEnd);
        const targetCell = this.idCellMap.get(lineEnd);

        const targetLineSprite = new SmoothGraphics();
        targetLineSprite.lineStyle(20, 0x287ada, 1);
        targetLineSprite.moveTo(agvData.x, agvData.y);
        targetLineSprite.lineTo(targetCell.x, targetCell.y);
        targetLineSprite.zIndex = zIndex.targetLine;
        this.pixiUtils.viewportAddChild(targetLineSprite);
        this.agvTargetLineMap.set(agvId, targetLineSprite);
      }
    }
  };

  addTaskPath = (agvId, start, end, type) => {
    const startCell = this.idCellMap.get(start);
    const endCell = this.idCellMap.get(end);
    if (startCell && endCell) {
      const taskPath = new TaskPath({
        type,
        startPoint: { x: startCell.x, y: startCell.y },
        endPoint: { x: endCell.x, y: endCell.y },
      });
      let paths = this.agvPathMap.get(agvId);
      if (paths && Array.isArray(paths)) {
        paths.push(taskPath);
      } else {
        paths = [];
        paths.push(taskPath);
        this.agvPathMap.set(agvId, paths);
      }
      this.pixiUtils.viewportAddChild(taskPath);
    }
  };

  // ************************ 料箱任务目标线 ********************** //
  recordToteTaskRealtimeData = (realtime) => {
    this.toteTaskRealtimeData = realtime;
    this.clearToteTaskRealtimePaths();
  };

  clearToteTaskRealtimePaths = () => {
    this.toteTaskRealtimePath.forEach((sprite) => {
      this.pixiUtils.viewportRemoveChild(sprite);
      sprite.destroy(true);
    });
    this.toteTaskRealtimePath = [];
  };

  renderToteTaskRealtimePaths = (robotId, agvX, agvY, data) => {
    // 绘制
    const pathXY = [{ x: agvX, y: agvY }];
    data.forEach(({ bc, t }) => {
      const toteEntity = this.idTotePodMap.get(bc);
      toteEntity && pathXY.push({ x: toteEntity.x, y: toteEntity.y, action: t });
    });

    const pathLineData = [];
    pathXY.reduce((pre, next) => {
      pathLineData.push({ start: pre, end: next });
      return next;
    });

    // 先清理
    this.clearToteTaskRealtimePaths();

    // 画线条
    pathLineData.forEach(({ start, end }) => {
      const realTimeLineSprite = new SmoothGraphics();
      // 根据end任务类型选择不同颜色
      const color = end.action === 'f' ? 0x34bf49 : 0xfbb034;
      realTimeLineSprite.lineStyle(50, color, 1);
      realTimeLineSprite.moveTo(start.x, start.y);
      realTimeLineSprite.lineTo(end.x, end.y);
      realTimeLineSprite.drawCircle(end.x, end.y, 150);
      realTimeLineSprite.zIndex = zIndex.cellHeat;
      this.pixiUtils.viewportAddChild(realTimeLineSprite);
      this.toteTaskRealtimePath.push(realTimeLineSprite);
    });
  };

  // ************************ 料箱任务实时分布 ********************** //
  renderToteRealtimeState = (type, data) => {
    // 清理
    this.toteTaskRealtimeState.forEach((sprite) => {
      this.pixiUtils.viewportRemoveChild(sprite);
      sprite.destroy(true);
    });
    this.toteTaskRealtimeState = [];

    // 重置料箱的任务分布标识
    this.idTotePodMap.forEach((toteEntity) => {
      toteEntity.highlight(isNull(type) ? 'pod' : 'pod_grey');
    });

    // 渲染
    if (!isNull(type)) {
      if (type === 'USED') {
        Object.keys(data).forEach((toteColumnCode) => {
          const toteEntity = this.idTotePodMap.get(toteColumnCode);
          if (toteEntity) {
            toteEntity.highlight('pod');
            const sprite = new BitText(
              data[toteColumnCode],
              toteEntity.x,
              toteEntity.y,
              0xffffff,
              200,
            );
            sprite.anchor.set(0.5);
            sprite.zIndex = zIndex.cellHeat;
            this.pixiUtils.viewportAddChild(sprite);
            this.toteTaskRealtimeState.push(sprite);
          }
        });
      } else {
        Object.keys(data).forEach((taskType) => {
          Object.keys(data[taskType]).forEach((toteColumnCode) => {
            const toteEntity = this.idTotePodMap.get(toteColumnCode);
            if (toteEntity) {
              // 替换料箱材质
              toteEntity.highlight(`pod_${taskType}`);
              // 添加数字标识
              if (taskType === 'BOTH') {
                const [PUT, FETCH] = data[taskType][toteColumnCode].split('/');
                const putLabelSprite = new BitText(
                  PUT,
                  toteEntity.angle === 0
                    ? toteEntity.x - toteEntity.depth / 4
                    : toteEntity.x + toteEntity.depth / 4,
                  toteEntity.y,
                  0xffffff,
                  200,
                );
                putLabelSprite.anchor.set(0.5);
                putLabelSprite.zIndex = zIndex.cellHeat;
                this.pixiUtils.viewportAddChild(putLabelSprite);
                this.toteTaskRealtimeState.push(putLabelSprite);

                const fetchLabelSprite = new BitText(
                  FETCH,
                  toteEntity.angle === 0
                    ? toteEntity.x + toteEntity.depth / 4
                    : toteEntity.x - toteEntity.depth / 4,
                  toteEntity.y,
                  0xffffff,
                  200,
                );
                fetchLabelSprite.anchor.set(0.5);
                fetchLabelSprite.zIndex = zIndex.cellHeat;
                this.pixiUtils.viewportAddChild(fetchLabelSprite);
                this.toteTaskRealtimeState.push(fetchLabelSprite);
              } else {
                const sprite = new BitText(
                  data[taskType][toteColumnCode],
                  toteEntity.x,
                  toteEntity.y,
                  0xffffff,
                  200,
                );
                sprite.anchor.set(0.5);
                sprite.zIndex = zIndex.cellHeat;
                this.pixiUtils.viewportAddChild(sprite);
                this.toteTaskRealtimeState.push(sprite);
              }
            }
          });
        });
      }
    }
  };

  // ************************ 点位热度 ********************** //
  renderCellHeat = (data) => {
    if (!data) return;
    const { costHeatOpacity } = window.g_app._store.getState().monitor;
    // 每次渲染前都是替换，所以第一步需要清除所有点位热度对象
    this.clearCellHeat();
    data.forEach((item) => {
      const { cellId, x, y, heat } = item;
      const textureName = PIXI.utils.TextureCache[`_cellHeat${heat}`];
      const exsitCellHeat = this.cellHeatMap.get(`${cellId}`);
      if (exsitCellHeat) {
        console.log(`本次刷新出现重复数据: Cell: ${cellId}, Cost: ${heat}, X: ${x}, Y:${y}`);
      }
      if (textureName) {
        const cellEntity = this.idCellMap.get(cellId);
        const heatSprite = new PIXI.Sprite(textureName);
        heatSprite.anchor.set(0.5);
        heatSprite.x = x;
        heatSprite.y = y;
        heatSprite.alpha = costHeatOpacity ? 0.5 : 1;
        heatSprite.zIndex = zIndex.cellHeat;
        this.cellHeatMap.set(`${cellId}`, heatSprite);
        cellEntity && this.pixiUtils.viewportAddChild(heatSprite);
      }
    });
  };

  clearCellHeat = () => {
    this.cellHeatMap.forEach((cellHeat) => {
      this.pixiUtils.viewportRemoveChild(cellHeat);
      cellHeat.destroy({ children: true });
    });
    this.cellHeatMap.clear();
  };

  // ************************ 工作站标记 ********************** //
  markWorkStation = (workStationId, isShown, color) => {
    const workStation = this.workStationMap.get(workStationId);
    workStation && workStation.switchMarkerShown(isShown, color);
  };

  // ************************ 小车标记 ********************** //
  markWorkStationAgv = (agvs, isShown, color, workStationId) => {
    // 先做清理操作, 只重置正在为该工作站服务的小车
    this.idAGVMap.forEach((agv) => {
      if (agv.employer === workStationId) {
        agv.switchMarkerShown(false, null, null);
      }
    });
    const workStation = this.workStationMap.get(workStationId);
    const renderColor = color ?? workStation.employeeColor; // 边缘Case: 请求发送完成到请求返回中间时间工作站被取消显示小车
    if (isShown && renderColor) {
      agvs.forEach((agvId) => {
        const agv = this.idAGVMap.get(agvId);
        if (agv && workStation) {
          // 这里 color有可能是null, 是因为该方法是轮询机制调用的
          agv.switchMarkerShown(true, workStationId, renderColor);
        }
      });
    }
  };

  // ************************ 通用站点标记 start ********************** //
  markCommonPoint = (commonPointId, isShown, color) => {
    const commonPoint = this.commonFunctionMap.get(commonPointId);
    commonPoint && commonPoint.switchCommonMarkerShown(isShown, color);
  };

  // ************************ 通用站点标记 小车标记 ********************** //
  markCommonPointAgv = (agvs, isShown, color, commonPointId) => {
    // 先做清理操作, 只重置正在为该工作站服务的小车
    this.idAGVMap.forEach((agv) => {
      if (agv.employer === commonPointId) {
        agv.switchMarkerShown(false, null, null);
      }
    });

    const commonPoint = this.commonFunctionMap.get(commonPointId);
    const renderColor = color ?? commonPoint.employeeColor; // 边缘Case: 请求发送完成到请求返回中间时间工作站被取消显示小车
    if (isShown && renderColor) {
      agvs.forEach((agvId) => {
        const agv = this.idAGVMap.get(agvId);
        if (agv && commonPoint) {
          // 这里 color有可能是null, 是因为该方法是轮询机制调用的
          agv.switchMarkerShown(true, commonPointId, renderColor);
        }
      });
    }
  };

  // ************************ 充电桩状态更新 ********************** //
  updateChargerState = ({ n: name, s: state }) => {
    const chargerEntity = this.chargerMap.get(name);
    chargerEntity && chargerEntity.updateChargerState(state);
  };

  // ************************ 充电桩HardwareId更新 ********************** //
  updateChargerHardware = (name, hardwareId) => {
    const chargerEntity = this.chargerMap.get(name);
    chargerEntity && chargerEntity.updateHardwareId(hardwareId);
  };

  // ************************ 渲染存储位组标识 ********************** //
  renderStoreCellGroup = (storageConfigData) => {
    this.storeCellGroup = storageConfigData; // 缓存储位组数据
    const currentLogicId = getCurrentLogicAreaData('monitor')?.id;
    const logicStorageCellGroup = storageConfigData?.[currentLogicId];
    if (Array.isArray(logicStorageCellGroup)) {
      logicStorageCellGroup.forEach((group) => {
        const { name, cells, entry, exit } = group;
        if (Array.isArray(cells)) {
          this.renderCellGroupFlag(name, cells, entry, exit);
        }
      });
      this.refresh();
    }
  };

  // ************************ 渲染储位组标记 ********************** //
  renderCellGroupFlag = (name, cells, entry, exit) => {
    // 组名
    [...cells, ...entry, ...exit].forEach((cellId) => {
      const cellEntity = this.idCellMap.get(cellId);
      const sprite = new BitText(name, 0, 0, 0xffffff, 200);
      if (cellEntity) {
        cellEntity.plusType(`store_group_cell_${name}_${cellId}`, sprite);
        cellEntity.interact(true, true, this.props.checkStoreGroup);
      }
    });

    // 入口
    entry.forEach((cellId) => {
      const entryCell = this.idCellMap.get(cellId);
      if (entryCell) {
        entryCell.plusType(`store_group_in_${cellId}`, getTextureFromResources('entrance_cell'));
      }
    });

    // 出口
    exit.forEach((cellId) => {
      const exitCell = this.idCellMap.get(cellId);
      if (exitCell) {
        exitCell.plusType(`store_group_out_${cellId}`, getTextureFromResources('exit_cell'));
      }
    });
  };

  // ************************ 渲染 清除 紧急停止区域 ********************** //
  getLogicWidth = () => {
    const { worldHeight, worldWidth } = this.pixiUtils.viewport;
    return { worldHeight, worldWidth };
  };

  renderEmergencyStopArea = (allData) => {
    const showEmergency = this.states.emergencyAreaShown;
    const { checkEStopArea } = this.props;
    const worldSize = this.getLogicWidth();
    const { globalActive, logicActive, currentLogicArea } = window.g_app._store.getState().monitor;

    const _visible = showEmergency && (globalActive || logicActive.includes(currentLogicArea));
    this.logicSpriteSectionFlag = false;
    this.logicSpriteLogicFlag = false;

    if (globalActive) {
      this.logicSpriteSectionFlag = true;
    }
    if (!globalActive && logicActive.includes(currentLogicArea)) {
      this.logicSpriteLogicFlag = true;
    }

    // logic section 比较特殊  只需要留一条数据就够了
    // 渲染新拿到所有的紧急停止点
    allData.forEach((currentdata) => {
      const eStopData = {
        ...currentdata,
        showEmergency,
        active: true,
        checkEStopArea,
        worldSize,
      };
      if (!['Section', 'Logic', 'Area'].includes(currentdata.estopType)) {
        return;
      }
      if (currentdata.estopType !== 'Section' && currentdata.logicId !== currentLogicArea) {
        return;
      }

      if (['Section', 'Logic'].includes(currentdata.estopType)) {
        let updateSectionFlag = currentdata.estopType === 'Section';
        let updateLogicFlag = currentdata.estopType === 'Logic';
        let _entity = this.emergencyAreaMap.get(`special${currentdata.estopType}`);
        if (isNull(_entity)) {
          // 新增
          _entity = new EmergencyStop(eStopData);
          this.pixiUtils.viewportAddChild(_entity);
          this.emergencyAreaMap.set(`special${currentdata.estopType}`, _entity);

          if (currentdata.estopType === 'Section') {
            updateSectionFlag = false;
          } else {
            updateLogicFlag = false;
          }
        }
        const sectionMaskSprite = this.emergencyAreaMap.get('specialSection');
        if (sectionMaskSprite) {
          sectionMaskSprite.renderable = _visible && this.logicSpriteSectionFlag;
          if (updateSectionFlag) {
            sectionMaskSprite.logicSpriteSection.tint = currentdata.isSafe ? 0xf3704b : 0xdec674;
            this.emergencyAreaMap.delete(`specialSection`);
            this.emergencyAreaMap.set(`specialSection`, sectionMaskSprite);
          }
        }

        const logicMaskSprite = this.emergencyAreaMap.get('specialLogic');
        if (logicMaskSprite) {
          logicMaskSprite.renderable = _visible && this.logicSpriteLogicFlag;
          if (updateLogicFlag) {
            logicMaskSprite.logicSpriteLogic.tint = currentdata.isSafe ? 0xf3704b : 0xdec674;
            this.emergencyAreaMap.delete(`specialLogic`);
            this.emergencyAreaMap.set(`specialLogic`, logicMaskSprite);
          }
        }
      } else {
        // 判断这个code是否存在 存在就更新
        const stopEntity = this.emergencyAreaMap.get(`${currentdata.code}`);
        if (stopEntity) {
          stopEntity.updateEStop(eStopData);
          this.emergencyAreaMap.delete(`${currentdata.code}`);
          this.emergencyAreaMap.set(`${currentdata.code}`, stopEntity);
        } else {
          // 新增
          const eStop = new EmergencyStop(eStopData);
          this.pixiUtils.viewportAddChild(eStop);
          this.emergencyAreaMap.set(`${currentdata.code}`, eStop);
        }
      }
    });

    this.refresh();
  };

  // 清除所有的紧急停止区域
  clearEmergencyStopArea = () => {
    this.emergencyAreaMap.forEach((estop) => {
      this.pixiUtils.viewportRemoveChild(estop);
      estop.destroy({ children: true });
    });
    this.emergencyAreaMap.clear();
    this.refresh();
  };

  // 删除--清除单个紧急停止区
  removeCurrentEmergencyFunction = (code) => {
    const estop = this.emergencyAreaMap.get(`${code}`);
    if (estop) {
      this.emergencyAreaMap.delete(`${code}`);
      this.pixiUtils.viewportRemoveChild(estop);
      estop.destroy({ children: true });
    }
  };
  updateEmergencyStopArea = (params) => {
    const { checkEStopArea } = this.props;
    const worldSize = this.getLogicWidth();
    const estop = this.emergencyAreaMap.get(`${params.code}`);
    const _params = {
      ...params,
      active: true,
      checkEStopArea,
      worldSize,
    };
    if (estop) {
      estop.updateEStop(_params);
      this.emergencyAreaMap.delete(`${params.code}`);
      this.emergencyAreaMap.set(`${params.code}`, estop);
    }
  };

  render() {
    // FBI WARNING: 这里一定要给canvas父容器一个"font-size:0", 否则会被撑开5px左右
    return <div id="monitorPixi" className={commonStyles.monitorBodyMiddle} />;
  }
}

export default MonitorMapView;
