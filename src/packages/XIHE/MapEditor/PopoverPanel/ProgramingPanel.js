import React, { memo } from 'react';
import { Button, Divider, Select, Tabs } from 'antd';
import { ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import LabelComponent from '@/components/LabelComponent';
import editorStyles from '../editorLayout.module.less';
import { formatMessage } from '@/utils/util';
import ProgramingZone from '@/packages/XIHE/MapEditor/PopoverPanel/ProgramingZone';
import ProgramingCell from '@/packages/XIHE/MapEditor/PopoverPanel/ProgramingCell';
import ProgramingRelation from '@/packages/XIHE/MapEditor/PopoverPanel/ProgramingRelation';

const { Option, OptGroup } = Select;
const { TabPane } = Tabs;

const ProgramingPanel = (props) => {
  const { height, currentMap } = props;

  function addScope() {}

  function renderRouteOptions() {
    const { logicAreaList } = currentMap;
    return logicAreaList.map(({ id, name, routeMap }) => (
      <OptGroup key={id} label={`${formatMessage({ id: 'app.map.logicArea' })}: ${name}`}>
        {Object.values(routeMap).map(({ code, name }) => (
          <Option key={code} value={`${id}-${code}`}>
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
          <Button style={{ height: 40 }}>
            <ExportOutlined /> <FormattedMessage id={'app.button.export'} />
          </Button>
          <Button style={{ marginLeft: 10, height: 40 }}>
            <ImportOutlined /> <FormattedMessage id={'app.button.import'} />
          </Button>
        </div>
        <Divider style={{ background: '#a3a3a3' }} />
        <LabelComponent label={<FormattedMessage id={'app.map.routeArea'} />}>
          <Select style={{ width: '100%' }}>{renderRouteOptions()}</Select>
        </LabelComponent>
        <LabelComponent label={<FormattedMessage id={'app.map.scope'} />} style={{ marginTop: 15 }}>
          <Select
            style={{ width: '100%' }}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ padding: '2px 0 2px 10px', cursor: 'pointer' }} onClick={addScope}>
                  <PlusOutlined /> <FormattedMessage id={'editor.addScope'} />
                </div>
              </div>
            )}
          >
            <Select.Option>111</Select.Option>
          </Select>
        </LabelComponent>
        <Tabs defaultActiveKey="zone">
          <TabPane tab={<FormattedMessage id={'app.map.zone'} />} key="zone">
            <ProgramingZone />
          </TabPane>
          <TabPane tab={<FormattedMessage id={'app.map.cell'} />} key="cell">
            <ProgramingCell />
          </TabPane>
          <TabPane tab={<FormattedMessage id={'app.map.routeMap'} />} key="relation">
            <ProgramingRelation />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
export default connect(({ editor }) => ({
  currentMap: editor.currentMap,
}))(memo(ProgramingPanel));
