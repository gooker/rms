import { message } from 'antd';
import { find } from 'lodash';
import {
  fetchLogout,
  fetchUserAssignedRoleList,
  fetchUpdateUserCurrentSection,
} from '@/services/SSO';
import { getCurrentUser } from '@/services/api';
import { dealResponse, formatMessage } from '@/utils/util';

export default {
  namespace: 'user',

  state: {
    currentUser: null,
    currentSection: null,
    userRoleList: [],
    permissionMap: {},
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },

    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },

    saveCurrentSectionEffect(state, { payload }) {
      return {
        ...state,
        currentSection: payload,
      };
    },

    savePermissionMap(state, { payload }) {
      return {
        ...state,
        permissionMap: payload,
      };
    },

    saveUserRoleList(state, { payload }) {
      return {
        ...state,
        userRoleList: payload,
      };
    },
  },

  effects: {
    *fetchCurrentUser(_, { call, put }) {
      const response = yield call(getCurrentUser);
      if (!dealResponse(response)) {
        const { currentSection, language, id: userId, username, authorityKeys } = response;
        // 1. 保存用户语言信息
        yield put({ type: 'saveCurrentUser', payload: response });

        // 2. 保存国际化
        window.localStorage.setItem('currentLocale', language);

        if (username !== 'admin') {
          // 3. 保存当前Section
          if (!currentSection) {
            message.error(formatMessage({ id: 'app.section.not.exist' }));
            return false;
          }
          window.localStorage.setItem('sectionId', currentSection.sectionId);
          yield put({ type: 'saveCurrentSectionEffect', payload: currentSection });

          // 4. 保存用户角色信息
          const userRoleList = yield call(fetchUserAssignedRoleList, { userId });
          if (!dealResponse(userRoleList)) {
            yield put({ type: 'saveUserRoleList', payload: userRoleList.roles || [] });
          }
        }

        // 5. 保存权限数据
        const permissionMap = {};
        for (let index = 0; index < authorityKeys.length; index++) {
          permissionMap[authorityKeys[index]] = true;
        }
        window.localStorage.setItem('permissionMap', JSON.stringify(permissionMap));

        // 6. 保存用户时区数据
        window.localStorage.setItem('userTimeZone', response.userTimeZone || '');
        return response;
      }
    },

    *logout({ payload: history }, { call }) {
      const response = yield call(fetchLogout, {
        token: window.localStorage.getItem('Authorization'),
      });
      if (!dealResponse(response)) {
        window.localStorage.clear();
        history.push('/login');
      }
    },

    *fetchUpdateUserCurrentSection({ payload }, { call, put, select }) {
      const sections = yield select(({ user }) => user.currentUser.sections);
      const currentSection = find(sections, { sectionId: payload });
      yield put({ type: 'saveCurrentSectionEffect', payload: currentSection });

      const params = {
        sectionId: payload,
        token: window.localStorage.getItem('Authorization'),
      };
      const response = yield call(fetchUpdateUserCurrentSection, params);
      return !dealResponse(
        response,
        true,
        intl.formatMessage({ id: 'app.header.option.switchSectionSuccess' }),
      );
    },
  },
};
