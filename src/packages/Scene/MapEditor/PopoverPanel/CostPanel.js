import React, { memo } from 'react';
import { Button, Col, Modal, Row } from 'antd';
import { DeleteOutlined, DragOutlined } from '@ant-design/icons';
import { useMap } from 'ahooks';
import { connect } from '@/utils/RmsDva';
import { getCellSelections } from '@/utils/mapUtil';
import CostConfigure from '../components/CostConfigure';
import CreateDefaultRoute from '../components/CreateDefaultRoute';
import StackCellConfirmModal from '../components/StackCellConfirmModal';
import FormattedMessage from '@/components/FormattedMessage';
import { MapSelectableSpriteType } from '@/config/consts';
import styles from '../../popoverPanel.module.less';
import commonStyles from '@/common.module.less';

const CostPanel = (props) => {
  const { dispatch, height, selectLines, mapContext } = props;

  const [modalMap, { set, setAll }] = useMap([
    ['visible', false],
    ['types', []],
  ]);

  function deleteLines() {
    dispatch({ type: 'editor/deleteLines' }).then((result) => {
      mapContext.updateLines({ type: 'remove', payload: result });
    });
  }

  // 相同导航点类型的点位之间才能创建线条
  function validateBeforeCreatLines(params) {
    const { cells, types } = getCellSelections();
    if (types.length === 0) return;
    if (types.length === 1) {
      createLines(cells, params);
    } else {
      Modal.confirm({});
      setAll([
        ['visible', true],
        ['types', types],
      ]);
    }
  }

  function createLines(cells, params) {
    dispatch({
      type: 'editor/generateCostLines',
      payload: { cells, params },
    }).then(({ remove, add }) => {
      remove.length > 0 &&
        mapContext.updateLines({ type: 'remove', payload: { lines: remove, arrows: remove } });
      add.length > 0 && mapContext.updateLines({ type: 'add', payload: add });
    });
  }

  return (
    <div style={{ height, width: 380 }} className={commonStyles.categoryPanel}>
      <div>
        <FormattedMessage id={'app.map.route'} />
      </div>
      <div>
        <div className={styles.panelBlock}>
          {/* 优先级图例 */}
          <Row gutter={[10, 10]}>
            <Col span={12}>
              {/* 低优先级 */}
              <ColorExample color="#e64a19">
                <FormattedMessage id={'editor.cost.lowPriority'} />
              </ColorExample>
            </Col>
            <Col span={12}>
              {/* 一般优先级 */}
              <ColorExample color="#ffca28">
                <FormattedMessage id={'editor.cost.normalPriority'} />
              </ColorExample>
            </Col>
            <Col span={12}>
              {/* 高优先级 */}
              <ColorExample color="#1976d2">
                <FormattedMessage id={'editor.cost.highPriority'} />
              </ColorExample>
            </Col>
            <Col span={12}>
              {/* 最优先级 */}
              <ColorExample color="#388e3c">
                <FormattedMessage id={'editor.cost.topPriority'} />
              </ColorExample>
            </Col>
            <Col span={12}>
              {/* 不可走 */}
              <ColorExample color="#aaaeb1a1">
                <FormattedMessage id={'editor.cost.noPass'} />
              </ColorExample>
            </Col>
          </Row>

          {/* 操作面板*/}
          <div style={{ marginTop: 15 }} className={styles.routePanel}>
            <Row type="flex" justify="center">
              <Col span={7}>
                <CostConfigure
                  onChange={(value) => {
                    validateBeforeCreatLines({ dir: 90, value });
                  }}
                />
              </Col>
            </Row>

            <Row type="flex" justify="space-around">
              <Col span={7} style={{ textAlign: 'left' }}>
                <CostConfigure
                  onChange={(value) => {
                    validateBeforeCreatLines({ dir: 180, value });
                  }}
                />
              </Col>
              <Col span={10} className={styles.costConfigureArrow}>
                <DragOutlined />
              </Col>
              <Col span={7} style={{ textAlign: 'right' }}>
                <CostConfigure
                  onChange={(value) => {
                    validateBeforeCreatLines({ dir: 0, value });
                  }}
                />
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span={7}>
                <CostConfigure
                  onChange={(value) => {
                    validateBeforeCreatLines({ dir: 270, value });
                  }}
                />
              </Col>
            </Row>
          </div>
        </div>
        <Row className={styles.panelBlockBase} style={{ marginTop: 10, padding: '10px 10px' }}>
          <Col span={8}>
            <Button
              danger
              size="small"
              style={{ width: '100%', height: 50, borderRadius: 5 }}
              onClick={deleteLines}
              disabled={selectLines.length === 0}
            >
              <DeleteOutlined /> <FormattedMessage id="editor.cost.delete" />
            </Button>
          </Col>
        </Row>
        <CreateDefaultRoute style={{ marginTop: 10, padding: '10px 15px' }} />
      </div>

      {/* 批量删除导航点 */}
      <StackCellConfirmModal
        title={<FormattedMessage id={'editor.tip.requireTypeForDeleting'} />}
        types={modalMap.get('types')}
        visible={modalMap.get('visible')}
        onConfirm={createLines}
        onCancel={() => {
          set('visible', false);
        }}
      />
    </div>
  );
};
export default connect(({ editor }) => {
  const { selections, mapContext } = editor;
  const selectLines = selections.filter((item) => item.type === MapSelectableSpriteType.ROUTE);
  return { mapContext, selectLines };
})(memo(CostPanel));

const ColorExample = (props) => {
  const { color, children } = props;
  return (
    <div style={{ display: 'inline-block', lineHeight: '12px' }}>
      <div style={{ display: 'inline-block', background: color, width: 35, height: 18 }} />
      <div style={{ display: 'inline-block', position: 'absolute', marginLeft: 5 }}>{children}</div>
    </div>
  );
};
