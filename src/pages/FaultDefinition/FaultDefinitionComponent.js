import React, { memo, useEffect, useState } from 'react';
import { Button, Divider, message, Modal } from 'antd';
import { DeleteOutlined, ExportOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';
import TablePageWrapper from '@/components/TablePageWrapper';
import FaultDefinitionSearchForm from '@/pages/FaultDefinition/FaultDefinitionSearchForm';
import TableWidthPages from '@/components/TableWidthPages';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, isNull } from '@/utils/utils';
import { deleteFaultDefinition, fetchDefinedFaults } from '@/services/api';
import FaultDefinitionForm from '@/pages/FaultDefinition/FaultDefinitionForm';
import RcsConfirm from '@/components/RcsConfirm';
import styles from './FaultDefinition.module.less';

const FaultDefinitionComponent = (props) => {
  const { agvType } = props;

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  async function getData(formatter) {
    setSelectedRowKeys([]);
    setLoading(true);
    const response = await fetchDefinedFaults(agvType);
    if (!dealResponse(response)) {
      if (typeof formatter === 'function') {
        setDataSource(formatter(response));
      } else {
        setDataSource(response);
      }
    } else {
      message.error(formatMessage({ id: 'app.message.fetchDataFailed' }));
    }
    setLoading(false);
  }

  function onSelectChange(selectedKeys) {
    setSelectedRowKeys(selectedKeys);
  }

  function editRow(row) {
    setEditing(row);
    setModalVisible(true);
  }

  async function deleteRow() {
    RcsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await deleteFaultDefinition(agvType, selectedRowKeys);
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.tip.operationFinish' }));
          getData();
        } else {
          message.success(formatMessage({ id: 'app.tip.operateFailed' }));
        }
      },
    });
  }

  async function initFaultDefinition() {
    RcsConfirm({
      content: formatMessage({ id: 'app.fault.init.confirm' }),
      onOk: async () => {
        const response = await initFaultDefinition(agvType);
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.tip.operationFinish' }));
          getData();
        } else {
          message.success(formatMessage({ id: 'app.tip.operateFailed' }));
        }
      },
    });
  }

  function exportFaultDefinition() {
    const fileName = `${formatMessage({
      id: `app.fault.${selectedRowKeys.length > 0 ? 'exportFileNameWithParts' : 'exportFileName'}`,
    })}.txt`;

    // 如果选择了条目就导出指定条目，否则就导出全部
    let selections = dataSource;
    if (selectedRowKeys.length > 0) {
      selections = dataSource.filter((item) => selectedRowKeys.includes(item.id));
    }
    const fileContent = JSON.stringify(
      selections.map((record) => ({
        errorName: record.errorName,
        errorCode: record.errorCode,
        level: record.level,
        preDataDefinition: record.preDataDefinition,
        curDataDefinition: record.curDataDefinition,
        description: record.description,
        autoRecover: record.autoRecover,
        additionalContent: record.additionalContent,
      })),
      null,
      2,
    );
    const file = new File([fileContent], fileName, {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(file);
  }

  const columns = [
    {
      title: formatMessage({ id: 'app.fault.code' }),
      dataIndex: 'errorCode',
      align: 'center',
      fixed: 'left',
    },
    {
      title: formatMessage({ id: 'app.fault.name' }),
      dataIndex: 'errorName',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.fault.level' }),
      dataIndex: 'level',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.fault.type' }),
      dataIndex: 'errorType',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.fault.description' }),
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.fault.preDataDefinition' }),
      dataIndex: 'preDataDefinition',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.fault.curDataDefinition' }),
      dataIndex: 'curDataDefinition',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.fault.additionalData' }),
      dataIndex: 'additionalContent',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.fault.autoRecover' }),
      dataIndex: 'autoRecover',
      align: 'center',
      width: 100,
      render: (text) => <FormattedMessage id={`app.common.${text}`} />,
    },
    {
      title: formatMessage({ id: 'app.common.operation' }),
      key: 'action',
      fixed: 'right',
      render: (text, record) => (
        <Button
          type={'link'}
          onClick={() => {
            editRow(record);
          }}
        >
          <FormattedMessage id={'app.button.edit'} />
        </Button>
      ),
    },
  ];

  return (
    <TablePageWrapper>
      <div>
        <FaultDefinitionSearchForm search={getData} />
        <Divider style={{ margin: '0 0 24px 0' }} />
        <div className={styles.buttons}>
          <Button
            type={'primary'}
            onClick={() => {
              setEditing(null);
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id={'app.button.add'} />
          </Button>
          <Button danger onClick={deleteRow} disabled={selectedRowKeys.length === 0}>
            <DeleteOutlined /> <FormattedMessage id={'app.button.delete'} />
          </Button>
          <Button danger onClick={initFaultDefinition}>
            <SettingOutlined /> <FormattedMessage id={'app.fault.init'} />
          </Button>
          <Button onClick={exportFaultDefinition}>
            <ExportOutlined /> <FormattedMessage id={'app.button.export'} />
          </Button>
        </div>
      </div>
      <TableWidthPages
        bordered
        scroll={{ x: 'max-content' }}
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey={({ id }) => id}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />
      <Modal
        destroyOnClose
        width={600}
        footer={null}
        visible={modalVisible}
        title={`${formatMessage({
          id: isNull(editing) ? 'app.button.add' : 'app.button.edit',
        })}${formatMessage({
          id: 'app.fault.definition',
        })}`}
        style={{ top: 20 }}
        maskClosable={false}
        closable={false}
      >
        <FaultDefinitionForm
          agvType={agvType}
          data={editing}
          refresh={getData}
          onCancel={() => {
            setModalVisible(false);
          }}
        />
      </Modal>
    </TablePageWrapper>
  );
};
export default memo(FaultDefinitionComponent);
