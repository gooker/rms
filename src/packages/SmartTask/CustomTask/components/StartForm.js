import React, { memo } from 'react';
import { Form, Input } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import TitleCard from '@/components/TitleCard';
import FormattedMessage from '@/components/FormattedMessage';
import VehicleSelector from '../components/VehicleSelector';
import ResourceLimit from './ResourceLimit';

const StartForm = (props) => {
  const { code, type, hidden, storageSpecification, loadSpecification, targetSource } = props;

  return (
    <>
      <Form.Item
        hidden
        name={[code, 'customType']}
        initialValue={type}
        label={formatMessage({ id: 'app.common.type' })}
      >
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        hidden
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'app.common.code' })}
        rules={[{ required: true }]}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>

      {/* --------------------------------------------------------------- */}
      {/* 分小车: 当前执行任务的指定vehicle资源-->小车/小车组/无 */}
      <Form.Item
        required
        hidden={hidden}
        name={[code, 'vehicle']}
        initialValue={{ type: 'AUTO', code: [] }}
        label={<FormattedMessage id='customTask.form.vehicle' />}
      >
        <VehicleSelector dataSource={targetSource} />
      </Form.Item>

      {/* 资源约束：customLimit */}
      <TitleCard
        hidden={hidden}
        width={640}
        title={<FormattedMessage id={'customTask.form.resourceLimit'} />}
      >
        <ResourceLimit
          hidden={hidden}
          prefix={[code, 'customLimit']}
          loadSpecification={loadSpecification}
        />
      </TitleCard>

      {/* 备注 */}
      <Form.Item
        hidden={hidden}
        name={[code, 'remark']}
        label={formatMessage({ id: 'app.common.remark' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>
    </>
  );
};
export default connect(({ customTask }) => ({
  targetSource: customTask?.targetSource,
  loadSpecification: customTask.loadSpecification,
  storageSpecification: customTask.storageSpecification,
}))(memo(StartForm));
