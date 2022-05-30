import React from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Col, Form, Row, Select, Tabs } from 'antd';
import { AimOutlined, AndroidOutlined, SearchOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse } from '@/utils/util';
import { fetchAgvErrorRecord, fetchAgvInfo, fetchAgvTaskList } from '@/services/api';
import commonStyles from '@/common.module.less';
import RealTimeTab from './RealTimeTab';
import HardwareTab from './HardwareTab';
import styles from './index.module.less';

const { Option } = Select;
const { TabPane } = Tabs;

@connect()
class AgvRealTimeComponent extends React.Component {
  state = {
    agvList: [],

    vehicleId: null,
    agvType: null,
    uniqueId: null,
    agvRealtimeData: null,
    agvHardware: null,
    agvTask: null,
    agvErrorRecord: null,

    recordSearchParams: {},
    errorSearchParams: {},
    isFetching: false,
  };

  async componentDidMount() {
    const { dispatch, location } = this.props;
    const allVehicles = await dispatch({
      type: 'monitor/refreshAllAgvList',
    });
    if (location && location?.search) {
      const uniqueId = location.search.split('=')[1];
      const { vehicleId, agvType } = find(allVehicles, { uniqueId });
      this.setState({ uniqueId, vehicleId, agvType }, this.fetchAgvMultivariateData);
    }
    this.setState({ agvList: allVehicles });
  }

  // 获取小车软件信息
  fetchAgvMultivariateData = async () => {
    const { uniqueId, agvType, vehicleId } = this.state;
    this.setState({ isFetching: true });
    const [agvRealtimeData] = await Promise.all([
      fetchAgvInfo(vehicleId, agvType),
      // fetchAgvHardwareInfo(agvType, { sectionId: window.localStorage.getItem('sectionId'), vehicleId }),
      // fetchAgvTaskList(agvType, {
      //   sectionId: window.localStorage.getItem('sectionId'),
      //   vehicleId,
      //   current: 1,
      //   size: 6,
      // }),
      // fetchAgvErrorRecord(agvType, {
      //   sectionId: window.localStorage.getItem('sectionId'),
      //   vehicleId,
      //   current: 1,
      //   size: 3,
      // }),
    ]);
    // this.setState({ isFetching: false, agvRealtimeData, agvHardware, agvTask, agvErrorRecord });
    this.setState({ isFetching: false, agvRealtimeData });
  };

  taskOnDetail = (taskId) => {
    const { dispatch, agvType } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, agvType },
    });
  };

  // 分页 获取记录
  getRecords = async (type, params) => {
    const { vehicleId, recordSearchParams, errorSearchParams } = this.state;
    const { agvType } = this.props;
    if (type === 'record') {
      const page = params
        ? params
        : {
            current: 1,
            size: 6,
          };
      const recordsData = await fetchAgvTaskList(agvType, {
        sectionId: window.localStorage.getItem('sectionId'),
        vehicleId,
        ...page,
        ...recordSearchParams,
      });
      if (!dealResponse(recordsData)) {
        this.setState({ isFetching: false, agvTask: recordsData });
      }
    } else {
      const page = params
        ? params
        : {
            current: 1,
            size: 3,
          };
      const errorData = await fetchAgvErrorRecord(agvType, {
        sectionId: window.localStorage.getItem('sectionId'),
        vehicleId,
        ...page,
        ...errorSearchParams,
      });
      if (!dealResponse(errorData)) {
        this.setState({ isFetching: false, agvErrorRecord: errorData });
      }
    }
  };

  render() {
    const { vehicleId, agvType, agvList, agvRealtimeData, isFetching } = this.state;

    return (
      <div className={commonStyles.commonPageStyle}>
        <Row className={commonStyles.tableToolLeft} style={{ marginBottom: 20 }}>
          <Col span={16}>
            <Form.Item label={<FormattedMessage id="app.agv.id" />}>
              <Select
                allowClear
                showSearch
                style={{ width: '100%' }}
                onChange={(uniqueId) => {
                  const { vehicleId, agvType } = find(agvList, { uniqueId });
                  this.setState({ uniqueId, vehicleId, agvType });
                  return uniqueId;
                }}
              >
                {agvList.map(({ vehicleId, agvType, uniqueId }) => (
                  <Option key={`${vehicleId}-${agvType}`} value={uniqueId}>
                    {`${vehicleId}-${agvType}`}
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
              onClick={this.fetchAgvMultivariateData}
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
                    <FormattedMessage id={'app.activity.realTimeAgvState'} />
                  </span>
                }
              >
                <RealTimeTab agvType={agvType} data={agvRealtimeData ?? {}} />
              </TabPane>

              {/* 小车硬件信息 */}
              <TabPane
                key="hardWare"
                tab={
                  <span>
                    <AndroidOutlined />
                    <FormattedMessage id={'app.activity.agvHardwareState'} />
                  </span>
                }
              >
                <HardwareTab agvType={agvType} data={agvRealtimeData} />
              </TabPane>
            </Tabs>
          </Col>
          {/* <Col className={agvRealTimeComponentStyles.tabContainer}> */}
          {/* <Tabs defaultActiveKey="taskRecord"> */}
          {/* 小车任务记录 */}
          {/* <TabPane
                key="taskRecord"
                tab={
                  <span>
                    <FileTextOutlined />
                    <FormattedMessage id={'app.agv.taskRecord'} />
                  </span>
                }
              >
                <Row>
                  <Col span={22}>
                    <AGVActivityForm
                      agvType={agvType}
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
                  agvType={agvType}
                  data={agvTask}
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
                    <FormattedMessage id={'app.agv.errorRecord'} />
                  </span>
                }
              >
                <AGVActivityForm
                  agvType={agvType}
                  disabled={isNull(vehicleId)}
                  onChange={(value) =>
                    this.setState({ errorSearchParams: value }, () => this.getRecords('error'))
                  }
                  mode={'unexpanded'}
                />
                <ErrorRecordTab
                  agvType={agvType}
                  data={agvErrorRecord}
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
export default AgvRealTimeComponent;
