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
import MoveCell from './MoveCell';
import AddNavigation from './AddNavigation';
import BatchAddCells from './BatchAddCells';
import AdjustCellSpace from './AdjustCellSpace';
import GenerateCellCode from './GenerateCellCode';
import styles from '../../popoverPanel.module.less';
import commonStyles from '@/common.module.less';
import { MapSelectableSpriteType } from '@/config/consts';
import DeleteNavigationModal from '@/packages/Scene/MapEditor/components/DeleteNavigationModal';
import { uniq } from 'lodash';

const ButtonStyle = { width: 120, height: 50, borderRadius: 5 };

const CellPanel = (props) => {
  const { dispatch, height, currentMap, mapContext, selections } = props;

  const selectedCells = selections.filter((item) => item.type === MapSelectableSpriteType.CELL);
  const [formCategory, setFormCategory] = useState(null);
  const [secondTitle, setSecondTitle] = useState(null);
  const [deleteNavVisible, setDeleteNavVisible] = useState(false);

  function renderFormContent() {
    switch (formCategory) {
      case 'addSingleNavi':
        return <AddNavigation />;
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

  function addControl() {
    const naviCells = getSelectionNaviCells();
    dispatch({ type: 'editor/addControlFunction', payload: naviCells }).then((result) => {
      mapContext.updateCells({ type: 'addControl', payload: Object.entries(result) });
    });
  }

  function cancelControl() {
    const naviCells = getSelectionNaviCells();
    dispatch({ type: 'editor/cancelControlFunction', payload: naviCells }).then(
      ({ cells, lines }) => {
        mapContext.updateCells({ type: 'cancelControl', payload: Object.entries(cells) });
      },
    );
  }

  /**
   * 删除导航点
   * 1. 如果多个导航点在一个坐标点上，需要用户确认删除哪些类型的导航点，如果是全部删除，那么一并删除所在点位的导航点
   * 2. 如果只要一个导航点，那么导航点和管控点一并删除
   */
  function deleteNavigations() {
    const types = getSelectionNaviCellTypes();
    if (types.length === 0) return;
    if (types.length === 1) {
      executeDeleteNavi(types);
    } else {
      setDeleteNavVisible(true);
    }
  }

  function executeDeleteNavi(types) {
    const naviCells = getSelectionNaviCells();
    dispatch({
      type: 'editor/deleteNavigations',
      payload: { types, naviCells },
    }).then(({ cells, lines }) => {
      mapContext.updateCells({ type: 'remove', payload: Object.entries(cells) });
    });
  }

  function getSelectionNaviCells() {
    // 选中的点位的下层可能还有别的导航点，所以需要把所有符合条件(坐标)的点位筛选出来
    const { xyCellMap } = mapContext;
    const allNaviCells = [];
    selectedCells.forEach(({ x, y }) => {
      const cells = xyCellMap.get(`${x}_${y}`);
      if (Array.isArray(cells)) {
        cells.forEach((item) => {
          allNaviCells.push(item);
        });
      }
    });
    return allNaviCells;
  }

  function getSelectionNaviCellTypes() {
    const types = getSelectionNaviCells().map(({ naviCellType }) => naviCellType);
    return [...new Set(types)];
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
                    onClick={() => {
                      deleteNavigations();
                      // dispatch({ type: 'editor/deleteNavigations' }).then((result) => {
                      //   deleteNavigations(result);
                      // });
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
      <DeleteNavigationModal
        visible={deleteNavVisible}
        types={getSelectionNaviCellTypes()}
        onDelete={executeDeleteNavi}
        onCancel={() => {
          setDeleteNavVisible(false);
        }}
      />
    </div>
  );
};
export default connect(({ editor }) => {
  const { selections, currentMap, mapContext } = editor;
  return { currentMap, mapContext, selections };
})(memo(CellPanel));
