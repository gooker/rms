import { message } from 'antd';
import {
  dealResponse,
  convertMapToArrayMap,
  convertScopeDataToUiOptions,
  formatMessage,
  isNull,
} from '@/utils/util';
import { fetchGetActiveMap, fetchGetAllScopeActions } from '@/services/map';
import {
  getBackZone,
  getTaskTypes,
  getTurnProtocol,
  getLatentActions,
  getCustomTaskList,
  getFormModelTypes,
  getAgvRunProtocol,
  getCustomTaskNodes,
  getFormModelLockResource,
} from '@/services/api';

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

    customTypes: [], // 任务节点数据
    modelTypes: {}, // 业务模型数据
    modelLocks: {}, // 业务模型可锁资源
    turnProtocol: [], // 转弯协议
    agvRunProtocol: [], // 空跑协议
    scopeData: [], // section 地图编程数据
    backZones: [], // 结束--返回指定区域

    // TODO: 提升到 global
    allTaskTypes: {}, // 所有车型任务类型
    allActions: [], // 地图编程 --动作列表信息
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
    *initPage(_, { call }) {
      const mapData = yield call(fetchGetActiveMap);
      if (isNull(mapData) || dealResponse(mapData)) {
        message.error(formatMessage({ id: 'app.message.noActiveMap' }));
      } else {
        const { id } = mapData;
        Promise.all([
          getCustomTaskNodes(),
          getFormModelTypes({ mapId: id }),
          getLatentActions(),
          getTurnProtocol(),
          getAgvRunProtocol(),
          getTaskTypes(),
          fetchGetAllScopeActions(),
          getBackZone({ mapId: id }),
          getFormModelLockResource({ modelType: '' }),
        ])
          .then(
            ([
              customTypes,
              modelTypes,
              allActions,
              turnProtocol,
              agvRunProtocol,
              allTaskTypes,
              scopeData,
              backZones,
              modelLocks,
            ]) => {
              if (
                !dealResponse(customTypes) &&
                !dealResponse(modelTypes) &&
                !dealResponse(allActions) &&
                !dealResponse(turnProtocol) &&
                !dealResponse(agvRunProtocol) &&
                !dealResponse(allTaskTypes) &&
                !dealResponse(scopeData) &&
                !dealResponse(backZones) &&
                !dealResponse(modelLocks)
              ) {
                window.$$dispatch({
                  type: 'customTask/saveState',
                  payload: {
                    mapData,
                    backZones,
                    modelTypes,
                    modelLocks,
                    allActions,
                    allTaskTypes,
                    scopeData: convertScopeDataToUiOptions(scopeData),
                    customTypes: convertMapToArrayMap(customTypes, 'type', 'label'),
                    turnProtocol: convertMapToArrayMap(turnProtocol, 'action', 'label'),
                    agvRunProtocol: convertMapToArrayMap(agvRunProtocol, 'action', 'label'),
                  },
                });
              } else {
                throw new Error();
              }
            },
          )
          .catch(() => {
            message.error(formatMessage({ id: 'app.customTask.fetch.global.fail' }));
          });
      }
    },

    *getCustomTaskList(_, { call, put }) {
      const response = yield call(getCustomTaskList);
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'app.customTask.fetch.list.fail' }));
      } else {
        yield put({ type: 'saveCustomTaskList', payload: response });
      }
    },
  },
};
