import React, { memo, useState } from 'react';
import { connect } from '@/utils/dva';
import { Divider, message, Tooltip } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, LoadingOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/utils';
import { convertCadToMap } from '@/utils/mapUtils';
import UploadUtils from '@/components/UploadUtil';
import IconDir from '@/components/AntdIcon/IconDir';
import styles from '../editor.module.less';

const EditorRightTool = (props) => {
  const { dispatch, mapId, isActived, drawerVisible, saveMapLoading, activeMapLoading } = props;

  const [isCad, setIsCad] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);

  function activeMap() {
    if (mapId) {
      dispatch({ type: 'editor/activeMap', payload: mapId });
    } else {
      message.warn(formatMessage({ id: 'app.mapTool.saveMap' }));
    }
  }

  function exportMap() {
    if (mapId) {
      dispatch({ type: 'editor/exportMap' });
    } else {
      message.error(formatMessage({ id: 'app.mapTool.selectMap' }));
      return false;
    }
  }

  async function importMap(value) {
    let mapData = value;
    if (isCad) {
      try {
        mapData = await convertCadToMap(mapData);
      } catch (error) {
        message.error(error);
        return;
      }
    }
    if (mapData.logicAreaList == null || mapData.cellMap == null) {
      message.error(formatMessage({ id: 'app.mapTool.mapIncomplete' }));
      setUploadVisible(false);
      return false;
    }
    dispatch({ type: 'editor/saveMap', payload: { ...mapData } });
    setUploadVisible(false);
  }

  return (
    <>
      <div className={styles.editorRightTool}>
        {/* 地图导出 */}
        <span style={{ cursor: mapId ? 'pointer' : 'not-allowed' }} onClick={exportMap}>
          <Tooltip title={formatMessage({ id: 'app.mapTool.export' })}>
            {IconDir('icondaochu')}
          </Tooltip>
        </span>
        <Divider type="vertical" />

        {/* 导入地图 */}
        <span
          className={styles.operation}
          onClick={() => {
            setIsCad(false);
            setUploadVisible(true);
          }}
        >
          <Tooltip title={formatMessage({ id: 'app.mapTool.import' })}>
            {IconDir('icondaoru')}
          </Tooltip>
        </span>
        <Divider type="vertical" />

        {/* 导入CAD点位 */}
        <span
          className={styles.operation}
          onClick={() => {
            setIsCad(true);
            setUploadVisible(true);
          }}
        >
          <Tooltip title={formatMessage({ id: 'app.mapTool.import' })}>
            {IconDir('iconCADshangchuan')}
          </Tooltip>
        </span>
        <Divider type="vertical" />

        {/* 保存地图 */}
        <span
          style={{ cursor: mapId ? 'pointer' : 'not-allowed' }}
          onClick={() => {
            dispatch({ type: 'editor/saveMap' });
          }}
        >
          <Tooltip title={formatMessage({ id: 'app.mapTool.preserve' })}>
            {saveMapLoading ? <LoadingOutlined /> : IconDir('iconbaocun')}
          </Tooltip>
        </span>
        <Divider type="vertical" />

        {/* 地图激活 */}
        <span
          style={{
            cursor: !isActived && mapId ? 'pointer' : 'not-allowed',
          }}
        >
          {activeMapLoading ? (
            <LoadingOutlined />
          ) : isActived ? (
            // 不支持取消激活
            IconDir('iconsuo')
          ) : (
            <Tooltip title={formatMessage({ id: 'app.mapTool.activation' })}>
              <span onClick={activeMap}>{IconDir('iconjihuo')}</span>
            </Tooltip>
          )}
        </span>
        <Divider type="vertical" />

        {/* 抽屉调取器 */}
        <span
          className={styles.operation}
          onClick={() => {
            dispatch({
              type: 'editor/saveState',
              payload: { drawerVisible: !drawerVisible },
            });
          }}
        >
          {drawerVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
      </div>

      {/* 上传地图 */}
      <UploadUtils
        onCancel={() => {
          setUploadVisible(false);
        }}
        fileType={isCad}
        visible={uploadVisible}
        analyzeFunction={importMap}
      />
    </>
  );
};

export default connect((state) => {
  const { currentMap, drawerVisible, saveMapLoading, activeMapLoading } = state.editor;
  return {
    drawerVisible,
    saveMapLoading,
    activeMapLoading,
    mapId: currentMap?.id,
    isActived: currentMap?.activeFlag,
  };
})(memo(EditorRightTool));
