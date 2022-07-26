import React, { memo, useEffect } from 'react';
import { Button, Col, Empty, Form, Input, InputNumber, Row, Tag } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { isPlainObject } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import { CoordinateType } from '@/config/config';
import EditorCard from '../../components/EditorCard';
import FormattedMessage from '@/components/FormattedMessage';
import LabelComponent from '@/components/LabelComponent';
import { CellTypeSetting } from '@/packages/Scene/MapEditor/editorEnums';

const { formItemLayout } = getFormLayout(6, 18);

const CellProperty = (props) => {
  const { dispatch, mapContext, cell, shownCellCoordinateType } = props;

  const [formRef] = Form.useForm();
  const currentLogicArea = getCurrentLogicAreaData();
  const currentRouteMap = getCurrentLogicAreaData();

  useEffect(() => {
    const { naviId, coordinate } = cell;
    formRef.setFieldsValue({
      naviId,
      x: shownCellCoordinateType === CoordinateType.LAND ? coordinate.x : coordinate.nx,
      y: shownCellCoordinateType === CoordinateType.LAND ? coordinate.y : coordinate.ny,
    });
  }, [cell, shownCellCoordinateType]);

  function renderCellTypeEnum() {
    return CellTypeSetting.map(({ type, scope, i18n }) => {
      const scopeData = scope === 'logic' ? currentLogicArea : currentRouteMap;
      const typeCells = scopeData[type] || [];
      if (typeCells.includes(cell.id)) {
        return (
          <Tag key={type} closable color='blue'>
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
          payload: { originId: cell.naviId, newId: value.naviId },
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
              <Button
                type={'primary'}
                onClick={updateNaviId}
                disabled={shownCellCoordinateType === CoordinateType.NAVI}
              >
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
            {cell.navigationType}
          </LabelComponent>
          <LabelComponent label={formatMessage({ id: 'app.map.naviCoordinator' })}>
            ( {cell.coordinate.nx}, {cell.coordinate.ny} )
          </LabelComponent>
          <LabelComponent label={formatMessage({ id: 'app.map.landCoordinator' })}>
            ( {cell.coordinate.x}, {cell.coordinate.y} )
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
  cell: editor.selections[0],
  shownCellCoordinateType: editorView.shownCellCoordinateType,
}))(memo(CellProperty));
