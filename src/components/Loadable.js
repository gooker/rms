import React from 'react';
import Loadable from 'react-loadable';

export default (loader) => {
  return Loadable({
    loader,
    loading: () => <div style={{ height: '100%' }} />,
  });
};
