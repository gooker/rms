import React, { memo } from 'react';
import { Divider, Form, Checkbox, Radio, Switch, Select } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, getFormLayout } from '@/utils/util';
import { CostOptions, DirectionOption } from '../enums';
import styles from '../../../XIHE/popoverPanel.module.less';
import commonStyles from '@/common.module.less';

const { formItemLayout } = getFormLayout(7, 17);
const ViewControllerPanel = (props) => {
  const { dispatch, height, mapContext, shownPriority } = props;

  function radioGroupChange(ev) {
    const changedMapMode = ev.target.value;
    dispatch({
      type: 'editor/saveState',
      payload: { mapMode: changedMapMode },
    });
    mapContext.changeMapMode(changedMapMode);
  }

  function switchShowBlock(hideBlock) {
    dispatch({
      type: 'editor/saveState',
      payload: { hideBlock },
    });
    mapContext.switchShowBlock(hideBlock);
  }

  function switchCoordShown(value) {
    dispatch({
      type: 'editor/saveState',
      payload: { showCoordinate: value },
    });
    mapContext.switchCoordinationShown(value, false);
  }

  function switchDistanceShown(value) {
    dispatch({
      type: 'editor/saveState',
      payload: { showDistance: value },
    });
    mapContext.switchDistanceShown(value, false);
  }

  function switchBackImgShown(value) {
    dispatch({
      type: 'editor/saveState',
      payload: { showBackImg: value },
    });
    mapContext.switchBackImgShown(value);
  }

  function showPriority(value) {
    dispatch({
      type: 'editor/saveState',
      payload: { shownPriority: value },
    });
    mapContext.filterRelations(value);
  }

  function filterRelationDir(value) {
    dispatch({
      type: 'editor/saveState',
      payload: { showRelationsDir: value },
    });
    mapContext.filterRelationDir(value);
  }

  function filterRelationsByCells(value) {
    dispatch({
      type: 'editor/saveState',
      payload: { showRelationsCells: value },
    });
    mapContext.filterRelationCell(value);
  }

  return (
    <div style={{ height, width: 350 }} className={commonStyles.categoryPanel}>
      <div>
        <FormattedMessage id={'app.map.view'} />
      </div>
      <div>
        <div className={styles.panelBlock}>
          <Form labelWrap>
            {/* 模式切换 */}
            <Form.Item
              {...formItemLayout}
              label={<FormattedMessage id={'editor.view.mapViewMode'} />}
            >
              <Radio.Group
                buttonStyle="solid"
                value={props.mapMode}
                onChange={(ev) => radioGroupChange(ev)}
              >
                <Radio.Button value="standard">
                  <FormattedMessage id="editor.view.mapViewMode.standard" />
                  {/* 标准 */}
                </Radio.Button>
                <Radio.Button value="scaled">
                  <FormattedMessage id="editor.view.mapViewMode.scaled" />
                  {/* 大图 */}
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {/* 隐藏不可走点 */}
            <Form.Item
              {...formItemLayout}
              label={<FormattedMessage id={'editor.view.hideBlock'} />}
            >
              <Switch
                checked={props.hideBlock}
                onChange={(ev) => switchShowBlock(ev)}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>

            {/* 坐标显示 */}
            <Form.Item
              {...formItemLayout}
              label={<FormattedMessage id={'editor.view.coordinateDisplay'} />}
            >
              <Switch
                checked={props.showCoordinate}
                onChange={(value) => {
                  switchCoordShown(value);
                }}
              />
            </Form.Item>

            {/* 距离显示 */}
            <Form.Item
              {...formItemLayout}
              label={<FormattedMessage id={'editor.view.distanceDisplay'} />}
            >
              <Switch
                disabled={shownPriority.length === 0}
                checked={props.showDistance}
                onChange={(value) => {
                  switchDistanceShown(value);
                }}
              />
            </Form.Item>

            {/* 背景显示 */}
            <Form.Item
              {...formItemLayout}
              label={<FormattedMessage id={'editor.view.backImgDisplay'} />}
            >
              <Switch
                checked={props.showBackImg}
                onChange={(value) => {
                  switchBackImgShown(value);
                }}
              />
            </Form.Item>

            <Divider />
            {/* 优先级显示 */}
            <Form.Item
              {...formItemLayout}
              label={<FormattedMessage id={'editor.view.priorityDisplay'} />}
            >
              <Checkbox.Group
                value={shownPriority}
                onChange={(value) => {
                  showPriority(value);
                }}
                options={CostOptions.map((item) => ({
                  ...item,
                  label: formatMessage({ id: item.label }),
                }))}
              />
            </Form.Item>

            {/* 方向显示 */}
            <Form.Item
              {...formItemLayout}
              label={<FormattedMessage id={'editor.view.directionShown'} />}
            >
              <Checkbox.Group
                options={DirectionOption.map((item) => ({
                  ...item,
                  label: formatMessage({ id: item.label }),
                }))}
                value={props.showRelationsDir}
                onChange={(value) => {
                  filterRelationDir(value);
                }}
                disabled={shownPriority.length === 0}
              />
            </Form.Item>

            {/* 仅显示相关点 */}
            <Form.Item
              {...formItemLayout}
              label={<FormattedMessage id={'editor.view.showOnlyRelevantPoints'} />}
            >
              <Select
                allowClear
                mode="tags"
                style={{ width: '95%' }}
                value={props.showRelationsCells}
                disabled={shownPriority.length === 0}
                onChange={(value) => filterRelationsByCells(value)}
                notFoundContent={null}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default connect(({ editor, editorView }) => ({
  mapMode: editorView.mapMode,
  hideBlock: editorView.hideBlock,
  showBackImg: editorView.showBackImg,
  showDistance: editorView.showDistance,
  shownPriority: editorView.shownPriority,
  showCoordinate: editorView.showCoordinate,
  showRelationsDir: editorView.showRelationsDir,
  showEmergencyStop: editorView.showEmergencyStop,
  showRelationsCells: editorView.showRelationsCells,
  mapContext: editor.mapContext,
}))(memo(ViewControllerPanel));
