import {
  findAllDeviceTypes,
  findAllDevices,
  findAllDeviceAdapter,
} from '@/services/resourceManageAPI';
import { dealResponse } from '@/utils/util';

export default {
  namespace: 'equipList',

  state: {
    showRegisterPanel: false,
    addRegistrationModalShown: false,
    registerDeviceModalShown: false,
    deviceActionShown: false,

    allDeviceTypes: [],
    allAdaptors: [],
    allDevices: [],
    searchParams: { id: [], connectionType: [] },
  },

  effects: {
    *fetchInitialData(_, { put }) {
      const [allDevices, allDeviceTypes, allAdaptors] = yield Promise.all([
        findAllDevices(),
        findAllDeviceTypes(),
        findAllDeviceAdapter(),
      ]);
      if (!dealResponse(allDevices) && !dealResponse(allDeviceTypes)) {
        yield put({ type: 'saveState', payload: { allDevices, allDeviceTypes, allAdaptors } });
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
    saveAllRobots(state, action) {
      return {
        ...state,
        allDevices: action.payload,
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
    updateRegisterDeviceModalShown(state, action) {
      return {
        ...state,
        registerDeviceModalShown: action.payload,
      };
    },
    updateDeviceActionModalShown(state, action) {
      return {
        ...state,
        deviceActionShown: action.payload,
      };
    },
  },
};
