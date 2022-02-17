import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';

const MapProperty = (props) => {
  const {} = props;

  return (
    <>
      <div>地图属性</div>
      <div>展示地图部分信息</div>
    </>
  );
};
export default connect(({ editor }) => ({
  currentMap: editor.currentMap,
}))(memo(MapProperty));
