import {
  fetchCancelTask,
  fetchResetTask,
  fetchRestartTask,
  fetchRestoreTask,
} from '@/services/commonService';
import { dealResponse } from '@/utils/util';
import { fetchTaskDetail } from '@/services/taskService';

const InitState = {
  taskId: null, // 标记当前正在查看的任务ID
  taskDetailVisible: false,
  loadingTaskDetail: true, // 标记加载任务详情Spin
  detailInfo: {},
  singleErrorTask: [],
  taskRecord: [], // 任务日志
  taskAlarm: [], // 告警信息
};
export default {
  namespace: 'task',

  state: {
    ...InitState,
  },

  effects: {
    *fetchTaskDetailByTaskId({ payload }, { call, put }) {
      const { taskId } = payload;
      yield put({ type: 'changeTaskDetailModalVisible', payload: { taskId, visible: true } });

      // 获取任务详情
      const response = yield call(fetchTaskDetail, taskId);
      if (dealResponse(response)) {
        return;
      }

      // 获取告警信息
      // const responseAlarm = yield call(getAlertCentersByTaskIdOrVehicleId, { taskId });
      // if (dealResponse(responseAlarm)) {
      //   return;
      // }

      // 获取小车错误记录
      // const params = { taskId, size: 500, current: 1 };
      // const responseForError = yield call(fetchVehicleErrorRecord, params);
      // if (dealResponse(responseForError)) {
      //   return;
      // }

      yield put({
        type: 'commonSetTaskState',
        payload: {
          detailInfo: response,
          // singleErrorTask: responseForError.list,
          // taskAlarm: responseAlarm ?? [],
          loadingTaskDetail: false,
        },
      });
    },

    *fetchResetTaskDetailModal(_, { put }) {
      yield put({
        type: 'commonSetTaskState',
        payload: {
          ...InitState,
        },
      });
    },

    *fetchRestartTask({ payload }, { call }) {
      const { vehicleType, ...rest } = payload;
      const response = yield call(fetchRestartTask, vehicleType, rest);
      dealResponse(response, true);
    },

    *fetchResetTask({ payload }, { call }) {
      const { vehicleType, ...rest } = payload;
      const response = yield call(fetchResetTask, vehicleType, rest);
      dealResponse(response, true);
    },

    *fetchCancelTask({ payload }, { call }) {
      const { vehicleType, ...rest } = payload;
      const response = yield call(fetchCancelTask, vehicleType, rest);
      dealResponse(response, true);
    },

    *fetchRestoreTask({ payload }, { call }) {
      const { vehicleType, ...rest } = payload;
      const response = yield call(fetchRestoreTask, vehicleType, rest);
      dealResponse(response, true);
    },
  },

  reducers: {
    commonSetTaskState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    fetchTaskDetailByTaskIdEffect(state, { payload }) {
      return {
        ...state,
        detailInfo: payload,
      };
    },
    fetchTaskErrorTaskIdEffect(state, { payload }) {
      return {
        ...state,
        singleErrorTask: payload,
      };
    },
    changeTaskDetailModalVisible(state, { payload }) {
      return {
        ...state,
        taskId: payload.taskId,
        taskDetailVisible: payload.visible,
      };
    },
    changeLoadingTaskDetail(state, { payload }) {
      return {
        ...state,
        loadingTaskDetail: payload,
      };
    },
    fetchTaskAlarmByTaskIdEffect(state, { payload }) {
      return {
        ...state,
        taskAlarm: payload,
      };
    },
  },
};
