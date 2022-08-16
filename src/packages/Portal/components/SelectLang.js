import React, { memo } from 'react';
import { Dropdown, Menu, message } from 'antd';
import { connect } from '@/utils/RmsDva';
import I18NIcon from '@/components/I18NIcon';
import styles from './Header.module.less';

const EditModeMessageKey = 'Edit_Mode_Tip';
const SelectLang = (props) => {
  const { dispatch, editI18NMode, systemLanguage } = props;

  const selectedLang = window.localStorage.getItem('currentLocale');
  const langMenu = (
    <Menu selectedKeys={[selectedLang]} onClick={onLangChange}>
      {systemLanguage.map((record) => (
        <Menu.Item key={record.code}>{record.name}</Menu.Item>
      ))}
      {/*<Menu.Divider />*/}
      {/*<Menu.Item key={'editMode'}>{formatMessage({ id: 'app.selectLang.editMode' })}</Menu.Item>*/}
    </Menu>
  );

  function onLangChange({ key }) {
    if (key === 'editMode') {
      if (!editI18NMode) {
        message.warning({
          key: EditModeMessageKey,
          duration: 0,
          content: '国际化编辑模式 (点击关闭)',
          onClick: () => {
            message.destroy(EditModeMessageKey);
            dispatch({ type: 'global/updateEditI18NMode', payload: false });
          },
        });
      } else {
        message.destroy(EditModeMessageKey);
      }
      dispatch({ type: 'global/updateEditI18NMode', payload: !editI18NMode });
    } else {
      dispatch({ type: 'global/updateGlobalLocale', payload: key });
    }
  }

  return (
    <Dropdown overlay={langMenu} placement="bottomRight">
      <span className={styles.action}>
        <I18NIcon />
      </span>
    </Dropdown>
  );
};
export default connect(({ global }) => ({
  editI18NMode: global.editI18NMode,
  systemLanguage: global.systemLanguage,
}))(memo(SelectLang));
