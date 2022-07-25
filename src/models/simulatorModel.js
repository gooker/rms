import {
  fetchBatchDeleteSimulatorVehicle,
  fetchSimulatorVehicleConfig,
  fetchUpdateVehicleConfig,
} from '@/services/monitorService';
import { dealResponse, formatMessage, transformVehicleList } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import { fetchAllVehicleList } from '@/services/commonService';

export default {
  namespace: 'simulator',

  state: {
    simulatorHistory: {},
    simulatorVehicleList: [],
  },

  effects: {
    * init(_, { call, put }) {
      // 刷新小车列表数据
      // 刷新模拟器开启状态
      const allVehicles = yield call(fetchAllVehicleList);
      if (
        !dealResponse(allVehicles, false, formatMessage({ id: 'app.message.fetchVehicleListFail' }))
      ) {
        yield put({ type: 'saveSimulatorVehicleList', payload: transformVehicleList(allVehicles) });
      }
    },

    * fetchDeletedSimulatorVehicle({ payload, then }, { call }) {
      const { vehicleIds } = payload;
      const currentLogicAreaData = getCurrentLogicAreaData('monitor');
      const params = {
        logicId: currentLogicAreaData.id,
        vehicleIds: vehicleIds.join(','),
      };
      const response = yield call(fetchBatchDeleteSimulatorVehicle, params);
      return !dealResponse(response, true);
    },

    * fetchSimulatorGetVehicleConfig({ payload, then }, { call }) {
      const response = yield call(fetchSimulatorVehicleConfig, payload);
      if (!dealResponse(response)) {
        return response;
      } else {
        return false;
      }
    },

    * fetchUpdateVehicleConfig({ payload, then }, { call }) {
      const response = yield call(fetchUpdateVehicleConfig, payload);
      return !dealResponse(response, true);
    },
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
};
