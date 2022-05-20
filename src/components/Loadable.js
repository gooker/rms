import React from 'react';
import Loadable from 'react-loadable';

export default (loader, item) => {
  let newloadable = loader;
  if (item?.customNode) {
    newloadable = () => import(`@/components/LoadIframeComponent`);
  }

  return Loadable({
    loader: newloadable,
    loading: () => <div style={{ height: '100%' }} />,
  });
};
