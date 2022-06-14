import { message } from 'antd';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import {
  fetchActiveMap,
  fetchCustomParamType,
  getCustomTaskList,
  getFormModelLockResource,
} from '@/services/commonService';
import { fetchAllLoadSpecification } from '@/services/resourceService';

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

    storageSpecification: [], // 车辆容器规格
    loadSpecification: [], // 载具规格
    modelLocks: null, // 业务可锁资源
    modelParams: null, // 配置参数数据
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
        const [modelLocks, modelParams, loadSpecification] = yield Promise.all([
          getFormModelLockResource(),
          fetchCustomParamType(),
          fetchAllLoadSpecification(),
        ]);
        const state = { mapData };
        if (!dealResponse(modelLocks)) {
          state.modelLocks = modelLocks;
        }
        if (!dealResponse(modelParams)) {
          state.modelParams = modelParams;
        }
        if (!dealResponse(loadSpecification)) {
          state.loadSpecification = loadSpecification;
        }
        yield put({ type: 'saveState', payload: state });
      } catch (error) {
        message.error(formatMessage({ id: 'app.message.initFailed' }, { reason: error.message }));
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
        yield put({
          type: 'saveCustomTaskList',
          payload: response.map((item, index) => ({ ...item, index })),
        });
      }
    },
  },
};
