import React, { memo, useEffect, useState } from 'react';
import { Button, Divider, Form, Input, Modal, Select, Tabs } from 'antd';
import { ExportOutlined, ImportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { find, findIndex } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout, isNull, isStrictNull } from '@/utils/util';
import { fetchScopeProgram, saveScopeProgram } from '@/services/XIHE';
import FormattedMessage from '@/components/FormattedMessage';
import ProgramingZone from './ProgramingZone';
import ProgramingCell from './ProgramingCell';
import ProgramingRelation from './ProgramingRelation';
import editorStyles from '../editorLayout.module.less';
import styles from './popoverPanel.module.less';

const { Option, OptGroup } = Select;
const { TabPane } = Tabs;
const { formItemLayout } = getFormLayout(4, 20);
const { formItemLayout: formItemLayout2 } = getFormLayout(4, 18);

const ProgramingPanel = (props) => {
  const { height, currentMap, scopeActions } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scopeProgram, setScopeProgram] = useState([]); // 已保存的地图编程数据
  const [selectedRoute, setSelectedRoute] = useState(null); // 已选择的路线Code
  const [selectedScope, setSelectedScope] = useState(null); // 已选择的编程Code
  const scopeLoad = getScopeLoad();

  useEffect(refresh, []);
  useEffect(refresh, [currentMap]);

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
        detailMap: { zone: [], cell: [], relation: [] },
      };
      saveScopeProgram(scopeProgramItem)
        .then((response) => {
          if (!dealResponse(response, true)) {
            setVisible(false);
            refresh();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }

  function getScopeLoad() {
    if (isStrictNull(selectedRoute)) return null;
    const [logicId, routeCode] = selectedRoute.split('-');
    return find(scopeProgram, {
      logicId: parseInt(logicId),
      routeCode,
      scopeCode: selectedScope,
    });
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

  function renderScopeOptions() {
    if (isStrictNull(selectedRoute)) return [];
    const [logicId, routeCode] = selectedRoute.split('-');
    const scopes = scopeProgram.filter(
      (item) => item.logicId === parseInt(logicId) && item.routeCode === routeCode,
    );
    return scopes.map((item) => (
      <Select.Option key={item.scopeCode} value={item.scopeCode}>
        {item.scopeName}
      </Select.Option>
    ));
  }

  function getActions(groupName) {
    const actions = find(scopeActions, { groupName });
    if (actions) {
      return actions.actionList;
    }
    return [];
  }

  // type：zone, cell, relation
  function submit(detail, type) {
    // 直接替换并保存后台
    const scopeProgramItem = { ...scopeLoad, detailMap: { ...scopeLoad.detailMap } };
    const typeLoad = [...scopeProgramItem.detailMap[type]];
    const index = findIndex(typeLoad, { zoneCode: detail.zoneCode });
    typeLoad.splice(index, 1, detail);
    scopeProgramItem.detailMap[type] = typeLoad;

    // request
    setLoading(true);
    saveScopeProgram(scopeProgramItem)
      .then((response) => {
        if (!dealResponse(response, true)) {
          setVisible(false);
          refresh();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div style={{ height, width: 350 }} className={editorStyles.categoryPanel}>
      {/* 标题栏 */}
      <div>
        <FormattedMessage id={'app.map.programing'} />
      </div>

      {/* 操作区 */}
      <div>
        {/* 工具栏 */}
        <div>
          <Button type={'primary'} style={{ height: 40 }}>
            <ExportOutlined /> <FormattedMessage id={'app.button.export'} />
          </Button>
          <Button style={{ marginLeft: 10, height: 40 }}>
            <ImportOutlined /> <FormattedMessage id={'app.button.import'} />
          </Button>
          <Button style={{ marginLeft: 10, height: 40 }} onClick={refresh}>
            <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
          </Button>
        </div>
        <Divider style={{ background: '#a3a3a3', margin: '10px 0 20px 0' }} />
        {/* 选择区 */}
        <Form.Item label={<FormattedMessage id={'app.map.routeArea'} />} {...formItemLayout}>
          <Select
            value={selectedRoute}
            onChange={(value) => setSelectedRoute(value)}
            style={{ width: '100%' }}
          >
            {renderRouteOptions()}
          </Select>
        </Form.Item>
        <Form.Item label={<FormattedMessage id={'app.map.scope'} />} {...formItemLayout}>
          <Select
            disabled={isNull(selectedRoute)}
            style={{ width: '100%' }}
            value={selectedScope}
            onChange={(value) => setSelectedScope(value)}
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
          >
            {renderScopeOptions()}
          </Select>
        </Form.Item>
        {/* Tab栏 */}
        <div className={styles.programTabs}>
          <Tabs defaultActiveKey="zone">
            <TabPane tab={<FormattedMessage id={'app.map.zone'} />} key="zone">
              <ProgramingZone
                loading={loading}
                data={scopeLoad?.detailMap?.zone}
                actions={getActions('zone')}
                submit={submit}
              />
            </TabPane>
            <TabPane tab={<FormattedMessage id={'app.map.cell'} />} key="cell">
              <ProgramingCell data={scopeLoad?.detailMap?.cell} actions={getActions('cell')} />
            </TabPane>
            <TabPane tab={<FormattedMessage id={'app.map.route'} />} key="relation">
              <ProgramingRelation
                data={scopeLoad?.detailMap?.relation}
                actions={getActions('relation')}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>

      <Modal
        visible={visible}
        width={450}
        title={`${formatMessage({ id: 'app.button.add' })}${formatMessage({
          id: 'app.map.scope',
        })}`}
        okButtonProps={{
          loading,
          disabled: loading,
        }}
        onOk={addScope}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Form form={formRef} {...formItemLayout2}>
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
  scopeActions: editor.scopeActions,
}))(memo(ProgramingPanel));
