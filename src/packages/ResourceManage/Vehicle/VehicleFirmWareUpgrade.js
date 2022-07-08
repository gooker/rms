import React, { memo, useEffect, useState } from 'react';
import { Progress, Tag, Row, Button, Col, Typography } from 'antd';
import { CloseCircleOutlined, PlusOutlined, RedoOutlined, UploadOutlined } from '@ant-design/icons';
import { dealResponse, getVehicleStatusTag, isNull } from '@/utils/util';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import VehicleLogSearch from './VehicleLog/component/VehicleLogSearch';
import commonStyles from '@/common.module.less';
import { fetchAllAdaptor, fetchFireWareList, upgradeVehicle } from '@/services/resourceService';
import { fetchAllVehicleList } from '@/services/commonService';
import UploadHardwareModal from './components/UploadHardwareModal';
import CreateUpgradeOrderModal from './components/CreateUpgradeOrderModal';
import { VehicleUpgradeState } from './upgradeConst';

const VehicleUpgrade = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [dataSource, setDatasource] = useState([]);
  const [upgradeOrder, setUpgradeOrder] = useState([]); // 升级的任务

  const [allAdaptors, setAllAdaptors] = useState({});
  const [allFireWares, setAllFireWares] = useState([]); // 固件

  const [uploadVisible, setUploadVisible] = useState(false);
  const [creationVisible, setCreationVisible] = useState(false);

  const columns = [
    {
      title: <FormattedMessage id="vehicle.id" />,
      dataIndex: 'vehicleId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.vehicleState" />,
      dataIndex: 'vehicleStatus',
      align: 'center',
      render: getVehicleStatusTag,
    },
    {
      title: <FormattedMessage id="app.vehicleType" />,
      dataIndex: 'vehicleType',
      align: 'center',
      render: (text, record) => {
        if (text === 3) {
          return <FormattedMessage id="app.vehicle.threeGenerationOfTianma" />;
        } else {
          return <span>{text}</span>;
        }
      },
    },
    {
      title: <FormattedMessage id="firmdware.downloadProgress" />,
      dataIndex: 'state',
      align: 'center',
      render: (text, record) => {
        if (text === VehicleUpgradeState.downloading || text === VehicleUpgradeState.ready) {
          return <Progress type="circle" width={35} percent={record.percent} />;
        }
        if (text === VehicleUpgradeState.downloadFail) {
          return (
            <Tag icon={<CloseCircleOutlined />} color="error">
              <FormattedMessage id="firmdware.downloadFail" />
            </Tag>
          );
        } else {
          return (
            <Typography.Link
              onClick={() => {
                upgrade(record);
              }}
            >
              <FormattedMessage id="firmdware.startUpgrade" />
            </Typography.Link>
          );
        }
      },
    },

    {
      title: <FormattedMessage id="firmdware.fileName" />,
      dataIndex: 'fileName',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.creationTime" />,
      dataIndex: 'creatTime',
      align: 'center',
    },
  ];

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);
    getAllHardWare();
    const [allVehicles, allAdaptors, allFireWares] = await Promise.all([
      fetchAllVehicleList(),
      fetchAllAdaptor(),
      fetchFireWareList(),
    ]);
    if (!dealResponse(allVehicles) && !dealResponse(allAdaptors)) {
      const newData = [];
      allVehicles?.map(({ vehicle, vehicleInfo, vehicleWorkStatusDTO }) => {
        if (vehicle?.register) {
          newData.push({ ...vehicle, ...vehicleInfo, ...vehicleWorkStatusDTO });
        }
      });
      setDatasource(newData);
      setAllAdaptors(allAdaptors);
      filterData(newData);
    }
    if (!dealResponse(allFireWares)) {
      setAllFireWares(allFireWares);
    }
    setLoading(false);
    setSelectedRows([]);
    setSelectedRowKeys([]);
  }

  function filterData(data, searchParams) {
    let nowAllVehicles = [...data];
    if (isNull(searchParams)) {
      setDatasource(nowAllVehicles);
      return;
    }
    const { ids, vehicleStatus, vehicleType } = searchParams;
    if (ids?.length > 0) {
      nowAllVehicles = nowAllVehicles.filter(({ id }) => ids.includes(id));
    }

    if (vehicleStatus?.length > 0) {
      nowAllVehicles = nowAllVehicles.filter((item) => vehicleStatus.includes(item.vehicleStatus));
    }

    if (!isNull(vehicleType)) {
      const currentType = vehicleType.split('@'); // adapterType@vehicleType
      nowAllVehicles = nowAllVehicles.filter(
        (item) => item.adapterType === currentType[0] && item.vehicleType === currentType[1],
      );
    }

    setDatasource(nowAllVehicles);
  }

  // 获取所有上传到SFTP的固件
  function getAllHardWare() {
    setUpgradeOrder([]);
  }

  // 开始升级
  async function upgrade(record) {
    const { vehicleId, adapterType } = record;
    const response = await upgradeVehicle({ vehicleId, adapterType });
    if (!dealResponse(response, 1)) {
      init();
    }
  }

  function onSelectChange(selectedRowKeys, selectedRows) {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  }

  return (
    <TablePageWrapper>
      <>
        <VehicleLogSearch
          allData={dataSource}
          onSearch={filterData}
          refreshLog={init}
          selectedRows={selectedRows}
          allAdaptors={allAdaptors}
        />

        <Row justify={'space-between'}>
          <Col className={commonStyles.tableToolLeft}>
            <Button
              onClick={() => {
                setUploadVisible(true);
              }}
            >
              <UploadOutlined /> <FormattedMessage id="firmdware.upload" />
            </Button>
            <Button
              type={'primary'}
              disabled={selectedRowKeys.length === 0 || allFireWares?.length === 0}
              onClick={() => {
                setCreationVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="firmdware.upgradeTask.add" />
            </Button>

            <Button onClick={init}>
              <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
      </>

      <TableWithPages
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record.id}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />

      {/* 上传固件弹窗 */}
      <UploadHardwareModal
        visible={uploadVisible}
        onCancel={() => {
          setUploadVisible(false);
        }}
        refreshHardWare={getAllHardWare}
      />

      {/* 新建升级任务*/}
      <CreateUpgradeOrderModal
        visible={creationVisible}
        hardWareData={allFireWares}
        onCancel={() => {
          setCreationVisible(false);
        }}
        selectedRows={selectedRows}
        upgradeOrder={upgradeOrder}
        onRefresh={init}
      />
    </TablePageWrapper>
  );
};
export default memo(VehicleUpgrade);
