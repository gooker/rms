import React, { memo, useState } from 'react';
import { Divider, message, Modal, Tooltip } from 'antd';
import {
  AimOutlined,
  SaveOutlined,
  LockOutlined,
  ReloadOutlined,
  LoadingOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, isNull,adjustModalWidth } from '@/utils/util';
import { IconFont } from '@/components/IconFont';
import PositionCell from '../components/PositionCell';
import UploadPanel from '@/components/UploadPanel';
import ConstructionInfoModal from '../components/ConstructionDraw/ConstructionInfoModal';
import ConstructionDrawing from '../components/ConstructionDraw/ConstructionDrawing';

const EditorHeaderRightTools = (props) => {
  const {
    mapId,
    dispatch,
    isActive,
    saveMapLoading,
    positionVisible,
    activeMapLoading,
    isInnerFullscreen,
  } = props;

  const [isCad, setIsCad] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [exportConstruction, setExportConstruction] = useState(false);
  const [constructionInfo, setConstructionInfo] = useState(null);
  const [constructionDrawVisible, setConstructionDrawVisible] = useState(false);

  function switchPositionModal(visible) {
    dispatch({ type: 'editor/savePositionVisible', payload: visible });
  }

  function switchExportConstruction(visible) {
    setExportConstruction(visible);
  }
  function switchConstructionDraw(visible) {
    setConstructionDrawVisible(visible);
  }

  function saveMap() {
    dispatch({ type: 'editor/saveMap' });
  }

  function activeMap() {
    if (mapId) {
      dispatch({ type: 'editor/activeMap', payload: mapId });
    } else {
      message.warn(formatMessage({ id: 'app.mapTool.saveMap' }));
    }
  }

  async function importMap(evt) {
    let mapData = JSON.parse(evt.target.result);
    // if (isCad) {
    //   try {
    //     mapData = await convertCadToMap(mapData);
    //   } catch (error) {
    //     message.error(error);
    //     return;
    //   }
    // }
    if (isNull(mapData.logicAreaList) || isNull(mapData.cellMap)) {
      message.error(formatMessage({ id: 'editor.map.upload.mapIncomplete' }));
      setUploadVisible(false);
      return false;
    }
    dispatch({ type: 'editor/saveMap', payload: { ...mapData } });
    setUploadVisible(false);
  }

  function exportMap() {
    dispatch({ type: 'editor/exportMap' });
  }

  function changeInnerFullScreen(payload) {
    dispatch({ type: 'global/changeInnerFullScreen', payload });
  }

  function reloadMap() {
    dispatch({ type: 'editor/reloadMap' });
  }

  return (
    <>
      {/* 重载地图 */}
      <Tooltip title={formatMessage({ id: 'monitor.reload' })}>
        <span style={{ cursor: 'pointer' }}>
          <ReloadOutlined onClick={reloadMap} />
        </span>
      </Tooltip>
      <Divider type="vertical" />

      {/* 地图全屏 */}
      <Tooltip title={formatMessage({ id: 'app.common.fullScreen' })}>
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
      <Tooltip title={formatMessage({ id: 'editor.locate' })}>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            switchPositionModal(true);
          }}
        >
          <AimOutlined />
        </span>
      </Tooltip>
      <Divider type="vertical" />

      {/* 导出施工图 */}
      <Tooltip title={formatMessage({ id: 'editor.constructionDrawing.export' })}>
        <span
          style={{ cursor: mapId ? 'pointer' : 'not-allowed' }}
          onClick={() => {
            switchExportConstruction(true);
          }}
        >
          <IconFont type={'icon-constructionDrawing'} />
        </span>
      </Tooltip>
      <Divider type="vertical" />

      {/* 导出地图 */}
      <Tooltip title={formatMessage({ id: 'app.button.export' })}>
        <span
          style={{ cursor: mapId ? 'pointer' : 'not-allowed' }}
          onClick={() => {
            mapId && exportMap();
          }}
        >
          <IconFont type={'icon-download'} />
        </span>
      </Tooltip>
      <Divider type="vertical" />

      {/* 导入地图 */}
      <Tooltip title={formatMessage({ id: 'app.button.import' })}>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setUploadVisible(true);
          }}
        >
          <IconFont type={'icon-upload'} />
        </span>
      </Tooltip>
      <Divider type="vertical" />

      {/* 保存地图 */}
      <span style={{ cursor: mapId ? 'pointer' : 'not-allowed' }}>
        <Tooltip title={formatMessage({ id: 'app.button.save' })}>
          {saveMapLoading ? <LoadingOutlined /> : <SaveOutlined onClick={saveMap} />}
        </Tooltip>
      </span>
      <Divider type="vertical" />

      {/* 地图激活 */}
      <span style={{ cursor: !isActive && mapId ? 'pointer' : 'not-allowed' }}>
        {activeMapLoading ? (
          <LoadingOutlined />
        ) : isActive ? (
          <Tooltip title={formatMessage({ id: 'editor.map.active.warn' })}>
            <LockOutlined />
          </Tooltip>
        ) : (
          <Tooltip title={formatMessage({ id: 'editor.map.active' })}>
            <span onClick={activeMap}>
              <IconFont type={'icon-active'} />
            </span>
          </Tooltip>
        )}
      </span>

      {/* 上传地图 */}
      <Modal
        destroyOnClose
        width={500}
        visible={uploadVisible}
        onCancel={() => {
          setUploadVisible(false);
        }}
        title={formatMessage({ id: 'editor.map.upload' })}
        footer={null}
      >
        <UploadPanel
          onCancel={() => {
            setUploadVisible(false);
          }}
          fileType={isCad}
          analyzeFunction={importMap}
        />
      </Modal>

      {/* 定位点位 */}
      <Modal
        destroyOnClose
        width={300}
        visible={positionVisible}
        onCancel={() => {
          switchPositionModal(false);
        }}
        title={formatMessage({ id: 'editor.locate' })}
        footer={null}
      >
        <PositionCell
          close={() => {
            switchPositionModal(false);
          }}
        />
      </Modal>

      {/* 配置导出施工图 */}
      <Modal
        width={450}
        destroyOnClose
        visible={exportConstruction}
        onCancel={() => {
          switchExportConstruction(false);
        }}
        title={formatMessage({ id: 'editor.constructionDrawing.export' })}
        footer={null}
      >
        <ConstructionInfoModal
          configureSubmit={(values) => {
            switchConstructionDraw(true)
            setConstructionInfo(values);
          }}
        />
      </Modal>

      <Modal
        width={adjustModalWidth()}
        destroyOnClose
        visible={constructionDrawVisible}
        onCancel={() => {
          switchConstructionDraw(false)
          setConstructionInfo(null);
        }}
        bodyStyle={{
          height: 600,
          overflow: 'auto',
        }}
        footer={null}
      >
        {/* <ConstructionDraw Info={constructionInfo} /> */}
        <ConstructionDrawing Info={constructionInfo} />
      </Modal>

    </>
  );
};
export default connect(({ global, editor }) => ({
  isInnerFullscreen: global.isInnerFullscreen,
  mapId: editor?.currentMap?.id,
  saveMapLoading: editor.saveMapLoading,
  positionVisible: editor.positionVisible,
  isActive: editor?.currentMap?.activeFlag,
  activeMapLoading: editor.activeMapLoading,
}))(memo(EditorHeaderRightTools));
