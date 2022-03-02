import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Button, Tag, Modal, message, Form, Input } from 'antd';
import {
  DeleteOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  ExportOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWidthPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import AddPodModal from './components/AddPodModal';
import { fetchPodListBySectionId, savePod, batchDeletePod } from '@/services/api';
import Dictionary from '@/utils/Dictionary';
import { formatMessage, dealResponse, isStrictNull } from '@/utils/util';
import commonStyles from '@/common.module.less';
import RmsConfirm from '@/components/RmsConfirm';

const PodManager = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [podList, setPodList] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [updateRow, setUpdateRow] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    async function init() {
      await getData();
    }
    init();
  }, []);

  async function getData() {
    setLoading(true);
    const response = await fetchPodListBySectionId();
    if (!dealResponse(response)) {
      setPodList(response);
      setCurrentList(response);
    }
    setLoading(false);
  }

  function deletepod() {
    const podIds = selectedRow.map((record) => record.podId);
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const res = await batchDeletePod(podIds);
        if (!dealResponse(res)) {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          cancelModal();
          getData();
        }
      },
    });
  }

  function onSelectChange(selectedKeys, selectedRow) {
    setSelectedRowKeys(selectedKeys);
    setSelectedRow(selectedRow);
  }

  const columns = [
    {
      title: <FormattedMessage id="app.pod.id" />,
      dataIndex: 'podId',
      align: 'center',
      fixed: 'left',
    },
    {
      title: <FormattedMessage id="app.agv.id" />,
      dataIndex: 'robotId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="sourcemanage.pod.length.bd" />,
      dataIndex: 'length',
      align: 'center',
    },
    {
      title: <FormattedMessage id="sourcemanage.pod.length.ac" />,
      dataIndex: 'width',
      align: 'center',
    },
    {
      title: <FormattedMessage id="sourcemanage.pod.area" />,
      dataIndex: 'zoneIds',
      align: 'center',
      render: (text) => {
        if (text && Array.isArray(text)) {
          return (
            <>
              {text.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </>
          );
        }
        return null;
      },
    },
    {
      title: <FormattedMessage id="app.common.position" />,
      dataIndex: 'cellId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="sourcemanage.pod.reserved" />,
      dataIndex: 'isReserved',
      align: 'center',
      render: (text) => {
        if (!text) {
          return <FormattedMessage id="app.common.false" />;
        }
        return <FormattedMessage id="app.common.true" />;
      },
    },
    {
      title: <FormattedMessage id="app.direction" />,
      dataIndex: 'angle',
      align: 'center',
      render: (text) => {
        const content = formatMessage({ id: Dictionary('podDirection', text) });
        return content || text;
      },
    },
  ];

  async function onSubmit(values) {
    const _values = {
      ...values,
      sectionId: window.localStorage.getItem('sectionId'),
    };
    if (updateRow) {
      _values.id = selectedRowKeys[0];
    }

    const response = await savePod(_values);
    if (!dealResponse(response)) {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      cancelModal();
      getData();
    }
  }

  function search() {
    const formValues = form.getFieldsValue();

    let result = [...podList];
    if (isStrictNull(formValues)) {
      setCurrentList(result);
      return;
    }
    const { podId } = formValues;
    if (!isStrictNull(podId)) {
      result = result.filter((item) => {
        return item.podId === podId;
      });
    }
    setCurrentList(result);
    return;
  }

  function cancelModal() {
    setVisible(false);
    setUpdateRow(null);
    setSelectedRowKeys([]);
    setSelectedRow([]);
  }

  function exportPodExcel() {
    const podSource = [...currentList];

    const excelData = [];
    podSource.forEach((rowData) => {
      const dataItem = {};
      columns.forEach(({ title, dataIndex }) => {
        dataItem[title] = rowData[dataIndex];
      });
      excelData.push(dataItem);
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'pod');
    XLSX.writeFile(wb, 'pod.xlsx');
  }
  return (
    <TablePageWrapper>
      <div>
        <Form form={form}>
          <Row>
            <Col>
              <Form.Item label={<FormattedMessage id="app.pod.id" />} name="podId">
                <Input allowClear />
              </Form.Item>
            </Col>
            <Col offset={1}>
              <Form.Item>
                <Button type="primary" onClick={search}>
                  <SearchOutlined /> <FormattedMessage id="app.button.search" />
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Row>
          <Col flex="auto" className={commonStyles.tableToolLeft}>
            <Button
              type="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="app.button.add" />
            </Button>
            <Button
              disabled={selectedRowKeys.length !== 1}
              onClick={() => {
                setVisible(true);
                setUpdateRow(selectedRow[0]);
              }}
            >
              <EditOutlined /> <FormattedMessage id="app.button.update" />
            </Button>
            <Button danger disabled={selectedRowKeys.length === 0} onClick={deletepod}>
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>
            <Button onClick={exportPodExcel} disabled={currentList.length === 0}>
              <ExportOutlined /> <FormattedMessage id="sourcemanage.podManager.exportPod" />
            </Button>
            <Button onClick={getData}>
              <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
      </div>
      <TableWidthPages
        bordered
        loading={loading}
        columns={columns}
        dataSource={currentList}
        rowKey={({ id }) => id}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        scroll={{ x: 'max-content' }}
      />
      <Modal
        visible={visible}
        onCancel={cancelModal}
        title={
          updateRow
            ? formatMessage({ id: 'app.button.update' })
            : formatMessage({ id: 'app.button.add' })
        }
        width={500}
        destroyOnClose
        footer={null}
      >
        <AddPodModal onSubmit={onSubmit} updateRow={updateRow} onCancel={cancelModal} />
      </Modal>
    </TablePageWrapper>
  );
};
export default memo(PodManager);
