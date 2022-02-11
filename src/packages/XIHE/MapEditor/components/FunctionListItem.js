import React, { memo } from 'react';
import { Divider, Row, Col } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styles from '../PopoverPanel/popoverPanel.module.less';
import LabelComponent from '@/components/LabelComponent';

const FunctionListItem = (props) => {
  const {
    onEdit,
    onDelete,
    data: { index, name, rawData, fields },
  } = props;

  function renderFields() {
    return fields.map(({ field, label, value, node }) => {
      if (node) {
        return node;
      } else {
        return (
          <Col key={field} span={12}>
            <LabelComponent label={label}>{value}</LabelComponent>
          </Col>
        );
      }
    });
  }

  return (
    <div className={styles.functionListItem}>
      <div>
        <div>{name}</div>
        <div>
          <span key="edit" style={{ cursor: 'pointer' }}>
            <EditOutlined
              onClick={() => {
                onEdit(index + 1, rawData);
              }}
            />
          </span>
          <Divider type="vertical" />
          <span key="delete" style={{ cursor: 'pointer' }}>
            <DeleteOutlined
              onClick={() => {
                onDelete(index + 1);
              }}
            />
          </span>
        </div>
      </div>
      <Row gutter={10}>{renderFields()}</Row>
    </div>
  );
};
export default memo(FunctionListItem);
