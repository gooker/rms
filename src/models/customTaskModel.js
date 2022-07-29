import { message } from 'antd';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import {
  fetchActiveMap,
  fetchCustomParamType,
  fetchCustomTaskList,
  getFormModelLockResource,
} from '@/services/commonService';
import { fetchAllLoadSpecification } from '@/services/resourceService';

export default {
  namespace: 'customTask',

  state: {
    mapData: null,
    listVisible: true,
    customTaskList: [],
    editingRow: null,

    targetSource: [], // 目标点数据资源
    storageSpecification: [], // 车辆容器规格
    loadSpecification: [], // 载具规格
    modelLocks: null, // 业务可锁资源
  },

  reducers: {
    saveState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmount(state) {
      return {
        ...state,
        listVisible: true,
        editingRow: null,
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
    *initPage(_, { call, put }) {
      const mapData = yield call(fetchActiveMap);
      if (dealResponse(mapData)) {
        return;
      }
      if (isNull(mapData)) {
        message.error(formatMessage({ id: 'app.message.noActiveMap' }));
        return;
      }
      try {
        const [modelLocks, loadSpecification, targetSource] = yield Promise.all([
          getFormModelLockResource(), // 业务模型可锁资源
          fetchAllLoadSpecification(), // 载具规则
          fetchCustomParamType(), // 目标点
        ]);
        const state = { mapData };
        if (!dealResponse(modelLocks)) {
          state.modelLocks = modelLocks;
        }

        if (!dealResponse(loadSpecification)) {
          state.loadSpecification = loadSpecification;
        }
        if (!dealResponse(targetSource)) {
          state.targetSource = targetSource;
        }
        yield put({ type: 'saveState', payload: state });
      } catch (error) {
        message.error(formatMessage({ id: 'app.message.initFailed' }, { reason: error.message }));
      }
    },

    *getCustomTaskList(_, { call, put }) {
      const response = yield call(fetchCustomTaskList);
      if (dealResponse(response)) {
        message.error(
          formatMessage(
            { id: 'app.message.fetchFailTemplate' },
            { type: formatMessage({ id: 'menu.customTask' }) },
          ),
        );
      } else {
        yield put({
          type: 'saveCustomTaskList',
          payload: response.map((item, index) => ({ ...item, index })),
        });
      }
    },
  },
};
