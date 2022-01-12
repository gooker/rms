import React, { memo, useState } from 'react';
import { Button, Col, InputNumber, Divider, Form, Input, Row, Table } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { connect } from '@/utils/dva';
import { formatMessage, isNull } from '@/utils/utils';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';
import FormattedMessage from '@/components/FormattedMessage';
import RichInput from '@/packages/XIHE/components/RichInput';
import CardRadio from '@/packages/XIHE/components/CardRadio';
import SuperMultiSelect from '@/packages/XIHE/components/SuperMultiSelect';
import AngleSelector from '@/components/AngleSelector';
import editorStyles from '../components/editorLayout.module.less';
import styles from '../PopoverPanel/popoverPanel.module.less';

const WorkStationPanel = (props) => {
  const { height, selectCellIds, workstationList, allWorkstations } = props;

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
              // selectCellIds, workStation, iconWidth, iconHeight
              <WorkStationForm selectCellIds={selectCellIds} />
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
  const { currentMap, selectCells } = editor;
  const currentLogicAreaData = getCurrentLogicAreaData();
  const workstationList = currentLogicAreaData?.workstationList ?? [];

  // 获取所有工作站点列表
  const allWorkstations = [];
  const { logicAreaList } = currentMap;
  logicAreaList.forEach((item) => {
    const logicWorkstations = item.workstationList || [];
    allWorkstations.push(...logicWorkstations);
  });

  return { allWorkstations, workstationList, selectCellIds: selectCells };
})(memo(WorkStationPanel));

const WorkStationForm = (props) => {
  const { selectCellIds, workStation, iconWidth, iconHeight } = props;
  const [formRef] = Form.useForm();

  function onValuesChange() {
    //
  }

  function checkCodeDuplicate(value) {
    //
  }

  return (
    <div className={styles.formWhiteLabel}>
      <Form form={formRef} onValuesChange={onValuesChange} layout={'vertical'}>
        {/* 隐藏字段 */}
        {/*<Form.Item hidden name={'tid'} initialValue={tid} />*/}
        {/*<Form.Item hidden name={'flag'} initialValue={flag} />*/}
        <Form.Item hidden name={'direction'} initialValue={workStation?.direction} />
        <Form.Item hidden name={'angle'} initialValue={workStation?.angle} />

        {/* 编码 */}
        <Form.Item
          name={'station'}
          initialValue={workStation?.station}
          label={formatMessage({ id: 'app.common.code' })}
          rules={[
            () => ({
              validator(_, value) {
                const isDuplicate = checkCodeDuplicate(value);
                if (!isDuplicate) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(formatMessage({ id: 'editor.code.duplicate' })));
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>

        {/* 名称 */}
        <Form.Item
          name={'name'}
          initialValue={workStation?.name}
          label={<FormattedMessage id="app.common.name" />}
        >
          <Input />
        </Form.Item>

        {/* 停止点 */}
        <Form.Item
          name={'stopCellId'}
          initialValue={workStation?.stopCellId}
          label={formatMessage({ id: 'editor.cellType.stop' })}
        >
          <RichInput
            currentCellId={selectCellIds}
            icon={<img alt={'stop'} style={{ width: 25 }} src={'/pictures/stop.png'} />}
          />
        </Form.Item>

        {/* 距离停止点的距离 */}
        <Form.Item
          name={'offset'}
          initialValue={workStation?.offset || 1900}
          label={<FormattedMessage id="editor.station.distance" />}
        >
          <InputNumber style={{ width: 150 }} />
        </Form.Item>

        {/* 图标 */}
        <Form.Item
          name={'icon'}
          initialValue={workStation?.icon || 'work_station'}
          label={<FormattedMessage id="editor.station.icon" />}
        >
          <CardRadio />
        </Form.Item>

        {/* 图标宽度 */}
        <Form.Item
          name={'iconWidth'}
          initialValue={iconWidth}
          label={<FormattedMessage id="editor.station.icon.width" />}
        >
          <InputNumber />
        </Form.Item>

        {/* 图标高度 */}
        <Form.Item
          name={'iconHeight'}
          initialValue={iconHeight}
          label={<FormattedMessage id="editor.station.icon.height" />}
        >
          <InputNumber />
        </Form.Item>

        {/* 角度 */}
        <Form.Item
          name={'direction&&angle'}
          initialValue={workStation?.angle}
          label={<FormattedMessage id="app.common.angle" />}
          getValueFromEvent={(value) => {
            const { setFieldsValue } = this.formRef.current;
            setFieldsValue({
              direction: value.dir,
              angle: value.angle,
            });
            return value;
          }}
        >
          <AngleSelector />
        </Form.Item>

        {/* 扫描点 */}
        <Form.Item
          name={'scanCellId'}
          initialValue={workStation?.scanCellId}
          label={<FormattedMessage id="editor.cellType.scan" />}
        >
          <RichInput
            icon={<img alt={'scan_cell'} style={{ width: 25 }} src={'/pictures/scan_cell.png'} />}
            currentCellId={selectCellIds}
          />
        </Form.Item>

        {/* 缓冲点 */}
        <Form.Item
          name={'bufferCellId'}
          initialValue={workStation?.bufferCellId}
          label={formatMessage({ id: 'editor.cellType.buffer' })}
        >
          <RichInput
            currentCellId={selectCellIds}
            icon={
              <img alt={'buffer_cell'} style={{ width: 25 }} src={'/pictures/buffer_cell.png'} />
            }
          />
        </Form.Item>

        {/* 旋转点 */}
        <Form.Item
          name={'rotateCellIds'}
          initialValue={workStation?.rotateCellIds}
          label={formatMessage({ id: 'editor.cellType.rotation' })}
        >
          <SuperMultiSelect
            currentCellId={selectCellIds}
            icon={<img alt={'rotate'} style={{ width: 25 }} src={'/pictures/round.png'} />}
          />
        </Form.Item>

        {/* 分叉点 */}
        <Form.Item
          name={'branchPathCellIds'}
          initialValue={workStation?.branchPathCellIds}
          label={formatMessage({ id: 'editor.cellType.bifurcation' })}
        >
          <SuperMultiSelect
            currentCellId={selectCellIds}
            icon={
              <img alt={'bifurcation'} style={{ width: 25 }} src={'/pictures/bifurcation.png'} />
            }
          />
        </Form.Item>
      </Form>
    </div>
  );
};
