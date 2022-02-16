import {
  fetchTaskDetailByTaskId,
  fetchRestartTask,
  fetchResetTask,
  fetchCancelTask,
  fetchRestoreTask,
  fetchAgvErrorRecord,
  getAGVTaskLog,
  getAlertCentersByTaskIdOrAgvId,
} from '@/services/api';
import { dealResponse, formatMessage } from '@/utils/util';

export default {
  namespace: 'task',

  state: {
    taskId: null, // 标记当前正在查看的任务ID
    taskAgvType: null, // 标记当前正在查看任务的小车类型
    taskDetailVisible: false,
    loadingTaskDetail: true, // 标记加载任务详情Spin

    detailInfo: {},
    singleErrorTask: [],
    taskRecord: [], // 任务日志
    taskAlaram: [], // 告警信息
  },

  effects: {
    *fetchTaskDetailByTaskId({ payload }, { call, put, select }) {
      const { taskId, taskAgvType } = payload;
      const sectionId = window.localStorage.getItem('sectionId');

      const changeVisiblePayload = { taskId, taskAgvType, visible: true };
      yield put({ type: 'changeTaskDetailModalVisible', payload: changeVisiblePayload });

      // 获取任务详情
      const response = yield call(fetchTaskDetailByTaskId, taskAgvType, { taskId });
      if (dealResponse(response)) {
        return;
      }

      // 获取任务日志
      const responseLog = yield call(getAGVTaskLog, {
        size: 10,
        current: 1,
        taskId,
      });
      if (dealResponse(responseLog)) {
        return;
      }

      // 获取告警信息
      const responseAlaram = yield call(getAlertCentersByTaskIdOrAgvId, {
        taskId,
      });
      if (dealResponse(responseAlaram)) {
        return;
      }

      // 获取小车错误记录
      const params = { sectionId, taskId, size: 500, current: 1 };
      const responseForError = yield call(fetchAgvErrorRecord, taskAgvType, params);
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
          taskAgvType: null,
          taskDetailVisible: false,
          loadingTaskDetail: true,
          detailInfo: {},
          singleErrorTask: [],
        },
      });
    },

    *fetchRestartTask({ payload }, { call }) {
      const { agvType, ...rest } = payload;
      const response = yield call(fetchRestartTask, agvType, rest);
      if (
        dealResponse(
          response,
          true,
          formatMessage({ id: 'app.taskAction.resetTask.success' }),
          formatMessage({ id: 'app.taskAction.resetTask.fail' }),
        )
      ) {
        return;
      }
    },

    *fetchResetTask({ payload }, { call }) {
      const { agvType, ...rest } = payload;
      const response = yield call(fetchResetTask, agvType, rest);
      if (
        dealResponse(
          response,
          true,
          formatMessage({ id: 'app.taskAction.redoTask.success' }),
          formatMessage({ id: 'app.taskAction.redoTask.fail' }),
        )
      ) {
        return;
      }
    },

    *fetchCancelTask({ payload }, { call }) {
      const { agvType, ...rest } = payload;
      const response = yield call(fetchCancelTask, agvType, rest);
      if (
        dealResponse(
          response,
          true,
          formatMessage({ id: 'app.taskAction.cancelTask.success' }),
          formatMessage({ id: 'app.taskAction.cancelTask.fail' }),
        )
      ) {
        return;
      }
    },

    *fetchRestoreTask({ payload }, { call }) {
      const { agvType, ...rest } = payload;
      const response = yield call(fetchRestoreTask, agvType, rest);
      if (
        dealResponse(
          response,
          true,
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
        taskAgvType: payload.taskAgvType,
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
        taskAlaram: payload,
      };
    },
  },
};
