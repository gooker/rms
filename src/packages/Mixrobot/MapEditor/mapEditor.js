import React, { useCallback, memo } from 'react';
import { connect } from '@/utils/dva';
import { useSize } from '@umijs/hooks';
import MapFooter from './components/MapFooter';
import MapBridging from './components/EditorMapBridging';
import RightSideMenu from './components/RightSideMenu';
import EditorRightTool from './components/EditorRightTool';
import MapContext from '@/packages/Mixrobot/MapEditor/MapEditContext';
import EditorLeftTool from './components/EditorLeftTool/EditorLeftTool';
import { GlobalDrawerWidth } from '@/config/consts';
// import AllModal from '../components/AllModal';
import styles from './editor.module.less';

let mapRef = null;
const ToolBarHeight = 35;
const FooterBarHeight = 20;

const MapEditor = (props) => {
  const { dispatch, drawerVisible } = props;

  const [bodySize] = useSize(document.body);

  const finishNotice = useCallback(async () => {
    await dispatch({ type: 'editor/editorInitial' });
  }, []);

  const getMapRef = useCallback((reference) => {
    mapRef = reference;
  }, []);

  return (
    <MapContext.Provider value={mapRef}>
      <div className={styles.editorContainer}>
        {/* 工具栏 */}
        <div
          className={styles.toolContainer}
          style={{
            height: ToolBarHeight,
            width: drawerVisible ? `calc(100% - ${GlobalDrawerWidth}px)` : '100%',
          }}
        >
          <EditorLeftTool />
          <EditorRightTool />
        </div>

        {/* 地图展示区 */}
        <div className={styles.mapContainer}>
          <MapBridging
            getMapRef={getMapRef}
            width={bodySize.width}
            height={bodySize.height - ToolBarHeight - FooterBarHeight}
            finishNotice={finishNotice}
          />
        </div>

        {/* 抽屉 */}
        <RightSideMenu visible={drawerVisible} width={GlobalDrawerWidth} />

        {/* 页脚 */}
        <MapFooter height={FooterBarHeight} />

        {/* 所有弹窗 */}
        {/* <AllModal /> */}
      </div>
    </MapContext.Provider>
  );
};
export default connect((state) => {
  const { mapList, drawerVisible } = state.editor;
  return { mapList, drawerVisible };
})(memo(MapEditor));
