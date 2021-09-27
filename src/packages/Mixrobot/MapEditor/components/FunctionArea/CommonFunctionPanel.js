import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Input, Table, Form, Row, Select, Divider, Col, Button, InputNumber } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';
import CardRadio from '../../../components/CardRadio';
import AngleSelector from '@/packages/Mixrobot/components/AngleSelector';
import InputComponent from '../../../components/MapForm/MapInput';
import MenuIcon from '@/utils/MenuIcon';
import MapContext from '../MapContext';
import { isNull, isStrictNull } from '@/utils/utils';
import * as Config from '@/config/config';

const { Option } = Select;
const { CommonFunctionSize } = Config;
const FormLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };
const NoLabelFormLayout = { wrapperCol: { offset: 5, span: 19 } };

class CommonFunction extends Component {
  static contextType = MapContext;

  formRef = React.createRef();

  state = {
    tid: 0, // 标记全局通用站点ID
    flag: 0,
    showForm: false,
    choice: '',
    stationType: 'COMMON',
  };

  getCommonListColumns = () => {
    const { allStationTypes } = this.props;
    return [
      {
        // 名称
        title: formatMessage({ id: 'app.workStationMap.name' }),
        align: 'center',
        dataIndex: 'name',
      },
      {
        // 编码
        title: formatMessage({ id: 'form.code' }),
        align: 'center',
        dataIndex: 'station',
      },
      {
        // 类型
        title: formatMessage({ id: 'app.simulator.list.type' }),
        align: 'center',
        dataIndex: 'customType',
        render: (text) => allStationTypes[text],
      },
      {
        // 操作
        title: formatMessage({ id: 'app.workStationMap.operation' }),
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
                {MenuIcon.edit}
              </span>
              <Divider type="vertical" />
              <span
                onClick={() => {
                  this.remove(index + 1);
                }}
                key="delete"
                style={{ cursor: 'pointer' }}
              >
                {MenuIcon.delete}
              </span>
            </div>
          );
        },
      },
    ];
  };

  onValuesChange = (changedValues, allValues) => {
    const { dispatch } = this.props;
    const { setFieldsValue, getFieldValue } = this.formRef.current;
    const currentCommon = { ...allValues };
    currentCommon.x = currentCommon.x || 0;
    currentCommon.y = currentCommon.y || 0;

    if (
      !this.checkCodeDuplicate(allValues.station) &&
      !isNull(currentCommon.stopCellId) &&
      !isNull(currentCommon.angle)
    ) {
      // 如果没有编码字段就手动添加: 停止点-角度
      if (isStrictNull(currentCommon.station)) {
        if (!isNull(currentCommon.stopCellId) && !isNull(currentCommon.angle)) {
          currentCommon.station = `${currentCommon.stopCellId}-${currentCommon.angle}`;
        }
      }

      // 默认值(保证数据正确)和size字段
      currentCommon.size = `${currentCommon.iconWidth || currentCommon.width}@${
        currentCommon.iconHeight || currentCommon.height
      }`;

      // 删除无用的字段
      delete currentCommon.iconWidth;
      delete currentCommon.iconHeight;

      // 只有编码字段为空时候才会自动赋值
      const currentCode = getFieldValue('station');
      if (isNull(currentCode)) {
        setFieldsValue({ station: currentCommon.station });
      }
      dispatch({
        type: 'editor/updateFunction',
        payload: { scope: 'logic', type: 'commonList', data: currentCommon },
      }).then((result) => {
        if (result.type === 'add') {
          this.context.renderCommonFunction([result.payload]);
        }
        if (result.type === 'update') {
          const { pre, current } = result;
          this.context.removeCommonFunction(pre);
          this.context.renderCommonFunction([current]);
        }
        this.context.refresh();
      });
    }
  };

  editRow = (record, index) => {
    this.setState({
      choice: record,
      showForm: true,
      flag: index + 1,
      tid: record.tid,
      stationType: record.customType,
    });
  };

  remove = (flag) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, type: 'commonList', scope: 'logic' },
    }).then((result) => {
      this.context.removeCommonFunction(result);
      this.context.refresh();
    });
  };

  checkCodeDuplicate = (station) => {
    const { allCommons } = this.props;
    const { getFieldValue } = this.formRef.current;
    const { tid } = getFieldValue();
    const existCodes = allCommons.filter((item) => item.tid !== tid).map((item) => item.station);
    return existCodes.includes(station);
  };

  checkBinCodeDuplicate = (binCode) => {
    //
  };

  renderStationTypeOptions = () => {
    const { allStationTypes } = this.props;
    const optionData = Object.entries(allStationTypes).map(([type, label]) => ({ type, label }));
    return optionData.map(({ type, label }) => (
      <Option key={type} value={type}>
        {label}
      </Option>
    ));
  };

  render() {
    const _this = this;
    const { showForm, tid, flag, choice, stationType } = this.state;
    const { allCommons, allWebHooks, commonList, selectCellIds } = this.props;

    let iconWidth = CommonFunctionSize.width; // 默认值
    let iconHeight = CommonFunctionSize.height; // 默认值
    if (choice?.size) {
      const [_iconWidth, _iconHeight] = choice.size.split('@');
      iconWidth = _iconWidth ? parseInt(_iconWidth, 10) : iconWidth;
      iconHeight = _iconHeight ? parseInt(_iconHeight, 10) : iconHeight;
    }

    if (showForm) {
      return (
        <Row style={{ margin: '20px 10px' }}>
          <div style={{ width: '100%' }}>
            <Divider orientation="left">
              {choice !== ''
                ? formatMessage({ id: 'app.commonFunction.update' })
                : formatMessage({ id: 'app.commonFunction.add' })}
            </Divider>
          </div>

          <Form ref={this.formRef} onValuesChange={this.onValuesChange} style={{ width: '100%' }}>
            {/* 隐藏字段 */}
            <Form.Item hidden name={'tid'} initialValue={tid} />
            <Form.Item hidden name={'flag'} initialValue={flag} />

            {/* 编码 */}
            <Form.Item
              {...FormLayout}
              name={'station'}
              initialValue={choice.station}
              label={formatMessage({ id: 'form.code' })}
              rules={[
                () => ({
                  validator(_, value) {
                    const isDuplicate = _this.checkCodeDuplicate(value);
                    if (!isDuplicate) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(formatMessage({ id: 'app.commonFunction.station.duplicate' })),
                    );
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
            {/* 名称 */}
            <Form.Item
              {...FormLayout}
              name={'name'}
              initialValue={choice.name}
              label={<FormattedMessage id="app.workStationMap.name" />}
              getValueFromEvent={(ev) => {
                const value = ev.target.value;
                if (value) {
                  return value.replace(/[^a-z0-9_]/g, '');
                }
                return value;
              }}
            >
              <Input
                placeholder={formatMessage({
                  id: 'app.workStationMap.workstationNameTip',
                })}
              />
            </Form.Item>
            {/* 类型 */}
            <Form.Item
              {...FormLayout}
              name={'customType'}
              initialValue={choice.customType || 'COMMON'}
              label={formatMessage({ id: 'app.simulator.list.type' })}
              getValueFromEvent={(value) => {
                this.setState({ stationType: value });
                return value;
              }}
            >
              <Select>{this.renderStationTypeOptions()}</Select>
            </Form.Item>
            {/* 停止点 */}
            <Form.Item
              {...FormLayout}
              name={'stopCellId'}
              initialValue={choice.stopCellId}
              label={formatMessage({ id: 'app.workStationMap.stopPoint' })}
            >
              <InputComponent
                currentCellId={selectCellIds}
                icon={<img style={{ width: 25 }} src={require('@/../public/stop.png')} />}
              />
            </Form.Item>
            {/* 站点角度 */}
            <Form.Item
              {...FormLayout}
              name={'angle'}
              initialValue={choice.angle}
              label={<FormattedMessage id="app.commonFunction.stationDirection" />}
            >
              <AngleSelector getAngle />
            </Form.Item>
            {/* 偏移距离 */}
            <Form.Item
              {...FormLayout}
              name={'offset'}
              initialValue={choice.offset}
              label={<FormattedMessage id="app.moveCell.offsetDistance" />}
            >
              <InputNumber style={{ width: 150 }} />
            </Form.Item>

            {/* ---- 滚筒站 ---- */}
            {stationType === 'ROLLER' && (
              <>
                {/* 料箱编码 */}
                <Form.Item
                  {...FormLayout}
                  name={'binCode'}
                  initialValue={choice.binCode}
                  label={formatMessage({ id: 'app.roller.binCode' })}
                >
                  <Input />
                </Form.Item>
                {/* 车头方向 */}
                <Form.Item
                  {...FormLayout}
                  name={'toteAgvDirection'}
                  initialValue={choice.toteAgvDirection}
                  label={formatMessage({ id: 'app.commonFunction.agvDirection' })}
                >
                  <AngleSelector getAngle />
                </Form.Item>
                {/* 高度 */}
                <Form.Item {...FormLayout} label={formatMessage({ id: 'app.roller.heightOffset' })}>
                  <Row gutter={10}>
                    <Col span={10}>
                      <Form.Item noStyle name={'heightOffset'} initialValue={choice.heightOffset}>
                        <InputNumber style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                      mm
                    </Col>
                  </Row>
                </Form.Item>
                {/* 深度 */}
                <Form.Item {...FormLayout} label={formatMessage({ id: 'app.roller.toteAGVDepth' })}>
                  <Row gutter={10}>
                    <Col span={10}>
                      <Form.Item noStyle name={'toteAGVDepth'} initialValue={choice.toteAGVDepth}>
                        <InputNumber style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                      mm
                    </Col>
                  </Row>
                </Form.Item>

                {/* WebHook */}
                <Form.Item
                  {...FormLayout}
                  name={'webHookId'}
                  initialValue={choice.webHookId}
                  label={'Web Hook'}
                >
                  <Select style={{ width: 200 }}>
                    {allWebHooks.map(({ id, label }) => (
                      <Option key={id} value={id}>
                        {label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            )}

            {/* 图标 */}
            <Form.Item
              {...FormLayout}
              name={'icon'}
              initialValue={choice.icon || 'common'}
              label={<FormattedMessage id="app.workStationMap.icon" />}
            >
              <CardRadio type="common" />
            </Form.Item>
            {/* 图标宽度 */}
            <Form.Item
              {...FormLayout}
              name={'iconWidth'}
              initialValue={iconWidth}
              label={<FormattedMessage id="app.workStationMap.iconWidth" />}
            >
              <InputNumber style={{ width: 150 }} />
            </Form.Item>
            {/* 图标高度 */}
            <Form.Item
              {...FormLayout}
              name={'iconHeight'}
              initialValue={iconHeight}
              label={<FormattedMessage id="app.workStationMap.iconHeight" />}
            >
              <InputNumber style={{ width: 150 }} />
            </Form.Item>
            {/* 图标角度 */}
            <Form.Item
              {...FormLayout}
              name={'iconAngle'}
              initialValue={choice.iconAngle || 0}
              label={<FormattedMessage id="app.workStationMap.iconAngle" />}
            >
              <AngleSelector
                getAngle
                labelMap={{
                  0: FormattedMessage({ id: 'app.activity.AVGTop' }),
                  1: FormattedMessage({ id: 'app.activity.AVGRight' }),
                  2: FormattedMessage({ id: 'app.activity.AVGBottom' }),
                  3: FormattedMessage({ id: 'app.activity.AVGLeft' }),
                }}
              />
            </Form.Item>
            {/* 返回 */}
            <Form.Item {...NoLabelFormLayout}>
              <Button
                type="primary"
                icon={MenuIcon.rollback}
                onClick={() => {
                  this.setState({ showForm: false });
                }}
              >
                <FormattedMessage id="app.workStationMap.back" />
              </Button>
            </Form.Item>
          </Form>
        </Row>
      );
    }
    return (
      <Row style={{ margin: '10px 0px' }}>
        <Row style={{ width: '100%' }}>
          <Col span={12}>
            <h3>
              <FormattedMessage id="app.commonFunction.list" />
            </h3>
          </Col>
          <Col style={{ textAlign: 'end' }} span={12}>
            <Button
              size="small"
              icon={MenuIcon.plus}
              type="primary"
              onClick={() => {
                this.setState({
                  choice: '',
                  showForm: true,
                  flag: commonList.length + 1,
                  tid: allCommons.length,
                });
              }}
            >
              <FormattedMessage id="app.workStationMap.add" />
            </Button>
          </Col>
        </Row>
        <Table
          bordered
          pagination={false}
          dataSource={commonList}
          columns={this.getCommonListColumns()}
          scroll={{ x: 'max-content' }}
        />
      </Row>
    );
  }
}
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
})(CommonFunction);
