import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import cloneDeep from 'lodash/cloneDeep';
import isPlainObject from 'lodash/isPlainObject';
import { Button, Card, Col, Divider, Form, Modal, Row, Select } from 'antd';
import { ClearOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons';
import CascadeSelect from '../CustomTask/FormComponent/CascadeSelect';
import ModelSelection from '../CustomTask/FormComponent/ModelSelection';
import { CustomNodeTypeFieldMap } from '@/packages/SmartTask/CustomTask/customTaskConfig';
import { formatMessage, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../CustomTask/customTask.module.less';

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
  const { data, customTaskList, modelTypes, customTypes, visible, onCancel, onSubmit, backZones } =
    props;

  const [form] = Form.useForm();

  // 分车数据
  const OptionsData = [
    {
      code: 'AGV',
      name: <FormattedMessage id='customTask.form.SPECIFY_AGV' />,
      value: modelTypes?.AGV.options ?? {},
    },
    {
      code: 'AGV_GROUP',
      name: <FormattedMessage id='customTask.form.SPECIFY_GROUP' />,
      value: modelTypes?.AGV_GROUP.options ?? {},
    },
  ];

  function validateTarget(_, value) {
    if (!value || !isNull(value.type)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'customTask.require.target' })));
  }

  function renderPanelContent(taskCode, content) {
    const body = [];
    // 目标点(target)一定存在, 分车和货架角度可能不存在
    // 数据转换: 因为目标点和货架角度都属于同一个子任务类型
    let customStart = null;
    let customEnd = null;
    const customActions = [];
    content.forEach((item) => {
      if (item.taskType === 'customStart') {
        customStart = item;
      } else if (item.taskType === 'customEnd') {
        customEnd = item;
      } else {
        customActions.push(item);
      }
    });
    const groupCustomActions = groupBy(customActions, 'index');

    // 渲染"任务开始"
    if (customStart) {
      const { type, code } = customStart.resources[0];
      body.push(
        <Divider key={'customStart'} orientation="left">
          {customTypes[reversedModelTypeFieldMap[customStart.taskType]]}
        </Divider>,
      );
      body.push(
        // 分车
        <Form.Item
          {...formItemLayout}
          key={`${taskCode}@@${customStart.field}`}
          name={`${taskCode}@@${customStart.field}`}
          initialValue={{ type, code }}
          label={<FormattedMessage id='customTasks.form.robot' />}
        >
          <CascadeSelect data={OptionsData} />
        </Form.Item>,
      );
    }

    // 渲染"动作与路径"
    Object.keys(groupCustomActions).forEach((order, index, list) => {
      const groupValue = groupCustomActions[order];
      const showIndex = list.length > 1;
      body.push(
        <Divider orientation="left" key={order}>
          {`${customTypes[reversedModelTypeFieldMap.customActions]}${
            showIndex ? `[${order}]` : ''
          }`}
        </Divider>,
      );
      groupValue.forEach((groupItem) => {
        if (groupItem.field === 'target') {
          const { type, code } = groupItem.resources[0];
          body.push(
            <Form.Item
              {...formItemLayout}
              key={`${taskCode}@@${groupItem.field}@@${order}`}
              name={`${taskCode}@@${groupItem.field}@@${order}`}
              label={formatMessage({ id: 'app.form.target' })}
              initialValue={{ type, code }}
              rules={[{ validator: validateTarget }]}
            >
              <ModelSelection
                modelTypes={modelTypes}
                exclude={['AGV', 'AGV_GROUP']}
                disabled={false}
              />
            </Form.Item>,
          );
        }
        if (groupItem.field === 'podAngle') {
          // pod特殊 没有resources
          body.push(
            <Form.Item
              {...formItemLayout}
              key={`${taskCode}@@${groupItem.field}@@${order}`}
              name={`${taskCode}@@${groupItem.field}@@${order}`}
              initialValue={groupItem.value}
              label={formatMessage({ id: 'app.pod.direction' })}
            >
              {/* <AngleSelector
                getAngle
                width={220}
                addonLabel={{
                  0: formatMessage({ id: 'app.pod.side.A' }),
                  90: formatMessage({ id: 'app.pod.side.B' }),
                  180: formatMessage({ id: 'app.pod.side.C' }),
                  270: formatMessage({ id: 'app.pod.side.D' }),
                }}
              /> */}
              <Select style={{ width: 220 }} mode="multiple" allowClear>
                <Option value={'0'}>
                  <FormattedMessage id="app.pod.side.A" />
                </Option>
                <Option value={'90'}>
                  <FormattedMessage id="app.pod.side.B" />
                </Option>
                <Option value={'180'}>
                  <FormattedMessage id="app.pod.side.C" />
                </Option>
                <Option value={'270'}>
                  <FormattedMessage id="app.pod.side.D" />
                </Option>
              </Select>
            </Form.Item>,
          );
        }
      });
    });

    // 渲染 结束
    // 渲染任务结束
    if (customEnd) {
      body.push(
        <Divider key={'customEnd'} orientation="left">
          {customTypes[reversedModelTypeFieldMap[customEnd.taskType]]}
        </Divider>,
      );
      body.push(
        // 无任务返回区域
        <Form.List
          name={[`${taskCode}@@${customEnd.field}`, 'resources']}
          initialValue={customEnd.resources}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div
                  key={field.key}
                  className={index !== 0 ? styles.editVaribleNoLabel : undefined}
                >
                  <Form.Item
                    {...(index === 0 ? formItemLayout : NoLabelFormLayout)}
                    label={index === 0 ? formatMessage({ id: 'customTasks.form.backZone' }) : null}
                  >
                    <Row gutter={10}>
                      <Col>
                        <Form.Item noStyle {...field}>
                          <CascadeSelect data={backZones} />
                        </Form.Item>
                      </Col>
                      <Col style={{ display: 'flex', alignItems: 'center' }}>
                        {fields.length > 1 ? (
                          // <Button  style={DynamicButton}>
                          <MinusCircleOutlined onClick={() => remove(field.name)} />
                        ) : // </Button>
                        null}
                      </Col>
                      {index === 0 && (
                        <Col style={{ display: 'flex', alignItems: 'center' }}>
                          <ClearOutlined
                            style={{ fontSize: 16 }}
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
              <Form.Item style={{ paddingLeft: 100 }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  className={DynamicButton}
                  style={{ width: 460 }}
                >
                  <DeleteOutlined />
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>,
      );
    }

    return body;
  }

  function submit() {
    form.validateFields().then((values) => {
      // 用value的值替换data对应的值并返回
      const response = cloneDeep(data); // 深度克隆
      Object.keys(response).forEach((taskCode) => {
        const variables = response[taskCode];
        variables.forEach((variable) => {
          const fieldValue =
            values[
              `${taskCode}@@${variable.field}${isNull(variable.index) ? '' : `@@${variable.index}`}`
            ];

          // 货架方向是一个简单的数字 多选
          if (variable.field === 'podAngle') {
            variable.type = 'podAngle';
            variable.value = fieldValue;
          } else if (variable.field === 'customEnd') {
            variable.type = null;
            variable.value = null;
            variable.resources = fieldValue.resources;
          } else {
            variable.type = null;
            variable.value = null;
            variable.resources = [
              {
                type: fieldValue?.type,
                code: fieldValue?.code,
              },
            ];
          }
        });
      });
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
      title={formatMessage({ id: 'app.taskTrigger.editVariable' })}
    >
      <Form form={form}>
        {isPlainObject(data) &&
          Object.keys(data).map((code) => {
            const customTask = find(customTaskList, { code });
            return (
              <Card hoverable key={code} title={customTask.name} style={{ marginTop: 13 }}>
                {renderPanelContent(code, data[code])}
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
  customTaskList: taskTriger.customTaskList,
}))(memo(EditVaribleModal));
