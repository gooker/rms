import React, { memo, useState, useEffect } from 'react';
import { connect } from '@/utils/dva';
import { Form, Input, InputNumber, Radio, Checkbox, Switch, Select } from 'antd';
import groupBy from 'lodash/groupBy';
import { extractRoutes, isNull,formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import ModelSelection from '../FormComponent/ModelSelection';
import ActionDefiner from '../FormComponent/ActionDefiner';
import TaskResourceLock from '../FormComponent/TaskResourceLock';
import TrayActionProtocol from '../FormComponent/TrayActionProtocol';
import CodeEditor from '@/components/CodeEditor';
import AngleSelector from '@/packages/Mixrobot/components/AngleSelector';
import styles from '../customTask.less';

const { Option, OptGroup } = Select;
const FormLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

const ActionForm = (props) => {
  const { form, code, type, hidden, modelLocks, modelTypes } = props;
  const { allActions, turnProtocol, agvRunProtocol, routes, scopeData } = props;
  const { getFieldValue } = form;

  const [scope, setScope] = useState([]);
  const [programCode, setProgramCode] = useState(false); // 是否使用任务编程
  const [target, setTarget] = useState(null); // 目标区域

  const groupedRoutes = groupBy(routes, 'logicId');

  useEffect(() => {
    const fieldValue = getFieldValue(code);
    if (fieldValue) {
      // 目标区域
      setTarget(fieldValue?.targetAction?.target?.type);
      // 是否使用编程
      setProgramCode(fieldValue.programCode);
      // 路线和编程
      if (!isNull(fieldValue.pathCode)) {
        updateScopeOptions(fieldValue.pathCode);
      } else {
        // 如果不是编辑模式, “地图路线”和“地图编程”显示默认值
        const firstRoute = routes[0];
        const pathCode = `${firstRoute.logicId}-${firstRoute.code}`;
        form.setFieldsValue({ [code]: { pathCode } });
        const scopeOptions = updateScopeOptions(pathCode);
        if (scopeOptions.length > 0) {
          form.setFieldsValue({ [code]: { scopeCode: scopeOptions[0].scopeCode } });
        }
      }
    }
  }, []);

  function updateScopeOptions(routeKey) {
    const scopeValue = scopeData[routeKey] || [];
    setScope(scopeValue);
    form.setFieldsValue({ [code]: { scopeCode: scopeValue[0]?.scopeCode || null } });
    return scopeValue;
  }

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
      const label = `${formatMessage({ id: 'app.selectLogicArea.logicArea' })}: ${
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
    return Promise.reject(new Error(formatMessage({ id: 'app.customTask.require.target' })));
  }

  return (
    <>
      <Form.Item
        hidden
        {...FormLayout}
        name={[code, 'customType']}
        initialValue={type}
        label={formatMessage({ id: 'app.customTask.form.type' })}
      >
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
      {/* 子任务编码 */}
      <Form.Item
        hidden
        {...FormLayout}
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'app.customTask.form.code' })}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>

      {/* --------------------------------------------------------------- */}
      {/* 目标区域 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'targetAction', 'target']}
        label={formatMessage({ id: 'app.customTask.form.targetArea' })}
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
        {...FormLayout}
        name={[code, 'targetAction', 'podAngle']}
        initialValue={null}
        label={formatMessage({ id: 'app.customTask.form.podAngle' })}
      >
        <AngleSelector
          getAngle
          width={220}
          addonLabel={{
            0: formatMessage({ id: 'app.podManager.A' }),
            90: formatMessage({ id: 'app.podManager.B' }),
            180: formatMessage({ id: 'app.podManager.C' }),
            270: formatMessage({ id: 'app.podManager.D' }),
          }}
        />
      </Form.Item>
      {/* 操作点方向 --选择了货架面  不是站点 站点组 STATION STATION_GROUP */}
      {target && !['STATION', 'STATION_GROUP'].includes(target) ? (
        <Form.Item
          hidden={hidden}
          {...FormLayout}
          name={[code, 'targetAction', 'operatorDirection']}
          initialValue={null}
          label={formatMessage({ id: 'app.generateCode.operatingPoint' })}
        >
           <AngleSelector
          getAngle
          width={220}
          addonLabel={{
            0: formatMessage({ id: 'app.selectDirAngle.upper' }),
            90: formatMessage({ id: 'app.selectDirAngle.right' }),
            180: formatMessage({ id: 'app.selectDirAngle.Below' }),
            270: formatMessage({ id: 'app.selectDirAngle.left' }),
          }}
        />
        </Form.Item>
      ) : null}
      {/* 升降动作 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'targetAction', 'isDownOrUp']}
        label={formatMessage({ id: 'app.customTask.form.isDownOrUp' })}
      >
        <Select style={{ width: 220 }}>
          <Option value={'Up'}>
            <FormattedMessage id="app.customTask.form.lift" />
          </Option>
          <Option value={'Down'}>
            <FormattedMessage id="app.customTask.form.down" />
          </Option>
        </Select>
      </Form.Item>
      {/* 地图路线 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'pathCode']}
        label={formatMessage({ id: 'app.customTask.form.pathCode' })}
        getValueFromEvent={(value) => {
          updateScopeOptions(value);
          return value;
        }}
      >
        <Select style={{ width: 300 }}>{renderPathCodeOptions()}</Select>
      </Form.Item>
      {/* 地图编程 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'scopeCode']}
        label={formatMessage({ id: 'app.customTask.form.scopeCode' })}
      >
        <Select style={{ width: 300 }}>
          {scope.map((item) => (
            <Option key={item.scopeCode} value={item.scopeCode}>
              {item.scopeName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {/* 车辆状态 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'isPathWithPod']}
        initialValue={false}
        label={formatMessage({ id: 'app.customTask.form.isPathWithPod' })}
      >
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={[
            { value: false, label: formatMessage({ id: 'app.customTask.form.heavy' }) },
            { value: true, label: formatMessage({ id: 'app.customTask.form.empty' }) },
          ]}
        />
      </Form.Item>
      {/* 速度档位 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'speed']}
        initialValue={4}
        label={formatMessage({ id: 'app.customTask.form.speed' })}
      >
        <InputNumber min={1} step={1} />
      </Form.Item>
      {/* 自动切换路线 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'canReCalculatePath']}
        initialValue={true}
        valuePropName={'checked'}
        label={formatMessage({ id: 'app.customTask.form.canReCalculatePath' })}
      >
        <Switch />
      </Form.Item>
      {/* 配置资源锁 */}
      {target ? (
        <Form.Item
          hidden={hidden}
          {...FormLayout}
          name={[code, 'lockTime']}
          label={formatMessage({ id: 'app.customTask.form.resourceLock' })}
        >
          <TaskResourceLock dataSource={modelLocks[target] ?? {}} />
        </Form.Item>
      ) : null}
      {/* 行走协议 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'runAction']}
        initialValue={'A0'}
        label={formatMessage({ id: 'app.customTask.form.runAction' })}
      >
        <Select allowClear style={{ width: 200 }}>
          {agvRunProtocol.map(({ action, label }) => (
            <Option key={action} value={action}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {/* 转弯协议 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'turnAction']}
        initialValue={'B'}
        label={formatMessage({ id: 'app.customTask.form.turnAction' })}
      >
        <Select allowClear style={{ width: 200 }}>
          {turnProtocol.map(({ action, label }) => (
            <Option key={action} value={action}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {/* 托盘动作协议 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'trayActionProtocol']}
        initialValue={{ upAction: 'D0', downAction: 'D1' }}
        label={formatMessage({ id: 'app.customTask.form.trayActionProtocol' })}
      >
        <TrayActionProtocol />
      </Form.Item>
      {/* 起始点位动作 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'targetAction', 'firstActions']}
        label={formatMessage({ id: 'app.customTask.form.firstActions' })}
        initialValue={[{}]}
      >
        <ActionDefiner data={allActions} />
      </Form.Item>
      {/* 第二个点位动作 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'targetAction', 'afterFirstActions']}
        label={formatMessage({ id: 'app.customTask.form.afterFirstActions' })}
        initialValue={[{}]}
      >
        <ActionDefiner data={allActions} />
      </Form.Item>
      {/* 终点前一个点位动作 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'targetAction', 'beforeLastActions']}
        label={formatMessage({ id: 'app.customTask.form.beforeLastActions' })}
        initialValue={[{}]}
      >
        <ActionDefiner data={allActions} />
      </Form.Item>
      {/* 终点动作 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'targetAction', 'lastActions']}
        label={formatMessage({ id: 'app.customTask.form.lastActions' })}
        initialValue={[{}]}
      >
        <ActionDefiner data={allActions} />
      </Form.Item>
      {/* 任务编程 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
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
            <FormattedMessage id="app.customTask.form.programCode" />
          </Checkbox>
        }
      >
        {programCode ? (
          <CodeEditor />
        ) : (
          <span className={styles.unUsedField}>
            <FormattedMessage id="app.customTask.form.programCode.no" />
          </span>
        )}
      </Form.Item>

      {/* 备注 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'remark']}
        initialValue={null}
        label={formatMessage({ id: 'app.customTask.form.remark' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>

      {/* 跳过 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'skip']}
        initialValue={false}
        valuePropName={'checked'}
        label={formatMessage({ id: 'app.customTask.form.skip' })}
      >
        <Switch />
      </Form.Item>
    </>
  );
};
export default connect(({ customTask }) => ({
  scopeData: customTask.scopeData,
  modelLocks: customTask.modelLocks,
  allActions: customTask.allActions,
  routes: extractRoutes(customTask.mapData),
  agvRunProtocol: customTask.agvRunProtocol,
  turnProtocol: customTask.turnProtocol,
  modelTypes: customTask.modelTypes,
}))(memo(ActionForm));
