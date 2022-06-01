import React from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Divider, Form, Row, Select, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage } from '@/utils/util';
import { fetchAllVehicleList } from '@/services/api';
import VehicleInformationTab from './VehicleInformation';
import VehicleRealTimeTab from './VehicleRealTime';
import VehicleWorkStateTab from './VehicleWorkState';
import styles from './index.module.less';
import commonStyles from '@/common.module.less';

const { Option } = Select;

@connect()
class VehicleRealTime extends React.Component {
  state = {
    isFetching: false,
    vehicleList: [],
    vehicle: null,
  };

  componentDidMount() {
    this.getVehicleList();
  }

  getVehicleList = async () => {
    this.setState({ isFetching: true });
    let vehicleList = await fetchAllVehicleList();
    this.setState({ isFetching: false });
    if (
      !dealResponse(vehicleList, false, formatMessage({ id: 'app.message.fetchVehicleListFail' }))
    ) {
      vehicleList = vehicleList.map((item) => ({
        ...item,
        uniqueId: item.vehicle.id,
      }));
      this.setState({ vehicleList });
    }
  };

  render() {
    const { isFetching, vehicle, vehicleList } = this.state;
    return (
      <Spin spinning={isFetching}>
        <div className={commonStyles.commonPageStyle}>
          <Row className={commonStyles.tableToolLeft} style={{ marginBottom: 0 }}>
            <Form.Item label={<FormattedMessage id='vehicle.id' />}>
              <Select
                allowClear
                showSearch
                style={{ width: 200 }}
                onChange={(uniqueId) => {
                  const vehicle = find(vehicleList, { uniqueId });
                  this.setState({ vehicle });
                }}
              >
                {vehicleList.map(({ vehicleId, vehicleType, uniqueId }) => (
                  <Option key={`${vehicleId}-${vehicleType}`} value={uniqueId}>
                    {`${vehicleId}-${vehicleType}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Button onClick={this.getVehicleList}>
              <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
            </Button>
          </Row>
          <Row className={styles.viewContainer} justify={'space-between'}>
            {/* 小车信息 */}
            <div className={styles.tabContainer}>
              <span style={{ fontSize: 17, fontWeight: 500 }}>
                <FormattedMessage id={'vehicle.info'} />
              </span>
              <Divider style={{ margin: '5px 0 24px 0' }} />
              <VehicleInformationTab data={vehicle ?? {}} />
            </div>
            <div style={{ width: 32 }}></div>

            {/* 小车实时状态*/}
            <div className={styles.tabContainer}>
              <span style={{ fontSize: 17, fontWeight: 500 }}>
                <FormattedMessage id={'vehicle.realTime'} />
              </span>
              <Divider style={{ margin: '5px 0 24px 0' }} />
              <VehicleRealTimeTab data={vehicle ?? {}} />
            </div>
            <div style={{ width: 32 }}></div>

            {/* 小车工作状态*/}
            <div className={styles.tabContainer}>
              <span style={{ fontSize: 17, fontWeight: 500 }}>
                <FormattedMessage id={'vehicle.WorkState'} />
              </span>
              <Divider style={{ margin: '5px 0 24px 0' }} />
              <VehicleWorkStateTab data={vehicle ?? {}} />
            </div>
          </Row>
        </div>
      </Spin>
    );
  }
}
export default VehicleRealTime;
