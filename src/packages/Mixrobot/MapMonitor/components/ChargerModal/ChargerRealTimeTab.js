import React, { memo } from 'react';
import { Form } from 'antd';
import { formatMessage } from '@/utils/Lang';
import Dictionary from '@/utils/Dictionary';
import styles from './chargerModal.less';
import { getSuffix } from '@/utils/utils';

const FormItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };

const ChargerRealTimeTab = (props) => {
  const { data } = props;

  return (
    <div>
      <Form.Item {...FormItemLayout} label={formatMessage({ id: 'app.chargeManger.status' })}>
        <span className={styles.valueStyle}>
          {data?.status ? formatMessage({ id: Dictionary('chargerStatus', data.status) }) : '-'}
        </span>
      </Form.Item>
      <Form.Item
        {...FormItemLayout}
        label={formatMessage({ id: 'app.monitor.modal.charger.batteryAdaptation' })}
      >
        <span className={styles.valueStyle}>
          {data?.batteryType
            ? formatMessage({ id: Dictionary('batteryType', data.batteryType) })
            : '-'}
        </span>
      </Form.Item>
      <Form.Item
        {...FormItemLayout}
        label={formatMessage({ id: 'app.monitor.modal.charger.temperature' })}
      >
        <span className={styles.valueStyle}>
          {data?.chargerTemperature ? getSuffix(data.chargerTemperature, '°c') : '-'}
        </span>
      </Form.Item>
      <Form.Item
        {...FormItemLayout}
        label={formatMessage({ id: 'app.monitor.modal.charger.reportStatus' })}
      >
        <span className={styles.valueStyle}>
          {data?.chargerReportStatus
            ? formatMessage({ id: Dictionary('chargerStatus', data.chargerReportStatus) })
            : '-'}
        </span>
      </Form.Item>
      <Form.Item
        {...FormItemLayout}
        label={formatMessage({ id: 'app.chargeManger.currentElectricity' })}
      >
        <span className={styles.valueStyle}>
          {data?.currentElectricity ? getSuffix((data.currentElectricity || 0) / 10, 'A') : '-'}
        </span>
      </Form.Item>
      <Form.Item
        {...FormItemLayout}
        label={formatMessage({ id: 'app.chargeManger.MaxiChargeFlow' })}
      >
        <span className={styles.valueStyle}>
          {data?.maxChargerElectricity
            ? getSuffix((data.maxChargerElectricity || 0) / 10, 'A')
            : '-'}
        </span>
      </Form.Item>
    </div>
  );
};
export default memo(ChargerRealTimeTab);
