import React, { memo, useState } from 'react';
import { Button, Col, InputNumber, Divider, Form, Input, Row, Select, Table } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  ReloadOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { connect } from '@/utils/RcsDva';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import editorStyles from '../editorLayout.module.less';
import styles from '../PopoverPanel/popoverPanel.module.less';
import { formatMessage, isNull } from '@/utils/util';
import RichInput from '@/packages/XIHE/components/RichInput';
import AngleSelector from '@/components/AngleSelector';
import CardRadio from '@/packages/XIHE/components/CardRadio';

const { Option } = Select;

const StationPanel = (props) => {
  const { allCommons, commonList, selectCellIds } = props;
  const { dispatch, height, allStationTypes, allWebHooks } = props;

  const [formVisible, setFormVisible] = useState(null);
  const [editing, setEditing] = useState(null);

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
                setEditing(record);
                setFormVisible(true);
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
        <FormattedMessage id={'app.map.station'} />
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
              <StationForm
                data={{
                  allStationTypes,
                  selectCellIds,
                  allWebHooks,
                  station: editing,
                }}
              />
            ) : (
              <>
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
                    dataSource={commonList}
                    columns={stationListColumns}
                    scroll={{ x: 'max-content' }}
                    rowKey={(record) => record.station}
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

const StationForm = (props) => {
  const { station, iconWidth, iconHeight, selectCellIds, allWebHooks, allStationTypes } =
    props.data;

  const [formRef] = Form.useForm();
  const [stationType, setStationType] = useState('COMMON');

  function onValuesChange() {
    //
  }

  function checkCodeDuplicate(value) {
    //
  }

  function freshAllWebHook() {
    //
  }

  function renderStationTypeOptions() {
    const optionData = Object.entries(allStationTypes).map(([type, label]) => ({ type, label }));
    return optionData.map(({ type, label }) => (
      <Option key={type} value={type}>
        {label}
      </Option>
    ));
  }

  return (
    <div>
      <Form form={formRef} layout={'vertical'} onValuesChange={onValuesChange}>
        {/* 隐藏字段 */}
        {/*<Form.Item hidden name={'tid'} initialValue={tid} />*/}
        {/*<Form.Item hidden name={'flag'} initialValue={flag} />*/}
        <Form.Item hidden name={'direction'} initialValue={station?.direction} />
        <Form.Item hidden name={'angle'} initialValue={station?.angle} />

        {/* 编码 */}
        <Form.Item
          name={'station'}
          initialValue={station?.station}
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
          initialValue={station?.name}
          label={<FormattedMessage id="app.common.name" />}
          getValueFromEvent={(ev) => {
            const value = ev.target.value;
            if (value) {
              return value.replace(/[^a-z0-9_]/g, '');
            }
            return value;
          }}
        >
          <Input />
        </Form.Item>

        {/* 类型 */}
        <Form.Item
          name={'customType'}
          initialValue={station?.customType || 'COMMON'}
          label={formatMessage({ id: 'app.common.type' })}
          getValueFromEvent={(value) => {
            setStationType(value);
            return value;
          }}
        >
          <Select>{renderStationTypeOptions()}</Select>
        </Form.Item>

        {/* 停止点 */}
        <Form.Item
          name={'stopCellId'}
          initialValue={station?.stopCellId}
          label={formatMessage({ id: 'editor.cellType.stop' })}
        >
          <RichInput
            currentCellId={selectCellIds}
            icon={<img style={{ width: 25 }} src={'/stop.png'} />}
          />
        </Form.Item>

        {/* 站点角度 */}
        <Form.Item
          name={'direction&&angle'}
          initialValue={station?.angle}
          label={<FormattedMessage id="app.common.angle" />}
          getValueFromEvent={(value) => {
            formRef.setFieldsValue({
              direction: value.dir,
              angle: value.angle,
            });
            return value;
          }}
        >
          <AngleSelector />
        </Form.Item>

        {/* 偏移距离 */}
        <Form.Item
          name={'offset'}
          initialValue={station?.offset}
          label={<FormattedMessage id="editor.moveCell.offsetDistance" />}
        >
          <InputNumber style={{ width: 150 }} />
        </Form.Item>

        {/* ---- 滚筒站 ---- */}
        {stationType === 'ROLLER' && (
          <>
            {/* 料箱编码 */}
            <Form.Item
              name={'binCode'}
              initialValue={station?.binCode}
              label={formatMessage({ id: 'app.roller.binCode' })}
            >
              <Input />
            </Form.Item>

            {/* 车头方向 */}
            <Form.Item
              name={'toteAgvDirection'}
              initialValue={station?.toteAgvDirection}
              label={formatMessage({ id: 'app.agv.direction' })}
            >
              <AngleSelector getAngle />
            </Form.Item>

            {/* 高度 */}
            <Form.Item label={formatMessage({ id: 'app.common.height' })}>
              <Row gutter={10}>
                <Col span={10}>
                  <Form.Item noStyle name={'heightOffset'} initialValue={station?.heightOffset}>
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                  mm
                </Col>
              </Row>
            </Form.Item>

            {/* 深度 */}
            <Form.Item label={formatMessage({ id: 'app.common.depth' })}>
              <Row gutter={10}>
                <Col span={10}>
                  <Form.Item noStyle name={'toteAGVDepth'} initialValue={station?.toteAGVDepth}>
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                  mm
                </Col>
              </Row>
            </Form.Item>

            {/* WebHook */}
            <Form.Item label={'Web Hook'}>
              <Row gutter={10}>
                <Col span={15}>
                  <Form.Item noStyle name={'webHookId'} initialValue={station?.webHookId}>
                    <Select style={{ width: '100%' }}>
                      {allWebHooks.map(({ id, name }) => (
                        <Option key={id} value={id}>
                          {name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    type="link"
                    size={'small'}
                    icon={<ReloadOutlined />}
                    onClick={freshAllWebHook}
                    style={{ marginLeft: '5px' }}
                  />
                </Col>
              </Row>
            </Form.Item>
          </>
        )}

        {/* 图标 */}
        <Form.Item
          name={'icon'}
          initialValue={station?.icon || 'common'}
          label={<FormattedMessage id="editor.station.icon" />}
        >
          <CardRadio type="common" />
        </Form.Item>

        {/* 图标宽度 */}
        <Form.Item
          name={'iconWidth'}
          initialValue={iconWidth}
          label={<FormattedMessage id="editor.station.icon.width" />}
        >
          <InputNumber style={{ width: 150 }} />
        </Form.Item>

        {/* 图标高度 */}
        <Form.Item
          name={'iconHeight'}
          initialValue={iconHeight}
          label={<FormattedMessage id="editor.station.icon.height" />}
        >
          <InputNumber style={{ width: 150 }} />
        </Form.Item>

        {/* 图标角度 */}
        <Form.Item
          name={'iconAngle'}
          initialValue={station?.iconAngle || 0}
          label={<FormattedMessage id="app.common.angle" />}
        >
          <AngleSelector getAngle />
        </Form.Item>
      </Form>
    </div>
  );
};
