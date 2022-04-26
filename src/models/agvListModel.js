import { fetchAllAdaptor, fetchAllRobot } from '@/services/resourceManageAPI';
import { dealResponse } from '@/utils/util';

export default {
  namespace: 'agvList',

  state: {
    showRegisterPanel: false,
    addRegistrationModalShown: false,
    registerRobotModalShown: false,

    allAdaptors: {},
    allRobots: [],
    searchParams: { id: [], state: [] },
  },

  effects: {
    * fetchInitialData(_, { put }) {
      const [allRobots, allAdaptors] = yield Promise.all([fetchAllRobot(), fetchAllAdaptor()]);
      if (!dealResponse(allRobots) && !dealResponse(allAdaptors)) {
        yield put({ type: 'saveState', payload: { allRobots, allAdaptors } });
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
        allRobots: action.payload,
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
    updateRegisterRobotModalShown(state, action) {
      return {
        ...state,
        registerRobotModalShown: action.payload,
      };
    },
  },
};
