import React, { useEffect, useState } from 'react';
import { Button, Table, Card, Modal } from 'antd';
import { connect } from '@/utils/dva';
import { fetchMapHistory } from '@/services/mixrobot';
import { dealResponse, isNull } from '@/utils/utils';

const MapUpdateHistory = function MapUpdateHistory(props) {
  const { dispatch, mapId, mapHistoryVisible } = props;

  const [updateHistory, setUpdateHistory] = useState([]);

  useEffect(() => {
    if (mapHistoryVisible && !isNull(mapId)) {
      fetchMapHistory(mapId).then((res) => {
        if (!dealResponse(res)) {
          setUpdateHistory(res);
        }
      });
    }
  }, [mapHistoryVisible]);

  function onCancel() {
    dispatch({
      type: 'editor/saveMapHistoryVisible',
      payload: false,
    });
  }

  function exportMapHistory(historyId) {
    dispatch({ type: 'editor/exportMapHistory', payload: historyId });
  }

  return (
    <Modal
      title="保存记录"
      style={{ top: 50 }}
      visible={mapHistoryVisible}
      onCancel={onCancel}
      width={950}
    >
      <Card bordered={false} size="small" style={{ minHeight: 500 }}>
        <Table
          size="small"
          dataSource={updateHistory}
          columns={[
            {
              title: '序号',
              dataIndex: 'name',
              align: 'center',
              render: (text, record, index) => {
                return <span>{index + 1}</span>;
              },
            },
            {
              title: '修改时间',
              dataIndex: 'editedDate',
              align: 'center',
            },
            { title: '修改人', dataIndex: 'editor', align: 'center' },
            {
              title: '修改次数',
              dataIndex: 'historyVersion',
              align: 'center',
              render: (text) => {
                return <span>第{++text}次</span>;
              },
            },
            { title: '编辑器版本', dataIndex: 'ever', align: 'center' },
            { title: '地图版本', dataIndex: 'mver', align: 'center' },
            {
              title: '操作',
              align: 'center',
              render: (text, record) => {
                return (
                  <Button
                    size="small"
                    onClick={() => {
                      exportMapHistory(record.id);
                    }}
                  >
                    导出
                  </Button>
                );
              },
            },
          ]}
        />
      </Card>
    </Modal>
  );
};
export default connect(({ editor }) => {
  const { mapHistoryVisible, currentMap } = editor;
  return {
    mapHistoryVisible,
    mapId: currentMap?.id,
  };
})(MapUpdateHistory);
