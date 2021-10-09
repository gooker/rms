import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Row, Divider, Button, Col, message } from 'antd';
import {
  DragOutlined,
  LineHeightOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
} from '@ant-design/icons';
import MenuIcon from '@/utils/MenuIcon';
import { formatMessage } from '@/utils/utils';
import { getCurrentRouteMapData } from '@/utils/mapUtils';
import IconDir from '@/components/AntdIcon/IconDir';
import LabelComponent from '@/components/LabelComponent';
import FormattedMessage from '@/components/FormattedMessage';
import CheckButton from '@/packages/Mixrobot/components/CheckButton';
import MapContext from '@/packages/Mixrobot/MapEditor/MapEditContext';
import CellInfo from '@/packages/Mixrobot/MapEditor/TabPanel/CellInfo';
import { CellTypeSetting } from '@/packages/Mixrobot/MapEditor/MapEditConst';
import NonStopEditor from '@/packages/Mixrobot/MapEditor/components/NonStopEditor';

@connect(({ editor }) => {
  const { currentMap, selectCells } = editor;
  const currentRouteMapData = getCurrentRouteMapData();
  const blockCellIds = currentRouteMapData?.blockCellIds ?? [];
  return { selectCellIds: selectCells, blockCellIds, currentMap: currentMap || {} };
})
class CellTab extends Component {
  static contextType = MapContext;

  state = {
    nonStopCell: null,
    panelType: 'cellMap',
  };

  // 设置点位类型
  setCellType = ({ type, value }) => {
    const { dispatch } = this.props;
    let scope = 'routeMap'; // 标记该点位类型数据是保存在 logic 级别还是 routeMap 级别
    if (['taskCellIds', 'storeCellIds'].includes(type)) {
      scope = 'logic';
    }
    dispatch({
      type: 'editor/setCellType',
      payload: { type, scope, operation: value },
    }).then((result) => {
      this.context.updateCells({ type: 'type', payload: result });
    });
  };

  // 不可逗留点
  openNonStopEditPanel = () => {
    const { selectCellIds, blockCellIds } = this.props;
    const _blockCellIds = blockCellIds.map((item) => `${item}`);
    if (_blockCellIds.includes(selectCellIds[0])) {
      message.error(
        `[${selectCellIds[0]}]${formatMessage({ id: 'app.mapTool.forbidden.block2nonStop' })}`,
      );
    } else {
      this.setState({
        nonStopCell: selectCellIds[0],
        panelType: 'nonStopEditor',
      });
    }
  };

  deleteNonStopCell = () => {
    const { dispatch, selectCellIds } = this.props;
    dispatch({
      type: 'editor/fetchDeleteNonStopCell',
      payload: selectCellIds.map((item) => parseInt(item, 10)),
    }).then((result) => {
      const { pre, current } = result;
      this.context.renderNonStopCells(pre, 'remove');
      this.context.renderNonStopCells(current);
      this.context.refresh();
    });
  };

  render() {
    const {
      selectCellIds,
      currentMap: { cellMap },
    } = this.props;
    const { panelType, nonStopCell } = this.state;
    return (
      <React.Fragment>
        {panelType === 'cellMap' && (
          <Row style={{ marginTop: 24 }}>
            {/* 信息 */}
            <div style={{ width: '100%' }}>
              <Divider orientation="left">
                <FormattedMessage id="app.cellMap.info" />
              </Divider>
            </div>
            <CellInfo />

            {/* 批量操作 */}
            <div style={{ width: '100%' }}>
              <Divider orientation="left">
                <FormattedMessage id="app.cellMap.batchOperation" />
              </Divider>
            </div>
            <Row style={{ margin: '0px 10px' }}>
              {/* 批量添加 */}
              <Col span={8} style={{ marginTop: 15 }}>
                <Button
                  onClick={() => {
                    const { dispatch } = this.props;
                    dispatch({
                      type: 'editor/updateModalVisit',
                      payload: {
                        type: 'batchAddCellVisible',
                        value: true,
                      },
                    });
                  }}
                  disabled={cellMap == null}
                  style={{ width: 120, height: 50 }}
                  icon={IconDir('iconpiliang')}
                >
                  {' '}
                  <FormattedMessage id="app.cellMap.batchAdd" />
                </Button>
              </Col>
              {/* 删除点位 */}
              <Col span={8} style={{ marginTop: 15 }}>
                <Button
                  disabled={cellMap == null}
                  onClick={() => {
                    const { dispatch } = this.props;
                    dispatch({ type: 'editor/batchDeleteCells' }).then(({ cell, line }) => {
                      this.context.updateCells({ type: 'remove', payload: cell });
                      this.context.updateLines({ type: 'remove', payload: line });
                    });
                  }}
                  style={{ width: 120, height: 50 }}
                  icon={IconDir('iconbatch-del')}
                >
                  {' '}
                  <FormattedMessage id="app.cellMap.deletePoint" />
                </Button>
              </Col>
              {/* 地址码 */}
              <Col span={8} style={{ marginTop: 15 }}>
                <Button
                  onClick={() => {
                    const { dispatch } = this.props;
                    dispatch({
                      type: 'editor/updateModalVisit',
                      payload: {
                        type: 'generateCellCode',
                        value: true,
                      },
                    });
                  }}
                  disabled={cellMap == null}
                  style={{ width: 120, height: 50 }}
                  icon={IconDir('iconcodebianma')}
                >
                  {' '}
                  <FormattedMessage id="app.cellMap.addressCode" />
                </Button>
              </Col>
              {/* 移动点位 */}
              <Col span={8} style={{ marginTop: 15 }}>
                <Button
                  onClick={() => {
                    const { dispatch } = this.props;
                    dispatch({
                      type: 'editor/updateModalVisit',
                      payload: {
                        type: 'moveCellVisible',
                        value: true,
                      },
                    });
                  }}
                  disabled={cellMap == null}
                  style={{ width: 120, height: 50 }}
                >
                  <DragOutlined /> <FormattedMessage id="app.cellMap.movePoint" />
                </Button>
              </Col>
              {/* 调整码间距 */}
              <Col span={8} style={{ marginTop: 15 }}>
                <Button
                  onClick={() => {
                    const { dispatch } = this.props;
                    dispatch({
                      type: 'editor/updateModalVisit',
                      payload: {
                        type: 'adjustSpaceVisible',
                        value: true,
                      },
                    });
                  }}
                  disabled={cellMap == null}
                  style={{ width: 120, height: 50 }}
                >
                  <LineHeightOutlined /> <FormattedMessage id="app.cellMap.adjustSpacing" />
                </Button>
              </Col>
            </Row>

            {/* 批量选择 */}
            <div style={{ width: '100%' }}>
              <Divider orientation="left">
                <FormattedMessage id="app.cellMap.batchSelection" />
              </Divider>
            </div>
            <Row style={{ margin: '0px 10px' }}>
              {/* 横向选择 */}
              <Col span={12}>
                <Button
                  onClick={() => {
                    this.context.batchSelectBaseLine();
                  }}
                  disabled={cellMap == null}
                  style={{ width: 120, height: 50 }}
                >
                  <ColumnWidthOutlined /> <FormattedMessage id="app.cellMap.horizontalSelection" />
                </Button>
              </Col>

              {/* 纵向选择 */}
              <Col span={12}>
                <Button
                  onClick={() => {
                    this.context.batchSelectBaseColumn();
                  }}
                  disabled={cellMap == null}
                  style={{ width: 120, height: 50, marginLeft: 5 }}
                >
                  <ColumnHeightOutlined /> <FormattedMessage id="app.cellMap.verticalSelection" />
                </Button>
              </Col>
            </Row>

            {/* 设置 */}
            <div style={{ width: '100%' }}>
              <Divider orientation="left">
                <FormattedMessage id="app.cellMap.setUp" />
              </Divider>
            </div>
            <div style={{ width: '100%' }}>
              {/* 不可走点、存储点、跟车点、等待点、接任务点 */}
              {CellTypeSetting.map(({ type, picture, i18n }) => (
                <LabelComponent
                  key={type}
                  labelCol={8}
                  valueCol={14}
                  label={
                    <>
                      <img
                        alt={''}
                        style={{
                          height: 20,
                          marginLeft: 15,
                          marginRight: 10,
                        }}
                        src={require(`@/../public/webView/${picture}`)}
                      />
                      <FormattedMessage id={i18n} />
                    </>
                  }
                  value={
                    <CheckButton
                      disabled={selectCellIds.length === 0}
                      onClick={(value) => {
                        this.setCellType({ type, value });
                      }}
                    />
                  }
                />
              ))}

              {/* 不可逗留点 */}
              <LabelComponent
                labelCol={8}
                valueCol={14}
                label={
                  <>
                    <img
                      alt=""
                      style={{
                        height: 20,
                        marginLeft: 15,
                        marginRight: 10,
                      }}
                      src={require('@/../public/webView/non_stop.png')}
                    />
                    <FormattedMessage id="app.cellMap.notStay" />
                  </>
                }
                value={
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      icon={MenuIcon.form}
                      disabled={selectCellIds.length !== 1}
                      onClick={this.openNonStopEditPanel}
                    >
                      {' '}
                      <FormattedMessage id="app.cellMap.edit" />
                    </Button>
                    <Button
                      type="danger"
                      icon={MenuIcon.delete}
                      disabled={selectCellIds.length === 0}
                      onClick={this.deleteNonStopCell}
                    >
                      {' '}
                      <FormattedMessage id="app.cellMap.remove" />
                    </Button>
                  </div>
                }
              />
            </div>
          </Row>
        )}

        {/* 不可逗留点编辑器 */}
        {panelType === 'nonStopEditor' && (
          <NonStopEditor
            cell={nonStopCell}
            back={() => {
              this.setState({ panelType: 'cellMap' });
            }}
          />
        )}
      </React.Fragment>
    );
  }
}
export default CellTab;
