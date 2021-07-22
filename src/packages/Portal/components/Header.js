import React from 'react';
import { Radio } from 'antd';
import { connect } from '@/utils/dva';
import { FormattedMessage } from '@/components/Lang';

@connect(({ app }) => ({
  globalLocale: app.globalLocale,
}))
class Header extends React.Component {
  changeLocale = (ev) => {
    const { dispatch } = this.props;
    const currentLocale = ev.target.value;
    dispatch({ type: 'app/updateGlobalLocale', payload: currentLocale });
  };

  render() {
    return (
      <div>
        <span style={{ marginRight: 16 }}>
          <FormattedMessage id="app.portal.switchlang" />
        </span>
        <Radio.Group value={globalLocale} onChange={this.changeLocale}>
          <Radio.Button key="zh-CN" value="zh-CN">
            中文
          </Radio.Button>
          <Radio.Button key="en-US" value="en-US">
            English
          </Radio.Button>
          <Radio.Button key="ko-KR" value="ko-KR">
            한국어
          </Radio.Button>
        </Radio.Group>
      </div>
    );
  }
}
