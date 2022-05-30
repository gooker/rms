import React, { memo, useState } from 'react';
import { Button, Empty } from 'antd';
import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getRandomString, isNull } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import FunctionListItem from '../components/FunctionListItem';
import DeliveryForm from './DeliveryForm';
import commonStyles from '@/common.module.less';

const DeliveryPanel = (props) => {
  const { height, dispatch, mapContext, dumpStations } = props;

  const [addFlag, setAddFlag] = useState(-1);
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(null);

  function edit(index, record) {
    setEditing(record);
    setFormVisible(true);
    setAddFlag(index);
  }

  function remove(flag) {
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, scope: 'logic', type: 'dumpStations' },
    }).then((result) => {
      mapContext.removeDumpFunction(result);
      mapContext.refresh();
    });
  }

  function getListData() {
    return dumpStations.map((item, index) => {
      const { name, agvDirection, x, y, dumpBasket } = item;
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
            field: 'agvDirection',
            label: <FormattedMessage id={'app.vehicle.direction'} />,
            value: agvDirection,
          },
          { field: 'X', label: 'X', value: x },
          { field: 'Y', label: 'Y', value: y },
          {
            field: 'basket',
            label: <FormattedMessage id={'editor.delivery.basket'} />,
            value: dumpBasket.map(({ key }) => key),
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
        {formVisible ? (
          <LeftOutlined
            style={{ cursor: 'pointer', marginRight: 5 }}
            onClick={() => {
              setFormVisible(false);
              setEditing(null);
            }}
          />
        ) : null}
        <FormattedMessage id={'app.map.delivery'} />
        {formVisible ? <RightOutlined style={{ fontSize: 16, margin: '0 5px' }} /> : null}
        <span style={{ fontSize: 15, fontWeight: 500 }}>
          {formVisible
            ? isNull(editing)
              ? formatMessage({ id: 'app.button.add' })
              : formatMessage({ id: 'app.button.update' })
            : null}
        </span>
      </div>

      {/* 列表区 */}
      <div>
        {formVisible ? (
          <DeliveryForm delivery={editing} flag={addFlag} />
        ) : (
          <>
            <div style={{ width: '100%', textAlign: 'end' }}>
              <Button
                type="primary"
                style={{ marginBottom: 10 }}
                onClick={() => {
                  setAddFlag(dumpStations.length + 1);
                  setFormVisible(true);
                }}
              >
                <PlusOutlined /> <FormattedMessage id="app.button.add" />
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
  const currentLogicAreaData = getCurrentLogicAreaData();
  const dumpStations = currentLogicAreaData?.dumpStations ?? [];
  return { dumpStations, mapContext: editor.mapContext };
})(memo(DeliveryPanel));
