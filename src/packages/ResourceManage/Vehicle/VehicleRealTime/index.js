import React from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Card, Form, Row, Select } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage } from '@/utils/util';
import { fetchAllVehicleList } from '@/services/commonService';
import VehicleInformationTab from './VehicleInformation';
import VehicleRealTimeTab from './VehicleRealTime';
import styles from './index.module.less';
import commonStyles from '@/common.module.less';

@connect()
class VehicleRealTime extends React.Component {
  state = {
    vehicleList: [],
    vehicle: null,
  };

  componentDidMount() {
    this.getVehicleList();
  }

  getVehicleList = async () => {
    let vehicleList = await fetchAllVehicleList();
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
    const { vehicle, vehicleList } = this.state;
    return (
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
                <Select.Option key={`${vehicleId}-${vehicleType}`} value={uniqueId}>
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
          {/* 小车信息 */}
          <Card title={<FormattedMessage id={'vehicle.info'} />}>
            <VehicleInformationTab data={vehicle ?? {}} />
          </Card>

          {/* 小车实时状态*/}
          <Card title={<FormattedMessage id={'vehicle.realTime'} />}>
            <VehicleRealTimeTab data={vehicle ?? {}} />
          </Card>
        </div>
      </div>
    );
  }
}
export default VehicleRealTime;
