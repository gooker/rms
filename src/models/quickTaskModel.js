import { fetchAllQuickTaskGroups, fetchVisibleQuickTasks } from '@/services/smartTaskService';
import { dealResponse, formatMessage } from '@/utils/util';
import { fetchCustomParamType, getCustomTaskList } from '@/services/commonService';

const initState = {
  userTasks: [],
  sharedTasks: [],
  quickTaskGroups: [],
  customTasks: [],
  modelParam: null,

  taskModalVisible: false,
  groupModalVisible: false,
  executeModalVisible: false,
  variableModalVisible: false,
  shardTaskModalVisible: false,

  editing: null,
};

export default {
  namespace: 'quickTask',

  state: { ...initState },

  effects: {
    * getVisibleQuickTasks(_, { call, put }) {
      const response = yield call(fetchVisibleQuickTasks);
      // TODO: 需要检查快捷任务绑定的自定义任务是否被删除或者替换
      if (
        !dealResponse(
          response,
          false,
          formatMessage(
            { id: 'app.message.fetchFailTemplate' },
            { type: formatMessage({ id: 'menu.quickTask' }) },
          ),
        )
      ) {
        yield put({ type: 'updateQuickTasks', payload: response });
      }
    },
    * initQuickTaskPage(_, { call, put }) {
      const [quickTasks, quickTaskGroups, customTasks, modelParam] = yield Promise.all([
        fetchVisibleQuickTasks(),
        fetchAllQuickTaskGroups(),
        getCustomTaskList(),
        fetchCustomParamType(),
      ]);
      if (!dealResponse([quickTasks, quickTaskGroups, customTasks, modelParam])) {
        yield put({ type: 'updateQuickTasks', payload: quickTasks });
        yield put({
          type: 'updateState',
          payload: { quickTaskGroups, customTasks, modelParam },
        });
      }
    },
  },

  reducers: {
    unmount() {
      return {
        ...initState,
      };
    },
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateEditing(state, { payload }) {
      return {
        ...state,
        editing: payload,
      };
    },
    updateQuickTasks(state, { payload }) {
      return {
        ...state,
        userTasks: payload.OWN,
        sharedTasks: payload.SHARED,
      };
    },
    updateQuickTaskGroups(state, { payload }) {
      return {
        ...state,
        quickTaskGroups: payload,
      };
    },
    updateCustomTasks(state, { payload }) {
      return {
        ...state,
        customTasks: payload,
      };
    },
    updateTaskModalVisible(state, { payload }) {
      return {
        ...state,
        taskModalVisible: payload,
      };
    },
    updateExecuteModalVisible(state, { payload }) {
      return {
        ...state,
        executeModalVisible: payload,
      };
    },
    updateVariableModalVisible(state, { payload }) {
      return {
        ...state,
        variableModalVisible: payload,
      };
    },
    updateGroupModalVisible(state, { payload }) {
      return {
        ...state,
        groupModalVisible: payload,
      };
    },
    updateShardTaskModalVisible(state, { payload }) {
      return {
        ...state,
        shardTaskModalVisible: payload,
      };
    },
  },
};
