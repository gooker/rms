import React, { memo } from 'react';
import { Divider, Popconfirm, Row, Col } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { sortBy } from 'lodash';
import { formatMessage } from '@/utils/util';
import styles2 from '../../popoverPanel.module.less';

const LabelStyle = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const ScopeProgramList = (props) => {
  const { datasource, onEdit, onDelete } = props;
  const sortedDS = sortBy(datasource, 'key');

  const children = sortedDS.map((item, index) => {
    return (
      <Col span={12} key={index}>
        <div className={styles2.functionListItem}>
          <div>
            <div title={item.key} style={LabelStyle}>
              #{item.key}
            </div>
            <div>
              <EditOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  onEdit(item);
                }}
              />
              <Divider type="vertical" />
              <Popconfirm
                title={formatMessage({ id: 'app.message.doubleConfirm' })}
                onConfirm={() => {
                  onDelete(item);
                }}
              >
                <DeleteOutlined style={{ cursor: 'pointer' }} />
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
