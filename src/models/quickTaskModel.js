import { dealResponse } from '@/utils/util';
import { fetchCustomTaskList } from '@/services/commonService';
import { fetchAllQuickTaskGroups, fetchVisibleQuickTasks } from '@/services/smartTaskService';
import { fetchAllLoadSpecification } from '@/services/resourceService';

const initState = {
  userTasks: [],
  sharedTasks: [],
  quickTaskGroups: [],
  customTasks: [],
  loadSpecification: [], // 载具规格
  storageSpecification: [], // 车辆容器规格

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
      if (!dealResponse(response)) {
        yield put({ type: 'updateQuickTasks', payload: response });
      }
    },

    * initQuickTaskPage(_, { call, put }) {
      const validateBindCustomTask = { own: false, customTask: false };
      const [quickTasks, quickTaskGroups, customTasks, loadSpecification] =
        yield Promise.allSettled([
          fetchVisibleQuickTasks(),
          fetchAllQuickTaskGroups(),
          fetchCustomTaskList(),
          fetchAllLoadSpecification(),
        ]);
      if (quickTasks.status === 'fulfilled' && !dealResponse(quickTasks.value)) {
        validateBindCustomTask.own = true;
        yield put({ type: 'updateQuickTasks', payload: quickTasks.value });
      }

      const payload = {};
      if (quickTaskGroups.status === 'fulfilled' && !dealResponse(quickTaskGroups.value)) {
        payload.quickTaskGroups = quickTaskGroups.value;
      }
      if (customTasks.status === 'fulfilled' && !dealResponse(customTasks.value)) {
        validateBindCustomTask.customTask = true;
        payload.customTasks = customTasks.value;
      }
      if (loadSpecification.status === 'fulfilled' && !dealResponse(loadSpecification.value)) {
        payload.loadSpecification = loadSpecification.value;
      }
      yield put({ type: 'updateState', payload });

      if (validateBindCustomTask.own && validateBindCustomTask.customTask) {
        // TODO: 检查own的快捷任务所绑定的自定义任务是否被删除
        // message.error(formatMessage({ id: 'variable.customTaskData.missing' }));
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
