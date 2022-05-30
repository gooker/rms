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
  getRandomString,
  restoreCustomTaskForm,
} from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import { saveCustomTask } from '@/services/api';
import { CustomNodeType, CustomNodeTypeFieldMap } from '../customTaskConfig';
import { getInitialTaskSteps, isStandardTab } from '../customTaskUtil';
import { PageContentPadding } from '@/config/consts';
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
  [CustomNodeType.ACTION]: <BranchesOutlined />,
  [CustomNodeType.WAIT]: <HourglassOutlined />,
  [CustomNodeType.PODSTATUS]: <ShoppingCartOutlined />,
};
const CustomTaskForm = (props) => {
  const { dispatch, editingRow, programing, listVisible } = props;
  const [form] = Form.useForm();

  // 当前自定义任务编码
  const [taskCode, setTaskCode] = useState(`cst_${getRandomString(8)}`);
  // 已配置的任务节点
  const [taskSteps, setTaskSteps] = useState([]);
  // 当前选中的任务流程节点, 用于切换右侧表单中的数据
  const [currentCode, setCurrentCode] = useState(CustomNodeType.BASE);

  useEffect(() => {
    if (editingRow) {
      const { code, sample } = editingRow;
      setTaskCode(code);
      dispatch({ type: 'customTask/updateVariable', payload: JSON.parse(sample) });

      const result = restoreCustomTaskForm(editingRow);
      // 此时 result.taskSteps 肯定不包含 BASE
      const newTaskSteps = [...result.taskSteps];
      newTaskSteps.unshift({
        type: CustomNodeType.BASE,
        code: CustomNodeType.BASE,
        label: formatMessage({ id: 'customTask.type.BASE' }),
      });
      setTaskSteps(newTaskSteps);
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
    newTaskSteps.splice(newTaskSteps.length - 1, 0, step);
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

  function onDropInTaskFlow(dropResult) {
    const { removedIndex, addedIndex, payload } = dropResult;

    const startIndex = findIndex(taskSteps, { type: CustomNodeType.START });
    const endIndex = findIndex(taskSteps, { type: CustomNodeType.END });
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
    return taskSteps.map((step, index) => {
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
              form={form}
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
      const _taskSteps = [...taskSteps];
      _taskSteps.shift();
      form
        .validateFields()
        .then((value) => {
          const formValue = generateCustomTaskForm(value, taskCode, _taskSteps, programing);
          resolve(formValue);
        })
        .catch(() => {
        });
    });
  }

  async function submit() {
    let requestBody = await generateTaskData();
    if (requestBody === null) {
      message.error(formatMessage({ id: 'customTask.form.invalid' }));
      return;
    }

    // 校验sample是否合法
    const sample = JSON.parse(requestBody.sample);
    Object.keys(sample).forEach((taskCode) => {
      if (taskCode !== CustomNodeType.START) {
        const [customNodeType] = taskCode.split('_');
        if (!requestBody[CustomNodeTypeFieldMap[customNodeType]][taskCode]) {
          delete sample[taskCode];
        }
      }
    });
    requestBody.sample = JSON.stringify(sample);

    // 如果是更新，那么 code 不需要更新; 同时附上部分原始数据
    if (editingRow) {
      requestBody.id = editingRow.id;
      requestBody.code = editingRow.code;
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
        <div style={{ flex: 1 }}>
          <Form form={form} labelWrap>
            {renderFormBody()}
          </Form>
        </div>
        <div className={styles.topTool}>
          <Button danger onClick={gotoListPage}>
            <CloseOutlined /> <FormattedMessage id='app.button.return' />
          </Button>
          <Button type='primary' onClick={submit}>
            <SaveOutlined /> <FormattedMessage id='app.button.save' />
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
        <RedoOutlined /> <FormattedMessage id='customTasks.button.updateModel' />
      </Button>
    </div>
  );
};
export default connect(({ customTask, global }) => ({
  editingRow: customTask.editingRow,
  listVisible: customTask.listVisible,
  programing: global.programing,
}))(memo(CustomTaskForm));
