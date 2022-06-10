import React, { memo, useState } from 'react';
import { Button, Col, Row } from 'antd';
import {
  ColumnHeightOutlined,
  ColumnWidthOutlined,
  DragOutlined,
  LeftOutlined,
  LineHeightOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import MoveCell from './MoveCell';
import AddNavigation from './AddNavigation';
import BatchAddCells from './BatchAddCells';
import AdjustCellSpace from './AdjustCellSpace';
import FormattedMessage from '@/components/FormattedMessage';
import StackCellConfirmModal from '../components/StackCellConfirmModal';
import { connect } from '@/utils/RmsDva';
import { formatMessage, isNull } from '@/utils/util';
import { getSelectionNaviCells, getSelectionNaviCellTypes } from '@/utils/mapUtil';
import commonStyles from '@/common.module.less';
import styles from '../../popoverPanel.module.less';

const ButtonStyle = { width: 120, height: 50, borderRadius: 5 };

const CellPanel = (props) => {
  const { dispatch, height, currentMap, mapContext } = props;

  const [formCategory, setFormCategory] = useState(null);
  const [secondTitle, setSecondTitle] = useState(null);
  const [deleteNavVisible, setDeleteNavVisible] = useState(false);
  const [types, setTypes] = useState([]);

  function renderFormContent() {
    switch (formCategory) {
      case 'addSingleNavi':
        return <AddNavigation />;
      case 'batchAdd':
        return <BatchAddCells />;
      case 'moveCell':
        return <MoveCell />;
      case 'adjustSpace':
        return <AdjustCellSpace />;
      default:
        return null;
    }
  }

  /**
   * 删除导航点
   * 1. 如果多个导航点在一个坐标点上，需要用户确认删除哪些类型的导航点，如果是全部删除，那么一并删除所在点位的导航点
   * 2. 如果只要一个导航点，那么导航点和管控点一并删除
   */
  function deleteNavigations() {
    const selectionsTypes = getSelectionNaviCellTypes();
    if (selectionsTypes.length === 0) return;
    if (selectionsTypes.length === 1) {
      executeDeleteNavi(selectionsTypes);
    } else {
      setDeleteNavVisible(true);
      setTypes(selectionsTypes);
    }
  }

  function executeDeleteNavi(types) {
    const naviCells = getSelectionNaviCells();
    dispatch({
      type: 'editor/deleteNavigations',
      payload: { types, naviCells },
    }).then(({ cells, lines, arrows }) => {
      mapContext.updateCells({ type: 'remove', payload: cells });
      mapContext.updateLines({ type: 'remove', payload: { lines, arrows } });
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
            {/* 导航点操作栏 */}
            <div className={styles.panelBlock}>
              <div>
                <FormattedMessage id={'app.map.navigationCell'} />
              </div>
              <Row gutter={[10, 10]}>
                {/* 批量添加 */}
                <Col span={12}>
                  <Button
                    style={ButtonStyle}
                    disabled={currentMap == null}
                    onClick={() => {
                      setFormCategory('addSingleNavi');
                      setSecondTitle(formatMessage({ id: 'editor.cell.addNavigation' }));
                    }}
                  >
                    <PlusCircleOutlined /> <FormattedMessage id="editor.cell.addNavigation" />
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
                    onClick={deleteNavigations}
                  >
                    <MinusCircleOutlined /> <FormattedMessage id="editor.cell.delete" />
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

            {/* 批量选择工具栏 */}
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

      {/* 批量删除导航点 */}
      <StackCellConfirmModal
        title={<FormattedMessage id={'editor.tip.requireTypeForDeleting'} />}
        types={types}
        visible={deleteNavVisible}
        onConfirm={executeDeleteNavi}
        onCancel={() => {
          setDeleteNavVisible(false);
        }}
      />
    </div>
  );
};
export default connect(({ editor }) => {
  const { currentMap, mapContext } = editor;
  return { currentMap, mapContext };
})(memo(CellPanel));
