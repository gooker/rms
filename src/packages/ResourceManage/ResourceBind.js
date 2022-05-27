import React, { memo } from 'react';
import { find, debounce } from 'lodash';
import { Form, Select, Switch, Card, Row, Col, message, Empty, Button, Spin } from 'antd';
import { formatMessage, dealResponse } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './resourceBind.module.less';

const ResourceBind = (props) => {
  const {} = props;
  const [formRef] = Form.useForm();
  return <div>ResourceBind</div>;
};
export default memo(ResourceBind);
