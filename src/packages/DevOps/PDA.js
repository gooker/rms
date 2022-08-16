import React, { memo, useRef, useState } from 'react';
import { Spin } from 'antd';
import classnames from 'classnames';
import commonStyle from '@/common.module.less';
import pdaStyle from './pda.module.less';

const PDA = () => {
  const origin = window.isProductionEnv ? window.location.origin : window.nameSpacesInfo.platform;
  const url = `${origin}/pda?timestamp=${new Date().getTime()}`;

  const [loaded, setLoaded] = useState(false);
  const iframe = useRef(null);

  function onload() {
    setLoaded(true);
    console.log('onload');
  }

  return (
    <div
      className={classnames(commonStyle.commonPageStyle, commonStyle.flexCenter)}
      style={{ background: '#7f7f7f' }}
    >
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
          {!loaded && (
            <div className={pdaStyle.loading}>
              <Spin size='large' />
            </div>
          )}
          <iframe
            seamless
            ref={iframe}
            title={'pda'}
            src={url}
            width={'100%'}
            height={'100%'}
            frameBorder={0}
            onLoad={onload}
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
