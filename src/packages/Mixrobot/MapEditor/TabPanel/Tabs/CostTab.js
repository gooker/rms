import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Row, Col, Button, Radio } from 'antd';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import LineButton from '../LineButton';
import BatchSetCurve from '../BatchSetCurve/BatchSetCurve';
import LineMapSvg from '@/../public/lineMap.svg';
import MapContext from '@/packages/Mixrobot/MapEditor/MapEditContext';

@connect(({ editor }) => ({ selectLines: editor.selectLines }))
class CostTab extends Component {
  static contextType = MapContext;

  state = {
    forceUpdate: true,
    panelType: 'line', // curve: 四分之一圆, bezier: 贝塞尔
  };

  changePanel = (ev) => {
    this.setState({ panelType: ev.target.value });
  };

  deleteLines = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'editor/deleteLines' }).then((result) => {
      this.context.updateLines({ type: 'remove', payload: result });
    });
  };

  createLines = (params) => {
    const { dispatch } = this.props;
    const { forceUpdate } = this.state;
    params.forceUpdate = forceUpdate;
    dispatch({
      type: 'editor/generateCostLines',
      payload: params,
    }).then((result) => {
      // 要删除的
      result.remove.length > 0 &&
        this.context.updateLines({ type: 'remove', payload: result.remove });
      // 要新增的
      result.add.length > 0 && this.context.updateLines({ type: 'add', payload: result.add });
    });
  };

  render() {
    const { selectLines, dispatch } = this.props;
    const { forceUpdate, panelType } = this.state;
    return (
      <React.Fragment>
        {/* 优先级详情 */}
        <Row style={{ flex: '0 10%', padding: '20px 0' }}>
          <Col span={8} style={{ marginBottom: 10 }}>
            {/*  "低优先级" */}
            <ColorExample
              color="#e64a19"
              text={formatMessage({ id: 'app.batchSetLine.lowPriority' })}
            />
          </Col>
          <Col span={8} style={{ marginBottom: 10 }}>
            {/*  "一般优先级"  */}
            <ColorExample
              color="#ffca28"
              text={formatMessage({ id: 'app.batchSetLine.normalPriority' })}
            />
          </Col>
          <Col span={8} style={{ marginBottom: 10 }}>
            {/*  "高优先级"  */}
            <ColorExample
              color="#1976d2"
              text={formatMessage({ id: 'app.batchSetLine.highPriority' })}
            />
          </Col>
          <Col span={8} style={{ marginBottom: 10 }}>
            {/* "最优先级"  */}
            <ColorExample
              color="#388e3c"
              text={formatMessage({ id: 'app.batchSetLine.topPriority' })}
            />
          </Col>
          <Col span={8} style={{ marginBottom: 10 }}>
            {/*  "不可走"  */}
            <ColorExample
              color="#aaaeb1a1"
              text={formatMessage({ id: 'app.batchSetLine.noPass' })}
            />
          </Col>
        </Row>

        {/* 线条类型切换 */}
        <Row style={{ flex: '0 6%' }} type="flex" justify="space-around">
          <Radio.Group defaultValue={panelType} onChange={this.changePanel} buttonStyle="solid">
            <Radio.Button value="line">
              <FormattedMessage id="app.batchSetLine.straightLine" />
              {/* 直线 */}
            </Radio.Button>
            <Radio.Button value="curve">
              <FormattedMessage id="app.batchSetLine.curve" />
              {/* 曲线 */}
            </Radio.Button>
          </Radio.Group>
        </Row>

        {/* 操作区域 */}
        <div style={{ flex: 1, display: 'flex', flexFlow: 'column nowrap' }}>
          {panelType === 'line' && (
            <Row style={{ flex: '0 5% ' }} type="flex" justify="space-around">
              {/* 删除线路 */}
              <Col span={12}>
                <Button
                  size="small"
                  type="danger"
                  disabled={selectLines.length === 0}
                  onClick={this.deleteLines}
                >
                  <FormattedMessage id="app.batchSetLine.deleteLine" />
                </Button>
              </Col>
              {/* 覆盖已有线路 */}
              <Col span={12} style={{ textAlign: 'end' }}>
                {/* <Checkbox
                  checked={forceUpdate}
                  onChange={({ target: { checked } }) => {
                    this.setState({
                      forceUpdate: checked,
                    });
                  }}
                />
                <span style={{ marginLeft: 10 }}>
                  <FormattedMessage id="app.batchSetLine.covereLine" />
                </span> */}
              </Col>
            </Row>
          )}

          {/* 直线 */}
          {panelType === 'line' && (
            <div
              style={{ flex: 1, display: 'flex', flexFlow: 'column nowrap', paddingTop: '20px' }}
            >
              <Row type="flex" justify="center">
                <LineButton
                  onChange={(value) => {
                    this.createLines({ dir: 0, value });
                  }}
                />
              </Row>

              <Row type="flex" justify="space-around">
                <div style={{ margin: '40px 0px', display: 'flex' }}>
                  <Col span={7} style={{ textAlign: 'left' }}>
                    <LineButton
                      onChange={(value) => {
                        this.createLines({ dir: 270, value });
                      }}
                    />
                  </Col>
                  <Col span={10}>
                    <img
                      style={{ width: '100%', zIndex: '-1', opacity: 0.7, margin: '-30px 0px' }}
                      src={LineMapSvg}
                      alt=""
                    />
                  </Col>
                  <Col span={7} style={{ textAlign: 'right' }}>
                    <LineButton
                      onChange={(value) => {
                        this.createLines({ dir: 90, value });
                      }}
                    />
                  </Col>
                </div>
              </Row>

              <Row type="flex" justify="center">
                <LineButton
                  onChange={(value) => {
                    this.createLines({ dir: 180, value });
                  }}
                />
              </Row>
            </div>
          )}

          {/* 曲线 */}
          {panelType === 'curve' && (
            <div style={{ flex: 1 }}>
              <BatchSetCurve dispatch={dispatch} />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}
export default CostTab;

const ColorExample = (props) => {
  const { color, text } = props;
  return (
    <div style={{ display: 'inline-block', lineHeight: '12px' }}>
      <div style={{ display: 'inline-block', background: color, width: 35, height: 18 }} />
      <div style={{ display: 'inline-block', position: 'absolute', marginLeft: 5 }}>{text}</div>
    </div>
  );
};
