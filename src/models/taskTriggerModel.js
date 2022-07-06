import { message } from 'antd';
import { fetchActiveMap, fetchCustomParamType, fetchCustomTaskList } from '@/services/commonService';
import { dealResponse, formatMessage } from '@/utils/util';

export default {
  namespace: 'taskTriger',

  state: {
    activeMap: null,
    customTaskList: [],
    modelTypes: null, // 业务模型数据
  },

  effects: {
    *fetchActiveMap(_, { call, put }) {
      const activeMap = yield call(fetchActiveMap);
      if (!dealResponse(activeMap)) {
        yield put({ type: 'saveActiveMap', payload: activeMap });
      } else {
        message.error(formatMessage({ id: 'customTask.fetch.map.fail' }));
      }
    },

    *fetchCustomTaskList(_, { call, put }) {
      const customTaskList = yield call(fetchCustomTaskList);
      if (!dealResponse(customTaskList)) {
        yield put({ type: 'saveCustomTaskList', payload: customTaskList });
      } else {
        message.error(formatMessage({ id: 'app.taskTrigger.getCustomTaskFailed' }));
      }
    },

    *fetchModelTypes(_, { call, select, put }) {
      const { activeMap } = yield select((state) => state.taskTriger);
      const modelTypes = yield call(fetchCustomParamType, { mapId: activeMap.id });
      if (!dealResponse(modelTypes)) {
        yield put({ type: 'saveModelTypes', payload: modelTypes });
      } else {
        message.error(formatMessage({ id: 'app.taskTrigger.getModelTypesFailed' }));
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
