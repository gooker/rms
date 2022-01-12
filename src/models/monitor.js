import { fetchActiveMap } from '@/services/api';
import { dealResponse, formatMessage, isNull } from '@/utils/utils';
import { message } from 'antd';

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

    // 右侧操作栏
    categoryPanel: null,
  },

  reducers: {
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
    *initMonitorPage(_, { call, put }) {
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
      }
      yield put({ type: 'saveCurrentMap', payload: activeMap });
    },
  },
};
