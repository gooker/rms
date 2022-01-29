import { fetchLogout, fetchUserRoleList, fetchUpdateUserCurrentSection } from '@/services/user';
import { getCurrentUser } from '@/services/api';
import intl from 'react-intl-universal';
import { dealResponse } from '@/utils/util';
import { message } from 'antd';
import find from 'lodash/find';

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

        // 3. 保存当前Section
        if (username !== 'admin') {
          if (!currentSection) {
            message.error(intl.formatMessage({ id: 'app.section.not.exist' }));
            return false;
          }
          window.localStorage.setItem('sectionId', currentSection.sectionId);
          yield put({ type: 'saveCurrentSectionEffect', payload: currentSection });
        }

        // 4. 保存权限数据
        const permissionMap = {};
        for (let index = 0; index < authorityKeys.length; index++) {
          permissionMap[authorityKeys[index]] = true;
        }
        window.localStorage.setItem('permissionMap', JSON.stringify(permissionMap));

        // 5. 保存用户角色信息
        const userRoleList = yield call(fetchUserRoleList, { userId });
        if (!dealResponse(userRoleList)) {
          yield put({ type: 'saveUserRoleList', payload: userRoleList.roles || [] });
        }

        // 6. 保存用户时区数据
        window.localStorage.setItem('userTimeZone', response.userTimeZone || '');

        return response;
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
