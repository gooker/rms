import React from 'react';
import FaultDefinitionComponent from '@/pages/FaultDefinition/FaultDefinitionComponent';
import { AGVType } from '@/config/config';

export default class FaultDefinition extends React.Component {
  render() {
    return <FaultDefinitionComponent agvType={AGVType.LatentLifting} />;
  }
}
