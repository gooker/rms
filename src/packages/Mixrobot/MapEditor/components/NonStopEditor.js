import React, { PureComponent } from 'react';
import { Button, Card, Form, Row, Col, Table, Tag } from 'antd';
import { findIndex } from 'lodash';
import { connect } from '@/utils/dva';
import MenuIcon from '@/utils/MenuIcon';
import { formatMessage } from '@/utils/utils';
import { getCurrentRouteMapData } from '@/utils/mapUtils';
import FormattedMessage from '@/components/FormattedMessage';
import MapContext from '@/packages/Mixrobot/MapEditor/MapEditContext';
import ButtonInput from '@/packages/Mixrobot/components/ButtonInput/ButtonInput';

const FormItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const FormItemLayoutNoLabel = { wrapperCol: { offset: 6, span: 18 } };

@connect(({ editor }) => {
  const { selectCells } = editor;
  const currentRouteMapData = getCurrentRouteMapData();
  return {
    selectCellIds: selectCells,
    blockCellIds: currentRouteMapData.blockCellIds || [],
    nonStopCellIds: currentRouteMapData.nonStopCellIds || [],
  };
})
class NonStopEditor extends PureComponent {
  static contextType = MapContext;

  formRef = React.createRef();

  column = [
    {
      title: formatMessage({ id: 'app.cellMap.notStay' }),
      align: 'center',
      width: 110,
      dataIndex: 'nonStopCell',
    },
    {
      title: formatMessage({ id: 'app.dump.target' }),
      align: 'center',
      dataIndex: 'cellIds',
      render: (text) => text.map((item, index) => <Tag key={index}>{item}</Tag>),
    },
    {
      title: formatMessage({ id: 'app.monitorOperation.operations' }),
      align: 'center',
      width: 80,
      render: (text, record, index) => (
        <a
          onClick={() => {
            this.deleteNonStopCellId(index);
          }}
        >
          <FormattedMessage id="form.delete" />
        </a>
      ),
    },
  ];

  addNonStopCellId = () => {
    const { cell, dispatch, nonStopCellIds } = this.props;
    const { validateFields } = this.formRef.current;
    validateFields().then((value) => {
      const cellIds = value.cellIds.map((item) => parseInt(item, 10));
      const newNonStopCell = { nonStopCell: parseInt(cell, 10), cellIds };
      const newNonStopCellIds = [...nonStopCellIds, newNonStopCell];
      dispatch({
        type: 'editor/updateNonStopCells',
        payload: newNonStopCellIds,
      }).then((result) => {
        const { pre, current } = result;
        this.context.renderNonStopCells(pre, 'remove');
        this.context.renderNonStopCells(current);
        this.context.refresh();
      });
    });
  };

  deleteNonStopCellId = (flag) => {
    const { dispatch, nonStopCellIds } = this.props;
    const newNonStopCellIds = [...nonStopCellIds];
    newNonStopCellIds.splice(flag, 1);
    dispatch({
      type: 'editor/updateNonStopCells',
      payload: newNonStopCellIds,
    }).then((result) => {
      const { pre, current } = result;
      this.context.renderNonStopCells(pre, 'remove');
      this.context.renderNonStopCells(current);
      this.context.refresh();
    });
  };

  render() {
    const { cell, back, nonStopCellIds, selectCellIds } = this.props;
    // 判断 cell 是否已经在nonStopCellIds中存在
    const existFlag = findIndex(nonStopCellIds, { nonStopCell: parseInt(cell, 10) });
    return (
      <>
        <Card title="设置不可逗留点" style={{ marginTop: 40, marginBottom: 20 }}>
          <Form ref={this.formRef}>
            <Form.Item {...FormItemLayout} label={formatMessage({ id: 'app.cellMap.notStay' })}>
              {cell}
              {existFlag > -1 && <span style={{ color: 'red' }}>（已存在）</span>}
            </Form.Item>
            <Form.Item
              {...FormItemLayout}
              label={formatMessage({ id: 'app.dump.target' })}
              name={'cellIds'}
              initialValue={[]}
              rules={[{ required: true, message: '选择目标点' }]}
            >
              <ButtonInput
                multi={true}
                data={selectCellIds}
                btnDisabled={selectCellIds.length === 0}
              />
            </Form.Item>

            <Form.Item {...FormItemLayoutNoLabel}>
              <Row type="flex" gutter={20}>
                <Col>
                  <Button type="primary" onClick={this.addNonStopCellId} disabled={existFlag > -1}>
                    <FormattedMessage id="app.common.confirm" />
                  </Button>
                </Col>
                <Col>
                  <Button icon={MenuIcon.rollback} onClick={back}>
                    <FormattedMessage id="app.chargeManger.return" />
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Card>
        <Table bordered pagination={false} columns={this.column} dataSource={nonStopCellIds} />
      </>
    );
  }
}
export default NonStopEditor;
