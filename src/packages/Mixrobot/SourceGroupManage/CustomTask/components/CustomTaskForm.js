import React, { memo, useState, useEffect } from 'react';
import { connect } from '@/utils/dva';
import { Form, Modal, message, Button } from 'antd';
import { SnippetsOutlined, RedoOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { Container } from 'react-smooth-dnd';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import {
  isNull,
  dealResponse,
  getRandomString,
  customTaskApplyDrag,
  restoreCustomTaskForm,
} from '@/utils/utils';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { ModelTypeFieldMap } from '@/config/consts';
import { saveCustomTask } from '@/services/api';
import DndCard from './DndCard';
import InformationForm from './InformationForm';
import StartForm from './StartForm';
import ActionForm from './ActionForm';
import EventForm from './EventForm';
import WaitForm from './WaitForm';
import PodStatusForm from './PodStatusForm';
import EndForm from './EndForm';
import styles from '../customTask.less';

const CustomTaskForm = (props) => {
  const { dispatch, customTypes, editingRow, listVisible } = props;

  const [form] = Form.useForm();
  // 自定义任务编码
  const [taskCode, setTaskCode] = useState(`cst_${getRandomString(8)}`);
  // 已配置的任务节点
  const [taskSteps, setTaskSteps] = useState([]);
  // 当前选中的任务流程节点, 用于切换右侧表单中的数据
  const [currentCode, setCurrentCode] = useState(null);

  useEffect(() => {
    if (editingRow) {
      const result = restoreCustomTaskForm(editingRow, customTypes);
      setTaskCode(editingRow.code);

      // 此时 result.taskSteps 肯定不包含 BASE
      const newTaskSteps = [...result.taskSteps];
      newTaskSteps.unshift({
        type: 'BASE',
        code: `BASE_${getRandomString(6)}`,
        label: formatMessage({ id: 'app.customTask.baseInfo' }),
      });
      setTaskSteps(newTaskSteps);
      setCurrentCode(newTaskSteps[0].code);
      form.setFieldsValue(result.fieldsValue);
    } else {
      // 默认有"开始"、"结束"、”基础信息“
      const initialTaskSteps = getInitialTaskSteps();
      setTaskSteps(initialTaskSteps);
      setCurrentCode(initialTaskSteps[0].code);
    }
  }, []);

  function isStandardTab(type) {
    return ['START', 'END', 'BASE'].includes(type);
  }

  function spliceUselessValue(list) {
    return list.filter((item) => !(isEmpty(item) || isNull(item)));
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
              targetAction.podAngle = targetAction.podAngle?[targetAction.podAngle]:[];// 后端要传数组
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

  function getInitialTaskSteps() {
    const initialTaskSteps = [];
    // 新增”基础信息“
    initialTaskSteps.push({
      type: 'BASE',
      code: `BASE_${getRandomString(6)}`,
      label: formatMessage({ id: 'app.customTask.baseInfo' }),
    });
    ['START', 'END'].map((item) => {
      const customType = find(customTypes, { type: item });
      initialTaskSteps.push({ ...customType, code: `${item}_${getRandomString(6)}` });
    });

    return initialTaskSteps;
  }

  // Drop到任务流程栏
  function onDropInTaskFlow(dropResult) {
    const { removedIndex, addedIndex, payload } = dropResult;

    const startIndex = findIndex(taskSteps, { type: 'START' });
    const endIndex = findIndex(taskSteps, { type: 'END' });
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

  // 删除 “任务流程” 栏的某一节点
  function deleteTaskFlowNode(index) {
    Modal.confirm({
      title: formatMessage({ id: 'app.request.systemHint' }),
      content: formatMessage({ id: 'app.customTask.delete.confirm' }),
      onOk: () => {
        const newTaskSteps = [...taskSteps];
        newTaskSteps.splice(index, 1);
        setTaskSteps(newTaskSteps);
        setCurrentCode(newTaskSteps[index - 1].code);
      },
    });
  }

  // 渲染表单主体
  function renderFormBody() {
    return taskSteps.map((step) => {
      if (!step) return null;
      switch (step.type) {
        case 'BASE':
          return <InformationForm hidden={currentCode !== step.code} isEdit={!!editingRow} />;
        case 'START':
          return (
            <StartForm
              form={form}
              code={step.code}
              type={step.type}
              hidden={currentCode !== step.code}
            />
          );
        case 'END':
          return (
            <EndForm
              form={form}
              code={step.code}
              type={step.type}
              hidden={currentCode !== step.code}
            />
          );
        case 'ACTION':
          return (
            <ActionForm
              form={form}
              code={step.code}
              type={step.type}
              hidden={currentCode !== step.code}
            />
          );
        case 'EVENT':
          return <EventForm hidden={currentCode !== step.code} code={step.code} type={step.type} />;
        case 'WAIT':
          return <WaitForm hidden={currentCode !== step.code} code={step.code} type={step.type} />;
        case 'PODSTATUS':
          return (
            <PodStatusForm
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
      message.error(formatMessage({ id: 'app.customTask.form.invalid' }));
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
      message.error(formatMessage({ id: 'app.customTask.save.fail' }));
    } else {
      message.success(formatMessage({ id: 'app.customTask.save.success' }));
    }
  }

  function gotoListPage() {
    Modal.confirm({
      title: formatMessage({ id: 'app.customTask.backToList' }),
      content: formatMessage({ id: 'app.customTask.clear.warn' }),
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

  // 任务节点不需要显示”开始“和”结束“
  const renderedCustomTypes = customTypes.filter((item) => !isStandardTab(item.type));
  return (
    <div className={styles.customTaskForm}>
      <div style={{ flex: 1, display: 'flex', overflow: 'auto' }}>
        <div className={styles.dndPanel}>
          <div className={styles.dndColumn} style={{ marginBottom: 10 }}>
            <div className={classnames(styles.dndTitle, styles.taskNodeColor)}>
              <FormattedMessage id="app.customTask.customTypes" />
            </div>
            {/*
             * 参考: https://www.jianshu.com/p/342647b69809
             * getChildPayload: 记录当前拖动元素的信息，使用该函数返回一个 payload 的值。当 onDrop 触发时，会自动带入该函数返回的信息，用于做数据的处理
             * 因为两个Container的groupName是相同的，所以两个Container的onDrop事件可以共享getChildPayload返回值(我猜的！！！！)
             */}
            <Container
              groupName="dnd"
              behaviour="copy"
              getChildPayload={(index) => ({ ...renderedCustomTypes[index] })}
            >
              {renderedCustomTypes.map((item) => (
                <DndCard key={item.type} name={item.label} />
              ))}
            </Container>
          </div>
          <div className={styles.dndColumn} style={{ flex: 1, marginTop: 10, overflow: 'auto' }}>
            <div className={classnames(styles.dndTitle, styles.taskFlowColor)}>
              <FormattedMessage id="app.customTask.taskFlow" />
            </div>
            <Container
              groupName="dnd"
              dropPlaceholder={true}
              onDrop={(e) => onDropInTaskFlow(e)}
              nonDragAreaSelector={'.dndDisabled'} // 禁止拖拽
            >
              {taskSteps.map((item, index) => (
                <DndCard
                  key={item.code}
                  name={item.label}
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
            </Container>
          </div>
        </div>
        <div className={styles.layoutDivider}></div>
        <div className={styles.viewContent}>
          <div id="customTaskFormBody" style={{ flex: 1, overflow: 'auto' }}>
            <Form form={form}>{renderFormBody()}</Form>
          </div>
          <div className={styles.topTool}>
            <Button danger onClick={gotoListPage}>
              <CloseOutlined /> <FormattedMessage id="app.common.back" />
            </Button>
            <Button
              onClick={() => {
                dispatch({ type: 'customTask/initPage' });
              }}
            >
              <RedoOutlined /> <FormattedMessage id="app.customTask.updateModel" />
            </Button>
            <Button>
              <SnippetsOutlined /> <FormattedMessage id="app.customTask.temporarySave" />
            </Button>
            <Button type="primary" onClick={submit}>
              <SaveOutlined /> <FormattedMessage id="app.simulator.action.save" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect(({ customTask }) => ({
  editingRow: customTask.editingRow,
  customTypes: customTask.customTypes,
  listVisible: customTask.listVisible,
}))(memo(CustomTaskForm));
