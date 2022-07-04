/*TODO: I18N*/
import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Button, Popover } from 'antd';
import {
  DeleteOutlined,
  ExportOutlined,
  PlusOutlined,
  RedoOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { saveAs } from 'file-saver';
import FaultDefinitionSearch from './components/DefinitionSearch';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import {
  convertToUserTimezone,
  dealResponse,
  formatMessage,
  isEmptyPlainObject,
  isStrictNull,
} from '@/utils/util';
import AddDefinition from './components/AddDefinition';
import commonStyles from '@/common.module.less';
import RmsConfirm from '@/components/RmsConfirm';

const VehicleFaultDefinition = (props) => {
  const {} = props;

  const [visible, setVisible] = useState(false); // 标记当前是否正在执行新增操作
  const [editing, setEditing] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    getData();
  }, []);

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

  async function getData() {
    const response = await xxx1();
    if (!dealResponse(response)) {
      setDataSource(response);
      filterData(response);
      onCancel();
    }
  }

  function onCancel() {
    setVisible(false);
    setEditing(null);
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }

  function filterData(list, formValues) {
    let newData = [...list];
    if (isEmptyPlainObject(formValues)) {
      setDataSource(newData);
      return;
    }
    const { errorCode, errorName, level } = formValues;
    if (!isStrictNull(errorCode)) {
      newData = newData.filter((item) => {
        return item.errorCode === errorCode;
      });
    }

    if (!isStrictNull(errorName)) {
      newData = newData.filter((item) => {
        return item.errorName === errorName;
      });
    }
    if (!isStrictNull(level)) {
      newData = newData.filter((item) => level === item.level);
    }

    setDataSource(newData);
  }

  function deleteFault() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await xxx();
        if (!dealResponse(response, 1)) {
          getData();
        }
      },
    });
  }

  function initialization() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.doubleConfirm' }),
      onOk: async () => {
        //  TODO: 接口
      },
    });
  }

  // 导出故障定义JSON数据
  function exportDefault() {
    let fileName = null;
    let currentData = [];
    if (selectedRows?.length > 0) {
      currentData = [...selectedRows];
      fileName = '故障信息数据(部分).txt';
    } else {
      currentData = [...dataSource];
      fileName = '故障信息数据(全部).txt';
    }
    const currentJson = JSON.stringify(
      currentData.map((record) => {
        return {
          errorName: record.errorName,
          errorCode: record.errorCode,
          level: record.level,
          preDataDefinition: record.preDataDefinition,
          curDataDefinition: record.curDataDefinition,
          description: record.description,
          autoRecover: record.autoRecover,
          additionalContent: record.additionalContent,
        };
      }),
      null,
      2,
    );

    const file = new File([currentJson], fileName, { type: 'text/plain;charset=utf-8' });
    saveAs(file);
  }

  return (
    <TablePageWrapper>
      <>
        <FaultDefinitionSearch onSearch={filterData} data={dataSource} />
        <Row gutter={24} justify={'space-between'}>
          <Col className={commonStyles.tableToolLeft} flex="auto">
            <Button
              type="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="app.button.add" />
            </Button>
            <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteFault}>
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>
            <Button onClick={initialization}>
              <SettingOutlined /> 一键初始化
            </Button>
            <Button disabled={selectedRowKeys.length === 0} onClick={exportDefault}>
              <ExportOutlined /> 导出
            </Button>
            <Button onClick={getData}>
              <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
      </>
      <TableWithPages
        columns={column}
        rowKey={({ code }) => code}
        dataSource={dataSource}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
          },
        }}
      />
      {visible && (
        <AddDefinition visible={visible} onCancel={onCancel} allData={dataSource} onOk={geData} />
      )}
    </TablePageWrapper>
  );
};
export default memo(VehicleFaultDefinition);
