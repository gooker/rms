import React from 'react';
import AgvRealTimeComponent from '@/components/pages/AgvRealTime/AgvRealTimeComponent';
import { AGVType } from '@/config/config';

const TaskAgvType = AGVType.Sorter;
class AgvRealTime extends React.Component {
  render() {
    const agvId = new URLSearchParams(new URL(window.location.href).hash).get('agvId');
    return <AgvRealTimeComponent agvType={TaskAgvType} agvId={agvId} />;
  }
}
export default AgvRealTime;
