import React, { memo, useEffect, useState } from 'react';
import { Progress, Tag } from 'antd';
import { dealResponse, getVehicleStatusTag, isNull } from '@/utils/util';
import { connect } from '@/utils/RmsDva';

import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import VehicleLogSearch from './component/VehicleLogSearch';
import commonStyles from '@/common.module.less';
import { fetchAllAdaptor } from '@/services/resourceService';
import { fetchAllVehicleList } from '@/services/commonService';

const VehicleLog = (props) => {
  const { dispatch, allVehicles, loading } = props;

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDatasource] = useState([]);
  const [allAdaptors, setAllAdaptors] = useState({});
  const [visible, setVisible] = useState(false);

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
      title: <FormattedMessage id="app.logDownload.generateStatus" />,
      dataIndex: 'generateStatus',
      align: 'center',
      render: (text, record) => {
        if (text === 1) {
          return <Progress type="circle" percent={parseInt(record.fileProgress)} width={35} />;
        } else if (text === 2) {
          return (
            <Tag color="error">
              <FormattedMessage id="app.common.failed" />
            </Tag>
          );
        } else if (text === 0) {
          return (
            <span
              className={commonStyles.textLinks}
              onClick={() => {
                setVisible(true);
              }}
            >
              <FormattedMessage id="app.logDownload.generated" />
            </span>
          );
        }
      },
    },
    {
      title: <FormattedMessage id="app.vehicleType" />,
      dataIndex: 'vehicleType',
      align: 'center',
      render: (text, record) => {
        if (record.isSimulator) {
          return <FormattedMessage id="app.vehicle.simulator" />;
        } else if (text === 3) {
          return <FormattedMessage id="app.vehicle.threeGenerationOfTianma" />;
        } else {
          return <span>{text}</span>;
        }
      },
    },
  ];

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const [allVehicles, allAdaptors] = await Promise.all([
      fetchAllVehicleList(),
      fetchAllAdaptor(),
    ]);
    if (!dealResponse(allVehicles) && !dealResponse(allAdaptors)) {
      setDatasource(allVehicles);
      setAllAdaptors(allAdaptors);
      filterData(allVehicles);
    }
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
        allData={dataSource}
        onSearch={filterData}
        refreshLog={init}
        selectedRows={selectedRows}
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
    </TablePageWrapper>
  );
};
export default connect(() => ({}))(memo(VehicleLog));
