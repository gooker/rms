import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import CellProperty from './CellProperty';
import MapProperty from './MapProperty';
import CostProperty from './CostProperty';
import WorkStationForm from '../WorkStationForm';
import { MapSelectableSpriteType } from '@/config/consts';
import styles from '../../editorLayout.module.less';
import FormattedMessage from '@/components/FormattedMessage';
import StationForm from '@/packages/XIHE/MapEditor/PopoverPanel/StationForm';
import ChargerForm from '@/packages/XIHE/MapEditor/PopoverPanel/ChargerForm';
import DeliveryForm from '@/packages/XIHE/MapEditor/PopoverPanel/DeliveryForm';
import ElevatorForm from '@/packages/XIHE/MapEditor/PopoverPanel/ElevatorForm';

const Property = (props) => {
  const { height, selections, showMapInfo, showProp, showSelections } = props;

  function renderContent() {
    if (showMapInfo) {
      return <MapProperty />;
    }
    if (showProp) {
      const selection = selections[0];
      switch (selection.type) {
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
    if (showSelections) {
      return <span>showSelections</span>;
    }
  }

  return (
    <div style={{ height }} className={styles.categoryPanel}>
      {renderContent()}
    </div>
  );
};
export default connect(({ editor }) => ({
  selections: editor.selections,
  showMapInfo: editor.selections.length === 0,
  showProp: editor.selections.length === 1,
  showSelections: editor.selections.length > 1,
}))(memo(Property));
