import React, { memo, useEffect, useState } from 'react';
import { Divider, message, Switch, Tag, Typography } from 'antd';
import { find } from 'lodash';
import { connect } from '@/utils/RmsDva';
import Dictionary from '@/utils/Dictionary';
import { dealResponse, formatMessage, isNull, isStrictNull } from '@/utils/util';
import { saveQuickTask } from '@/services/smartTaskService';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import ExecuteQuickTaskModal from './component/ExecuteQuickTaskModal';
import VariableModificationModal from '@/components/VariableModification/VariableModificationModal';
import QuickTaskTool from './component/QuickTaskTool';
import ShardDrawer from './component/ShardDrawer';
import RmsConfirm from '@/components/RmsConfirm';
import styles from './quickTask.module.less';
import { checkQuickVariable, convertQuickTaskVarToRequestStruct } from '@/packages/SmartTask/QuickTask/quickTaskUtil';
import { executeCustomTask } from '@/services/commonService';

const Colors = Dictionary().color;
const drawerWidth = 378;

const QuickTask = (props) => {
  const {
    editing,
    dispatch,
    loading,
    customTasks,
    userTasks,
    quickTaskGroups,
    variableModalVisible,
    shardTaskModalVisible,
  } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    dispatch({ type: 'quickTask/initQuickTaskPage' });
    return () => {
      dispatch({ type: 'quickTask/unmount' });
    };
  }, []);

  const columns = [
    {
      title: <FormattedMessage id="quickTask.group.belongs" />,
      dataIndex: 'groupId',
      align: 'center',
      render: (text) => {
        if (isStrictNull(text)) {
          return (
            <span style={{ color: Colors.red }}>
              <FormattedMessage id="quickTask.group.noExist" />
            </span>
          );
        }
        const group = find(quickTaskGroups, { id: text });
        if (group) {
          return group.name;
        }
        return (
          <span style={{ color: Colors.red }}>
            <FormattedMessage id="quickTask.group.ismissing" />
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id="app.common.name" />,
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: <FormattedMessage id="menu.customTask" />,
      dataIndex: 'taskCode',
      align: 'center',
      render: (text) => {
        const targetCustomTask = find(customTasks, { code: text });
        return targetCustomTask?.name;
      },
    },
    {
      title: <FormattedMessage id="quickTask.operate.isConfirm" />,
      dataIndex: 'isNeedConfirm',
      align: 'center',
      render: (text) => (
        <Tag color="blue">
          <FormattedMessage id={`app.common.${text}`} />
        </Tag>
      ),
    },
    {
      title: <FormattedMessage id="quickTask.share" />,
      dataIndex: 'isShared',
      align: 'center',
      render: (text, record) => <Switch checked={text} onClick={() => share(record, text)} />,
    },
    {
      title: <FormattedMessage id="app.common.operation" />,
      align: 'center',
      render: (text, record) => (
        <>
          <Typography.Link
            onClick={() => {
              edit(record);
            }}
          >
            <FormattedMessage id={'app.button.edit'} />
          </Typography.Link>
          <Divider type={'vertical'} />
          <Typography.Link
            onClick={() => {
              editVariable(record);
            }}
          >
            <FormattedMessage id="quickTask.button.modifyVariable" />
          </Typography.Link>
          <Divider type={'vertical'} />
          <Typography.Link
            onClick={() => {
              execute(record);
            }}
          >
            <FormattedMessage id="app.button.execute" />
          </Typography.Link>
        </>
      ),
    },
  ];

  function onSelectChange(newSelectedRowKeys) {
    setSelectedRowKeys(newSelectedRowKeys);
  }

  function edit(record) {
    dispatch({
      type: 'quickTask/updateState',
      payload: {
        editing: record,
        taskModalVisible: true,
      },
    });
  }

  function editVariable(record) {
    dispatch({
      type: 'quickTask/updateState',
      payload: {
        editing: record,
        variableModalVisible: true,
      },
    });
  }

  /**
   * 先检查该快捷任务是否需要弹窗
   * 1. 首先只需要检查"可见"的项
   * 2. "必填"的项必须有值
   */
  function execute(record) {
    const showFormModal = checkQuickVariable(record.variable);
    if (showFormModal) {
      dispatch({
        type: 'quickTask/updateState',
        payload: {
          editing: record,
          executeModalVisible: true,
        },
      });
    } else {
      // 因为不需要填写表单，所以参数直接使用默认的
      const requestParam = convertQuickTaskVarToRequestStruct(record.variable);
      doExecution(requestParam, record.isNeedConfirm);
    }
  }

  function doExecution(requestParam, isNeedConfirm) {
    if (isNeedConfirm) {
      RmsConfirm({
        onOk: () => {
          sendTask(requestParam);
        },
      });
    } else {
      sendTask(requestParam);
    }
  }

  function sendTask(requestParam) {
    const customTask = find(customTasks, { code: requestParam.code });
    if (isNull(customTask)) {
      message.error(formatMessage({ id: 'variable.customTaskData.missing' }));
      return;
    }

    // 将customAction的key转换成step
    let customAction = {};
    Object.entries(requestParam.customAction).forEach(([nodeCode, data]) => {
      const index = customTask.codes.indexOf(nodeCode);
      customAction[`step${index}`] = data;
    });
    requestParam.customAction = customAction;
    executeCustomTask(requestParam).then((response) => {
      if (!dealResponse(response)) {
        message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      } else {
        message.error(formatMessage({ id: 'app.message.operateFailed' }));
      }
    });
  }

  function share(record, currentState) {
    // 如果还没有分享
    if (!currentState) {
      RmsConfirm({
        content: formatMessage({ id: 'quickTask.share.message' }),
        onOk: async () => {
          const response = await saveQuickTask({ ...record, isShared: true });
          if (!dealResponse(response)) {
            dispatch({ type: 'quickTask/getVisibleQuickTasks' });
          }
        },
      });
    } else {
      RmsConfirm({
        content: formatMessage({ id: 'quickTask.share.cancel.message' }),
        onOk: async () => {
          const response = await saveQuickTask({ ...record, isShared: false });
          if (!dealResponse(response)) {
            dispatch({ type: 'quickTask/getVisibleQuickTasks' });
          }
        },
      });
    }
  }

  async function onSaveVariable(customParams) {
    const quickTask = { ...editing };
    quickTask.variable = { ...quickTask.variable, ...customParams };
    const response = await saveQuickTask(quickTask);
    if (!dealResponse(response, true)) {
      dispatch({ type: 'quickTask/getVisibleQuickTasks' });
      dispatch({ type: 'quickTask/updateVariableModalVisible', payload: false });
    }
  }

  function onCancelEditingVariable() {
    dispatch({
      type: 'quickTask/updateState',
      payload: {
        editing: null,
        variableModalVisible: false,
      },
    });
  }

  function getCustomTask() {
    if (editing) {
      const { taskCode } = editing;
      return find(customTasks, { code: taskCode });
    }
    return null;
  }

  return (
    <>
      <TablePageWrapper style={{ position: 'relative' }}>
        <QuickTaskTool
          dispatch={dispatch}
          selectedRowKeys={selectedRowKeys}
          cancelSelections={() => {
            setSelectedRowKeys([]);
          }}
        />
        <TableWithPages
          rowKey={({ id }) => id}
          loading={loading}
          columns={columns}
          dataSource={userTasks}
          rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
        />
        <ShardDrawer />
        <div
          className={styles.drawerSwitcher}
          style={{ left: shardTaskModalVisible ? drawerWidth : 0 }}
          onClick={() => {
            dispatch({
              type: 'quickTask/updateShardTaskModalVisible',
              payload: !shardTaskModalVisible,
            });
          }}
        >
          <FormattedMessage id='quickTask.shared' />
        </div>
      </TablePageWrapper>

      {/* 编辑任务变量 */}
      <VariableModificationModal
        quickTask={editing}
        customTask={getCustomTask()}
        onOk={onSaveVariable}
        onCancel={onCancelEditingVariable}
      />

      {/*  执行快捷任务 */}
      <ExecuteQuickTaskModal customTask={getCustomTask()} />
    </>
  );
};
export default connect(({ quickTask, loading }) => ({
  editing: quickTask.editing,
  userTasks: quickTask.userTasks,
  customTasks: quickTask.customTasks,
  quickTaskGroups: quickTask.quickTaskGroups,
  shardTaskModalVisible: quickTask.shardTaskModalVisible,
  loading: loading.effects['quickTask/initQuickTaskPage'],
}))(memo(QuickTask));
