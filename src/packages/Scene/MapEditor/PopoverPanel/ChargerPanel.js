import React, { memo, useState } from 'react';
import { Button, Col, Empty } from 'antd';
import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { convertChargerToView, getCurrentLogicAreaData } from '@/utils/mapUtil';
import { formatMessage, getRandomString, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import ChargerForm from './ChargerForm';
import ChargerMultiForm from './ChargerMultiForm';
import FunctionListItem from '../components/FunctionListItem';
import LabelComponent from '@/components/LabelComponent';
import commonStyles from '@/common.module.less';

const ChargerPanel = (props) => {
  const { dispatch, height, mapContext, chargerList } = props;

  const [addFlag, setAddFlag] = useState(-1);
  const [formVisible, setFormVisible] = useState(null);
  const [multiFormVisible, setMultiFormVisible] = useState(null);
  const [editing, setEditing] = useState(null);

  function edit(index, record) {
    setEditing(record);
    setFormVisible(true);
    setAddFlag(index);
  }

  function remove(flag) {
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, type: 'chargerList', scope: 'logic' },
    }).then((result) => {
      mapContext.removeCharger(result);
      mapContext.refresh();
    });
  }

  function renderChargingCells(chargingCells) {
    return chargingCells.map(({ cellId, supportTypes }) => (
      <Col key={getRandomString(6)} span={24}>
        <LabelComponent
          label={
            <>
              <FormattedMessage id={'editor.cellType.charging'} />({cellId})
            </>
          }
        >
          {supportTypes
            .map(({ vehicleTypes }) => vehicleTypes)
            .flat()
            .join()}
        </LabelComponent>
      </Col>
    ));
  }

  function getListData() {
    return chargerList.map((item, index) => {
      const { name, chargingCells, angle } = item;
      return {
        name,
        index,
        rawData: item,
        fields: [
          {
            field: 'name',
            label: <FormattedMessage id={'app.common.name'} />,
            value: name,
          },
          {
            field: 'angle',
            label: <FormattedMessage id={'app.common.angle'} />,
            value: angle,
          },
          {
            field: 'chargingCells',
            label: <FormattedMessage id={'editor.cellType.charging'} />,
            node: renderChargingCells(chargingCells),
          },
        ],
      };
    });
  }

  const listData = getListData();
  return (
    <div style={{ height, width: 350 }} className={commonStyles.categoryPanel}>
      {/* 标题栏 */}
      <div>
        {formVisible || multiFormVisible ? (
          <LeftOutlined
            style={{ cursor: 'pointer', marginRight: 5 }}
            onClick={() => {
              setFormVisible(false);
              setMultiFormVisible(false);
              setEditing(null);
            }}
          />
        ) : null}
        <FormattedMessage id={'app.map.charger'} />
        {formVisible || multiFormVisible ? (
          <RightOutlined style={{ fontSize: 16, margin: '0 5px' }} />
        ) : null}
        <span style={{ fontSize: 15, fontWeight: 500 }}>
          {formVisible || multiFormVisible
            ? isNull(editing)
              ? formatMessage({ id: 'app.button.add' })
              : formatMessage({ id: 'app.button.update' })
            : null}
        </span>
      </div>

      {/* 列表区 */}
      <div>
        {formVisible ? (
          <ChargerForm charger={convertChargerToView(editing)} flag={addFlag} />
        ) : multiFormVisible ? (
          <ChargerMultiForm
            back={() => {
              setMultiFormVisible(false);
            }}
          />
        ) : (
          <>
            <div style={{ width: '100%', textAlign: 'end', marginBottom: 10 }}>
              <Button
                type="primary"
                onClick={() => {
                  setAddFlag(chargerList.length + 1);
                  setFormVisible(true);
                }}
              >
                <PlusOutlined /> <FormattedMessage id="app.button.add" />
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: 10 }}
                onClick={() => {
                  setMultiFormVisible(true);
                }}
              >
                <PlusOutlined /> <FormattedMessage id="editor.cell.batchAdd" />
              </Button>
            </div>
            {listData.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ color: '#fff' }} />
            ) : (
              listData.map((item) => (
                <FunctionListItem
                  key={getRandomString(6)}
                  data={item}
                  onEdit={edit}
                  onDelete={remove}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default connect(({ editor }) => {
  const { mapContext } = editor;

  const currentLogicAreaData = getCurrentLogicAreaData();
  const chargerList = currentLogicAreaData?.chargerList ?? [];

  return { mapContext, chargerList };
})(memo(ChargerPanel));
