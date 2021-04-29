import React from 'react';
import { getContentHeight } from '@/utils/utils';
import { debounce } from 'lodash';

export default function TablePageHOC(WrappedComponent) {
  return class extends React.Component {
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
      return <WrappedComponent pageHeight={pageHeight} {...this.props} />;
    }
  };
}
