import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Empty, message } from 'antd';
import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { fetchTrafficRobotType } from '@/services/XIHE';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import { dealResponse, formatMessage, getRandomString, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import ChargerForm from './ChargerForm';
import ChargerMultiForm from './ChargerMultiForm';
import FunctionListItem from '../components/FunctionListItem';
import editorStyles from '../editorLayout.module.less';
import LabelComponent from '@/components/LabelComponent';

const ChargerPanel = (props) => {
  const { dispatch, height, mapContext, chargerList } = props;

  const [addFlag, setAddFlag] = useState(-1);
  const [formVisible, setFormVisible] = useState(null);
  const [multiFormVisible, setMultiFormVisible] = useState(null);
  const [editing, setEditing] = useState(null);
  const [robotTypes, setRobotTypes] = useState([]);

  useEffect(() => {
    fetchTrafficRobotType().then((response) => {
      if (!dealResponse(response)) {
        setRobotTypes(response);
      } else {
        message.error(formatMessage({ id: 'app.message.fetchAgvTypeListFail' }));
      }
    });
  }, []);

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
    return chargingCells.map(({ cellId, agvTypes }) => (
      <Col key={getRandomString(6)} span={24}>
        <LabelComponent
          label={
            <>
              <FormattedMessage id={'editor.cellType.charging'} />({cellId})
            </>
          }
        >
          {agvTypes.join()}
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
  console.log(listData);
  return (
    <div style={{ height, width: 380 }} className={editorStyles.categoryPanel}>
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
          <ChargerForm charger={editing} robotTypes={robotTypes} flag={addFlag} />
        ) : multiFormVisible ? (
          <ChargerMultiForm
            robotTypes={robotTypes}
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
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
  return { chargerList, mapContext };
})(memo(ChargerPanel));
