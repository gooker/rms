import React, { memo, useEffect, useState } from 'react';
import { Modal } from 'antd';
import { connect } from '@/utils/RmsDva';
import { extractOpenKeys, formatMessage, isStrictNull } from '@/utils/util';
import HelpDocPortal from './HelpDocPortal';
import style from './Header.module.less';
import styles from '@/layout/homeLayout.module.less';
import HelpDocMenu from '@/packages/Portal/components/HelpDocMenu';

const HelpDocViewerModal = (props) => {
  const { dispatch, visible, onCancel, menuCollapsed, selectedKeys, allMenuData } = props;

  const [currentPage, setCurrentPage] = useState(null);
  const [iframeSrc, setIframeSrc] = useState(null);

  // 弹窗打开时候初始化处理
  useEffect(() => {
    if (visible) {
      const { pathname } = window.location;
      setCurrentPage(pathname);
      if (pathname === '/') {
        dispatch({ type: 'help/saveSelectedKeys', payload: [] });

        const { currentApp } = window.$$state().global;
        dispatch({ type: 'help/updateCurrentApp', payload: currentApp });
      } else {
        openHelpDoc(pathname);
        dispatch({ type: 'help/saveSelectedKeys', payload: [pathname] });

        const currentApp = pathname.split('/')[1];
        dispatch({ type: 'help/updateCurrentApp', payload: currentApp });
        dispatch({
          type: 'help/saveOpenKeys',
          payload: extractOpenKeys(currentApp, allMenuData, pathname),
        });
      }
    }
  }, [visible]);

  useEffect(() => {
    const currentPathName = selectedKeys[0];
    if (currentPathName && currentPathName !== '/') {
      setCurrentPage(currentPathName);
      openHelpDoc(currentPathName);
    } else {
      setCurrentPage('/');
    }
  }, [selectedKeys]);

  function openHelpDoc(path) {
    let currentLang = props.currentLang;
    let fileName = path.split('/').at(-1);
    if (isStrictNull(currentLang)) {
      currentLang = 'en-US';
    }
    const langShortName = currentLang.split('-').at(0);
    if (langShortName !== 'zh') {
      fileName = `${fileName}_${langShortName}`;
    }
    fileName = `${fileName}.html`;
    const origin = window.isProductionEnv ? window.location.origin : window.nameSpacesInfo.platform;
    const url = `${origin}/help_doc/${fileName}?timestamp=${new Date().getTime()}`;
    setIframeSrc(url);
  }

  return (
    <>
      <Modal
        destroyOnClose
        title={formatMessage({ id: 'app.helpDoc' })}
        visible={visible}
        onCancel={onCancel}
        width={'100vw'}
        style={{ top: 30, maxWidth: 1400, padding: 0 }}
        bodyStyle={{ height: '80vh', overflow: 'hidden', padding: 0 }}
        footer={null}
      >
        <div className={style.helpDocContainer}>
          <div className={styles.menu} style={{ paddingTop: 8, height: 'auto' }}>
            <HelpDocPortal />
            <div style={{ width: menuCollapsed ? 50 : 200 }}>
              <HelpDocMenu currentPage={currentPage} />
            </div>
          </div>
          <div className={style.helpViewer}>
            {currentPage === '/' ? (
              '使用文档'
            ) : (
              <iframe
                seamless
                title={'help_doc'}
                src={iframeSrc}
                width={'100%'}
                height={'100%'}
                frameBorder={0}
                style={{ display: 'block' }}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
export default connect(({ menu, global, help }) => ({
  allMenuData: menu.allMenuData,
  currentLang: global.globalLocale,
  menuCollapsed: help.menuCollapsed,
  selectedKeys: help.selectedKeys,
}))(memo(HelpDocViewerModal));
