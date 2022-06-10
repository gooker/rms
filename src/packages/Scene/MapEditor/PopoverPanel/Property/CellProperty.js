import React, { memo, useEffect } from 'react';
import { Button, Col, Empty, Form, Input, InputNumber, Row, Tag } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import { CellTypeSetting } from '@/packages/Scene/MapEditor/editorEnums';
import EditorCard from '../../components/EditorCard';
import LabelComponent from '@/components/LabelComponent';
import { CoordinateType } from '@/config/config';
import { isPlainObject } from 'lodash';

const { formItemLayout } = getFormLayout(6, 18);
const CellProperty = (props) => {
  const { dispatch, data, selections, mapContext, cellMap, shownCellCoordinateType } = props;
  const [formRef] = Form.useForm();
  const cellProps = cellMap[selections[0]?.id];
  const currentLogicArea = getCurrentLogicAreaData();
  const currentRouteMap = getCurrentLogicAreaData();

  useEffect(() => {
    formRef.setFieldsValue({
      naviId: cellProps.naviId,
      x: shownCellCoordinateType === CoordinateType.LAND ? cellProps.x : cellProps.nx,
      y: shownCellCoordinateType === CoordinateType.LAND ? cellProps.y : cellProps.ny,
    });
  }, [cellProps]);

  function renderCellTypeEnum() {
    return CellTypeSetting.map(({ type, scope, i18n }) => {
      const scopeData = scope === 'logic' ? currentLogicArea : currentRouteMap;
      const typeCells = scopeData[type] || [];
      if (typeCells.includes(data.id)) {
        return (
          <Tag key={type} closable color="blue">
            <FormattedMessage id={i18n} />
          </Tag>
        );
      }
    }).filter(Boolean);
  }

  function updateNaviId() {
    formRef
      .validateFields()
      .then((value) => {
        dispatch({
          type: 'editor/updateCellNaviId',
          payload: { originId: cellProps.naviId, newId: value.naviId },
        }).then((result) => {
          if (isPlainObject(result)) {
            mapContext.updateCells({ type: 'updateNaviId', payload: result });
          }
        });
      })
      .catch(() => {});
  }

  const cellTypeTags = renderCellTypeEnum();
  return (
    <>
      <div>
        <FormattedMessage id={'app.map.cell'} />
        <FormattedMessage id={'app.common.prop'} />
      </div>
      <div>
        <Form form={formRef} {...formItemLayout}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item name={'naviId'} label={'ID'} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={'x'} label={'X'} rules={[{ required: true }]}>
                <InputNumber disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={'y'} label={'Y'} rules={[{ required: true }]}>
                <InputNumber disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Button type={'primary'} onClick={updateNaviId}>
                <SyncOutlined /> <FormattedMessage id={'app.button.update'} />
              </Button>
            </Col>
          </Row>
        </Form>

        {/* 导航点属性 */}
        <EditorCard
          label={`${formatMessage({ id: 'app.map.navigationCell' })}${formatMessage({
            id: 'app.common.prop',
          })}`}
        >
          <LabelComponent label={formatMessage({ id: 'app.common.type' })}>
            {cellProps?.navigationType}
          </LabelComponent>
          <LabelComponent label={formatMessage({ id: 'app.map.landCoordinator' })}>
            {cellProps?.x}, {cellProps?.y}
          </LabelComponent>
          <LabelComponent label={formatMessage({ id: 'app.map.naviCoordinator' })}>
            {cellProps?.nx}, {cellProps?.ny}
          </LabelComponent>
        </EditorCard>

        {/* 点位类型*/}
        <EditorCard label={formatMessage({ id: 'editor.cellType' })}>
          {cellTypeTags.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            cellTypeTags
          )}
        </EditorCard>

        {/* 地图编程(只显示GLO) */}
        <EditorCard label={formatMessage({ id: 'editor.programing' })}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </EditorCard>
      </div>
    </>
  );
};
export default connect(({ editor, editorView }) => ({
  mapContext: editor.mapContext,
  selections: editor.selections,
  cellMap: editor.currentMap.cellMap,
  shownCellCoordinateType: editorView.shownCellCoordinateType,
}))(memo(CellProperty));
