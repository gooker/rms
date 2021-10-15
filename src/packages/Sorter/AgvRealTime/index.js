import React from 'react';
import AgvRealTimeComponent from '@/components/pages/AgvRealTime/AgvRealTimeComponent';
import { AGVType } from '@/config/config';
import { getURLSearchParam } from '@/utils/utils';

const TaskAgvType = AGVType.Sorter;
class AgvRealTime extends React.Component {
  render() {
    const agvId = getURLSearchParam('agvId');
    return <AgvRealTimeComponent agvType={TaskAgvType} agvId={agvId} />;
  }
}
export default AgvRealTime;
