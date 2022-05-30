import { isEmpty, isPlainObject } from 'lodash';
import { getLocalStorageEnv } from '@/utils/init';
import { NameSpace } from '@/config/config';
import { isStrictNull } from '@/utils/util';

function getApiURL(namespace, prefix) {
  const configValue = window.extraConfig[namespace];
  if (!isStrictNull(configValue)) {
    if (Number.isNaN(Number(configValue))) {
      // 完整的url
      return configValue;
    } else {
      // 端口
      const { origin, host } = window.location;
      if (isStrictNull(prefix)) {
        return `${origin}:${configValue}`;
      } else {
        return `${prefix}://${host}:${configValue}`;
      }
    }
  } else {
    throw new Error(`Please config "${namespace}" in config.js`);
  }
}

/**
 * config.js 文件可配置的字段有: platform, sso, ws。且sso是dev环境调试用，产品环境只需要配置 platform 和 ws
 * 约定上三个字段可填的内容包括：端口号、完整的URL
 */
export default function requestAPI() {
  let apiMap = {};
  if (isPlainObject(window.extraConfig)) {
    if (isEmpty(window.extraConfig)) {
      throw new Error('Please config valid url data in config.js');
    } else {
      // Platform
      apiMap[NameSpace.Platform] = getApiURL(NameSpace.Platform);

      // sso
      if (isStrictNull(window.extraConfig[NameSpace.SSO])) {
        apiMap[NameSpace.SSO] = apiMap[NameSpace.Platform];
      } else {
        apiMap[NameSpace.SSO] = getApiURL(NameSpace.SSO);
      }

      // ws
      apiMap[NameSpace.WS] = getApiURL(NameSpace.WS, 'ws');
    }
    apiMap[NameSpace.I18N] = apiMap.platform;
  } else {
    apiMap = {
      // NT-13 内网
      // platform: 'http://192.168.0.13:8073',
      // translation: 'http://192.168.0.13:8073',
      // sso: 'http://192.168.0.13:8071',
      // ws: 'ws://192.168.0.13:15654/ws',

      // NT-13 外网
      platform: 'http://52.83.193.245:10218',
      sso: 'http://52.83.193.245:10217',
      ws: 'ws://52.83.193.245:10216/ws',
    };
  }
  apiMap[NameSpace.I18N] = apiMap[NameSpace.Platform];

  // 合并本地自定义的SSO配置
  const envs = getLocalStorageEnv();
  apiMap = { ...apiMap, ...envs };
  return apiMap;
}
