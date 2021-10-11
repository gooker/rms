import React from 'react';
import { Col } from 'antd';
import styles from './index.module.less';
import responsive from './responsive';

const Description = ({ term = '', column, children, ...restProps }) => (
  <Col {...responsive[column]} {...restProps}>
    {term && <div className={styles.term}>{term}</div>}
    {children !== null && children !== undefined && <div className={styles.detail}>{children}</div>}
  </Col>
);
export default Description;
