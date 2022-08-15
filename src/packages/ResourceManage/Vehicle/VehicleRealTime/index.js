import React from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Form, Row, Select, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, isStrictNull } from '@/utils/util';
import { fetchAllVehicleList, fetchVehicleInfo } from '@/services/commonService';
import VehicleInformationCard from './VehicleInformation';
import VehicleRealTimeCard from './VehicleRealTime';
import VehicleBatteryStateCard from './VehicleBatteryState';
import VehicleModuleInfoCard from './VehicleModuleInformation';
import commonStyles from '@/common.module.less';
import styles from './index.module.less';

@connect()
class VehicleRealTime extends React.Component {
  state = {
    loading: false,
    vehicleList: [],
    vehicle: null,
  };

  componentDidMount() {
    this.getVehicleList();
  }

  getVehicleList = async () => {
    this.setState({ loading: true });
    const vehicleList = await fetchAllVehicleList();
    if (
      !dealResponse(vehicleList, false, formatMessage({ id: 'app.message.fetchVehicleListFail' }))
    ) {
      this.setState({ vehicleList });
    }
    this.setState({ loading: false });
  };

  fetchVehicleDetail = async (vehicle) => {
    if (!isStrictNull(vehicle)) {
      this.setState({ loading: true });
      const [vehicleId, adapterType] = vehicle.split('-');
      const vehicleDetail = await fetchVehicleInfo(vehicleId, adapterType);
      this.setState({ vehicle: vehicleDetail });
      this.setState({ loading: false });
    } else {
      this.setState({ vehicle: null });
    }
  };

  render() {
    const { vehicle, vehicleList, loading } = this.state;
    return (
      <div className={commonStyles.commonPageStyle}>
        <Spin spinning={loading}>
          <Row className={commonStyles.tableToolLeft} style={{ marginBottom: 0 }}>
            <Form.Item label={<FormattedMessage id='vehicle.id' />}>
              <Select
                allowClear
                showSearch
                style={{ width: 200 }}
                onChange={this.fetchVehicleDetail}
              >
                {vehicleList.map(({ vehicleId, vehicleType }) => (
                  <Select.Option
                    key={`${vehicleId}-${vehicleType}`}
                    value={`${vehicleId}-${vehicleType}`}
                  >
                    {`${vehicleId}-${vehicleType}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Button type={'primary'} onClick={this.getVehicleList}>
              <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
            </Button>
          </Row>
          <div className={styles.viewContainer}>
            <VehicleInformationCard data={vehicle ?? {}} />
            <VehicleRealTimeCard data={vehicle ?? {}} />
            <VehicleBatteryStateCard data={vehicle ?? {}} />
            <VehicleModuleInfoCard data={vehicle?.vehicle?.baseInfo?.otherInfo ?? {}} />
          </div>
        </Spin>
      </div>
    );
  }
}
export default VehicleRealTime;
