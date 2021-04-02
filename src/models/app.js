import moment from 'moment';
import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';
import koKR from 'antd/lib/locale/ko_KR';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';

export default {
  namespace: 'app',

  state: {
    globalLocale: 'en-US',
    antdLocale: enUS,
  },

  effects: {
    *updateGlobalLocale({ payload }, { put }) {
      let localeValue;
      switch (payload) {
        case 'zh-CN':
          localeValue = zhCN;
          break;
        case 'en-US':
          localeValue = enUS;
          break;
        case 'ko-KR':
          localeValue = koKR;
          break;
        default:
          break;
      }
      moment.locale(payload);
      yield put({ type: 'updateGlobalLang', payload });
      yield put({ type: 'updateAntedLocale', payload: localeValue });
    },
  },

  reducers: {
    updateAntedLocale(state, { payload }) {
      return {
        ...state,
        antdLocale: payload,
      };
    },

    updateGlobalLang(state, { payload }) {
      return {
        ...state,
        globalLocale: payload,
      };
    },
  },
};
