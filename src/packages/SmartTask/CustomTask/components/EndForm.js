import React, { memo, useEffect, useState } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Col, Form, Input, Row, Switch } from 'antd';
import { ClearOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import CascadeSelect from '../FormComponent/CascadeSelect';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../customTask.module.less';

const FormLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const NoLabelFormLayout = { wrapperCol: { offset: 6, span: 18 } };
const DynamicButton = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
};

const EndForm = (props) => {
  const { form, code, type, hidden, backZones } = props;

  const [robotStandby, setRobotStandby] = useState(false); // 是否进入待命状态

  useEffect(() => {
    const fieldValue = form.getFieldValue(code);
    if (fieldValue) {
      setRobotStandby(fieldValue.robotWait);
    }
  }, []);

  return (
    <>
      <Form.Item
        hidden
        {...FormLayout}
        name={[code, 'customType']}
        initialValue={type}
        label={<FormattedMessage id='app.common.type' />}
      >
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        hidden
        {...FormLayout}
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'app.common.code' })}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>

      {/* --------------------------------------------------------------- */}
      {/* 进入待命状态 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'robotWait']}
        valuePropName={'checked'}
        initialValue={false}
        label={formatMessage({ id: 'customTask.form.robotWait' })}
        getValueFromEvent={(checked) => {
          setRobotStandby(checked);
          return checked;
        }}
      >
        <Switch />
      </Form.Item>

      {/* 无任务返回区域 */}
      <Form.List hidden={hidden} name={[code, 'backZone']} initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} className={index !== 0 ? styles.dynamicNoLabel : undefined}>
                <Form.Item
                  hidden={hidden}
                  {...(index === 0 ? FormLayout : NoLabelFormLayout)}
                  label={index === 0 ? formatMessage({ id: 'customTask.form.backZone' }) : null}
                >
                  <Row gutter={10}>
                    <Col>
                      <Form.Item noStyle {...field}>
                        <CascadeSelect data={backZones} />
                      </Form.Item>
                    </Col>
                    <Col style={{ display: 'flex', alignItems: 'center' }}>
                      {fields.length > 1 ? (
                        <Button onClick={() => remove(field.name)} style={DynamicButton}>
                          <MinusOutlined />
                        </Button>
                      ) : null}
                    </Col>
                    {index === 0 && (
                      <Col style={{ display: 'flex', alignItems: 'center' }}>
                        <ClearOutlined
                          style={{ fontSize: 18 }}
                          onClick={(ev) => {
                            if (!ev.target.checked) {
                              for (let loopIndex = fields.length; loopIndex > 0; loopIndex--) {
                                remove(loopIndex);
                              }
                            }
                          }}
                        />
                      </Col>
                    )}
                  </Row>
                </Form.Item>
              </div>
            ))}
            <Form.Item hidden={hidden} style={{ paddingLeft: 120 }}>
              <Button type="dashed" onClick={() => add()} style={{ width: 460 }}>
                <PlusOutlined />
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* 备注 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
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
