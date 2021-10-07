import React, { memo } from 'react';
import { Form, Switch, Popconfirm, Button, message } from 'antd';
import { formatMessage, dealResponse } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { resetCharger, clearChargerFault, switchChargerEnable } from '@/services/mixrobot';

const FormItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };

const ChargerActionTab = (props) => {
  const { data, refresh } = props;

  const chargerEnableState = data ? !data.disabled : false;

  // 切换可用状态
  async function doSwitchingChargerEnable() {
    if (!data?.hardwareId) return;
    const response = await switchChargerEnable({
      hardwareId: data.hardwareId,
      disabled: !chargerEnableState,
    });
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.monitor.modal.charger.enable.tip.failed' }));
    } else {
      message.success(formatMessage({ id: 'app.monitor.modal.charger.enable.tip.success' }));
      refresh(data.name);
    }
  }

  // 清除故障
  async function doClearingChargerFault() {
    if (!data?.hardwareId) return;
    const response = await clearChargerFault(data.id);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.monitor.modal.charger.clearFault.failed' }));
    } else {
      message.success(formatMessage({ id: 'app.monitor.modal.charger.clearFault.success' }));
    }
  }

  // 解除占用
  async function releaseCharger() {
    if (!data?.hardwareId) return;
    const response = await resetCharger(data.hardwareId);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.monitor.modal.charger.release.tip.failed' }));
    } else {
      message.success(formatMessage({ id: 'app.monitor.modal.charger.release.tip.success' }));
    }
  }

  return (
    <div>
      {/* 切换是否可用 */}
      <Form.Item
        {...FormItemLayout}
        label={formatMessage({ id: 'app.monitor.modal.charger.enable' })}
      >
        <Popconfirm
          title={formatMessage(
            { id: 'app.monitor.modal.charger.enable.confirm' },
            {
              state: chargerEnableState
                ? formatMessage({ id: 'app.chargeManger.disabled' })
                : formatMessage({ id: 'app.chargeManger.enable' }),
            },
          )}
          onConfirm={doSwitchingChargerEnable}
        >
          <Switch
            checked={chargerEnableState}
            checkedChildren={formatMessage({ id: 'app.monitor.modal.charger.enabled' })}
            unCheckedChildren={formatMessage({ id: 'app.monitor.modal.charger.disabled' })}
          />
        </Popconfirm>
      </Form.Item>

      {/* 清除故障: 只有绑定了真是充电桩才显示 */}
      {data.type ? (
        <Form.Item
          {...FormItemLayout}
          label={formatMessage({ id: 'app.monitor.modal.charger.clearFault' })}
        >
          <Button size="small" onClick={doClearingChargerFault}>
            <FormattedMessage id="app.mapView.action.clear" />
          </Button>
        </Form.Item>
      ) : null}

      {/* 解除占用: 只有绑定了真是充电桩才显示 */}
      {data.type ? (
        <Form.Item
          {...FormItemLayout}
          label={formatMessage({ id: 'app.monitor.modal.charger.releaseOccupation' })}
        >
          <Popconfirm
            title={formatMessage({ id: 'app.monitor.modal.charger.release.confirm' })}
            onConfirm={releaseCharger}
          >
            <Button size="small">
              <FormattedMessage id="app.monitor.modal.charger.release" />
            </Button>
          </Popconfirm>
        </Form.Item>
      ) : null}
    </div>
  );
};
export default memo(ChargerActionTab);
