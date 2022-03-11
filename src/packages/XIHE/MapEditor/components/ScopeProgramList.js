import React, { memo } from 'react';
import { Divider, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { isPlainObject } from 'lodash';
import styles2 from '../PopoverPanel/popoverPanel.module.less';
import { formatMessage } from '@/utils/util';

const ScopeProgramList = (props) => {
  const { datasource, onEdit, onDelete } = props;

  return datasource.map((item, index) => {
    if (isPlainObject(item)) {
      return (
        <div key={index} className={styles2.functionListItem}>
          <div>
            <div>{item.name}</div>
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
      );
    }
    return (
      <div key={index} className={styles2.functionListItem}>
        <div>
          <div>{item}</div>
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
    );
  });
};
export default memo(ScopeProgramList);
