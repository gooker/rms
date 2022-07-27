import React, { memo, useEffect, useState } from 'react';
import { Progress, Tag, Row, Button, Col, Typography, message } from 'antd';
import {
  PlusOutlined,
  RedoOutlined,
  ToolOutlined,
  CloseOutlined,
  UnorderedListOutlined,
  HistoryOutlined,
  CloudSyncOutlined,
} from '@ant-design/icons';
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
  updateVehicleMaintain,
} from '@/services/resourceService';
import { fetchAllVehicleList } from '@/services/commonService';
import FireWareFileListModal from './components/FireWareFileListModal';
import CreateUpgradeOrderModal from './components/CreateUpgradeOrderModal';
import UpgradeHistoryModal from './components/UpgradeHistoryModal';
import { transformFireProgress } from './upgradeConst';
import RmsConfirm from '@/components/RmsConfirm';

const StatusLabelStyle = { marginLeft: 15, fontSize: 15, fontWeight: 600 };

const VehicleUpgrade = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [allAdaptors, setAllAdaptors] = useState({});
  const [dataSource, setDatasource] = useState([]);
  const [allData, setAllData] = useState([]);
  const [allFireWareFiles, setAllFireWareFiles] = useState([]); // 固件

  const [fileManageVisible, setFileManageVisible] = useState(false);
  const [creationVisible, setCreationVisible] = useState(false);

  const [historyVisible, setHistoryVisible] = useState(false);

  const columns = [
    {
      title: <FormattedMessage id="firmdware.fileName" />,
      dataIndex: 'fileName',
      align: 'center',
    },
    {
      title: <FormattedMessage id="firmdware.version" />,
      dataIndex: 'softVersion',
      align: 'center',
    },
    {
      title: <FormattedMessage id="vehicle.id" />,
      dataIndex: 'vehicleId',
      align: 'center',
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
                  {vehicleFileTaskType === 'UPLOAD' ? (
                    <FormattedMessage id={'firmdware.inDownloading'} />
                  ) : (
                    <></>
                    // <FormattedMessage id={'firmdware.restarting'} />
                  )}
                </span>
              </>
            );
          } else if (nexText === 2) {
            return (
              <Tag color="error">
                {vehicleFileTaskType === 'UPLOAD' ? (
                  <FormattedMessage id={'firmdware.downloadFail'} />
                ) : (
                  <></>
                  // <FormattedMessage id={'firmdware.upgradeFail'} />
                )}
              </Tag>
            );
          } else if (nexText === 0) {
            if (record.vehicleFileTaskType === 'UPLOAD') {
              return (
                <Typography.Link
                  onClick={() => {
                    upgrade(record);
                  }}
                >
                  <FormattedMessage id="firmdware.download.restartEffective" />
                </Typography.Link>
              );
            }
            // if (record.vehicleFileTaskType === 'UPGRADE') {
            //   return (
            //     <Tag color="#87d068">
            //       <FormattedMessage id="firmdware.upgrade.success" />
            //     </Tag>
            //   );
            // }
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
              ['UPLOAD', 'UPGRADE'].includes(item.vehicleFileTaskType),
          );
          newData.push({
            vehicleId,
            vehicleType,
            ...vehicle,
            ...vehicleInfo,
            ...vehicleWorkStatusDTO,
            ...currentTask[0],
            softVersion: vehicle?.others?.softVersion,
          });
        }
      });
      setDatasource(newData);
      setAllData(newData);
      setAllAdaptors(allAdaptors);
      filterData(newData);
    }
    if (!dealResponse(allFireWaresFile)) {
      setAllFireWareFiles(allFireWaresFile);
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
    const { ids, vehicleStatus, vehicleType, progress, softVersion } = searchParams;
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

    if (!isNull(progress)) {
      const currentStatus = transformFireProgress(progress); // ['1','UPGRADE']
      nowAllVehicles = nowAllVehicles.filter(
        ({ fileStatus, vehicleFileTaskType }) =>
          fileStatus === currentStatus[0] && vehicleFileTaskType === currentStatus[1],
      );
    }

    if (softVersion?.length > 0) {
      if (softVersion.includes('no')) {
        nowAllVehicles = nowAllVehicles.filter((item) => {
          return isNull(item.softVersion) || softVersion.includes(item.softVersion);
        });
      } else {
        nowAllVehicles = nowAllVehicles.filter((item) => softVersion.includes(item.softVersion));
      }
    }

    setDatasource(nowAllVehicles);
  }

  // 开始升级
  async function upgrade(record) {
    const { vehicleId, adapterType, fileName } = record;
    const response = await upgradeVehicle([{ vehicleId, adapterType, fileName }]);
    if (!dealResponse(response, 1)) {
      init();
    }
  }

  /*
   *维护/取消维护
   *@para {Boolean} flag 维护:true 取消维护：false
   * **/
  function handleMainten(flag) {
    const vehicleInfos = [];
    selectedRows?.map(({ adapterType, vehicleId }) => {
      vehicleInfos.push({
        adapterType,
        vehicleId,
      });
    });
    RmsConfirm({
      content: formatMessage({ id: 'app.message.doubleConfirm' }),
      onOk: async () => {
        const response = await updateVehicleMaintain({ disable: flag, vehicleInfos });
        if (!dealResponse(response, 1)) {
          init();
        }
      },
    });
  }

  async function batchRestart() {
    const currentData = selectedRows?.filter(
      ({ vehicleFileTaskType, fileStatus }) =>
        vehicleFileTaskType === 'UPLOAD' && fileStatus === '0',
    );
    if (currentData.length === 0) {
      message.info(formatMessage({ id: 'firmdware.upgrade.message' }));
      return;
    }

    const params = [];
    currentData.map(({ vehicleId, adapterType, fileName }) => {
      params.push({
        vehicleId,
        adapterType,
        fileName,
      });
    });

    const response = await upgradeVehicle(params);
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
          allData={allData}
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
                setFileManageVisible(true);
              }}
            >
              <UnorderedListOutlined /> <FormattedMessage id="firmdware.managerment" />
            </Button>
            <Button
              type={'primary'}
              disabled={selectedRows.length === 0 || allFireWareFiles?.length === 0}
              onClick={() => {
                setCreationVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="firmdware.upgradeTask.add" />
            </Button>
            <Button
              onClick={() => {
                handleMainten(true);
              }}
              disabled={selectedRowKeys.length === 0}
            >
              <ToolOutlined /> <FormattedMessage id="firmdware.button.mainten" />
            </Button>

            <Button
              onClick={() => {
                handleMainten(false);
              }}
              disabled={selectedRowKeys.length === 0}
            >
              <CloseOutlined /> <FormattedMessage id="firmdware.button.cancelMainten" />
            </Button>

            <Button disabled={selectedRowKeys.length === 0} onClick={batchRestart}>
              <CloudSyncOutlined /> <FormattedMessage id="firmdware.download.restartEffective" />
            </Button>

            <Button
              disabled={selectedRowKeys.length !== 1}
              onClick={() => {
                setHistoryVisible(true);
              }}
            >
              <HistoryOutlined /> <FormattedMessage id="firmdware.upgrade.history" />
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

      {/* 固件列表 */}
      <FireWareFileListModal
        visible={fileManageVisible}
        fireWareFiles={allFireWareFiles}
        onCancel={() => {
          setFileManageVisible(false);
        }}
        onRefresh={init}
      />

      {/* 新建升级任务*/}
      <CreateUpgradeOrderModal
        visible={creationVisible}
        hardWareData={allFireWareFiles}
        onCancel={() => {
          setCreationVisible(false);
        }}
        selectedRows={selectedRows}
        onRefresh={init}
      />

      {/* 升级历史 */}
      <UpgradeHistoryModal
        visible={historyVisible}
        selectedRows={selectedRows}
        onCancel={() => {
          setHistoryVisible(false);
        }}
      />
    </TablePageWrapper>
  );
};
export default memo(VehicleUpgrade);
