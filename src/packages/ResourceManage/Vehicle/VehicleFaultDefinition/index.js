import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Button, Popover } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  PlusOutlined,
  RedoOutlined,
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
import { fetchAllVehicleDefinition, deleteVehicleDefinition } from '@/services/resourceService';
import AddDefinition from './components/AddDefinition';
import commonStyles from '@/common.module.less';
import RmsConfirm from '@/components/RmsConfirm';

const VehicleFaultDefinition = () => {
  const [visible, setVisible] = useState(false); // 标记当前是否正在执行新增操作
  const [editing, setEditing] = useState(null);

  const [dataSource, setDataSource] = useState([]);
  const [searchValues, setSearchValues] = useState({});
  const [currentPage, setCurrentPage] = useState({ size: 10, current: 1 });
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
    },
    {
      title: <FormattedMessage id="app.fault.code" />,
      dataIndex: 'errorCode',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.fault.type" />,
      dataIndex: 'errorType',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.vehicleType" />,
      dataIndex: 'vehicleType',
      align: 'center',
    },

    {
      title: <FormattedMessage id="app.fault.autoRecover" />,
      dataIndex: 'autoRecover',
      align: 'center',
      render: (text) => {
        if (text) {
          return <FormattedMessage id="app.common.true" />;
        } else {
          return <FormattedMessage id="app.common.false" />;
        }
      },
    },

    {
      title: <FormattedMessage id="app.common.creationTime" />,
      dataIndex: 'createTime',
      align: 'center',
      fixed: 'right',
      render: (text) => {
        return convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: <FormattedMessage id="app.button.edit" />,
      dataIndex: 'id',
      align: 'center',
      render: (text, record) => (
        <EditOutlined
          style={{ color: '#1890FF', fontSize: 18 }}
          onClick={() => {
            setVisible(true);
            setEditing(record);
          }}
        />
      ),
    },
  ];

  async function getData(values) {
    const searchParams = values ? values : searchValues;
    const response = await fetchAllVehicleDefinition(searchParams);
    if (!dealResponse(response)) {
      setDataSource(response);
      // filterData(response);
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
        const response = await deleteVehicleDefinition(selectedRowKeys);
        if (!dealResponse(response, 1)) {
          getData();
        }
      },
    });
  }

  function searchData(values) {
    let newValues = {};
    if (values && !isEmptyPlainObject(values)) {
      newValues = { ...values };
    } else {
      newValues = {};
    }
    setSearchValues(values);
    getData(newValues);
  }

  function initialization() {
    RmsConfirm({
      content: formatMessage({ id: 'app.fault.init.confirm' }),
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
      fileName = `${formatMessage({ id: 'app.fault.exportFileNameWithParts' })}.json`;
    } else {
      currentData = [...dataSource];
      fileName = `${formatMessage({ id: 'app.fault.exportFileName' })}.json`;
    }
    const newJson = [];
    currentData.map((record) => {
      let currentRow = {
        errorName: record.errorName,
        errorCode: record.errorCode,
        level: record.level,
        errorType: record.errorType,
        vehicleType: record.vehicleType,
        adapterType: record.vehicleType,
        autoRecover: record.autoRecover,
      };

      let additionalInfo = {};
      record.additionalInfo &&
        Object.keys(record.additionalInfo).map((key) => {
          additionalInfo[key] = record.additionalInfo[key];
        });

      currentRow.additionalInfo = { ...additionalInfo };

      newJson.push(currentRow);
    });

    const currentJson = JSON.stringify(newJson, null, 2);
    const file = new File([currentJson], fileName, { type: 'text/plain;charset=utf-8' });
    saveAs(file);
  }

  function expandedRowRender(row) {
    return (
      <Row>
        {row?.additionalInfo &&
          Object.keys(row.additionalInfo).map((key) => (
            <Col key={key} span={8}>
              <span style={{ color: '#4c4a4a', fontWeight: 600, marginRight: 10 }}>{key}:</span>
              <span>{row.additionalInfo[key]}</span>
            </Col>
          ))}
      </Row>
    );
  }

  return (
    <TablePageWrapper>
      <>
        <FaultDefinitionSearch onSearch={searchData} />
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
            {/* <Button onClick={initialization}>
              <SettingOutlined /> <FormattedMessage id="app.fault.init" />
            </Button> */}
            <Button disabled={selectedRowKeys.length === 0} onClick={exportDefault}>
              <ExportOutlined /> <FormattedMessage id="app.button.download" />
            </Button>
            <Button
              onClick={() => {
                getData();
              }}
            >
              <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
      </>
      <TableWithPages
        columns={column}
        rowKey={({ id }) => id}
        dataSource={dataSource}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
          },
        }}
      />
      {visible && (
        <AddDefinition
          visible={visible}
          updateRecord={editing}
          onCancel={onCancel}
          allData={dataSource}
          onOk={() => {
            getData();
          }}
        />
      )}
    </TablePageWrapper>
  );
};
export default memo(VehicleFaultDefinition);
