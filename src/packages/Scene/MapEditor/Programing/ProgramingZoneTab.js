/* TODO: I18N */
import React, { memo, useState } from 'react';
import { Button, Select, Divider, Empty, Col, Row } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { ZoneMarkerType } from '@/config/consts';
import ScopeProgramList from './ScopeProgramList';
import { ProgramingItemType } from '@/config/config';
import { getCurrentRouteMapData } from '@/utils/mapUtil';
import { convertMapToArrayMap } from '@/utils/util';
import ProgramingConfiguerModal from '@/components/ProgramingConfiguer';

const ProgramingZoneTab = (props) => {
  const { dispatch, selections, zonePrograming, programing } = props;

  const [configVisible, setConfigVisible] = useState(false);
  const [configZone, setConfigZone] = useState([]);
  const [editing, setEditing] = useState(null);

  // 暂时只处理矩形区域
  const selectZones = selections
    .filter((item) => item.type === ZoneMarkerType.RECT)
    .map(({ code }) => code);

  function save(configuration) {
    dispatch({
      type: 'editor/updateMapPrograming',
      payload: {
        type: ProgramingItemType.zone,
        items: configZone,
        configuration,
      },
    });
  }

  function addConfigZone() {
    setConfigZone([...selectZones]);
  }

  function startConfiguration() {
    setConfigVisible(true);
  }

  function onEdit(item) {
    setEditing(item);
    setConfigZone([item.key]);
    setConfigVisible(true);
  }

  function onDelete(item) {
    dispatch({
      type: 'editor/deleteMapPrograming',
      payload: { type: ProgramingItemType.zone, key: item.key },
    }).then(({ type, key }) => {
      console.log(type, key);
    });
  }

  function terminateConfiguration() {
    setConfigVisible(false);
  }

  return (
    <div style={{ paddingTop: 20 }}>
      <Row gutter={4}>
        <Col span={21}>
          <Select
            allowClear
            mode={'tags'}
            value={configZone}
            onChange={setConfigZone}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={3}>
          <Button onClick={addConfigZone} icon={<PlusOutlined />} />
        </Col>
      </Row>
      <Button
        type='primary'
        onClick={startConfiguration}
        disabled={configZone.length === 0}
        style={{ marginTop: 10 }}
      >
        <SettingOutlined /> 开始配置
      </Button>

      {/* 区域配置列表 */}
      <Divider style={{ background: '#a3a3a3' }} />
      {zonePrograming.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ color: 'white' }} />
      ) : (
        <ScopeProgramList datasource={zonePrograming} onEdit={onEdit} onDelete={onDelete} />
      )}

      <ProgramingConfiguerModal
        title={'编辑区域编程'}
        editing={editing}
        programing={programing}
        visible={configVisible}
        onOk={save}
        onCancel={terminateConfiguration}
      />
    </div>
  );
};
export default connect(({ editor, global }) => {
  const { selections } = editor;
  const currentRouteMap = getCurrentRouteMapData();
  let zonePrograming = currentRouteMap.programing?.zones || {};
  zonePrograming = convertMapToArrayMap(zonePrograming, 'key', 'actions');
  return { selections, zonePrograming, programing: global.programing };
})(memo(ProgramingZoneTab));
