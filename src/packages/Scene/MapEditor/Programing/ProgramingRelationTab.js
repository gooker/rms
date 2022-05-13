/* TODO: I18N */
import React, { memo, useState } from 'react';
import { Button, Col, Divider, Empty, InputNumber, Row, Select } from 'antd';
import { PlusOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { MapSelectableSpriteType } from '@/config/consts';
import ScopeProgramList from './ScopeProgramList';
import ProgramingRelationModal from './ProgramingRelationModal';
import { ProgramingItemType } from '@/config/config';
import { convertMapToArrayMap } from '@/utils/util';
import { getCurrentRouteMapData } from '@/utils/mapUtil';

const ProgramingRelationTab = (props) => {
  const { dispatch, selections, relationPrograming } = props;

  const [configRoutes, setConfigRoutes] = useState([]);
  const [configurationVisible, setConfigurationVisible] = useState(false);
  const [searchKey, setSearchKey] = useState(null);
  const [editing, setEditing] = useState(null);

  const selectRoutes = selections
    .filter((item) => item.type === MapSelectableSpriteType.ROUTE)
    .map(({ id }) => id);

  function save(configuration) {
    dispatch({
      type: 'editor/updateMapPrograming',
      payload: {
        type: ProgramingItemType.relation,
        items: configRoutes,
        configuration,
      },
    });
  }

  function onEdit(item) {
    setEditing(item);
    setConfigRoutes([item.key]);
    setConfigurationVisible(true);
  }

  function onDelete(item) {
    dispatch({
      type: 'editor/deleteMapPrograming',
      payload: { type: ProgramingItemType.relation, key: item.key },
    }).then(({ type, key }) => {
      console.log(type, key);
    });
  }

  function startConfiguration() {
    setConfigurationVisible(true);
  }

  function terminateConfiguration() {
    setConfigurationVisible(false);
  }

  return (
    <div style={{ paddingTop: 20 }}>
      <Row gutter={4}>
        <Col span={21}>
          <Select
            allowClear
            mode={'tags'}
            value={configRoutes}
            onChange={setConfigRoutes}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={3}>
          <Button
            onClick={() => {
              setConfigRoutes(selectRoutes);
            }}
            disabled={selectRoutes.length === 0}
            icon={<PlusOutlined />}
          />
        </Col>
      </Row>
      <Button
        type='primary'
        onClick={startConfiguration}
        disabled={configRoutes.length === 0}
        style={{ marginTop: 10 }}
      >
        <SettingOutlined /> 开始配置
      </Button>

      {/* 搜索部分 */}
      <Divider style={{ background: '#a3a3a3' }} />
      <InputNumber
        allowClear
        prefix={<SearchOutlined />}
        style={{ marginBottom: 10, width: '100%' }}
        value={searchKey}
        onChange={debounce((value) => {
          setSearchKey(value);
        }, 200)}
      />
      {relationPrograming.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ color: 'white' }} />
      ) : (
        <ScopeProgramList datasource={relationPrograming} onEdit={onEdit} onDelete={onDelete} />
      )}

      {/* 配置弹窗 */}
      <ProgramingRelationModal
        editing={editing}
        relations={configRoutes}
        visible={configurationVisible}
        onConfirm={save}
        onCancel={terminateConfiguration}
      />
    </div>
  );
};
export default connect(({ editor }) => {
  const { selections } = editor;
  const currentRouteMap = getCurrentRouteMapData();
  let relationPrograming = currentRouteMap.programing?.relations || {};
  relationPrograming = convertMapToArrayMap(relationPrograming, 'key', 'actions');
  return { selections, relationPrograming };
})(memo(ProgramingRelationTab));
