import React, { memo, useState } from 'react';
import { Divider, message, Modal, Tooltip } from 'antd';
import {
  LoadingOutlined,
  SaveOutlined,
  LockOutlined,
  FullscreenOutlined,
  AimOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import { connect } from '@/utils/dva';
import { IconFont } from '@/components/IconFont';
import { formatMessage } from '@/utils/utils';
import PositionCell from '../components/PositionCell';

const EditorHeaderRightTools = (props) => {
  const { dispatch, mapId, isInnerFullscreen, saveMapLoading, activeMapLoading, isActive } = props;

  const [positionVisible, setPositionVisible] = useState(false);

  function activeMap() {
    if (mapId) {
      dispatch({ type: 'editor/activeMap', payload: mapId });
    } else {
      message.warn(formatMessage({ id: 'app.mapTool.saveMap' }));
    }
  }

  function changeInnerFullScreen(payload) {
    dispatch({ type: 'global/changeInnerFullScreen', payload });
  }

  return (
    <>
      {/* 地图全屏 */}
      <Tooltip title={formatMessage({ id: 'mapEditor.fullScreen' })}>
        <span style={{ cursor: 'pointer' }}>
          {isInnerFullscreen ? (
            <FullscreenExitOutlined
              onClick={() => {
                changeInnerFullScreen(false);
              }}
            />
          ) : (
            <FullscreenOutlined
              onClick={() => {
                changeInnerFullScreen(true);
              }}
            />
          )}
        </span>
      </Tooltip>
      <Divider type="vertical" />

      {/* 查询点位 */}
      <Tooltip title={formatMessage({ id: 'mapEditor.locate' })}>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setPositionVisible(true);
          }}
        >
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
            <span onClick={activeMap}>
              <IconFont type={'icon-active'} />
            </span>
          </Tooltip>
        )}
      </span>

      {/* 定位点位 */}
      <Modal
        destroyOnClose
        width={350}
        visible={positionVisible}
        onCancel={() => {
          setPositionVisible(false);
        }}
        title={formatMessage({ id: 'app.leftContent.searchCell' })}
        footer={null}
      >
        <PositionCell
          close={() => {
            setPositionVisible(false);
          }}
        />
      </Modal>
    </>
  );
};
export default connect(({ global, editor }) => ({
  isInnerFullscreen: global.isInnerFullscreen,
  mapId: editor?.currentMap?.id,
  saveMapLoading: editor.saveMapLoading,
  activeMapLoading: editor.activeMapLoading,
  isActive: editor?.currentMap?.activeFlag,
}))(memo(EditorHeaderRightTools));
