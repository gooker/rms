import React from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Col, Form, Row, Select, Tabs } from 'antd';
import { AimOutlined, AndroidOutlined, SearchOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse } from '@/utils/util';
import { fetchVehicleErrorRecord, fetchVehicleInfo, fetchVehicleTaskList } from '@/services/api';
import commonStyles from '@/common.module.less';
import RealTimeTab from './RealTimeTab';
import HardwareTab from './HardwareTab';
import styles from './index.module.less';

const { Option } = Select;
const { TabPane } = Tabs;

@connect()
class VehicleRealTimeComponent extends React.Component {
  state = {
    vehicleList: [],

    vehicleId: null,
    vehicleType: null,
    uniqueId: null,
    vehicleRealtimeData: null,
    vehicleHardware: null,
    vehicleTask: null,
    vehicleErrorRecord: null,

    recordSearchParams: {},
    errorSearchParams: {},
    isFetching: false,
  };

  async componentDidMount() {
    const { dispatch, location } = this.props;
    const allVehicles = await dispatch({
      type: 'monitor/refreshAllVehicleList',
    });
    if (location && location?.search) {
      const uniqueId = location.search.split('=')[1];
      const { vehicleId, vehicleType } = find(allVehicles, { uniqueId });
      this.setState({ uniqueId, vehicleId, vehicleType }, this.fetchVehicleMultivariateData);
    }
    this.setState({ vehicleList: allVehicles });
  }

  // 获取小车软件信息
  fetchVehicleMultivariateData = async () => {
    const { uniqueId, vehicleType, vehicleId } = this.state;
    this.setState({ isFetching: true });
    const [vehicleRealtimeData] = await Promise.all([
      fetchVehicleInfo(vehicleId, vehicleType),
      // fetchVehicleHardwareInfo(vehicleType, { sectionId: window.localStorage.getItem('sectionId'), vehicleId }),
      // fetchVehicleTaskList(vehicleType, {
      //   sectionId: window.localStorage.getItem('sectionId'),
      //   vehicleId,
      //   current: 1,
      //   size: 6,
      // }),
      // fetchVehicleErrorRecord(vehicleType, {
      //   sectionId: window.localStorage.getItem('sectionId'),
      //   vehicleId,
      //   current: 1,
      //   size: 3,
      // }),
    ]);
    // this.setState({ isFetching: false, vehicleRealtimeData, vehicleHardware, vehicleTask, vehicleErrorRecord });
    this.setState({ isFetching: false, vehicleRealtimeData });
  };

  taskOnDetail = (taskId) => {
    const { dispatch, vehicleType } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, vehicleType },
    });
  };

  // 分页 获取记录
  getRecords = async (type, params) => {
    const { vehicleId, recordSearchParams, errorSearchParams } = this.state;
    const { vehicleType } = this.props;
    if (type === 'record') {
      const page = params
        ? params
        : {
            current: 1,
            size: 6,
          };
      const recordsData = await fetchVehicleTaskList(vehicleType, {
        sectionId: window.localStorage.getItem('sectionId'),
        vehicleId,
        ...page,
        ...recordSearchParams,
      });
      if (!dealResponse(recordsData)) {
        this.setState({ isFetching: false, vehicleTask: recordsData });
      }
    } else {
      const page = params
        ? params
        : {
            current: 1,
            size: 3,
          };
      const errorData = await fetchVehicleErrorRecord(vehicleType, {
        sectionId: window.localStorage.getItem('sectionId'),
        vehicleId,
        ...page,
        ...errorSearchParams,
      });
      if (!dealResponse(errorData)) {
        this.setState({ isFetching: false, vehicleErrorRecord: errorData });
      }
    }
  };

  render() {
    const { vehicleId, vehicleType, vehicleList, vehicleRealtimeData, isFetching } = this.state;

    return (
      <div className={commonStyles.commonPageStyle}>
        <Row className={commonStyles.tableToolLeft} style={{ marginBottom: 20 }}>
          <Col span={16}>
            <Form.Item label={<FormattedMessage id="app.vehicle.id" />}>
              <Select
                allowClear
                showSearch
                style={{ width: '100%' }}
                onChange={(uniqueId) => {
                  const { vehicleId, vehicleType } = find(vehicleList, { uniqueId });
                  this.setState({ uniqueId, vehicleId, vehicleType });
                  return uniqueId;
                }}
              >
                {vehicleList.map(({ vehicleId, vehicleType, uniqueId }) => (
                  <Option key={`${vehicleId}-${vehicleType}`} value={uniqueId}>
                    {`${vehicleId}-${vehicleType}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Button
              type={'primary'}
              disabled={!vehicleId}
              loading={isFetching}
              onClick={this.fetchVehicleMultivariateData}
            >
              <SearchOutlined /> <FormattedMessage id={'app.button.check'} />
            </Button>
          </Col>
        </Row>
        <Row className={styles.tabContainer}>
          <Col span={24}>
            {/* 小车实时信息 */}
            <Tabs defaultActiveKey="realTime">
              <TabPane
                key="realTime"
                tab={
                  <span>
                    <AimOutlined />
                    <FormattedMessage id={'app.activity.realTimeVehicleState'} />
                  </span>
                }
              >
                <RealTimeTab vehicleType={vehicleType} data={vehicleRealtimeData ?? {}} />
              </TabPane>

              {/* 小车硬件信息 */}
              <TabPane
                key="hardWare"
                tab={
                  <span>
                    <AndroidOutlined />
                    <FormattedMessage id={'app.activity.vehicleHardwareState'} />
                  </span>
                }
              >
                <HardwareTab vehicleType={vehicleType} data={vehicleRealtimeData} />
              </TabPane>
            </Tabs>
          </Col>
          {/* <Col className={vehicleRealTimeComponentStyles.tabContainer}> */}
          {/* <Tabs defaultActiveKey="taskRecord"> */}
          {/* 小车任务记录 */}
          {/* <TabPane
                key="taskRecord"
                tab={
                  <span>
                    <FileTextOutlined />
                    <FormattedMessage id={'app.vehicle.taskRecord'} />
                  </span>
                }
              >
                <Row>
                  <Col span={22}>
                    <VehicleActivityForm
                      vehicleType={vehicleType}
                      disabled={isNull(vehicleId)}
                      onChange={(value) =>
                        this.setState({ recordSearchParams: value }, () =>
                          this.getRecords('record'),
                        )
                      }
                      mode={'expanded'}
                    />
                  </Col>
                </Row>

                <TaskRecordTab
                  vehicleType={vehicleType}
                  data={vehicleTask}
                  pageOnchange={(value) => {
                    this.getRecords('record', value);
                  }}
                  onDetail={this.taskOnDetail}
                />
              </TabPane> */}

          {/* 小车错误记录 */}
          {/* <TabPane
                key="errorRecord"
                tab={
                  <span>
                    <WarningOutlined />
                    <FormattedMessage id={'app.vehicle.errorRecord'} />
                  </span>
                }
              >
                <VehicleActivityForm
                  vehicleType={vehicleType}
                  disabled={isNull(vehicleId)}
                  onChange={(value) =>
                    this.setState({ errorSearchParams: value }, () => this.getRecords('error'))
                  }
                  mode={'unexpanded'}
                />
                <ErrorRecordTab
                  vehicleType={vehicleType}
                  data={vehicleErrorRecord}
                  pageOnchange={(value) => {
                    this.getRecords('error', value);
                  }}
                  onDetail={this.taskOnDetail}
                />
              </TabPane> */}
          {/* </Tabs> */}
          {/* </Col> */}
        </Row>
      </div>
    );
  }
}
export default VehicleRealTimeComponent;
