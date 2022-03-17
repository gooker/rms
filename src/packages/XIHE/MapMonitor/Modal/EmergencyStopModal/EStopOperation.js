import React, { memo, useEffect } from 'react';
import { Checkbox, Form, Popconfirm, Switch } from 'antd';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout, isNull } from '@/utils/util';
import { changeEmergencyStopStatus } from '@/services/XIHE';

const { formItemLayout } = getFormLayout(4, 20);
const EStopOperation = (props) => {
  const { dispatch, mapId, logicAreaList, globalActive, logicActive } = props;

  function changeSectionOrLogicEStopState(checked, estopType, logicId) {
    let currentLogicActive = [...logicActive];
    let params = {
      mapId,
      estopType,
      activated: checked,
    };
    if (!isNull(logicId)) {
      params = { ...params, logicId };
      if (checked) {
        currentLogicActive.push(logicId);
      } else {
        currentLogicActive = currentLogicActive.filter((item) => item !== logicId);
      }
    }

    if (estopType === 'Section') {
      dispatch({
        type: 'monitor/saveGlobalActive',
        payload: checked,
      });
    } else {
      dispatch({
        type: 'monitor/saveLogicActive',
        payload: currentLogicActive,
      });
    }

    changeEmergencyStopStatus(params).then((result) => {
      !dealResponse(result, true);
    });
  }

  return (
    <div>
      <Form.Item {...formItemLayout} label={formatMessage({ id: 'monitor.estop.globalEStop' })}>
        <Popconfirm
          title={
            globalActive
              ? formatMessage({ id: 'monitor.estop.confirm.disableGlobal' })
              : formatMessage({ id: 'monitor.estop.confirm.enableGlobal' })
          }
          onConfirm={() => {
            changeSectionOrLogicEStopState(!globalActive, 'Section');
          }}
        >
          <Switch
            checked={globalActive}
            checkedChildren={formatMessage({ id: 'app.agv.on' })}
            unCheckedChildren={formatMessage({ id: 'app.agv.off' })}
          />
        </Popconfirm>
      </Form.Item>

      <Form.Item {...formItemLayout} label={formatMessage({ id: 'monitor.estop.logicEStop' })}>
        {logicAreaList?.map(({ id, name }) => (
          <Popconfirm
            key={id}
            title={
              logicActive.includes(id)
                ? formatMessage({ id: 'monitor.estop.confirm.disableLogic' })
                : formatMessage({ id: 'monitor.estop.confirm.enableLogic' })
            }
            onConfirm={() => {
              changeSectionOrLogicEStopState(!logicActive.includes(id), 'Logic', id);
            }}
          >
            <Checkbox key={id} checked={logicActive.includes(id)}>
              {name}
            </Checkbox>
          </Popconfirm>
        ))}
      </Form.Item>
    </div>
  );
};
export default connect(({ monitor }) => ({
  mapId: monitor?.currentMap?.id,
  logicAreaList: monitor?.currentMap?.logicAreaList || [],
  globalActive: monitor.globalActive,
  logicActive: monitor.logicActive,
}))(memo(EStopOperation));
