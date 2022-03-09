import React, { memo } from 'react';
import { DeleteFilled } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import styles from '../editorLayout.module.less';

const EditorShortcutTool = (props) => {
  const { dispatch, selections, mapContext } = props;

  function deleteAnyTime() {
    mapContext.deleteAnyTime(selections);
    dispatch({ type: 'editor/advancedDeletion', payload: selections });
  }

  return (
    <div className={styles.editorShortcutTool}>
      <div>
        <DeleteFilled onClick={deleteAnyTime} />
      </div>
      <div>{selections.length}</div>
    </div>
  );
};
export default connect(({ editor }) => ({
  mapContext: editor.mapContext,
  selections: editor.selections,
}))(memo(EditorShortcutTool));
