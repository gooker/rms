import {
  fetchBatchDeleteSimulatorAgv,
  fetchSimulatorAGVConfig,
  fetchSimulatorHistory,
  fetchSimulatorLoginAGVControlState,
  fetchUpdateAGVConfig,
} from '@/services/monitor';
import { fetchAllAdaptor, findRobot } from '@/services/resourceManageAPI';
import { dealResponse } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';

export default {
  namespace: 'simulator',

  state: {
    simulatorAgvList: [],
    simulatorHistory: {},
    allAdaptors: {},
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },

    saveSimulatorHistory(state, action) {
      return {
        ...state,
        simulatorHistory: action.payload,
      };
    },

    saveSimulatorAgvList(state, action) {
      return {
        ...state,
        simulatorAgvList: action.payload,
      };
    },
  },

  effects: {
    *fetchAllAdaptors(_, { call, put }) {
      const response = yield call(fetchAllAdaptor);
      if (!dealResponse(response)) {
        yield put({
          type: 'save',
          payload: { allAdaptors: response },
        });
      }
    },
    *fetchSimulatorHistory(_, { call, put }) {
      const response = yield call(fetchSimulatorHistory);
      if (!dealResponse(response)) {
        yield put({
          type: 'saveSimulatorHistory',
          payload: response,
        });
      }
    },

    *fetchSimulatorLoginAGV(_, { call, put }) {
      const allAGVs = yield put.resolve({ type: 'monitor/refreshAllAgvList' });
      if (allAGVs !== null) {
        // 获取Coordinator所有的小车控制状态信息
        const allAgvControlState = yield call(fetchSimulatorLoginAGVControlState);
        if (dealResponse(allAgvControlState)) {
          return false;
        }

        // 将小车控制状态信息Map到小车数据中
        const allSimulatorAgvList = allAGVs.map((item) => ({
          ...item,
          canMove: allAgvControlState[item.vehicleId],
        }));

        yield put({ type: 'saveSimulatorAgvList', payload: allSimulatorAgvList });
      }
    },

    // 配置适配器的模拟小车
    *fetchAddSimulatorAgv({ payload }, { call }) {
      const response = yield call(findRobot, payload);
      return !dealResponse(response, true);
    },

    *fetchDeletedSimulatorAgv({ payload, then }, { call }) {
      const { robotIds } = payload;
      const currentLogicAreaData = getCurrentLogicAreaData('monitor');
      const params = {
        logicId: currentLogicAreaData.id,
        robotIds: robotIds.join(','),
      };
      const response = yield call(fetchBatchDeleteSimulatorAgv, params);
      return !dealResponse(response, true);
    },

    *fetchSimulatorGetAGVConfig({ payload, then }, { call }) {
      const response = yield call(fetchSimulatorAGVConfig, payload);
      if (!dealResponse(response)) {
        return response;
      } else {
        return false;
      }
    },

    *fetchUpdateAGVConfig({ payload, then }, { call }) {
      const response = yield call(fetchUpdateAGVConfig, payload);
      return !dealResponse(response, true);
    },
  },
};
