import React, { memo } from 'react';
import { Divider, Tooltip } from 'antd';
import {
  LoadingOutlined,
  SaveOutlined,
  LockOutlined,
  FullscreenOutlined,
  AimOutlined,
} from '@ant-design/icons';

import { connect } from '@/utils/dva';
import { formatMessage } from '@/utils/utils';
import { getIconFont } from '@/components/IconFont';

const EditorHeaderTools = (props) => {
  const { mapId, saveMapLoading, activeMapLoading, isActive } = props;

  return (
    <>
      {/* 地图全屏 */}
      <Tooltip title={formatMessage({ id: 'mapEditor.fullScreen' })}>
        <FullscreenOutlined />
      </Tooltip>
      <Divider type="vertical" />

      {/* 查询点位 */}
      <Tooltip title={formatMessage({ id: 'mapEditor.locate' })}>
        <AimOutlined />
      </Tooltip>
      <Divider type="vertical" />

      {/* 导出施工图 */}
      <span style={{ cursor: mapId ? 'pointer' : 'not-allowed' }}>
        <Tooltip title={formatMessage({ id: 'mapEditor.constructionDrawing.export' })}>
          {getIconFont('icon-shigongtu')}
        </Tooltip>
      </span>
      <Divider type="vertical" />

      {/* 导出地图 */}
      <span style={{ cursor: mapId ? 'pointer' : 'not-allowed' }}>
        <Tooltip title={formatMessage({ id: 'app.button.export' })}>
          {getIconFont('icon-download')}
        </Tooltip>
      </span>
      <Divider type="vertical" />

      {/* 导入地图 */}
      <span>
        <Tooltip title={formatMessage({ id: 'app.button.import' })}>
          {getIconFont('icon-upload')}
        </Tooltip>
      </span>
      <Divider type="vertical" />

      {/* 保存地图 */}
      <span style={{ cursor: mapId ? 'pointer' : 'not-allowed' }}>
        <Tooltip title={formatMessage({ id: 'app.button.save' })}>
          {saveMapLoading ? <LoadingOutlined /> : <SaveOutlined />}
        </Tooltip>
      </span>
      <Divider type="vertical" />

      {/* 地图激活 */}
      <span
        style={{
          cursor: !isActive && mapId ? 'pointer' : 'not-allowed',
        }}
      >
        {activeMapLoading ? (
          <LoadingOutlined />
        ) : isActive ? (
          <Tooltip title={formatMessage({ id: 'mapEditor.active.warn' })}>
            <LockOutlined />
          </Tooltip>
        ) : (
          <Tooltip title={formatMessage({ id: 'mapEditor.active' })}>
            {getIconFont('icon-jihuo')}
          </Tooltip>
        )}
      </span>
    </>
  );
};
export default connect(({ editor }) => ({
  mapId: editor?.currentMap?.id,
  saveMapLoading: editor.saveMapLoading,
  activeMapLoading: editor.activeMapLoading,
  isActive: editor?.currentMap?.activeFlag,
}))(memo(EditorHeaderTools));
