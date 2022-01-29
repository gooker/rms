import React, { memo, useState } from 'react';
import { Button, Col, Divider, Form, Input, Row, Table, Tag } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { connect } from '@/utils/RcsDva';
import { formatMessage, isNull } from '@/utils/util';
import { getCurrentRouteMapData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import ButtonInput from '@/components/ButtonInput/ButtonInput';
import editorStyles from '../editorLayout.module.less';
import styles from './popoverPanel.module.less';

const AislePanel = (props) => {
  const { height, aisles, selectCellIds } = props;

  const [formVisible, setFormVisible] = useState(null);
  const [editing, setEditing] = useState(null);

  const aisleColumns = [
    {
      // 名称
      title: formatMessage({ id: 'app.common.name' }),
      align: 'center',
      dataIndex: 'tunnelName',
    },
    {
      // 点位
      title: formatMessage({ id: 'app.map.cell' }),
      align: 'center',
      width: 200,
      dataIndex: 'cells',
      render: (text) => {
        if (text) {
          return text.map((item, index) => <Tag key={index}>{item}</Tag>);
        }
      },
    },
    {
      // 解锁点位
      title: formatMessage({ id: 'editor.aisle.unLockCells' }),
      align: 'center',
      dataIndex: 'tunnelInUnLockCell',
      render: (text) => {
        if (text) {
          return text.map((item, index) => <Tag key={index}>{item}</Tag>);
        }
      },
    },
    {
      // 入口
      title: formatMessage({ id: 'editor.aisle.entrance' }),
      align: 'center',
      dataIndex: 'in',
      render: (text) => {
        if (text) {
          return text.map((item, index) => <Tag key={index}>{item}</Tag>);
        }
      },
    },
    {
      // 出口
      title: formatMessage({ id: 'editor.aisle.exit' }),
      align: 'center',
      dataIndex: 'out',
      render: (text) => {
        if (text) {
          return text.map((item, index) => <Tag key={index}>{item}</Tag>);
        }
      },
    },
    {
      // 操作
      title: formatMessage({ id: 'app.common.operation' }),
      align: 'center',
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <div>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setFormVisible(true);
              }}
            >
              <EditOutlined />
            </span>
            <Divider type="vertical" />
            <span
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

  function remove() {
    //
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
        <FormattedMessage id={'app.map.aisle'} />
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
              <AisleForm aisle={editing} selectCellIds={selectCellIds} />
            ) : (
              <>
                <Row style={{ width: '100%' }}>
                  <Col span={12}>
                    <h3 style={{ color: '#FFF' }}>
                      <FormattedMessage id="app.map.aisle" />
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
                    dataSource={aisles}
                    columns={aisleColumns}
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
  const { selectCells } = editor;
  const currentScopeMapData = getCurrentRouteMapData();
  const tunnels = currentScopeMapData?.tunnels ?? [];
  return { selectCellIds: selectCells, aisles: tunnels };
})(memo(AislePanel));

const AisleForm = (props) => {
  const { tunnel, selectCellIds } = props;

  const [formRef] = Form.useForm();

  function onValuesChange() {
    //
  }

  function customNameDuplicateValidator() {
    //
  }

  return (
    <div className={styles.formWhiteLabel}>
      <Form form={formRef} onValuesChange={onValuesChange} layout={'vertical'}>
        {/* 名称 */}
        <Form.Item
          name={'tunnelName'}
          initialValue={tunnel?.tunnelName}
          label={<FormattedMessage id="app.common.name" />}
          rules={[{ required: true }, customNameDuplicateValidator()]}
        >
          <Input maxLength={4} />
        </Form.Item>

        {/* 点位 */}
        <Form.Item
          name={'cells'}
          initialValue={tunnel?.cells || []}
          rules={[{ required: true }]}
          label={<FormattedMessage id="app.map.cell" />}
        >
          <ButtonInput multi={true} data={selectCellIds} btnDisabled={selectCellIds.length === 0} />
        </Form.Item>
      </Form>
    </div>
  );
};
