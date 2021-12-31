import React, { memo, useEffect } from 'react';
import { connect } from '@/utils/dva';
import PixiBuilder from '@/utils/PixiBuilder';

const EditorMapView = (props) => {
  const { dispatch } = props;

  useEffect(() => {
    const htmlDOM = document.getElementById('editorPixi');
    const { width, height } = htmlDOM.getBoundingClientRect();
    const mapContext = new PixiBuilder(width, height, htmlDOM);
    dispatch({ type: 'editor/saveMapContext', payload: mapContext });
  }, []);

  // FBI WARNING: 这里一定要给canvas父容器一个"font-size:0", 否则会被撑开5px左右
  return <div id="editorPixi" style={{ fontSize: 0, touchAction: 'none' }} />;
};
export default connect()(memo(EditorMapView));
