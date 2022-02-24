import {
  addSimulationAgv,
  fetchUpdateAGVConfig,
  fetchSimulatorHistory,
  fetchSimulatorLoginAGV,
  fetchSimulatorAGVConfig,
  fetchSimulatorAgvOffLine,
  fetchBatchDeleteSimulatorAgv,
  fetchSimulatorLoginAGVControlState,
} from '@/services/monitor';
import { dealResponse } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';

export default {
  namespace: 'simulator',

  state: {
    simulatorAgvList: [],
    simulatorConfig: {},
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveSimulatorAgvList(state, action) {
      return {
        ...state,
        simulatorAgvList: action.payload,
      };
    },
  },

  effects: {
    *fetchSimulatorHistory(_, { call, put }) {
      const response = yield call(fetchSimulatorHistory);
      if (!dealResponse(response)) {
        yield put({
          type: 'save',
          payload: {
            simulatorConfig: response,
          },
        });
      }
    },

    *fetchSimulatorLoginAGV(_, { call, put }) {
      // 获取Coodinator所有的小车信息
      const response = yield call(fetchSimulatorLoginAGV);
      if (dealResponse(response)) {
        return false;
      }

      // 获取Coodinator所有的小车控制状态信息
      const allAgvControlState = yield call(fetchSimulatorLoginAGVControlState);
      if (dealResponse(allAgvControlState)) {
        return false;
      }

      // 将小车控制状态信息Map到小车数据中
      const allSimulatorAgvList = Object.values(response).map((item) => {
        const { robotId } = item;
        return { ...item, canMove: allAgvControlState[robotId] };
      });

      yield put({
        type: 'saveSimulatorAgvList',
        payload: allSimulatorAgvList,
      });
    },

    *fetchAddSimulatorAgv({ payload }, { call }) {
      const response = yield call(addSimulationAgv, payload);
      if (dealResponse(response, 1, '操作成功')) {
        return false;
      }
    },

    *fetchDeletedSimulatorAgv({ payload, then }, { call }) {
      const { robotIds } = payload;
      const currentLogicAreaData = getCurrentLogicAreaData('monitor');
      const params = {
        logicId: currentLogicAreaData.id,
        robotIds: robotIds.join(','),
      };
      const response = yield call(fetchBatchDeleteSimulatorAgv, params);
      if (dealResponse(response, 1, '删除小车成功')) return false;
      then && then();
    },

    *fetchSimulatorAgvOffLine({ payload, then }, { call }) {
      const { robotIds } = payload;
      const currentLogicAreaData = getCurrentLogicAreaData('monitor');
      for (let index = 0; index < robotIds.length; index++) {
        const robotId = robotIds[index];
        const params = {
          logicId: currentLogicAreaData.id,
          robotId,
        };
        const response = yield call(fetchSimulatorAgvOffLine, params);
        if (dealResponse(response, 1, '小车下线成功')) {
          return false;
        }
        then && then();
      }
    },


    *fetchUpdateAGVConfig({ payload, then }, { call }) {
      const response = yield call(fetchUpdateAGVConfig, payload);
      if (dealResponse(response, 1, '操作成功')) {
        return false;
      }
      if (then) {
        then();
      }
    },

    *fetchSimulatorGetAGVConfig({ payload, then }, { call }) {
      const response = yield call(fetchSimulatorAGVConfig, payload);
      if (dealResponse(response)) {
        return false;
      }
      then && then(response);
    },
  },
};
