import React from 'react';
import AgvRealTimeComponent from '@/components/pages/AgvRealTime/AgvRealTimeComponent';
import Config from '@/config/config';

const NameSpace = Config.nameSpace.Sorter;
const TaskAgvType = Config.AGVType.Sorter;

class AgvRealTime extends React.Component {
  render() {
    return <AgvRealTimeComponent nameSpace={NameSpace} />;
  }
}
export default AgvRealTime;
