import { message } from 'antd';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import { fetchActiveMap, getCustomTaskList, getFormModelLockResource } from '@/services/api';

export default {
  namespace: 'customTask',

  state: {
    // 地图相关
    mapData: null,
    currentLogicArea: 0, // id
    currentRouteMap: 'DEFAULT', // code
    preRouteMap: null, // 记录上一个路线区数据, 用于切换路线区时候拿到上一次路线区的数据做清理工作
    listVisible: true,
    customTaskList: [],
    editingRow: null,
    modelLocks: {}, // 业务模型可锁资源
  },

  reducers: {
    saveState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveCustomTaskList(state, { payload }) {
      return {
        ...state,
        customTaskList: payload,
      };
    },
    saveEditingRow(state, { payload }) {
      return {
        ...state,
        editingRow: payload,
      };
    },
    saveListVisible(state, { payload }) {
      return {
        ...state,
        listVisible: payload,
      };
    },
  },

  effects: {
    * initPage(_, { call, put }) {
      const mapData = yield call(fetchActiveMap);
      if (isNull(mapData) || dealResponse(mapData)) {
        message.error(formatMessage({ id: 'app.message.noActiveMap' }));
      } else {
        try {
          const [modelLocks] = yield Promise.all([getFormModelLockResource()]);
          const state = { mapData };
          if (!dealResponse(modelLocks)) {
            state.modelLocks = modelLocks;
          }
          yield put({ type: 'saveState', payload: state });
        } catch (error) {
          message.error(formatMessage({ id: 'app.message.initFailed' }, { reason: error.message }));
        }
      }
    },

    *getCustomTaskList(_, { call, put }) {
      const response = yield call(getCustomTaskList);
      if (dealResponse(response)) {
        message.error(
          formatMessage(
            { id: 'app.message.fetchFailTemplate' },
            { type: formatMessage({ id: 'menu.customTask' }) },
          ),
        );
      } else {
        yield put({ type: 'saveCustomTaskList', payload: response });
      }
    },
  },
};
