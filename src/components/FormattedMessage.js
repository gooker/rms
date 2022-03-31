import React from 'react';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';

function FormattedMessage(props) {
  const { id, values = {}, editI18NMode, dispatch } = props;

  function showKey(ev, i18nKey) {
    ev.stopPropagation();
    dispatch({ type: 'global/updateEditI18NKey', payload: i18nKey });
  }

  if (id) {
    const content = formatMessage({ id }, values);
    if (editI18NMode) {
      return (
        <i
          style={{
            background: '#9c27b0',
            cursor: 'context-menu',
          }}
          onClick={(ev) => {
            showKey(ev, id);
          }}
        >
          {content}
        </i>
      );
    }
    return content || id;
  }
  return id;
}
export default connect(({ global }) => ({
  editI18NMode: global.editI18NMode,
}))(FormattedMessage);
