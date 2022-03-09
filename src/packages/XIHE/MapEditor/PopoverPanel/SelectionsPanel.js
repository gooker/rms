import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import editorStyles from '../editorLayout.module.less';

const SelectionsPanel = (props) => {
  const { height, selections } = props;

  return (
    <div style={{ height }} className={editorStyles.categoryPanel}>
      <div>
        <FormattedMessage id={'editor.tools.selections'} />
      </div>
      <div>2222</div>
    </div>
  );
};
export default connect(({ editor }) => ({
  selections: editor.selections,
}))(memo(SelectionsPanel));
