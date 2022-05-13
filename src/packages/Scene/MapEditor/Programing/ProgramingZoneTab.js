/* TODO: I18N */
import React, { memo, useState } from 'react';
import { Button, Select, Divider, Empty, Col, Row } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { ZoneMarkerType } from '@/config/consts';
import ScopeProgramList from './ScopeProgramList';
import ProgramingZoneModal from './ProgramingZoneModal';
import { ProgramingItemType } from '@/config/config';
import { getCurrentRouteMapData } from '@/utils/mapUtil';

const ProgramingZoneTab = (props) => {
  const { dispatch, selections, zonePrograming } = props;

  const [configurationVisible, setConfigurationVisible] = useState(false);
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
    setConfigurationVisible(true);
  }

  function onEdit(id) {
    //
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
    setConfigurationVisible(false);
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

      <ProgramingZoneModal
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
  const zonePrograming = currentRouteMap.programing?.zones || {};
  return { selections, zonePrograming };
})(memo(ProgramingZoneTab));
