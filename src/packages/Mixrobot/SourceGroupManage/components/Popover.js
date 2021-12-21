import React, { memo, useState, useEffect } from 'react';
import { Popover, Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import styles from './styles.less';

const CustomPopover = (props) => {
  const {
    content,
    children,
    title,
    status,
    onVisibleChange,
    onClose,
    control,
    overlayClassName,
  } = props;
  const [visible, setVisible] = useState(false);

  // 只负责关闭显示
  useEffect(() => {
    setVisible(status);
  }, [status]);

  return (
    <Popover
      destroyTooltipOnHide
      overlayClassName={overlayClassName || ''}
      trigger="click"
      placement="leftBottom"
      visible={visible}
      onVisibleChange={(visible) => {
        if (control) return false;
        // 只负责打开显示
        if (visible) {
          setVisible(true);
          onVisibleChange && onVisibleChange();
        }
      }}
      content={
        <Row>
          {title && (
            <div style={{ minHeight: 30, display: 'flex', width: '100%' }}>
              <Col span={12}>
                <h4>{title}</h4>
              </Col>
              <Col span={12} style={{ textAlign: 'end' }} className={styles.popoverCloseIcon}>
                <CloseOutlined
                  onClick={() => {
                    setVisible(false);
                    onClose && onClose();
                  }}
                />
              </Col>
            </div>
          )}
          {content}
        </Row>
      }
    >
      {children}
    </Popover>
  );
};
export default memo(CustomPopover);
