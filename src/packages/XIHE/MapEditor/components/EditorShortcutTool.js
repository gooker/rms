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

  if (selections.length > 0) {
    return (
      <div className={styles.editorShortcutTool}>
        <DeleteFilled onClick={deleteAnyTime} />
      </div>
    );
  }
  return null;
};
export default connect(({ editor }) => ({
  mapContext: editor.mapContext,
  selections: editor.selections,
}))(memo(EditorShortcutTool));
