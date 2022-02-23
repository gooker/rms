import React, { memo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from '@/utils/RmsDva';
import Menu from '@/components/Menu';
import Header from '@/packages/Portal/components/Header';
import Content from '@/packages/Portal/components/Content';
import styles from './homeLayout.module.less';

const HomeLayout = (props) => {
  const { dispatch, isInnerFullscreen } = props;
  const history = useHistory();

  useEffect(() => {
    history.listen(({ pathname }) => {
      dispatch({ type: 'menu/saveTabs', payload: pathname });
    });
  }, []);

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.body}>
        <Menu />
        <Content />
      </div>
    </div>
  );
};
export default connect(({ global }) => ({
  isInnerFullscreen: global.isInnerFullscreen,
}))(memo(HomeLayout));
