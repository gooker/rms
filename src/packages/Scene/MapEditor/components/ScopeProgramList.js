import React, { memo } from 'react';
import { Divider, Popconfirm, Row, Col } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { isPlainObject } from 'lodash';
import styles2 from '../popoverPanel.module.less';
import { formatMessage } from '@/utils/util';

const LabelStyle = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const ScopeProgramList = (props) => {
  const { datasource, onEdit, onDelete } = props;

  const children = datasource.map((item, index) => {
    if (isPlainObject(item)) {
      return (
        <Col span={12} key={index}>
          <div className={styles2.functionListItem}>
            <div>
              <div title={item.name} style={LabelStyle}>
                {item.name}
              </div>
              <div>
                <span key="edit" style={{ cursor: 'pointer' }}>
                  <EditOutlined
                    onClick={() => {
                      onEdit(item.code);
                    }}
                  />
                </span>
                <Divider type="vertical" />
                <Popconfirm
                  title={formatMessage({ id: 'app.message.doubleConfirm' })}
                  onConfirm={() => {
                    onDelete(item.code);
                  }}
                >
                  <span key="delete" style={{ cursor: 'pointer' }}>
                    <DeleteOutlined />
                  </span>
                </Popconfirm>
              </div>
            </div>
          </div>
        </Col>
      );
    }
    return (
      <Col span={12} key={index}>
        <div className={styles2.functionListItem}>
          <div>
            <div title={item} style={LabelStyle}>
              {item}
            </div>
            <div>
              <span key="edit" style={{ cursor: 'pointer' }}>
                <EditOutlined
                  onClick={() => {
                    onEdit(item);
                  }}
                />
              </span>
              <Divider type="vertical" />
              <Popconfirm
                title={formatMessage({ id: 'app.message.doubleConfirm' })}
                onConfirm={() => {
                  onDelete(item);
                }}
              >
                <span key="delete" style={{ cursor: 'pointer' }}>
                  <DeleteOutlined />
                </span>
              </Popconfirm>
            </div>
          </div>
        </div>
      </Col>
    );
  });

  return <Row gutter={10}>{children}</Row>;
};
export default memo(ScopeProgramList);
