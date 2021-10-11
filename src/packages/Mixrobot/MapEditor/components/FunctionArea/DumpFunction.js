import React from 'react';
import { Button, Col, Form, Divider, Row, Table, Input, message } from 'antd';
import { connect } from '@/utils/dva';
import { isNull, formatMessage } from '@/utils/utils';
import {
  getOffsetDistance,
  getCurrentLogicAreaData,
  covertDumpFormData2Param,
} from '@/utils/mapUtils';
import MenuIcon from '@/utils/MenuIcon';
import FormattedMessage from '@/components/FormattedMessage';
import AngleSelector from '@/packages/Mixrobot/components/AngleSelector';
import ButtonInput from '@/packages/Mixrobot/components/ButtonInput/ButtonInput';
import MapEditContext from '@/packages/Mixrobot/MapEditor/MapEditContext';

const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
const formLayout2 = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };

/**
 * Dump 标识抛物点
 * Basket 标识抛物篮
 */
class DumpFunction extends React.Component {
  static contextType = MapEditContext;

  formRef = React.createRef();

  state = {
    showAgvDirection: true,
    showForm: false,

    flag: 0,
    choice: '',
  };

  dumpListColumn = [
    {
      // 名称
      title: formatMessage({ id: 'app.workStationMap.name' }),
      align: 'center',
      dataIndex: 'name',
    },
    {
      // 车方向
      title: formatMessage({ id: 'app.dump.agvDirection' }),
      align: 'center',
      dataIndex: 'agvDirection',
    },
    {
      // 抛物点x轴
      title: 'x',
      align: 'center',
      dataIndex: 'x',
    },
    {
      // 抛物点y轴
      title: 'y',
      align: 'center',
      dataIndex: 'y',
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
                this.edit(index + 1, record);
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

  subTableColumn = [
    {
      // 抛物框x轴
      title: 'x',
      align: 'center',
      dataIndex: 'x',
    },
    {
      // 抛物框y轴
      title: 'y',
      align: 'center',
      dataIndex: 'y',
    },
    {
      // 相对于抛物点距离
      title: formatMessage({ id: 'app.dump.distance' }),
      align: 'center',
      dataIndex: 'distance',
    },
    {
      // 相对于抛物点方向
      title: formatMessage({ id: 'app.selectDirAngle.direction' }),
      align: 'center',
      dataIndex: 'direction',
    },
    {
      // 抛物速度
      title: formatMessage({ id: 'app.dump.dumpSpeed' }),
      align: 'center',
      dataIndex: 'speed',
    },
  ];

  expandedRowRender = (dumpBasket) => {
    return (
      <Table
        bordered
        columns={this.subTableColumn}
        dataSource={dumpBasket ?? []}
        pagination={false}
      />
    );
  };

  calculateDumpPosition = (allFieldsValue) => {
    const { setFieldsValue } = this.formRef.current;
    const { cellMap } = this.props;
    if (allFieldsValue.baseCell) {
      const distance = parseInt(allFieldsValue.dumpDistance || 0, 10);
      if (allFieldsValue.targetCell) {
        this.setState({ showAgvDirection: false });
        const result = getOffsetDistance(
          cellMap[`${allFieldsValue.baseCell}`],
          cellMap[`${allFieldsValue.targetCell}`],
          distance,
        );
        if (result === 0) {
          message.error(formatMessage({ id: 'app.dump.aligned.points.required' }));
        }
        if (result === 1) {
          message.error(formatMessage({ id: 'app.dump.different.points.required' }));
        }
        setFieldsValue({ dumpX: result.x, dumpY: result.y });
      } else {
        this.setState({ showAgvDirection: true });
        const { x, y } = cellMap[`${allFieldsValue.baseCell}`];
        setFieldsValue({ dumpX: x, dumpY: y });
      }
    }
  };

  onValuesChange = (changedValues, allValues) => {
    const { dispatch, dumpStations } = this.props;
    const { getFieldsValue } = this.formRef.current;
    this.calculateDumpPosition(allValues);
    const allFieldsValue = getFieldsValue(true);
    const currentDump = covertDumpFormData2Param(allFieldsValue, dumpStations);
    if (!currentDump) return;

    currentDump.flag = allFieldsValue.flag;
    dispatch({
      type: 'editor/updateFunction',
      payload: { scope: 'logic', type: 'dumpStations', data: currentDump },
    }).then((result) => {
      if (result.type === 'add') {
        this.context.renderDumpFunction([result.payload]);
      }
      if (result.type === 'update') {
        const { pre, current } = result;
        this.context.removeDumpFunction(pre);
        this.context.renderDumpFunction([current]);
      }
      this.context.refresh();
    });
  };

  edit = (index, record) => {
    this.setState({
      choice: record,
      showForm: true,
      flag: index,
      showAgvDirection: isNull(record.targetCellId),
    });
  };

  remove = (flag) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, scope: 'route', type: 'dumpStations' },
    }).then((result) => {
      this.context.removeDumpFunction(result);
      this.context.refresh();
    });
  };

  formatDataSource = (dumpStations = []) => {
    return dumpStations.map((item, index) => ({
      ...item,
      key: index,
    }));
  };

  render() {
    const { showForm, choice, flag } = this.state;
    const { dumpStations, selectCellIds } = this.props;
    if (showForm) {
      return (
        <Row style={{ margin: '20px 10px' }}>
          {/* 返回 */}
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
              {choice !== ''
                ? formatMessage({ id: 'app.dump.update' })
                : formatMessage({ id: 'app.dump.add' })}
            </Divider>
          </div>
          <Form ref={this.formRef} onValuesChange={this.onValuesChange} style={{ width: '100%' }}>
            <Form.Item hidden name={'flag'} initialValue={flag} />

            {/* 抛物点名称 */}
            <Form.Item
              {...formLayout}
              label={formatMessage({ id: 'app.selectScopeMap.name' })}
              name={'name'}
              initialValue={choice.name}
            >
              <Input />
            </Form.Item>

            {/* 第一个基准点, 适用于抛物点在点位上 */}
            <Form.Item
              {...formLayout}
              name={'baseCell'}
              initialValue={choice.cellId}
              label={formatMessage({ id: 'app.dump.base' })}
            >
              <ButtonInput
                type="number"
                data={selectCellIds[0]}
                btnDisabled={selectCellIds.length !== 1}
              />
            </Form.Item>

            {/* 第二个基准点, 适用于抛物点在线条上 */}
            <Form.Item
              {...formLayout}
              name={'targetCell'}
              initialValue={choice.targetCellId}
              label={formatMessage({ id: 'app.dump.target' })}
            >
              <ButtonInput
                type="number"
                data={selectCellIds[0]}
                btnDisabled={selectCellIds.length !== 1}
              />
            </Form.Item>

            {/* 小车在第一个基准点的方向，如果存在第二个基准点就不需要输入 */}
            {this.state.showAgvDirection && (
              <Form.Item
                {...formLayout}
                name={'agvDirection'}
                label={formatMessage({ id: 'app.dump.agvDirection' })}
                initialValue={choice.agvDirection}
              >
                <AngleSelector getAngle />
              </Form.Item>
            )}

            {/* 相对于第一个基准点的偏移距离，与小车方向互斥 */}
            {!this.state.showAgvDirection && (
              <Form.Item
                {...formLayout}
                name={'dumpDistance'}
                initialValue={choice.distance ?? 0}
                label={formatMessage({ id: 'app.dump.distance' })}
              >
                <Input suffix={'mm'} style={{ width: '60%' }} />
              </Form.Item>
            )}

            {/* 显示最终的抛物点坐标，不可手动输入，由上方输入换算 */}
            <Form.Item {...formLayout} label={formatMessage({ id: 'app.dump.dump' })}>
              <Row gutter={4} style={{ width: '100%' }}>
                <Col span={8}>
                  <Form.Item noStyle name={'dumpX'} initialValue={choice.x}>
                    <Input prefix={'x'} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item noStyle name={'dumpY'} initialValue={choice.y}>
                    <Input prefix={'y'} disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {/* 抛物框 */}
            <Form.List name="dumpBasket" initialValue={choice.dumpBasket || []}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        marginBottom: '20px',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #e0dcdc',
                      }}
                    >
                      <Row type={'flex'} justify={'end'} style={{ marginBottom: 10 }}>
                        <Button type="danger" icon={MenuIcon.delete} onClick={() => remove(name)} />
                      </Row>
                      <div style={{ width: '100%' }}>
                        {/* 抛物框相对于抛物点角度 */}
                        <Form.Item
                          {...formLayout2}
                          {...restField}
                          name={[name, 'direction']}
                          fieldKey={[fieldKey, 'direction']}
                          label={formatMessage({ id: 'app.selectDirAngle.direction' })}
                        >
                          <AngleSelector getAngle />
                        </Form.Item>

                        {/* 抛物框名称 */}
                        <Form.Item
                          {...formLayout2}
                          {...restField}
                          name={[name, 'key']}
                          fieldKey={[fieldKey, 'key']}
                          label={formatMessage({ id: 'app.selectScopeMap.name' })}
                        >
                          <Input style={{ width: '60%' }} />
                        </Form.Item>

                        {/* 抛物框相对于抛物点距离 */}
                        <Form.Item
                          {...formLayout2}
                          {...restField}
                          initialValue={1000}
                          name={[name, 'distance']}
                          fieldKey={[fieldKey, 'distance']}
                          label={formatMessage({ id: 'app.dump.dumpDistance' })}
                        >
                          <Input suffix={'mm'} style={{ width: '60%' }} />
                        </Form.Item>

                        {/* 抛物速度 */}
                        <Form.Item
                          {...formLayout2}
                          {...restField}
                          name={[name, 'speed']}
                          fieldKey={[fieldKey, 'speed']}
                          label={formatMessage({ id: 'app.dump.dumpSpeed' })}
                        >
                          <Input suffix={'rpm'} style={{ width: '60%' }} />
                        </Form.Item>
                      </div>
                    </div>
                  ))}
                  <Form.Item>
                    <Button block type="dashed" onClick={() => add()} icon={MenuIcon.plus}>
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
      <Row style={{ margin: '20px 10px' }}>
        <Row style={{ width: '100%' }}>
          <Col span={12}>
            <h3>
              <FormattedMessage id="app.dump.list" />
            </h3>
          </Col>
          <Col style={{ textAlign: 'end' }} span={12}>
            <Button
              size="small"
              icon={MenuIcon.plus}
              type="primary"
              onClick={() => {
                this.setState({ choice: '', showForm: true, flag: dumpStations.length + 1 });
              }}
            >
              <FormattedMessage id="app.workStationMap.add" />
            </Button>
          </Col>
        </Row>
        <Table
          bordered
          pagination={false}
          dataSource={this.formatDataSource(dumpStations)}
          columns={this.dumpListColumn}
          expandable={{
            expandedRowRender: (record) => this.expandedRowRender(record.dumpBasket),
          }}
          scroll={{ x: 'max-content' }}
        />
      </Row>
    );
  }
}
export default connect(({ editor }) => {
  const { currentMap, selectCells } = editor;
  const currentLogicAreaData = getCurrentLogicAreaData();
  const dumpStations = currentLogicAreaData?.dumpStations ?? [];
  return { dumpStations, selectCellIds: selectCells, cellMap: currentMap.cellMap };
})(DumpFunction);
