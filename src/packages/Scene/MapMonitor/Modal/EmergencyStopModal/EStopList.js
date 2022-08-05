import React, { memo, useEffect, useState } from 'react';
import { Button, Input, Popconfirm, Switch, Table } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { changeEmergencyStopStatus, deleteEmergencyStop, fetchEmergencyStopList } from '@/services/XIHEService';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const EStopList = (props) => {
  const { dispatch, mapContext, mapId, emergencyStopList } = props;

  const [dataSource, setDataSource] = useState(
    emergencyStopList.filter(({ estopType }) => estopType === 'Area'),
  );

  useEffect(() => {
    refreshList();
  }, []);

  useEffect(() => {
    setDataSource(emergencyStopList.filter(({ estopType }) => estopType === 'Area'));
  }, [emergencyStopList]);

  const columns = [
    {
      // 编码
      title: formatMessage({ id: 'app.common.code' }),
      align: 'center',
      dataIndex: 'code',
    },
    {
      title: formatMessage({ id: 'app.common.name' }),
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'app.common.status' }),
      align: 'center',
      dataIndex: 'activated',
      render: (text, record) => {
        return (
          <Popconfirm
            title={
              record && record.activated
                ? formatMessage({ id: 'monitor.estop.confirm.disable' })
                : formatMessage({ id: 'monitor.estop.confirm.enable' })
            }
            onConfirm={() => {
              changeEStopStatus(record.code, !record.activated, record);
            }}
          >
            <Switch
              checked={record.activated}
              checkedChildren={formatMessage({ id: 'app.common.on' })}
              unCheckedChildren={formatMessage({ id: 'app.common.off' })}
            />
          </Popconfirm>
        );
      },
    },
    {
      // 操作
      title: formatMessage({ id: 'app.common.operation' }),
      align: 'center',
      width: 100,
      render: (text, record) => {
        if (!record.isFixed) {
          return (
            <Popconfirm
              title={formatMessage({ id: 'monitor.estop.confirm.delete' })}
              onConfirm={() => {
                remove(record);
              }}
            >
              <DeleteOutlined style={{ color: 'red', cursor: 'pointer', fontSize: 17 }} />
            </Popconfirm>
          );
        }
      },
    },
  ];

  async function refreshList() {
    const emergencyStopList = await fetchEmergencyStopList(mapId);
    if (
      !dealResponse(
        emergencyStopList,
        false,
        formatMessage({ id: 'monitor.estop.fetchListFailed' }),
      )
    ) {
      dispatch({ type: 'monitor/saveEmergencyStopList', payload: emergencyStopList });
    }
  }

  // 启用禁用Area
  async function changeEStopStatus(code, checked, record) {
    const params = { mapId, activated: checked };
    // 如果有group 就传group. 否则就传code--不能都传
    if (!isStrictNull(record.group)) {
      params.group = record.group;
    } else {
      params.code = code;
    }
    const result = await changeEmergencyStopStatus(params);
    if (!dealResponse(result, true)) {
      refreshList();
    }
  }

  async function remove(record) {
    const response = await deleteEmergencyStop({ code: record.code });
    if (!dealResponse(response, true)) {
      refreshList();
      let { code } = record;
      if (record.estopType === 'Section' || record.estopType === 'Logic') {
        code = `special${record.estopType}`;
      }
      mapContext.removeCurrentEmergencyFunction(code);
    }
  }

  function search(searchKey) {
    if (!isStrictNull(searchKey)) {
      setDataSource(
        emergencyStopList
          .filter(({ estopType }) => estopType === 'Area')
          .filter((item) => {
            return item.code.includes(searchKey) || item.name?.includes(searchKey);
          }),
      );
    } else {
      setDataSource(emergencyStopList.filter(({ estopType }) => estopType === 'Area'));
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <Input
          allowClear
          size={'small'}
          style={{ width: 188 }}
          placeholder={`${formatMessage({ id: 'app.common.code' })}/${formatMessage({
            id: 'app.common.name',
          })}`}
          onChange={debounce((evt) => {
            search(evt.target.value);
          }, 200)}
        />
        <Button size={'small'} type={'link'} onClick={refreshList}>
          <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
        </Button>
      </div>
      <Table
        bordered
        size={'small'}
        dataSource={dataSource}
        columns={columns}
        rowKey={(record) => record.code}
        pagination={false}
      />
    </div>
  );
};
export default connect(({ monitor }) => ({
  mapContext: monitor.mapContext,
  mapId: monitor?.currentMap?.id,
  emergencyStopList: monitor.emergencyStopList,
}))(memo(EStopList));
