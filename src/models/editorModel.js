import { message } from 'antd';
import { saveAs } from 'file-saver';
import { find, findIndex, groupBy, isEqual, isPlainObject, pickBy, some } from 'lodash';
import update from 'immutability-helper';
import { dealResponse, fillFormValueToAction, formatMessage, getRandomString, isNull } from '@/utils/util';
import {
  addTemporaryId,
  batchGenerateLine,
  convertChargerToDTO,
  generateCellIds,
  generateCellMapByRowsAndCols,
  generateChargerXY,
  getAngle,
  getCellMapId,
  getCurrentLogicAreaData,
  getCurrentRouteMapData,
  getDistance,
  moveCell,
  renderElevatorList,
  renderWorkStationList,
  syncLineState,
  validateMapData,
} from '@/utils/mapUtil';
import { Elevator, LogicArea, MapEntity } from '@/entities';
import packageJSON from '@/../package.json';
import {
  deleteMapById,
  fetchMapDetail,
  fetchMapHistoryDetail,
  fetchSectionMaps,
  saveMap,
  updateMap,
} from '@/services/XIHE';
import { activeMap } from '@/services/api';
import { LeftCategory, RightCategory } from '@/packages/Scene/MapEditor/editorEnums';
import { MapSelectableSpriteType } from '@/config/consts';
import CellEntity from '@/entities/CellEntity';
import { coordinateTransformer, reverseCoordinateTransformer } from '@/utils/coordinateTransformer';
import { LineType, NavigationType, NavigationTypeView, ProgramingItemType } from '@/config/config';

const { CELL, ROUTE } = MapSelectableSpriteType;

// 后台字段与Texture Key的对应关系
const FieldTextureKeyMap = {
  blockCellIds: 'block_cell',
  storeCellIds: 'store_cell',
  followCellIds: 'follow_cell',
  waitCellIds: 'wait_cell',
  taskCellIds: 'get_task',
  safeAreaCellIds: 'safe_cell',
  rotateCellIds: 'rotate_cell',
};

const EditorState = {
  // 地图数据相关
  mapList: null,
  currentMap: null,
  currentLogicArea: 0, // id
  currentRouteMap: 'DEFAULT', // code
  preRouteMap: null, // 记录上一个路线区数据, 用于切换路线区时候拿到上一次路线区的数据做清理工作
  mapContext: null, // 地图实体对象
  mapMinRatio: null, // 地图最小缩放比例
  mapRatio: null, // 地图当前缩放比例

  selections: [], // 选择相关
  allStationTypes: {}, // 所有站点类型
  allWebHooks: [], // 所有Web Hooks

  // 侧边栏控制
  leftActiveCategory: LeftCategory.Drag, // 左侧菜单选中项
  categoryPanel: null, // 右侧菜单选中项
  categoryProps: null, // 属性栏正在展示的元素
  lockedProps: null, // 属性栏，部分元素展示时需要锁定
};

export default {
  namespace: 'editor',

  state: { ...EditorState },

  effects: {
    *editorInitial(_, { put, call }) {
      // yield put({ type: 'saveCurrentMap', payload: MockMapWithProgram });
      // yield put({ type: 'saveMapList', payload: [] });

      const mapList = yield call(fetchSectionMaps);
      if (!dealResponse(mapList, null, formatMessage({ id: 'app.message.fetchMapFail' }))) {
        // 检查是否有地图数据
        if (mapList.length === 0) {
          message.info(formatMessage({ id: 'app.message.noMap' }));
          yield put({ type: 'saveMapList', payload: [] });
          return;
        }
        yield put({ type: 'saveMapList', payload: mapList });

        // 检查是否有激活地图
        const activeMap = mapList.filter((map) => map.activeFlag);
        if (activeMap.length === 0) {
          message.warn(formatMessage({ id: 'app.message.noActiveMap' }));
        } else {
          // 获取已激活地图数据并保存相关状态
          const mapId = activeMap[0].id;
          const currentMap = yield call(fetchMapDetail, mapId);
          if (!dealResponse(currentMap, null, formatMessage({ id: 'app.message.fetchMapFail' }))) {
            yield put({ type: 'saveCurrentMap', payload: currentMap });
          }
        }
      }
    },

    *checkoutMap({ payload }, { put, call }) {
      const currentMap = yield call(fetchMapDetail, payload);
      yield put({ type: 'saveCurrentMap', payload: currentMap });
    },

    *reloadMap(_, { select, call, put }) {
      const { currentMap } = yield select(({ editor }) => editor);
      if (isNull(currentMap)) {
        message.warn(formatMessage({ id: 'editor.selectMap.required' }));
      } else {
        const _currentMap = yield call(fetchMapDetail, currentMap.id);
        yield put({ type: 'saveCurrentMapOnly', payload: addTemporaryId(_currentMap) });
      }
    },

    // ********************************* 地图操作 ********************************* //
    // 创建地图
    *fetchCreateMap({ payload }, { put, call, select }) {
      const { name, description } = payload;
      const { mapList } = yield select((state) => state.editor);
      const sectionId = window.localStorage.getItem('sectionId');

      // 创建默认的逻辑区
      const logicAreaList = [new LogicArea()];

      // 添加默认的scopeMap
      const { version } = packageJSON;
      const newMap = new MapEntity({
        name,
        description,
        sectionId,
        logicAreaList,
        version,
      });
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

    // 更新地图信息
    *fetchUpdateMap({ payload }, { put, call, select }) {
      const { id, name, desc: description } = payload;
      const requestBody = { id, name, description };
      const response = yield call(updateMap, requestBody);
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'app.message.operateFailed' }));
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
        message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      }
    },

    // 删除地图
    *fetchDeleteMap({ payload }, { call, put, select }) {
      const response = yield call(deleteMapById, payload);
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'app.message.operateFailed' }));
      } else {
        message.success(formatMessage({ id: 'app.message.operateSuccess' }));
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

    // 导入牧星地图
    * importMushinyMap({ payload }, { call, put, select }) {
      const { mapList } = yield select(({ editor }) => editor);
      const response = yield call(saveMap, payload);
      const newMapList = [...mapList];
      newMapList.push({
        sectionId: window.localStorage.getItem('sectionId'),
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
      yield put({ type: 'saveCurrentMapOnly', payload: { ...payload, id: response.id } });
      return true;
    },

    // 导入导航点
    * importMap({ payload }, { put, call, select }) {
      const { mapList, currentMap, currentLogicArea } = yield select(({ editor }) => editor);
      const {
        addMap,
        mapName,
        transform,
        mapData: { cells, relations },
      } = payload;
      if (cells.length === 0 || relations.length === 0) {
        message.error('提取的数据为空');
        return;
      }

      // 判断是否新增为一个新地图
      if (addMap) {
        const { version } = packageJSON;
        const newMap = new MapEntity({
          name: mapName,
          sectionId: currentLogicArea,
          logicAreaList: [new LogicArea()],
          version,
        });

        // 合并地图数据
        const navigationType = cells[0].navigationType;
        newMap.transform = { [navigationType]: transform };
        // 合并点位和线条
        cells.forEach((cell) => {
          newMap.cellMap[cell.id] = { ...cell };
        });
        newMap.logicAreaList[0].routeMap.DEFAULT.relations = relations;

        // 保存并缓存新的地图ID
        const response = yield call(saveMap, newMap);
        if (dealResponse(response)) {
          return;
        }
        message.success(formatMessage({ id: 'app.message.operateSuccess' }));
        newMap.id = response.id;
        yield put({ type: 'saveCurrentMap', payload: newMap });

        // 更新地图列表
        const newMapList = [...mapList, newMap];
        yield put({ type: 'saveMapList', payload: newMapList });
      } else {
        const navigationType = cells[0].navigationType;
        // 将地图转换的参数合并到地图数据
        currentMap.transform = { [navigationType]: transform };
        // 合并点位和线条
        cells.forEach((cell) => {
          currentMap.cellMap[cell.id] = { ...cell };
        });
        const currentRouteMap = getCurrentRouteMapData();
        currentRouteMap.relations = currentRouteMap.relations.concat(relations);
        yield put({ type: 'saveCurrentMapOnly', payload: { ...currentMap } });
      }
      return true;
    },

    // 导出地图
    * exportMap(_, { select }) {
      const { currentMap } = yield select(({ editor }) => editor);
      //TODO: 验证地图数据
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
      const mapData = payload || currentMap;
      yield put({ type: 'editorView/saveMapLoading', payload: true });

      const sectionId = window.localStorage.getItem('sectionId');
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
          const chargerVMs = chargerList.map((charger) => generateChargerXY(charger, cellMap));
          for (let chargerIndex = 0; chargerIndex < chargerList.length; chargerIndex++) {
            chargerList[chargerIndex].x = chargerVMs[chargerIndex].x;
            chargerList[chargerIndex].y = chargerVMs[chargerIndex].y;
          }
          loopLogicAreaData.chargerList = chargerList;

          // 优先级线条
          const logicRouteMap = loopLogicAreaData.routeMap;
          Object.keys(logicRouteMap).forEach((routeMapKey) => {
            const loopRouteMapData = logicRouteMap[routeMapKey];
            if (Array.isArray(loopRouteMapData.relations)) {
              loopRouteMapData.relations = loopRouteMapData.relations
                // 筛掉不合法的线条
                .filter((relation) => {
                  const { source, target } = relation;
                  return !isNull(cellMap[source]) && !isNull(cellMap[target]);
                })
                .map((relation) => {
                  // 重新计算线条角度
                  const _relation = { ...relation };
                  const { source, target } = _relation;
                  _relation.angle = getAngle(cellMap[source], cellMap[target]);
                  return _relation;
                });
            } else {
              loopRouteMapData.relations = [];
            }
          });
        }

        // 4. 保存
        const response = yield call(saveMap, mapData);
        if (dealResponse(response)) {
          message.error(formatMessage({ id: 'app.message.operateFailed' }));
        } else {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));

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
      yield put({ type: 'editorView/saveMapLoading', payload: false });
    },

    // 激活地图
    *activeMap({ payload }, { select, call, put }) {
      const { currentMap, mapList } = yield select((state) => state.editor);
      yield put({ type: 'editorView/saveActiveMapLoading', payload: true });
      const response = yield call(activeMap, payload);
      if (!dealResponse(response)) {
        const newMapList = mapList.map((item) => ({
          ...item,
          activeFlag: item.id === payload,
        }));
        currentMap.activeFlag = true;
        yield put({ type: 'editorView/saveActiveMapLoading', payload: false });
        yield put({ type: 'saveCurrentMapOnly', payload: currentMap });
        yield put({ type: 'saveMapList', payload: newMapList });
        message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      } else {
        message.error(formatMessage({ id: 'app.message.operateFailed' }));
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

    // 高级删除, 选择多种元素进行同意删除
    *advancedDeletion({ payload }, { select, put }) {},

    // ********************************* 逻辑区操作 ********************************* //
    *fetchCreateLogicArea({ payload }, { select, put }) {
      const currentMap = yield select(({ editor }) => editor.currentMap);
      const { logicAreaList } = currentMap;
      const newLogicAreaId = logicAreaList[logicAreaList.length - 1].id + 1;
      const newLogicArea = new LogicArea({ id: newLogicAreaId, ...payload });
      logicAreaList.push(newLogicArea);
      yield put({ type: 'saveCurrentLogicArea', payload: newLogicAreaId });
    },

    *fetchUpdateLogicDetail({ payload }, { select }) {
      const { currentMap } = yield select(({ editor }) => editor);
      const { logicAreaList } = currentMap;
      const { id, name } = payload;

      const editingLogicAreaIndex = findIndex(logicAreaList, { id });
      currentMap.logicAreaList = update(logicAreaList, {
        [editingLogicAreaIndex]: {
          name: { $set: name },
        },
      });
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
    },

    *fetchDeleteLogicArea({ payload }, { select, put }) {
      const { currentMap, currentLogicArea } = yield select(({ editor }) => editor);
      const { cellMap, logicAreaList } = currentMap;

      // 剔除逻辑区数据
      currentMap.logicAreaList = logicAreaList.filter((record) => record.id !== payload);

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

    // ********************************* 路线区操作 ********************************* //
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
    // 新增单个导航点
    *addNavigation({ payload }, { select }) {
      const { currentMap, currentLogicArea } = yield select(({ editor }) => editor);
      const { navigationCellType, code, x, y } = payload;

      const cells = Object.values(currentMap.cellMap);
      let findResult;

      // 判断该车型下是否有相同导航点ID
      if (navigationCellType !== NavigationType.M_QRCODE) {
        findResult = find(cells, { naviId: code, navigationType: navigationCellType });
        if (findResult) {
          message.error('导航点编码已存在');
          return null;
        }
      }

      // 判断该车型下是否有相同的导航点坐标
      findResult = find(cells, { x, y, navigationType: navigationCellType });
      if (findResult) {
        message.error('导航点坐标已存在');
        return null;
      }

      const id = getCellMapId(Object.values(currentMap.cellMap).map(({ id }) => id));

      // 将xy转换成对应导航点类型的实际坐标
      const cell = new CellEntity({
        id,
        x,
        y,
        naviId: navigationCellType === NavigationType.M_QRCODE ? id : code,
        navigationType: navigationCellType,
        logicId: currentLogicArea,
      });
      currentMap.cellMap[id] = reverseCoordinateTransformer(
        cell,
        navigationCellType,
        currentMap?.transform?.[navigationCellType],
      );
      return cell;
    },

    // 批量新增导航点（一般只针对二维码导航点）
    * batchAddCells({ payload }, { select }) {
      const { currentMap, currentLogicArea } = yield select(({ editor }) => editor);
      const { cellMap } = currentMap;
      const { addWay, navigationCellType } = payload;

      let additionalCells = [];
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
          );
        }
      } else {
        /**
         * 偏移功能需要注意:
         * 因为地图显示方式的左手坐标系
         * 所以如果点位所对应的地图是右手坐标系, 那么左右偏移没有影响， 但是上下偏移则在计算的时候是相反的
         */
        const configNavigationCellType = find(NavigationTypeView, { code: navigationCellType });
        if (isNull(configNavigationCellType)) {
          message.error(`无法识别的导航点类型: ${navigationCellType}`);
          return;
        }
        const coordinateSystemType = configNavigationCellType.coordinationType;
        const { cellIds, count, distance } = payload;
        let dir = payload.dir;
        if ([0, 2].includes(dir) && coordinateSystemType === 'R') {
          dir = dir === 0 ? 2 : 0;
        }
        const selectedCellsData = cellIds.map((cellId) => cellMap[cellId]);
        selectedCellsData.forEach((cellData) => {
          for (let index = 1; index < count + 1; index++) {
            additionalCells.push(moveCell(cellData, distance * index, dir));
          }
        });
        const { cellId, naviId } = generateCellIds(cellMap, additionalCells.length);
        additionalCells = additionalCells.map((cell, index) => ({
          ...cell,
          id: cellId[index],
          naviId: naviId[index] + '',
        }));
      }

      // 再转换一次 additionalCells, 向数据里添加 naviId 和 logicId
      additionalCells = additionalCells.map((cell) => ({
        ...cell,
        navigationType: navigationCellType,
        logicId: currentLogicArea,
      }));

      // 只有一开始不存在点位时候批量新增完点位才需要居中
      const centerMap =
        Object.values(cellMap).filter((item) => item.logicId === currentLogicArea).length === 0;

      // 更新 cellMap
      const result = [];
      const newCellMap = { ...cellMap };
      additionalCells.forEach((cell) => {
        newCellMap[cell.id] = { ...cell };
        const transformedXY = coordinateTransformer(
          cell,
          navigationCellType,
          currentMap.transform?.[navigationCellType],
        );
        result.push({ ...cell, ...transformedXY });
      });
      currentMap.cellMap = newCellMap;
      return { centerMap, additionalCells: result };
    },

    // 批量删除导航点
    *deleteNavigations({ payload }, { select }) {
      const { currentMap } = yield select(({ editor }) => editor);
      const { types, naviCells } = payload;
      const result = { cells: [], lines: [], arrows: [] }; // {cells:{x_y:[id]}, lines:[x1_y1_x2_y2], arrows:[sourceId]}
      naviCells.forEach(({ id, navigationType }) => {
        if (types.includes(navigationType)) {
          const { relations } = getCurrentRouteMapData();
          const relevantRelations = relations.filter(
            (item) => item.source === id || item.target === id,
          );
          relevantRelations.forEach(({ source, target }) => {
            result.arrows.push(`${source}_${target}`);
            result.lines.push(`${source}_${target}`);
          });

          // 处理cellMap数据
          delete currentMap.cellMap[id];
          result.cells.push(id);
        }
      });
      return result;
    },

    // 修改点位导航ID
    * updateCellNaviId({ payload }, { select }) {
      const { currentMap } = yield select(({ editor }) => editor);
      const { originId, newId } = payload;
      const { cellMap } = currentMap;
      // 首先检测ID是否重复
      const pickResult1 = pickBy(cellMap, (item) => item.naviId === newId);
      if (Object.keys(pickResult1).length > 0) {
        message.error(formatMessage({ id: 'app.form.id.duplicate' }));
      } else {
        // 只需要到cellMap将对应点位的navId值替换为newId
        const pickResult2 = pickBy(cellMap, (item) => item.naviId === originId);
        const keys = Object.keys(pickResult2);
        if (keys.length > 1) {
          message.error(`地图点位数据异常, 导航点ID(${originId})存在重复: ${keys.join()}`);
        } else if (keys.length === 1) {
          cellMap[keys[0]].naviId = newId;
          return { cellId: parseInt(keys[0]), naviId: newId };
        } else {
          message.error(`点位数据丢失, 导航点ID位: ${originId}`);
        }
      }
    },

    // ********************************* 地图编程 ********************************* //
    * updateMapPrograming({ payload }, { select }) {
      const { programing } = yield select(({ global }) => global);
      const currentRouteMap = getCurrentRouteMapData();

      // 新增地图的编程节点
      if (isNull(currentRouteMap.programing)) {
        currentRouteMap.programing = { cells: {}, relations: {}, zones: {} };
      }

      // 如果某个对象已经存在配置则覆盖
      const { type, items, configuration } = payload;
      if (!Array.isArray(configuration)) return;
      const existCellConfigList = { ...currentRouteMap.programing[`${type}s`] };
      if (configuration.length > 0) {
        const actions = fillFormValueToAction(
          configuration,
          programing,
          type === ProgramingItemType.relation,
        );
        items.forEach((cellId) => {
          existCellConfigList[cellId] = actions;
        });
      } else {
        items.forEach((cellId) => {
          delete existCellConfigList[cellId];
        });
      }
      currentRouteMap.programing[`${type}s`] = existCellConfigList;
      return items;
    },

    deleteMapPrograming({ payload }) {
      const currentRouteMap = getCurrentRouteMapData();
      const { key, type } = payload;
      const existConfigList = { ...currentRouteMap.programing[`${type}s`] };
      delete existConfigList[key];
      currentRouteMap.programing[`${type}s`] = existConfigList;
      return [key];
    },

    // ********************************* 待调整 ********************************* //
    // 移动点位
    * moveCells({ payload }, { select, put }) {
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
        if (cellIds.includes(item.id)) {
          return { ...result.cell[item.id] };
        }
        return item;
      });

      // 处理线条
      const currentRouteMapData = getCurrentRouteMapData();
      currentRouteMapData.relations = syncLineState(cellIds, newCellMap, result);
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
      const _currentCells = currentCells.filter((item) => !movedCellIds.includes(item.id));
      movedCellIds.forEach((cellId) => {
        const { type, coord } = newCellMap[cellId];
        _currentCells.push({ ...newCellMap[cellId], [type]: coord });
      });

      // 对操作点位的线条进行调整，直线线条修改distance和angle数值，曲线线条直接删除
      const currentRouteMapData = getCurrentRouteMapData();
      currentRouteMapData.relations = syncLineState(cellIds, newCellMap, result);
      return result;
    },

    // 设置点位类型
    *setCellType({ payload }, { select }) {
      const { selections } = yield select(({ editor }) => editor);
      const { type, scope, operation } = payload;

      const selectCells = selections
        .filter((item) => item.type === MapSelectableSpriteType.CELL)
        .map(({ id }) => id);
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
              message.error(
                formatMessage({ id: 'editor.tip.storageWithoutBlock' }, { value: cellId }),
              );
            } else {
              activeCellIds.push(parseInt(cellId, 10));
            }
          });
        } else {
          // 任何点位类型不可以配置到不可走点上
          selectCells.forEach((cellId) => {
            if (blockCellIds.includes(parseInt(cellId, 10))) {
              message.error(
                formatMessage({ id: 'editor.tip.blockWithoutOthers' }, { value: cellId }),
              );
            } else {
              activeCellIds.push(parseInt(cellId, 10));
            }
          });
        }
        scopeData[type] = [...originalData, ...activeCellIds];
      }
      if (operation === 'remove') {
        originalData = originalData.filter((item) => !selectCells.includes(item));
        activeCellIds = [...selectCells];
        scopeData[type] = originalData;
      }

      return {
        cellIds: activeCellIds,
        cellType: FieldTextureKeyMap[type],
        texture: operation === 'add' ? FieldTextureKeyMap[type] : null,
      };
    },

    // ********************************* 地图标记 ********************************* //
    insertZoneMarker({ payload }) {
      const currentLogicAreaData = getCurrentLogicAreaData();
      let zoneMarker = currentLogicAreaData.zoneMarker || [];
      zoneMarker = [...zoneMarker, payload];
      currentLogicAreaData.zoneMarker = zoneMarker;
    },

    updateZoneMarker({ payload }) {
      const currentLogicAreaData = getCurrentLogicAreaData();
      let zoneMarker = currentLogicAreaData.zoneMarker || [];
      const targetMarker = find(zoneMarker, { code: payload.code });
      if (targetMarker) {
        targetMarker.x = payload.x;
        targetMarker.y = payload.y;
        targetMarker.width = payload.width;
        targetMarker.height = payload.height;
      }
    },

    updateEStop({ payload }) {
      const currentLogicAreaData = getCurrentLogicAreaData();
      let emergencyStopFixedList = currentLogicAreaData.emergencyStopFixedList || [];
      const targetMarker = find(emergencyStopFixedList, { code: payload.code });
      if (targetMarker) {
        targetMarker.x = payload.x - payload.width / 2;
        targetMarker.y = payload.y - payload.height / 2;
        targetMarker.xlength = payload.width;
        targetMarker.ylength = payload.height;
      }
    },

    insertLabel({ payload }, { select }) {
      const currentLogicAreaData = getCurrentLogicAreaData();
      let labels = currentLogicAreaData.labels || [];
      labels = [...labels, payload];
      currentLogicAreaData.labels = labels;
    },

    updateLabelMarker({ payload }, { select }) {
      const currentLogicAreaData = getCurrentLogicAreaData();
      let labels = currentLogicAreaData.labels || [];
      const targetMarker = find(labels, { code: payload.code });
      if (targetMarker) {
        targetMarker.x = payload.x;
        targetMarker.y = payload.y;
        targetMarker.width = payload.width;
        targetMarker.height = payload.height;
      }
    },

    // ********************************* 线条操作 ********************************* //
    generateCostLines({ payload }) {
      const {
        cells,
        params: { dir, value },
      } = payload;
      const result = { remove: [], add: [] };
      const currentRouteMap = getCurrentRouteMapData();
      let currentRouteRelations = currentRouteMap.relations;
      // 为了防止重复添加，预先将已存在的cost生成一个map结构供校验
      const idCostMap = {};
      currentRouteRelations.forEach((item) => {
        idCostMap[`${item.source}_${item.target}`] = item;
      });
      const newLines = batchGenerateLine(cells, dir, value);
      Object.entries(newLines).forEach(([mapKey, relation]) => {
        if (relation.cost === -1) {
          result.remove.push(mapKey);
        } else {
          result.add.push(relation);
        }
      });

      // 处理地图原数据
      result.remove.forEach((key) => {
        delete idCostMap[key];
      });
      result.add.forEach((item) => {
        idCostMap[`${item.source}_${item.target}`] = item;
      });
      currentRouteMap.relations = Object.values(idCostMap);
      return result;
    },

    *deleteLines(_, { select, put }) {
      const { selections, currentMap } = yield select(({ editor }) => editor);
      const selectLines = selections.filter((item) => item.type === MapSelectableSpriteType.ROUTE);
      const result = [];

      const currentRouteMapData = getCurrentRouteMapData();
      let relations = [...(currentRouteMapData.relations ?? [])];
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

    *updateCost({ payload }, { select, put }) {
      const selections = yield select(({ editor }) => editor.selections);
      const { id, cost } = payload;

      let preRelation;
      // 更新地图数据
      const currentRouteMap = getCurrentRouteMapData();
      const [source, target] = id.split('-').map((item) => parseInt(item));
      currentRouteMap.relations.forEach((relation) => {
        if (relation.source === source && relation.target === target) {
          preRelation = { ...relation };
          relation.cost = parseInt(cost);
        }
      });

      // 更新 selections
      yield put({
        type: 'updateSelections',
        payload: { incremental: false, selections: [{ ...selections[0], cost: parseInt(cost) }] },
      });

      return {
        pre: { ...preRelation },
        next: { ...preRelation, cost: parseInt(cost) },
      };
    },

    /**
     * 根据规则生成默认线条
     * 横向配置为地图上方第一行，随后交叉相同
     * 纵向配置为地图左侧第一列，随后交叉相同
     */
    *createDefaultLines({ payload }, { select }) {
      const { currentMap, currentCells, selections } = yield select(({ editor }) => editor);
      // TODO: 强制取消当前选择的线条
      let selectCells = selections.filter((item) => item.type === MapSelectableSpriteType.CELL);
      if (selectCells.length > 0) {
        selectCells = selectCells.map(({ id }) => currentMap.cellMap[id]);
      } else {
        selectCells = currentCells;
      }

      const additionalRelations = [];
      // 处理横向数据
      const groupByY = groupBy(selectCells, 'y');
      const rows = Object.keys(groupByY);
      for (let i = 1; i < rows.length + 1; i++) {
        const isOdd = i % 2 !== 0;
        const cells = groupByY[rows[i - 1]];
        if (cells.length > 1) {
          cells.reduce((pre, next) => {
            additionalRelations.push({
              source: pre.id,
              target: next.id,
              type: LineType.StraightPath,
              cost: payload[isOdd ? 1 : 3],
              angle: getAngle(pre, next),
              distance: getDistance(pre, next),
            });
            additionalRelations.push({
              source: next.id,
              target: pre.id,
              type: LineType.StraightPath,
              cost: payload[isOdd ? 3 : 1],
              angle: getAngle(next, pre),
              distance: getDistance(next, pre),
            });
            return next;
          });
        }
      }

      // 处理纵向数据
      const groupByX = groupBy(selectCells, 'x');
      const columns = Object.keys(groupByX);
      for (let i = 1; i < columns.length + 1; i++) {
        const isOdd = i % 2 !== 0;
        const cells = groupByX[columns[i - 1]];
        if (cells.length > 1) {
          // 这里需要注意：纵向情况下，y坐标从小到大的方向的向下
          cells.reduce((pre, next) => {
            additionalRelations.push({
              source: pre.id,
              target: next.id,
              type: LineType.StraightPath,
              cost: payload[isOdd ? 2 : 0],
              angle: getAngle(pre, next),
              distance: getDistance(pre, next),
            });
            additionalRelations.push({
              source: next.id,
              target: pre.id,
              type: LineType.StraightPath,
              cost: payload[isOdd ? 0 : 2],
              angle: getAngle(next, pre),
              distance: getDistance(next, pre),
            });
            return next;
          });
        }
      }

      /**
       * 数据合并
       * additionalRelations覆盖relations
       * 如果additionalRelations存在cost为-1的情况，则是删除
       */
      const relationsToDelete = [];
      const relationsToRender = [];
      const relationMap = new Map();
      const relations = getCurrentRouteMapData().relations || [];
      relations.forEach((item) => {
        relationMap.set(`${item.source}-${item.target}`, item);
      });

      additionalRelations.forEach((item) => {
        const key = `${item.source}-${item.target}`;
        // 删除操作
        if (item.cost === -1) {
          // 只有存在的情况才做处理
          if (relationMap.has(key)) {
            relationMap.delete(key);
            relationsToDelete.push(item);
          }
        } else {
          // 如果已经存在且不同就替换,相同则跳过
          if (relationMap.has(key)) {
            // 用lodash.isEqual来判断两个线条是否相同
            if (!isEqual(item, relationMap.get(key))) {
              relationsToDelete.push(relationMap.get(key));
              relationMap.set(key, item);
              relationsToRender.push(item);
            }
          } else {
            // 如果不存在接直接新增
            relationMap.set(key, item);
            relationsToRender.push(item);
          }
        }
      });

      // 获取最新地图relation数据
      getCurrentRouteMapData().relations = [...relationMap.values()];
      return { add: relationsToRender, remove: relationsToDelete };
    },

    // ********************************* 功能操作 ********************************* //
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
      let currentFunction = { ...data };
      const index = data.flag - 1;
      delete currentFunction.flag;

      let returnPayload = currentFunction;
      if (type === 'chargerList') {
        returnPayload = generateChargerXY(currentFunction, currentMap.cellMap);
        currentFunction = convertChargerToDTO(currentFunction, currentMap.cellMap);
      }
      if (type === 'workstationList') {
        returnPayload = renderWorkStationList([currentFunction], currentMap.cellMap)[0];
      }
      if (type === 'elevatorList') {
        returnPayload = renderElevatorList([currentFunction])[currentLogicAreaData.id];
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
        const preLoad = renderElevatorList(oldFunctionData)[currentLogicAreaData.id];
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
        returnPayload = renderWorkStationList([removedFunctionItem], currentMap.cellMap)[0];
      }
      if (type === 'chargerList') {
        // returnPayload = renderChargerList([removedFunctionItem], currentMap.cellMap)[0];
      }
      if (type === 'elevatorList') {
        returnPayload = renderElevatorList([removedFunctionItem], currentMap.cellMap)[
          currentLogicAreaData.id
        ];
      }
      return returnPayload;
    },

    // 批量添加充电桩
    *addChargerInBatches({ payload }, { select }) {
      const { currentMap } = yield select(({ editor }) => editor);

      const { name, angle, priority, supportTypes, cellIds } = payload;
      const scopeData = getCurrentLogicAreaData();
      const functionData = scopeData.chargerList || [];

      let tempCharger = [];
      cellIds.forEach((cellId, index) => {
        let nameWillBeUse = `${name}-${index + 1}`;
        // 判断该名称是否可用
        const isExist = findIndex(functionData, { name: nameWillBeUse }) >= 0;
        if (isExist) {
          nameWillBeUse = `${name}-${getRandomString(6)}`;
        }

        tempCharger.push({
          code: `charger_${getRandomString(6)}`,
          name: nameWillBeUse,
          angle,
          priority,
          chargingCells: [{ cellId, supportTypes }],
        });
      });
      tempCharger = tempCharger.map((item) => convertChargerToDTO(item, currentMap.cellMap));
      scopeData.chargerList = [...functionData, ...tempCharger];
      return tempCharger;
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

    // ********************************* 更新部分标识符 ********************************* //
    *updateSelections({ payload }, { select, put }) {
      const { selections, categoryProps, categoryPanel } = yield select(({ editor }) => editor);

      let payloadSelections = [];
      let incremental = false;
      if (isPlainObject(payload)) {
        payloadSelections = payload.selections;
        incremental = payload.incremental;
      } else {
        payloadSelections = payload;
      }

      let _selections = payloadSelections;
      // 存在增量选择，需要删除重复的对象
      if (incremental) {
        _selections = [...selections];
        payloadSelections.forEach((selection) => {
          if (!some(selections, selection)) {
            _selections.push(selection);
          }
        });
      }

      const newState = {
        selections: _selections,
      };
      if (_selections.length === 1) {
        if (categoryPanel === null) {
          newState.categoryPanel = RightCategory.Prop;
        }

        // 点位和线条可被替换
        if (categoryProps === null || [CELL, ROUTE].includes(categoryProps.type)) {
          newState.categoryProps = _selections[0];
        }

        // 除了点位和线条，可以互相替换
        if (
          ![CELL, ROUTE].includes(categoryProps) &&
          ![CELL, ROUTE].includes(_selections[0].type)
        ) {
          newState.categoryProps = _selections[0];
          newState.lockedProps = _selections[0].type;
        }
      } else {
        newState.categoryProps = null;
        newState.lockedProps = null;
        if (categoryPanel === RightCategory.Prop) {
          newState.categoryPanel = null;
        }
      }
      yield put({ type: 'saveState', payload: newState });
      yield put({ type: 'editorView/saveShortcutToolVisible', payload: _selections.length > 0 });
    },

    *updateLeftActiveCategory({ payload }, { put }) {
      yield put({
        type: 'editorView/saveState',
        payload: {
          settingEStop: false,
          zoneMarkerVisible: false,
          labelMarkerVisible: false,
        },
      });

      yield put({
        type: 'saveState',
        payload: { leftActiveCategory: payload },
      });
    },

    *updateSettingEStop({ payload }, { put }) {
      yield put({
        type: 'editorView/saveState',
        payload: {
          settingEStop: true,
          zoneMarkerVisible: false,
          labelMarkerVisible: false,
        },
      });
      yield put({
        type: 'saveState',
        payload: { leftActiveCategory: payload },
      });
    },
  },

  reducers: {
    unmount(state) {
      return {
        ...EditorState,
      };
    },
    saveState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveMapRatio(state, action) {
      return {
        ...state,
        mapRatio: action.payload,
      };
    },
    saveMapMinRatio(state, action) {
      return {
        ...state,
        mapMinRatio: action.payload,
        mapRatio: action.payload,
      };
    },
    updateEditPanelVisible(state, action) {
      if (action.payload === null) {
        return {
          ...state,
          categoryPanel: null,
          categoryProps: null,
          lockedProps: null,
        };
      } else {
        if (action.payload === RightCategory.Prop) {
          const selection = state.selections[0];
          return {
            ...state,
            categoryPanel: action.payload,
            categoryProps: selection,
            lockedProps: [CELL, ROUTE].includes(selection?.type) ? null : selection?.type,
          };
        }
        return {
          ...state,
          categoryPanel: action.payload,
        };
      }
    },
    saveMapContext(state, action) {
      return {
        ...state,
        mapContext: action.payload,
      };
    },

    saveMapList(state, action) {
      return {
        ...state,
        mapList: action.payload,
      };
    },

    // 用于保存地图
    saveCurrentMapOnly(state, action) {
      return {
        ...state,
        currentMap: action.payload,
      };
    },
    // 用于切换地图
    saveCurrentMap(state, action) {
      return {
        ...state,
        currentMap: action.payload,
        currentLogicArea: 0,
        currentRouteMap: 'DEFAULT',
        preRouteMap: null,
        selections: [],
      };
    },
    saveCurrentLogicArea(state, action) {
      // 电梯配置的特殊性，需要切换逻辑区，所以这里切换逻辑区就不删除selections中的电梯，并且在重新渲染电梯数据的时候替换掉
      const { selections, categoryProps } = state;
      let newSelections = [];
      if (selections.length === 1 && selections[0] instanceof Elevator) {
        newSelections = selections;
      } else if (categoryProps instanceof Elevator) {
        newSelections = [categoryProps];
      }

      return {
        ...state,
        currentLogicArea: action.payload,
        currentRouteMap: 'DEFAULT',
        preRouteMap: null,
        selections: newSelections,
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
  },
};
