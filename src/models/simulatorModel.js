import {
  fetchBatchDeleteSimulatorVehicle,
  fetchSimulatorHistory,
  fetchSimulatorVehicleConfig,
  fetchUpdateVehicleConfig,
} from '@/services/monitorService';
import { fetchAllAdaptor, findVehicle } from '@/services/resourceService';
import { dealResponse } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';

export default {
  namespace: 'simulator',

  state: {
    simulatorVehicleList: [],
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

    saveSimulatorVehicleList(state, action) {
      return {
        ...state,
        simulatorVehicleList: action.payload,
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

    // 配置适配器的模拟小车
    *fetchAddSimulatorVehicle({ payload }, { call }) {
      const response = yield call(findVehicle, payload);
      return !dealResponse(response, true);
    },

    *fetchDeletedSimulatorVehicle({ payload, then }, { call }) {
      const { vehicleIds } = payload;
      const currentLogicAreaData = getCurrentLogicAreaData('monitor');
      const params = {
        logicId: currentLogicAreaData.id,
        vehicleIds: vehicleIds.join(','),
      };
      const response = yield call(fetchBatchDeleteSimulatorVehicle, params);
      return !dealResponse(response, true);
    },

    *fetchSimulatorGetVehicleConfig({ payload, then }, { call }) {
      const response = yield call(fetchSimulatorVehicleConfig, payload);
      if (!dealResponse(response)) {
        return response;
      } else {
        return false;
      }
    },

    *fetchUpdateVehicleConfig({ payload, then }, { call }) {
      const response = yield call(fetchUpdateVehicleConfig, payload);
      return !dealResponse(response, true);
    },
  },
};
