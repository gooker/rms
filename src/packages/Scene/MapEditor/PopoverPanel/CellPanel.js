import React, { memo, useState } from 'react';
import { Button, Col, Row } from 'antd';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import {
  CodeOutlined,
  DragOutlined,
  LineHeightOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { formatMessage, isNull } from '@/utils/util';
import BatchAddCells from './BatchAddCells';
import GenerateCellCode from './GenerateCellCode';
import MoveCell from './MoveCell';
import AdjustCellSpace from './AdjustCellSpace';
import styles from '../../popoverPanel.module.less';
import commonStyles from '@/common.module.less';

const ButtonStyle = { width: 120, height: 50, borderRadius: 5 };

const CellPanel = (props) => {
  const { dispatch, height, currentMap, mapContext } = props;

  const [formCategory, setFormCategory] = useState(null);
  const [secondTitle, setSecondTitle] = useState(null);

  function renderFormContent() {
    switch (formCategory) {
      case 'batchAdd':
        return <BatchAddCells />;
      case 'cellCode':
        return <GenerateCellCode />;
      case 'moveCell':
        return <MoveCell />;
      case 'adjustSpace':
        return <AdjustCellSpace />;
      default:
        return null;
    }
  }

  function addControl() {}

  function cancelControl() {
    dispatch({ type: 'editor/cancelControlFunction' }).then((result) => {
      mapContext.updateCells({ type: 'cancelControl', payload: result });
    });
  }

  return (
    <div style={{ height }} className={commonStyles.categoryPanel}>
      <div>
        {!isNull(formCategory) ? (
          <LeftOutlined
            style={{ cursor: 'pointer', marginRight: 5 }}
            onClick={() => {
              setFormCategory(null);
              setSecondTitle(null);
            }}
          />
        ) : null}
        <FormattedMessage id={'app.map.cell'} />
        {!isNull(formCategory) ? <RightOutlined style={{ fontSize: 16, margin: '0 5px' }} /> : null}
        <span style={{ fontSize: 15, fontWeight: 500 }}>{secondTitle}</span>
      </div>
      <div>
        {!isNull(formCategory) ? (
          renderFormContent()
        ) : (
          <>
            <div className={styles.panelBlock}>
              <div />
              <Row gutter={[10, 10]}>
                {/* 批量添加 */}
                <Col span={12}>
                  <Button
                    style={ButtonStyle}
                    disabled={currentMap == null}
                    onClick={() => {
                      setFormCategory('batchAdd');
                      setSecondTitle(formatMessage({ id: 'editor.cell.batchAdd' }));
                    }}
                  >
                    <PlusCircleOutlined /> <FormattedMessage id="editor.cell.batchAdd" />
                  </Button>
                </Col>

                {/* 批量添加 */}
                <Col span={12}>
                  <Button
                    style={ButtonStyle}
                    disabled={currentMap == null}
                    onClick={() => {
                      setFormCategory('batchAdd');
                      setSecondTitle(formatMessage({ id: 'editor.cell.batchAdd' }));
                    }}
                  >
                    <PlusCircleOutlined /> <FormattedMessage id="editor.cell.batchAdd" />
                  </Button>
                </Col>

                {/* 删除点位 */}
                <Col span={12}>
                  <Button
                    style={ButtonStyle}
                    disabled={currentMap == null}
                    onClick={() => {
                      dispatch({ type: 'editor/batchDeleteCells' }).then(({ cell, line }) => {
                        mapContext.updateCells({ type: 'remove', payload: cell });
                        mapContext.updateLines({ type: 'remove', payload: line });
                      });
                    }}
                  >
                    <MinusCircleOutlined /> <FormattedMessage id="editor.cell.delete" />
                  </Button>
                </Col>

                {/* 地址码 */}
                <Col span={12}>
                  <Button
                    style={ButtonStyle}
                    disabled={currentMap == null}
                    onClick={() => {
                      setFormCategory('cellCode');
                      setSecondTitle(formatMessage({ id: 'editor.cell.code' }));
                    }}
                  >
                    <CodeOutlined /> <FormattedMessage id="editor.cell.code" />
                  </Button>
                </Col>

                {/* 移动点位 */}
                <Col span={12}>
                  <Button
                    style={ButtonStyle}
                    disabled={currentMap == null}
                    onClick={() => {
                      setFormCategory('moveCell');
                      setSecondTitle(formatMessage({ id: 'editor.cell.move' }));
                    }}
                  >
                    <DragOutlined /> <FormattedMessage id="editor.cell.move" />
                  </Button>
                </Col>

                {/* 调整码间距 */}
                <Col span={12}>
                  <Button
                    style={ButtonStyle}
                    disabled={currentMap == null}
                    onClick={() => {
                      setFormCategory('adjustSpace');
                      setSecondTitle(formatMessage({ id: 'editor.cell.adjustSpace' }));
                    }}
                  >
                    <LineHeightOutlined /> <FormattedMessage id="editor.cell.adjustSpace" />
                  </Button>
                </Col>
              </Row>
            </div>

            {/* 导航点操作栏 */}
            <div style={{ marginTop: 15 }} className={styles.panelBlock}>
              <div>
                <FormattedMessage id={'app.map.navigationCell'} />
              </div>
              <div>
                <Row gutter={[10, 10]}>
                  {/* 新增导航点*/}
                  <Col span={12}>
                    <Button
                      style={ButtonStyle}
                      disabled={currentMap == null}
                      onClick={() => {
                        setFormCategory('batchAdd');
                        setSecondTitle(formatMessage({ id: 'editor.cell.batchAdd' }));
                      }}
                    >
                      <PlusCircleOutlined /> <FormattedMessage id="editor.cell.batchAdd" />
                    </Button>
                  </Col>

                  {/* 删除导航点*/}
                  <Col span={12}>
                    <Button
                      style={ButtonStyle}
                      disabled={currentMap == null}
                      onClick={() => {
                        setFormCategory('batchAdd');
                        setSecondTitle(formatMessage({ id: 'editor.cell.batchAdd' }));
                      }}
                    >
                      <PlusCircleOutlined /> <FormattedMessage id="editor.cell.batchAdd" />
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>

            {/* 管控点操作栏 */}
            <div style={{ marginTop: 15 }} className={styles.panelBlock}>
              <div>
                <FormattedMessage id={'app.map.controlCell'} />
              </div>
              <div>
                <Row gutter={[10, 10]}>
                  <Col span={12}>
                    {/* 添加管控点 */}
                    <Button style={ButtonStyle} onClick={addControl}>
                      <PlusCircleOutlined /> <FormattedMessage id="editor.cell.addControl" />
                    </Button>
                  </Col>
                  <Col span={12}>
                    {/* 取消管控点 */}
                    <Button style={ButtonStyle} onClick={cancelControl}>
                      <PlusCircleOutlined /> <FormattedMessage id="editor.cell.cancelControl" />
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>

            <div style={{ marginTop: 15 }} className={styles.panelBlock}>
              <div>
                <FormattedMessage id={'editor.cell.batchSelection'} />
              </div>
              <Row gutter={[10, 10]}>
                {/* 横向选择 */}
                <Col span={12}>
                  <Button
                    style={ButtonStyle}
                    disabled={currentMap == null}
                    onClick={() => {
                      mapContext.batchSelectCellByDirection('y');
                    }}
                  >
                    <ColumnWidthOutlined />{' '}
                    <FormattedMessage id="editor.cell.horizontalSelection" />
                  </Button>
                </Col>

                {/* 纵向选择 */}
                <Col span={12}>
                  <Button
                    style={ButtonStyle}
                    disabled={currentMap == null}
                    onClick={() => {
                      mapContext.batchSelectCellByDirection('x');
                    }}
                  >
                    <ColumnHeightOutlined /> <FormattedMessage id="editor.cell.verticalSelection" />
                  </Button>
                </Col>
              </Row>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default connect(({ editor }) => ({
  currentMap: editor.currentMap,
  mapContext: editor.mapContext,
}))(memo(CellPanel));
