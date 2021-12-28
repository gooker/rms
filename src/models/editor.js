import { message } from 'antd';
import { saveAs } from 'file-saver';
import { sortBy, groupBy, findIndex, find } from 'lodash';
import update from 'immutability-helper';
import { dealResponse, formatMessage, isNull } from '@/utils/utils';
import { addTemporaryId, getCurveMapKey } from '@/utils/mapUtils';
import { LogicArea } from '@/packages/XIHE/entities';
import packageJSON from '@/../package.json';
import {
  moveCell,
  getAngle,
  syncLineState,
  generateCellId,
  validateMapData,
  batchGenerateLine,
  renderChargerList,
  transformCurveData,
  renderElevatorList,
  renderWorkstaionlist,
  calculateCellDistance,
  getCurrentRouteMapData,
  getCurrentLogicAreaData,
  generateCellMapByRowsAndCols,
} from '@/utils/mapUtils';
import {
  saveMap,
  updateMap,
  deleteMapById,
  fetchMapDetail,
  getAllWebHooks,
  fetchSectionMaps,
  getAllWebHookTypes,
  fetchAllStationTypes,
  fetchMapHistoryDetail,
} from '@/services/XIHE';
import { fetchActiveMap } from '@/services/api';

const FieldTextureKeyMap = {
  blockCellIds: 'block_cell',
  storeCellIds: 'store_cell',
  followCellIds: 'follow_cell',
  waitCellIds: 'wait_cell',
  taskCellIds: 'get_task',
};

export default {
  namespace: 'editor',

  state: {
    // 地图数据相关
    mapList: null,
    currentMap: null,
    currentLogicArea: 0, // id
    currentRouteMap: 'DEFAULT', // code
    preRouteMap: null, // 记录上一个路线区数据, 用于切换路线区时候拿到上一次路线区的数据做清理工作
    currentCells: [], // 当前视图的点位数据

    // 选择相关
    selectCells: [],
    selectLines: [],

    // 所有站点类型
    allStationTypes: {},

    // 所有Web Hooks
    allWebHooks: [],

    // 显示相关
    mapMode: 'standard',
    hideBlock: false,
    showCoordinate: false,
    showDistance: false,
    shownPriority: [],
    showRelationsDir: [],
    showRelationsCells: [],

    drawerVisible: false,
    mapHistoryVisible: false,

    // Loading
    saveMapLoading: false,
    activeMapLoading: false,

    // 各种弹窗数据
    visible: {},
  },

  reducers: {
    saveState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveMapLoading(state, action) {
      return {
        ...state,
        saveMapLoading: action.payload,
      };
    },
    saveActiveMapLoading(state, action) {
      return {
        ...state,
        activeMapLoading: action.payload,
      };
    },
    saveMapHistoryVisible(state, action) {
      return {
        ...state,
        mapHistoryVisible: action.payload,
      };
    },
    saveMapList(state, action) {
      return {
        ...state,
        mapList: action.payload,
      };
    },
    saveCurrentMapOnly(state, action) {
      return {
        ...state,
        currentMap: action.payload,
      };
    },
    saveCurrentMap(state, action) {
      return {
        ...state,
        currentMap: action.payload,
        currentLogicArea: 0,
        currentRouteMap: 'DEFAULT',
        preRouteMap: null,
      };
    },
    saveCurrentLogicArea(state, action) {
      return {
        ...state,
        currentLogicArea: action.payload,
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
    saveCurrentCells(state, action) {
      return {
        ...state,
        currentCells: action.payload,
      };
    },
    saveSelectLines(state, action) {
      return {
        ...state,
        selectLines: action.payload,
      };
    },
    saveSelectCells(state, action) {
      return {
        ...state,
        selectCells: action.payload,
      };
    },
    saveVisit(state, action) {
      return {
        ...state,
        visible: action.payload,
      };
    },
    saveAllStationTypes(state, action) {
      return {
        ...state,
        allStationTypes: action.payload,
      };
    },
    saveAllWebHooks(state, action) {
      return {
        ...state,
        allWebHooks: action.payload,
      };
    },
  },

  effects: {
    *editorInitial(_, { put, call }) {
      const mapList = yield call(fetchSectionMaps);
      const failMessage = formatMessage({ id: 'app.editor.fetchMapList.fail' });
      if (!dealResponse(mapList, false, null, failMessage)) {
        // 检查是否有地图数据
        if (mapList.length === 0) {
          message.info(formatMessage({ id: 'app.editor.fetchMapList.zero' }));
          yield put({ type: 'saveMapList', payload: [] });
          return;
        }

        // 检查是否有激活地图
        const activeMap = mapList.filter((map) => map.activeFlag);
        if (activeMap.length === 0) {
          message.warn(formatMessage({ id: 'app.editor.activeMap.zero' }));
        }

        // 获取已激活地图数据并保存相关状态
        const mapId = activeMap.length > 0 ? activeMap[0].id : mapList[0].id;
        const currentMap = yield call(fetchMapDetail, mapId);
        yield put({ type: 'saveMapList', payload: mapList });
        yield put({ type: 'saveCurrentMap', payload: addTemporaryId(currentMap) });

        // 获取所有站点类型
        const allStationTypes = yield call(fetchAllStationTypes);
        yield put({ type: 'saveAllStationTypes', payload: allStationTypes });

        // 获取已配置的 Web Hook
        const [allWebHooks, allWebHookTypes] = yield Promise.all([
          getAllWebHooks(),
          getAllWebHookTypes(),
        ]);
        if (!dealResponse(allWebHooks) && !dealResponse(allWebHookTypes)) {
          const _allWebHooks = allWebHooks.map((hook) => ({
            ...hook,
            label: allWebHookTypes[hook.webHookType],
          }));
          yield put({ type: 'saveAllWebHooks', payload: _allWebHooks });
        }
      }
    },

    *checkoutMap({ payload }, { put, call }) {
      const currentMap = yield call(fetchMapDetail, payload);
      yield put({ type: 'saveCurrentMap', payload: addTemporaryId(currentMap) });
    },

    *updateModalVisit({ payload }, { put, select }) {
      const { visible } = yield select((state) => state.editor);
      const { type, value, extraData } = payload;
      visible[type] = value;
      if (extraData) {
        visible.extraData = extraData;
      } else {
        visible.extraData = null;
      }
      yield put({ type: 'saveVisit', payload: visible });
    },

    // // // // // // // // // // //  地图操作   // // // // // // // // // // //
    // 创建地图
    *fetchCreateMap({ payload }, { put, call, select }) {
      const { name, desc } = payload;
      const { sectionId } = yield select((state) => state.user);
      const { mapList } = yield select((state) => state.editor);

      // 创建默认的逻辑区
      const routeMap = {
        DEFAULT: {
          name: 'DEFAULT',
          code: 'DEFAULT',
          desc: 'DEFAULT',
          relations: [],
          blockCellIds: [],
          followCellIds: [],
          nonStopCellIds: [],
          tunnels: [],
          waitCellIds: [],
        },
      };
      const defaultLogicArea = new LogicArea({ routeMap });
      const logicAreaList = [defaultLogicArea];

      // 添加默认的scopeMap
      const { version } = packageJSON;
      const newMap = {
        name,
        desc,
        sectionId,
        cellMap: {},
        logicAreaList,
        elevatorList: [],
        mver: version,
        ever: version,
        activeFlag: false,
      };
      const response = yield call(saveMap, newMap);
      if (dealResponse(response)) {
        return;
      }
      newMap.id = response.id;
      yield put({ type: 'saveCurrentMap', payload: newMap });

      // 更新地图列表
      const newMapList = [
        ...mapList,
        { id: response.id, name: newMap.name, desc: newMap.desc, activeFlag: false },
      ];
      yield put({ type: 'saveMapList', payload: newMapList });
    },

    // 更新地图
    *fetchUpdateMap({ payload }, { put, call, select }) {
      const { id, name, desc: description } = payload;
      const requestBody = { id, name, description };
      const response = yield call(updateMap, requestBody);
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'app.leftContent.updateMap.failed' }));
      } else {
        const { mapList, currentMap } = yield select((state) => state.editor);
        const currentMapIndex = findIndex(mapList, { id });
        // 更新地图列表中的指定地图数据
        const newMapList = update(mapList, {
          [currentMapIndex]: {
            name: { $set: name },
            desc: { $set: description },
          },
        });
        yield put({ type: 'saveMapList', payload: newMapList });

        // 如果编辑的地图正在展示，此时需要更新
        if (currentMap && currentMap.id === id) {
          const newCurrentMap = update(currentMap, {
            name: { $set: name },
            desc: { $set: description },
          });
          yield put({ type: 'saveCurrentMapOnly', payload: newCurrentMap });
        }

        message.success(formatMessage({ id: 'app.leftContent.updateMap.success' }));
      }
    },

    // 删除地图
    *fetchDeleteMap({ payload }, { call, put, select }) {
      const response = yield call(deleteMapById, payload);
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'app.createMap.deleteMap.failed' }));
      } else {
        message.success(formatMessage({ id: 'app.createMap.deleteMap.success' }));
        const { mapList, currentMap } = yield select((state) => state.editor);
        const newMapList = mapList.filter((record) => record.id !== payload);
        yield put({ type: 'saveMapList', payload: newMapList });

        // 如果删除的地图正在当前展示，就选择地图列表的第一个地图进行展示
        if (currentMap.id === payload) {
          if (newMapList.length === 0) {
            yield put({ type: 'saveCurrentMap', payload: null });
          } else {
            yield put({ type: 'checkoutMap', payload: newMapList[0].id });
          }
        }
      }
    },

    // 导出地图
    *exportMap(_, { select }) {
      const { currentMap } = yield select(({ editor }) => editor);
      const mapData = { ...currentMap };
      mapData.activeFlag = false;
      delete mapData.sectionId;
      delete mapData.id;
      const file = new File([JSON.stringify(mapData, null, 2)], `${mapData.name}.json`, {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(file);
    },

    // 保存地图
    *saveMap({ payload }, { select, call, put }) {
      const { currentMap, mapList } = yield select(({ editor }) => editor);
      const { sectionId } = yield select((state) => state.user);
      const mapData = payload || currentMap;
      yield put({ type: 'saveMapLoading', payload: true });

      // 1. 校验地图数据
      if (validateMapData(mapData)) {
        // 2. 更新地图部分信息
        const { version } = packageJSON;
        mapData.ever = version;
        mapData.sectionId = sectionId;
        mapData.autoGenCellIdStart = 1;

        // 3. 对地图部分数据进行转换处理
        const { cellMap } = mapData;
        const logicAreaList = mapData.logicAreaList;
        for (let index = 0; index < logicAreaList.length; index++) {
          const loopLogicAreaData = logicAreaList[index];

          // 充电桩重新计算坐标
          const chargerList = loopLogicAreaData?.chargerList || [];
          const chargerVMs = renderChargerList(chargerList, cellMap);
          for (let chargerIndex = 0; chargerIndex < chargerList.length; chargerIndex++) {
            chargerList[chargerIndex].x = chargerVMs[chargerIndex].x;
            chargerList[chargerIndex].y = chargerVMs[chargerIndex].y;
          }
          loopLogicAreaData.chargerList = chargerList;

          // 优先级线条
          const { rangeStart, rangeEnd } = loopLogicAreaData;
          const logicRouteMap = loopLogicAreaData.routeMap;
          Object.keys(logicRouteMap).forEach((routeMapKey) => {
            const loopRouteMapData = logicRouteMap[routeMapKey];
            if (Array.isArray(loopRouteMapData.relations)) {
              loopRouteMapData.relations = loopRouteMapData.relations
                .map((relation) => {
                  const { type, source, target } = relation;
                  // 筛掉不合法的线条
                  if (cellMap[source] === undefined || cellMap[target] === undefined) {
                    return null;
                  }
                  // 对线条进行筛选: 根据Range进行判断
                  if (source >= rangeStart && target <= rangeEnd) {
                    // [只]重算直线的距离
                    if (type === 'line') {
                      relation.distance = calculateCellDistance(cellMap[source], cellMap[target]);
                    }
                    relation.angle = getAngle(cellMap[source], cellMap[target]);
                    return { ...relation };
                  }
                  return null;
                })
                .filter(Boolean);
            } else {
              loopRouteMapData.relations = [];
            }
          });
        }

        // 4. 保存
        const response = yield call(saveMap, mapData);
        if (dealResponse(response)) {
          message.error(formatMessage({ id: 'app.leftContent.saveMap.failed' }));
        } else {
          message.success(formatMessage({ id: 'app.leftContent.saveMap.success' }));

          // 此时判断是上传还是新建地图
          if (isNull(payload)) {
            if (isNull(currentMap.id)) {
              // 因为 currentMap 不作为实质状态去管理，所以直接更新字段，不走 reducer
              currentMap.id = response.id;
            }
          } else {
            const newMapList = [...mapList];
            newMapList.push({
              sectionId,
              activeFlag: false,
              description: payload.description,
              id: response.id,
              logicId: null,
              logicName: null,
              name: payload.name,
              scopeCode: null,
              scopeName: null,
            });
            yield put({ type: 'saveMapList', payload: newMapList });
          }
        }
      } else {
        message.error(formatMessage({ id: 'app.model.mapEdit.mapDataError' }));
      }
      yield put({ type: 'saveMapLoading', payload: false });
    },

    // 激活地图
    *activeMap({ payload }, { select, call, put }) {
      const { currentMap } = yield select((state) => state.editor);
      yield put({ type: 'saveActiveMapLoading', payload: true });
      const sectionId = window.localStorage.getItem('sectionId');
      const response = yield call(fetchActiveMap, { id: payload, sectionId });
      if (!dealResponse(response)) {
        currentMap.activeFlag = true;
        yield put({ type: 'saveState', payload: { currentMap, activeMapLoading: false } });
        message.success(formatMessage({ id: 'app.leftContent.activeMap.success' }));
      } else {
        message.error(formatMessage({ id: 'app.leftContent.activeMap.failed' }));
      }
    },

    // 导出某次更新的地图数据
    *exportMapHistory({ payload }, { call }) {
      const historyMapData = yield call(fetchMapHistoryDetail, payload);
      const mapData = { ...historyMapData.matrixMap };
      mapData.activeFlag = false;
      delete mapData.sectionId;
      delete mapData.id;
      const file = new File(
        [JSON.stringify(mapData, null, 2)],
        `${mapData.name}-${historyMapData.editedDate}-${historyMapData.editor}-${historyMapData.historyVersion}.json`,
        {
          type: 'text/plain;charset=utf-8',
        },
      );
      saveAs(file);
    },

    // // // // // // // // // // //  逻辑区操作   // // // // // // // // // // //
    *fetchCreateLogicArea({ payload }, { select, put }) {
      const currentMap = yield select(({ editor }) => editor.currentMap);
      const { logicAreaList } = currentMap;
      const newLogicAreaId = logicAreaList[logicAreaList.length - 1].id + 1;
      const routeMap = {
        DEFAULT: {
          name: 'DEFAULT',
          code: 'DEFAULT',
          desc: null,
          relations: [],
        },
      };
      const newLogicArea = new LogicArea({ routeMap, ...payload, id: newLogicAreaId });
      logicAreaList.push(newLogicArea);
      yield put({ type: 'saveCurrentLogicArea', payload: newLogicAreaId });
    },

    *fetchUpdateLogicDetail({ payload }, { select }) {
      const { currentMap } = yield select(({ editor }) => editor);
      const { logicAreaList } = currentMap;
      const { id, name, rangeStart, rangeEnd } = payload;

      const editingLogicAreaIndex = findIndex(logicAreaList, { id });
      const newLogicAreaList = update(logicAreaList, {
        [editingLogicAreaIndex]: {
          name: { $set: name },
          rangeStart: { $set: rangeStart },
          rangeEnd: { $set: rangeEnd },
        },
      });
      currentMap.logicAreaList = newLogicAreaList;
      message.success(formatMessage({ id: 'app.leftContent.updateLogic.success' }));
    },

    *fetchDeleteLogicArea({ payload }, { select, put }) {
      const { currentMap, currentLogicArea } = yield select(({ editor }) => editor);
      const { cellMap, logicAreaList } = currentMap;

      // 剔除逻辑区数据
      const newLogicAreaList = logicAreaList.filter((record) => record.id !== payload);
      currentMap.logicAreaList = newLogicAreaList;

      // 剔除逻辑区对应的点位数据
      const newCellMap = { ...cellMap };
      const willDrop = find(logicAreaList, { id: payload });
      if (willDrop) {
        const { rangeStart, rangeEnd } = willDrop;
        Object.keys(newCellMap).forEach((cellIdStr) => {
          const { id } = newCellMap[cellIdStr];
          if (id >= rangeStart && id <= rangeEnd) {
            delete newCellMap[cellIdStr];
          }
        });
      }
      currentMap.cellMap = newCellMap;

      // 切换到默认逻辑区
      if (payload === currentLogicArea) {
        yield put({
          type: 'saveState',
          payload: {
            currentLogicArea: 0,
            currentRouteMap: 'DEFAULT',
          },
        });
        return true;
      }
    },

    // // // // // // // // // // //  路线区操作   // // // // // // // // // // //
    *fetchCreateScope({ payload }, { put }) {
      // 创建路线区对象并合并到当前逻辑区的 routeMap
      const currentLogicAreaData = getCurrentLogicAreaData();
      const newRouteMap = { relations: [], ...payload };
      currentLogicAreaData.routeMap[newRouteMap.code] = newRouteMap;
      yield put({ type: 'saveCurrentRouteMap', payload: newRouteMap.code });
    },

    fetchUpdateScope({ payload }) {
      const { scopeCode, scopeName } = payload;
      const currentLogicAreaData = getCurrentLogicAreaData();
      const newRouteMap = { ...currentLogicAreaData.routeMap };
      newRouteMap[scopeCode].name = scopeName;
      currentLogicAreaData.routeMap = newRouteMap;
    },

    *fetchDeleteScope({ payload }, { select, put }) {
      const { currentRouteMap } = yield select(({ editor }) => editor);
      // 更新当前逻辑区的 RouteMap 数据
      const currentRouteMapData = getCurrentRouteMapData();
      const currentLogicAreaData = getCurrentLogicAreaData();
      const newRouteMap = { ...currentLogicAreaData.routeMap };
      delete newRouteMap[payload];
      currentLogicAreaData.routeMap = newRouteMap;

      if (currentRouteMap === payload) {
        yield put({ type: 'saveCurrentRouteMap', payload: 'DEFAULT' });
        yield put({ type: 'savePreRouteMap', payload: currentRouteMapData });
      }
    },

    // ********************************* 点位操作 ********************************* //
    // 新增点位
    *batchAddCells({ payload }, { select, put }) {
      const { currentMap, currentCells } = yield select(({ editor }) => editor);
      const { id: logicId, rangeEnd, rangeStart } = getCurrentLogicAreaData();
      const { cellMap } = currentMap;

      let additionalCells = [];
      const { addWay } = payload;
      // 绝对值
      if (addWay === 'absolute') {
        const { rows, cols, autoGenCellIdStart, x, y, distanceX, distanceY } = payload;
        if (rows != null && cols != null) {
          additionalCells = generateCellMapByRowsAndCols(
            rows,
            cols,
            autoGenCellIdStart,
            { x, y },
            distanceX,
            distanceY,
            rangeStart,
            rangeEnd,
            logicId,
          );
        }
      } else {
        // 偏移
        const { cellIds, dir, count, distance } = payload;
        const selectedCellsData = cellIds.map((cellId) => cellMap[cellId]);
        selectedCellsData.forEach((cellData) => {
          for (let index = 1; index < count + 1; index++) {
            additionalCells.push(moveCell(cellData, distance * index, dir));
          }
        });
        additionalCells = additionalCells
          .reverse()
          .map((cell) => ({ ...cell, id: `L${logicId}${cell.id}` }));
      }

      // 更新 cellMap & currentCells
      const centerMap = currentCells?.length === 0;
      const newCellMap = { ...cellMap };
      const _currentCells = [...currentCells];

      additionalCells.forEach((cell) => {
        newCellMap[cell.id] = { ...cell };
        _currentCells.push({ ...cell });
      });
      currentMap.cellMap = newCellMap;

      yield put({ type: 'saveCurrentCells', payload: _currentCells });
      return { centerMap, additionalCells };
    },

    // 生成地址码
    *generateCellCode({ payload }, { select, put }) {
      // 取值轮询次数，保证不取到重复值且保证取值效率
      const loopStep = { loop: 0 };

      const { cellIds, way, step, startCode } = payload;
      const { currentMap, currentCells } = yield select(({ editor }) => editor);

      const { rangeEnd, rangeStart } = getCurrentLogicAreaData();

      const result = {};
      const currentCellMap = {};
      currentCells.forEach(({ id }) => {
        currentCellMap[id] = id;
      });

      /** start* */
      // 根据x y 对cellIds排序
      const currentCellIds = [...cellIds];
      const sortCellIds = [];
      for (let index = 0; index < currentCellIds.length; index++) {
        const indexCellId = currentCellIds[index];
        const data = currentMap.cellMap[indexCellId];
        if (!isNull(data)) {
          sortCellIds.push(data);
        }
      }

      sortCellIds.sort((a, b) => {
        if (a.y === b.y) {
          return a.x - b.x;
        }
        return a.y - b.y;
      });

      const newSelectedCellIds = sortCellIds.map(({ id }) => id);
      /** end* */

      for (let index = 0; index < newSelectedCellIds.length; index++) {
        const originCellId = newSelectedCellIds[index];
        const newCellId = generateCellId(currentCellMap, startCode, loopStep, step, way);
        if (newCellId > rangeEnd) {
          message.error('app.cellMap.code.exceedLogicAreaLimit');
          return false;
        }

        if (newCellId < rangeStart) {
          message.error(formatMessage({ id: 'app.cellMap.code.lessThanLogicAreaLimit' }));
          return false;
        }
        result[originCellId] = newCellId;
      }

      // 更新 currentCells 和 currentMap 数据
      const _currentCells = currentCells.filter(
        (item) => !newSelectedCellIds.includes(`${item.id}`),
      );
      const newCellMap = { ...currentMap.cellMap };
      newSelectedCellIds.forEach((cellId) => {
        const newCellItem = { ...currentMap.cellMap[cellId], id: result[cellId], costs: null };
        _currentCells.push(newCellItem);

        delete newCellMap[cellId];
        newCellMap[newCellItem.id] = newCellItem;
      });
      currentMap.cellMap = newCellMap;

      yield put({
        type: 'saveState',
        payload: {
          currentCells: _currentCells,
          selectCells: Object.values(result),
        },
      });
      return result;
    },

    // 修改单个点位地址码
    *changeSingleCellCode({ payload }, { select, put }) {
      const { currentMap, currentCells, selectCells } = yield select(({ editor }) => editor);
      const { rangeStart, rangeEnd } = getCurrentLogicAreaData();
      const { type, cellId, x, y } = payload;

      // 校验 cellId 是否已存在或者是否在逻辑区range
      if (currentMap.cellMap[cellId]) {
        message.error(formatMessage({ id: 'app.cellMap.code.exist' }));
        return;
      }
      if (cellId < rangeStart || cellId > rangeEnd) {
        message.error(
          formatMessage(
            { id: 'app.cellMap.code.notInRange' },
            { range: `${rangeStart}~${rangeEnd}` },
          ),
        );
        return;
      }

      let response;
      const newCellMap = { ...currentMap.cellMap };
      let _currentCells = [...currentCells];
      if (type === 'add') {
        newCellMap[cellId] = { id: cellId, x, y, cost: null };
        _currentCells.push({ id: cellId, x, y, cost: null });
        response = { id: cellId, x, y, cost: null };
      }
      if (type === 'update') {
        const originCellId = selectCells[0];

        // 处理地图 cellMap
        newCellMap[cellId] = { ...newCellMap[originCellId], id: cellId };
        delete newCellMap[originCellId];

        // 处理 currentCells
        _currentCells = _currentCells.map((item) => {
          if (`${item.id}` === originCellId) {
            return { ...item, id: cellId };
          }
          return item;
        });

        // TODO: 处理线条
        response = { [originCellId]: cellId };

        yield put({ type: 'saveSelectCells', payload: [cellId] });
      }
      currentMap.cellMap = newCellMap;

      yield put({
        type: 'saveState',
        payload: { currentMap, currentCells: _currentCells },
      });

      return { type, payload: response };
    },

    // 删除点位
    *batchDeleteCells(_, { select, put }) {
      const { selectCells, currentMap, currentCells } = yield select(({ editor }) => editor);
      const result = {
        cell: selectCells,
        line: [],
      };

      // 删除 currentMap 中的点位
      const cellMap = { ...currentMap.cellMap };
      selectCells.forEach((cellId) => {
        delete cellMap[cellId];
      });
      currentMap.cellMap = cellMap;

      // 删除 currentCells 数据
      const _currentCells = currentCells.filter((item) => !selectCells.includes(`${item.id}`));

      // 删除相关线条
      const currentRouteMapData = getCurrentRouteMapData();
      let relations = [...(currentRouteMapData.relations || [])];
      // 1. 删除相关曲线
      relations = relations.filter((item) => {
        if (selectCells.includes(`${item.source}`) || selectCells.includes(`${item.target}`)) {
          result.line.push(item);
          return false;
        }
        return true;
      });
      currentRouteMapData.relations = relations;

      yield put({ type: 'saveCurrentCells', payload: _currentCells });
      return result;
    },

    // 移动点位
    *moveCells({ payload }, { select, put }) {
      const { cellIds, distance, dir } = payload;
      const { currentMap, currentCells } = yield select((state) => state.editor);

      const result = {
        cell: {},
        line: {
          add: [],
          delete: [],
        },
      };

      // 处理点位位置
      const newCellMap = { ...currentMap.cellMap };
      cellIds.map((cellId) => {
        const cell = newCellMap[cellId];
        const { x, y } = moveCell(cell, distance, dir);
        result.cell[cellId] = { ...cell, x, y }; // 点位 ID 和 该ID点位的新数据
        newCellMap[cellId] = { ...cell, x, y };
      });
      currentMap.cellMap = newCellMap;

      // 更新 currentCells 数据
      const _currentCells = currentCells.map((item) => {
        if (cellIds.includes(`${item.id}`)) {
          return { ...result.cell[item.id] };
        }
        return item;
      });

      // 处理线条
      const currentRouteMapData = getCurrentRouteMapData();
      const newRelations = syncLineState(cellIds, newCellMap, result);
      currentRouteMapData.relations = newRelations;

      yield put({ type: 'saveCurrentCells', payload: _currentCells });
      return result;
    },

    // 调整码间距
    *adjustSpace({ payload }, { select, put }) {
      const { currentMap, currentCells } = yield select((state) => state.editor);
      const { isAll, cellIds, dir, distance } = payload;
      const newCellMap = { ...currentMap.cellMap };

      // 先获取操作点位对象数据
      let logicCells = [...currentCells];
      if (!isAll) {
        logicCells = cellIds.map((id) => newCellMap[id]);
      }

      // 根据调整方向确定分组方式(上下方向以Y分组，左右为以X分组)
      let groupKey = 'y';
      if ([1, 3].includes(dir)) {
        groupKey = 'x';
      }
      // **** 每一组点位需要被修改的属性与分组的标识保持一致
      const editProps = groupKey;
      const groups = groupBy(logicCells, groupKey);
      const groupEditProps = Object.keys(groups)
        .map((value) => parseInt(value, 10))
        .sort((a, b) => (a >= b ? 1 : -1));
      // 选择偏移基准点
      let baseXY = groupEditProps[0];
      if ([1, 2].includes(dir)) {
        baseXY = groupEditProps[groupEditProps.length - 1];
      }
      // 返回值供地图更新相关信息
      const result = { cell: {}, line: { add: [], delete: [] } };
      groupEditProps.forEach((key, groupIndex) => {
        const group = groups[key];
        group.forEach((cell) => {
          // 在PIXI坐标系, 向右和向下为递增，向上和向左为递减
          if ([1, 2].includes(dir)) {
            const coord = baseXY - (groupEditProps.length - groupIndex - 1) * distance;
            cell[editProps] = coord;
            result.cell[cell.id] = { type: editProps, coord };
          } else {
            cell[editProps] = baseXY + groupIndex * distance;
            result.cell[cell.id] = { type: editProps, coord: baseXY + groupIndex * distance };
          }
        });
      });
      currentMap.cellMap = newCellMap;

      // 更新 currentCells 数据
      const movedCellIds = Object.keys(newCellMap);
      const _currentCells = currentCells.filter((item) => !movedCellIds.includes(`${item.id}`));
      movedCellIds.forEach((cellId) => {
        const { type, coord } = newCellMap[cellId];
        _currentCells.push({ ...newCellMap[cellId], [type]: coord });
      });

      // 对操作点位的线条进行调整，直线线条修改distance和angle数值，曲线线条直接删除
      const currentRouteMapData = getCurrentRouteMapData();
      const newRelations = syncLineState(cellIds, newCellMap, result);
      currentRouteMapData.relations = newRelations;

      yield put({ type: 'saveCurrentCells', payload: _currentCells });
      return result;
    },

    // 设置点位类型
    *setCellType({ payload }, { select }) {
      const { selectCells } = yield select(({ editor }) => editor);
      const { type, scope, operation } = payload;

      const currentLogicAreaData = getCurrentLogicAreaData();
      const currentRouteMapData = getCurrentRouteMapData();
      const scopeData = scope === 'routeMap' ? currentRouteMapData : currentLogicAreaData;

      let originalData = scopeData[type] ?? [];
      let activeCellIds = []; // 最终执行增加或剔除操作的点位
      if (operation === 'add') {
        // 如果当前正在设置不可走点
        const storeCellIds = currentLogicAreaData.storeCellIds || [];
        const blockCellIds = currentRouteMapData.blockCellIds || [];
        if (type === 'blockCellIds') {
          // 不可走点不可以配置到存储点上
          selectCells.forEach((cellId) => {
            if (storeCellIds.includes(parseInt(cellId, 10))) {
              message.error(formatMessage({ id: 'app.models.storagePoint' }, { value: cellId }));
            } else {
              activeCellIds.push(parseInt(cellId, 10));
            }
          });
        } else {
          // 任何点位类型不可以配置到不可走点上
          selectCells.forEach((cellId) => {
            if (blockCellIds.includes(parseInt(cellId, 10))) {
              message.error(formatMessage({ id: 'app.models.pointType' }, { value: cellId }));
            } else {
              activeCellIds.push(parseInt(cellId, 10));
            }
          });
        }
        scopeData[type] = [...originalData, ...activeCellIds];
      }
      if (operation === 'remove') {
        originalData = originalData.filter((item) => !selectCells.includes(`${item}`));
        activeCellIds = [...selectCells];
        scopeData[type] = originalData;
      }

      return {
        cellIds: activeCellIds,
        cellType: FieldTextureKeyMap[type],
        texture: operation === 'add' ? FieldTextureKeyMap[type] : null,
      };
    },

    // // // // // // // // // // //  线条操作   // // // // // // // // // // //
    *generateCostLines({ payload }, { select, put }) {
      const { selectCells, currentMap } = yield select(({ editor }) => editor);

      // 获取已存在的 relations 数据并且生成直线数据的 Map 用于方便整合新旧直线数据
      const currentRouteMapData = getCurrentRouteMapData();
      const relations = currentRouteMapData.relations || [];
      const lineRelationsMap = {}; // 直线Map
      const curves = [];
      relations.forEach((relation) => {
        if (relation.type === 'line') {
          lineRelationsMap[`${relation.source}-${relation.target}`] = relation;
        } else {
          // 曲线不和直线放在一起处理
          curves.push(relation);
        }
      });

      // 生成新线条
      const { dir, value } = payload;
      const selectedCells = selectCells.map((cellId) => currentMap.cellMap[cellId]);
      const newLines = batchGenerateLine(selectedCells, dir, value);
      const result = { add: [], remove: [] };

      // 整合 Store 数据
      Object.keys(newLines).forEach((relationKey) => {
        const newLine = newLines[relationKey];
        const { source, target, cost } = newLine;

        // 如果 cost 为 -1, 表示删除
        if (cost === -1) {
          delete lineRelationsMap[relationKey];
          result.remove.push(newLine);
        } else {
          lineRelationsMap[relationKey] = newLine;
          result.add.push(newLine);
        }

        // 处理对头线
        const oppositeKey = `${target}-${source}`;
        const oppositeLineEntity = lineRelationsMap[oppositeKey];
        if (oppositeLineEntity) {
          result.remove.push(oppositeLineEntity);
          result.add.push(oppositeLineEntity);
        }
      });
      const newRelations = [...Object.values(lineRelationsMap), ...curves];
      currentRouteMapData.relations = newRelations;
      yield put({ type: 'saveCurrentMapOnly', payload: currentMap });
      return result;
    },

    *generateCostCurve({ payload }, { select, put }) {
      const { selectCells, currentMap } = yield select(({ editor }) => editor);
      const cellMap = currentMap.cellMap;

      // 获取已存在的 relations 数据并且生成直线数据的 Map 用于方便整合新旧直线数据
      const currentRouteMapData = getCurrentRouteMapData();
      const relations = currentRouteMapData.relations || [];
      const curveRelationsMap = {}; // 直线Map
      const lines = [];
      relations.forEach((relation) => {
        if (relation.type === 'curve') {
          curveRelationsMap[getCurveMapKey(relation)] = relation;
        } else {
          // 直线不和曲线放在一起处理
          lines.push(relation);
        }
      });

      const { dir: direction, value: cost } = payload;

      // 已选点位
      const cells = selectCells.map((cellId) => {
        const { id, x, y } = cellMap[cellId];
        return { id, x, y };
      });

      // 三个点位必须包括: 存储点, 入弯点和出弯点(约定: 离存储点最近的点是出弯点)
      if (cells.length !== 3) return formatMessage({ id: 'app.models.specification' });
      // 存储点和出弯点必定在一条直线上，要么是X轴要么是Y轴。所以最多要group两次
      let coordBase = 'y';
      let group = groupBy(cells, 'x');
      if (Object.keys(group).length !== 2) {
        coordBase = 'x';
        group = groupBy(cells, 'y');
        if (Object.keys(group).length !== 2)
          return formatMessage({ id: 'app.models.specification' });
      }

      // NOTE: 找到贝塞尔线定位点. 这里只需要算出 secondary 的坐标, primary&third在地图上是实际存在的
      const bezierPoints = {
        primary: 0,
        secondary: { x: 0, y: 0 },
        third: 0,
      };
      const sortedCells = sortBy(cells, [coordBase]);
      const exitPoint = sortedCells[1];
      Object.values(group).forEach((item) => {
        // 处理入弯点
        if (item.length === 1) {
          const entryPoint = item[0];
          if (direction === 'IN') {
            bezierPoints.primary = entryPoint.id;
            bezierPoints.third = exitPoint.id;
          } else {
            bezierPoints.primary = exitPoint.id;
            bezierPoints.third = entryPoint.id;
          }
          if (coordBase === 'y') {
            bezierPoints.secondary.y = entryPoint.y;
          } else {
            bezierPoints.secondary.x = entryPoint.x;
          }
        }

        // 处理出弯点和存储点
        if (item.length === 2) {
          if (coordBase === 'y') {
            bezierPoints.secondary.x = exitPoint.x;
          } else {
            bezierPoints.secondary.y = exitPoint.y;
          }
        }
      });

      // 获取角度，只需要算 primary --> third 的角度
      const primaryCell = cellMap[bezierPoints.primary];
      const thirdCell = cellMap[bezierPoints.third];
      const angle = getAngle(
        { x: primaryCell.x, y: primaryCell.y },
        { x: thirdCell.x, y: thirdCell.y },
      );

      // 为了配合后台数据接口，这里做一下数据转换
      const bezier = transformCurveData({ ...bezierPoints, cost, angle, type: 'curve' });
      const curveRelationsMapKey = getCurveMapKey(bezier);

      // 新增或者删除
      if (cost === -1) {
        delete curveRelationsMap[curveRelationsMapKey];
      } else {
        curveRelationsMap[curveRelationsMapKey] = bezier;
      }

      const newRelations = [...Object.values(curveRelationsMap), ...lines];
      currentRouteMapData.relations = newRelations;
      yield put({ type: 'saveCurrentMapOnly', payload: currentMap });

      return bezier;
    },

    *deleteLines(_, { select, put }) {
      const { selectLines, currentMap } = yield select(({ editor }) => editor);

      const currentRouteMapData = getCurrentRouteMapData();
      let relations = [...(currentRouteMapData.relations ?? [])];

      const result = [];
      relations = relations.filter((relation) => {
        const isIncludes = selectLines.includes(`${relation.source}-${relation.target}`);
        if (isIncludes) {
          result.push({ ...relation });
        }
        return !isIncludes;
      });
      currentRouteMapData.relations = relations;

      yield put({ type: 'saveState', payload: { currentMap, selectLines: [] } });
      return result;
    },

    // // // // // // // // // // //  功能操作   // // // // // // // // // // //
    *updateFunction({ payload }, { select }) {
      const { currentMap } = yield select(({ editor }) => editor);
      const { scope, type, data } = payload;

      let scopeData = currentMap;
      const currentLogicAreaData = getCurrentLogicAreaData();
      switch (scope) {
        case 'logic':
          scopeData = currentLogicAreaData;
          break;
        case 'route':
          scopeData = getCurrentRouteMapData();
          break;
        default:
          break;
      }
      const functionData = scopeData[type] || [];
      const isAdding = functionData.length < data.flag;

      // 当前传入的"功能"数据
      const currentFunction = { ...data };
      const index = data.flag - 1;
      delete currentFunction.flag;

      let returnPayload = currentFunction;
      if (type === 'workstationList') {
        returnPayload = renderWorkstaionlist([currentFunction], currentMap.cellMap)[0];
      }
      if (type === 'chargerList') {
        returnPayload = renderChargerList([currentFunction], currentMap.cellMap)[0];
      }
      if (type === 'elevatorList') {
        returnPayload = renderElevatorList([currentFunction], currentMap.cellMap)[
          currentLogicAreaData.id
        ];
      }

      // 新增
      if (isAdding) {
        functionData.push({ ...currentFunction });
        scopeData[type] = functionData;
        return { type: 'add', payload: returnPayload };
      }

      // 更新
      const oldFunctionData = functionData.splice(index, 1, currentFunction);
      scopeData[type] = functionData;

      // 对电梯进行特殊处理
      if (type === 'elevatorList') {
        const preLoad = renderElevatorList(oldFunctionData, currentMap.cellMap)[
          currentLogicAreaData.id
        ];
        return {
          type: 'update',
          pre: preLoad,
          current: returnPayload,
        };
      }
      return {
        type: 'update',
        pre: oldFunctionData[0],
        current: returnPayload,
      };
    },

    *removeFunction({ payload }, { select }) {
      const { currentMap } = yield select(({ editor }) => editor);
      const { scope, type, flag } = payload;
      const currentLogicAreaData = getCurrentLogicAreaData();
      let scopeData = currentMap;
      switch (scope) {
        case 'logic':
          scopeData = currentLogicAreaData;
          break;
        case 'route':
          scopeData = getCurrentRouteMapData();
          break;
        default:
          break;
      }
      const functionData = scopeData[type];
      const removedFunctionItem = functionData[flag - 1];
      scopeData[type] = scopeData[type].filter((item, index) => index !== flag - 1);
      let returnPayload = removedFunctionItem;
      if (type === 'workstationList') {
        returnPayload = renderWorkstaionlist([removedFunctionItem], currentMap.cellMap)[0];
      }
      if (type === 'chargerList') {
        returnPayload = renderChargerList([removedFunctionItem], currentMap.cellMap)[0];
      }
      if (type === 'elevatorList') {
        returnPayload = renderElevatorList([removedFunctionItem], currentMap.cellMap)[
          currentLogicAreaData.id
        ];
      }
      return returnPayload;
    },

    // 休息区只需要简单的全部替换就行
    updateRestArea({ payload }) {
      const currentLogicAreaData = getCurrentLogicAreaData();
      const restCellsData = currentLogicAreaData.restCells || [];
      currentLogicAreaData.restCells = payload;
      return { pre: restCellsData, current: payload };
    },

    // 不可逗留点只需要简单的全部替换就行
    updateNonStopCells({ payload }) {
      const currentRouteMapData = getCurrentRouteMapData();
      const nonStopCellIds = currentRouteMapData.nonStopCellIds || [];
      currentRouteMapData.nonStopCellIds = payload;
      return { pre: nonStopCellIds, current: payload };
    },

    fetchDeleteNonStopCell({ payload }) {
      const currentRouteMapData = getCurrentRouteMapData();
      const nonStopCellIds = currentRouteMapData.nonStopCellIds || [];
      const newNonStopCellIds = nonStopCellIds.filter(
        (item) => !payload.includes(item.nonStopCell),
      );
      currentRouteMapData.nonStopCellIds = newNonStopCellIds;
      return { pre: nonStopCellIds, current: newNonStopCellIds };
    },

    *saveElevatorReplaceId({ payload }, { select, put }) {
      const { currentMap } = yield select(({ editor }) => editor);
      const elevatorList = [...(currentMap.elevatorList || [])];
      const { flag, value } = payload;
      if (flag > elevatorList.length) {
        elevatorList.push({
          innerCellId: value,
          logicLocations: {},
        });
      } else {
        elevatorList[flag - 1].innerCellId = value;
      }
      currentMap.elevatorList = elevatorList;
      yield put({ type: 'saveCurrentMapOnly', payload: currentMap });
    },
  },
};