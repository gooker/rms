import React, { memo, useState } from 'react';
import { Button, Col, Divider, Row, Table } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { connect } from '@/utils/RcsDva';
import { formatMessage, isNull } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import editorStyles from '../editorLayout.module.less';
import styles from '../PopoverPanel/popoverPanel.module.less';
import WorkStationForm from './WorkStationForm';

const WorkStationPanel = (props) => {
  const { height, dispatch, mapContext, workstationList } = props;

  const [formVisible, setFormVisible] = useState(null);
  const [editing, setEditing] = useState(null);

  const workstationListColumns = [
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
                editRow(record, index);
              }}
            >
              <EditOutlined />
            </span>
            <Divider type="vertical" />
            <span
              onClick={() => {
                remove(index + 1);
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

  function editRow(record) {
    setEditing(record);
    setFormVisible(true);
  }

  function remove(flag) {
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, type: 'workstationList', scope: 'logic' },
    }).then((result) => {
      mapContext.removeWorkStation(result);
      mapContext.refresh();
    });
  }

  return (
    <div style={{ height, width: 450 }} className={editorStyles.categoryPanel}>
      <div>
        {formVisible ? (
          <LeftOutlined
            style={{ cursor: 'pointer', marginRight: 5 }}
            onClick={() => {
              setFormVisible(false);
              setEditing(null);
            }}
          />
        ) : null}
        <FormattedMessage id={'app.map.workstation'} />
        {formVisible ? <RightOutlined style={{ fontSize: 16, margin: '0 5px' }} /> : null}
        <span style={{ fontSize: 15, fontWeight: 500 }}>
          {formVisible
            ? isNull(editing)
              ? formatMessage({ id: 'app.button.add' })
              : formatMessage({ id: 'app.button.update' })
            : null}
        </span>
      </div>
      <div>
        <div className={styles.panelBlock}>
          <Row style={{ padding: '0 15px 5px 15px' }}>
            {formVisible ? (
              <WorkStationForm workStation={editing} />
            ) : (
              <>
                <Row style={{ width: '100%' }}>
                  <Col span={12}>
                    <h3 style={{ color: '#FFF' }}>
                      <FormattedMessage id="app.map.workstation" />
                      <FormattedMessage id="app.common.list" />
                    </h3>
                  </Col>
                  <Col span={12} style={{ textAlign: 'end' }}>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        setFormVisible(true);
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
                    dataSource={workstationList}
                    columns={workstationListColumns}
                    scroll={{ x: 'max-content' }}
                  />
                </Row>
              </>
            )}
          </Row>
        </div>
      </div>
    </div>
  );
};
export default connect(({ editor }) => {
  const currentLogicAreaData = getCurrentLogicAreaData();
  const workstationList = currentLogicAreaData?.workstationList ?? [];
  return { workstationList, mapContext: editor.mapContext };
})(memo(WorkStationPanel));
