import { formatMessage } from '@/utils/util';

// 状态
export const ChargerStatus = {
  OFFLINE: formatMessage({ id: 'app.chargerState.OFFLINE' }),
  AVAILABLE: formatMessage({ id: 'app.chargerState.AVAILABLE' }),
  CONNECTING: formatMessage({ id: 'app.chargerState.CONNECTING' }),
  CONNECTED: formatMessage({ id: 'app.chargerState.CONNECTED' }),
  CHARGING: formatMessage({ id: 'app.chargerState.CHARGING' }),
  ERROR: formatMessage({ id: 'app.chargerState.ERROR' }),
};

export const StatusColor = {
  OFFLINE: 'gray',
  AVAILABLE: 'green',
  CONNECTING: 'pink',
  CONNECTED: 'cyan',
  CHARGING: 'yellow',
  ERROR: 'red',
  CHARGER_TIME_OUT_EXCEPTION: 'pink',
  ASSIGNED: 'blue',
};
