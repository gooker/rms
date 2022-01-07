import React, { memo } from 'react';
import { Button, Col, Divider, Row, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/dva';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';
import FormattedMessage from '@/components/FormattedMessage';
import editorStyles from '../components/editorLayout.module.less';
import styles from '../PopoverPanel/popoverPanel.module.less';

const StationPanel = (props) => {
  const { allCommons, commonList, selectCellIds } = props;
  const { dispatch, height, allStationTypes, allWebHooks } = props;

  const stationListColumns = [
    {
      // 名称
      title: <FormattedMessage id={'app.common.name'} />,
      align: 'center',
      dataIndex: 'name',
    },
    {
      // 编码
      title: <FormattedMessage id={'app.common.code'} />,
      align: 'center',
      dataIndex: 'station',
    },
    {
      // 停止点
      title: <FormattedMessage id={'editor.workstation.stop'} />,
      align: 'center',
      dataIndex: 'stopCellId',
    },
    {
      // 角度
      title: <FormattedMessage id={'app.common.angle'} />,
      align: 'center',
      dataIndex: 'angle',
    },
    {
      // 操作
      title: <FormattedMessage id={'app.common.operation'} />,
      align: 'center',
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <div>
            <span
              key="edit"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.editRow(record, index);
              }}
            >
              <EditOutlined />
            </span>
            <Divider type="vertical" />
            <span
              onClick={() => {
                this.remove(index + 1);
              }}
              key="delete"
              style={{ cursor: 'pointer' }}
            >
              <DeleteOutlined />
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ height, width: 450 }} className={editorStyles.categoryPanel}>
      <div>
        <FormattedMessage id={'app.map.station'} />
      </div>
      <div>
        <div className={styles.panelBlock}>
          <Row style={{ padding: '0 15px 5px 15px' }}>
            <Row style={{ width: '100%' }}>
              <Col span={12}>
                <h3 style={{ color: '#FFF' }}>
                  <FormattedMessage id="app.map.station" />
                  <FormattedMessage id="app.common.list" />
                </h3>
              </Col>
              <Col span={12} style={{ textAlign: 'end' }}>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    this.setState({
                      choice: '',
                      showForm: true,
                      flag: commonList.length + 1,
                      tid: commonList.length,
                    });
                  }}
                >
                  <PlusOutlined /> <FormattedMessage id="app.button.add" />
                </Button>
              </Col>
            </Row>
            <Row className={styles.functionTable}>
              <Table
                bordered
                pagination={false}
                dataSource={commonList}
                columns={stationListColumns}
                scroll={{ x: 'max-content' }}
                rowKey={(record) => record.station}
              />
            </Row>
          </Row>
        </div>
      </div>
    </div>
  );
};
export default connect(({ editor }) => {
  const { currentMap, selectCells, allStationTypes, allWebHooks } = editor;
  const currentLogicAreaData = getCurrentLogicAreaData();

  // 获取所有通用站点列表
  const allCommons = [];
  const { logicAreaList } = currentMap;
  logicAreaList.forEach((item) => {
    const commonList = item.commonList || [];
    allCommons.push(...commonList);
  });

  const commonList = currentLogicAreaData?.commonList ?? [];
  return { allStationTypes, allWebHooks, allCommons, commonList, selectCellIds: selectCells };
})(memo(StationPanel));
