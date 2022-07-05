import { dealResponse, transformVehicleList } from '@/utils/util';
import { fetchAllVehicleList } from '@/services/commonService';

export default {
  namespace: 'vehicleList',

  state: {
    showRegisterPanel: false,
    addRegistrationModalShown: false,
    registerVehicleModalShown: false,
    searchParams: { id: [], state: [], vehicleType: null },

    allVehicles: [],
    upgradeOrder: [],
  },

  effects: {
    * fetchInitialData(_, { put, call }) {
      const allVehicles = yield call(fetchAllVehicleList);
      if (!dealResponse(allVehicles)) {
        const _allVehicles = transformVehicleList(allVehicles);
        yield put({ type: 'saveAllVehicles', payload: _allVehicles });
      }
    },
  },

  reducers: {
    saveState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveAllVehicles(state, action) {
      return {
        ...state,
        allVehicles: action.payload,
      };
    },
    updateSearchParams(state, action) {
      return {
        ...state,
        searchParams: action.payload,
      };
    },
    updateShowRegisterPanel(state, action) {
      return {
        ...state,
        showRegisterPanel: action.payload,
      };
    },
    updateAddRegistrationModalShown(state, action) {
      return {
        ...state,
        addRegistrationModalShown: action.payload,
      };
    },
    updateRegisterVehicleModalShown(state, action) {
      return {
        ...state,
        registerVehicleModalShown: action.payload,
      };
    },
  },
};
