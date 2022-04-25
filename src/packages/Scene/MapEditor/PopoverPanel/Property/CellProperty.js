import React, { memo } from 'react';
import { Tag, Empty } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import { CellTypeSetting } from '@/packages/Scene/MapEditor/editorEnums';
import EditorCard from '../../components/EditorCard';
import LabelComponent from '@/components/LabelComponent';

const CellProperty = (props) => {
  const { data, selections, cellMap } = props;
  const currentLogicArea = getCurrentLogicAreaData();
  const currentRouteMap = getCurrentLogicAreaData();

  function renderCellTypeEnum() {
    return CellTypeSetting.map(({ type, scope, i18n }) => {
      const scopeData = scope === 'logic' ? currentLogicArea : currentRouteMap;
      const typeCells = scopeData[type] || [];
      if (typeCells.includes(data.id)) {
        return (
          <Tag key={type} closable color='blue'>
            <FormattedMessage id={i18n} />
          </Tag>
        );
      }
    }).filter(Boolean);
  }

  const cellTypeTags = renderCellTypeEnum();
  const cellProps = cellMap[selections[0]?.id];
  return (
    <>
      <div>
        <FormattedMessage id={'app.map.cell'} />
        <FormattedMessage id={'app.common.prop'} />
      </div>
      <div>
        {/* 导航点属性 */}
        <EditorCard
          label={`${formatMessage({ id: 'app.map.navigationCell' })}${formatMessage({
            id: 'app.common.prop',
          })}`}
        >
          <LabelComponent label={formatMessage({ id: 'app.common.type' })}>
            {cellProps?.brand}
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
export default connect(({ editor }) => ({
  selections: editor.selections,
  cellMap: editor.currentMap.cellMap,
}))(memo(CellProperty));
