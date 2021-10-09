import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Form, Select, InputNumber, Row, Col, Button } from 'antd';
import MenuIcon from '@/utils/MenuIcon';
import { dealResponse, formatMessage } from '@/utils/utils';
import { fetchAllAgvType } from '@/services/api';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';
import FormattedMessage from '@/components/FormattedMessage';
import SuperMultiSelect from '@/packages/Mixrobot/components/SuperMultiSelect';
import MapEditContext from '@/packages/Mixrobot/MapEditor/MapEditContext';

const doubleFormLayout = { labelCol: { span: 5 }, wrapperCol: { span: 18 } };

class RestCells extends Component {
  static contextType = MapEditContext;

  formRef = React.createRef();

  state = {
    formValue: {},
    allAgvType: [],

    flag: 0,
  };

  async componentDidMount() {
    const response = await fetchAllAgvType();
    let allAgvType = [];
    if (!dealResponse(response)) {
      allAgvType = response;
    }
    this.setState({ allAgvType });
  }

  onValuesChange = (changedValues, allValues) => {
    const { dispatch } = this.props;
    const currentRestArea = [...allValues.restCells];
    dispatch({ type: 'editor/updateRestArea', payload: currentRestArea }).then((result) => {
      const { pre, current } = result;
      this.context.renderRestCells(pre, 'remove');
      this.context.renderRestCells(current, 'add');
      this.context.refresh();
    });
  };

  render() {
    const { selectCellIds, restCells } = this.props;
    const { allAgvType } = this.state;
    return (
      <div style={{ margin: '10px 0px' }}>
        <h3>
          <FormattedMessage id="app.restCells.restArea" />
        </h3>
        <Form ref={this.formRef} onValuesChange={this.onValuesChange}>
          <Form.List name="restCells" initialValue={restCells}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row
                    key={field.key}
                    style={{
                      border: '1px solid #e0dcdc',
                      padding: '25px 10px 0 0',
                      borderRadius: '5px',
                      marginBottom: '20px',
                    }}
                  >
                    <Col span={22}>
                      <Form.Item
                        {...doubleFormLayout}
                        {...field}
                        label={formatMessage({ id: 'app.restCells.restPoint' })}
                        name={[field.name, 'cellIds']}
                        fieldKey={[field.fieldKey, 'cellIds']}
                      >
                        <SuperMultiSelect currentCellId={selectCellIds} style={{ width: '100%' }} />
                      </Form.Item>

                      <Form.Item
                        {...doubleFormLayout}
                        {...field}
                        label={formatMessage({ id: 'app.restCells.carType' })}
                        name={[field.name, 'agvTypes']}
                        fieldKey={[field.fieldKey, 'agvTypes']}
                      >
                        <Select style={{ width: '100%' }} mode="multiple">
                          {allAgvType.map((item) => (
                            <Select.Option key={item} value={item}>
                              {item}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        {...doubleFormLayout}
                        {...field}
                        label={formatMessage({ id: 'app.restCells.priority' })}
                        name={[field.name, 'priority']}
                        fieldKey={[field.fieldKey, 'priority']}
                      >
                        <InputNumber />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button
                        type="danger"
                        icon={MenuIcon.delete}
                        onClick={() => remove(field.name)}
                      />
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
      </div>
    );
  }
}
export default connect(({ editor }) => {
  const { selectCells } = editor;
  const currentLogicAreaData = getCurrentLogicAreaData();
  const restCells = currentLogicAreaData?.restCells ?? [];
  return { restCells, selectCellIds: selectCells };
})(RestCells);
