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
import { IconFont } from '@/components/IconFont';
import { formatMessage } from '@/utils/utils';

const EditorHeaderRightTools = (props) => {
  const { mapId, saveMapLoading, activeMapLoading, isActive } = props;

  return (
    <>
      {/* 地图全屏 */}
      <Tooltip title={formatMessage({ id: 'mapEditor.fullScreen' })}>
        <span style={{ cursor: 'pointer' }}>
          <FullscreenOutlined />
        </span>
      </Tooltip>
      <Divider type="vertical" />

      {/* 查询点位 */}
      <Tooltip title={formatMessage({ id: 'mapEditor.locate' })}>
        <span style={{ cursor: 'pointer' }}>
          <AimOutlined />
        </span>
      </Tooltip>
      <Divider type="vertical" />

      {/* 导出施工图 */}
      <Tooltip title={formatMessage({ id: 'mapEditor.constructionDrawing.export' })}>
        <span style={{ cursor: mapId ? 'pointer' : 'not-allowed' }}>
          <IconFont type={'icon-constructionDrawing'} />
        </span>
      </Tooltip>
      <Divider type="vertical" />

      {/* 导出地图 */}
      <Tooltip title={formatMessage({ id: 'app.button.export' })}>
        <span style={{ cursor: mapId ? 'pointer' : 'not-allowed' }}>
          <IconFont type={'icon-download'} />
        </span>
      </Tooltip>

      <Divider type="vertical" />

      {/* 导入地图 */}
      <Tooltip title={formatMessage({ id: 'app.button.import' })}>
        <span style={{ cursor: 'pointer' }}>
          <IconFont type={'icon-upload'} />
        </span>
      </Tooltip>
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
            <IconFont type={'icon-active'} />
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
}))(memo(EditorHeaderRightTools));
