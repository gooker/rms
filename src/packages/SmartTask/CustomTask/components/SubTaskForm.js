import React, { memo, useState, useEffect } from 'react';
import { connect } from '@/utils/RmsDva';
import { Form, Input, InputNumber, Radio, Checkbox, Switch, Select } from 'antd';
import groupBy from 'lodash/groupBy';
import { extractRoutes, isNull, formatMessage, getFormLayout, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import ModelSelection from '../FormComponent/ModelSelection';
import ActionDefiner from '../FormComponent/ActionDefiner';
import TaskResourceLock from '../FormComponent/TaskResourceLock';
import CodeEditor from '@/components/CodeEditor';
import AngleSelector from '@/components/AngleSelector';
import styles from '../customTask.module.less';

const { Option, OptGroup } = Select;
const { formItemLayout } = getFormLayout(6, 18);

const SubTaskForm = (props) => {
  const { form, code, type, hidden, updateTab } = props;
  const { routes, modelTypes, modelLocks } = props;

  const [programCode, setProgramCode] = useState(false); // 是否使用任务编程
  const [target, setTarget] = useState(1); // 目标区域

  const groupedRoutes = groupBy(routes, 'logicId');

  useEffect(() => {
    // const fieldValue = getFieldValue(code);
    // if (fieldValue) {
    //   // 目标区域
    //   setTarget(fieldValue?.targetAction?.target?.type);
    //   // 是否使用编程
    //   setProgramCode(fieldValue.programCode);
    //   // 路线和编程
    //   if (!isNull(fieldValue.pathCode)) {
    //     updateScopeOptions(fieldValue.pathCode);
    //   } else {
    //     // 如果不是编辑模式, “地图路线”和“地图编程”显示默认值
    //     const firstRoute = routes[0];
    //     const pathCode = `${firstRoute.logicId}-${firstRoute.code}`;
    //     form.setFieldsValue({ [code]: { pathCode } });
    //     const scopeOptions = updateScopeOptions(pathCode);
    //     if (scopeOptions.length > 0) {
    //       form.setFieldsValue({ [code]: { scopeCode: scopeOptions[0].scopeCode } });
    //     }
    //   }
    // }
  }, []);

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
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'targetAction', 'target']}
        label={formatMessage({ id: 'customTask.form.targetArea' })}
        rules={[{ required: true }, { validator: validateTarget }]}
        getValueFromEvent={(value) => {
          updateTarget(value.type);
          return value;
        }}
      >
        <ModelSelection modelTypes={modelTypes} exclude={['AGV', 'AGV_GROUP']} disabled={false} />
      </Form.Item>

      {/* 货架/托盘方向 */}
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

      {/* 操作点方向 --选择了货架面  不是站点 站点组 STATION STATION_GROUP */}
      {target && !['STATION', 'STATION_GROUP'].includes(target) ? (
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
      ) : null}

      {/* 升降动作 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'targetAction', 'isDownOrUp']}
        label={formatMessage({ id: 'customTask.form.isDownOrUp' })}
      >
        <Select style={{ width: 200 }}>
          <Option value={'Up'}>
            <FormattedMessage id='customTask.form.lift' />
          </Option>
          <Option value={'Down'}>
            <FormattedMessage id='customTask.form.down' />
          </Option>
        </Select>
      </Form.Item>

      {/* 地图路线 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'pathCode']}
        label={formatMessage({ id: 'customTask.form.pathCode' })}
      >
        <Select style={{ width: 200 }}>{renderPathCodeOptions()}</Select>
      </Form.Item>

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

      {/* 自动切换路线 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'canReCalculatePath']}
        initialValue={true}
        valuePropName={'checked'}
        label={formatMessage({ id: 'customTask.form.canReCalculatePath' })}
      >
        <Switch />
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
        <Switch />
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

      {/* 配置资源锁 */}
      {target ? (
        <Form.Item
          hidden={hidden}
          {...formItemLayout}
          name={[code, 'lockTime']}
          label={formatMessage({ id: 'customTask.form.resourceLock' })}
        >
          <TaskResourceLock dataSource={modelLocks[target] ?? {}} />
        </Form.Item>
      ) : null}

      {/* 起始点位动作 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'targetAction', 'firstActions']}
        label={formatMessage({ id: 'customTask.form.firstActions' })}
        initialValue={[{}]}
      >
        <ActionDefiner data={[]} />
      </Form.Item>

      {/* 第二个点位动作 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'targetAction', 'afterFirstActions']}
        label={formatMessage({ id: 'customTask.form.afterFirstActions' })}
        initialValue={[{}]}
      >
        <ActionDefiner data={[]} />
      </Form.Item>

      {/* 终点前一个点位动作 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'targetAction', 'beforeLastActions']}
        label={formatMessage({ id: 'customTask.form.beforeLastActions' })}
        initialValue={[{}]}
      >
        <ActionDefiner data={[]} />
      </Form.Item>

      {/* 终点动作 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'targetAction', 'lastActions']}
        label={formatMessage({ id: 'customTask.form.lastActions' })}
        initialValue={[{}]}
      >
        <ActionDefiner data={[]} />
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
    </>
  );
};
export default connect(({ customTask }) => ({
  modelLocks: customTask.modelLocks,
  routes: extractRoutes(customTask.mapData),
  modelTypes: customTask.modelTypes,
}))(memo(SubTaskForm));
