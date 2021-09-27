/* eslint-disable no-console,no-restricted-syntax */
import React from 'react';
import * as PIXI from 'pixi.js';
import { message } from 'antd';
import intl from 'react-intl-universal';
import { find, isEqual } from 'lodash';
import { AGVType, AGVState } from '@/config/config';
import { LatentPodSize, ToteAGVSize, zIndex, GeoLockColor } from '@/consts';
import BaseMap from '../../../../components/BaseMap';
import PixiInitializer from '@/utils/PixiInitializer';
import { loadTexturesForMap } from '@/utils/textures';
import {
  unifyAgvState,
  hasLatentPod,
  mergeStorageRack,
  getElevatorMapCellId,
  convertToteLayoutData,
  getCurrentLogicAreaData,
  getTextureFromResources,
} from '@/utils/mapUtils';
import { isNull, getToteLayoutBaseParam } from '@/utils/utils';
import {
  Cell,
  BitText,
  GeoLock,
  ToteAGV,
  TotePod,
  OpenLock,
  TaskPath,
  LatentAGV,
  LatentPod,
  SorterAGV,
  ForkPallet,
  ForkLiftAGV,
  MapRenderer,
  GroundStorage,
  TemporaryLock,
} from '@/pages/MapTool/entities';

const CadXYSize = {
  1: {
    x: -1210,
    y: -2215,
    width: 182723,
    height: 26688,
  },
  6: {
    x: -12863,
    y: -10420,
    width: 33103,
    height: 143143,
  },
};
class MonitorMapView extends BaseMap {
  constructor(props) {
    super(props);

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
      cadShadow: false,
      isNeedRender: false,
      refreshMap: false,
    };

    // 监控相关
    this.idAGVMap = new Map(); // {carID: [AGVEntity]}
    this.idLatentPodMap = new Map(); // {cellId: [PodEntity]}
    this.idForkPodMap = new Map(); // {cellId: [PodEntity]}
    this.idTotePodMap = new Map(); // {cellId_L: [PodEntity]} ||  {cellId_R: [PodEntity]}

    // Locks
    this.agvLocksMap = new Map();
    this.cellLocksMap = new Map();
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

    this.scheduleTask = setInterval(this.startSchedule, 200);
    this.states.refreshMap = true;
  }

  componentWillUnmount() {
    this.destroyMapApp();

    // 状态销毁
    this.states.refreshMap = false;

    // 销毁定时器
    if (this.scheduleTask) {
      clearInterval(this.scheduleTask);
      this.scheduleTask = null;
    }
  }

  // 地图渲染初始化
  initMapData = () => {
    this.totePodsData = {};
    this.idAGVMap.clear();
    this.idCellMap.clear();
    this.chargerMap.clear();
    this.agvLocksMap.clear();
    this.cellLocksMap.clear();
    this.elevatorMap.clear();
    this.idTotePodMap.clear();
    this.idLatentPodMap.clear();
    this.idForkPodMap.clear();
    this.workStationMap.clear();
    this.intersectionMap.clear();
    this.TemporaryLockMap.clear();
    this.idLineMap = { 10: new Map(), 20: new Map(), 100: new Map(), 1000: new Map() };
  };

  // 定时刷新
  startSchedule = () => {
    if (this.states.isNeedRender) {
      this.states.isNeedRender = false;
      this.mapRenderer.refresh();
    }
  };

  // 销毁地图所有资源
  destroyMapApp = () => {
    this.pixiUtils.destroy();
    this.initMapData();
    this.pixiUtils = null;
  };

  // 定位: type --> 小车、点位、货架
  moveTo = (type, id) => {
    let x;
    let y;
    let scaled;
    switch (type) {
      case 'cell': {
        const cellEntity = this.idCellMap.get(`${id}`);
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
          this.idAGVMap.forEach((agv) => {
            if (agv instanceof LatentAGV) {
              if (agv.podId === id) {
                x = agv.x;
                y = agv.y;
                scaled = 0.3;
              }
            }
          });
        }
        break;
      }
      default:
        break;
    }

    if (!isNull(x) && !isNull(y)) {
      this.mapRenderer.mapMoveTo(x, y, scaled);
      this.mapRenderer.refresh();
    }
  };

  // 追踪小车
  trackAGV = (agvId) => {
    this.trackAGVId = agvId;
  };

  // 重载Monitor地图
  refreshMap = () => {
    this.states.refreshMap = true;
    this.initMapData();
  };

  // 根据标识位渲染小车和货架
  reRenderAfterSwitchingLogic = () => {
    // 小车
    this.idAGVMap.forEach((AGV) => {
      const currentCellId = getElevatorMapCellId(AGV.currentCellId);
      const cellEntity = this.idCellMap.get(`${currentCellId}`);
      if (cellEntity) {
        AGV.x = cellEntity.x;
        AGV.y = cellEntity.y;
        this.pixiUtils.viewportAddChild(AGV, false);
      }
    });

    // 潜伏货架
    this.idLatentPodMap.forEach((pod) => {
      const cellEntity = this.idCellMap.get(`${pod.cellId}`);
      if (cellEntity) {
        pod.x = cellEntity.x;
        pod.y = cellEntity.y;
        this.pixiUtils.viewportAddChild(pod);
      }
    });

    // 料箱货架相对复杂，直接重新渲染
    this.addTotePod(this.totePodsData);

    // 叉车货架
    this.idForkPodMap.forEach((pod) => {
      const cellEntity = this.idCellMap.get(`${pod.cellId}`);
      if (cellEntity) {
        pod.x = cellEntity.x;
        pod.y = cellEntity.y;
        this.pixiUtils.viewportAddChild(pod);
      }
    });

    // 储位组
    this.renderStoreCellGroup(this.storeCellGroup);
  };

  // ************************ 点位相关 **********************
  renderCells = (cells) => {
    if (cells.length > 0) {
      this.idCellMap.clear();
      cells.forEach(({ id, x, y }) => {
        const cell = new Cell({ id, x, y, showCoordinate: this.states.showCoordinate });
        this.idCellMap.set(`${id}`, cell);
        this.pixiUtils.viewportAddChild(cell);
      });
    }

    // CAD 背景
    if (this.mapBackPic) {
      this.mapBackPic.destroy();
    }
    const sectionId = window.localStorage.getItem('sectionId');
    const cadTexture = getTextureFromResources(`cad_${sectionId}`);
    if (cadTexture) {
      this.mapBackPic = new PIXI.Sprite(cadTexture);
      this.mapBackPic.x = CadXYSize[sectionId].x;
      this.mapBackPic.y = CadXYSize[sectionId].y;
      this.mapBackPic.width = CadXYSize[sectionId].width;
      this.mapBackPic.height = CadXYSize[sectionId].height;
      this.mapBackPic.zIndex = 0.5;
      this.mapBackPic.visible = false;
      this.pixiUtils.viewportAddChild(this.mapBackPic, false);
    }
  };

  // ************************ 临时不可走点锁 **********************
  // 渲染临时不可走点锁
  renderTemporaryLock = (inputData) => {
    // 清除所有的临时不可走点
    this.clearTemporaryLock();

    // 渲染新的临时不可走点
    inputData.forEach((lock) => {
      const cellEntity = this.idCellMap.get(`${lock.cellId}`);
      if (cellEntity) {
        const { x, y } = cellEntity;
        const texture = getTextureFromResources('tmp_block_lock');
        const locker = new TemporaryLock(texture, x, y);
        this.pixiUtils.viewportAddChild(locker);
        this.TemporaryLockMap.set(`x${x}y${y}`, locker);
      }
    });
    this.mapRenderer.refresh();
  };

  // 清除临时不可走点锁
  clearTemporaryLock = () => {
    this.TemporaryLockMap.forEach((locker) => {
      this.pixiUtils.viewportRemoveChild(locker);
      locker.destroy({ children: true });
    });
    this.TemporaryLockMap.clear();
    this.mapRenderer.refresh();
  };

  // ************************ 可见性控制相关 **********************
  switchCadShadowShown = (flag) => {
    if (this.mapBackPic) {
      this.states.cadShadow = flag;
      this.mapBackPic.visible = flag;
    }
  };

  switchCellShown = (flag) => {
    this.states.showCellPoint = flag;
    this.idCellMap.forEach((cell) => {
      cell.switchShown(flag);
    });
  };

  switchToteShown = (flag) => {
    this.states.showTote = flag;
    this.idTotePodMap.forEach((tote) => tote.switchShown(flag));
  };

  // ************************ 小车 & 货架相关 ********************** //
  updateAgvCommonState = (agvc, agvState, agvEntity, agvType) => {
    if (!agvEntity) return;
    const { x, y, robotId, battery, mainTain } = agvState;
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
    const cellEntity = this.idCellMap.get(`${currentCellId}`);
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
        this.pixiUtils.viewportAddChild(agvEntity, false);
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

    // 更新小车维护中状态
    if (agvEntity.mainTain !== !!mainTain) {
      agvEntity.updateMainTainState(mainTain);
    }

    // 执行跟踪
    robotId === `${this.trackAGVId}` && this.mapRenderer.mapMoveTo(agvEntity.x, agvEntity.y, 0.1);
  };

  // ************************ 潜伏车 ********************** //
  addLatentAGV = (latentAGVData) => {
    // 如果点位未渲染好直接退出
    if (this.idCellMap.size === 0) return;
    // 这里需要一个检查，因为在页面存在车的情况下刷新页面，socket信息可能比小车列表数据来得快，所以update**AGV就会创建一台车[offline]
    // 但是一旦小车列表数据到了后会再次渲染出相同的小车, 所以这里需要检查当前id的车是否存在。如果小车存在就更新，如果小车不存在且点位存在就新建小车
    let latentAGV = this.idAGVMap.get(`${latentAGVData.robotId}`);
    const cellEntity = this.idCellMap.get(`${latentAGVData.currentCellId}`);
    if (latentAGV) {
      this.updateLatentAGV([latentAGVData]);
      return latentAGV;
    }
    const { checkAGV, simpleCheckAgv } = this.props;
    latentAGV = new LatentAGV({
      id: latentAGVData.robotId,
      x: latentAGVData.x,
      y: latentAGVData.y,
      battery: latentAGVData.battery || 0,
      state: latentAGVData.agvStatus ?? AGVState.offline,
      mainTain: latentAGVData.mainTain,
      cellId: latentAGVData.currentCellId,
      angle: latentAGVData.currentDirection,
      active: true,
      checkAGV,
      simpleCheckAgv,
    });
    // 位置、形态经常变化的对象不需要加入到cull
    cellEntity && this.pixiUtils.viewportAddChild(latentAGV, false);
    this.idAGVMap.set(`${latentAGVData.robotId}`, latentAGV);

    return latentAGV;
  };

  renderLatentAGV = (latentAGVList) => {
    latentAGVList.forEach((latentAGV) => {
      this.addLatentAGV(latentAGV);
    });
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
      } = unifiedAgvState;

      if (isNull(currentCellId)) return;

      // 首先处理删除小车的情况
      if (currentCellId === -1) {
        this.removeLatentAGV(robotId);
        this.states.isNeedRender = true;
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
        });
      }
      if (isNull(latentAGV)) return;

      // 更新通用状态
      this.updateAgvCommonState(agv.c, unifiedAgvState, latentAGV, AGVType.LatentLifting);

      // 卸货: podId不存在但是小车还有货物的时候需要卸货 --> {robotId: "x", currentCellId: 46, currentDirection: 0, mainTain: false, battery: 54, podId: 0}
      if (!hasLatentPod(podId) && latentAGV && latentAGV.pod) {
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

      this.states.isNeedRender = true;
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
        this.refreshLatentPod(latentAGV.currentCellId, podId, podAngle);
      }
      this.pixiUtils.viewportRemoveChild(latentAGV, false);
      latentAGV.destroy({ children: true });
      this.idAGVMap.delete(`${robotId}`);
    }
  };

  addLatentPod = (latentPodData) => {
    if (this.idCellMap.size === 0) return;
    const { id, cellId, angle, width, length: height } = latentPodData;
    const cellEntity = this.idCellMap.get(`${cellId}`);
    // 这里需要做一次检查: 因为小车的状态信息可能比货架信息来的早, 一旦某货架和小车已经存在绑定关系
    // 就会在渲染的小车上渲染出该货架, 但后到的货架信息会在该点重新渲染正常状态的货架从而造成一个地图上存在两个相同的货架
    const exist = this.latentPodInCar(id);
    if (!exist) {
      const latentPod = new LatentPod({
        id,
        cellId,
        width,
        height,
        angle: angle || 0,
        x: cellEntity ? cellEntity.x : null,
        y: cellEntity ? cellEntity.y : null,
      });
      // 位置、形态经常变化的对象不需要加入到cull
      cellEntity && this.pixiUtils.viewportAddChild(latentPod, false);
      this.idLatentPodMap.set(`${id}`, latentPod);
    }
  };

  latentPodInCar = (podId) => {
    let exist = false;
    for (const iterator of this.idAGVMap) {
      const AGV = iterator[1];
      if (AGV instanceof LatentAGV) {
        const latentPodId = AGV.podId;
        if (`${latentPodId}` === `${podId}`) {
          exist = true;
          break;
        }
      }
    }
    return exist;
  };

  renderLatentPod = (latentPodList) => {
    latentPodList.forEach((latentPod) => {
      this.addLatentPod(latentPod);
    });
    this.states.isNeedRender = true;
  };

  refreshLatentPod = (podStatus) => {
    const { podId, robotId, cellId: currentCellId, direction: podDirection = 0 } = podStatus;
    const width = podStatus.w || LatentPodSize.width;
    const height = podStatus.h || LatentPodSize.height;

    if (currentCellId === -1) {
      // 删除Pod
      const latentPod = this.idLatentPodMap.get(`${podId}`);
      if (latentPod) {
        // 因为Pod没有加入到cull中，所以删除的时候不需要从cull中删除
        this.pixiUtils.viewportRemoveChild(latentPod, false);
        latentPod.destroy({ children: true });
        this.idLatentPodMap.delete(`${podId}`);
        this.states.isNeedRender = true;
      }
      return;
    }

    // 如果当前车找不到点位就不做任何更新
    const cellEntity = this.idCellMap.get(`${currentCellId}`);
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
              this.idLatentPodMap.set(`${podId}`, latentPod);
            } else {
              return;
            }
          }
          latentPod.position.set(0, 0);
          latentPod.setAlpha(0.9);
          latentPod.width = LatentPodSize.width / 2;
          latentPod.height = LatentPodSize.height / 2;
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
        latentPod.setAlgle(podDirection);
      } else {
        this.addLatentPod({
          id: podId,
          cellId: currentCellId,
          angle: podDirection,
          width,
          length: height,
        });
        this.states.isNeedRender = true;
      }
    }
    this.states.isNeedRender = true;
  };

  // ************************ 料箱车 ********************** //
  addToteAGV = (toteAGVData) => {
    const {
      x,
      y,
      shelfs,
      robotId,
      battery,
      agvStatus,
      currentCellId,
      currentDirection,
      toteCodes = [null],
    } = toteAGVData;
    // 如果点位未渲染好直接退出
    if (this.idCellMap.size === 0) return;
    // 这里需要一个检查，因为在页面存在车的情况下刷新页面，socket信息可能比小车列表数据来得快，所以update**AGV就会创建一台车[offline]
    // 但是一旦小车列表数据到了后会再次渲染出相同的小车, 所以这里需要检查当前id的车是否存在。如果小车存在就更新，如果小车不存在且点位存在就新建小车
    let toteAGV = this.idAGVMap.get(`${robotId}`);
    const cellEntity = this.idCellMap.get(`${currentCellId}`);
    if (toteAGV) {
      this.updateToteAGV([toteAGVData]);
      return toteAGV;
    }
    const { checkAGV, simpleCheckAgv } = this.props;
    toteAGV = new ToteAGV({
      x,
      y,
      id: robotId,
      cellId: currentCellId,
      angle: currentDirection,
      shelfs: shelfs || 0,
      battery: battery || 0,
      state: agvStatus || AGVState.offline,
      active: true,
      toteCodes,
      checkAGV,
      simpleCheckAgv,
    });
    // 位置、形态经常变化的对象不需要加入到cull
    cellEntity && this.pixiUtils.viewportAddChild(toteAGV, false);
    this.idAGVMap.set(`${robotId}`, toteAGV);

    return toteAGV;
  };

  removeToteAGV = (robotId) => {
    const toteAGV = this.idAGVMap.get(`${robotId}`);
    if (toteAGV) {
      this.pixiUtils.viewportRemoveChild(toteAGV, false);
      toteAGV.destroy({ children: true });
      this.idAGVMap.delete(`${robotId}`);
    }
  };

  renderToteAGV = (toteAGVList) => {
    toteAGVList.forEach((toteAGV) => {
      this.addToteAGV(toteAGV);
    });
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
      } = unifiedAgvState;

      if (isNull(currentCellId)) return;

      // 首先处理删除小车的情况
      if (currentCellId === -1) {
        this.removeToteAGV(robotId);
        this.states.isNeedRender = true;
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

      this.states.isNeedRender = true;
    }
  };

  // 更新料箱车车上货架显示效果和抱夹显示效果
  updateToteState = (toteState) => {
    const { robotId, toteCodes, holdingTote } = toteState;
    const toteAGV = this.idAGVMap.get(`${robotId}`);
    if (toteAGV) {
      toteAGV.updateTotes(toteCodes);
      toteAGV.updateHolding(holdingTote);
      this.states.isNeedRender = true;
    }
  };

  // 料箱货架
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
          const cellEntity = _this.idCellMap.get(`${bin.binCellId}`);
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
          const cellEntity = _this.idCellMap.get(`${bin.binCellId}`);
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

  renderTotePod = (toteLayoutData, sizeMapping) => {
    const rackGroups = toteLayoutData.rackGroups;
    if (!rackGroups) return;
    const newTotePodData = convertToteLayoutData(toteLayoutData, sizeMapping);
    this.addTotePod(newTotePodData);
  };

  // ************************ 叉车 ********************** //
  addForkLiftAGV = (agvData) => {
    if (this.idCellMap.size === 0) return;
    // 这里需要一个检查，因为在页面存在车的情况下刷新页面，socket信息可能比小车列表数据来得快，所以update**AGV就会创建一台车[offline]
    // 但是一旦小车列表数据到了后会再次渲染出相同的小车, 所以这里需要检查当前id的车是否存在。如果小车存在就更新，如果小车不存在且点位存在就新建小车
    let forkLiftAGV = this.idAGVMap.get(`${agvData.robotId}`);
    const cellEntity = this.idCellMap.get(`${agvData.currentCellId}`);
    if (forkLiftAGV) {
      this.updateForkLiftAGV([agvData]);
    } else {
      const { checkAGV, simpleCheckAgv } = this.props;
      forkLiftAGV = new ForkLiftAGV({
        id: agvData.robotId,
        x: agvData.x,
        y: agvData.y,
        currentCellId: agvData.currentCellId,
        battery: agvData.battery || 0,
        state: agvData.agvStatus || AGVState.offline,
        mainTain: agvData.mainTain,
        angle: agvData.currentDirection,
        active: true,
        checkAGV,
        simpleCheckAgv,
      });
      // 位置、形态经常变化的对象不需要加入到cull
      cellEntity && this.pixiUtils.viewportAddChild(forkLiftAGV, false);
      this.idAGVMap.set(`${agvData.robotId}`, forkLiftAGV);
    }
    return forkLiftAGV;
  };

  renderForkLiftAGV = (forkLiftAGVList) => {
    forkLiftAGVList.forEach((forkLiftAGV) => {
      this.addForkLiftAGV(forkLiftAGV);
    });
  };

  updateForkLiftAGV = (allForkLiftStatus) => {
    for (const agv of allForkLiftStatus) {
      const unifiedAgvState = unifyAgvState(agv);
      const {
        x,
        y,
        robotId,
        battery,
        mainTain,
        agvStatus,
        currentCellId,
        currentDirection,
        hasPod,
        longSide,
        shortSide,
      } = unifiedAgvState;

      if (isNull(currentCellId)) return;

      // 首先处理删除小车的情况
      if (!isNull(currentCellId) && currentCellId === -1) {
        this.removeForkLiftAGV(robotId);
        this.states.isNeedRender = true;
        return;
      }

      let forkLiftAGV = this.idAGVMap.get(`${robotId}`);
      // 如果小车不存在
      if (!forkLiftAGV) {
        // 新增小车: 登陆小车的第一条信息没有【状态】值, 就默认【离线】
        forkLiftAGV = this.addForkLiftAGV({
          x,
          y,
          robotId,
          mainTain,
          currentCellId,
          currentDirection,
          battery: battery || 0,
          agvStatus: agvStatus || 'Offline',
        });
      }
      if (isNull(forkLiftAGV)) return;

      // 更新通用状态
      this.updateAgvCommonState(agv.c, unifiedAgvState, forkLiftAGV, AGVType.ForkLifting);

      // 刷新小车上货架的状态
      if (hasPod) {
        forkLiftAGV && forkLiftAGV.upPod({ longSide, shortSide });
      } else {
        forkLiftAGV && forkLiftAGV.downPod();
      }

      this.states.isNeedRender = true;
    }
  };

  removeForkLiftAGV = (robotId) => {
    // TODO: 可能要先处理插齿上的货架
    const toteAGV = this.idAGVMap.get(`${robotId}`);
    if (toteAGV) {
      this.pixiUtils.viewportRemoveChild(toteAGV, false);
      toteAGV.destroy({ children: true });
      this.idAGVMap.delete(`${robotId}`);
    }
  };

  // 渲染叉车货架布局
  renderForkPodLayout = (layout) => {
    const { storageRacks } = layout;
    if (storageRacks && Array.isArray(storageRacks)) {
      for (const storageRack of storageRacks) {
        // 判断是否是地面货架
        if (storageRack.type === 'GROUND_STORAGE') {
          this.renderForkGroundPallet(storageRack);
        } else {
          // 对每一个货架元素按coordinate中的 XY进行合并
          const { angle, columns } = mergeStorageRack(storageRack);
          columns.forEach((column) => {
            const { cellId, code, width, height, disabled } = column;
            const cellEntity = this.idCellMap.get(`${cellId}`);
            if (!disabled) {
              const forkPod = new ForkPallet({
                cellId,
                x: cellEntity ? cellEntity.x : null,
                y: cellEntity ? cellEntity.y : null,
                code,
                angle,
                width,
                height,
                disabled,
              });
              cellEntity && this.pixiUtils.viewportAddChild(forkPod);
              this.idForkPodMap.set(`${code}`, forkPod);
            }
          });
        }
      }
    }
    this.states.isNeedRender = true;
  };

  renderForkGroundPallet = (data) => {
    const {
      disabled,
      storageCellId,
      storageBaseCode,
      size: { width, depth },
    } = data.virtualStorages[0];
    const cellEntity = this.idCellMap.get(`${storageCellId}`);
    if (!disabled) {
      const groundStorage = new GroundStorage({
        x: cellEntity ? cellEntity.x : null,
        y: cellEntity ? cellEntity.y : null,
        cellId: storageCellId,
        code: storageBaseCode,
        angle: data.angle,
        width,
        height: depth,
        disabled,
      });
      cellEntity && this.pixiUtils.viewportAddChild(groundStorage);
      this.idForkPodMap.set(`${storageBaseCode}`, groundStorage);
    }
  };

  // ************************ 分拣车 ********************** //
  addSorterAGV = (sorterAGVData) => {
    // 如果点位未渲染好直接退出
    if (this.idCellMap.size === 0) return;
    // 这里需要一个检查，因为在页面存在车的情况下刷新页面，socket信息可能比小车列表数据来得快，所以update**AGV就会创建一台车[offline]
    // 但是一旦小车列表数据到了后会再次渲染出相同的小车, 所以这里需要检查当前id的车是否存在。如果小车存在就更新，如果小车不存在且点位存在就新建小车
    let sorterAGV = this.idAGVMap.get(`${sorterAGVData.robotId}`);
    const cellEntity = this.idCellMap.get(`${sorterAGVData.currentCellId}`);
    if (sorterAGV) {
      this.updateSorterAGV([sorterAGVData]);
      return sorterAGV;
    }
    const { checkAGV, simpleCheckAgv } = this.props;
    sorterAGV = new SorterAGV({
      id: sorterAGVData.robotId,
      x: sorterAGVData.x,
      y: sorterAGVData.y,
      battery: sorterAGVData.battery || 0,
      state: sorterAGVData.agvStatus ?? AGVState.offline,
      mainTain: sorterAGVData.mainTain,
      cellId: sorterAGVData.currentCellId,
      angle: sorterAGVData.currentDirection,
      active: true,
      checkAGV,
      simpleCheckAgv,
    });
    // 位置、形态经常变化的对象不需要加入到cull
    cellEntity && this.pixiUtils.viewportAddChild(sorterAGV, false);
    this.idAGVMap.set(`${sorterAGVData.robotId}`, sorterAGV);

    return sorterAGV;
  };

  renderSorterAGV = (sorterAGVList) => {
    sorterAGVList.forEach((sorterAGV) => {
      this.addSorterAGV(sorterAGV);
    });
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
      } = unifiedAgvState;

      if (isNull(currentCellId)) return;

      // 首先处理删除小车的情况
      if (currentCellId === -1) {
        this.removeSorterAGV(robotId);
        this.states.isNeedRender = true;
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
          agvStatus: agvStatus || 'Offline',
        });
      }
      if (isNull(sorterAGV)) return;

      // 更新通用状态
      this.updateAgvCommonState(agv.c, unifiedAgvState, sorterAGV, AGVType.Sorter);

      // 更新小车车身货架
      sorterAGV.updatePod(sorterPod);

      this.states.isNeedRender = true;
    }
  };

  removeSorterAGV = (robotId) => {
    const sorterAGV = this.idAGVMap.get(`${robotId}`);
    if (sorterAGV) {
      this.pixiUtils.viewportRemoveChild(sorterAGV, false);
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
          intl.formatMessage(
            { id: 'app.mapView.tip.LockDataAbnormal' },
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
    if (!lockData) return;

    // 清除所有的几何锁
    this.clearAllLocks();

    // 渲染新的所有指定类型的锁
    // 校验锁格数据，尤其是宽高
    if (!lockData.height || !lockData.width) {
      message.error(
        intl.formatMessage(
          { id: 'app.mapView.tip.LockDataAbnormal' },
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
    this.cellLocksMap.set(
      `r${lockData.robotId}x${lockData.posX}y${lockData.posY}t${Math.random()}`, // 防止重复key导致覆盖
      geoLock,
    );
    this.pixiUtils.viewportAddChild(geoLock);
  };

  clearCellLocks = () => {
    this.cellLocksMap.forEach((locker) => {
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
    this.cellLocksMap.clear();
  };

  // ************************ 渲染小车行驶路径路径 ********************** //
  registeShowTaskPath = (agvTasks = [], filteredAGV, showTaskPath) => {
    this.filteredAGV = filteredAGV;
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
    this.states.isNeedRender = true;
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
    this.states.isNeedRender = true;
  };

  renderTaskPaths = (agvId) => {
    const { showFullPath, showTagetLine } = window.g_app._store.getState().monitor.viewSetting;

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

        const targetLineSprite = new PIXI.Graphics();
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
    const startCell = this.idCellMap.get(`${start}`);
    const endCell = this.idCellMap.get(`${end}`);
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
      const realTimeLineSprite = new PIXI.Graphics();
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

  // ************************ 料箱状态实时 ********************** //
  renderToteRealtimeState = (type, data) => {
    // 清理
    this.toteTaskRealtimeState.forEach((sprite) => {
      this.pixiUtils.viewportRemoveChild(sprite);
      sprite.destroy(true);
    });
    this.toteTaskRealtimeState = [];

    // 渲染
    const fontSize = type === 'USED' ? 220 : 450;
    Object.keys(data).forEach((toteColumnCode) => {
      const toteEntity = this.idTotePodMap.get(toteColumnCode);
      if (toteEntity) {
        const sprite = new BitText(
          data[toteColumnCode],
          toteEntity.x,
          toteEntity.y,
          0xfbb034,
          fontSize,
        );
        sprite.anchor.set(0.5);
        sprite.zIndex = zIndex.cellHeat;
        this.pixiUtils.viewportAddChild(sprite);
        this.toteTaskRealtimeState.push(sprite);
      }
    });
  };

  // ************************ 点位热度 ********************** //
  renderCellHeat = (data, isTransparent) => {
    if (!data) return;
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
        const cellEntity = this.idCellMap.get(`${cellId}`);
        const heatSprite = new PIXI.Sprite(textureName);
        heatSprite.anchor.set(0.5);
        heatSprite.x = x;
        heatSprite.y = y;
        heatSprite.alpha = isTransparent ? 0.5 : 1;
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
      this.states.isNeedRender = true;
    }
  };

  // ************************ 渲染储位组标记 ********************** //
  renderCellGroupFlag = (name, cells, entry, exit) => {
    // 组名
    [...cells, ...entry, ...exit].forEach((cellId) => {
      const cellEntity = this.idCellMap.get(`${cellId}`);
      const sprite = new BitText(name, 0, 0, 0xffffff, 200);
      if (cellEntity) {
        cellEntity.plusType(`store_group_cell_${name}_${cellId}`, sprite);
        // interactive = false, dynamic = false, showBG = true, callBack
        cellEntity.interact(true, true, false, this.props.checkStoreGroup);
      }
    });

    // 入口
    entry.forEach((cellId) => {
      const entryCell = this.idCellMap.get(`${cellId}`);
      if (entryCell) {
        entryCell.plusType(`store_group_in_${cellId}`, getTextureFromResources('enter_cell'));
      }
    });

    // 出口
    exit.forEach((cellId) => {
      const exitCell = this.idCellMap.get(`${cellId}`);
      if (exitCell) {
        exitCell.plusType(`store_group_out_${cellId}`, getTextureFromResources('leave_cell'));
      }
    });
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

  onValuesChange = (_, allValues) => {
    if (this.mapBackPic) {
      const { x = -1210, y = -2215, width = 182723, height = 26688 } = allValues;
      this.mapBackPic.width = width;
      this.mapBackPic.height = height;
      this.mapBackPic.x = x;
      this.mapBackPic.y = y;
      this.pixiUtils.callRender();
    }
  };

  render() {
    const sectionId = window.localStorage.getItem('sectionId');
    return (
      <div>
        <div id="pixi" style={{ touchAction: 'none' }} />

        {/* <div
          style={{
            color: '#fff',
            position: 'absolute',
            left: 100,
            top: 100,
            display: 'flex',
            flexFlow: 'column nowrap',
          }}
        >
          <Form onValuesChange={this.onValuesChange}>
            <Form.Item label={'x'} name={'x'} initialValue={CadXYSize[sectionId].x}>
              <InputNumber />
            </Form.Item>
            <Form.Item label={'y'} name={'y'} initialValue={CadXYSize[sectionId].y}>
              <InputNumber />
            </Form.Item>
            <Form.Item label={'width'} name={'width'} initialValue={CadXYSize[sectionId].width}>
              <InputNumber />
            </Form.Item>
            <Form.Item label={'height'} name={'height'} initialValue={CadXYSize[sectionId].height}>
              <InputNumber />
            </Form.Item>
          </Form>
        </div> */}
      </div>
    );
  }
}
export default MonitorMapView;
