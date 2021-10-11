import React, { PureComponent } from 'react';
import { Row, Col, Card } from 'antd';
import intl from 'react-intl-universal';
import MapEditContext from '../../MapEditContext';
import LineButton from '../LineButton';

/**
 * 0 左上; 1 右上; 2 右下; 3 左下
 */
const CenterStyle = { textAlign: 'center' };
class BatchSetCurve extends PureComponent {
  static contextType = MapEditContext;

  onChange = ({ dir, value }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'editor/generateCostCurve',
      payload: { dir, value },
    }).then((result) => {
      this.context.updateLines({ type: result.cost === -1 ? 'remove' : 'add', payload: [result] });
    });
  };

  render() {
    return (
      <Row type="flex" gutter={8} style={{ paddingTop: '20px' }}>
        <Col span={12} style={{ height: '300px' }}>
          <Card
            title={intl.formatMessage({ id: 'app.batchSetLine.curveIn' })}
            headStyle={CenterStyle}
            bodyStyle={CenterStyle}
          >
            <LineButton
              onChange={(value) => {
                this.onChange({ dir: 'IN', value });
              }}
            />
          </Card>
        </Col>
        <Col span={12} style={{ height: '300px' }}>
          <Card
            title={intl.formatMessage({ id: 'app.batchSetLine.curveOut' })}
            headStyle={CenterStyle}
            bodyStyle={CenterStyle}
          >
            <LineButton
              onChange={(value) => {
                this.onChange({ dir: 'OUT', value });
              }}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}
export default BatchSetCurve;
