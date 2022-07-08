import React, { memo, useEffect, useState } from 'react';
import { Progress, Tag, Row, Button, Col, Typography } from 'antd';
import { PlusOutlined, RedoOutlined, ToolOutlined, UploadOutlined } from '@ant-design/icons';
import { dealResponse, formatMessage, getVehicleStatusTag, isNull } from '@/utils/util';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import VehicleLogSearch from './VehicleLog/component/VehicleLogSearch';
import commonStyles from '@/common.module.less';
import {
  fetchAllAdaptor,
  fetchFireWareFileList,
  fetchFireWareList,
  upgradeVehicle,
} from '@/services/resourceService';
import { fetchAllVehicleList } from '@/services/commonService';
import UploadHardwareModal from './components/UploadHardwareModal';
import CreateUpgradeOrderModal from './components/CreateUpgradeOrderModal';
import { transformFireProgress } from './upgradeConst';
import RmsConfirm from '@/components/RmsConfirm';

const StatusLabelStyle = { marginLeft: 15, fontSize: 15, fontWeight: 600 };

const VehicleUpgrade = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [allAdaptors, setAllAdaptors] = useState({});
  const [dataSource, setDatasource] = useState([]);
  const [upgradeOrder, setUpgradeOrder] = useState([]); // 升级或下载的任务
  const [allFireWareFiles, setAllFireWareFiles] = useState([]); // 固件

  const [uploadVisible, setUploadVisible] = useState(false);
  const [creationVisible, setCreationVisible] = useState(false);

  const columns = [
    {
      title: <FormattedMessage id="firmdware.fileName" />,
      dataIndex: 'fileName',
      align: 'center',
    },
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
      title: <FormattedMessage id="vehicle.maintenanceState" />,
      dataIndex: 'disabled',
      align: 'center',
      render: (text) => {
        return (
          <span>
            {text ? (
              <Tag color={'#f50'}>
                <ToolOutlined />
                <span style={{ marginLeft: 3 }}>
                  <FormattedMessage id="vehicle.maintenanceState" />
                </span>
              </Tag>
            ) : (
              <Tag color={'#2FC25B'}>{<FormattedMessage id="app.common.normal" />}</Tag>
            )}
          </span>
        );
      },
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
      title: <FormattedMessage id="firmdware.progress" />,
      dataIndex: 'fileStatus',
      align: 'center',
      render: (text, record) => {
        if (!isNull(text)) {
          const { vehicleFileTaskType } = record;
          const nexText = Number(text);
          if (nexText === 1) {
            return (
              <>
                <Progress
                  type="circle"
                  percent={!isNull(record.fileProgress) ? parseInt(record.fileProgress) : 0}
                  width={35}
                />
                <span style={{ color: 'orange', ...StatusLabelStyle }}>
                  {vehicleFileTaskType === 'DOWNLOAD' ? (
                    <FormattedMessage id={'firmdware.inDownloading'} />
                  ) : (
                    <FormattedMessage id={'firmdware.inUpgradeing'} />
                  )}
                </span>
              </>
            );
          } else if (nexText === 2) {
            return (
              <Tag color="error">
                {vehicleFileTaskType === 'DOWNLOAD' ? (
                  <FormattedMessage id={'firmdware.downloadFail'} />
                ) : (
                  <FormattedMessage id={'firmdware.upgradeFail'} />
                )}
              </Tag>
            );
          } else if (nexText === 0) {
            if (record.vehicleFileTaskType === 'DOWNLOAD') {
              <Typography.Link
                onClick={() => {
                  upgrade(record);
                }}
              >
                <FormattedMessage id="firmdware.startUpgrade" />
              </Typography.Link>;
            }
            if (record.vehicleFileTaskType === 'UPGRADE') {
              <Tag color="#87d068">
                <FormattedMessage id="firmdware.upgrade.success" />
              </Tag>;
            }
          }
        }
      },
    },
  ];

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);
    const [allVehicles, allAdaptors, allFireWaresFile, taskProgressOrder] = await Promise.all([
      fetchAllVehicleList(),
      fetchAllAdaptor(),
      fetchFireWareFileList(),
      fetchFireWareList(),
    ]);
    if (
      !dealResponse(allVehicles) &&
      !dealResponse(allAdaptors) &&
      !dealResponse(taskProgressOrder)
    ) {
      const newData = [];
      allVehicles?.map(({ vehicleId, vehicleType, vehicle, vehicleInfo, vehicleWorkStatusDTO }) => {
        if (vehicle?.register) {
          const currentTask = taskProgressOrder?.filter(
            (item) =>
              item.vehicleId === vehicleId &&
              vehicleType === item.vehicleType &&
              ['DOWNLOAD', 'UPGRADE'].includes(item.vehicleFileTaskType),
          );
          newData.push({
            vehicleId,
            vehicleType,
            ...vehicle,
            ...vehicleInfo,
            ...vehicleWorkStatusDTO,
            ...currentTask,
          });
        }
      });
      setDatasource(newData);
      setAllAdaptors(allAdaptors);
      filterData(newData);
    }
    if (!dealResponse(allFireWaresFile)) {
      setAllFireWareFiles(allFireWaresFile);
      setUpgradeOrder([taskProgressOrder]);
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
    const { ids, vehicleStatus, vehicleType, progress } = searchParams;
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

    if (isNull(progress)) {
      const currentStatus = transformFireProgress(progress); // ['1','UPGRADE']
      nowAllVehicles = nowAllVehicles.filter(
        ({ fileStatus, vehicleFileTaskType }) =>
          fileStatus === currentStatus[0] && vehicleFileTaskType === currentStatus[1],
      );
    }

    setDatasource(nowAllVehicles);
  }

  // 开始升级
  async function upgrade(record) {
    const { vehicleId, adapterType } = record;
    const response = await upgradeVehicle({ vehicleId, adapterType });
    if (!dealResponse(response, 1)) {
      init();
    }
  }

  function handleMainten() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.doubleConfirm' }),
      onOk: () => {
        //TODO: 缺接口
      },
    });
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
          type="fireware"
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
              disabled={selectedRowKeys.length === 0 || allFireWareFiles?.length === 0}
              onClick={() => {
                setCreationVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="firmdware.upgradeTask.add" />
            </Button>
            <Button onClick={handleMainten} disabled={selectedRowKeys.length === 0}>
              <ToolOutlined /> <FormattedMessage id="firmdware.button.mainten" />
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
        refreshHardWare={init}
      />

      {/* 新建升级任务*/}
      <CreateUpgradeOrderModal
        visible={creationVisible}
        hardWareData={allFireWareFiles}
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
