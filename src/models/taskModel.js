import {
  fetchTaskDetailByTaskId,
  fetchRestartTask,
  fetchResetTask,
  fetchCancelTask,
  fetchRestoreTask,
  fetchVehicleErrorRecord,
  getVehicleTaskLog,
  getAlertCentersByTaskIdOrVehicleId,
} from '@/services/commonService';
import { dealResponse, formatMessage } from '@/utils/util';

export default {
  namespace: 'task',

  state: {
    taskId: null, // 标记当前正在查看的任务ID
    taskVehicleType: null, // 标记当前正在查看任务的小车类型
    taskDetailVisible: false,
    loadingTaskDetail: true, // 标记加载任务详情Spin

    detailInfo: {},
    singleErrorTask: [],
    taskRecord: [], // 任务日志
    taskAlarm: [], // 告警信息
  },

  effects: {
    *fetchTaskDetailByTaskId({ payload }, { call, put, select }) {
      const { taskId, vehicleType } = payload;
      const sectionId = window.localStorage.getItem('sectionId');

      const changeVisiblePayload = { taskId, vehicleType, visible: true };
      yield put({ type: 'changeTaskDetailModalVisible', payload: changeVisiblePayload });

      // 获取任务详情
      const response = yield call(fetchTaskDetailByTaskId, vehicleType, { taskId });
      if (dealResponse(response)) {
        return;
      }

      // 获取任务日志
      const responseLog = yield call(getVehicleTaskLog, { size: 10, current: 1, taskId });
      if (dealResponse(responseLog)) {
        return;
      }

      // 获取告警信息
      const responseAlaram = yield call(getAlertCentersByTaskIdOrVehicleId, {
        taskId,
      });
      if (dealResponse(responseAlaram)) {
        return;
      }

      // 获取小车错误记录
      const params = { sectionId, taskId, size: 500, current: 1 };
      const responseForError = yield call(fetchVehicleErrorRecord, vehicleType, params);
      if (dealResponse(responseForError)) {
        return;
      }

      yield put({ type: 'fetchTaskDetailByTaskIdEffect', payload: response });
      yield put({ type: 'fetchTaskErrorTaskIdEffect', payload: responseForError.list });
      yield put({ type: 'fetchTaskLogBytaskIdEffect', payload: responseLog.list || [] });
      yield put({ type: 'fetchTaskAlaramBytaskIdEffect', payload: responseAlaram || [] });
      yield put({ type: 'changeLoadingTaskDetail', payload: false });
    },

    *fetchResetTaskDetailModal(_, { put }) {
      yield put({
        type: 'commonSetTaskState',
        payload: {
          taskId: null,
          taskVehicleType: null,
          taskDetailVisible: false,
          loadingTaskDetail: true,
          detailInfo: {},
          singleErrorTask: [],
        },
      });
    },

    *fetchRestartTask({ payload }, { call }) {
      const { vehicleType, ...rest } = payload;
      const response = yield call(fetchRestartTask, vehicleType, rest);
      if (
        dealResponse(
          response,
          formatMessage({ id: 'app.taskAction.resetTask.success' }),
          formatMessage({ id: 'app.taskAction.resetTask.fail' }),
        )
      ) {
        return;
      }
    },

    *fetchResetTask({ payload }, { call }) {
      const { vehicleType, ...rest } = payload;
      const response = yield call(fetchResetTask, vehicleType, rest);
      if (
        dealResponse(
          response,
          formatMessage({ id: 'app.taskAction.redoTask.success' }),
          formatMessage({ id: 'app.taskAction.redoTask.fail' }),
        )
      ) {
        return;
      }
    },

    *fetchCancelTask({ payload }, { call }) {
      const { vehicleType, ...rest } = payload;
      const response = yield call(fetchCancelTask, vehicleType, rest);
      if (
        dealResponse(
          response,
          formatMessage({ id: 'app.taskAction.cancelTask.success' }),
          formatMessage({ id: 'app.taskAction.cancelTask.fail' }),
        )
      ) {
        return;
      }
    },

    *fetchRestoreTask({ payload }, { call }) {
      const { vehicleType, ...rest } = payload;
      const response = yield call(fetchRestoreTask, vehicleType, rest);
      if (
        dealResponse(
          response,
          formatMessage({ id: 'app.taskAction.restoreTask.success' }),
          formatMessage({ id: 'app.taskAction.restoreTask.fail' }),
        )
      ) {
        return;
      }
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
        taskVehicleType: payload.vehicleType,
        taskDetailVisible: payload.visible,
      };
    },

    changeLoadingTaskDetail(state, { payload }) {
      return {
        ...state,
        loadingTaskDetail: payload,
      };
    },
    fetchTaskLogBytaskIdEffect(state, { payload }) {
      return {
        ...state,
        taskRecord: payload,
      };
    },
    fetchTaskAlaramBytaskIdEffect(state, { payload }) {
      return {
        ...state,
        taskAlarm: payload,
      };
    },
  },
};
