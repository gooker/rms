import React, { memo, useEffect, useState } from 'react';
import { Button, Divider, Form, Input, Modal, Select, Tabs } from 'antd';
import {
  ExportOutlined,
  ImportOutlined,
  InfoOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { find } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout, isNull, isStrictNull } from '@/utils/util';
import { fetchScopeProgram, saveScopeProgram } from '@/services/XIHE';
import FormattedMessage from '@/components/FormattedMessage';
import ProgramingZone from './ProgramingZone';
import ProgramingCell from './ProgramingCell';
import ProgramingRelation from './ProgramingRelation';
import editorStyles from '../editorLayout.module.less';
import styles from './popoverPanel.module.less';

const { Option } = Select;
const { TabPane } = Tabs;
const { formItemLayout } = getFormLayout(4, 20);
const { formItemLayout: formItemLayout2 } = getFormLayout(4, 18);

const ProgramingPanel = (props) => {
  const { height, currentMap, currentLogicArea, scopeActions } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [needGLO, setNeedGLO] = useState(false); // 标记是否需要强制创建GLO
  const [scopeProgram, setScopeProgram] = useState([]); // 已保存的地图编程数据
  const [selectedRoute, setSelectedRoute] = useState(null); // 已选择的路线Code
  const [selectedScope, setSelectedScope] = useState(null); // 已选择的编程Code

  const scopeLoad = getScopeLoad();
  const hideTabs = isNull(selectedRoute) || isNull(selectedScope);

  useEffect(refresh, [currentMap, currentLogicArea]);

  function refresh() {
    fetchScopeProgram({
      mapId: currentMap.id,
      logicId: currentLogicArea,
    }).then((response) => {
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

  function openAddingScopeModal() {
    const GLO = find(scopeProgram, { routeCode: selectedRoute, scopeCode: 'GLO' });
    setNeedGLO(isNull(GLO));
    setVisible(true);
  }

  function renderRouteOptions() {
    const { logicAreaList } = currentMap;
    return logicAreaList
      .map(({ id, routeMap }) => {
        if (id === currentLogicArea) {
          return Object.values(routeMap).map(({ code, name }) => (
            <Option key={`${id}-${code}`} value={`${id}-${code}`}>
              {name}
            </Option>
          ));
        }
      })
      .filter(Boolean)
      .flat();
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

  // 获取指定编程数据
  function getScopeLoad() {
    if (isStrictNull(selectedRoute)) return null;
    const [, routeCode] = selectedRoute.split('-');
    return find(scopeProgram, {
      routeCode,
      scopeCode: selectedScope,
    });
  }

  // 获取不同类型的可配置动作
  function getActions(groupName) {
    const actions = find(scopeActions, { groupName });
    if (actions) {
      return actions.actionList;
    }
    return [];
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
          <Button
            style={{ marginLeft: 10, height: 40 }}
            onClick={() => {
              refresh();
              setSelectedRoute(null);
              setSelectedScope(null);
            }}
          >
            <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
          </Button>
        </div>
        <Divider style={{ background: '#a3a3a3', margin: '10px 0 20px 0' }} />

        {/* 选择路线区 */}
        <Form.Item label={<FormattedMessage id={'app.map.routeArea'} />} {...formItemLayout}>
          <Select
            value={selectedRoute}
            onChange={(value) => {
              setSelectedRoute(value);
              setSelectedScope(null);
            }}
            style={{ width: '100%' }}
          >
            {renderRouteOptions()}
          </Select>
        </Form.Item>

        {/* 选择编程 */}
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
                    onClick={openAddingScopeModal}
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
        <div className={styles.programTabs} style={{ opacity: hideTabs ? 0 : 1 }}>
          <Tabs defaultActiveKey="zone">
            <TabPane tab={<FormattedMessage id={'app.map.zone'} />} key="zone">
              <ProgramingZone scopeLoad={scopeLoad} actions={getActions('zone')} />
            </TabPane>
            <TabPane tab={<FormattedMessage id={'app.map.cell'} />} key="cell">
              <ProgramingCell scopeLoad={scopeLoad} actions={getActions('cell')} />
            </TabPane>
            <TabPane tab={<FormattedMessage id={'app.map.route'} />} key="relation">
              <ProgramingRelation scopeLoad={scopeLoad} actions={getActions('relation')} />
            </TabPane>
          </Tabs>
        </div>
      </div>

      {/* 创建编程 */}
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
        {needGLO && (
          <div style={{ margin: '0 0 5px 60px', color: 'red' }}>
            <InfoOutlined />
            <FormattedMessage id={'editor.program.route.noGLO'} />
          </div>
        )}
        <Form form={formRef} {...formItemLayout2}>
          <Form.Item
            name={'scopeCode'}
            label={formatMessage({ id: 'app.common.code' })}
            rules={[{ required: true }]}
            {...(needGLO ? { initialValue: 'GLO' } : {})}
          >
            <Input disabled={needGLO} />
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
  currentLogicArea: editor.currentLogicArea,
}))(memo(ProgramingPanel));
