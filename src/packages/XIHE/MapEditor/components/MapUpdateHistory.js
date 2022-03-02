import React, { memo, useEffect, useState } from 'react';
import { Card } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { convertToUserTimezone, dealResponse, formatMessage } from '@/utils/util';
import { fetchMapHistory } from '@/services/XIHE';
import TableWidthPages from '@/components/TableWithPages';

const MapUpdateHistory = (props) => {
  const { dispatch, mapId } = props;

  const [fetching, setFetching] = useState(false);
  const [updateHistory, setUpdateHistory] = useState([]);

  useEffect(() => {
    if (mapId) {
      setFetching(true);
      fetchMapHistory(mapId).then((res) => {
        if (!dealResponse(res)) {
          setUpdateHistory(res);
        }
        setFetching(false);
      });
    }
  }, [mapId]);

  function exportMapHistory(historyId) {
    dispatch({ type: 'editor/exportMapHistory', payload: historyId });
  }

  const columns = [
    {
      title: formatMessage({ id: 'app.common.updateTime' }),
      dataIndex: 'editedDate',
      align: 'center',
      render: (text) => convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: formatMessage({ id: 'app.common.updater' }),
      dataIndex: 'editor',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'editor.editorVersion' }),
      dataIndex: 'ever',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'editor.mapVersion' }),
      dataIndex: 'mver',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.operation' }),
      align: 'center',
      render: (text, record) => {
        return (
          <DownloadOutlined
            onClick={() => {
              exportMapHistory(record.id);
            }}
          />
        );
      },
    },
  ];

  return (
    <Card bordered={false} size="small" style={{ minHeight: 500 }}>
      <TableWidthPages
        bordered
        loading={fetching}
        columns={columns}
        dataSource={updateHistory}
        rowKey={({ id }) => id}
      />
    </Card>
  );
};
export default memo(MapUpdateHistory);
