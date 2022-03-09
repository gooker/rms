import React, { memo } from 'react';
import FormattedMessage from '@/components/FormattedMessage';
import editorStyles from '../editorLayout.module.less';

const LayerPanel = (props) => {
  const { height } = props;

  return (
    <div style={{ height }} className={editorStyles.categoryPanel}>
      <div>
        <FormattedMessage id={'editor.tools.layer'} />
      </div>
      <div>2222</div>
    </div>
  );
};
export default memo(LayerPanel);
