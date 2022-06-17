import React, { memo, useEffect, useState } from 'react';
import { Button, Dropdown, Form, Menu, message, Modal, Space } from 'antd';
import {
  BranchesOutlined,
  CloseOutlined,
  HourglassOutlined,
  PlusOutlined,
  RedoOutlined,
  SaveOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useMemoizedFn } from 'ahooks';
import update from 'immutability-helper';
import { findIndex } from 'lodash';
import { Container } from 'react-smooth-dnd';
import {
  customTaskApplyDrag,
  dealResponse,
  formatMessage,
  generateCustomTaskForm,
  generateSample,
  getFormLayout,
  getRandomString,
  restoreCustomTaskForm,
} from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import { IconFont } from '@/components/IconFont';
import { saveCustomTask } from '@/services/commonService';
import { CustomNodeType } from '../customTaskConfig';
import { getInitialTaskSteps, isStandardTab } from '../customTaskUtil';
import { PageContentPadding } from '@/config/consts';
import RmsConfirm from '@/components/RmsConfirm';
import FormattedMessage from '@/components/FormattedMessage';
import TaskNodeCard from './TaskNodeCard';
import InformationForm from './InformationForm';
import StartForm from './StartForm';
import SubTaskForm from './SubTaskForm';
import WaitForm from './WaitForm';
import PodSimulation from './PodSimulationForm';
import EndForm from './EndForm';
import styles from '../customTask.module.less';

const CustomTypeIconMap = {
  [CustomNodeType.ACTION]: <BranchesOutlined />,
  [CustomNodeType.WAIT]: <HourglassOutlined />,
  [CustomNodeType.PODSTATUS]: <ShoppingCartOutlined />,
};
const { formItemLayout } = getFormLayout(6, 18);

const CustomTaskForm = (props) => {
  const { dispatch, editingRow, programing, listVisible } = props;
  const [form] = Form.useForm();

  // 已配置的任务节点
  const [taskSteps, setTaskSteps] = useState([]);
  // 已配置的前置任务节点
  const [preTasks, setPreTasks] = useState([]);
  // 当前选中的任务流程节点, 用于切换右侧表单中的数据
  const [currentCode, setCurrentCode] = useState(CustomNodeType.BASE);

  useEffect(() => {
    if (editingRow) {
      const result = restoreCustomTaskForm(editingRow);
      const newTaskSteps = [...result.taskSteps];
      const newPreTaskSteps = [...result.preTaskSteps];
      // 添加BASE节点
      newTaskSteps.unshift({
        type: CustomNodeType.BASE,
        code: CustomNodeType.BASE,
        label: formatMessage({ id: 'customTask.type.BASE' }),
      });
      // 添加按钮节点
      newTaskSteps.splice(newTaskSteps.length - 1, 0, {
        type: CustomNodeType.PLUS,
        code: -1,
        label: <PlusOutlined />,
      });
      setTaskSteps(newTaskSteps);
      setPreTasks(newPreTaskSteps);
      setCurrentCode(newTaskSteps[0].code);
      form.setFieldsValue(result.fieldsValue);
    } else {
      setTaskSteps(getInitialTaskSteps());
    }
  }, []);

  function addTaskFlowNode({ key }) {
    // 加在倒数第二个位置
    const step = {
      type: key,
      code: `${key}_${getRandomString(6)}`,
      label: formatMessage({ id: `customTask.type.${key}` }),
    };
    const newTaskSteps = [...taskSteps];
    newTaskSteps.splice(newTaskSteps.length - 2, 0, step);
    setTaskSteps(newTaskSteps);
    setCurrentCode(step.code);
  }

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

  function addPreTask() {
    const step = {
      type: CustomNodeType.ACTION,
      code: `${CustomNodeType.ACTION}_${getRandomString(6)}`,
      label:
        formatMessage({ id: `customTask.type.${CustomNodeType.ACTION}` }) +
        ` ${preTasks.length + 1}`,
      pre: true,
    };
    const newPreTasks = preTasks.concat([step]);
    setPreTasks(newPreTasks);
    setCurrentCode(step.code);
  }

  // TODO: 已经被子任务依赖的前置任务不可以被删除
  function deletePreTaskNode(index) {
    RmsConfirm({
      content: formatMessage({ id: 'customTasks.form.delete.confirm' }),
      onOk: () => {
        const newPreTasks = [...preTasks];
        newPreTasks.splice(index, 1);
        setPreTasks(newPreTasks);
      },
    });
  }

  function onDropInTaskFlow(dropResult) {
    const { removedIndex, addedIndex } = dropResult;

    const startIndex = findIndex(taskSteps, { type: CustomNodeType.START });
    const endIndex = findIndex(taskSteps, { type: CustomNodeType.PLUS });
    if (addedIndex <= startIndex || addedIndex + 1 > endIndex) {
      return;
    }
    if (removedIndex !== null || addedIndex !== null) {
      let newTaskSteps = [...taskSteps];
      newTaskSteps = customTaskApplyDrag(newTaskSteps, dropResult);
      setCurrentCode(newTaskSteps[addedIndex].code);
      setTaskSteps(newTaskSteps);
    }
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

  function renderFormBody() {
    return [...taskSteps, ...preTasks].map((step, index) => {
      if (!step) return null;
      switch (step.type) {
        case CustomNodeType.BASE:
          return (
            <InformationForm key={index} hidden={currentCode !== step.code} isEdit={!!editingRow} />
          );
        case CustomNodeType.START:
          return (
            <StartForm
              key={index}
              code={step.code}
              type={step.type}
              hidden={currentCode !== step.code}
            />
          );
        case CustomNodeType.END:
          return (
            <EndForm
              key={index}
              form={form}
              code={step.code}
              type={step.type}
              hidden={currentCode !== step.code}
            />
          );
        case CustomNodeType.ACTION:
          return (
            <SubTaskForm
              key={index}
              form={form}
              code={step.code}
              type={step.type}
              hidden={currentCode !== step.code}
              updateTab={updateTabName}
              preTasks={preTasks}
            />
          );
        case CustomNodeType.WAIT:
          return (
            <WaitForm
              key={index}
              form={form}
              hidden={currentCode !== step.code}
              code={step.code}
              type={step.type}
              updateTab={updateTabName}
            />
          );
        case CustomNodeType.PODSTATUS:
          return (
            <PodSimulation
              key={index}
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

  async function generateTaskData() {
    return new Promise((resolve) => {
      // 去掉两个没用的任务节点
      const _taskSteps = [...taskSteps].filter(
        (item) => ![CustomNodeType.BASE, -1].includes(item.code),
      );
      form
        .validateFields()
        .then((value) => {
          const formValue = generateCustomTaskForm(
            value,
            _taskSteps,
            programing,
            preTasks.map(({ code }) => code),
          );
          resolve(formValue);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  async function submit() {
    let requestBody = await generateTaskData();
    if (requestBody === null) {
      message.error(formatMessage({ id: 'customTask.form.invalid' }));
      return;
    }

    // 生成sample数据
    const sample = {
      sectionId: window.localStorage.getItem('sectionId'),
      code: requestBody.code,
      createCode: null,
      customParams: generateSample(requestBody, attachNodeIndex()),
    };
    requestBody.sample = JSON.stringify(sample);

    // 如果是更新，那么 code 不需要更新; 同时附上部分原始数据
    if (editingRow) {
      requestBody.id = editingRow.id;
      requestBody.createTime = editingRow.createTime;
      requestBody.createdByUser = editingRow.createdByUser;
    }
    const response = await saveCustomTask(requestBody);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.message.operateFailed' }));
    } else {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      dispatch({ type: 'customTask/saveState', payload: { listVisible: !listVisible } });
    }
  }

  const updateTabName = useMemoizedFn(function (code, name) {
    let index = findIndex(taskSteps, { code });
    if (index > -1) {
      const newTaskSteps = update(taskSteps, { [index]: { label: { $set: name } } });
      setTaskSteps(newTaskSteps);
      return;
    }

    index = findIndex(preTasks, { code });
    if (index > -1) {
      const newPreTasks = update(preTasks, { [index]: { label: { $set: name } } });
      setPreTasks(newPreTasks);
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

  function attachNodeIndex() {
    let index = 0;
    return taskSteps.map((taskStep) => {
      if (
        ![
          CustomNodeType.BASE,
          CustomNodeType.PLUS,
          CustomNodeType.START,
          CustomNodeType.END,
        ].includes(taskStep.type)
      ) {
        index += 1;
        return { ...taskStep, index };
      }
      return taskStep;
    });
  }

  function isDragAble(item) {
    return ![CustomNodeType.BASE, CustomNodeType.START, CustomNodeType.END].includes(item.type);
  }

  const plusMenu = (
    <Menu onClick={addTaskFlowNode}>
      <Menu.Item key={CustomNodeType.ACTION}>
        {CustomTypeIconMap[CustomNodeType.ACTION]}{' '}
        <FormattedMessage id={'customTask.type.ACTION'} />
      </Menu.Item>
      <Menu.Item key={CustomNodeType.WAIT}>
        {CustomTypeIconMap[CustomNodeType.WAIT]} <FormattedMessage id={'customTask.type.WAIT'} />
      </Menu.Item>
      <Menu.Item key={CustomNodeType.PODSTATUS}>
        {CustomTypeIconMap[CustomNodeType.PODSTATUS]}{' '}
        <FormattedMessage id={'customTask.type.PODSTATUS'} />
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.customTaskForm}>
      <div className={styles.dndColumn}>
        <div className={styles.dndItem} style={{ flex: 5 }}>
          <div className={styles.dndTitle}>
            <IconFont type={'icon-flow'} style={{ fontSize: 20, marginRight: 5 }} />
            <FormattedMessage id="app.task.flow" />
          </div>
          <Container
            groupName="dnd"
            dropPlaceholder={{
              showOnTop: true,
              animationDuration: 150,
              className: styles.dndPlaceholder,
            }}
            onDrop={(e) => onDropInTaskFlow(e)}
            nonDragAreaSelector={'.dndDisabled'} // 禁止拖拽
          >
            {attachNodeIndex().map((item, index) => {
              if (item.type === CustomNodeType.PLUS) {
                return (
                  <div style={{ textAlign: 'center' }}>
                    <Dropdown arrow overlay={plusMenu} trigger={['click']}>
                      <Button type={'dashed'} style={{ width: '90%', marginTop: 8 }}>
                        <PlusOutlined />
                      </Button>
                    </Dropdown>
                  </div>
                );
              }
              return (
                <TaskNodeCard
                  key={item.code}
                  dnd={isDragAble(item)}
                  name={getRichName(item)}
                  index={item.index}
                  active={currentCode === item.code}
                  disabled={isStandardTab(item.type)}
                  onDelete={() => {
                    deleteTaskFlowNode(index);
                  }}
                  onClick={() => {
                    setCurrentCode(item.code);
                  }}
                />
              );
            })}
          </Container>
        </div>
        <div style={{ height: 24 }} />

        {/* 前置任务 */}
        <div className={styles.dndItem} style={{ flex: 3 }}>
          <div className={styles.dndTitle}>
            <IconFont type={'icon-pre'} style={{ fontSize: 20, marginRight: 5 }} />
            <FormattedMessage id="app.task.pre" />
          </div>
          <div className={styles.preTask}>
            {preTasks.map((item, index) => (
              <TaskNodeCard
                key={index}
                name={getRichName(item)}
                active={currentCode === item.code}
                onDelete={() => {
                  deletePreTaskNode(index);
                }}
                onClick={() => {
                  setCurrentCode(item.code);
                }}
              />
            ))}
            <Button type={'dashed'} style={{ width: '90%', marginTop: 8 }} onClick={addPreTask}>
              <PlusOutlined />
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.layoutGap} />

      {/* 表单部分 */}
      <div
        className={styles.viewContent}
        style={{ height: `calc(100vh - ${PageContentPadding}px)` }}
      >
        <div style={{ flex: 1 }}>
          <Form labelWrap form={form} {...formItemLayout}>
            {renderFormBody()}
          </Form>
        </div>
        <div className={styles.topTool}>
          <Button danger onClick={gotoListPage}>
            <CloseOutlined /> <FormattedMessage id="app.button.return" />
          </Button>
          <Button type="primary" onClick={submit}>
            <SaveOutlined /> <FormattedMessage id="app.button.save" />
          </Button>
        </div>
      </div>
      <Button
        type={'dashed'}
        style={{ position: 'absolute', top: 24, right: 30 }}
        onClick={() => {
          dispatch({ type: 'customTask/initPage' });
        }}
      >
        <RedoOutlined /> <FormattedMessage id="customTasks.button.updateModel" />
      </Button>
    </div>
  );
};
export default connect(({ customTask, global }) => ({
  editingRow: customTask.editingRow,
  listVisible: customTask.listVisible,
  programing: global.programing,
}))(memo(CustomTaskForm));
