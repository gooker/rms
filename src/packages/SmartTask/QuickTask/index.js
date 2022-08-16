import React, { memo, useEffect, useState } from 'react';
import { Divider, message, Switch, Tag, Typography } from 'antd';
import { find } from 'lodash';
import { connect } from '@/utils/RmsDva';
import Dictionary from '@/utils/Dictionary';
import { dealResponse, formatMessage, isNull, isStrictNull, renderLabel } from '@/utils/util';
import { saveQuickTask } from '@/services/smartTaskService';
import { executeCustomTask } from '@/services/commonService';
import RmsConfirm from '@/components/RmsConfirm';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import CloneQuickTask from './component/CloneQuickTask';
import ExecuteQuickTaskModal from './component/ExecuteQuickTaskModal';
import VariableModificationModal from '@/components/VariableModification/VariableModificationModal';
import QuickTaskTool from './component/QuickTaskTool';
import { QuickTaskSource } from './quickTaskConstant';
import { checkQuickVariable, convertQuickTaskVarToRequestStruct } from './quickTaskUtil';

const Colors = Dictionary().color;

const QuickTask = (props) => {
  const {
    dispatch,
    editing,
    loading,
    tableLoading,
    viewType,
    quickTasks,
    customTasks,
    quickTaskGroups,
  } = props;

  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [copyItem, setCopyItem] = useState(null);

  useEffect(() => {
    dispatch({ type: 'quickTask/initQuickTaskPage' });
    return () => {
      dispatch({ type: 'quickTask/unmount' });
    };
  }, []);

  useEffect(() => {
    if (viewType === QuickTaskSource.own) {
      setDataSource(quickTasks[QuickTaskSource.own] ?? []);
    } else {
      setDataSource(quickTasks[QuickTaskSource.shared] ?? []);
    }
  }, [viewType, quickTasks]);

  const columns = [
    {
      title: <FormattedMessage id='quickTask.group.belongs' />,
      dataIndex: 'groupId',
      align: 'center',
      render: (text) => {
        if (isStrictNull(text)) {
          return (
            <span style={{ color: Colors.red }}>
              <FormattedMessage id='quickTask.group.noExist' />
            </span>
          );
        }
        const group = find(quickTaskGroups, { id: text });
        if (group) {
          return group.name;
        }
        return (
          <span style={{ color: Colors.red }}>
            <FormattedMessage id='quickTask.group.loss' />
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
        return renderLabel(targetCustomTask?.name);
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
      title: <FormattedMessage id='quickTask.share' />,
      dataIndex: 'isShared',
      align: 'center',
      render: (text, record) => (
        <Switch
          disabled={viewType === QuickTaskSource.shared}
          checked={text}
          onClick={() => share(record, text)}
        />
      ),
    },
    {
      title: <FormattedMessage id="app.common.operation" />,
      align: 'center',
      render: (text, record) => (
        <>
          {viewType === QuickTaskSource.own && (
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
                <FormattedMessage id='quickTask.button.modifyVariable' />
              </Typography.Link>
              <Divider type={'vertical'} />
            </>
          )}

          <Typography.Link
            onClick={() => {
              setCopyItem(record);
            }}
          >
            <FormattedMessage id='app.button.clone' />
          </Typography.Link>
          <Divider type={'vertical'} />
          <Typography.Link
            onClick={() => {
              execute(record);
            }}
          >
            <FormattedMessage id='app.button.execute' />
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
          loading={loading || tableLoading}
          columns={columns}
          dataSource={dataSource}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: (record) => ({
              disabled: record.source !== QuickTaskSource.own,
            }),
          }}
        />
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

      {/* 克隆快捷任务 */}
      <CloneQuickTask
        copy={copyItem}
        onCancel={() => {
          setCopyItem(null);
        }}
      />
    </>
  );
};
export default connect(({ quickTask, loading }) => ({
  editing: quickTask.editing,
  viewType: quickTask.viewType,
  quickTasks: quickTask.quickTasks,
  customTasks: quickTask.customTasks,
  quickTaskGroups: quickTask.quickTaskGroups,
  loading: loading.effects['quickTask/initQuickTaskPage'],
  tableLoading: loading.effects['quickTask/getVisibleQuickTasks'],
}))(memo(QuickTask));
