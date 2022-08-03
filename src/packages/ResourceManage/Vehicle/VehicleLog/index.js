import React, { memo, useEffect, useState } from 'react';
import { Progress, Tag } from 'antd';
import { dealResponse, getVehicleStatusTag, isNull } from '@/utils/util';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import VehicleLogSearch from './component/VehicleLogSearch';
import commonStyles from '@/common.module.less';
import { fetchVehicleLogsList } from '@/services/resourceService';
import { fetchAllVehicleList } from '@/services/commonService';
import { find } from 'lodash';
import { VehicleDownLoadLogPolling } from '@/workers/WebWorkerManager';
// import ViewVehicleLog from './component/ViewVehicleLog';
////0：成功，1：升级中或下载中或上传中，2：失败

const VehicleLog = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);

  const [logProgress, setLogProgress] = useState([]);
  const [dataSource, setDatasource] = useState([]);
  const [allData, setAllData] = useState([]);

  // const [viewing, setViewing] = useState(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: <FormattedMessage id="app.logDownload.fileName" />,
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
      title: <FormattedMessage id="app.logDownload.generateStatus" />,
      dataIndex: 'fileStatus',
      align: 'center',
      render: (text, record) => {
        if (!isNull(text)) {
          const nexText = Number(text);
          if (nexText === 1) {
            return (
              <Progress
                type="circle"
                percent={!isNull(record.fileProgress) ? parseInt(record.fileProgress) : 0}
                width={35}
              />
            );
          } else if (nexText === 2) {
            return (
              <Tag color="error">
                <FormattedMessage id="app.common.failed" />
              </Tag>
            );
          } else if (nexText === 0) {
            return (
              <span className={commonStyles.textLinks}>
                <FormattedMessage id="app.logDownload.generated" />
              </span>
            );
          }
        }
      },
    },
  ];

  useEffect(() => {
    init();
    VehicleDownLoadLogPolling.start((values) => {
      setLogProgress(values);
    });

    return () => {
      VehicleDownLoadLogPolling.terminate();
    };
  }, []);

  useEffect(() => {
    convertData(logProgress);
  }, [logProgress]);

  async function init() {
    setLoading(true);
    const [allVehicles, logList] = await Promise.all([
      fetchAllVehicleList(),
      fetchVehicleLogsList(),
    ]);
    if (!dealResponse(allVehicles) && !dealResponse(logList)) {
      convertData(logList, allVehicles);
      setVehicleList(allVehicles);
    }
    setLoading(false);
    setSelectedRows([]);
    setSelectedRowKeys([]);
  }

  function convertData(logProgress, vehicleData) {
    const newData = [];
    let allVehicles = [];
    if (isNull(vehicleData)) {
      allVehicles = [...vehicleList];
    } else {
      allVehicles = [...vehicleData];
    }
    allVehicles?.map(({ vehicleId, vehicleType, vehicle, vehicleInfo, vehicleWorkStatusDTO }) => {
      if (vehicle?.register) {
        const currentLog = find(logProgress ?? [], { vehicleId, vehicleType });
        newData.push({
          vehicleId,
          vehicleType,
          ...vehicle,
          ...vehicleInfo,
          ...vehicleWorkStatusDTO,
          ...currentLog,
        });
      }
    });
    setAllData(newData);
    filterData(newData);
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

  function onSelectChange(selectedRowKeys, selectedRows) {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  }

  return (
    <TablePageWrapper>
      <VehicleLogSearch
        allData={allData}
        onSearch={filterData}
        refreshData={init}
        selectedRows={selectedRows}
        type={'log'}
      />
      <TableWithPages
        loading={loading}
        columns={columns}
        expandColumnSpan={6}
        dataSource={dataSource}
        rowKey={(record) => record.id}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />
      {/* {!isNull(viewing) && (
        <ViewVehicleLog
          visible={!isNull(viewing)}
          id={viewing}
          onCancel={() => {
            setViewing(null);
          }}
        />
      )} */}
    </TablePageWrapper>
  );
};
export default memo(VehicleLog);
