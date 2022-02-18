import React, { memo, useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { DeleteFilled, DownOutlined, UpOutlined } from '@ant-design/icons';
import { groupBy } from 'lodash';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../editorLayout.module.less';

const EditorShortcutTool = (props) => {
  const { dispatch, selections, mapContext } = props;

  const [optionVisible, setOptionVisible] = useState(false);
  const [groupSections, setGroupSections] = useState({});
  const [selected, setSelected] = useState({});

  useEffect(() => {
    const _groupSections = groupBy(selections, 'type');
    setGroupSections(_groupSections);
    setSelected(Object.keys(_groupSections));
  }, []);

  function deleteAnyTime() {
    mapContext.deleteAnyTime(selections);
    dispatch({ type: 'editor/advancedDeletion', payload: selections });
  }

  function filterSelections(visible, type, data) {
    let _selected;
    if (visible) {
      _selected = [...selected, type];
    } else {
      _selected = selected.filter((item) => item !== type);
    }
    setSelected(_selected);

    const newSelections = [];
    _selected.forEach((item) => {
      newSelections.push(...groupSections[item]);
    });
    // 不使用updateSelections来更新sections，不然会导致ShortcutTool不按预期显示
    dispatch({ type: 'editor/saveState', payload: { selections: newSelections } });
    mapContext.switchSpriteSelected(visible, type, data);
    mapContext.refresh();
  }

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
      {optionVisible && (
        <div className={styles.editorShortcutToolOptions}>
          {Object.entries(groupSections).map(([type, data]) => (
            <div key={type}>
              <Checkbox
                checked={selected.includes(type)}
                onChange={(ev) => {
                  filterSelections(ev.target.checked, type, data);
                }}
              >
                <FormattedMessage id={`app.map.${type}`} /> ({data.length})
              </Checkbox>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default connect(({ editor }) => ({
  mapContext: editor.mapContext,
  selections: editor.selections,
}))(memo(EditorShortcutTool));
