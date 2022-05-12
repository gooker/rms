/* TODO: I18N */
import React, { memo, useState } from 'react';
import { Button, Col, Divider, Empty, InputNumber, Row, Select } from 'antd';
import { PlusOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { getSelectionNaviCells, getSelectionNaviCellTypes } from '@/utils/mapUtil';
import { MapSelectableSpriteType } from '@/config/consts';
import ScopeProgramList from './ScopeProgramList';
import ProgramingCellModal from './ProgramingCellModal';
import StackCellConfirmModal from '../components/StackCellConfirmModal';
import { ProgramingItemType } from '@/config/config';

const ProgramingCellTab = (props) => {
  const { dispatch, selections } = props;

  // 这里之所以存在两个点位集是因为: 已选择的点位+筛选 =正在配置的点位, 筛选可以不存在
  const [selectedCells, setSelectedCells] = useState([]); // 已选择的点位
  const [configCells, setConfigCells] = useState([]); // 正在配置的点位

  const [naviTypeOption, setNaviTypeOption] = useState([]); // 点位类型Options数据
  const [searchKey, setSearchKey] = useState(null);

  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ id }) => id);

  function getDatasource() {
    return [];
  }

  function save(configuration) {
    dispatch({
      type: 'editor/updateMapPrograming',
      payload: {
        type: ProgramingItemType.cell,
        items: configCells.map((item) => item + ''),
        configuration,
      },
    });
  }

  function onEdit(id) {
  }

  function onDelete(id) {
  }

  function startConfiguration() {
    const selectionsTypes = getSelectionNaviCellTypes();
    if (selectionsTypes.length === 1) {
      setConfigCells(selectCellIds);
    } else {
      setNaviTypeOption(selectionsTypes);
    }
  }

  function terminateConfiguration() {
    setConfigCells([]);
  }

  const dataSource = getDatasource();
  return (
    <div style={{ paddingTop: 20 }}>
      <Row gutter={4}>
        <Col span={21}>
          <Select
            mode={'tags'}
            value={selectedCells}
            onChange={setSelectedCells}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={3}>
          <Button
            onClick={() => {
              setSelectedCells(selectCellIds);
            }}
            disabled={selectCellIds.length === 0}
            icon={<PlusOutlined />}
          />
        </Col>
      </Row>
      <Button
        type='primary'
        onClick={startConfiguration}
        disabled={selectedCells.length === 0}
        style={{ marginTop: 10 }}
      >
        <SettingOutlined /> 开始配置
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
      {dataSource.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ color: 'white' }} />
      ) : (
        <ScopeProgramList datasource={dataSource} onEdit={onEdit} onDelete={onDelete} />
      )}

      {/* 配置弹窗 */}
      <ProgramingCellModal
        cells={configCells}
        visible={configCells.length > 0}
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
export default connect(({ editor }) => ({
  selections: editor.selections,
}))(memo(ProgramingCellTab));
