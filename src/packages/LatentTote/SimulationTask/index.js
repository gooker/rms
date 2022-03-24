import React, { useState, memo } from 'react';
import { Tooltip, Badge, Button, Tag, message, Modal, Form } from 'antd';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';

const SimulationTask = (props) => {
  const [loading, setLoading] = useState(false);
  const [selectRowKey, setSelectRowKey] = useState([]);

  const columns = [
    {
      title: <FormattedMessage id="app.task.id" />,
      dataIndex: 'taskId',
      align: 'center',
      width: 100,
      render: (text) => {
        return (
          <Tooltip title={text}>
            <span
              className={commonStyles.textLinks}
              onClick={() => {
                this.checkDetail(text);
              }}
            >
              {text ? '*' + text.substr(text.length - 6, 6) : null}
            </span>
          </Tooltip>
        );
      },
    },

    {
      title: <FormattedMessage id="app.task.type" />,
      dataIndex: 'type',
      align: 'center',
      width: 150,
      render: (text) => {
        const { allTaskTypes, agvType } = this.props;
        return allTaskTypes?.[agvType]?.[text] || text;
      },
    },
    {
      title: <FormattedMessage id="app.task.state" />,
      dataIndex: 'taskStatus',
      align: 'center',
      width: 120,
      render: (text) => {
        if (text != null) {
          return (
            <>11</>
            // <Badge
            //   status={TaskStateBageType[text]}
            //   text={formatMessage({ id: `app.task.state.${text}` })}
            // />
          );
        } else {
          return <FormattedMessage id="app.taskDetail.notAvailable" />;
        }
      },
    },
  ];

  return (
    <TablePageWrapper>
      <div>111</div>
      <TableWithPages
        bordered
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={[]}
        loading={loading}
        rowSelection={{
          selectedRowKeys: selectRowKey,
          onChange: (selectRowKey, selectRow) => {
            setSelectRowKey(selectRowKey);
          },
        }}
      />
    </TablePageWrapper>
  );
};
export default memo(SimulationTask);
