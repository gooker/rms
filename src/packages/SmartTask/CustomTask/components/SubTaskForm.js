import React, { Fragment, memo, useState } from 'react';
import { Button, Checkbox, Form, Input, InputNumber, Radio, Select, Space, Switch } from 'antd';
import { DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { groupBy } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { extractRoutes, fillProgramAction, formatMessage, getFormLayout, isNull, isStrictNull } from '@/utils/util';
import TaskResourceLock from '../FormComponent/TaskResourceLock';
import ProgramingConfiguer from '@/components/ProgramingConfiguer';
import FormattedMessage from '@/components/FormattedMessage';
import AngleSelector from '@/components/AngleSelector';
import CodeEditor from '@/components/CodeEditor';
import TitleCard from '@/components/TitleCard';
import TargetSelector from '../components/TargetSelector';
import styles from '../customTask.module.less';

const { Option, OptGroup } = Select;
const { formItemLayout } = getFormLayout(6, 18);

const SubTaskForm = (props) => {
  const { form, code, type, hidden, updateTab } = props;
  const { routes, modelLocks, programing } = props;
  const groupedRoutes = groupBy(routes, 'logicId');

  const [target, setTarget] = useState(null); // 目标区域
  const [programCode, setProgramCode] = useState(false); // 是否使用任务编程

  // ************** 关键点动作配置 ************** //
  const [, rerender] = useState({}); // 用于触发组件重渲染
  const [namePath, setNamePath] = useState(null); // 正在编辑的条目的namePath
  const [actionList, setActionList] = useState(null); // 正在编辑的关键点动作列表
  const [actionVisible, setActionVisible] = useState(false); // 配置关键点动作弹窗

  function updateTarget(targetType) {
    setTarget(targetType);
    if (targetType) {
      const lockTimeValue = {};
      const modelLocksContent = modelLocks[targetType];
      Object.keys(modelLocksContent).forEach((field) => {
        lockTimeValue[field] = {
          LOCK: modelLocksContent[field].LOCK,
          UNLOCK: modelLocksContent[field].UNLOCK,
        };
      });
      form.setFieldsValue({ [code]: { lockTime: lockTimeValue } });
    } else {
      form.setFieldsValue({ [code]: { lockTime: null } });
    }
  }

  function renderPathCodeOptions() {
    return Object.keys(groupedRoutes).map((logicId) => {
      const label = `${formatMessage({ id: 'app.map.logicArea' })}: ${
        groupedRoutes[logicId][0].logicName
      }`;
      return (
        <OptGroup key={logicId} label={label}>
          {groupedRoutes[logicId].map((route) => (
            <Option key={route.code} value={`${route.logicId}-${route.code}`}>
              {route.name}
            </Option>
          ))}
        </OptGroup>
      );
    });
  }

  function validateTarget(_, value) {
    if (!value || !isNull(value.type)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'customTask.require.target' })));
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
      actionConfigList = fillProgramAction(actionConfigList, programing);
      setActionList({ actions: actionConfigList });
    } else {
      setActionList(null);
    }
    setActionVisible(true);
    setNamePath(_namePath);
  }

  // 保存配置弹窗中的内容
  function saveKeyPointAction(value) {
    let setter = value;
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

  return (
    <>
      <Form.Item
        hidden
        {...formItemLayout}
        name={[code, 'customType']}
        initialValue={type}
        label={formatMessage({ id: 'app.common.type' })}
      >
        <Input disabled style={{ width: 300 }} />
      </Form.Item>

      {/* 子任务编码 */}
      <Form.Item
        hidden
        {...formItemLayout}
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'app.common.code' })}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>

      {/* --------------------------------------------------------------- */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'name']}
        label={formatMessage({ id: 'app.common.name' })}
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

      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'desc']}
        label={formatMessage({ id: 'app.common.description' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>

      {/* 目标区域 */}
      <Form.Item
        required
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'targetAction', 'target']}
        label={formatMessage({ id: 'customTask.form.target' })}
        rules={[{ validator: validateTarget }]}
        getValueFromEvent={(value) => {
          updateTarget(value.type);
          return value;
        }}
      >
        <TargetSelector />
      </Form.Item>

      {/* 资源锁 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'lockTime']}
        label={formatMessage({ id: 'customTask.lock.resourceLock' })}
      >
        <TaskResourceLock />
      </Form.Item>

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
            {...formItemLayout}
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

      {/* 任务级动作属性配置  */}
      <TitleCard
        hidden={hidden}
        width={746}
        title={<FormattedMessage id={'customTask.form.taskLevelActionConfig'} />}
      >
        111
      </TitleCard>

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
            {...formItemLayout}
            name={[code, 'targetAction', 'firstActions']}
            label={formatMessage({ id: 'customTask.form.firstActions' })}
          >
            {renderActionConfigButton([code, 'targetAction', 'firstActions'])}
          </Form.Item>

          {/* 第二个点位动作 */}
          <Form.Item
            hidden={hidden}
            {...formItemLayout}
            name={[code, 'targetAction', 'afterFirstActions']}
            label={formatMessage({ id: 'customTask.form.afterFirstActions' })}
          >
            {renderActionConfigButton([code, 'targetAction', 'afterFirstActions'])}
          </Form.Item>

          {/* 终点前一个点位动作 */}
          <Form.Item
            hidden={hidden}
            {...formItemLayout}
            name={[code, 'targetAction', 'beforeLastActions']}
            label={formatMessage({ id: 'customTask.form.beforeLastActions' })}
          >
            {renderActionConfigButton([code, 'targetAction', 'beforeLastActions'])}
          </Form.Item>

          {/* 终点动作 */}
          <Form.Item
            hidden={hidden}
            {...formItemLayout}
            name={[code, 'targetAction', 'lastActions']}
            label={formatMessage({ id: 'customTask.form.lastActions' })}
          >
            {renderActionConfigButton([code, 'targetAction', 'lastActions'])}
          </Form.Item>
        </Fragment>
      </TitleCard>

      {/* 载具方向 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'targetAction', 'podAngle']}
        initialValue={null}
        label={formatMessage({ id: 'customTask.form.podAngle' })}
      >
        <AngleSelector
          getAngle
          beforeWidth={80}
          width={200}
          addonLabel={{
            0: formatMessage({ id: 'app.pod.side.A' }),
            90: formatMessage({ id: 'app.pod.side.B' }),
            180: formatMessage({ id: 'app.pod.side.C' }),
            270: formatMessage({ id: 'app.pod.side.D' }),
          }}
        />
      </Form.Item>

      {/* 操作者方向 */}
      {/*{target && !['STATION', 'STATION_GROUP'].includes(target) ? (*/}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'targetAction', 'operatorDirection']}
        initialValue={null}
        label={formatMessage({ id: 'customTask.form.operatorDirection' })}
      >
        <AngleSelector
          getAngle
          beforeWidth={80}
          width={200}
          addonLabel={{
            0: formatMessage({ id: 'app.direction.top' }),
            90: formatMessage({ id: 'app.direction.right' }),
            180: formatMessage({ id: 'app.direction.bottom' }),
            270: formatMessage({ id: 'app.direction.left' }),
          }}
        />
      </Form.Item>
      {/*) : null}*/}

      {/* 速度档位 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'speed']}
        initialValue={4}
        label={formatMessage({ id: 'customTask.form.speed' })}
      >
        <InputNumber min={1} step={1} />
      </Form.Item>

      {/* 协同旋转 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'isTurnWith']}
        initialValue={false}
        valuePropName={'checked'}
        label={formatMessage({ id: 'customTask.form.synergisticRotation' })}
      >
        <Switch
          checkedChildren={formatMessage({ id: 'app.button.turnOn' })}
          unCheckedChildren={formatMessage({ id: 'app.button.turnOff' })}
        />
      </Form.Item>

      {/* 升降动作 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'targetAction', 'isDownOrUp']}
        label={formatMessage({ id: 'customTask.form.isDownOrUp' })}
      >
        <Radio.Group
          optionType='button'
          buttonStyle='solid'
          options={[
            { value: 'Up', label: formatMessage({ id: 'customTask.form.lift' }) },
            { value: 'Down', label: formatMessage({ id: 'customTask.form.down' }) },
          ]}
        />
      </Form.Item>

      {/* 行驶方向 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'isForward']}
        initialValue={true}
        label={formatMessage({ id: 'customTask.form.runDirection' })}
      >
        <Radio.Group
          optionType='button'
          buttonStyle='solid'
          options={[
            { value: true, label: formatMessage({ id: 'customTask.form.runDirection.forward' }) },
            { value: false, label: formatMessage({ id: 'customTask.form.runDirection.reverse' }) },
          ]}
        />
      </Form.Item>

      {/* 车辆状态 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'isPathWithPod']}
        initialValue={false}
        label={formatMessage({ id: 'customTask.form.isPathWithPod' })}
      >
        <Radio.Group
          optionType='button'
          buttonStyle='solid'
          options={[
            { value: false, label: formatMessage({ id: 'customTask.form.heavy' }) },
            { value: true, label: formatMessage({ id: 'customTask.form.empty' }) },
          ]}
        />
      </Form.Item>

      {/* 任务编程 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'programCode']}
        initialValue={null}
        label={
          <Checkbox
            checked={programCode}
            onChange={(ev) => {
              setProgramCode(ev.target.checked);
              form.setFieldsValue({ [code]: { programCode: null } });
            }}
          >
            <FormattedMessage id='customTask.form.programCode' />
          </Checkbox>
        }
      >
        {programCode ? (
          <CodeEditor />
        ) : (
          <span className={styles.unUsedField}>
            <FormattedMessage id='customTask.form.programCode.no' />
          </span>
        )}
      </Form.Item>

      {/* 备注 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'remark']}
        initialValue={null}
        label={formatMessage({ id: 'app.common.remark' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>

      {/* 跳过 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'skip']}
        initialValue={false}
        valuePropName={'checked'}
        label={formatMessage({ id: 'customTask.form.skip' })}
      >
        <Switch />
      </Form.Item>

      {/*  配置关键点动作弹窗 */}
      <ProgramingConfiguer
        title={<FormattedMessage id={'customTask.form.keyPointActionConfig'} />}
        editing={actionList}
        visible={actionVisible}
        programing={programing}
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
  modelLocks: customTask.modelLocks,
  routes: extractRoutes(customTask.mapData),
  programing: global.programing,
}))(memo(SubTaskForm));
