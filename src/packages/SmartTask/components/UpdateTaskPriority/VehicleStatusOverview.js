import React, { memo } from 'react';
import { Badge, Row } from 'antd';
import { VehicleStateColor } from '@/config/consts';
import FormattedMessage from '@/components/FormattedMessage';
import taskQueueStyles from '@/packages/SmartTask/task.module.less';

const VehicleStatusOverview = ({ data }) => {
  return (
    <Row className={taskQueueStyles.vehicleStatusBadgeContainer}>
      {/* 空闲 */}
      <Badge
        showZero
        style={{ background: VehicleStateColor.available }}
        count={data.idleSize || 0}
      >
        <span
          className={taskQueueStyles.vehicleStatusBadge}
          style={{ background: VehicleStateColor.available }}
        >
          <FormattedMessage id={'vehicleState.Idle'} />
        </span>
      </Badge>

      {/* 待命 */}
      <Badge
        showZero
        style={{ background: VehicleStateColor.StandBy }}
        count={data.standbySize || 0}
      >
        <span
          className={taskQueueStyles.vehicleStatusBadge}
          style={{ background: VehicleStateColor.StandBy }}
        >
          <FormattedMessage id={'vehicleState.StandBy'} />
        </span>
      </Badge>

      {/* 任务中 */}
      <Badge
        showZero
        style={{ background: VehicleStateColor.Working }}
        count={data.workingSize || 0}
      >
        <span
          className={taskQueueStyles.vehicleStatusBadge}
          style={{ background: VehicleStateColor.Working }}
        >
          <FormattedMessage id={'vehicleState.Working'} />
        </span>
      </Badge>

      {/* 充电中 */}
      <Badge
        showZero
        style={{ background: VehicleStateColor.Charging }}
        count={data.chargingSize || 0}
      >
        <span
          className={taskQueueStyles.vehicleStatusBadge}
          style={{ background: VehicleStateColor.Charging }}
        >
          <FormattedMessage id={'vehicleState.Charging'} />
        </span>
      </Badge>

      {/* 不可用 */}
      <Badge showZero style={{ background: VehicleStateColor.Error }} count={data.unUseSize || 0}>
        <span
          className={taskQueueStyles.vehicleStatusBadge}
          style={{ background: VehicleStateColor.Error }}
        >
          <FormattedMessage id={'vehicleState.Error'} />
        </span>
      </Badge>

      {/* 未就绪 */}
      <Badge
        showZero
        style={{ background: VehicleStateColor.Offline }}
        count={data.unReadySize || 0}
      >
        <span
          className={taskQueueStyles.vehicleStatusBadge}
          style={{ background: VehicleStateColor.Offline }}
        >
          <FormattedMessage id={'vehicleState.Offline'} />
        </span>
      </Badge>
    </Row>
  );
};
export default memo(VehicleStatusOverview);
