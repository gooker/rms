/*TODO: I18N*/ 
import React, { memo,useState } from 'react';
import FaultDefinitionSearch from './components/DefinitionSearch';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import { Popover } from 'antd';
import { convertToUserTimezone } from '@/utils/util';
import EditableCell from '@/packages/SmartTask/QuickTask/component/EditableCell';

const VehicleFaultDefinition = (props) => {
  const {} = props;

  const [isAdding, setIsAdding] = useState(false); // 标记当前是否正在执行新增操作
  const [editingKey, setEditingKey] = useState('');


  const column = [
    {
      title: <FormattedMessage id="app.fault.name" />,
      dataIndex: 'errorName',
      align: 'center',
      width: 200,
      render: (text) => {
        if (text) {
          if (text.length > 10) {
            return (
              <Popover
                content={<span style={{ display: 'inline-block', maxWidth: '300px' }}>{text}</span>}
                trigger="hover"
              >
                <span style={{ cursor: 'pointer' }}>{text.substr(0, 10)}...</span>
              </Popover>
            );
          } else {
            return <span>{text}</span>;
          }
        }
      },
    },
    {
      title: <FormattedMessage id="app.fault.level" />,
      dataIndex: 'level',
      align: 'center',
      width: 100,
    },
    {
      title: <FormattedMessage id="app.fault.code" />,
      dataIndex: 'errorCode',
      align: 'center',
      width: 100,
    },
    {
      title: <FormattedMessage id="app.fault.type" />,
      dataIndex: 'errorType',
      align: 'center',
      width: 140,
      render: (text) => {
        return text;
      },
    },
    {
      title: '故障附加数据1',
      dataIndex: 'preDataDefinition',
      align: 'center',
      width: 150,
    },
    {
      title: '故障附加数据2',
      dataIndex: 'curDataDefinition',
      align: 'center',
      width: 150,
    },
    {
      title: '自动恢复',
      dataIndex: 'autoRecover',
      align: 'center',
      width: 100,
      render: (text) => {
        if (text) {
          return <FormattedMessage id="app.faultDefinition.yes" />;
        } else {
          return <FormattedMessage id="app.faultDefinition.no" />;
        }
      },
    },
    {
      title: <FormattedMessage id="app.common.description" />,
      dataIndex: 'description',
      align: 'center',
      width: 200,
      render: (text) => {
        if (text) {
          if (text.length > 10) {
            return (
              <Popover
                content={<span style={{ display: 'inline-block', maxWidth: '300px' }}>{text}</span>}
                trigger="hover"
              >
                <span style={{ cursor: 'pointer' }}>{text.substr(0, 10)}...</span>
              </Popover>
            );
          } else {
            return <span>{text}</span>;
          }
        }
      },
    },
    {
      title: '额外信息',
      dataIndex: 'additionalContent',
      align: 'center',
      width: 200,
      render: (text) => {
        if (text) {
          if (text.length > 10) {
            return (
              <Popover
                content={<span style={{ display: 'inline-block', maxWidth: '300px' }}>{text}</span>}
                trigger="hover"
              >
                <span style={{ cursor: 'pointer' }}>{text.substr(0, 10)}...</span>
              </Popover>
            );
          } else {
            return <span>{text}</span>;
          }
        }
      },
    },
    {
      title: <FormattedMessage id="app.common.creationTime" />,
      dataIndex: 'createTime',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (text) => {
        return convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];




  return (
    <TablePageWrapper>
      <FaultDefinitionSearch />
      <TableWithPages columns={column} rowKey={({ code }) => code}
          components={{
            body: { cell: EditableCell },
          }} 
          dataSource={[]}/>
    </TablePageWrapper>
  );
};
export default memo(VehicleFaultDefinition);
