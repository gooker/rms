import React from 'react';
import AgvRealTimeComponent from '@/components/pages/AgvRealTime/AgvRealTimeComponent';
import { AGVType } from '@/config/config';

const TaskAgvType = AGVType.Sorter;
class AgvRealTime extends React.Component {
  render() {
    return <AgvRealTimeComponent agvType={TaskAgvType} />;
  }
}
export default AgvRealTime;
