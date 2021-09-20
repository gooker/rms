import React, { PureComponent } from 'react';
import { Popconfirm } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import styles from './AgvTag.less';

export default class FreightTag extends PureComponent {
  render() {
    const { code, agvId, deleteLock, permission, title } = this.props;
    return (
      <div className={styles.freightTagStyle}>
        {code && <div className={styles.freightTagCodeStyle}>{code}</div>}
        <div className={styles.freightTagTextStyle}>{agvId}</div>
        {permission && (
          <div className={styles.freightTagBtnStyle}>
            <Popconfirm
              title={title}
              onConfirm={() => {
                deleteLock(agvId);
              }}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <DeleteOutlined />
            </Popconfirm>
          </div>
        )}
      </div>
    );
  }
}
