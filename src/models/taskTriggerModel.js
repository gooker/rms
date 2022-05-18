import { message } from 'antd';
import { getCustomTaskList, getCustomTaskNodes, getFormModelTypes,fetchActiveMap } from '@/services/api';
import { dealResponse,formatMessage } from '@/utils/util';

export default {
  namespace: 'taskTriger',

  state: {
    activeMap: null,
    customTaskList: [],
    modelTypes: null, // 业务模型数据
    customTypes: {}, // 任务节点类型
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
      const customTaskList = yield call(getCustomTaskList);
      if (!dealResponse(customTaskList)) {
        yield put({ type: 'saveCustomTaskList', payload: customTaskList });
      } else {
        message.error(formatMessage({ id: 'app.taskTrigger.getCustomTaskFailed' }));
      }
    },

    *fetchCustomTyps(_, { call, put }) {
      const customTypes = yield call(getCustomTaskNodes);
      if (!dealResponse(customTypes)) {
        yield put({ type: 'saveCustomTypes', payload: customTypes });
      } else {
        // message.error(formatMessage({ id: 'app.taskTrigger.getCustomTaskFailed' }));
      }
    },

    *fetchModelTypes(_, { call, select, put }) {
      const { activeMap } = yield select((state) => state.taskTriger);
      const modelTypes = yield call(getFormModelTypes, { mapId: activeMap.id });
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
    saveCustomTypes(state, { payload }) {
      return {
        ...state,
        customTypes: payload,
      };
    },
  },
};
