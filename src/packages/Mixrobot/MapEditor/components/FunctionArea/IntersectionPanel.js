import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Input, Switch, Table, Form, Checkbox, Row, Divider, Col, Button } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import InputComponent from '@/pages/MapTool/components/MapForm/MapInput';
import { getCurrentLogicAreaData, covertIntersectionFormData2Param } from '@/utils/mapUtils';
import Dictionary from '@/utils/Dictionary';
import MapContext from '../MapContext';
import MenuIcon from '@/utils/MenuIcon';

const FormLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };
const NoLabelFormLayout = { wrapperCol: { offset: 5, span: 19 } };

@connect(({ editor }) => {
  const currentLogicAreaData = getCurrentLogicAreaData();
  const intersectionList = currentLogicAreaData?.intersectionList ?? [];
  return {
    intersectionList,
    selectCellIds: editor.selectCells,
  };
})
class Intersection extends Component {
  static contextType = MapContext;

  formRef = React.createRef();

  state = {
    flag: 0,
    isMultiDirection: false,

    showForm: false,
    choice: '',
  };

  componentDidMount() {
    const { choice } = this.state;
    if (choice) {
      this.setState({ isMultiDirection: choice.list.length > 1 });
    }
  }

  editItem = (record, index) => {
    const { ip } = record;
    let isMultiDirection = false;
    if (Array.isArray(ip)) {
      isMultiDirection = ip.length > 1;
    }
    this.setState({
      isMultiDirection,
      choice: record,
      showForm: true,
      flag: index,
    });
  };

  changeIsMultiDirection = (ev) => {
    this.setState({ isMultiDirection: ev.target.checked });
  };

  intersectionListColumns = [
    {
      // 点位
      title: formatMessage({ id: 'app.inersection.cell' }),
      align: 'center',
      width: 100,
      dataIndex: 'cellId',
    },
    {
      // IP
      title: formatMessage({ id: 'app.inersection.ip' }),
      align: 'center',
      dataIndex: 'ip',
      render: (value) => {
        if (Array.isArray(value) && value.length > 0) {
          return (
            <>
              {value.map((record, index) => (
                <div key={index}>{`${formatMessage({
                  id: `${Dictionary('agvDirection2', [record.direction])}`,
                })}: ${record.value}`}</div>
              ))}
            </>
          );
        }
        return null;
      },
    },
    {
      // 操作
      title: formatMessage({ id: 'app.workStationMap.operation' }),
      align: 'center',
      width: 120,
      render: (text, record, index) => {
        return (
          <div>
            <span
              key="edit"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.editItem(record, index + 1);
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

  onValuesChange = (changedValues, allValues) => {
    const { dispatch } = this.props;
    const currentIntersection = covertIntersectionFormData2Param(allValues);
    currentIntersection.flag = allValues.flag;

    dispatch({
      type: 'editor/updateFunction',
      payload: { scope: 'logic', type: 'intersectionList', data: currentIntersection },
    }).then((result) => {
      if (result.type === 'add') {
        this.context.renderIntersection([result.payload]);
      }
      if (result.type === 'update') {
        const { pre, current } = result;
        this.context.removeIntersection(pre);
        this.context.renderIntersection([current]);
      }
      this.context.refresh();
    });
  };

  remove = (flag) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, type: 'intersectionList', scope: 'logic' },
    }).then((result) => {
      this.context.removeIntersection(result);
      this.context.refresh();
    });
  };

  render() {
    const { showForm, flag, choice, isMultiDirection } = this.state;
    const { intersectionList, selectCellIds } = this.props;

    const ipInputValue = {};
    if (choice) {
      choice?.ip?.forEach(({ direction, value }) => {
        ipInputValue[`ip${direction}`] = value;
      });
    }
    if (showForm) {
      return (
        <Row style={{ margin: '20px 10px' }}>
          <div style={{ width: '100%' }}>
            <Divider orientation="left">
              {choice !== ''
                ? formatMessage({ id: 'app.inersection.update' })
                : formatMessage({ id: 'app.inersection.add' })}
            </Divider>
          </div>

          <Form ref={this.formRef} onValuesChange={this.onValuesChange} style={{ width: '100%' }}>
            <Form.Item hidden name={'flag'} initialValue={flag} />

            {/* 点位 */}
            <Form.Item {...NoLabelFormLayout}>
              <Checkbox onChange={this.changeIsMultiDirection} checked={isMultiDirection}>
                <FormattedMessage id="app.inersection.multiDirection" />
              </Checkbox>
            </Form.Item>
            <Form.Item
              {...FormLayout}
              name={'cellId'}
              initialValue={choice.cellId}
              label={formatMessage({ id: 'app.inersection.cell' })}
            >
              <InputComponent
                currentCellId={selectCellIds}
                btnDisabled={selectCellIds.length > 1}
                icon={<img style={{ width: 25 }} src={require('@/../public/intersection.png')} />}
              />
            </Form.Item>
            <Form.Item
              {...FormLayout}
              name={'isTrafficCell'}
              initialValue={choice.isTrafficCell}
              valuePropName={'checked'}
              label={formatMessage({ id: 'app.inersection.trafficCell' })}
            >
              <Switch />
            </Form.Item>

            {/* IP */}
            {isMultiDirection ? (
              <>
                <Divider orientation="left">IP</Divider>
                <Form.Item
                  {...FormLayout}
                  name={'ip0'}
                  initialValue={ipInputValue.ip0}
                  label={<FormattedMessage id="app.inersection.ip0" />}
                >
                  <Input style={{ width: '100%' }} allowClear />
                </Form.Item>

                <Form.Item
                  {...FormLayout}
                  name={'ip1'}
                  initialValue={ipInputValue.ip90}
                  label={<FormattedMessage id="app.inersection.ip1" />}
                >
                  <Input style={{ width: '100%' }} allowClear />
                </Form.Item>

                <Form.Item
                  {...FormLayout}
                  name={'ip2'}
                  initialValue={ipInputValue.ip180}
                  label={<FormattedMessage id="app.inersection.ip2" />}
                >
                  <Input style={{ width: '100%' }} allowClear />
                </Form.Item>

                <Form.Item
                  {...FormLayout}
                  name={'ip3'}
                  initialValue={ipInputValue.ip270}
                  label={<FormattedMessage id="app.inersection.ip3" />}
                >
                  <Input style={{ width: '100%' }} allowClear />
                </Form.Item>
              </>
            ) : (
              <Form.Item
                {...FormLayout}
                name={'ip'}
                initialValue={ipInputValue.ip0}
                label={<FormattedMessage id="app.inersection.ip" />}
              >
                <Input style={{ width: '100%' }} allowClear />
              </Form.Item>
            )}

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
              <FormattedMessage id="app.inersection.list" />
            </h3>
          </Col>
          <Col style={{ textAlign: 'end' }} span={12}>
            <Button
              size="small"
              icon={MenuIcon.plus}
              type="primary"
              onClick={() => {
                this.setState({ choice: '', showForm: true, flag: intersectionList.length + 1 });
              }}
            >
              <FormattedMessage id="app.workStationMap.add" />
            </Button>
          </Col>
        </Row>
        <Table
          bordered
          pagination={false}
          dataSource={intersectionList}
          columns={this.intersectionListColumns}
        />
      </Row>
    );
  }
}
export default Intersection;
