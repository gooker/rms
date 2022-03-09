import React, { memo, useEffect, useState } from 'react';
import { Button, Divider, Form, Input, Modal, Select, Tabs } from 'antd';
import { ExportOutlined, ImportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import LabelComponent from '@/components/LabelComponent';
import ProgramingZone from './ProgramingZone';
import ProgramingCell from './ProgramingCell';
import ProgramingRelation from './ProgramingRelation';
import editorStyles from '../editorLayout.module.less';
import styles from './popoverPanel.module.less';
import { fetchScopeProgram, saveScopeProgram } from '@/services/XIHE';

const { Option, OptGroup } = Select;
const { TabPane } = Tabs;

const ProgramingPanel = (props) => {
  const { height, currentMap } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [scopeProgram, setScopeProgram] = useState([]); // 已保存的地图编程数据

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    fetchScopeProgram({ mapId: currentMap.id }).then((response) => {
      if (
        !dealResponse(
          response,
          false,
          null,
          formatMessage({ id: 'app.message.fetchScopeProgramFail' }),
        )
      ) {
        setScopeProgram(response);
      }
    });
  }

  function addScope() {
    const [logicId, routeCode] = selectedRoute.split('-');
    formRef.validateFields().then((values) => {
      setLoading(true);
      const scopeProgramItem = {
        mapId: currentMap.id,
        logicId,
        routeCode,
        ...values,
        detailMap: {},
      };
      saveScopeProgram(scopeProgramItem)
        .then((response) => {
          if (!dealResponse(response, true)) {
            setVisible(false);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }

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
          <Button type={'dashed'} style={{ marginLeft: 10, height: 40 }} onClick={refresh}>
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
                <div style={{ padding: '2px 0 2px 10px', cursor: 'pointer', textAlign: 'center' }}>
                  <Button
                    type="text"
                    disabled={isNull(selectedRoute)}
                    onClick={() => {
                      setVisible(true);
                    }}
                  >
                    <PlusOutlined /> <FormattedMessage id={'editor.addScope'} />
                  </Button>
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

      <Modal
        visible={visible}
        width={500}
        okButtonProps={{
          loading,
          disabled: loading,
        }}
        onOk={addScope}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Form form={formRef}>
          <Form.Item
            name={'scopeCode'}
            label={formatMessage({ id: 'app.common.code' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={'scopeName'}
            label={formatMessage({ id: 'app.common.name' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default connect(({ editor }) => ({
  currentMap: editor.currentMap,
}))(memo(ProgramingPanel));
