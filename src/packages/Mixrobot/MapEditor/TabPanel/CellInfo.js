import React, { PureComponent } from 'react';
import { connect } from '@/utils/dva';
import { Row, Col, Form, InputNumber, Button } from 'antd';
import { formatMessage } from '@/utils/Lang';
import MapContext from '../MapEdit/component/MapContext';

const FormLayout = { wrapperCol: { span: 16 }, labelCol: { span: 8 } };

@connect(({ editor }) => {
  const cellMap = {};
  const { currentCells, selectCells } = editor;
  currentCells.forEach((cell) => {
    cellMap[cell.id] = { ...cell };
  });
  return { selectCells, cellMap };
})
class CellInfo extends PureComponent {
  static contextType = MapContext;

  formRef = React.createRef();

  componentDidMount() {
    const { cellMap, selectCells } = this.props;
    const { setFieldsValue } = this.formRef.current;
    if (selectCells.length === 1 && Object.keys(cellMap).length > 0) {
      setFieldsValue({ ...cellMap[selectCells[0]] });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { cellMap, selectCells } = nextProps;
    const { resetFields, setFieldsValue } = this.formRef.current;
    if (selectCells.length === 1 && Object.keys(cellMap).length > 0) {
      const activeCell = cellMap[selectCells[0]];
      if (activeCell) {
        setFieldsValue({
          cellId: activeCell.id,
          x: activeCell.x,
          y: activeCell.y,
        });
      }
    } else {
      resetFields();
    }
  }

  submit = () => {
    const { dispatch, selectCells } = this.props;
    const { validateFields } = this.formRef.current;
    validateFields().then((values) => {
      dispatch({
        type: 'editor/changeSingleCellCode',
        payload: { type: selectCells.length === 1 ? 'update' : 'add', ...values },
      }).then((response) => {
        if (response) {
          const { type, payload } = response;
          if (type === 'add') {
            this.context.addCell(payload.id, payload.x, payload.y);
          }
          if (type === 'update') {
            this.context.updateCells({ type: 'code', payload });
          }
        }
      });
    });
  };

  render() {
    const { selectCells } = this.props;
    return (
      <Form ref={this.formRef}>
        <Row>
          <Col span={12}>
            <Form.Item
              {...FormLayout}
              name="x"
              label={formatMessage({ id: 'app.cellInfo.Xcoordinate' })}
              rules={[{ required: true }]}
            >
              <InputNumber disabled={selectCells.length > 0} style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>

          {/* Y坐标 */}
          <Col span={12}>
            <Form.Item
              {...FormLayout}
              name={'y'}
              label={formatMessage({ id: 'app.cellInfo.Ycoordinate' })}
              rules={[{ required: true }]}
            >
              <InputNumber disabled={selectCells.length > 0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        {/* X坐标 */}

        <Row>
          {/* 地址码 */}
          <Col span={12}>
            <Form.Item
              {...FormLayout}
              name={'cellId'}
              label={formatMessage({ id: 'app.cellInfo.addressCode' })}
              rules={[{ required: true }]}
            >
              <InputNumber disabled={selectCells.length > 1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          {/* 修改 &  */}
          <Col span={12} style={{ paddingLeft: 20 }}>
            <Button type="primary" onClick={this.submit} disabled={selectCells.length > 1}>
              {selectCells.length === 1
                ? formatMessage({ id: 'app.cellInfo.update' })
                : formatMessage({ id: 'app.cellMap.add' })}
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default CellInfo;
