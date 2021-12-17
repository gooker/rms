import React from 'react';
import SystemParamsComponent from '@/pages/SystemParams/SystemParamsComponent';
import { AGVType } from '@/config/config';

const TaskAgvType = AGVType.Sorter;
class AgvRealTime extends React.Component {
  render() {
    return <SystemParamsComponent agvType={TaskAgvType} />;
  }
}
export default AgvRealTime;
