import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Button, Col, Divider, Input, Form, message, Row, Select, Table } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';
import { dealResponse, isNull } from '@/utils/utils';
import ButtonInput from '@/components/ButtonInput/ButtonInput';
import AngleSelector from '../../../components/AngleSelector';
import AgvTypeSelect from './AgvTypeSelect';
import { fetchTrafficRobotType } from '@/services/simulator';
import MenuIcon from '@/MenuIcon';
import MapContext from '../MapContext';

const formLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };

class ChargerList extends Component {
  static contextType = MapContext;

  formRef = React.createRef();

  state = {
    tid: 0, // 标记全局充电桩ID
    flag: 0, // 当前逻辑区的充电桩 ”index+1“
    robotTypes: [],
    charger: null,
    showForm: false,
  };

  chargerListColumns = [
    {
      // '名称'
      title: formatMessage({ id: 'app.workStationMap.name' }),
      align: 'center',
      dataIndex: 'name',
    },
    {
      // '充电点'
      title: formatMessage({ id: 'app.chargerList.chargePoint' }),
      align: 'center',
      dataIndex: 'chargingCells',
      render: (text) => {
        const cellIds = text.map((item) => item.cellId);
        return `${cellIds.join()}`;
      },
    },
    {
      // '角度'
      title: formatMessage({ id: 'app.workStationMap.angle' }),
      align: 'center',
      dataIndex: 'angle',
    },
    {
      // '操作'
      title: formatMessage({ id: 'app.workStationMap.operation' }),
      align: 'center',
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
              key="delete"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.remove(index + 1);
              }}
            >
              {MenuIcon.delete}
            </span>
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    fetchTrafficRobotType().then((res) => {
      if (!dealResponse(res)) {
        this.setState({ robotTypes: res });
      } else {
        message.error(formatMessage({ id: 'app.simulator.tip.fetchAMRTypeFail' }));
      }
    });
  }

  onValueChange = (changedValues, allValues) => {
    const { dispatch } = this.props;
    if (
      !this.checkNameDuplicate(allValues.name) &&
      !isNull(allValues.angle) &&
      Array.isArray(allValues.chargingCells) &&
      JSON.stringify(allValues.chargingCells[0]) !== '{}'
    ) {
      // 删除无用的字段
      const currentCharger = { ...allValues };
      delete currentCharger.extraAngle;

      dispatch({
        type: 'editor/updateFunction',
        payload: { scope: 'logic', type: 'chargerList', data: currentCharger },
      }).then((result) => {
        const currentLogicAreaData = getCurrentLogicAreaData();
        if (result.type === 'add') {
          this.context.renderChargers([result.payload]);
        }
        if (result.type === 'update') {
          const { pre, current } = result;
          this.context.removeCharger(pre, currentLogicAreaData.id);
          this.context.renderChargers([current]);
        }
        this.context.refresh();
      });
    }
  };

  editRow = (record, index) => {
    this.setState({
      charger: { ...record, extraAngle: record.angle },
      showForm: true,
      flag: index + 1,
      tid: record.tid,
    });
  };

  remove = (flag) => {
    const { dispatch } = this.props;
    const currentLogicAreaData = getCurrentLogicAreaData();
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, type: 'chargerList', scope: 'logic' },
    }).then((result) => {
      this.context.removeCharger(result, currentLogicAreaData.id);
      this.context.refresh();
    });
  };

  checkNameDuplicate = (name) => {
    const { allChargers } = this.props;
    const { getFieldValue } = this.formRef.current;
    const { tid } = getFieldValue();
    const existNames = allChargers.filter((item) => item.tid !== tid).map((item) => item.name);
    return existNames.includes(name);
  };

  render() {
    const _this = this;
    const { selectCellIds, chargerList, allChargers } = this.props;
    const { showForm, flag, tid, charger, robotTypes } = this.state;
    if (showForm) {
      return (
        <Row style={{ margin: '20px 10px' }}>
          <Button
            type="primary"
            icon={MenuIcon.rollback}
            onClick={() => {
              this.setState({ showForm: false });
            }}
          >
            <FormattedMessage id="app.workStationMap.back" />
          </Button>

          <div style={{ width: '100%' }}>
            <Divider orientation="left">
              {charger
                ? formatMessage({ id: 'app.chargerList.updateCharger' })
                : formatMessage({ id: 'app.chargerList.addChargePoint' })}
            </Divider>
          </div>

          <Form ref={this.formRef} onValuesChange={this.onValueChange}>
            {/* 隐藏字段 */}
            <Form.Item hidden name={'tid'} initialValue={tid} />
            <Form.Item hidden name={'flag'} initialValue={flag} />
            <Form.Item hidden name={'direction'} initialValue={charger?.direction} />
            <Form.Item hidden name={'angle'} initialValue={charger?.angle} />

            {/* 名称 */}
            <Form.Item
              {...formLayout}
              name={'name'}
              initialValue={charger?.name}
              label={<FormattedMessage id="app.workStationMap.name" />}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'app.chargerList.nameRequired' }),
                },
                {
                  pattern: /^[0-9a-zA-Z_]{1,}$/,
                  message: formatMessage({ id: 'app.channel.name.validate' }),
                },
                () => ({
                  validator(_, value) {
                    const isDuplicate = _this.checkNameDuplicate(value);
                    if (!isDuplicate) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(formatMessage({ id: 'app.channel.name.duplicate' })),
                    );
                  },
                }),
              ]}
            >
              <Input maxLength={4} />
            </Form.Item>

            {/* 角度 */}
            <Form.Item
              {...formLayout}
              name={'extraAngle'}
              initialValue={charger?.extraAngle}
              label={<FormattedMessage id="app.workStationMap.angle" />}
              getValueFromEvent={(value) => {
                const { setFieldsValue } = this.formRef.current;
                setFieldsValue({
                  direction: value.dir,
                  angle: value.angle,
                });
              }}
            >
              <AngleSelector />
            </Form.Item>

            {/* 充电点 */}
            <Form.List
              name={'chargingCells'}
              initialValue={
                Array.isArray(charger?.chargingCells) && charger?.chargingCells.length > 0
                  ? charger?.chargingCells
                  : [{}]
              }
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Row
                      key={key}
                      style={{
                        border: '1px solid #e0dcdc',
                        padding: '25px 10px 0 0',
                        borderRadius: '5px',
                        marginBottom: '20px',
                      }}
                    >
                      <Col span={21}>
                        {/* 充电点 */}
                        <Form.Item
                          {...formLayout}
                          {...restField}
                          name={[name, 'cellId']}
                          fieldKey={[fieldKey, 'cellId']}
                          label={formatMessage({ id: 'app.chargerList.chargePoint' })}
                        >
                          <ButtonInput
                            type={'number'}
                            data={selectCellIds[0]}
                            btnDisabled={selectCellIds.length !== 1}
                          />
                        </Form.Item>

                        {/* 小车类型 */}
                        <Form.Item
                          {...formLayout}
                          {...restField}
                          name={[name, 'agvTypes']}
                          fieldKey={[fieldKey, 'agvTypes']}
                          label={formatMessage({ id: 'app.chargerList.carType' })}
                        >
                          <AgvTypeSelect mode="multiple">
                            {robotTypes.map((record) => (
                              <Select.Option value={record} key={record}>
                                {record}
                              </Select.Option>
                            ))}
                          </AgvTypeSelect>
                        </Form.Item>
                      </Col>
                      <Col span={3} style={{ textAlign: 'center' }}>
                        <Button type="danger" icon={MenuIcon.delete} onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={MenuIcon.plus}>
                      <FormattedMessage id="app.workStationMap.add" />
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Row>
      );
    }
    return (
      <Row style={{ margin: '10px 0px' }}>
        <Row style={{ width: '100%' }}>
          <Col span={12}>
            <h3>
              <FormattedMessage id="app.chargerList.chargingPointList" />
            </h3>
          </Col>
          <Col style={{ textAlign: 'end' }} span={12}>
            <Button
              size="small"
              icon={MenuIcon.plus}
              type="primary"
              onClick={() => {
                this.setState({
                  charger: '',
                  showForm: true,
                  tid: allChargers.length,
                  flag: chargerList.length + 1,
                });
              }}
            >
              {/* 添加 */}
              <FormattedMessage id="app.workStationMap.add" />
            </Button>
          </Col>
        </Row>
        <Table
          bordered
          pagination={false}
          dataSource={chargerList}
          columns={this.chargerListColumns}
        />
      </Row>
    );
  }
}
export default connect(({ editor }) => {
  const { selectCells, currentMap } = editor;
  // 获取所有充电桩名称列表
  const allChargers = [];
  const { logicAreaList } = currentMap;
  logicAreaList.forEach((item) => {
    const chargerList = item.chargerList || [];
    allChargers.push(...chargerList);
  });

  const currentLogicAreaData = getCurrentLogicAreaData();
  const chargerList = currentLogicAreaData?.chargerList ?? [];
  return { chargerList, allChargers, selectCellIds: selectCells };
})(ChargerList);
