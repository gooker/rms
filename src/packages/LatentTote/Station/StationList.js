import React, { memo, useEffect, useState } from 'react';
import TablePageWrapper from '@/components/TablePageWrapper';
import { Tag, Badge, Button, Row, Col, message, Modal, Form, Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import Dictionary from '@/utils/Dictionary';
import { fetchLatentToteStations, updateLatentToteStation } from '@/services/latentTote';
import { dealResponse, formatMessage, isNull, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { IconFont } from '@/components/IconFont';
import TableWithPages from '@/components/TableWithPages';
import StationBindingComponent from './components/StationBindingComponent';
import RmsConfirm from '@/components/RmsConfirm';
import commonStyles from '@/common.module.less';

const { green, blue } = Dictionary('color');
const stationType = {
  PICK: green,
  PUT_AWAY: blue,
};

const ChargerList = () => {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(['BINDING', 'UNBINDING']);
  const [stationList, setStationList] = useState([]);
  const [bindVisible, setBindVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState(null);

  useEffect(() => {
    async function init() {
      await getList();
    }
    init();
  }, []);

  const columns = [
    {
      title: <FormattedMessage id="app.map.station" />,
      dataIndex: 'stationCode',
      align: 'center',
      fixed: 'left',
    },
    {
      title: <FormattedMessage id="app.common.type" />,
      dataIndex: 'stationType',
      align: 'center',
      render: (type) => {
        if (!isNull(type)) {
          return (
            <Tag color={stationType[type]} key={type}>
              {formatMessage({ id: `latentTote.station.type.${type}` })}
            </Tag>
          );
        }
      },
    },

    {
      title: <FormattedMessage id="app.common.status" />,
      dataIndex: 'status',
      align: 'center',
      render: (text) => {
        if (!isNull(text)) {
          if (text === 'NORMAL') {
            return <Badge color={'red'} text={formatMessage({ id: 'app.agv.exception' })} />;
          }
          return <Badge color={'green'} text={formatMessage({ id: 'app.agv.normal' })} />;
        }
      },
    },

    {
      title: <FormattedMessage id="app.agv.ip" />,
      dataIndex: 'ip',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.form.hardwareId" />,
      dataIndex: 'hardwareId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.agv.port" />,
      dataIndex: 'port',
      align: 'center',
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
      title: <FormattedMessage id="latentTote.station.simulatedStatus" />,
      align: 'center',
      dataIndex: 'simulatedStatus',
      render: (text) => {
        if (!isNull(text)) {
          if (text) {
            return <FormattedMessage id="app.common.true" />;
          }
          return <FormattedMessage id="app.commom.false" />;
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
      width: 200,
      dataIndex: 'maxPod',
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
      dataIndex: 'id',
      align: 'center',
      width: 250,
      fixed: 'right',
      render: (text, record) => (
        <div>
          {record.workStatus === 'STOP' ? (
            <Button
              size={'small'}
              type="link"
              onClick={() => {
                deleteStation({ id: record.id, editType: 'REMOVE' });
              }}
            >
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>
          ) : (
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
              <FormattedMessage id="app.common.status.pause" />
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
  function deleteStation(params) {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await updateLatentToteStation(params);
        if (!dealResponse(response, 1)) {
          getList();
        }
      },
    });
  }

  //   绑定
  async function bindSubmit(currentData) {
    const response = await updateLatentToteStation(currentData);
    if (!dealResponse(response, 1)) {
      setBindVisible(false);
      setSelectedRowKeys([]);
      setSelectedRows(null);
      getList();
    }
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
        <Row style={{ display: 'flex', padding: '0 0 20px 0' }}>
          <Col flex="auto" className={commonStyles.tableToolLeft}>
            <Button
              type="primary"
              //   disabled={stationList.length !== 1}
              onClick={() => {
                setBindVisible(true);
              }}
            >
              <IconFont type="icon-assign" />
              <FormattedMessage id="app.button.bind" />
            </Button>
            <Button disabled={selectedRowKeys.length === 0}>
              <EditOutlined /> <FormattedMessage id="app.button.edit" />
            </Button>

            <Button
              type="primary"
              ghost
              onClick={() => {
                getList();
              }}
            >
              <ReloadOutlined />
              <FormattedMessage id="app.button.refresh" />
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
      />
      {/* 绑定 & 编辑 */}
      <Modal
        destroyOnClose
        title={<FormattedMessage id="latentTote.mainStationCode" />}
        visible={bindVisible}
        onCancel={() => {
          setBindVisible(false);
        }}
        footer={null}
      >
        <StationBindingComponent
          submit={bindSubmit}
          cancel={() => {
            setBindVisible(false);
          }}
          data={selectedRowKeys}
        />
      </Modal>
    </TablePageWrapper>
  );
};
export default memo(ChargerList);
