import React, { memo, useState, useEffect } from 'react';
import { Form, Modal, message, Button, Menu, Dropdown, Space } from 'antd';
import {
  PlusOutlined,
  RedoOutlined,
  SaveOutlined,
  CloseOutlined,
  SnippetsOutlined,
  BranchesOutlined,
  HourglassOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useMemoizedFn } from 'ahooks';
import update from 'immutability-helper';
import { isEmpty, findIndex } from 'lodash';
import { Container } from 'react-smooth-dnd';
import {
  isNull,
  dealResponse,
  formatMessage,
  getRandomString,
  customTaskApplyDrag,
} from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import { saveCustomTask } from '@/services/api';
import { CustomType } from '../customTaskConfig';
import { ModelTypeFieldMap, PageContentPadding } from '@/config/consts';
import RmsConfirm from '@/components/RmsConfirm';
import FormattedMessage from '@/components/FormattedMessage';
import DndCard from './DndCard';
import InformationForm from './InformationForm';
import StartForm from './StartForm';
import SubTaskForm from './SubTaskForm';
import WaitForm from './WaitForm';
import PodSimulation from './PodSimulationForm';
import EndForm from './EndForm';
import styles from '../customTask.module.less';

const CustomTypeIconMap = {
  [CustomType.ACTION]: <BranchesOutlined />,
  [CustomType.WAIT]: <HourglassOutlined />,
  [CustomType.PODSTATUS]: <ShoppingCartOutlined />,
};

const CustomTaskForm = (props) => {
  const { dispatch, editingRow, listVisible } = props;
  const [form] = Form.useForm();

  // 当前自定义任务编码
  const [taskCode, setTaskCode] = useState(`cst_${getRandomString(8)}`);
  // 已配置的任务节点
  const [taskSteps, setTaskSteps] = useState([]);
  // 当前选中的任务流程节点, 用于切换右侧表单中的数据
  const [currentCode, setCurrentCode] = useState(CustomType.BASE);

  useEffect(() => {
    setTaskSteps(getInitialTaskSteps());
  }, []);

  function getInitialTaskSteps() {
    return [
      {
        type: CustomType.BASE,
        code: CustomType.BASE,
        label: formatMessage({ id: 'customTask.type.BASE' }),
      },
      {
        type: CustomType.START,
        code: CustomType.START,
        label: formatMessage({ id: 'customTask.type.START' }),
      },
      {
        type: CustomType.END,
        code: CustomType.END,
        label: formatMessage({ id: 'customTask.type.END' }),
      },
    ];
  }

  function isStandardTab(type) {
    return [CustomType.BASE, CustomType.START, CustomType.END].includes(type);
  }

  function spliceUselessValue(list) {
    return list.filter((item) => !(isEmpty(item) || isNull(item)));
  }

  function addTaskFlowNode({ key }) {
    // 加在倒数第二个位置
    const step = {
      type: key,
      code: `${key}_${getRandomString(6)}`,
      label: formatMessage({ id: `customTask.type.${key}` }),
    };
    const newTaskSteps = [...taskSteps];
    newTaskSteps.splice(newTaskSteps.length - 1, 0, step);
    setTaskSteps(newTaskSteps);
    setCurrentCode(step.code);
  }

  // 删除 “任务流程” 栏的某一节点
  function deleteTaskFlowNode(index) {
    RmsConfirm({
      content: formatMessage({ id: 'customTasks.form.delete.confirm' }),
      onOk: () => {
        const newTaskSteps = [...taskSteps];
        newTaskSteps.splice(index, 1);
        setTaskSteps(newTaskSteps);
        setCurrentCode(newTaskSteps[index - 1].code);
      },
    });
  }

  function gotoListPage() {
    Modal.confirm({
      title: formatMessage({ id: 'customTask.backToList' }),
      content: formatMessage({ id: 'customTasks.form.clear.warn' }),
      onOk: () => {
        const initialTaskSteps = getInitialTaskSteps();
        setTaskSteps(initialTaskSteps);
        setCurrentCode(initialTaskSteps[0].code);
        form.resetFields();
        dispatch({ type: 'customTask/saveEditingRow', payload: null });
        dispatch({ type: 'customTask/saveState', payload: { listVisible: !listVisible } });
      },
    });
  }

  async function generateTaskData() {
    // BASE 不属于子任务范畴所以去掉
    const _taskSteps = [...taskSteps];
    _taskSteps.shift();
    try {
      const value = await form.validateFields();
      const customTaskData = {
        name: value.name,
        desc: value.desc,
        robot: value.robot,
        priority: value.priority,

        type: 'CUSTOM_TASK',
        code: taskCode,
        codes: _taskSteps.map(({ code }) => code),
        sectionId: window.localStorage.getItem('sectionId'),
      };
      Object.keys(value).forEach((key) => {
        if (key.includes('_')) {
          const modelType = key.split('_')[0];
          if (isStandardTab(modelType)) {
            if (modelType === 'START') {
              // 如果分车是“自动分车”, type & code都为null
              const startConfig = { ...value[key] };
              const startConfigRobot = { ...startConfig.robot };
              if (startConfigRobot.type === 'AUTO') {
                startConfig.robot = { type: null, code: null };
              }
              customTaskData[ModelTypeFieldMap[modelType]] = startConfig;
            } else {
              customTaskData[ModelTypeFieldMap[modelType]] = value[key];
            }
          } else {
            if (!customTaskData[ModelTypeFieldMap[modelType]]) {
              customTaskData[ModelTypeFieldMap[modelType]] = {};
            }
            // 路径和动作的数据需要转化
            if (modelType === 'ACTION') {
              const subTaskConfig = { ...value[key] };

              // 处理目标点动作
              const targetAction = { ...subTaskConfig.targetAction };
              targetAction.firstActions = spliceUselessValue(targetAction.firstActions);
              targetAction.afterFirstActions = spliceUselessValue(targetAction.afterFirstActions);
              targetAction.beforeLastActions = spliceUselessValue(targetAction.beforeLastActions);
              targetAction.lastActions = spliceUselessValue(targetAction.lastActions);
              targetAction.podAngle = targetAction.podAngle ? [targetAction.podAngle] : []; // 后端要传数组
              subTaskConfig.targetAction = targetAction;

              // 处理托盘动作协议
              const trayActionProtocol = { ...subTaskConfig.trayActionProtocol };
              delete subTaskConfig.trayActionProtocol;
              subTaskConfig.upAction = trayActionProtocol.upAction;
              subTaskConfig.downAction = trayActionProtocol.downAction;

              customTaskData[ModelTypeFieldMap[modelType]][subTaskConfig.code] = subTaskConfig;
            } else {
              customTaskData[ModelTypeFieldMap[modelType]][value[key].code] = { ...value[key] };
            }
          }
        }
      });

      // sample
      customTaskData.sample = JSON.stringify({
        code: customTaskData.code,
        customStart: customTaskData.customStart,
        customActions: customTaskData.customActions,
        customWaits: customTaskData.customWaits,
        customEvents: customTaskData.customEvents,
        customPodStatus: customTaskData.customPodStatus,
        customEnd: customTaskData.customEnd,
      });
      return customTaskData;
    } catch (error) {
      return null;
    }
  }

  function onDropInTaskFlow(dropResult) {
    const { removedIndex, addedIndex, payload } = dropResult;

    const startIndex = findIndex(taskSteps, { type: CustomType.START });
    const endIndex = findIndex(taskSteps, { type: CustomType.END });
    let jumpToDrop = false; // 是否立即跳转到拖拽的节点表单

    // 如果payload存在, 就是新增节点
    if (payload) {
      jumpToDrop = true;
      // 节点只能在”开始“和”结束“之间
      if (addedIndex <= startIndex || addedIndex > endIndex) {
        return;
      }
    } else {
      // 在“任务流程“栏拖拽, 理由同上
      if (addedIndex <= startIndex || addedIndex + 1 > endIndex) {
        return;
      }
    }
    if (removedIndex !== null || addedIndex !== null) {
      let newTaskSteps = [...taskSteps];
      newTaskSteps = customTaskApplyDrag(newTaskSteps, dropResult);
      jumpToDrop && setCurrentCode(newTaskSteps[addedIndex].code);
      setTaskSteps(newTaskSteps);
    }
  }

  // 渲染表单主体
  function renderFormBody() {
    return taskSteps.map((step) => {
      if (!step) return null;
      switch (step.type) {
        case CustomType.BASE:
          return <InformationForm hidden={currentCode !== step.code} isEdit={!!editingRow} />;
        case CustomType.START:
          return (
            <StartForm
              form={form}
              code={step.code}
              type={step.type}
              hidden={currentCode !== step.code}
            />
          );
        case CustomType.END:
          return (
            <EndForm
              form={form}
              code={step.code}
              type={step.type}
              hidden={currentCode !== step.code}
            />
          );
        case CustomType.ACTION:
          return (
            <SubTaskForm
              form={form}
              code={step.code}
              type={step.type}
              hidden={currentCode !== step.code}
              updateTab={updateTabName}
            />
          );
        case CustomType.WAIT:
          return (
            <WaitForm
              hidden={currentCode !== step.code}
              code={step.code}
              type={step.type}
              updateTab={updateTabName}
            />
          );
        case CustomType.PODSTATUS:
          return (
            <PodSimulation
              form={form}
              code={step.code}
              type={step.type}
              hidden={currentCode !== step.code}
            />
          );
        default:
          return null;
      }
    });
  }

  async function submit() {
    const requestBody = await generateTaskData();
    if (requestBody === null) {
      message.error(formatMessage({ id: 'customTask.form.invalid' }));
      return;
    }

    // 如果是更新，那么 code 不需要更新; 同时附上部分原始数据
    if (editingRow) {
      requestBody.id = editingRow.id;
      requestBody.code = editingRow.code;
      requestBody.createTime = editingRow.createTime;
      requestBody.createdByUser = editingRow.createdByUser;
    }
    const response = await saveCustomTask(requestBody);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'customTask.save.fail' }));
    } else {
      message.success(formatMessage({ id: 'customTask.save.success' }));
    }
  }

  const updateTabName = useMemoizedFn(function(code, name) {
    const index = findIndex(taskSteps, { code });
    if (index > -1) {
      const newTaskSteps = update(taskSteps, { [index]: { label: { $set: name } } });
      setTaskSteps(newTaskSteps);
    }
  });

  function getRichName({ type, label }) {
    return (
      <Space size={2}>
        {CustomTypeIconMap[type]}
        {label}
      </Space>
    );
  }

  const plusMenu = (
    <Menu onClick={addTaskFlowNode}>
      <Menu.Item key={CustomType.ACTION}>
        {CustomTypeIconMap[CustomType.ACTION]} <FormattedMessage id={'customTask.type.ACTION'} />
      </Menu.Item>
      <Menu.Item key={CustomType.WAIT}>
        {CustomTypeIconMap[CustomType.WAIT]} <FormattedMessage id={'customTask.type.WAIT'} />
      </Menu.Item>
      <Menu.Item key={CustomType.PODSTATUS}>
        {CustomTypeIconMap[CustomType.PODSTATUS]}{' '}
        <FormattedMessage id={'customTask.type.PODSTATUS'} />
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.customTaskForm}>
      <div className={styles.dndColumn}>
        <div className={styles.dndTitle}>
          <FormattedMessage id='app.task.flow' />
        </div>
        <Container
          groupName='dnd'
          dropPlaceholder={{
            showOnTop: true,
            animationDuration: 150,
            className: styles.dndPlaceholder,
          }}
          onDrop={(e) => onDropInTaskFlow(e)}
          nonDragAreaSelector={'.dndDisabled'} // 禁止拖拽
        >
          {taskSteps.map((item, index) => (
            <DndCard
              key={item.code}
              name={getRichName(item)}
              active={currentCode === item.code}
              disabled={isStandardTab(item.type)}
              onDelete={() => {
                deleteTaskFlowNode(index);
              }}
              onClick={() => {
                setCurrentCode(item.code);
              }}
            />
          ))}
          <div style={{ textAlign: 'center' }}>
            <Dropdown arrow overlay={plusMenu} trigger={['click']}>
              <Button type={'dashed'} style={{ width: '90%', marginTop: 8 }}>
                <PlusOutlined />
              </Button>
            </Dropdown>
          </div>
        </Container>
      </div>
      <div className={styles.layoutDivider} />
      <div
        className={styles.viewContent}
        style={{ height: `calc(100vh - ${PageContentPadding}px)` }}
      >
        <div className={styles.customTaskFormBody}>
          <Form form={form}>{renderFormBody()}</Form>
        </div>
        <div className={styles.topTool}>
          <Button danger onClick={gotoListPage}>
            <CloseOutlined /> <FormattedMessage id='app.button.return' />
          </Button>
          <Button
            onClick={() => {
              dispatch({ type: 'customTask/initPage' });
            }}
          >
            <RedoOutlined /> <FormattedMessage id='customTasks.button.updateModel' />
          </Button>
          <Button>
            <SnippetsOutlined /> <FormattedMessage id='customTasks.button.temporarySave' />
          </Button>
          <Button type='primary' onClick={submit}>
            <SaveOutlined /> <FormattedMessage id='app.button.save' />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default connect(({ customTask }) => ({
  editingRow: customTask.editingRow,
  listVisible: customTask.listVisible,
}))(memo(CustomTaskForm));
