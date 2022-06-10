import React, { memo } from 'react';
import { Checkbox, Col, Form, Row, Select, Switch } from 'antd';
import { connect } from '@/utils/RmsDva';
import { getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import CostCheckBox from '@/packages/Scene/components/CostCheckBox';
import { DirectionOption } from '../editorEnums';
import styles from '../../popoverPanel.module.less';
import commonStyles from '@/common.module.less';

const { formItemLayout } = getFormLayout(7, 17);
const EditorViewControllerPanel = (props) => {
  const { dispatch, height, mapContext, shownPriority, mapRotation } = props;

  // function radioGroupChange(ev) {
  //   const changedMapMode = ev.target.value;
  //   dispatch({
  //     type: 'editorView/saveState',
  //     payload: { mapMode: changedMapMode },
  //   });
  //   mapContext.changeMapMode(changedMapMode);
  // }

  function switchShowBlock(hideBlock) {
    dispatch({
      type: 'editorView/saveState',
      payload: { hideBlock },
    });
    mapContext.switchShowBlock(hideBlock);
  }

  function switchCoordinatorShown(value) {
    dispatch({
      type: 'editorView/saveState',
      payload: { showCoordinate: value },
    });
    mapContext.switchCoordinationShown(value, false);
  }

  function switchDistanceShown(value) {
    dispatch({
      type: 'editorView/saveState',
      payload: { showDistance: value },
    });
    mapContext.switchDistanceShown(value, false);
  }

  function switchBackImgShown(value) {
    dispatch({
      type: 'editorView/saveState',
      payload: { showBackImg: value },
    });
    mapContext.switchBackImgShown(value);
  }

  function showPriority(value) {
    dispatch({
      type: 'editorView/saveState',
      payload: { shownPriority: value },
    });
    mapContext.filterRelations(value);
  }

  function filterRelationDir(value) {
    dispatch({
      type: 'editorView/saveState',
      payload: { showRelationsDir: value },
    });
    mapContext.filterRelationDir(value);
  }

  function filterRelationsByCells(value) {
    dispatch({
      type: 'editorView/saveState',
      payload: { showRelationsCells: value },
    });
    mapContext.filterRelationCell(value);
  }

  function rotateMapView(angle) {
    dispatch({ type: 'editorView/updateMapRotation', payload: angle });
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
            {/*<Form.Item*/}
            {/*  {...formItemLayout}*/}
            {/*  label={<FormattedMessage id={'editor.view.mapViewMode'} />}*/}
            {/*>*/}
            {/*  <Radio.Group*/}
            {/*    buttonStyle="solid"*/}
            {/*    value={props.mapMode}*/}
            {/*    onChange={(ev) => radioGroupChange(ev)}*/}
            {/*  >*/}
            {/*    <Radio.Button value="standard">*/}
            {/*      <FormattedMessage id="editor.view.mapViewMode.standard" />*/}
            {/*      /!* 标准 *!/*/}
            {/*    </Radio.Button>*/}
            {/*    <Radio.Button value="scaled">*/}
            {/*      <FormattedMessage id="editor.view.mapViewMode.scaled" />*/}
            {/*      /!* 大图 *!/*/}
            {/*    </Radio.Button>*/}
            {/*  </Radio.Group>*/}
            {/*</Form.Item>*/}

            {/* 隐藏不可走点 */}
            <Form.Item
              {...formItemLayout}
              label={<FormattedMessage id={'editor.view.hideBlock'} />}
            >
              <Switch checked={props.hideBlock} onChange={(ev) => switchShowBlock(ev)} />
            </Form.Item>

            {/* 坐标显示 */}
            <Form.Item
              {...formItemLayout}
              label={<FormattedMessage id={'editor.view.coordinateDisplay'} />}
            >
              <Switch
                checked={props.showCoordinate}
                onChange={(value) => {
                  switchCoordinatorShown(value);
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
          </Form>
        </div>

        <div className={styles.panelBlock} style={{ marginTop: 5 }}>
          <Form labelWrap>
            {/* 优先级显示 */}
            <Form.Item
              {...formItemLayout}
              label={<FormattedMessage id={'editor.view.priorityDisplay'} />}
            >
              <CostCheckBox
                style={{ marginTop: 6 }}
                value={shownPriority}
                onChange={(value) => {
                  showPriority(value);
                }}
              />
            </Form.Item>

            {/* 方向显示 */}
            <Form.Item
              {...formItemLayout}
              label={<FormattedMessage id={'editor.view.directionShown'} />}
            >
              <Checkbox.Group
                style={{ width: '100%' }}
                value={props.showRelationsDir}
                onChange={(value) => {
                  filterRelationDir(value);
                }}
                disabled={shownPriority.length === 0}
              >
                <Row gutter={8}>
                  {DirectionOption.map(({ value, label }, index) => (
                    <Col key={index} span={6}>
                      <Checkbox value={value}>
                        <FormattedMessage id={label} />
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
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
        {/*<div className={styles.panelBlock} style={{ marginTop: 5 }}>*/}
        {/*  <Form.Item label={'缩放系数'}>*/}
        {/*    <InputNumber />*/}
        {/*  </Form.Item>*/}
        {/*  <Form.Item label={'补偿偏移'}>*/}
        {/*    <Input.Group>*/}
        {/*      <Row gutter={10} style={{ width: '90%' }}>*/}
        {/*        <Col span={12}>*/}
        {/*          <Form.Item noStyle>*/}
        {/*            <InputNumber addonBefore={'X'} addonAfter={'mm'} style={{ width: '100%' }} />*/}
        {/*          </Form.Item>*/}
        {/*        </Col>*/}
        {/*        <Col span={12}>*/}
        {/*          <Form.Item noStyle>*/}
        {/*            <InputNumber addonBefore={'Y'} addonAfter={'mm'} style={{ width: '100%' }} />*/}
        {/*          </Form.Item>*/}
        {/*        </Col>*/}
        {/*      </Row>*/}
        {/*    </Input.Group>*/}
        {/*  </Form.Item>*/}
        {/*  <Form.Item label={'补偿角度'}>*/}
        {/*    <InputNumber addonAfter={'°'} />*/}
        {/*  </Form.Item>*/}
        {/*  <Form.Item label={'地图旋转'}>*/}
        {/*    <InputNumber*/}
        {/*      value={mapRotation}*/}
        {/*      onChange={debounce((value) => {*/}
        {/*        rotateMapView(value);*/}
        {/*      }, 200)}*/}
        {/*    />*/}
        {/*  </Form.Item>*/}
        {/*</div>*/}
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
  mapRotation: editorView.mapRotation,
  mapContext: editor.mapContext,
}))(memo(EditorViewControllerPanel));
