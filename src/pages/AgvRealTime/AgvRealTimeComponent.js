import React from 'react';
import { connect } from '@/utils/dva';
import { Row, Col, Tabs, Button, Select, message } from 'antd';
import {
  FileTextOutlined,
  AndroidOutlined,
  WarningOutlined,
  AimOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import LabelComponent from '@/components/LabelComponent';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, isNull } from '@/utils/utils';
import {
  fetchAgvList,
  fetchAgvInfo,
  fetchAgvTaskList,
  fetchAgvErrorRecord,
  fetchAgvHardwareInfo,
} from '@/services/api';
import commonStyles from '@/common.module.less';
import RealTimeTab from './RealTimeTab';
import HardwareTab from './HardwareTab';
import TaskRecordTab from './TaskRecordTab';
import ErrorRecordTab from './ErrorRecordTab';
import AGVActivityForm from './AGVActivityForm';
import agvRealTimeComponentStyles from './index.module.less';

const { Option } = Select;
const { TabPane } = Tabs;

@connect()
class AgvRealTimeComponent extends React.Component {
  state = {
    agvList: [],

    agvId: null,
    agvRealtimeData: null,
    agvHardware: null,
    agvTask: null,
    agvErrorRecord: null,

    recordSearchParams: {},
    errorSearchParams: {},
    isFetching: false,
  };

  componentDidMount() {
    const { agvId } = this.props;
    this.fetchAgvList();
    if (agvId) {
      this.setState({ agvId }, this.fetchAgvMultivariateData);
    }
  }

  fetchAgvList = async () => {
    const { agvType, location } = this.props;
    if (location && location?.search) {
      const robotId = location.search.split('=')[1];
      this.setState({ agvId: robotId });
    }
    const response = await fetchAgvList(agvType);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.agv.getListFail' }));
    } else {
      this.setState({ agvList: response });
    }
  };

  // 获取小车软件信息、
  fetchAgvMultivariateData = async () => {
    const { agvId } = this.state;
    const { agvType } = this.props;
    this.setState({ isFetching: true });
    const [agvRealtimeData, agvHardware, agvTask, agvErrorRecord] = await Promise.all([
      fetchAgvInfo(agvType, { sectionId: window.localStorage.getItem('sectionId'), agvId }),
      fetchAgvHardwareInfo(agvType, { sectionId: window.localStorage.getItem('sectionId'), agvId }),
      fetchAgvTaskList(agvType, {
        sectionId: window.localStorage.getItem('sectionId'),
        agvId,
        current: 1,
        size: 6,
      }),
      fetchAgvErrorRecord(agvType, {
        sectionId: window.localStorage.getItem('sectionId'),
        agvId,
        current: 1,
        size: 3,
      }),
    ]);
    this.setState({ isFetching: false, agvRealtimeData, agvHardware, agvTask, agvErrorRecord });
  };

  taskOnDetail = (taskId) => {
    const { dispatch, agvType } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, taskAgvType: agvType },
    });
  };

  // 分页 获取记录
  getRecords = async (type, params) => {
    const { agvId, recordSearchParams, errorSearchParams } = this.state;
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
        agvId,
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
        agvId,
        ...page,
        ...errorSearchParams,
      });
      if (!dealResponse(errorData)) {
        this.setState({ isFetching: false, agvErrorRecord: errorData });
      }
    }
  };

  render() {
    const { agvId, agvList, isFetching } = this.state;
    const { agvRealtimeData, agvHardware, agvTask, agvErrorRecord, agvType } = this.state;

    return (
      <div className={commonStyles.tablePageWrapper}>
        <Row className={commonStyles.tableToolLeft} style={{ marginBottom: 20 }}>
          <LabelComponent label={formatMessage({ id: 'app.agv.id' })}>
            <Select
              showSearch
              value={agvId}
              style={{ width: '100%' }}
              onChange={(agvId) => {
                this.setState({ agvId });
              }}
            >
              {agvList.map(({ robotId }) => (
                <Option key={robotId} value={robotId}>
                  {robotId}
                </Option>
              ))}
            </Select>
          </LabelComponent>
          <Button
            type={'primary'}
            disabled={!agvId}
            loading={isFetching}
            onClick={this.fetchAgvMultivariateData}
          >
            <SearchOutlined /> <FormattedMessage id={'app.button.check'} />
          </Button>
        </Row>
        <Row style={{ flex: 1 }} justify={'space-between'}>
          <Col className={agvRealTimeComponentStyles.tabContainer}>
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
                <HardwareTab agvType={agvType} data={agvHardware} />
              </TabPane>
            </Tabs>
          </Col>
          <Col className={agvRealTimeComponentStyles.tabContainer}>
            <Tabs defaultActiveKey="taskRecord">
              {/* 小车任务记录 */}
              <TabPane
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
                      disabled={isNull(agvId)}
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
              </TabPane>

              {/* 小车错误记录 */}
              <TabPane
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
                  disabled={isNull(agvId)}
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
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    );
  }
}
export default AgvRealTimeComponent;
