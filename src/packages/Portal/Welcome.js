import React from 'react';
import { connect } from '@/utils/dva';
import { CopyrightOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import WelcomeImage from './images/welcome.png';
import styles from './Welcome.module.less';

/**
 * 庞门正道标题体2
 * https://www.iconfont.cn/webfont?spm=a313x.7781069.1998910419.23&puhui=1#!/webfont/index
 * 目前字体文件(/public/fonts/webfont.ttf)只支持如下几个中文字, 如果需要别的中文字字体则要重新生成字体文件
 */
const zhStyle = { fontSize: '9vh', letterSpacing: '20px' };
const enStyle = { fontSize: '7vh' };

const Welcome = (props) => {
  const { isFullscreen, copyRight } = props;
  const locale = window.localStorage.getItem('currentLocale') || 'zh-CN';
  return (
    <div className={styles.welcome} style={{ backgroundImage: `url(${WelcomeImage})` }}>
      <div className={styles.welcomeText}>
        <div className={styles.mushiny} style={locale === 'zh-CN' ? zhStyle : enStyle}>
          <FormattedMessage id="app.mushiny.title" />
        </div>
        <div className={styles.features}>
          <span className={styles.feature}>
            <FormattedMessage id="app.mushiny.purpose.smart" />
          </span>
          <span className={styles.feature}>
            <FormattedMessage id="app.mushiny.purpose.safe" />
          </span>
          <span className={styles.feature}>
            <FormattedMessage id="app.mushiny.purpose.stable" />
          </span>
          <span className={styles.feature}>
            <FormattedMessage id="app.mushiny.purpose.efficient" />
          </span>
          <span className={styles.feature}>
            <FormattedMessage id="app.mushiny.purpose.power" />
          </span>
        </div>
      </div>
      <div className={styles.copyRight} style={{ fontSize: '2.2vh' }}>
        {copyRight || (
          <span>
            Copyright
            <CopyrightOutlined style={{ margin: '0 5px', paddingTop: '2px' }} />
            2018 - {new Date().getFullYear()}
            {` `} Produced by Intelligence Software R&D Department of Mushiny
          </span>
        )}
      </div>
    </div>
  );
};
export default connect(({ global }) => ({
  copyRight: global?.copyRight,
  isFullscreen: global?.isFullscreen,
}))(Welcome);
