import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import CellProperty from './CellProperty';
import MapProperty from './MapProperty';
import CostProperty from './CostProperty';
import StationForm from '../StationForm';
import ChargerForm from '../ChargerForm';
import DeliveryForm from '../DeliveryForm';
import ElevatorForm from '../ElevatorForm';
import WorkStationForm from '../WorkStationForm';
import IntersectionForm from '../IntersectionForm';
import { MapSelectableSpriteType } from '@/config/consts';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';

const Property = (props) => {
  const { height, lockedProps, showMapInfo, categoryProps } = props;

  function renderContent() {
    const showProp = !!categoryProps;
    if (showMapInfo) {
      return <MapProperty />;
    }
    if (showProp) {
      const selection = categoryProps;
      const propCategory = lockedProps || selection.type;
      switch (propCategory) {
        case MapSelectableSpriteType.CELL:
          return <CellProperty data={selection} />;
        case MapSelectableSpriteType.ROUTE:
          return <CostProperty data={selection} />;
        case MapSelectableSpriteType.WORKSTATION: {
          const workStationData = selection.$$formData;
          return (
            <>
              <div>
                <FormattedMessage id={'app.map.workStation'} />
                <FormattedMessage id={'app.common.prop'} />
              </div>
              <div>
                <WorkStationForm flag={workStationData.flag} workStation={workStationData} />
              </div>
            </>
          );
        }
        case MapSelectableSpriteType.STATION: {
          const stationData = selection.$$formData;
          return (
            <>
              <div>
                <FormattedMessage id={'app.map.station'} />
                <FormattedMessage id={'app.common.prop'} />
              </div>
              <div>
                <StationForm flag={stationData.flag} station={stationData} />
              </div>
            </>
          );
        }
        case MapSelectableSpriteType.CHARGER: {
          const chargerData = selection.$$formData;
          return (
            <>
              <div>
                <FormattedMessage id={'app.map.charger'} />
                <FormattedMessage id={'app.common.prop'} />
              </div>
              <div>
                <ChargerForm flag={chargerData.flag} charger={chargerData} />
              </div>
            </>
          );
        }
        case MapSelectableSpriteType.INTERSECTION: {
          const intersectionData = selection.$$formData;
          return (
            <>
              <div>
                <FormattedMessage id={'app.map.intersection'} />
                <FormattedMessage id={'app.common.prop'} />
              </div>
              <div>
                <IntersectionForm flag={intersectionData.flag} intersection={intersectionData} />
              </div>
            </>
          );
        }
        case MapSelectableSpriteType.DELIVERY: {
          const deliveryData = selection.$$formData;
          return (
            <>
              <div>
                <FormattedMessage id={'app.map.delivery'} />
                <FormattedMessage id={'app.common.prop'} />
              </div>
              <div>
                <DeliveryForm flag={deliveryData.flag} delivery={deliveryData} />
              </div>
            </>
          );
        }
        case MapSelectableSpriteType.ELEVATOR: {
          const elevatorData = selection.$$formData;
          return (
            <>
              <div>
                <FormattedMessage id={'app.map.elevator'} />
                <FormattedMessage id={'app.common.prop'} />
              </div>
              <div>
                <ElevatorForm flag={elevatorData.flag} elevator={elevatorData} />
              </div>
            </>
          );
        }
        default:
          return null;
      }
    }
  }

  const component = renderContent();

  if (component) {
    return (
      <div style={{ height }} className={commonStyles.categoryPanel}>
        {component}
      </div>
    );
  }
  return null;
};
export default connect(({ editor }) => ({
  lockedProps: editor.lockedProps,
  categoryProps: editor.categoryProps,
  showMapInfo: editor.selections.length === 0,
}))(memo(Property));
