import React, { memo, useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from '@/utils/dva';
import MapEditorHeader from './components/EditorHeader';
import EditorBodyLeft from './components/EditorBodyLeft';
import EditorBodyRight from './components/EditorBodyRight';
import commonStyles from '@/common.module.less';

const MapEditor = (props) => {
  const { dispatch, mapList } = props;

  useEffect(() => {
    dispatch({ type: 'editor/editorInitial' });
  }, []);

  return (
    <div className={commonStyles.commonPageStyleNoPadding}>
      <div className={commonStyles.mapLayoutHeader}>
        {Array.isArray(mapList) ? (
          <MapEditorHeader />
        ) : (
          <LoadingOutlined style={{ fontSize: 20 }} spin />
        )}
      </div>
      <div className={commonStyles.mapLayoutBody}>
        <div className={commonStyles.mapBodyLeft}>
          <EditorBodyLeft />
        </div>
        <div className={commonStyles.mapBodyMiddle}>3</div>
        <div className={commonStyles.mapBodyRight}>
          <EditorBodyRight />
        </div>
      </div>
    </div>
  );
};
export default connect(({ editor }) => ({
  mapList: editor.mapList,
}))(memo(MapEditor));
