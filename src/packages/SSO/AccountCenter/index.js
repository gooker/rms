import React, { Component } from 'react';
import { Card, Row, Col, Button, Modal } from 'antd';
import { connect } from '@/utils/dva';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, adjustModalWidth } from '@/utils/utils';
import { updateUserManage } from '@/services/user';
import UpdatePasswordModal from '../UserManager/components/UpdatePassword';
import UpdateZoneModal from './components/UpdateZoneModal';
import commonStyles from '@/common.module.less';
import styles from './accountCenter.module.less';

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class AccountCenter extends Component {
  state = {
    updatePwdVisible: false,
    updateTimeZoneVisible: false,
  };
  submitUpdatedPwd = async (values) => {
    const { currentUser } = this.props;
    // TODO: 更新用户接口 是没有原密码的参数的
    const params = {
      username: currentUser.username,
      password: values.password,
      id: currentUser.id,
    };
    const response = await updateUserManage(params);
    if (!dealResponse(response)) {
      this.setState({ updatePwdVisible: false });
    }
  };

  changeZone = async (value) => {
    const { currentUser, dispatch } = this.props;
    const params = {
      username: currentUser.username,
      userTimeZone: value,
      id: currentUser.id,
    };
    const response = await updateUserManage(params);
    if (!dealResponse(response)) {
      this.setState({ updateTimeZoneVisible: false });
      dispatch({ type: 'user/saveCurrentUser', payload: { ...currentUser, userTimeZone: value } });
    }
  };
  render() {
    const { currentUser } = this.props;
    const { updateTimeZoneVisible } = this.state;

    return (
      <div className={commonStyles.commonPageStyle}>
        <Card title={<FormattedMessage id="accountCenter.userInfo" />} bordered={false}>
          <Row>
            <Col span={12}>
              <FormattedMessage id="sso.user.type.username" /> :
              <span className={styles.font20}>{currentUser.username}</span>
            </Col>
            <Col span={12} className={commonStyles.textRight}>
              <Button
                onClick={() => {
                  this.setState({ updatePwdVisible: true });
                }}
              >
                <FormattedMessage id="accountCenter.modifyPassword" />
              </Button>
            </Col>
          </Row>
          <Row className={commonStyles.mt20}>
            <Col span={12}>
              <FormattedMessage id="sso.user.account.userTimeZone" /> :
              <span className={styles.font20}>{currentUser.userTimeZone}</span>
            </Col>
            <Col span={12} className={commonStyles.textRight}>
              <Button
                onClick={() => {
                  this.setState({ updateTimeZoneVisible: true });
                }}
              >
                <FormattedMessage id="accountCenter.modifyTimezone" />
              </Button>
            </Col>
          </Row>
        </Card>

        {/**修改密码***/}
        <Modal
          width={400}
          footer={null}
          title={formatMessage({ id: 'accountCenter.modifyPassword', format: false })}
          destroyOnClose
          visible={this.state.updatePwdVisible}
          onCancel={() => {
            this.setState({ updatePwdVisible: false });
          }}
        >
          <UpdatePasswordModal onSubmit={this.submitUpdatedPwd} needOriginal={true} />
        </Modal>

        {/**修改时区*/}
        <Modal
          visible={updateTimeZoneVisible}
          onCancel={() => {
            this.setState({ updateTimeZoneVisible: false });
          }}
          width={adjustModalWidth() * 0.7}
          destroyOnClose
          footer={null}
          closable={false}
        >
          <UpdateZoneModal zoneValue={currentUser.userTimeZone} onSubmit={this.changeZone} />
        </Modal>
      </div>
    );
  }
}
export default AccountCenter;
