import React, { memo, useCallback, useEffect, useState } from 'react';
import { Divider, Empty, message, Modal, Radio } from 'antd';
import { useMap } from 'ahooks';
import { formatMessage, isNull } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import { RelationTiming } from '@/config/config';
import FormattedMessage from '@/components/FormattedMessage';
import ProgramingConfigure from '@/components/ProgramingConfiguer/ProgramingForm';
import ProgramingDnd from '@/components/ProgramingConfiguer/ProgramingDnd';
import { isArray } from 'lodash';

const ProgramingRelationModal = (props) => {
  const { editing, relations, visible, onCancel, onConfirm, programing } = props;

  const [current, setCurrent] = useState(RelationTiming.begin);
  const [
    configuration,
    { set: setConfiguration, get: getConfiguration, reset: resetConfiguration },
  ] = useMap([
    [RelationTiming.begin, []],
    [RelationTiming.onRoad, []],
    [RelationTiming.end, []],
  ]);

  useEffect(() => {
    if (visible && !isNull(editing)) {
      const { actions } = editing;
      const begin = [],
        onRoad = [],
        end = [];

      actions.forEach((item) => {
        const { timing, adapterType, actionId, actionParameters, operateType } = item;
        const addedItem = { actionType: [adapterType, actionId], operateType };
        if (isArray(actionParameters)) {
          actionParameters.forEach(({ code, value }) => {
            addedItem[code] = value;
          });
        }
        timing === RelationTiming.begin && begin.push(addedItem);
        timing === RelationTiming.onRoad && onRoad.push(addedItem);
        timing === RelationTiming.end && end.push(addedItem);
      });
      setConfiguration(RelationTiming.begin, begin);
      setConfiguration(RelationTiming.onRoad, onRoad);
      setConfiguration(RelationTiming.end, end);
    } else {
      setCurrent(RelationTiming.begin);
      resetConfiguration();
    }
  }, [visible]);

  function switchViewModel(checked) {
    setCurrent(checked);
  }

  const add = useCallback(
    function (value) {
      const newConfiguration = [...getConfiguration(current)];
      setConfiguration(current, [...newConfiguration, value]);
    },
    [current],
  );

  function confirm() {
    message.success(formatMessage({ id: 'app.message.operateSuccess' }));
    onConfirm(configuration);
    onCancel();
  }

  return (
    <Modal
      destroyOnClose
      title={`编辑线条编程: [ ${relations.join()} ]`}
      width={'60%'}
      closable={false}
      maskClosable={false}
      visible={visible}
      onCancel={onCancel}
      onOk={confirm}
      style={{ maxWidth: 1000, top: '5%' }}
    >
      <Radio.Group
        buttonStyle="solid"
        value={current}
        onChange={(evt) => {
          switchViewModel(evt.target.value);
        }}
      >
        <Radio.Button value={RelationTiming.begin}>
          <FormattedMessage id={'editor.program.relation.BEGIN'} />
        </Radio.Button>
        <Radio.Button value={RelationTiming.onRoad}>
          <FormattedMessage id={'editor.program.relation.ONROAD'} />
        </Radio.Button>
        <Radio.Button value={RelationTiming.end}>
          <FormattedMessage id={'editor.program.relation.END'} />
        </Radio.Button>
      </Radio.Group>

      {/*  点位编程配置信息 */}
      {getConfiguration(current).length === 0 ? (
        <Empty />
      ) : (
        <ProgramingDnd
          value={getConfiguration(current)}
          onChange={(payLoad) => {
            setConfiguration(current, payLoad);
          }}
          programing={programing}
        />
      )}

      {/*  点位编程配置面板 */}
      <Divider orientation={'left'}>配置面板</Divider>
      <ProgramingConfigure programing={programing} onAdd={add} />
    </Modal>
  );
};
export default connect(({ global }) => ({
  programing: global.programing || {},
}))(memo(ProgramingRelationModal));
