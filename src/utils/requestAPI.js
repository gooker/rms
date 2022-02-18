import { isPlainObject } from 'lodash';
import { NameSpace } from '@/config/config';

export default function requestAPI() {
  let apiMap = {};
  if (window.extraConfig && isPlainObject(window.extraConfig)) {
    apiMap = { ...window.extraConfig };
  } else {
    apiMap = {
      // NT-11-Dev 内网
      // sso: 'http://192.168.0.11:6021',
      // coordinator: 'http://192.168.0.11:6023',
      // ws: 'ws://52.83.193.245:10215/ws',

      // NT-11-dev 公网
      // sso: 'http://52.83.193.245:10211',
      // coordinator: 'http://52.83.193.245:10213',
      // ws: 'ws://52.83.193.245:10215/ws',

      // NT-11-monthly 内网
      // sso: 'http://192.168.0.11:6121',
      // coordinator: 'http://192.168.0.11:6123',
      // ws: 'ws://52.83.193.245:10225/ws',

      // NT-11-monthly 公网
      sso: 'http://52.83.193.245:10221',
      coordinator: 'http://52.83.193.245:10223',
      ws: 'ws://52.83.193.245:10225/ws',

      // NT-12
      // sso: 'http://sso-api-ntdev-self-defining.mushiny.local',
      // coordinator: 'http://translation-api-ntdev-self-defining.mushiny.local',

      // 高可用 13 $ 14
      // sso: 'http://sso-api-ntdev-ha.mushiny.local',
      // coordinator: 'http://gateway-api-ntdev-ha.mushiny.local',
    };
  }
  apiMap[NameSpace.Coordinator] = apiMap.coordinator;
  apiMap[NameSpace.LatentLifting] = apiMap.coordinator;
  apiMap[NameSpace.Tote] = apiMap.coordinator;
  apiMap[NameSpace.Sorter] = apiMap.coordinator;
  apiMap[NameSpace.I18N] = apiMap.coordinator;

  return apiMap;
}
