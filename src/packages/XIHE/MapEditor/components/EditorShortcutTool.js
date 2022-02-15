import React, { memo, useEffect, useState } from 'react';
import { DeleteFilled, DownOutlined, UpOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import styles from '../editorLayout.module.less';

const EditorShortcutTool = (props) => {
  const { dispatch, selections, mapContext } = props;

  const [optionVisible, setOptionVisible] = useState(false);

  useEffect(() => {
    if (selections.length === 0) {
      setOptionVisible(false);
    }
  }, [selections.length]);

  function deleteAnyTime() {
    mapContext.deleteAnyTime(selections);
    dispatch({ type: 'editor/advancedDeletion', payload: selections });
  }

  if (selections.length > 0) {
    return (
      <div className={styles.editorShortcutTool}>
        <div>
          <DeleteFilled onClick={deleteAnyTime} />
        </div>
        <div
          onClick={() => {
            setOptionVisible(!optionVisible);
          }}
        >
          {selections.length} {optionVisible ? <UpOutlined /> : <DownOutlined />}
        </div>
        {optionVisible && <div className={styles.editorShortcutToolOptions}>1111</div>}
      </div>
    );
  }
  return null;
};
export default connect(({ editor }) => ({
  mapContext: editor.mapContext,
  selections: editor.selections,
}))(memo(EditorShortcutTool));
