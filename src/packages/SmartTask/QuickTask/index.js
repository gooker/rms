import React, { memo, useEffect, useState } from 'react';
import { Button } from 'antd';
import { DeleteOutlined, PlusOutlined, ShareAltOutlined } from '@ant-design/icons';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyle from '@/common.module.less';
import QuickTaskFormModal from '@/packages/SmartTask/QuickTask/component/QuickTaskFormModal';
import { getCustomTaskList } from '@/services/commonService';
import { dealResponse, formatMessage } from '@/utils/util';
import { message } from 'antd';

const QuickTask = () => {
  const [groups, setGroups] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [customTasks, setCustomTasks] = useState([]);
  const [creationVisible, setCreationVisible] = useState(false);

  useEffect(() => {
    getCustomTaskList().then((response) => {
      if (dealResponse(response)) {
        message.error(
          formatMessage(
            { id: 'app.message.fetchFailTemplate' },
            { type: formatMessage({ id: 'menu.customTask' }) },
          ),
        );
      } else {
        setCreationVisible(setCustomTasks);
      }
    });
  }, []);

  return (
    <TablePageWrapper>
      <div className={commonStyle.tableToolLeft}>
        <Button
          type={'primary'}
          onClick={() => {
            setCreationVisible(true);
          }}
        >
          <PlusOutlined /> <FormattedMessage id={'app.button.add'} />
        </Button>
        <Button>
          <DeleteOutlined /> <FormattedMessage id={'app.button.delete'} />
        </Button>
        <Button>
          <ShareAltOutlined /> <FormattedMessage id={'quickTask.share'} />
        </Button>
      </div>
      <TableWithPages />

      {/* 新建 & 更新快接任务 */}
      <QuickTaskFormModal
        visible={creationVisible}
        onOk={() => {
        }}
        onCancel={() => {
          setCreationVisible(false);
        }}
      />
    </TablePageWrapper>
  );
};
export default memo(QuickTask);
