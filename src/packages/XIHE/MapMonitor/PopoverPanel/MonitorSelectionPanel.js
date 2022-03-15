import React, { memo } from 'react';
import { Collapse, Switch } from 'antd';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';
import { MonitorSelectableSpriteType } from '@/config/consts';

const { Panel } = Collapse;

const MonitorSelectionPanel = (props) => {
  const { dispatch, height, selections, selectableType } = props;

  function filterSelectable(event, type) {
    event.stopPropagation();
    dispatch({ type: 'monitor/updateSelectableType', payload: type });
  }

  function renderExtra(key) {
    return (
      <Switch
        checkedChildren={<FormattedMessage id={'monitor.select.enable'} />}
        unCheckedChildren={<FormattedMessage id={'monitor.select.disable'} />}
        checked={selectableType.includes(key)}
        onChange={(checked, event) => {
          filterSelectable(event, key);
        }}
      />
    );
  }

  return (
    <div style={{ height, width: 350, right: 65 }} className={commonStyles.categoryPanel}>
      <div>
        <FormattedMessage id={'editor.tools.selections'} />
      </div>
      <div>
        <Collapse accordion>
          <Panel key="AGV" header={<FormattedMessage id={'app.agv'} />} extra={renderExtra('AGV')}>
            <div>123</div>
          </Panel>
          <Panel
            key={MonitorSelectableSpriteType.LatentPod}
            header={<FormattedMessage id={'app.pod'} />}
            extra={renderExtra(MonitorSelectableSpriteType.LatentPod)}
          >
            <div>123</div>
          </Panel>
          <Panel
            key={MonitorSelectableSpriteType.ToteRack}
            header={<FormattedMessage id={'app.tote.rack'} />}
            extra={renderExtra(MonitorSelectableSpriteType.ToteRack)}
          >
            <div>123</div>
          </Panel>
          <Panel
            key={MonitorSelectableSpriteType.Station}
            header={<FormattedMessage id={'app.map.station'} />}
            extra={renderExtra(MonitorSelectableSpriteType.Station)}
          >
            <div>123</div>
          </Panel>
          <Panel
            key={MonitorSelectableSpriteType.WorkStation}
            header={<FormattedMessage id={'app.map.workStation'} />}
            extra={renderExtra(MonitorSelectableSpriteType.WorkStation)}
          >
            <div>123</div>
          </Panel>
          <Panel
            key={MonitorSelectableSpriteType.Charger}
            header={<FormattedMessage id={'app.map.charger'} />}
            extra={renderExtra(MonitorSelectableSpriteType.Charger)}
          >
            <div>123</div>
          </Panel>
          <Panel
            key={MonitorSelectableSpriteType.Delivery}
            header={<FormattedMessage id={'app.map.delivery'} />}
            extra={renderExtra(MonitorSelectableSpriteType.Delivery)}
          >
            <div>123</div>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};
export default connect(({ monitor }) => ({
  selections: monitor.selections,
  selectableType: monitor.selectableType,
}))(memo(MonitorSelectionPanel));
