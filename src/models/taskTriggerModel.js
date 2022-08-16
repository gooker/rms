import { message } from 'antd';
import { fetchActiveMap, fetchCustomParamType, fetchCustomTaskList } from '@/services/commonService';
import { dealResponse, formatMessage } from '@/utils/util';
import { fetchVisibleQuickTasks } from '@/services/smartTaskService';

export default {
  namespace: 'taskTrigger',

  state: {
    activeMap: null,
    quickTaskList: [],
    customTaskList: [],
    modelTypes: null, // 业务模型数据
  },

  effects: {
    * fetchActiveMap(_, { call, put }) {
      const activeMap = yield call(fetchActiveMap);
      if (!dealResponse(activeMap)) {
        yield put({ type: 'saveActiveMap', payload: activeMap });
      } else {
        message.error(formatMessage({ id: 'customTask.fetch.map.fail' }));
      }
    },

    * fetchCustomTaskList(_, { call, put }) {
      const customTaskList = yield call(fetchCustomTaskList);
      if (!dealResponse(customTaskList)) {
        yield put({ type: 'saveCustomTaskList', payload: customTaskList });
      }
    },

    * fetchQuickTaskList(_, { call, put }) {
      const quickTaskList = yield call(fetchVisibleQuickTasks);

      if (!dealResponse(quickTaskList)) {
        const { OWN, SHARED } = quickTaskList;
        let payload = [];
        if (Array.isArray(OWN)) {
          payload = payload.concat(OWN);
        }
        if (Array.isArray(SHARED)) {
          payload = payload.concat(SHARED);
        }
        yield put({ type: 'saveQuickTaskList', payload });
      }
    },

    * fetchModelTypes(_, { call, select, put }) {
      const { activeMap } = yield select((state) => state.taskTrigger);
      const modelTypes = yield call(fetchCustomParamType, { mapId: activeMap.id });
      if (!dealResponse(modelTypes)) {
        yield put({ type: 'saveModelTypes', payload: modelTypes });
      }
    },
  },

  reducers: {
    saveCustomTaskList(state, { payload }) {
      return {
        ...state,
        customTaskList: payload,
      };
    },
    saveQuickTaskList(state, { payload }) {
      return {
        ...state,
        quickTaskList: payload,
      };
    },
    saveActiveMap(state, { payload }) {
      return {
        ...state,
        activeMap: payload,
      };
    },
    saveModelTypes(state, { payload }) {
      return {
        ...state,
        modelTypes: payload,
      };
    },
  },
};
