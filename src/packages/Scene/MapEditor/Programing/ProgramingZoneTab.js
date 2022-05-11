/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Button, Select, Divider, Empty } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import { ZoneMarkerType } from '@/config/consts';
import ScopeProgramList from './ScopeProgramList';
import ProgramingZoneModal from './ProgramingZoneModal';

const ProgramingZoneTab = (props) => {
  const { currentLogicArea } = props;

  const [configurationVisible, setConfigurationVisible] = useState(false);
  const [zoneMarkers, setZoneMarkers] = useState([]);
  const [selection, setSelection] = useState([]);

  useEffect(() => {
    // 暂时只处理矩形区域
    let zoneMarker = getCurrentLogicAreaData()?.zoneMarker || [];
    zoneMarker = zoneMarker.filter((item) => item.type === ZoneMarkerType.RECT);
    setZoneMarkers(zoneMarker);
  }, [currentLogicArea]);

  function save(payload) {
    //
  }

  function startConfiguration() {
    setConfigurationVisible(true);
  }

  function onEdit(id) {
    //
  }

  function onDelete(id) {
    //
  }

  function terminateConfiguration() {
    setConfigurationVisible(false);
  }

  return (
    <div style={{ paddingTop: 20 }}>
      <div>
        <Select allowClear mode={'multiple'} onChange={setSelection} style={{ width: '100%' }}>
          {zoneMarkers.map((item) => (
            <Select.Option key={item.code} value={item.code}>
              {item.text || item.code}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Button
        type='primary'
        onClick={startConfiguration}
        disabled={selection.length === 0}
        style={{ marginTop: 10 }}
      >
        <SettingOutlined /> 开始配置
      </Button>

      {/* 区域配置列表 */}
      <Divider style={{ background: '#a3a3a3' }} />
      {startConfiguration.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ color: 'white' }} />
      ) : (
        <ScopeProgramList datasource={[]} onEdit={onEdit} onDelete={onDelete} />
      )}

      <ProgramingZoneModal
        visible={configurationVisible}
        onConfirm={save}
        onCancel={terminateConfiguration}
      />
    </div>
  );
};
export default connect(({ editor }) => ({
  currentLogicArea: editor.currentLogicArea,
}))(memo(ProgramingZoneTab));
