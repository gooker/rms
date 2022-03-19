import React from 'react';
import AgvRealTimeComponent from '@/pages/AgvRealTime/AgvRealTimeComponent';
import { AGVType } from '@/config/config';

export default class AgvRealTime extends React.Component {
  render() {
    return <AgvRealTimeComponent agvType={AGVType.LatentLifting} {...this.props} />;
  }
}
