import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import cloneDeep from 'lodash/cloneDeep';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
} from 'antd';
import {
  ClearOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import VehicleSelector from '../CustomTask/components/VehicleSelector';
import BackZoneSelector from '@/packages/SmartTask/CustomTask/components/BackZoneSelector';
import { CustomNodeTypeFieldMap } from '@/packages/SmartTask/CustomTask/customTaskConfig';
import VehicleVariable from '../QuickTask/component/VehicleVariable';
import TargetSelector from '@/packages/SmartTask/CustomTask/components/TargetSelector';
import { getInitialTaskSteps } from '../CustomTask/customTaskUtil';
import { formatMessage, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../CustomTask/customTask.module.less';
import { forIn } from 'lodash';

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
const NoLabelFormLayout = { wrapperCol: { offset: 4, span: 20 } };
const { Option } = Select;
const DynamicButton = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
};

const reversedModelTypeFieldMap = {};
Object.keys(CustomNodeTypeFieldMap).forEach((key) => {
  const value = CustomNodeTypeFieldMap[key];
  reversedModelTypeFieldMap[value] = key;
});

const EditVaribleModal = (props) => {
  const { data, modelTypes, customTypes, visible, onCancel, onSubmit } = props;

  const [form] = Form.useForm();

  function validateVehicle(_, value) {
    if (value.type === 'AUTO') {
      return Promise.resolve();
    } else {
      if (value.code.length > 0) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(formatMessage({ id: 'customTask.require.vehicle' })));
    }
  }

  function validateTarget(_, value) {
    if (isNull(value)) {
      return Promise.reject(new Error(formatMessage({ id: 'customTask.require.target' })));
    }
    return Promise.resolve();
  }

  function renderPanelContent(taskCode, content) {
    const initialTaskSteps = getInitialTaskSteps();
    const body = [];
    // 目标点(target)一定存在, 分车和货架角度可能不存在
    // 数据转换: 因为目标点和货架角度都属于同一个子任务类型
    let { customStart, customActions, customEnd } = content;

    // 渲染"任务开始"
    if (customStart) {
      const field = 'robot';
      const { customType, robot } = customStart;

      const currentSteps = find(initialTaskSteps, { type: customType });
      body.push(
        <Divider key={'customStart'} orientation="left">
          {currentSteps?.label ?? customType}
        </Divider>,
      );
      body.push(
        // 分车
        <Form.Item
          {...formItemLayout}
          key={`${taskCode}@@${field}`}
          name={`${taskCode}@@${field}`}
          initialValue={{ type: robot?.type ?? 'AUTO', code: robot?.code ?? [] }}
          label={<FormattedMessage id="customTask.form.vehicle" />}
          rules={[{ validator: validateVehicle }]}
        >
          <VehicleVariable />
          {/* <VehicleSelector /> */}
        </Form.Item>,
      );
    }

    // 渲染"子任务“
    Object.keys(customActions).forEach((task, index) => {
      const { code, name, targetAction = {} } = customActions[task];

      let specifyLoadAngle = isNull(targetAction?.operatorAngle);
      const field = 'targetAction';
      const order = 'target';
      const order1 = 'loadAngle';

      body.push(
        <Divider orientation="left" key={index}>
          {name ?? formatMessage({ id: 'customTask.type.ACTION' })}
        </Divider>,
      );
      body.push(
        <>
          <Form.Item
            {...formItemLayout}
            key={`${taskCode}@@${code}@@${field}@@${order}`}
            name={`${taskCode}@@${code}@@${field}@@${order}`}
            // initialValue={{
            //   type: targetAction?.target?.type,
            //   code: targetAction?.target?.code ?? [],
            // }}
            initialValue={targetAction?.target}
            label={formatMessage({ id: 'customTask.form.target' })}
            rules={[{ validator: validateTarget }]}
            getValueFromEvent={(value) => {
              // return value.type;
            }}
          >
            <TargetSelector form={form} />
          </Form.Item>
          {['ROTATE', 'ROTATE_GROUP'].includes(targetAction?.target?.type) && (
            <Form.Item
              {...formItemLayout}
              label={formatMessage({
                id: specifyLoadAngle ? 'customTask.form.podAngle' : 'customTask.form.podSide',
              })}
            >
              <Row gutter={16}>
                <Col>
                  <Form.Item
                    noStyle
                    name={`${taskCode}@@${code}@@${field}@@${order1}`}
                    initialValue={targetAction?.loadAngle}
                  >
                    {specifyLoadAngle ? (
                      <InputNumber addonAfter="°" />
                    ) : (
                      <Select style={{ width: 207 }}>
                        <Select.Option value={0}>
                          <FormattedMessage id={'app.pod.side.A'} />
                        </Select.Option>
                        <Select.Option value={90}>
                          <FormattedMessage id={'app.pod.side.B'} />
                        </Select.Option>
                        <Select.Option value={180}>
                          <FormattedMessage id={'app.pod.side.C'} />
                        </Select.Option>
                        <Select.Option value={270}>
                          <FormattedMessage id={'app.pod.side.D'} />
                        </Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col style={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={specifyLoadAngle}
                    disabled
                    // onChange={(evt) => {
                    //   setSpecifyLoadAngle(evt.target.checked)
                    // }}
                  >
                    指定角度
                  </Checkbox>
                </Col>
              </Row>
            </Form.Item>
          )}
        </>,
      );
    });

    // 渲染任务结束
    if (customEnd) {
      const { backZone, heavyBackZone, vehicleNeedCharge, customType, code } = customEnd;

      const field = 'heavyBackZone';
      const field1 = 'backZone';
      const field2 = 'vehicleNeedCharge';
      const currentSteps = find(initialTaskSteps, { type: customType });

      body.push(
        <Divider key={'customEnd'} orientation="left">
          {currentSteps?.label ?? customType}
        </Divider>,
      );
      body.push(
        <>
          {/* 重车返回区域 */}
          <Form.Item
            {...formItemLayout}
            label={formatMessage({ id: 'customTask.form.heavyBackZone' })}
          >
            <Form.List
              name={[`${taskCode}@@${field}`, 'heavyBackZone']}
              initialValue={heavyBackZone}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Row key={field.key} gutter={10} style={{ marginBottom: 16 }}>
                      <Col span={22}>
                        <Form.Item noStyle {...field}>
                          <BackZoneSelector divstyle={{ display: 'flex' }} />
                        </Form.Item>
                      </Col>
                      {/* style={{ display: 'flex', alignItems: 'center' }} */}
                      <Col span={2}>
                        <Button onClick={() => remove(field.name)} style={DynamicButton}>
                          <MinusOutlined />
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} style={{ width: 460 }}>
                    <PlusOutlined />
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>

          {/* 返回区域 */}
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'customTask.form.backZone' })}>
            <Form.List name={[`${taskCode}@@${field1}`, 'backZone']} initialValue={backZone}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Row key={field.key} gutter={10} style={{ marginBottom: 16 }}>
                      <Col span={22}>
                        <Form.Item noStyle {...field}>
                          <BackZoneSelector divstyle={{ display: 'flex' }} />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button onClick={() => remove(field.name)} style={DynamicButton}>
                          <MinusOutlined />
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} style={{ width: 460 }}>
                    <PlusOutlined />
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>

          {/* 自动充电 */}
          <Form.Item
            {...formItemLayout}
            name={[`${taskCode}@@${field2}`, 'heavyBackZone']}
            initialValue={vehicleNeedCharge}
            valuePropName={'checked'}
            label={formatMessage({ id: 'customTask.form.vehicleNeedCharge' })}
          >
            <Switch />
          </Form.Item>
        </>,
      );
    }

    return body;
  }

  function submit() {
    form.validateFields().then((values) => {
      // 用value的值替换data对应的值并返回
      const response = cloneDeep(data); // 深度克隆
      response?.forEach((customTask) => {
        const { code, ...variables } = customTask;

        // start
        const customStartValue = values[`${code}@@robot`];
        if (customStartValue.type !== 'AUTO') {
          variables.customStart.robot = customStartValue;
        }

        //end
        variables.customStart.backZone = values[`${code}@@backZone`];
        variables.customStart.heavyBackZone = values[`${code}@@heavyBackZone`];

        //action
        const { customActions } = variables;
        forIn(values, (value, key) => {
          if (key.indexOf(code) > -1 && key.indexOf('targetAction') > -1) {
            const actionCode = key.split('@@')[1];
            customActions[actionCode].targetAction.loadAngle =
              values[`${code}@@${actionCode}@@targetAction@@loadAngle`];
            customActions[actionCode].targetAction.target =
              values[`${code}@@${actionCode}@@targetAction@@target`];
          }
        });
      });
      console.log(response);
      onSubmit(response);
    });
  }

  return (
    <Modal
      destroyOnClose
      mask={false}
      width={710}
      style={{ top: 30 }}
      visible={visible}
      onCancel={onCancel}
      onOk={submit}
      okText={formatMessage({ id: 'app.button.update' })}
      title={formatMessage({ id: 'taskTrigger.editVariable' })}
    >
      <Form form={form} labelWrap>
        {Array.isArray(data) &&
          data.map(({ code, ...customTask }) => {
            return (
              <Card hoverable key={code} title={customTask.name} style={{ marginTop: 13 }}>
                {renderPanelContent(code, customTask)}
                {/* <Form.Item hidden key={`${code}`} name={`customCode`} initialValue={code} /> */}
              </Card>
            );
          })}
      </Form>
    </Modal>
  );
};
export default connect(({ taskTriger }) => ({
  modelTypes: taskTriger.modelTypes,
  customTypes: taskTriger.customTypes,
}))(memo(EditVaribleModal));
