import React, { memo } from 'react';
import { Button } from 'antd';
import { DeleteOutlined, GroupOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';
import FormattedMessage from '@/components/FormattedMessage';
import { deleteQuickTask } from '@/services/smartTaskService';
import GroupManagementModal from './QuickTaskGroupModal';
import QuickTaskFormModal from './QuickTaskFormModal';
import commonStyle from '@/common.module.less';

const QuickTaskTool = (props) => {
  const { dispatch, selectedRowKeys, cancelSelections } = props;

  function batchDeleteQuickTasks() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await deleteQuickTask(selectedRowKeys);
        if (!dealResponse(response, true)) {
          dispatch({ type: 'quickTask/getVisibleQuickTasks' });
          cancelSelections();
        }
      },
    });
  }

  return (
    <div className={commonStyle.tableToolLeft}>
      <Button
        type={'primary'}
        onClick={() => {
          dispatch({ type: 'quickTask/updateTaskModalVisible', payload: true });
        }}
      >
        <PlusOutlined /> <FormattedMessage id={'app.button.add'} />
      </Button>
      <Button danger disabled={selectedRowKeys.length === 0} onClick={batchDeleteQuickTasks}>
        <DeleteOutlined /> <FormattedMessage id={'app.button.delete'} />
      </Button>
      <Button
        onClick={() => {
          dispatch({ type: 'quickTask/updateGroupModalVisible', payload: true });
        }}
      >
        <GroupOutlined /> <FormattedMessage id="quickTask.groupManage" />
      </Button>
      <Button
        onClick={() => {
          dispatch({ type: 'quickTask/initQuickTaskPage' });
        }}
      >
        <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
      </Button>

      {/* 新建 & 更新快捷任务 */}
      <QuickTaskFormModal />

      {/* 新建 & 更新任务组 */}
      <GroupManagementModal />
    </div>
  );
};
export default connect()(memo(QuickTaskTool));
