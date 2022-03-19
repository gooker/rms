import React, { memo } from 'react';
import { Divider, Row, Col, Tag } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styles from '../../../XIHE/popoverPanel.module.less';
import LabelComponent from '@/components/LabelComponent';
import { isNull } from '@/utils/util';

const FunctionListItem = (props) => {
  const {
    onEdit,
    onDelete,
    data: { index, name, rawData, fields },
  } = props;

  function renderFields() {
    return fields.map(({ field, label, value, node, col }) => {
      if (node) {
        return node;
      } else {
        if (Array.isArray(value)) {
          return (
            <Col key={field} span={col || 24}>
              <LabelComponent label={label}>
                {value.map((item) => (
                  <Tag key={item} color="blue">
                    {item}
                  </Tag>
                ))}
              </LabelComponent>
            </Col>
          );
        }
        return (
          <Col key={field} span={col || 12}>
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
          {!isNull(onEdit) && (
            <>
              <span key="edit" style={{ cursor: 'pointer' }}>
                <EditOutlined
                  onClick={() => {
                    onEdit(index + 1, rawData);
                  }}
                />
              </span>
              <Divider type="vertical" />
            </>
          )}
          {!isNull(onDelete) && (
            <span key="delete" style={{ cursor: 'pointer' }}>
              <DeleteOutlined
                onClick={() => {
                  onDelete(index + 1);
                }}
              />
            </span>
          )}
        </div>
      </div>
      <Row gutter={10}>{renderFields()}</Row>
    </div>
  );
};
export default memo(FunctionListItem);
