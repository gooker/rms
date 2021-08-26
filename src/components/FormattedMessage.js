import React from 'react';
import { connect } from '@/utils/dva';
import { formatMessage } from '@/utils/utils';

function FormattedMessage(props) {
  const { id, values = {}, editKey } = props;

  function showKey(ev) {
    ev.stopPropagation();
  }

  if (id) {
    const content = formatMessage({ id }, values);
    if (editKey) {
      return <div onClick={showKey}>{content}</div>;
    }
    return content || id;
  }
  return '###';
}
export default connect(({ app }) => ({
  editKey: app.editKey,
}))(FormattedMessage);
