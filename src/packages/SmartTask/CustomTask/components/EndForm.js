import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Col, Form, Input, Row, Switch } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import BackZoneSelector from '@/packages/SmartTask/CustomTask/components/BackZoneSelector';

const DynamicButton = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
};

const EndForm = (props) => {
  const { code, type, hidden, backZones } = props;

  return (
    <>
      <Form.Item
        hidden
        name={[code, 'customType']}
        initialValue={type}
        label={<FormattedMessage id='app.common.type' />}
      >
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        hidden
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'app.common.code' })}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>

      {/* --------------------------------------------------------------- */}
      {/* 重车返回区域 */}
      <Form.Item hidden={hidden} label={formatMessage({ id: 'customTask.form.heavyBackZone' })}>
        <Form.List name={[code, 'heavyBackZone']} initialValue={[]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Row key={field.key} gutter={10} style={{ marginBottom: 16 }}>
                  <Col>
                    <Form.Item noStyle {...field}>
                      <BackZoneSelector />
                    </Form.Item>
                  </Col>
                  <Col style={{ display: 'flex', alignItems: 'center' }}>
                    <Button onClick={() => remove(field.name)} style={DynamicButton}>
                      <MinusOutlined />
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button type='dashed' onClick={() => add()} style={{ width: 460 }}>
                <PlusOutlined />
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>

      {/* 返回区域 */}
      <Form.Item hidden={hidden} label={formatMessage({ id: 'customTask.form.backZone' })}>
        <Form.List name={[code, 'backZone']} initialValue={[]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Row key={field.key} gutter={10} style={{ marginBottom: 16 }}>
                  <Col>
                    <Form.Item noStyle {...field}>
                      <BackZoneSelector />
                    </Form.Item>
                  </Col>
                  <Col style={{ display: 'flex', alignItems: 'center' }}>
                    <Button onClick={() => remove(field.name)} style={DynamicButton}>
                      <MinusOutlined />
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button type='dashed' onClick={() => add()} style={{ width: 460 }}>
                <PlusOutlined />
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>

      {/* 自动充电 */}
      <Form.Item
        hidden={hidden}
        name={[code, 'vehicleNeedCharge']}
        initialValue={true}
        valuePropName={'checked'}
        label={formatMessage({ id: 'customTask.form.vehicleNeedCharge' })}
      >
        <Switch />
      </Form.Item>

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
  backZones: customTask.backZones,
}))(memo(EndForm));
