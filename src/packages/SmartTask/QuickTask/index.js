/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Divider, Switch, Tag, Typography } from 'antd';
import { find } from 'lodash';
import { connect } from '@/utils/RmsDva';
import Dictionary from '@/utils/Dictionary';
import { dealResponse, isStrictNull } from '@/utils/util';
import { saveQuickTask } from '@/services/smartTaskService';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import VariableModificationModal from '@/components/VariableModification/VariableModificationModal';
import QuickTaskTool from './component/QuickTaskTool';
import ShardDrawer from './component/ShardDrawer';
import RmsConfirm from '@/components/RmsConfirm';
import styles from './quickTask.module.less';

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
      title: '所属组',
      dataIndex: 'groupId',
      align: 'center',
      render: (text) => {
        if (isStrictNull(text)) {
          return <span style={{ color: Colors.red }}>暂无分组</span>;
        }
        const group = find(quickTaskGroups, { id: text });
        if (group) {
          return group.name;
        }
        return <span style={{ color: Colors.red }}>组丢失</span>;
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '自定义任务',
      dataIndex: 'taskCode',
      align: 'center',
      render: (text) => {
        const targetCustomTask = find(customTasks, { code: text });
        return targetCustomTask?.name;
      },
    },
    {
      title: '确认操作',
      dataIndex: 'isNeedConfirm',
      align: 'center',
      render: (text) => (
        <Tag color='blue'>
          <FormattedMessage id={`app.common.${text}`} />
        </Tag>
      ),
    },
    {
      title: '分享',
      dataIndex: 'isShared',
      align: 'center',
      render: (text, record) => <Switch checked={text} onClick={() => share(record, text)} />,
    },
    {
      title: '操作',
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
            修改变量
          </Typography.Link>
          <Divider type={'vertical'} />
          <Typography.Link
            onClick={() => {
              execute(record);
            }}
          >
            执行
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

  function execute(record) {
    dispatch({
      type: 'quickTask/updateState',
      payload: {
        editing: record,
        executeModalVisible: true,
      },
    });
  }

  function share(record, currentState) {
    // 如果还没有分享
    if (!currentState) {
      RmsConfirm({
        content: '分享该快捷任务后, 其他用户会浏览到该记录并且可以进行复制操作, 是否确定分享?',
        onOk: async () => {
          const response = await saveQuickTask({ ...record, isShared: true });
          if (!dealResponse(response)) {
            dispatch({ type: 'quickTask/getVisibleQuickTasks' });
          }
        },
      });
    } else {
      RmsConfirm({
        content: '取消分享该快捷任务后, 其他用户将无法浏览到该条记录, 是否确定取消分享?',
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
          已分享
        </div>
      </TablePageWrapper>

      {/* 编辑任务变量 */}
      <VariableModificationModal
        visible={variableModalVisible}
        quickTask={editing}
        customTask={getCustomTask()}
        onOk={onSaveVariable}
        onCancel={onCancelEditingVariable}
      />

      {/*  执行快捷任务 */}
      {/*<ExecuteQuickTaskModal customTask={getCustomTask()} />*/}
    </>
  );
};
export default connect(({ quickTask, loading }) => ({
  editing: quickTask.editing,
  userTasks: quickTask.userTasks,
  customTasks: quickTask.customTasks,
  quickTaskGroups: quickTask.quickTaskGroups,
  variableModalVisible: quickTask.variableModalVisible,
  shardTaskModalVisible: quickTask.shardTaskModalVisible,
  loading: loading.effects['quickTask/initQuickTaskPage'],
}))(memo(QuickTask));
