import React, { memo, useEffect, useRef } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { HeaderHeight } from './enums';
import MapEditorHeader from './components/EditorHeader';
import EditorBodyLeft from './components/EditorBodyLeft';
import EditorBodyRight from './components/EditorBodyRight';
import EditorMapContainer from './components/EditorMapContainer';
import commonStyles from '@/common.module.less';

const MapEditor = (props) => {
  const { dispatch, mapList, mapContext } = props;
  const keyDown = useRef(false);

  useEffect(() => {
    document.addEventListener('contextmenu', (ev) => {
      ev.preventDefault();
    });
    dispatch({ type: 'editor/editorInitial' });

    return () => {
      dispatch({ type: 'editor/unmount' });
    };
  }, []);

  useEffect(() => {
    // 按下x键
    function onXKeyDown(event) {
      if (event.keyCode === 88 && !keyDown.current) {
        keyDown.current = true;
        if (mapContext) {
          mapContext.pixiUtils.viewport.drag({
            pressDrag: false,
          });
        }
      }
    }
    // 抬起x键
    function onXKeyUp(event) {
      if (event.keyCode === 88) {
        keyDown.current = false;
        if (props.mapContext) {
          props.mapContext.pixiUtils.viewport.drag({
            pressDrag: true,
          });
        }
      }
    }

    document.addEventListener('contextmenu', (ev) => {
      ev.preventDefault();
    });
    document.addEventListener('keydown', onXKeyDown);
    document.addEventListener('keyup', onXKeyUp);

    return () => {
      document.removeEventListener('keydown', onXKeyDown);
      document.removeEventListener('keyup', onXKeyUp);
    };
  }, [mapContext]);

  return (
    <div id={'mapEditorPage'} className={commonStyles.commonPageStyleNoPadding}>
      <div className={commonStyles.mapLayoutHeader} style={{ flex: `0 0 ${HeaderHeight}px` }}>
        {Array.isArray(mapList) ? (
          <MapEditorHeader />
        ) : (
          <LoadingOutlined style={{ fontSize: 20 }} spin />
        )}
      </div>
      <div className={commonStyles.mapLayoutBody}>
        <EditorBodyLeft />
        <EditorMapContainer />
        <EditorBodyRight />
      </div>
    </div>
  );
};
export default connect(({ editor }) => ({
  mapList: editor.mapList,
  mapContext: editor.mapContext,
}))(memo(MapEditor));
