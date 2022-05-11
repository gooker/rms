import { isEmpty, isPlainObject } from 'lodash';
import { getLocalStorageEnv } from '@/utils/init';
import { NameSpace } from '@/config/config';

export default function requestAPI() {
  let apiMap;
  if (window.extraConfig && isPlainObject(window.extraConfig)) {
    if (isEmpty(window.extraConfig)) {
      apiMap = {
        [NameSpace.Platform]: window.location.origin,
        ws: `ws://${window.location.host}/ws`,
      };
    } else {
      apiMap = {
        [NameSpace.Platform]: window.extraConfig.platform || window.location.origin,
        ws: window.extraConfig.ws || `ws://${window.location.host}/ws`,
      };
    }
    apiMap[NameSpace.I18N] = apiMap.platform;
    apiMap[NameSpace.SSO] = apiMap.platform;
  } else {
    apiMap = {
      // NT-13 内网
      // platform: 'http://192.168.0.13:8073',
      // sso: 'http://192.168.0.13:8071',
      // ws: 'ws://192.168.0.13:15654/ws',

      // NT-13 外网
      platform: 'http://52.83.193.245:10218',
      sso: 'http://52.83.193.245:10217',
      ws: 'ws://52.83.193.245:10216/ws',
    };
  }

  // 合并本地自定义的SSO配置
  const envs = getLocalStorageEnv();
  apiMap = { ...apiMap, ...envs };
  return apiMap;
}
