import { isPlainObject } from 'lodash';
import { isStrictNull } from '@/utils/util';
import { NameSpace } from '@/config/config';

const { Platform, WS } = NameSpace;
const { origin, host, protocol, hostname } = window.location;

/**
 * 自定义环境数据目前保存在LocalStorage，如果后续发现不方便的话，就改成使用IndexDB
 */
export function getApiURL(namespace, configValue, prefix) {
  if (isStrictNull(configValue) || configValue === `${namespace.toUpperCase()}_API`) {
    if (namespace === Platform) {
      return origin;
    }
    return `ws://${host}/ws`;
  } else if (Number.isNaN(Number(configValue))) {
    // 完整的url
    return configValue;
  } else {
    // 端口
    return `${isStrictNull(prefix) ? protocol : prefix}//${hostname}:${configValue}`;
  }
}

/**
 * config.js 文件可配置的字段有: platform, ws
 * 约定上三个字段可填的内容包括：端口号、完整的URL和空
 */
export default function requestAPI() {
  let apiMap = {};
  if (isPlainObject(window.extraConfig)) {
    apiMap[Platform] = getApiURL(Platform, window.extraConfig[Platform]);
    apiMap[WS] = getApiURL(WS, window.extraConfig[WS], 'ws:');
  } else {
    apiMap = {
      // NT-13 内网
      // platform: 'http://192.168.0.13:8073',
      // ws: 'ws://192.168.0.13:15654/ws',

      // NT-13 外网
      // platform: 'http://52.83.193.245:10218',
      // ws: 'ws://52.83.193.245:10216/ws',

      // NT-17 内网
      // platform: 'http://192.168.0.17:8000',
      // ws: 'ws://192.168.0.17:8000/ws',

      // NT-17 外网
      platform: 'http://52.83.193.245:10220',
      ws: 'ws://52.83.193.245:10220/ws',
    };
  }
  return apiMap;
}
