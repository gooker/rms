import React, { PureComponent } from 'react';
import { connect } from '@/utils/dva';
import { Drawer, Row, Tabs } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { hasPermission } from '@/utils/Permission';
import MenuIcon from '@/utils/MenuIcon';
import { GlobalDrawerWidth } from '@/config/consts';
import MonitorActionTab from '../TabPanel/ActionTab/MonitorActionTab';
import MonitorViewTab from '../TabPanel/ViewTab/MonitorViewTab';
import SimulatorTab from '../TabPanel/SimulatorTab/SimulatorTab';
import Dashboard from '../Dashboard/Dashboard';

const { TabPane } = Tabs;
@connect(({ monitor }) => ({
  currentMap: monitor.currentMap,
  drawerVisible: monitor.drawerVisible,
  dashBoardVisible: monitor.dashBoardVisible,
}))
class RightSliderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  componentDidMount() {
    this.container.current.addEventListener('wheel', (event) => {
      event.stopPropagation();
    });
  }

  render() {
    const { currentMap, drawerVisible, dashBoardVisible } = this.props;
    return (
      <div ref={this.container} style={{ opacity: dashBoardVisible ? '0.95' : 1 }}>
        {/* DashBoard Drawer */}
        {drawerVisible && dashBoardVisible && (
          <Drawer
            mask={false}
            closable={false}
            placement="right"
            width={GlobalDrawerWidth}
            visible={drawerVisible && dashBoardVisible}
            bodyStyle={{ height: '100%', display: 'flex', flexFlow: 'column nowrap', padding: 0 }}
          >
            <Dashboard currentMap={currentMap} />
          </Drawer>
        )}

        {/* Monitor ToolBar */}
        <Drawer
          mask={false}
          closable={false}
          placement="right"
          width={GlobalDrawerWidth}
          visible={drawerVisible && !dashBoardVisible}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ padding: 24 }}>
            <Tabs defaultActiveKey="1">
              <TabPane
                key="1"
                tab={
                  <span>
                    {MenuIcon.read}
                    <FormattedMessage id="app.monitor.tab.operation" />
                  </span>
                }
              >
                <Row style={{ marginTop: 20 }}>
                  <MonitorActionTab />
                </Row>
              </TabPane>
              <TabPane
                key="2"
                tab={
                  <span>
                    {MenuIcon.read}
                    <FormattedMessage id="app.monitor.tab.view" />
                  </span>
                }
              >
                <Row style={{ marginTop: 20 }}>
                  <MonitorViewTab {...this.props} />
                </Row>
              </TabPane>
              {hasPermission('/map/monitor/simulator') && (
                <TabPane
                  key="3"
                  tab={
                    <span>
                      {MenuIcon.read}
                      <FormattedMessage id="app.monitor.tab.simulator" />
                    </span>
                  }
                >
                  <SimulatorTab />
                </TabPane>
              )}
            </Tabs>
          </div>
        </Drawer>
      </div>
    );
  }
}
export default RightSliderMenu;
