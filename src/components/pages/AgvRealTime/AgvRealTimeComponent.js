import React from 'react';
import { Row, Col, Tabs, Button, Select, message } from 'antd';
import { FileTextOutlined, AndroidOutlined, WarningOutlined, AimOutlined } from '@ant-design/icons';
import { FormattedMessage, formatMessage } from '@/utils/Lang';
import LabelComponent from '@/components/LabelComponent';
import { dealResponse } from '@/utils/Utils';
import { fetchAgvList } from '@/services/api';
import commonStyles from '@/common.module.less';
import RealTimeTab from './RealTimeTab';
import HardwareTab from './HardwareTab';
import TaskRecordTab from './TaskRecordTab';
import ErrorRecordTab from './ErrorRecordTab';
import agvRealTimeComponentStyles from './index.module.less';

const { Option } = Select;
const { TabPane } = Tabs;

class AgvRealTimeComponent extends React.Component {
  state = {
    agvInView: null, // 标记正在查看的小车ID
    agvList: [],
  };

  componentDidMount() {
    this.getAgvList();
  }

  getAgvList = async () => {
    const { agvType } = this.props;
    const sectionId = window.localStorage.getItem('sectionId');
    const response = await fetchAgvList(agvType, sectionId);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.agv.getListFail' }));
    } else {
      this.setState({ agvList: response });
    }
  };

  render() {
    const { agvList, agvInView } = this.state;
    const { agvType } = this.props;

    return (
      <div className={commonStyles.tablePageWrapper}>
        <Row className={commonStyles.tableToolLeft} style={{ marginBottom: 20 }}>
          <LabelComponent label={formatMessage({ id: 'app.agv.id' })}>
            <Select
              showSearch
              value={agvInView}
              style={{ width: '100%' }}
              onChange={(agvId) => {
                this.setState({ agvInView: agvId });
              }}
            >
              {agvList.map(({ robotId }) => (
                <Option key={robotId} value={robotId}>
                  {robotId}
                </Option>
              ))}
            </Select>
          </LabelComponent>
          <Button type={'primary'}>
            <FormattedMessage id={'app.button.check'} />
          </Button>
        </Row>
        <Row style={{ flex: 1 }} justify={'space-between'}>
          <Col className={agvRealTimeComponentStyles.tabContainer}>
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
                <RealTimeTab agvType={agvType} />
              </TabPane>
              <TabPane
                key="hardWare"
                tab={
                  <span>
                    <AndroidOutlined />
                    <FormattedMessage id={'app.activity.agvHardwareState'} />
                  </span>
                }
              >
                <HardwareTab agvType={agvType} />
              </TabPane>
            </Tabs>
          </Col>
          <Col className={agvRealTimeComponentStyles.tabContainer}>
            <Tabs defaultActiveKey="taskRecord">
              <TabPane
                key="taskRecord"
                tab={
                  <span>
                    <FileTextOutlined />
                    <FormattedMessage id={'app.agv.taskRecord'} />
                  </span>
                }
              >
                <TaskRecordTab agvType={agvType} />
              </TabPane>
              <TabPane
                key="errorRecord"
                tab={
                  <span>
                    <WarningOutlined />
                    <FormattedMessage id={'app.agv.errorRecord'} />
                  </span>
                }
              >
                <ErrorRecordTab agvType={agvType} />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    );
  }
}
export default AgvRealTimeComponent;
