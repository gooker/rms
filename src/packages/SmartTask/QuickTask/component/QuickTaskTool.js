import React, { memo } from 'react';
import { Button, Radio } from 'antd';
import { DeleteOutlined, GroupOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';
import FormattedMessage from '@/components/FormattedMessage';
import { deleteQuickTask } from '@/services/smartTaskService';
import GroupManagementModal from './QuickTaskGroupModal';
import QuickTaskFormModal from './QuickTaskFormModal';
import commonStyle from '@/common.module.less';
import { QuickTaskTableView } from '@/packages/SmartTask/QuickTask/quickTaskConstant';

const QuickTaskTool = (props) => {
  const { dispatch, selectedRowKeys, cancelSelections, viewType } = props;

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
    <div style={{ marginBottom: 8 }}>
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
          <GroupOutlined /> <FormattedMessage id='quickTask.groupManage' />
        </Button>
        <Button
          onClick={() => {
            dispatch({ type: 'quickTask/initQuickTaskPage' });
          }}
        >
          <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
        </Button>
      </div>
      <div style={{ textAlign: 'end' }}>
        <Radio.Group
          buttonStyle='solid'
          value={viewType}
          size={'small'}
          onChange={({ target }) => {
            dispatch({ type: 'quickTask/updateViewType', payload: target.value });
          }}
        >
          <Radio.Button value={QuickTaskTableView.all}>
            <FormattedMessage id={'quickTask.viewType.all'} />
          </Radio.Button>
          <Radio.Button value={QuickTaskTableView.me}>
            <FormattedMessage id={'quickTask.viewType.me'} />
          </Radio.Button>
        </Radio.Group>
      </div>

      {/* 新建 & 更新快捷任务 */}
      <QuickTaskFormModal />

      {/* 新建 & 更新任务组 */}
      <GroupManagementModal />
    </div>
  );
};
export default connect(({ quickTask }) => ({
  viewType: quickTask.viewType,
}))(memo(QuickTaskTool));
