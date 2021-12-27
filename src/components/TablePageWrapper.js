import React from 'react';
import { getContentHeight } from '@/utils/utils';
import { debounce } from 'lodash';
import commonStyles from '@/common.module.less';

class TablePageWrapper extends React.Component {
  state = {
    pageHeight: 0,
  };

  componentDidMount() {
    this.observeContentsSizeChange();
    this.setState({ pageHeight: getContentHeight() });
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  observeContentsSizeChange = () => {
    const _this = this;
    this.resizeObserver = new ResizeObserver(
      debounce((entries) => {
        const { contentRect } = entries[0];
        const height = contentRect?.height ?? getContentHeight();
        _this.setState({ pageHeight: height });
      }, 200),
    );
    this.resizeObserver.observe(document.getElementById('layoutContent'));
  };

  render() {
    const { pageHeight } = this.state;
    const [tool, table, ...restChildren] = this.props.children;
    return (
      <div className={commonStyles.commonPageStyle} style={{ height: pageHeight }}>
        <div style={{ marginBottom: 10 }}>{tool}</div>
        <div className={commonStyles.tableWrapper}>{table}</div>
        <div>{restChildren}</div>
      </div>
    );
  }
}
export default TablePageWrapper;
