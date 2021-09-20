import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Drawer, Menu } from 'antd';
import { ReadOutlined, SettingOutlined } from '@ant-design/icons';
import { isNull } from '@/utils/utils';
import IconDir from '@/components/AntdIcon/IconDir';
import { FormattedMessage } from '@/utils/Lang';

import CellMap from '../../components/CellMap';
import MapEditView from './MapEditView';
import RouterMap from './RouterMap';
import WorkStationMap from './FunctionArea/WorkStationMap';
import ChargerList from './FunctionArea/ChargerList';
import ElevatorList from './FunctionArea/ElevatorList';
import TunnelList from './FunctionArea/ChannelList';
import RestCells from './FunctionArea/RestCells';
import Intersection from './FunctionArea/IntersectionPanel';
import DumpFunction from './FunctionArea/DumpFunction';
import RollerFunction from './FunctionArea/RollerFunction';
import CommonFunction from './FunctionArea/CommonFunctionPanel';

const { SubMenu } = Menu;

class RightSliderMenu extends Component {
  container = React.createRef();

  state = {
    current: 'cellMap',
    visible: false,
  };

  componentDidMount() {
    this.container.current.addEventListener('wheel', (event) => {
      event.stopPropagation();
    });
  }

  handleClick = (e) => {
    this.setState({ current: e.key });
  };

  renderContent = () => {
    const { current } = this.state;
    switch (current) {
      case 'cellMap':
        return <CellMap />;
      case 'routerMap':
        return <RouterMap />;
      case 'view':
        return <MapEditView />;
      case 'workstationList':
        return <WorkStationMap />;
      case 'chargerList':
        return <ChargerList />;
      case 'elevatorList':
        return <ElevatorList />;
      case 'channel':
        return <TunnelList />;
      case 'restCells':
        return <RestCells />;
      case 'intersection':
        return <Intersection />;
      case 'dumpFunction':
        return <DumpFunction />;
      case 'commonFunction':
        return <CommonFunction />;
      default:
    }
  };

  render() {
    const { width, visible, currentLogicArea } = this.props;
    return (
      <div ref={this.container}>
        <Drawer
          placement="right"
          closable={false}
          visible={visible}
          width={width}
          mask={false}
          getContainer={false}
          bodyStyle={{ height: '100%', display: 'flex', flexFlow: 'column nowrap' }}
        >
          <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
            {/* 点位 */}
            <Menu.Item key="cellMap" icon={IconDir('iconcell')} disabled={isNull(currentLogicArea)}>
              <FormattedMessage id="app.rightSiderMenu.cellMap" />
            </Menu.Item>

            {/* 路线 */}
            <Menu.Item
              key="routerMap"
              icon={IconDir('iconline')}
              disabled={isNull(currentLogicArea)}
            >
              <FormattedMessage id="app.rightSiderMenu.routerMap" />
            </Menu.Item>

            {/* 显示 */}
            <Menu.Item key="view" icon={<ReadOutlined />} disabled={isNull(currentLogicArea)}>
              <FormattedMessage id="app.rightSiderMenu.view" />
            </Menu.Item>

            {/* 功能 */}
            <SubMenu
              key="SubMenu"
              icon={<SettingOutlined />}
              title={<FormattedMessage id="app.rightSiderMenu.setting" />}
              disabled={isNull(currentLogicArea)}
            >
              {/* 工作站 */}
              <Menu.Item key="workstationList">
                {IconDir('iconyuanshigongzuozhan')}{' '}
                <FormattedMessage id="app.rightSiderMenu.workstationList" />
              </Menu.Item>

              {/* 通用功能点 */}
              <Menu.Item key="commonFunction">
                {IconDir('icongongnengdian')}{' '}
                <FormattedMessage id="app.rightSiderMenu.commomPoint" />
              </Menu.Item>

              {/* 充电桩 */}
              <Menu.Item key="chargerList">
                {IconDir('iconchongdianzhuang1')}{' '}
                <FormattedMessage id="app.rightSiderMenu.chargerList" />
              </Menu.Item>

              {/* 电梯 */}
              <Menu.Item key="elevatorList">
                {IconDir('icondianti')} <FormattedMessage id="app.rightSiderMenu.elevatorList" />
              </Menu.Item>

              {/* 通道 */}
              <Menu.Item key="channel">
                {IconDir('icontongdao')} <FormattedMessage id="app.rightSiderMenu.channel" />
              </Menu.Item>

              {/* 休息区 */}
              <Menu.Item key="restCells">
                {IconDir('iconiconfront-')} <FormattedMessage id="app.rightSiderMenu.restCells" />
              </Menu.Item>

              {/* 交汇点 */}
              <Menu.Item key="intersection">
                {IconDir('iconintersectionquery')}{' '}
                <FormattedMessage id="app.rightSiderMenu.intersection" />
              </Menu.Item>

              {/* 抛物点 */}
              <Menu.Item key="dumpFunction">
                {IconDir('icongaokongpaowu')} <FormattedMessage id="app.rightSiderMenu.dumpPoint" />
              </Menu.Item>
            </SubMenu>
          </Menu>
          {this.renderContent()}
        </Drawer>
      </div>
    );
  }
}
export default connect(({ editor }) => ({
  currentLogicArea: editor.currentLogicArea,
}))(RightSliderMenu);
