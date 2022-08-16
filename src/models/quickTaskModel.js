import { dealResponse } from '@/utils/util';
import { fetchCustomParamType, fetchCustomTaskList } from '@/services/commonService';
import { fetchAllQuickTaskGroups, fetchVisibleQuickTasks } from '@/services/smartTaskService';
import { fetchAllLoadSpecification } from '@/services/resourceService';
import { QuickTaskSource } from '@/packages/SmartTask/QuickTask/quickTaskConstant';

const initState = {
  quickTasks: [],
  customTasks: [],
  quickTaskGroups: [],
  loadSpecification: [], // 载具规格
  storageSpecification: [], // 车辆容器规格
  targetSource: [],

  taskModalVisible: false,
  groupModalVisible: false,
  executeModalVisible: false,
  variableModalVisible: false,

  editing: null,
  viewType: QuickTaskSource.own,
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
      const [quickTasks, quickTaskGroups, customTasks, loadSpecification, targetSource] =
        yield Promise.allSettled([
          fetchVisibleQuickTasks(),
          fetchAllQuickTaskGroups(),
          fetchCustomTaskList(),
          fetchAllLoadSpecification(),
          fetchCustomParamType(), // 目标点
        ]);
      if (quickTasks.status === 'fulfilled' && !dealResponse(quickTasks.value)) {
        yield put({ type: 'updateQuickTasks', payload: quickTasks.value });
      }

      const payload = {};
      if (quickTaskGroups.status === 'fulfilled' && !dealResponse(quickTaskGroups.value)) {
        payload.quickTaskGroups = quickTaskGroups.value;
      }
      if (customTasks.status === 'fulfilled' && !dealResponse(customTasks.value)) {
        payload.customTasks = customTasks.value;
      }
      if (loadSpecification.status === 'fulfilled' && !dealResponse(loadSpecification.value)) {
        payload.loadSpecification = loadSpecification.value;
      }
      if (targetSource.status === 'fulfilled' && !dealResponse(targetSource.value)) {
        payload.targetSource = targetSource.value;
      }
      yield put({ type: 'updateState', payload });
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
      return { ...state, quickTasks: payload };
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
    updateViewType(state, { payload }) {
      return {
        ...state,
        viewType: payload,
      };
    },
  },
};
