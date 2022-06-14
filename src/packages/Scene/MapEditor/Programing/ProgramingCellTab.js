/* TODO: I18N */
import React, { memo, useState } from 'react';
import { Button, Col, Divider, Empty, InputNumber, Row, Select } from 'antd';
import { PlusOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { getCurrentRouteMapData, getSelectionNaviCells, getSelectionNaviCellTypes } from '@/utils/mapUtil';
import { connect } from '@/utils/RmsDva';
import { convertMapToArrayMap } from '@/utils/util';
import { ProgramingItemType } from '@/config/config';
import { MapSelectableSpriteType } from '@/config/consts';
import ScopeProgramList from './ScopeProgramList';
import StackCellConfirmModal from '../components/StackCellConfirmModal';
import ProgramingConfiguerModal from '@/components/ProgramingConfiguer';
import FormattedMessage from '@/components/FormattedMessage';

const ProgramingCellTab = (props) => {
  const { dispatch, mapContext, cellMap, selections, programing, cellPrograming } = props;

  const [configVisible, setConfigVisible] = useState(false);
  const [configCells, setConfigCells] = useState([]); // 正在配置的点位
  const [naviTypeOption, setNaviTypeOption] = useState([]); // 点位类型Options数据
  const [searchKey, setSearchKey] = useState(null);
  const [editing, setEditing] = useState(null);

  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ id }) => id);

  function save(configuration) {
    dispatch({
      type: 'editor/updateMapPrograming',
      payload: {
        type: ProgramingItemType.cell,
        items: configCells.map((item) => item + ''),
        configuration,
      },
    }).then((cellIds) => {
      mapContext.renderCellsType(
        cellIds.map((i) => parseInt(i)),
        'programing',
        'add',
      );
      mapContext.refresh();
    });
  }

  function onDelete(item) {
    dispatch({
      type: 'editor/deleteMapPrograming',
      payload: { type: ProgramingItemType.cell, key: item.key },
    }).then((cellIds) => {
      mapContext.renderCellsType(
        cellIds.map((i) => parseInt(i)),
        'programing',
        'remove',
      );
      mapContext.refresh();
    });
  }

  function onEdit(item) {
    setEditing(item);
    setConfigCells([item.key]);
    setConfigVisible(true);
  }

  function addConfigCell() {
    const selectionsTypes = getSelectionNaviCellTypes();
    if (selectionsTypes.length === 1) {
      setConfigCells(selectCellIds);
    } else {
      setNaviTypeOption(selectionsTypes);
    }
  }

  function startConfiguration() {
    setEditing(null);
    setConfigVisible(true);
  }

  function terminateConfiguration() {
    setConfigVisible(false);
  }

  function getOptions() {
    if (configCells.length === 0) {
      return [];
    }
    return configCells.map((item) => {
      const { id, naviId, navigationType } = cellMap[item];
      return (
        <Select.Option key={`${navigationType}_${id}`} value={id}>
          {naviId}
        </Select.Option>
      );
    });
  }

  return (
    <div style={{ paddingTop: 20 }}>
      <Row gutter={4}>
        <Col span={21}>
          <Select
            disabled
            allowClear
            mode={'multiple'}
            value={configCells}
            onChange={setConfigCells}
            style={{ width: '100%' }}
            notFoundContent={null}
          >
            {getOptions()}
          </Select>
        </Col>
        <Col span={3}>
          <Button
            onClick={addConfigCell}
            disabled={selectCellIds.length === 0}
            icon={<PlusOutlined />}
          />
        </Col>
      </Row>
      <Button
        type='primary'
        onClick={startConfiguration}
        disabled={configCells.length === 0}
        style={{ marginTop: 10 }}
      >
        <SettingOutlined /> <FormattedMessage id={'app.button.config'} />
      </Button>

      {/* 搜索部分 */}
      <Divider style={{ background: '#a3a3a3' }} />
      <InputNumber
        allowClear
        prefix={<SearchOutlined />}
        style={{ marginBottom: 10, width: '100%' }}
        value={searchKey}
        onChange={debounce((value) => {
          setSearchKey(value);
        }, 200)}
      />
      {cellPrograming.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ color: '#fff' }} />
      ) : (
        <ScopeProgramList datasource={cellPrograming} onEdit={onEdit} onDelete={onDelete} />
      )}

      {/* 配置弹窗 */}
      <ProgramingConfiguerModal
        title={`编辑点位编程: [ ${configCells.join()} ]`}
        editing={editing}
        programing={programing}
        visible={configVisible}
        onOk={save}
        onCancel={terminateConfiguration}
      />

      {/* 选择具体配置点位类型 */}
      <StackCellConfirmModal
        title={'选择需要进行配置的点位类型'}
        types={naviTypeOption}
        visible={naviTypeOption.length > 0}
        onConfirm={(types) => {
          setConfigCells(
            getSelectionNaviCells()
              .filter((item) => types.includes(item.navigationType))
              .map(({ id }) => id),
          );
        }}
        onCancel={() => {
          setNaviTypeOption([]);
        }}
      />
    </div>
  );
};
export default connect(({ editor, global }) => {
  const { selections, currentMap, mapContext } = editor;
  const currentRouteMap = getCurrentRouteMapData();
  let cellPrograming = currentRouteMap.programing?.cells || {};
  cellPrograming = convertMapToArrayMap(cellPrograming, 'key', 'actions');
  return {
    selections,
    cellMap: currentMap.cellMap,
    cellPrograming,
    programing: global.programing,
    mapContext,
  };
})(memo(ProgramingCellTab));
