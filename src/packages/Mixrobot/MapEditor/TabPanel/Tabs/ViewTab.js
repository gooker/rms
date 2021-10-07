import React, { memo, useContext } from 'react';
import { connect } from '@/utils/dva';
import { Col, Radio, Checkbox, Switch, Icon, Form, Select, Divider } from 'antd';
import { getCurrentRouteMapData } from '@/utils/mapUtils';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { CostOptions, DirectionOption } from '../../MapEditConst';
import CheckBoxFun from '@/packages/Mixrobot/MapMonitor/components/CheckBoxFun';
import MapContext from '../../MapEditContext';

const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const MapEditView = (props) => {
  const { dispatch, mapMode, relations, shownPriority } = props;

  const mapRef = useContext(MapContext);

  function radioGroupChange(ev) {
    const changedMapMode = ev.target.value;
    dispatch({
      type: 'editor/saveState',
      payload: { mapMode: changedMapMode },
    });
    mapRef.changeMapMode(changedMapMode);
  }

  function switchShowBlock(hideBlock) {
    dispatch({
      type: 'editor/saveState',
      payload: { hideBlock },
    });
    mapRef.switchShowBlock(hideBlock);
  }

  function switchCoordShown(value) {
    dispatch({
      type: 'editor/saveState',
      payload: { showCoordinate: value },
    });
    mapRef.switchCoordinationShown(value, false);
  }

  function switchDistanceShown(value) {
    dispatch({
      type: 'editor/saveState',
      payload: { showDistance: value },
    });
    mapRef.switchDistanceShown(value, false);
  }

  function showPriority(value) {
    dispatch({
      type: 'editor/saveState',
      payload: { shownPriority: value },
    });
    mapRef.filterRelations(relations, value || []);
  }

  function filterRelationDir(value) {
    dispatch({
      type: 'editor/saveState',
      payload: { showRelationsDir: value },
    });
    mapRef.filterRelationDir(value);
  }

  function filterRelationsByCells(value) {
    dispatch({
      type: 'editor/saveState',
      payload: { showRelationsCells: value },
    });
    mapRef.filterRelationCell(value);
  }

  return (
    <React.Fragment>
      <div style={{ height: 30 }} />
      {/* "模式切换" */}
      <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.mapEditView.modeSwitch' })}>
        <Radio.Group
          defaultValue={mapMode}
          buttonStyle="solid"
          value={mapMode}
          onChange={(ev) => radioGroupChange(ev)}
        >
          <Radio.Button value="standard">
            <FormattedMessage id="app.mapEditView.standard" />
            {/* 标准 */}
          </Radio.Button>
          <Radio.Button value="scaled">
            <FormattedMessage id="app.mapEditView.bigPicture" />
            {/* 大图 */}
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      {/* "隐藏不可走点" */}
      <Form.Item
        {...formItemLayout}
        label={formatMessage({ id: 'app.mapEditView.hideNotwalkPoint' })}
      >
        <Switch
          checked={props.hideBlock}
          onChange={(ev) => switchShowBlock(ev)}
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
        />
      </Form.Item>

      {/* "坐标显示" */}
      <Form.Item
        {...formItemLayout}
        label={formatMessage({ id: 'app.mapEditView.coordinateDisplay' })}
      >
        <Col span={24}>
          <Switch
            checked={props.showCoordinate}
            onChange={(value) => {
              switchCoordShown(value);
            }}
          />
        </Col>
      </Form.Item>

      {/* "距离显示" */}
      <Form.Item
        {...formItemLayout}
        label={formatMessage({ id: 'app.mapEditView.distanceDisplay' })}
      >
        <Col span={24}>
          <Switch
            disabled={shownPriority.length === 0}
            checked={props.showDistance}
            onChange={(value) => {
              switchDistanceShown(value);
            }}
          />
        </Col>
      </Form.Item>
      <Divider />

      {/* "优先级显示" */}
      <Form.Item
        {...formItemLayout}
        label={formatMessage({ id: 'app.mapEditView.priorityDisplay' })}
      >
        <Col span={24}>
          <CheckBoxFun
            onChange={(value) => {
              showPriority(value);
            }}
            checked={shownPriority}
            dataSource={CostOptions.map((item) => ({
              ...item,
              label: formatMessage({ id: item.label }),
            }))}
          />
        </Col>
      </Form.Item>

      {/* "路线方向显示" */}
      <Form.Item
        {...formItemLayout}
        label={formatMessage({ id: 'app.mapEditView.directionShown' })}
      >
        <Col span={24}>
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
        </Col>
      </Form.Item>

      {/* 仅显示相关点 */}
      <Form.Item
        {...formItemLayout}
        label={formatMessage({ id: 'app.mapEditView.showOnlyRelevantPoints' })}
      >
        <Col span={18}>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            value={props.showRelationsCells}
            disabled={shownPriority.length === 0}
            onChange={(value) => filterRelationsByCells(value)}
          />
        </Col>
        <Col span={4} />
      </Form.Item>
    </React.Fragment>
  );
};
export default connect(({ editor }) => {
  const currentRouteMapData = getCurrentRouteMapData();
  return {
    mapMode: editor.mapMode,
    hideBlock: editor.hideBlock,
    showCoordinate: editor.showCoordinate,
    showDistance: editor.showDistance,
    shownPriority: editor.shownPriority,
    showRelationsDir: editor.showRelationsDir,
    showRelationsCells: editor.showRelationsCells,
    relations: currentRouteMapData?.relations ?? [],
  };
})(memo(MapEditView));
