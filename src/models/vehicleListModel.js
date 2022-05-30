import { fetchAllAdaptor, fetchAllVehicle } from '@/services/resourceManageAPI';
import { dealResponse } from '@/utils/util';

export default {
  namespace: 'vehicleList',

  state: {
    showRegisterPanel: false,
    addRegistrationModalShown: false,
    registerVehicleModalShown: false,

    allAdaptors: {},
    allVehicles: [],
    searchParams: { id: [], state: [] },
  },

  effects: {
    * fetchInitialData(_, { put }) {
      const [allVehicles, allAdaptors] = yield Promise.all([fetchAllVehicle(), fetchAllAdaptor()]);
      if (!dealResponse(allVehicles) && !dealResponse(allAdaptors)) {
        yield put({ type: 'saveState', payload: { allVehicles, allAdaptors } });
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