import React, { memo, useEffect, useState } from 'react';
import { Badge, Popover, Switch } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '@/packages/Portal/components/Header.module.less';
import { IconFont } from '@/components/IconFont';
import { connect } from '@/utils/RmsDva';
import { AppCode } from '@/config/config';

const HeaderAlertCenter = (props) => {
  const { alertCount } = props;

  const history = useHistory();

  const [showErrorNotification, setShowErrorNotification] = useState(false);

  useEffect(() => {
    const sessionValue = window.sessionStorage.getItem('showErrorNotification');
    const _showErrorNotification = sessionValue === null ? true : JSON.parse(sessionValue);
    setShowErrorNotification(_showErrorNotification);
  }, []);

  function goToQuestionCenter() {
    history.push(`/${AppCode.DevOps}/alertCenter`);
  }

  function switchShowErrorNotification(checked) {
    window.sessionStorage.setItem('showErrorNotification', checked);
    setShowErrorNotification(checked);
  }

  return (
    <Popover
      trigger='hover'
      content={
        <Switch
          checkedChildren={<FormattedMessage id='app.common.on' />}
          unCheckedChildren={<FormattedMessage id='app.common.off' />}
          checked={showErrorNotification}
          onChange={switchShowErrorNotification}
        />
      }
    >
      <span className={styles.action} onClick={goToQuestionCenter}>
        <Badge size='small' showZero={false} count={alertCount} overflowCount={99}>
          {showErrorNotification ? <BellOutlined /> : <IconFont type='icon-bellOff' />}
        </Badge>
      </span>
    </Popover>
  );
};
export default connect(({ global }) => ({
  alertCount: global.alertCount,
}))(memo(HeaderAlertCenter));
