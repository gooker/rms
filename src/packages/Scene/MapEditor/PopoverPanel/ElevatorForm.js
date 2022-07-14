import React, { memo } from 'react';
import { Button, Divider, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { getRandomString } from '@/utils/util';
import ElevatorConfig from './ElevatorConfig';
import LabelComponent from '@/components/LabelComponent';
import FormattedMessage from '@/components/FormattedMessage';

const ElevatorForm = (props) => {
  const { flag, dispatch, elevatorList, currentLogicArea, logicAreaList } = props;

  function getCurrentElevator() {
    let currentElevator = null;
    if (elevatorList.length >= flag) {
      currentElevator = elevatorList[flag - 1];
    }
    return currentElevator;
  }

  const currentElevator = getCurrentElevator();
  return (
    <div>
      <LabelComponent
        bodyStyle={{ marginBottom: 30 }}
        label={<FormattedMessage id={'editor.elevator.location'} />}
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          defaultValue={currentElevator?.innerCellId}
          onChange={(value) => {
            dispatch({
              type: 'editor/saveElevatorReplaceId',
              payload: { value, flag },
            });
          }}
          notFoundContent={null}
        />
      </LabelComponent>

      {/* 进入配置页 */}
      {logicAreaList.map((item, index) => (
        <Button
          type={currentLogicArea === item.id ? 'primary' : 'default'}
          style={{ height: 40, marginRight: 15 }}
          key={getRandomString(6)}
          icon={<SettingOutlined />}
          disabled={!currentElevator}
          onClick={() => {
            dispatch({
              type: 'editor/saveCurrentLogicArea',
              payload: index,
            });
          }}
        >
          {item.name}
        </Button>
      ))}

      {/* 层电梯配置表单 */}
      <Divider style={{ background: '#a3a3a3', margin: '30px 0 10px 0' }} />
      <ElevatorConfig flag={flag} currentElevator={currentElevator} />
    </div>
  );
};
export default connect(({ editor }) => {
  const { currentMap, currentLogicArea } = editor;
  const { elevatorList, logicAreaList } = currentMap;
  return { elevatorList, logicAreaList, currentLogicArea };
})(memo(ElevatorForm));
