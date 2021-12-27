import React, { memo, useEffect, useState } from 'react';
import TablePageWrapper from '@/components/TablePageWrapper';
import { Tag, Badge, Button, Row, Col, Switch, message, Modal } from 'antd';
import Dictionary from '@/utils/Dictionary';
import { Permission } from '@/utils/Permission';
import {
  fetchChargeManagerList,
  batchDeleteChargerPile,
  batchUnbundChargerPile,
  clearChargerPileFaultById,
  AddChargerPile,
  fetchUpdateCharger,
} from '@/services/api';
import { dealResponse, formatMessage, getSuffix, isNull } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import TableWidthPages from '@/components/TableWidthPages';
import BindingChargeComponent from './components/BindingChargeComponent';
import RcsConfirm from '@/components/RcsConfirm';
import commonStyles from '@/common.module.less';

const { green, blue, pink, cyan, yellow, gray, red } = Dictionary('color');
const statusColor = {
  DISABLED: green,
  OFFLINE: gray,
  AVAILABLE: green,
  ASSIGNED: blue,
  CONNECTING: pink,
  CONNECTED: cyan,
  CHARGER_TIME_OUT_EXCEPTION: pink,
  CHARGING: yellow,
  ERROR: red,
};

const ChargeManagerment = () => {
  const [loading, setLoading] = useState(false);
  const [chargeList, setChargeList] = useState([]);
  const [chargeVisibleModal, setChargeVisibleModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState(null);

  useEffect(() => {
    async function init() {
      await fetchChargeList();
    }
    init();
  }, []);

  const columns = [
    {
      title: <FormattedMessage id="app.form.hardwareId" />,
      dataIndex: 'hardwareId',
      align: 'center',
      fixed: 'left',
    },
    {
      title: <FormattedMessage id="app.agv.ip" />,
      dataIndex: 'ip',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.agv.port" />,
      dataIndex: 'port',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.type" />,
      dataIndex: 'type',
      align: 'center',
      render: (type) => {
        if (!isNull(type)) {
          return (
            <Tag color="green" key={type}>
              {formatMessage({ id: Dictionary('chargerType', type) }) || type}
            </Tag>
          );
        }
      },
    },
    {
      title: <FormattedMessage id="app.activity.hardwareVersion" />,
      dataIndex: 'hardwareVersion',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.activity.softwareVersion" />,
      dataIndex: 'softwareVersion',
      align: 'center',
    },

    {
      title: <FormattedMessage id="chargeManager.chargeCurrent" />,
      align: 'center',
      dataIndex: 'currentElectricity',
      render: (text) => {
        if (!isNull(text)) {
          return <Badge status="success" text={getSuffix(text, ' A')} />;
        }
      },
    },
    {
      title: <FormattedMessage id="chargeManager.fitbattery" />,
      dataIndex: 'batteryType',
      align: 'center',
      render: (type) => {
        if (!isNull(type)) {
          return (
            <Tag color="green" key={type}>
              {formatMessage({ id: Dictionary('batteryType', type) })}
            </Tag>
          );
        }
        return type;
      },
    },
    {
      title: <FormattedMessage id="chargeManager.chargingStatus" />,
      dataIndex: 'statusMerge',
      align: 'center',
      render: (text) => {
        if (!isNull(text)) {
          return (
            <Tag color={statusColor[text]}>
              {formatMessage({ id: Dictionary('chargerStatus', text) })}
            </Tag>
          );
        }
      },
    },
    {
      title: <FormattedMessage id="chargeManager.temperature" />,
      dataIndex: 'chargerTemperature',
      align: 'center',
      render: (text) => {
        if (!isNull(text)) {
          return <Badge status="success" text={getSuffix(text, '°c')} />;
        }
      },
    },
    {
      title: <FormattedMessage id="chargeManager.mapCharging" />,
      align: 'name',
      width: 200,
      dataIndex: 'requestTx',
    },
    {
      title: <FormattedMessage id="chargeManager.bindStatus" />,
      align: 'center',
      width: 200,
      dataIndex: 'name',
      render: (text) => {
        if (!isNull(text)) {
          return (
            <Button type="link">
              <FormattedMessage id="app.button.isbinding" />
            </Button>
          );
        }
        return (
          <Button type="text">
            <FormattedMessage id="app.button.unbounded" />
          </Button>
        );
      },
    },
    {
      title: <FormattedMessage id="app.common.operation" />,
      dataIndex: 'disabled',
      align: 'center',
      width: 250,
      fixed: 'right',
      render: (text, record) => {
        return (
          <Permission id="/charge/chargeMangerBind/switchAvailable">
            <Switch
              checked={!isNull(text) && !text}
              onClick={(checked) => {
                statusSwitch({ ...record, disabled: !checked });
              }}
              checkedChildren={formatMessage({ id: 'app.common.enabled' })}
              unCheckedChildren={formatMessage({ id: 'app.common.disabled' })}
            />
          </Permission>
        );
      },
    },
  ];

  async function fetchChargeList() {
    setLoading(true);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    const response = await fetchChargeManagerList();
    if (!dealResponse(response)) {
      setChargeList(response);
    }
    setLoading(false);
  }

  async function statusSwitch(params) {
    const response = await fetchUpdateCharger(params);
    if (!dealResponse(response)) {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      fetchChargeList();
    }
  }

  function onSelectChange(selectedKeys, selectedRows) {
    setSelectedRowKeys(selectedKeys);
    setSelectedRows(selectedRows);
  }

  function deleteCharge() {
    RcsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await batchDeleteChargerPile(selectedRowKeys);
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          fetchChargeList();
        }
      },
    });
  }

  // 清除故障
  function clearFault() {
    const _row = chargeList.filter(({ hardwareId }) => hardwareId);
    RcsConfirm({
      content: formatMessage({ id: 'chargeManager.clearFault.confirm' }),
      onOk: async () => {
        const response = await clearChargerPileFaultById(_row.hardwareId);
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          fetchChargeList();
        }
      },
    });
  }

  function unBindCharge() {
    RcsConfirm({
      content: formatMessage({ id: 'chargeManager.batchUnBind.confirm' }),
      onOk: async () => {
        const response = await batchUnbundChargerPile(selectedRowKeys);
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          fetchChargeList();
        }
      },
    });
  }

  async function handleSubmit(values) {
    const currentData = { ...values };
    const { selectedRows } = this.state;
    currentData.hardwareId = selectedRows[0].id;
    const response = await AddChargerPile(currentData);
    if (!dealResponse(response)) {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      setChargeVisibleModal(false);
      fetchChargeList();
    }
  }

  return (
    <TablePageWrapper>
      <Row style={{ display: 'flex', padding: '0 0 20px 0' }}>
        <Col flex="auto" className={commonStyles.tableToolLeft}>
          <Button
            type="primary"
            disabled={chargeList.length === 0}
            onClick={() => {
              setChargeVisibleModal(true);
            }}
          >
            <FormattedMessage id="app.button.bind" />
          </Button>
          <Button disabled={selectedRowKeys.length === 0}>
            <FormattedMessage id="app.button.edit" />
          </Button>
          <Button disabled={selectedRowKeys.length === 0} onClick={unBindCharge}>
            <FormattedMessage id="app.button.unbind" />
          </Button>
          <Button disabled={selectedRowKeys.length !== 1} onClick={clearFault}>
            <FormattedMessage id="chargeManager.clearFault" />
          </Button>

          <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteCharge}>
            <FormattedMessage id="app.button.delete" />
          </Button>
        </Col>
        <Col>
          <Button type="primary" ghost onClick={fetchChargeList}>
            <FormattedMessage id="app.button.refresh" />
          </Button>
        </Col>
      </Row>
      <div>
        <TableWidthPages
          bordered
          scroll={{ x: 'max-content' }}
          loading={loading}
          columns={columns}
          dataSource={chargeList}
          rowKey={({ id }) => id}
          rowSelection={{
            selectedRowKeys,
            selectedRows,
            onChange: onSelectChange,
          }}
        />
      </div>

      {/* 绑定 & 编辑 */}
      <Modal
        destroyOnClose
        title={
          selectedRowKeys.length === 1 ? (
            <FormattedMessage id="app.button.edit" />
          ) : (
            <FormattedMessage id="app.button.add" />
          )
        }
        visible={chargeVisibleModal}
        onCancel={() => {
          setChargeVisibleModal(false);
        }}
        footer={null}
      >
        <BindingChargeComponent
          submit={handleSubmit}
          cancel={() => {
            setChargeVisibleModal(false);
          }}
          data={selectedRowKeys}
        />
      </Modal>
    </TablePageWrapper>
  );
};
export default memo(ChargeManagerment);
