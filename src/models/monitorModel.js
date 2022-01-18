import { fetchActiveMap, fetchAgvList, fetchToteRackLayout } from '@/services/api';
import { dealResponse, formatMessage, isNull } from '@/utils/utils';
import { message } from 'antd';
import { hasAppPermission, hasPermission } from '@/utils/Permission';
import { AGVType, AppCode } from '@/config/config';
import { fetchChargerList, fetchEmergencyStopList, fetchLatentPodList } from '@/services/XIHE';
import { fetchTemporaryBlockCells } from '@/services/monitor';

export default {
  namespace: 'monitor',

  state: {
    // 地图信息
    currentMap: undefined, // undefined还未去获取数据, null表示当前没有激活的地图
    currentLogicArea: 0, // id
    currentRouteMap: 'DEFAULT', // code
    preRouteMap: null, // 记录上一个路线区数据, 用于切换路线区时候拿到上一次路线区的数据做清理工作
    currentCells: [], // 当前视图的点位数据
    mapContext: null, // 地图实体对象
    elevatorCellMap: null, // 保存电梯替换点与地图原始点位的Map关系
    stationRealRate: [], // 站点实时速率

    // 小车、货架等信息
    allAGVs: [],
    latentAgv: [],
    latentPod: [],
    toteAgv: [],
    toteRack: null,
    sorterAgv: [],
    chargerList: [], // 硬件充电桩
    temporaryBlock: [], // 临时不可走点

    // 运行信息
    podToWorkstationInfo: [],
    latentStopMessageList: [],
    autoCallPodToWorkstationStatus: '',
    automaticToteWorkstationTaskStatus: '',
    automaticForkLiftWorkstationTaskStatus: '',

    // 自动呼叫 & 自动释放
    latentAutomaticTaskConfig: null,
    latentAutomaticTaskForm: null,
    latentAutomaticTaskUsage: {},

    // 急停区
    emergencyStopList: [], // 急停区
    globalActive: null, // 全局急停开启关闭
    logicActive: [], // 逻辑区急停开启关闭

    // 右侧操作栏
    categoryPanel: null, // 右侧展示哪个类型的菜单
    categoryLoad: null, // 展示菜单的内容

    // 监控地图是否渲染完成
    mapRendered: false,

    // 弹窗
    categoryModal: null,
  },

  reducers: {
    saveState(state, action) {
      return { ...state, ...action.payload };
    },
    saveCategoryModal(state, action) {
      return {
        ...state,
        categoryModal: action.payload,
      };
    },
    saveMapRendered(state, action) {
      return {
        ...state,
        mapRendered: action.payload,
      };
    },
    saveCategoryPanel(state, action) {
      return {
        ...state,
        categoryPanel: action.payload,
      };
    },
    saveCurrentMap(state, action) {
      return {
        ...state,
        currentMap: action.payload,
      };
    },
    saveCurrentCells(state, action) {
      return {
        ...state,
        currentCells: action.payload,
      };
    },
    saveMapContext(state, action) {
      return {
        ...state,
        mapContext: action.payload,
      };
    },
    saveElevatorCellMap(state, action) {
      return {
        ...state,
        elevatorCellMap: action.payload,
      };
    },
    saveCurrentLogicArea(state, action) {
      return {
        ...state,
        currentLogicArea: action.payload,
        currentRouteMap: 'DEFAULT',
        preRouteMap: null,
      };
    },
    saveCurrentRouteMap(state, action) {
      const currentLogicAreaData = state.currentMap.logicAreaList[state.currentLogicArea];
      const currentRouteMapData = currentLogicAreaData.routeMap[state.currentRouteMap];
      return {
        ...state,
        currentRouteMap: action.payload,
        preRouteMap: currentRouteMapData,
      };
    },
  },

  effects: {
    // ***************** 获取地图数据 ***************** //
    *initMonitorMap(_, { call, put }) {
      const activeMap = yield call(fetchActiveMap);
      if (isNull(activeMap)) {
        message.warn(formatMessage({ id: 'app.message.noActiveMap' }));
        yield put({ type: 'saveCurrentMap', payload: null });
      }
      if (dealResponse(activeMap)) {
        message.error(formatMessage({ id: 'app.message.fetchMapFail' }));
      }
      if (activeMap) {
        const { elevatorList } = activeMap;
        if (!isNull(elevatorList)) {
          let elevatorCellMap = {};
          elevatorList.forEach(({ logicLocations }) => {
            Object.values(logicLocations).forEach(({ innerMapping }) => {
              const currentLogicReplaceCellId = Object.keys(innerMapping)[0];
              elevatorCellMap = { [currentLogicReplaceCellId]: [], ...elevatorCellMap };
              elevatorCellMap[currentLogicReplaceCellId].push(
                innerMapping[currentLogicReplaceCellId],
              );
            });
          });
          yield put({ type: 'saveElevatorCellMap', payload: elevatorCellMap });
        }
        yield put({ type: 'saveCurrentMap', payload: activeMap });
      }
    },

    // ***************** 获取监控小车、货架等相关信息 ***************** //
    *initMonitorLoad(_, { call, select, put }) {
      const { currentMap } = yield select(({ monitor }) => monitor);
      if (isNull(currentMap)) return null;

      const promises = [];
      const promiseFields = []; // 每个Promise返回值对应的 state 字段
      // 潜伏车模块
      if (hasAppPermission(AppCode.LatentLifting)) {
        promises.push(fetchAgvList(AGVType.LatentLifting));
        promiseFields.push('latentAgv');
        promises.push(fetchLatentPodList());
        promiseFields.push('latentPod');
      }

      // 料箱车模块
      if (hasAppPermission(AGVType.Tote)) {
        promises.push(fetchAgvList(AGVType.Tote));
        promiseFields.push('toteAgv');
        promises.push(fetchToteRackLayout());
        promiseFields.push('toteRack');
      }

      // 分拣车模块
      if (hasAppPermission(AGVType.Sorter)) {
        promises.push(fetchAgvList(AGVType.Sorter));
        promiseFields.push('sorterAgv');
      }

      // 地图充电桩与硬件绑定关系
      if (hasPermission('/map/monitor/chargerMaintain') && currentMap.id) {
        promises.push(fetchChargerList(currentMap.id));
        promiseFields.push('chargerList');
      }

      // 地图临时不可走点
      promises.push(fetchTemporaryBlockCells());
      promiseFields.push('temporaryBlock');

      // 地图急停区
      promises.push(fetchEmergencyStopList(currentMap.id));
      promiseFields.push('emergencyStopList');

      /**
       * 并发发送请求
       * result {status:'fulfilled|rejected', value:any}
       */
      const [...responses] = yield Promise.allSettled(promises);
      const resource = {};
      const additionalStates = {};
      let allAGVs = [];
      responses.forEach(({ status, value }, index) => {
        if (status === 'fulfilled' && !dealResponse(value)) {
          resource[promiseFields[index]] = value;
          additionalStates[promiseFields[index]] = value;
          if (['latentAgv', 'toteAgv', 'sorterAgv'].includes(promiseFields[index])) {
            allAGVs = [...allAGVs, ...value];
          }
        } else {
          resource[promiseFields[index]] = null;
          additionalStates[promiseFields[index]] = null;
        }
      });
      additionalStates.allAGVs = allAGVs;
      yield put({ type: 'saveState', payload: additionalStates });
      return resource;
    },
  },
};