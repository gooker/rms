import React, { memo, useEffect, useState } from 'react';
import TablePageWrapper from '@/components/TablePageWrapper';
import { Badge, Button, Checkbox, Col, Form, Modal, Row, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { fetchLatentToteStations, updateLatentToteStation } from '@/services/latentToteService';
import { dealResponse, formatMessage, isNull, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { IconFont } from '@/components/IconFont';
import TableWithPages from '@/components/TableWithPages';
import StationBindingComponent from './components/StationBindingComponent';
import StationEditComponent from './components/StationEditComponent';
import StationFaultInfo from './components/StationFaultInfo';
import RmsConfirm from '@/components/RmsConfirm';
import commonStyles from '@/common.module.less';

const ChargerList = () => {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(['BINDING', 'UNBINDING']);
  const [stationList, setStationList] = useState([]);
  const [bindVisible, setBindVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    async function init() {
      await getList();
    }
    init();
  }, []);

  const columns = [
    {
      title: <FormattedMessage id="app.form.hardwareId" />,
      dataIndex: 'hardwareId',
      align: 'center',
      fixed: 'left',
      render: (text, record) => {
        return (
          <Tooltip title={text}>
            <span
              className={commonStyles.textLinks}
              onClick={() => {
                setDetailRecord(record);
              }}
            >
              {text ?? null}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="app.map.station" />,
      dataIndex: 'stationCode',
      align: 'center',
    },

    {
      title: <FormattedMessage id="app.common.status" />,
      dataIndex: 'status',
      align: 'center',
      render: (text) => {
        if (!isNull(text)) {
          if (text === 'NORMAL') {
            return <Badge color={'red'} text={formatMessage({ id: 'app.vehicle.exception' })} />;
          }
          return <Badge color={'green'} text={formatMessage({ id: 'app.vehicle.normal' })} />;
        }
      },
    },

    {
      title: <FormattedMessage id="latentTote.station.simulatedStatus" />,
      align: 'center',
      dataIndex: 'simulatedStatus',
      render: (text) => {
        if (!isNull(text)) {
          if (text) {
            return <FormattedMessage id="app.common.true" />;
          }
          return <FormattedMessage id="app.common.false" />;
        }
      },
    },
    {
      title: <FormattedMessage id="latentTote.station.workStatus" />,
      dataIndex: 'workStatus',
      align: 'center',
      render: (text) => {
        if (!isNull(text)) {
          if (text === 'START') {
            return (
              <Badge color={'green'} text={formatMessage({ id: 'monitor.station.status.START' })} />
            );
          }
          if (text === 'PAUSE') {
            return (
              <Badge
                color={'yellow'}
                text={formatMessage({ id: 'monitor.station.status.PAUSE' })}
              />
            );
          }
          if (text === 'STOP') {
            return (
              <Badge color={'gray'} text={formatMessage({ id: 'monitor.station.status.END' })} />
            );
          }
        }
        return text;
      },
    },

    {
      title: <FormattedMessage id="latentTote.station.maxPod" />,
      dataIndex: 'maxPod',
      align: 'center',
    },
    {
      title: <FormattedMessage id="latentTote.station.workModel" />,
      dataIndex: 'workModel',
      align: 'center',
      render: (text) => {
        if (!isNull(text)) {
          return formatMessage({ id: `latentTote.station.workModel.${text}` });
        }
      },
    },

    {
      title: <FormattedMessage id="app.common.operation" />,
      dataIndex: 'id',
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <div>
          {record.workStatus !== 'STOP' && (
            <>
              <Button
                size={'small'}
                type="link"
                onClick={() => {
                  statusSwitch({ id: record.id, editType: 'EDIT_STATUS', workStatus: 'STOP' });
                }}
              >
                <FormattedMessage id="app.simulateTask.state.STOP" />
              </Button>
            </>
          )}

          {record.workStatus === 'START' ? (
            <Button
              size={'small'}
              type="link"
              onClick={() => {
                statusSwitch({ id: record.id, editType: 'EDIT_STATUS', workStatus: 'PAUSE' });
              }}
            >
              <FormattedMessage id="app.triggerState.pause" />
            </Button>
          ) : (
            <Button
              size={'small'}
              type="link"
              onClick={() => {
                statusSwitch({ id: record.id, editType: 'EDIT_STATUS', workStatus: 'START' });
              }}
            >
              <FormattedMessage id="app.button.turnOn" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const expandColumns = [
    {
      title: <FormattedMessage id="app.vehicle.ip" />,
      dataIndex: 'ip',
    },

    {
      title: <FormattedMessage id="vehicle.port" />,
      dataIndex: 'port',
    },

    {
      title: <FormattedMessage id="app.activity.hardwareVersion" />,
      dataIndex: 'hardwareVersion',
    },
    {
      title: <FormattedMessage id="app.activity.softwareVersion" />,
      dataIndex: 'softwareVersion',
    },
  ];

  function expandedRowRender(record) {
    return (
      <Row>
        {Object.keys(record?.otherParameterMap).length > 0 && (
          <>
            {/* <Row> */}
            {Object.entries(record?.otherParameterMap).map(([key, value]) => (
              <Col key={key} flex="auto" style={{ marginRight: 20 }}>
                <span>{key}</span>
                <span>:</span>
                <span style={{ marginLeft: 5 }}>{value}</span>
              </Col>
            ))}
            {/* </Row> */}
          </>
        )}

        {/* <Row style={{ margin: '10px 0px' }}> */}
        {expandColumns.map(({ title, dataIndex, render }, index) => (
          <Col key={index} flex="auto" style={{ marginRight: 20 }}>
            <span>{title}</span>
            <span>:</span>
            <span style={{ marginLeft: 5 }}>
              {typeof render === 'function' ? render(record[dataIndex], record) : record[dataIndex]}
            </span>
          </Col>
        ))}
        {/* </Row> */}
      </Row>
    );
  }

  async function getList(value) {
    setLoading(true);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    const params = {
      bindingStatus: isStrictNull(value)
        ? searchValue?.length === 2
          ? 'ALL '
          : searchValue.toString()
        : value,
    };
    const response = await fetchLatentToteStations(params);
    if (!dealResponse(response)) {
      setStationList(response ?? []);
    }
    setLoading(false);
  }

  //  工作状态
  async function statusSwitch(params) {
    const response = await updateLatentToteStation(params);
    if (!dealResponse(response, 1)) {
      getList();
    }
  }

  function onSelectChange(selectedKeys, selectedRows) {
    setSelectedRowKeys(selectedKeys);
    setSelectedRows(selectedRows);
  }

  // 删除
  function deleteStation() {
    // const workStatus = selectedRows[0]?.workStatus;
    // if (workStatus !== 'STOP') {
    //   message.error('非停止状态不能删除');
    //   return;
    // }
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await updateLatentToteStation({
          id: selectedRowKeys[0],
          editType: 'REMOVE',
        });
        if (!dealResponse(response, 1)) {
          getList();
        }
      },
    });
  }

  //   绑定 && 编辑
  async function handleSubmit(currentData) {
    const response = await updateLatentToteStation(currentData);
    if (!dealResponse(response, 1)) {
      handelCancel();
      getList();
    }
  }

  function handelCancel() {
    setBindVisible(false);
    setEditVisible(false);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setDetailRecord(null);
  }

  // search
  function onSearchValueChange(e) {
    setSearchValue(e);
    const newValue = e?.length === 2 ? 'ALL ' : e.toString();
    getList(newValue);
  }

  return (
    <TablePageWrapper>
      <div>
        <Row>
          <Form.Item
            label={<FormattedMessage id="translator.languageManage.displayMode" />}
            width={'100%'}
          >
            <Checkbox.Group onChange={onSearchValueChange} value={searchValue}>
              <Checkbox
                value="BINDING"
                disabled={searchValue.length === 1 && searchValue.toString() === 'BINDING'}
              >
                <FormattedMessage id="app.button.isbinding" />
              </Checkbox>
              <Checkbox
                value="UNBINDING"
                disabled={searchValue.length === 1 && searchValue.toString() === 'UNBINDING'}
              >
                <FormattedMessage id="app.button.unbounded" />
              </Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Row>
        <Row style={{ display: 'flex', padding: '0 0 10px 0' }}>
          <Col flex="auto" className={commonStyles.tableToolLeft}>
            <Button
              type="primary"
              disabled={selectedRowKeys.length !== 1}
              onClick={() => {
                setBindVisible(true);
              }}
            >
              <IconFont type="icon-assign" /> <FormattedMessage id="app.button.bind" />
            </Button>
            <Button
              disabled={selectedRowKeys.length !== 1}
              onClick={() => {
                setEditVisible(true);
              }}
            >
              <EditOutlined /> <FormattedMessage id="app.button.edit" />
            </Button>

            <Button disabled={selectedRowKeys.length !== 1} onClick={deleteStation}>
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>

            <Button
              type="primary"
              ghost
              onClick={() => {
                getList();
              }}
            >
              <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
      </div>

      <TableWithPages
        bordered
        scroll={{ x: 'max-content' }}
        loading={loading}
        columns={columns}
        dataSource={stationList}
        rowKey={({ id }) => id}
        rowSelection={{
          selectedRowKeys,
          selectedRows,
          onChange: onSelectChange,
        }}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
        }}
      />
      {/* 绑定  */}
      <Modal
        destroyOnClose
        title={<FormattedMessage id="latentTote.mainStationCode" />}
        visible={bindVisible}
        onCancel={handelCancel}
        width={420}
        footer={null}
      >
        <StationBindingComponent
          submit={handleSubmit}
          cancel={handelCancel}
          data={selectedRows[0]}
        />
      </Modal>
      {/* 编辑 */}
      <Modal
        destroyOnClose
        title={<FormattedMessage id="app.button.edit" />}
        visible={editVisible}
        onCancel={handelCancel}
        width={420}
        footer={null}
      >
        <StationEditComponent submit={handleSubmit} cancel={handelCancel} data={selectedRows[0]} />
      </Modal>

      {/* 工作站异常信息 */}
      <Modal
        destroyOnClose
        title={<FormattedMessage id="latentTote.station.errorInfo" />}
        visible={!isNull(detailRecord)}
        onCancel={handelCancel}
        width={520}
        footer={null}
      >
        <StationFaultInfo cancel={handelCancel} record={detailRecord} />
      </Modal>
    </TablePageWrapper>
  );
};
export default memo(ChargerList);
