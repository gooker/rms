import React, { Fragment, memo, useEffect, useState } from 'react';
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Select, Space, Switch } from 'antd';
import { DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { find, groupBy } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { extractRoutes, fillFormValueToAction, formatMessage, isNull, isStrictNull } from '@/utils/util';
import TargetSelector from '../components/TargetSelector';
import TaskResourceLock from '../FormComponent/TaskResourceLock';
import ProgramingConfiguer from '@/components/ProgramingConfiguer';
import FormattedMessage from '@/components/FormattedMessage';
import TitleCard from '@/components/TitleCard';

const SubTaskForm = (props) => {
  const { hidden, form, code, type, updateTab, routes, programing, preTasks } = props;
  const groupedRoutes = groupBy(routes, 'logicId');
  const isPre = !!find(preTasks, { code });

  const [target, setTarget] = useState(null); // 目标区域
  const [operationType, setOperationType] = useState(null); // 路径配置函数操作类型
  const [specifyLoadAngle, setSpecifyLoadAngle] = useState(true); // 是否指定载具角度

  // ************** 关键点动作配置 ************** //
  const [, rerender] = useState({}); // 用于触发组件重渲染
  const [namePath, setNamePath] = useState(null); // 正在编辑的条目的namePath
  const [actionList, setActionList] = useState(null); // 正在编辑的关键点动作列表
  const [actionVisible, setActionVisible] = useState(false); // 配置关键点动作弹窗

  useEffect(() => {
    const { targetAction } = form.getFieldValue(code);
    const { operatorAngle } = targetAction;
    setSpecifyLoadAngle(isNull(operatorAngle));
    setTarget(targetAction?.target?.type);
  }, []);

  function renderPathCodeOptions() {
    return Object.keys(groupedRoutes).map((logicId) => {
      const label = `${formatMessage({ id: 'app.map.logicArea' })}: ${
        groupedRoutes[logicId][0].logicName
      }`;
      return (
        <Select.OptGroup key={logicId} label={label}>
          {groupedRoutes[logicId].map((route) => (
            <Select.Option key={route.code} value={`${route.logicId}-${route.code}`}>
              {route.name}
            </Select.Option>
          ))}
        </Select.OptGroup>
      );
    });
  }

  function validateTarget(_, value) {
    if (isNull(value)) {
      return Promise.reject(new Error(formatMessage({ id: 'customTask.require.target' })));
    }
    return Promise.resolve();
  }

  // 获取某个字段的值
  function getActionConfig(_namePath) {
    let actionConfigList = form.getFieldValue(_namePath);
    if (!Array.isArray(actionConfigList)) {
      actionConfigList = [];
    }
    return actionConfigList;
  }

  // 清空某个字段的值
  function clearPointAction(_namePath) {
    let setter = null;
    for (const pathItem of _namePath.reverse()) {
      setter = { [pathItem]: setter };
    }
    form.setFieldsValue(setter);
    rerender({});
  }

  // 开始配置动作
  function configKeyPointAction(_namePath) {
    let actionConfigList = form.getFieldValue(_namePath);
    if (Array.isArray(actionConfigList)) {
      // 兼容组件内部逻辑
      actionConfigList = fillFormValueToAction(actionConfigList, programing);
      setActionList({ actions: actionConfigList });
    } else {
      setActionList(null);
    }
    setActionVisible(true);
    setNamePath(_namePath);
  }

  // 保存配置弹窗中的内容
  function saveKeyPointAction(value) {
    let setter = value.length === 0 ? null : value;
    for (const pathItem of namePath.reverse()) {
      setter = { [pathItem]: setter };
    }
    form.setFieldsValue(setter);
  }

  function renderActionConfigButton(_namePath) {
    const existConfigs = getActionConfig(_namePath);
    if (existConfigs.length === 0) {
      return (
        <Button
          onClick={() => {
            configKeyPointAction(_namePath);
          }}
        >
          <Space>
            <SettingOutlined />
            {existConfigs.length}
          </Space>
        </Button>
      );
    } else {
      return (
        <Space>
          <Button
            onClick={() => {
              configKeyPointAction(_namePath);
            }}
          >
            <Space>
              <SettingOutlined />
              {existConfigs.length}
            </Space>
          </Button>
          <Button
            onClick={() => {
              clearPointAction(_namePath);
            }}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      );
    }
  }

  function renderPreTaskOptions() {
    return preTasks.map(({ code, label }) => (
      <Select.Option key={code} value={code}>
        {label}
      </Select.Option>
    ));
  }

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

      {/* 子任务编码 */}
      <Form.Item
        hidden
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'app.common.code' })}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>

      {/* --------------------------------------------------------------- */}
      {!isPre && (
        <Form.Item
          hidden={hidden}
          name={[code, 'preActionCodes']}
          label={formatMessage({ id: 'app.task.pre' })}
          initialValue={[]}
        >
          <Select mode={'multiple'} style={{ width: 300 }}>
            {renderPreTaskOptions()}
          </Select>
        </Form.Item>
      )}

      <Form.Item
        hidden={hidden}
        name={[code, 'name']}
        label={formatMessage({ id: 'customTask.form.subTaskName' })}
        getValueFromEvent={({ target: { value } }) => {
          let name = value;
          if (isStrictNull(value)) {
            name = formatMessage({ id: 'customTask.type.ACTION' });
          }
          updateTab(code, name);
          return value;
        }}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>

      {/* 目标区域 */}
      <Form.Item
        required
        hidden={hidden}
        name={[code, 'targetAction', 'target']}
        label={formatMessage({ id: 'customTask.form.target' })}
        rules={[{ validator: validateTarget }]}
        getValueFromEvent={(value) => {
          setTarget(value.type);
          return value;
        }}
      >
        <TargetSelector vehicleSelection={form.getFieldValue(['START', 'vehicle'])} />
      </Form.Item>

      {/* 载具方向 */}
      {['ROTATE', 'ROTATE_GROUP'].includes(target) ? (
        <Form.Item
          hidden={hidden}
          label={formatMessage({
            id: specifyLoadAngle ? 'customTask.form.podAngle' : 'customTask.form.podSide',
          })}
        >
          <Row gutter={16}>
            <Col>
              <Form.Item
                noStyle
                hidden={hidden}
                name={[code, 'targetAction', 'loadAngle']}
                initialValue={null}
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
                onChange={(evt) => setSpecifyLoadAngle(evt.target.checked)}
              >
                <FormattedMessage id={'customTask.form.specifyAngle'} />
              </Checkbox>
            </Col>
          </Row>
        </Form.Item>
      ) : null}

      {/* 操作者方向 */}
      {['ROTATE', 'ROTATE_GROUP'].includes(target) && !specifyLoadAngle ? (
        <Form.Item
          hidden={hidden}
          name={[code, 'targetAction', 'operatorAngle']}
          initialValue={null}
          label={formatMessage({ id: 'customTask.form.operatorDirection' })}
        >
          <Select style={{ width: 207 }}>
            <Select.Option value={90}>
              <FormattedMessage id={'app.common.targetCell'} />
              <FormattedMessage id={'app.direction.topSide'} />
            </Select.Option>
            <Select.Option value={0}>
              <FormattedMessage id={'app.common.targetCell'} />
              <FormattedMessage id={'app.direction.rightSide'} />
            </Select.Option>
            <Select.Option value={270}>
              <FormattedMessage id={'app.common.targetCell'} />
              <FormattedMessage id={'app.direction.bottomSide'} />
            </Select.Option>
            <Select.Option value={180}>
              <FormattedMessage id={'app.common.targetCell'} />
              <FormattedMessage id={'app.direction.leftSide'} />
            </Select.Option>
          </Select>
        </Form.Item>
      ) : null}

      {/* 资源锁: 前置任务不需要配置 */}
      {!isPre && (
        <Form.Item
          hidden={hidden}
          name={[code, 'lockTime']}
          label={formatMessage({ id: 'customTask.lock.resourceLock' })}
        >
          <TaskResourceLock />
        </Form.Item>
      )}

      {/* 行驶速度: 前置任务不需要配置 */}
      {!isPre && (
        <Form.Item
          hidden={hidden}
          name={[code, 'speed']}
          label={formatMessage({ id: 'customTask.form.speed' })}
          initialValue={4}
        >
          <InputNumber />
        </Form.Item>
      )}

      {/* 路线策略 */}
      <TitleCard
        hidden={hidden}
        width={746}
        title={<FormattedMessage id={'customTask.form.pathStrategy'} />}
      >
        <Fragment>
          {/* 地图路线 */}
          <Form.Item
            hidden={hidden}
            name={[code, 'pathCode']}
            label={formatMessage({ id: 'customTask.form.pathCode' })}
          >
            <Select style={{ width: 200 }}>{renderPathCodeOptions()}</Select>
          </Form.Item>

          {/* 自动切换路线 */}
          <Form.Item
            hidden={hidden}
            name={[code, 'canReCalculatePath']}
            initialValue={true}
            valuePropName={'checked'}
            label={formatMessage({ id: 'customTask.form.canReCalculatePath' })}
          >
            <Switch
              checkedChildren={formatMessage({ id: 'app.button.turnOn' })}
              unCheckedChildren={formatMessage({ id: 'app.button.turnOff' })}
            />
          </Form.Item>
        </Fragment>
      </TitleCard>

      {/* 路径函数配置 */}
      <Form.Item
        hidden={hidden}
        name={[code, 'pathProgramming']}
        label={formatMessage({ id: 'customTask.form.pathProgramming' })}
      >
        {renderActionConfigButton([code, 'pathProgramming'])}
      </Form.Item>

      {/* 关键点动作配置 */}
      <TitleCard
        hidden={hidden}
        width={746}
        title={<FormattedMessage id={'customTask.form.keyPointActionConfig'} />}
      >
        <Fragment>
          {/* 起始点位动作 */}
          <Form.Item
            hidden={hidden}
            name={[code, 'targetAction', 'firstActions']}
            initialValue={null}
            label={formatMessage({ id: 'customTask.form.firstActions' })}
          >
            {renderActionConfigButton([code, 'targetAction', 'firstActions'], () => {
              setOperationType(null);
            })}
          </Form.Item>

          {/* 第二个点位动作 */}
          <Form.Item
            hidden={hidden}
            name={[code, 'targetAction', 'afterFirstActions']}
            initialValue={null}
            label={formatMessage({ id: 'customTask.form.afterFirstActions' })}
          >
            {renderActionConfigButton([code, 'targetAction', 'afterFirstActions'], () => {
              setOperationType(null);
            })}
          </Form.Item>

          {/* 终点前一个点位动作 */}
          <Form.Item
            hidden={hidden}
            name={[code, 'targetAction', 'beforeLastActions']}
            initialValue={null}
            label={formatMessage({ id: 'customTask.form.beforeLastActions' })}
          >
            {renderActionConfigButton([code, 'targetAction', 'beforeLastActions'], () => {
              setOperationType(null);
            })}
          </Form.Item>

          {/* 终点动作 */}
          <Form.Item
            hidden={hidden}
            name={[code, 'targetAction', 'lastActions']}
            initialValue={null}
            label={formatMessage({ id: 'customTask.form.lastActions' })}
          >
            {renderActionConfigButton([code, 'targetAction', 'lastActions'], () => {
              setOperationType(null);
            })}
          </Form.Item>
        </Fragment>
      </TitleCard>

      {/* 备注 */}
      <Form.Item
        hidden={hidden}
        name={[code, 'remark']}
        initialValue={null}
        label={formatMessage({ id: 'app.common.remark' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>

      {/*  配置关键点动作弹窗 */}
      <ProgramingConfiguer
        title={<FormattedMessage id={'customTask.form.keyPointActionConfig'} />}
        editing={actionList}
        visible={actionVisible}
        programing={programing}
        operationType={operationType}
        onCancel={() => {
          setActionVisible(false);
          setActionList(null);
          setNamePath(null);
        }}
        onOk={(value) => {
          saveKeyPointAction(value);
        }}
      />
    </>
  );
};
export default connect(({ customTask, global }) => ({
  routes: extractRoutes(customTask.mapData),
  programing: global.programing,
}))(memo(SubTaskForm));
