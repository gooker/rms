import React, { memo } from 'react';
import { Form, Row, Col, InputNumber, Button, Tag, Empty } from 'antd';
import { connect } from '@/utils/RmsDva';
import { getFormLayout } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import { CellTypeSetting } from '@/packages/XIHE/MapEditor/enums';
import EditorCard from '../../components/EditorCard';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(7, 17);

const CellProperty = (props) => {
  const { data, dispatch, mapContext, currentMap, currentLogicArea, currentRouteMap } = props;
  const [formRef] = Form.useForm();

  const { cellMap } = currentMap;
  const cellData = cellMap[data?.id];

  function updateCellData() {
    formRef.validateFields().then((values) => {
      dispatch({
        type: 'editor/changeSingleCellCode',
        payload: { type: 'update', ...values },
      }).then((response) => {
        if (response) {
          const { type, payload } = response;
          // if (type === 'add') {
          //   this.context.addCell(payload.id, payload.x, payload.y);
          // }
          if (type === 'update') {
            mapContext.updateCells({ type: 'code', payload });
          }
          mapContext.refresh();
        }
      });
    });
  }

  function deleteCellType(cellId, field, scope) {
    dispatch({
      type: 'editor/setCellType',
      payload: { type: field, scope, operation: 'remove' },
    }).then((result) => {
      dispatch({ type: 'editor/saveForceUpdate' });
      mapContext.updateCells({ type: 'type', payload: result });
    });
  }

  function renderCellTypeEnum() {
    return CellTypeSetting.map(({ type, picture, scope, i18n }) => {
      const scopeData = scope === 'logic' ? currentLogicArea : currentRouteMap;
      const typeCells = scopeData[type] || [];
      if (typeCells.includes(data.id)) {
        return (
          <Tag
            key={type}
            closable
            color="blue"
            onClose={(e) => {
              e.preventDefault();
              deleteCellType(data.id, type, scope);
            }}
          >
            <FormattedMessage id={i18n} />
          </Tag>
        );
      }
    }).filter(Boolean);
  }

  const cellTypeTags = renderCellTypeEnum();
  return (
    <>
      <div>
        <FormattedMessage id={'app.map.cell'} />
        <FormattedMessage id={'app.common.prop'} />
      </div>
      <div>
        <Form {...formItemLayout} form={formRef}>
          <Row>
            <Col span={12}>
              <Form.Item
                name={'cellId'}
                label={'ID'}
                initialValue={cellData?.id}
                rules={[{ required: true }]}
              >
                <InputNumber min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'x'}
                label={'X'}
                initialValue={cellData?.x}
                rules={[{ required: true }]}
              >
                <InputNumber disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'y'}
                label={'Y'}
                initialValue={cellData?.y}
                rules={[{ required: true }]}
              >
                <InputNumber disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayoutNoLabel}>
                <Button type={'primary'} onClick={updateCellData}>
                  <FormattedMessage id={'app.button.update'} />
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* 点位类型*/}
        <EditorCard
          label={
            <span style={{ color: '#e8e8e8' }}>
              <FormattedMessage id={'editor.cellType'} />
            </span>
          }
        >
          {cellTypeTags.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            cellTypeTags
          )}
        </EditorCard>

        {/* 地图编程(只显示GLO) */}
        <EditorCard
          label={
            <span style={{ color: '#e8e8e8' }}>
              <FormattedMessage id={'editor.programing'} />
            </span>
          }
        >
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </EditorCard>
      </div>
    </>
  );
};
export default connect(({ editor }) => ({
  currentLogicArea: getCurrentLogicAreaData(),
  currentRouteMap: getCurrentLogicAreaData(),
  mapContext: editor.mapContext,
  currentMap: editor.currentMap,
  forceUpdate: editor.forceUpdate,
}))(memo(CellProperty));
