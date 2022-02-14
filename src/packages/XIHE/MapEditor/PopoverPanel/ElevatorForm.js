import React, { memo, useState } from 'react';
import { Select, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { getRandomString } from '@/utils/util';
import ElevatorConfig from './ElevatorConfig';
import LabelComponent from '@/components/LabelComponent';
import FormattedMessage from '@/components/FormattedMessage';

const ElevatorForm = (props) => {
  const { flag, dispatch, elevator, elevatorList, logicAreaList } = props;

  const [step, setStep] = useState(1);
  const [logicAreaId, setLogicAreaId] = useState(null);

  function getCurrentElevator() {
    let currentElevator = null;
    if (elevatorList.length >= flag) {
      currentElevator = elevatorList[flag - 1];
    }
    return currentElevator;
  }

  function gotoConfigPage(logicAreaData) {
    setStep(2);
    setLogicAreaId(logicAreaData.id);
  }

  const currentElevator = getCurrentElevator();
  if (step === 1) {
    return (
      <>
        <LabelComponent
          layout={'column'}
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
        <br />

        {/* 进入配置页 */}
        {logicAreaList.map((item, index) => (
          <Button
            style={{ height: 60, marginRight: 15 }}
            key={getRandomString(6)}
            icon={<SettingOutlined />}
            disabled={!currentElevator}
            onClick={() => {
              dispatch({
                type: 'editor/saveCurrentLogicArea',
                payload: index,
              });
              gotoConfigPage(item);
            }}
          >
            {item.name}
          </Button>
        ))}
      </>
    );
  } else {
    return (
      <ElevatorConfig
        flag={flag}
        currentElevator={currentElevator}
        logicAreaId={logicAreaId}
        onBack={() => {
          setStep(1);
        }}
      />
    );
  }
};
export default connect(({ editor }) => {
  const { currentMap } = editor;
  const { elevatorList, logicAreaList } = currentMap;
  return { elevatorList, logicAreaList };
})(memo(ElevatorForm));
