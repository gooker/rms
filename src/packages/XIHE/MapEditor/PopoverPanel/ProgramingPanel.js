import React, { memo, useState } from 'react';
import { Button, Divider, Select, Tabs } from 'antd';
import { ExportOutlined, ImportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import LabelComponent from '@/components/LabelComponent';
import ProgramingZone from './ProgramingZone';
import ProgramingCell from './ProgramingCell';
import ProgramingRelation from './ProgramingRelation';
import editorStyles from '../editorLayout.module.less';
import styles from './popoverPanel.module.less';

const { Option, OptGroup } = Select;
const { TabPane } = Tabs;

const ProgramingPanel = (props) => {
  const { height, currentMap } = props;

  const [selectedRoute, setSelectedRoute] = useState(null);

  function addScope() {}

  function onSelectRoute(value) {
    setSelectedRoute(value);
  }

  function renderRouteOptions() {
    const { logicAreaList } = currentMap;
    return logicAreaList.map(({ id, name, routeMap }) => (
      <OptGroup key={id} label={`${formatMessage({ id: 'app.map.logicArea' })}: ${name}`}>
        {Object.values(routeMap).map(({ code, name }) => (
          <Option key={`${id}-${code}`} value={`${id}-${code}`}>
            {name}
          </Option>
        ))}
      </OptGroup>
    ));
  }

  return (
    <div style={{ height, width: 350 }} className={editorStyles.categoryPanel}>
      {/* 标题栏 */}
      <div>
        <FormattedMessage id={'app.map.programing'} />
      </div>

      {/* 操作区 */}
      <div>
        <div>
          <Button type={'primary'} style={{ height: 40 }}>
            <ExportOutlined /> <FormattedMessage id={'app.button.export'} />
          </Button>
          <Button style={{ marginLeft: 10, height: 40 }}>
            <ImportOutlined /> <FormattedMessage id={'app.button.import'} />
          </Button>
          <Button type={'dashed'} style={{ marginLeft: 10, height: 40 }}>
            <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
          </Button>
        </div>
        <Divider style={{ background: '#a3a3a3', margin: '10px 0 20px 0' }} />
        <LabelComponent label={<FormattedMessage id={'app.map.routeArea'} />}>
          <Select style={{ width: '100%' }} onChange={onSelectRoute} value={selectedRoute}>
            {renderRouteOptions()}
          </Select>
        </LabelComponent>
        <LabelComponent label={<FormattedMessage id={'app.map.scope'} />} style={{ marginTop: 15 }}>
          <Select
            style={{ width: '100%' }}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div
                  onClick={addScope}
                  style={{ padding: '2px 0 2px 10px', cursor: 'pointer', textAlign: 'center' }}
                >
                  <PlusOutlined /> <FormattedMessage id={'editor.addScope'} />
                </div>
              </div>
            )}
          />
        </LabelComponent>
        <div className={styles.programTabs}>
          <Tabs defaultActiveKey="zone">
            <TabPane tab={<FormattedMessage id={'app.map.zone'} />} key="zone">
              <ProgramingZone />
            </TabPane>
            <TabPane tab={<FormattedMessage id={'app.map.cell'} />} key="cell">
              <ProgramingCell />
            </TabPane>
            <TabPane tab={<FormattedMessage id={'app.map.route'} />} key="relation">
              <ProgramingRelation />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
export default connect(({ editor }) => ({
  currentMap: editor.currentMap,
}))(memo(ProgramingPanel));
