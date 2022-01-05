import React, { memo } from 'react';
import { Button, Col, Row } from 'antd';
import { connect } from '@/utils/dva';
import FormattedMessage from '@/components/FormattedMessage';
import {
  CodeOutlined,
  DragOutlined,
  LineHeightOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
} from '@ant-design/icons';
import editorStyles from '../components/editorLayout.module.less';
import styles from './popoverPanel.module.less';

const ButtonStyle = { width: 120, height: 50, borderRadius: 5 };

const CellPanel = (props) => {
  const { dispatch, height, currentMap } = props;

  return (
    <div style={{ height }} className={editorStyles.categoryPanel}>
      <div>
        <FormattedMessage id={'app.map.cell'} />
      </div>
      <div>
        <div className={styles.panelBlock}>
          <div>
            <FormattedMessage id={'editor.cell.batchOperation'} />
          </div>
          <Row gutter={[10, 10]}>
            {/* 批量添加 */}
            <Col span={12}>
              <Button
                style={ButtonStyle}
                disabled={currentMap == null}
                onClick={() => {
                  dispatch({
                    type: 'editor/updateModalVisit',
                    payload: {
                      type: 'batchAddCellVisible',
                      value: true,
                    },
                  });
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
                    this.context.updateCells({ type: 'remove', payload: cell });
                    this.context.updateLines({ type: 'remove', payload: line });
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
                  dispatch({
                    type: 'editor/updateModalVisit',
                    payload: {
                      type: 'generateCellCode',
                      value: true,
                    },
                  });
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
                  dispatch({
                    type: 'editor/updateModalVisit',
                    payload: {
                      type: 'moveCellVisible',
                      value: true,
                    },
                  });
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
                  dispatch({
                    type: 'editor/updateModalVisit',
                    payload: {
                      type: 'adjustSpaceVisible',
                      value: true,
                    },
                  });
                }}
              >
                <LineHeightOutlined /> <FormattedMessage id="editor.cell.adjustSpace" />
              </Button>
            </Col>
          </Row>
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
                  this.context.batchSelectBaseRow();
                }}
              >
                <ColumnWidthOutlined /> <FormattedMessage id="editor.cell.horizontalSelection" />
              </Button>
            </Col>

            {/* 纵向选择 */}
            <Col span={12}>
              <Button
                style={ButtonStyle}
                disabled={currentMap == null}
                onClick={() => {
                  this.context.batchSelectBaseColumn();
                }}
              >
                <ColumnHeightOutlined /> <FormattedMessage id="editor.cell.verticalSelection" />
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
export default connect(({ editor }) => ({
  currentMap: editor.currentMap,
}))(memo(CellPanel));
