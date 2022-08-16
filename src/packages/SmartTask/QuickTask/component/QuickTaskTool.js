import React, { memo, useState } from 'react';
import { Button, Divider, Radio } from 'antd';
import { DeleteOutlined, GroupOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';
import FormattedMessage from '@/components/FormattedMessage';
import { deleteQuickTask } from '@/services/smartTaskService';
import GroupManagementModal from './QuickTaskGroupModal';
import QuickTaskFormModal from './QuickTaskFormModal';
import commonStyle from '@/common.module.less';
import { QuickTaskSource } from '@/packages/SmartTask/QuickTask/quickTaskConstant';
import { fetchCustomTaskList } from '@/services/commonService';

const QuickTaskTool = (props) => {
  const { dispatch, selectedRowKeys, cancelSelections, viewType } = props;

  const [loading, setLoading] = useState(false);

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

  function openCreationModal() {
    setLoading(true);
    fetchCustomTaskList().then((response) => {
      const payload = { taskModalVisible: true };
      if (!dealResponse(response)) {
        payload.customTasks = response;
      }
      dispatch({ type: 'quickTask/updateState', payload });
      setLoading(false);
    });
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <div className={commonStyle.tableToolLeft}>
        <Button type={'primary'} onClick={openCreationModal} loading={loading}>
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
      <Divider style={{ margin: '0 0 15px 0' }} />
      <div>
        <Radio.Group
          buttonStyle='solid'
          value={viewType}
          onChange={({ target }) => {
            dispatch({ type: 'quickTask/updateViewType', payload: target.value });
          }}
        >
          <Radio.Button value={QuickTaskSource.own}>
            <FormattedMessage id={'quickTask.viewType.own'} />
          </Radio.Button>
          <Radio.Button value={QuickTaskSource.shared}>
            <FormattedMessage id={'quickTask.viewType.shared'} />
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
