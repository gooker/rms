import { fetchChargerList, findChargerAdapter, findMapCharger } from '@/services/resourceService';
import { dealResponse } from '@/utils/util';

export default {
  namespace: 'chargerList',

  state: {
    showRegisterPanel: false,
    addRegistrationModalShown: false,
    registerChargerModalShown: false,

    allAdaptors: [], //充电桩适配器
    allChargers: [], //充电桩列表
    allMapChargers: [], // 地图充电桩列表
    searchParams: { id: [], chargerStatus: [] },
  },

  effects: {
    *fetchInitialData(_, { put }) {
      const [allChargers, allAdaptors, allMapChargers] = yield Promise.all([
        fetchChargerList(),
        findChargerAdapter(),
        findMapCharger(),
      ]);
      if (!dealResponse(allChargers) && !dealResponse(allAdaptors)) {
        yield put({ type: 'saveState', payload: { allChargers, allAdaptors, allMapChargers } });
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
        allChargers: action.payload,
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
    updateRegisterChargerModalShown(state, action) {
      return {
        ...state,
        registerChargerModalShown: action.payload,
      };
    },
  },
};
