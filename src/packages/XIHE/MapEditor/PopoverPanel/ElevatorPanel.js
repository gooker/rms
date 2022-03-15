import React, { memo, useState } from 'react';
import { Button, Empty } from 'antd';
import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getRandomString, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import FunctionListItem from '../components/FunctionListItem';
import ElevatorForm from './ElevatorForm';
import commonStyles from '@/common.module.less';

const ElevatorPanel = (props) => {
  const { height, dispatch, mapContext, elevatorList, logicAreaList } = props;

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
      payload: { flag, type: 'elevatorList', scope: 'map' },
    }).then((result) => {
      mapContext.removeElevator(result);
      mapContext.refresh();
    });
  }

  function renderLogicElevator(logicLocations) {
    return Object.keys(logicLocations).map((logicId) => {
      const { doors, innerMapping } = logicLocations[logicId];
      if (Array.isArray(doors)) {
        return {
          field: 'doors',
          label: logicAreaList[logicId].name,
          value: Object.values(innerMapping).map((cellId) => cellId),
        };
      }
      return {};
    });
  }

  function getListData() {
    return elevatorList.map((item, index) => {
      const { innerCellId, logicLocations } = item;
      return {
        name: innerCellId[0],
        index,
        rawData: item,
        fields: renderLogicElevator(logicLocations),
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
        <FormattedMessage id={'app.map.elevator'} />
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
          <ElevatorForm elevator={editing} flag={addFlag} />
        ) : (
          <>
            <div style={{ width: '100%', textAlign: 'end' }}>
              <Button
                type="primary"
                style={{ marginBottom: 10 }}
                onClick={() => {
                  setAddFlag(elevatorList.length + 1);
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
  const { currentMap } = editor;
  const { elevatorList, logicAreaList } = currentMap;
  return { elevatorList, logicAreaList, mapContext: editor.mapContext };
})(memo(ElevatorPanel));
