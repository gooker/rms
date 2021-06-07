import React from 'react';
import { Row, Col, Tabs, Form, Button, Select, message } from 'antd';
import { dealResponse } from '@/utils/utils';
import { fetchAgvList } from '@/services/api';
import { FormattedMessage, formatMessage } from '@/utils/Lang';
import RealTimeTab from './RealTimeTab';
import HardwareTab from './HardwareTab';
import TaskRecordTab from './TaskRecordTab';
import ErrorRecordTab from './ErrorRecordTab';

import agvRealTimeComponentStyles from './agvRealTimeComponent.module.less';
import commonStyles from '@/common.module.less';

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
        <Row>
          <Col style={{ width: '222px', marginRight: 24 }}>
            <Form.Item label={formatMessage({ id: 'app.agv.id' })}>
              <Select
                showSearch
                value={agvInView}
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
            </Form.Item>
          </Col>
          <Col>
            <Button type={'primary'}>
              <FormattedMessage id={'app.button.check'} />
            </Button>
          </Col>
        </Row>
        <Row style={{ flex: 1 }} justify={'space-between'}>
          <Col className={agvRealTimeComponentStyles.tabContainer}>
            <Tabs defaultActiveKey="realTime">
              <TabPane
                key="realTime"
                tab={<FormattedMessage id={'app.activity.realTimeAgvState'} />}
              >
                <RealTimeTab agvType={agvType} />
              </TabPane>
              <TabPane
                key="hardWare"
                tab={<FormattedMessage id={'app.activity.agvHardwareState'} />}
              >
                <HardwareTab agvType={agvType} />
              </TabPane>
            </Tabs>
          </Col>
          <Col className={agvRealTimeComponentStyles.tabContainer}>
            <Tabs defaultActiveKey="taskRecord">
              <TabPane key="taskRecord" tab={<FormattedMessage id={'app.agv.taskRecord'} />}>
                <TaskRecordTab agvType={agvType} />
              </TabPane>
              <TabPane key="errorRecord" tab={<FormattedMessage id={'app.agv.errorRecord'} />}>
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
