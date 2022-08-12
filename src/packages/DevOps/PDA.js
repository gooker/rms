import React, { memo } from 'react';
import classnames from 'classnames';
import pdaStyle from './pda.module.less';
import commonStyle from '@/common.module.less';

const PDA = (props) => {
  const {} = props;
  return (
    <div className={classnames(commonStyle.commonPageStyle, commonStyle.flexCenter)}>
      <div className={pdaStyle.pda}>
        <div className={pdaStyle.statusBar}>
          <div>
            <div className={pdaStyle.icon1} />
          </div>
          <div>
            <div className={pdaStyle.icon2} />
            <div className={pdaStyle.icon3} />
            <div className={pdaStyle.icon1} />
          </div>
        </div>
        <div className={pdaStyle.pdaBody}>
          <iframe
            seamless
            title={'pda'}
            src={'http://52.83.193.245:10251/pda'}
            width={'100%'}
            height={'100%'}
            frameBorder={0}
          />
        </div>
        <div className={pdaStyle.pdaFooter}>
          <div className={pdaStyle.back} />
          <div className={pdaStyle.home} />
          <div className={pdaStyle.task} />
        </div>
      </div>
    </div>
  );
};
export default memo(PDA);
