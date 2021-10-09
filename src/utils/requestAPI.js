import { isPlainObject } from 'lodash';
import { NameSpace } from '@/config/config';

export default function requestAPI() {
  let apiMap = {};
  if (isPlainObject(window.extraConfig)) {
    apiMap = window.extraConfig;
  } else {
    apiMap = {
      // dev
      // sso: 'https://sso-api-dev.mushiny.com',

      // NT-11
      sso: 'http://52.83.193.245:10211',
      coordinator: 'http://52.83.193.245:10213',

      // NT-12
      // sso: 'http://sso-api-ntdev-self-defining.mushiny.local',
      // coordinator: 'http://translation-api-ntdev-self-defining.mushiny.local',

      // 高可用 13 $ 14
      // sso: 'http://sso-api-ntdev-ha.mushiny.local',
      // coordinator: 'http://gateway-api-ntdev-ha.mushiny.local',
    };
  }
  apiMap[NameSpace.Mixrobot] = apiMap.coordinator;
  apiMap[NameSpace.Tote] = apiMap.coordinator;
  apiMap[NameSpace.Sorter] = apiMap.coordinator;
  apiMap[NameSpace.LatentLifting] = apiMap.coordinator;
  const namespace = JSON.parse(window.localStorage.getItem('nameSpacesInfo'));
  if (namespace) {
    apiMap = { ...apiMap, ...namespace };
  }
  return apiMap;
}
