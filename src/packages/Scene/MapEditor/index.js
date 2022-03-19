import React, { memo, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { HeaderHeight, LeftCategory } from './enums';
import MapEditorHeader from './components/EditorHeader';
import EditorBodyLeft from './components/EditorBodyLeft';
import EditorBodyRight from './components/EditorBodyRight';
import EditorMapContainer from './components/EditorMapContainer';
import style from './components/component.module.less';
import commonStyles from '@/common.module.less';

const MapEditor = (props) => {
  const { dispatch, mapList, mapContext } = props;
  const keyDown = useRef(false);

  useEffect(() => {
    document.addEventListener('contextmenu', (ev) => {
      ev.preventDefault();
    });
    dispatch({ type: 'editor/editorInitial' });

    function listenKeyDown(ev) {
      if ((ev.ctrlKey || ev.metaKey) && ev.code === 'KeyF') {
        ev.preventDefault();
        dispatch({ type: 'editorView/savePositionVisible', payload: true });
      }
    }
    document.addEventListener('keydown', listenKeyDown);

    return () => {
      document.removeEventListener('keydown', listenKeyDown);
      dispatch({ type: 'editor/unmount' });
    };
  }, []);

  useEffect(() => {
    // 按下S键
    function onXKeyDown(event) {
      // 不能干扰输入框
      if (event.target instanceof HTMLInputElement) return;
      if (event.keyCode === 83 && !keyDown.current) {
        keyDown.current = true;
        if (mapContext) {
          mapContext.pixiUtils.viewport.drag({ pressDrag: false });
          dispatch({ type: 'editor/updateLeftActiveCategory', payload: LeftCategory.Choose });
        }
      }
    }
    // 抬起S键
    function onXKeyUp(event) {
      if (event.target instanceof HTMLInputElement) return;
      if (event.keyCode === 83) {
        keyDown.current = false;
        if (props.mapContext) {
          props.mapContext.pixiUtils.viewport.drag({ pressDrag: true });
          dispatch({ type: 'editor/updateLeftActiveCategory', payload: LeftCategory.Drag });
        }
      }
    }

    document.addEventListener('contextmenu', (ev) => {
      ev.preventDefault();
    });

    if (window.currentPlatForm.isPc) {
      document.addEventListener('keydown', onXKeyDown);
      document.addEventListener('keyup', onXKeyUp);
    }

    return () => {
      if (window.currentPlatForm.isPc) {
        document.removeEventListener('keydown', onXKeyDown);
        document.removeEventListener('keyup', onXKeyUp);
      }
    };
  }, [mapContext]);

  return (
    <div id={'mapEditorPage'} className={commonStyles.commonPageStyleNoPadding}>
      <div
        style={{ flex: `0 0 ${HeaderHeight}px` }}
        className={classnames(commonStyles.mapLayoutHeader, style.editorHeader)}
      >
        {Array.isArray(mapList) ? (
          <MapEditorHeader />
        ) : (
          <LoadingOutlined spin style={{ fontSize: 20 }} />
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
