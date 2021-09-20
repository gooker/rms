import React, { useCallback, memo } from 'react';
import { connect } from '@/utils/dva';
import { useSize } from '@umijs/hooks';
import AllModal from '../components/AllModal';
import MapFooter from './component/MapFooter';
import MapContext from './component/MapContext';
import MapBridging from './component/MapBridging';
import EditorLeftTool from '../components/LeftContent/Index';
import EditorRightTool from './component/EditorRightTool';
import RightSideMenu from './component/RightSiderMenu';
import { GlobalDrawerWidth } from '@/Const';
import styles from './editor.less';

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
        <AllModal />
      </div>
    </MapContext.Provider>
  );
};
export default connect((state) => {
  const { mapList, drawerVisible } = state.editor;
  return { mapList, drawerVisible };
})(memo(MapEditor));
