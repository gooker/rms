import { dealResponse, formatMessage, isNull } from '@/utils/util';
import {
  deleteCustomGroup,
  fetchActiveMap,
  getCustomGroup,
  getCustomGroupJson,
  saveCustomGroup,
  saveOneCustomGroup,
} from '@/services/commonService';
import { message } from 'antd';
import { isPlainObject, some } from 'lodash';
import { MapSelectableSpriteType } from '@/config/consts';

export default {
  namespace: 'mapViewGroup',

  state: {
    currentMap: null,
    currentLogicArea: 0, // id
    currentRouteMap: 'DEFAULT', // code
    preRouteMap: null, // 记录上一个路线区数据, 用于切换路线区时候拿到上一次路线区的数据做清理工作

    // 选择相关
    currentCells: [], // 当前视图的点位数据
    selectedCells: [],
    shownPriorities: [],

    storageConfigData: [], // [{},{}]
    editingGroup: null,
    editingGroupVisible: false,
    groupJson: [],

    selections: [], // 选择相关
    // 右侧操作栏
    categoryPanel: null, // 右侧展示哪个类型的菜单
    mapContext: null, // 地图实体对象
    // 监控地图是否渲染完成
    mapRendered: false,
  },

  effects: {
    // ***************** 获取地图数据 ***************** //
    *initMap(_, { call, put }) {
      const activeMap = yield call(fetchActiveMap);
      if (isNull(activeMap)) {
        message.warn(formatMessage({ id: 'app.message.noActiveMap' }));
        yield put({ type: 'saveCurrentMap', payload: null });
      }
      if (dealResponse(activeMap)) {
        message.error(formatMessage({ id: 'app.message.fetchMapFail' }));
      }
      if (activeMap) {
        const { elevatorList } = activeMap;
        if (!isNull(elevatorList)) {
          let elevatorCellMap = {};
          elevatorList.forEach(({ logicLocations }) => {
            Object.values(logicLocations).forEach(({ innerMapping }) => {
              const currentLogicReplaceCellId = Object.keys(innerMapping)[0];
              elevatorCellMap = { [currentLogicReplaceCellId]: [], ...elevatorCellMap };
              elevatorCellMap[currentLogicReplaceCellId].push(
                innerMapping[currentLogicReplaceCellId],
              );
            });
          });
          yield put({ type: 'saveElevatorCellMap', payload: elevatorCellMap });
        }
        yield put({ type: 'saveCurrentMap', payload: activeMap });
      }
    },

    *fetchStorageConfigurations(_, { call, select, put }) {
      const { currentMap } = yield select((state) => state.mapViewGroup);
      // 此接口是根据mapId 获取小车分组信息
      const response = yield call(getCustomGroup, { mapId: currentMap.id });
      if (!dealResponse(response)) {
        yield put({ type: 'updateStorageConfigData', payload: response });
      } else {
        message.error(formatMessage({ id: 'groupManage.fetchFailed' }));
      }
    },

    *fetchGetCustomGroupJson(_, { call, put }) {
      // 此接口是获取小车分组信息json
      const response = yield call(getCustomGroupJson);
      if (!dealResponse(response)) {
        yield put({ type: 'getCustomGroupJson', payload: response });
      }
    },

    *fetchAddStorageConfigurations({ payload }, { put, select, call }) {
      // 新增分组的保存操作  --大保存 所以这里存在redux
      const { currentMap, storageConfigData } = yield select((state) => state.mapViewGroup);
      const { id } = payload; // 存在id代表是编辑过来的数据
      const newParams = { ...payload };
      newParams.mapId = currentMap.id;
      // 新增保存都走这里
      const response = yield call(saveOneCustomGroup, { ...newParams });

      if (!dealResponse(response)) {
        // 存redux
        const sectionStoreGroup = storageConfigData || []; // 拿到所有group
        const currentGroupTypeData = [...sectionStoreGroup];
        let newGroupData = [];
        // 1.是编辑 正好过滤掉之前id的记录 最后再push新的进去
        if (id) {
          newGroupData = currentGroupTypeData.filter((item) => item.id !== id);
        } else {
          newGroupData = currentGroupTypeData;
        }
        newGroupData.push(response);
        yield put({ type: 'updateStorageConfigData', payload: newGroupData });
      } else {
        message.error(formatMessage({ id: 'app.message.operateFailed' }));
      }
    },

    *fetchAddAllStorageConfigurations({ payload }, { put, select }) {
      // 新增分组的保存操作  --大保存 所以这里存在redux
      const { storageConfigData } = yield select((state) => state.mapViewGroup);
      const { key } = payload;
      const sectionStoreGroup = storageConfigData || []; // 拿到所有group

      const currentGroupTypeData = [...sectionStoreGroup];
      // 新增保存都走这里
      // 数据组里面找到grouptype 1.过滤掉不等于key的数据 2.因为如果是新增 过滤后的还是原来的数据 是编辑 正好过滤掉之前的记录 最后再push新的进去
      const newGroupDaya = currentGroupTypeData.filter((item) => item.key !== key);
      newGroupDaya.push(payload);

      yield put({ type: 'updateStorageConfigData', payload: newGroupDaya });
      // 新老数据合并
    },

    *fetchDeleteStorageGroup({ payload }, { put, select, call }) {
      // 删除一个分组里面的一条item
      const { storageConfigData } = yield select((state) => state.mapViewGroup);

      const { mapId, id } = payload;
      const deleteList = [{ mapId, id }];
      const response = yield call(deleteCustomGroup, [...deleteList]);
      if (!dealResponse(response)) {
        const newSectionStoreGroup = [...storageConfigData];
        const currentSectionStoreGroup = newSectionStoreGroup.filter(
          (item) => item.id !== payload.id,
        );

        yield put({ type: 'updateStorageConfigData', payload: currentSectionStoreGroup });
      } else {
        message.error(formatMessage({ id: 'app.message.operateFailed' }));
      }
    },

    *fetchDeleteAllStorageGroup({ payload }, { put, select, call }) {
      // 删除分组里面的全部item
      const { storageConfigData } = yield select((state) => state.mapViewGroup);
      const newStorageConfigData = [...storageConfigData];

      // 要删除的 传给后端
      const currentList = newStorageConfigData
        .filter((item) => item.groupType === payload.groupType)
        .map(({ mapId, id }) => ({ mapId, id }));
      const response = yield call(deleteCustomGroup, [...currentList]);
      if (!dealResponse(response)) {
        // redux直接根据grouptype过滤就好
        const currentSectionStoreGroup = newStorageConfigData.filter(
          (item) => item.groupType !== payload.groupType,
        );
        yield put({ type: 'updateStorageConfigData', payload: currentSectionStoreGroup });
      } else {
        message.error(formatMessage({ id: 'app.message.operateFailed' }));
      }
    },

    *saveStorageConfiguration(_, { call, select }) {
      // 保存分组信息 走大保存 todo 接口API
      const { storageConfigData } = yield select((state) => state.mapViewGroup);
      yield call(saveCustomGroup, { storageConfigData });
      return true;
    },
  },

  reducers: {
    saveState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveCategoryPanel(state, action) {
      return {
        ...state,
        categoryPanel: action.payload,
      };
    },
    saveMapContext(state, action) {
      return {
        ...state,
        mapContext: action.payload,
      };
    },
    saveMapRendered(state, action) {
      return {
        ...state,
        mapRendered: action.payload,
      };
    },
    saveCurrentCells(state, { payload }) {
      return {
        ...state,
        currentCells: payload,
      };
    },
    updateSelections(state, { payload }) {
      let selections = [];
      let incremental = false;
      if (isPlainObject(payload)) {
        selections = payload.selections;
        incremental = payload.incremental;
      } else {
        selections = payload;
      }

      let _selections = selections;
      // 存在增量选择，需要删除重复的对象
      if (incremental) {
        _selections = [...state.selections];
        selections.forEach((selection) => {
          if (!some(state.selections, selection)) {
            _selections.push(selection);
          }
        });
      }

      const _selectedCells = [];
      _selections.forEach((selection) => {
        if (selection.type === MapSelectableSpriteType.CELL) {
          _selectedCells.push(selection.id);
        }
      });
      _selections.forEach((item) => item.type === MapSelectableSpriteType.CELL);

      const newState = {
        ...state,
        selections: _selections,
        selectedCells: _selectedCells,
        shortcutToolVisible: _selections.length > 0,
      };
      return newState;
    },

    saveElevatorCellMap(state, action) {
      return {
        ...state,
        elevatorCellMap: action.payload,
      };
    },

    saveCurrentMap(state, { payload }) {
      return {
        ...state,
        currentMap: payload,
      };
    },

    saveCurrentLogicArea(state, { payload }) {
      return {
        ...state,
        currentLogicArea: payload,
        currentRouteMap: 'DEFAULT',
        preRouteMap: null,
      };
    },

    saveCurrentRouteMap(state, action) {
      const currentLogicAreaData = state.currentMap.logicAreaList[state.currentLogicArea];
      const currentRouteMapData = currentLogicAreaData.routeMap[state.currentRouteMap];
      return {
        ...state,
        currentRouteMap: action.payload,
        preRouteMap: currentRouteMapData,
      };
    },

    savePreRouteMap(state, action) {
      return {
        ...state,
        preRouteMap: action.payload,
      };
    },

    saveShownPriorities(state, action) {
      return {
        ...state,
        shownPriorities: action.payload,
      };
    },

    updateSelectedCells(state, { payload }) {
      return {
        ...state,
        selectedCells: payload,
      };
    },

    updateStorageConfigData(state, { payload }) {
      // 更新保存的分组信息
      return {
        ...state,
        storageConfigData: payload,
      };
    },

    updateEditingGroup(state, { payload }) {
      return {
        ...state,
        editingGroup: payload,
      };
    },

    updateEditingGroupVisible(state, { payload }) {
      return {
        ...state,
        editingGroupVisible: payload,
      };
    },

    getCustomGroupJson(state, { payload }) {
      // 获取分组信息json
      return {
        ...state,
        groupJson: payload,
      };
    },
  },
};
