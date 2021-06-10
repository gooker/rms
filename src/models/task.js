import {
  fetchTaskDetailByTaskId,
  fetchRestartTask,
  fetchResetTask,
  fetchCancelTask,
  fetchRestoreTask,
  fetchAgvErrorRecord,
} from '@/services/api';
import { dealResponse } from '@/utils/Utils';

export default {
  namespace: 'task',

  state: {
    taskId: null, // 标记当前正在查看的任务ID
    taskAgvType: null, // 标记当前正在查看任务的小车类型
    taskDetailVisible: false,
    loadingTaskDetail: true, // 标记加载任务详情Spin

    detailInfo: {},
    singleErrorTask: [],
  },

  effects: {
    *fetchTaskDetailByTaskId({ payload }, { call, put, select }) {
      const { nameSpace, taskId, taskAgvType } = payload;
      const sectionId = window.localStorage.getItem('sectionId');

      const changeVisiblePayload = { taskId, taskAgvType, visible: true };
      yield put({ type: 'changeTaskDetailModalVisible', payload: changeVisiblePayload });

      // 获取任务详情
      const response = yield call(fetchTaskDetailByTaskId, nameSpace, { taskId });
      if (dealResponse(response)) {
        return;
      }

      // 获取小车错误记录
      const params = { sectionId, taskId, size: 500, current: 1 };
      const responseForError = yield call(fetchAgvErrorRecord, nameSpace, params);
      if (dealResponse(responseForError)) {
        return;
      }

      yield put({ type: 'fetchTaskDetailByTaskIdEffect', payload: response });
      yield put({ type: 'fetchTaskErrorTaskIdEffect', payload: responseForError.list });
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

    *fetchRestartTask({ payload, then }, { call }) {
      const response = yield call(fetchRestartTask, payload);
      if (dealResponse(response, 1, '重置务操作下发成功')) {
        return;
      }
      if (then) {
        then();
      }
    },

    *fetchResetTask({ payload, then }, { call }) {
      const response = yield call(fetchResetTask, payload);
      if (dealResponse(response, 1, '重做任务指令下发成功')) {
        return;
      }
      if (then) {
        then();
      }
    },

    *fetchCancelTask({ payload, then }, { call }) {
      const response = yield call(fetchCancelTask, payload);
      if (dealResponse(response, 1, '取消任务指令下发成功')) {
        return;
      }
      if (then) {
        then();
      }
    },

    *fetchRestoreTask({ payload, then }, { call }) {
      const response = yield call(fetchRestoreTask, payload);
      if (dealResponse(response, 1, '任务恢复指令下发完成')) {
        return;
      }
      if (then) {
        then();
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
  },
};
