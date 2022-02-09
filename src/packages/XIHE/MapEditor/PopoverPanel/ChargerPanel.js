import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Divider, message, Row, Table } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import ChargerForm from './ChargerForm';
import ChargerMultiForm from './ChargerMultiForm';
import editorStyles from '../editorLayout.module.less';
import styles from './popoverPanel.module.less';
import { fetchTrafficRobotType } from '@/services/XIHE';

const ChargerPanel = (props) => {
  const { dispatch, height, mapContext, chargerList } = props;

  const [formVisible, setFormVisible] = useState(null);
  const [multiFormVisible, setMultiFormVisible] = useState(null);
  const [editing, setEditing] = useState(null);
  const [robotTypes, setRobotTypes] = useState([]);

  useEffect(() => {
    fetchTrafficRobotType().then((response) => {
      if (!dealResponse(response)) {
        setRobotTypes(response);
      } else {
        message.error(formatMessage({ id: 'app.message.fetchAgvTypeListFail' }));
      }
    });
  }, []);

  const chargerListColumns = [
    {
      // 名称
      title: formatMessage({ id: 'app.common.name' }),
      align: 'center',
      dataIndex: 'name',
    },
    {
      // 充电点
      title: formatMessage({ id: 'editor.cellType.charging' }),
      align: 'center',
      dataIndex: 'chargingCells',
      render: (text) => {
        const cellIds = text.map((item) => item.cellId);
        return `${cellIds.join()}`;
      },
    },
    {
      // 角度
      title: formatMessage({ id: 'app.common.angle' }),
      align: 'center',
      dataIndex: 'angle',
    },
    {
      // 操作
      title: formatMessage({ id: 'app.common.operation' }),
      align: 'center',
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
              key="delete"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                remove(index + 1);
              }}
            >
              <DeleteOutlined />
            </span>
          </div>
        );
      },
    },
  ];

  function editRow(record) {
    setEditing({ ...record, extraAngle: record.angle });
    setFormVisible(true);
  }

  function remove(flag) {
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, type: 'chargerList', scope: 'logic' },
    }).then((result) => {
      mapContext.removeCharger(result);
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
              setMultiFormVisible(false);
              setEditing(null);
            }}
          />
        ) : null}
        <FormattedMessage id={'app.map.charger'} />
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
              <ChargerForm charger={editing} robotTypes={robotTypes} />
            ) : multiFormVisible ? (
              <ChargerMultiForm
                robotTypes={robotTypes}
                back={() => {
                  setMultiFormVisible(false);
                }}
              />
            ) : (
              <>
                <Row style={{ width: '100%' }}>
                  <Col span={12}>
                    <h3 style={{ color: '#FFF' }}>
                      <FormattedMessage id="app.map.charger" />
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
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        setMultiFormVisible(true);
                      }}
                      style={{ marginLeft: 10 }}
                    >
                      <PlusOutlined /> <FormattedMessage id="editor.cell.batchAdd" />
                    </Button>
                  </Col>
                </Row>
                <Row className={styles.functionTable}>
                  <Table
                    bordered
                    pagination={false}
                    dataSource={chargerList}
                    columns={chargerListColumns}
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
  const { mapContext } = editor;
  const currentLogicAreaData = getCurrentLogicAreaData();
  const chargerList = currentLogicAreaData?.chargerList ?? [];
  return { chargerList, mapContext };
})(memo(ChargerPanel));
