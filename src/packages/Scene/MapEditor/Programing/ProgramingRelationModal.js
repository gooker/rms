import React, { memo, useCallback, useState } from 'react';
import { Divider, Empty, Modal, Radio } from 'antd';
import { Container } from 'react-smooth-dnd';
import { useMap } from 'ahooks';
import { find } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { customTaskApplyDrag, formatMessage } from '@/utils/util';
import { RelationTiming } from '@/config/config';
import FormattedMessage from '@/components/FormattedMessage';
import ProgramingConfigure from '@/components/ProgramingConfiguer/ProgramingForm';
import ProgramingDndCard from './components/ProgramingDndCard';
import styles from './programing.module.less';

const ProgramingRelationModal = (props) => {
  const { relations, visible, onCancel, onConfirm, programing } = props;

  const [current, setCurrent] = useState(RelationTiming.begin);
  const [, { set: setConfiguration, get: getConfiguration }] = useMap([
    [RelationTiming.begin, []],
    [RelationTiming.onRoad, []],
    [RelationTiming.end, []],
  ]);

  function switchViewModel(checked) {
    setCurrent(checked);
  }

  function onDrop(dropResult) {
    const { removedIndex, addedIndex } = dropResult;
    if (removedIndex !== null || addedIndex !== null) {
      let newConfiguration = [...getConfiguration(current)];
      newConfiguration = customTaskApplyDrag(newConfiguration, dropResult);
      setConfiguration(current, newConfiguration);
    }
  }

  const add = useCallback(
    function(value) {
      const newConfiguration = [...getConfiguration(current)];
      setConfiguration(current, [...newConfiguration, value]);
    },
    [current],
  );

  function deleteConfiguration(inputIndex) {
    const configuration = getConfiguration(current);
    setConfiguration(
      current,
      configuration.filter((item, index) => index !== inputIndex),
    );
  }

  function renderSubTitle(rest, actionParameters) {
    return Object.keys(rest)
      .map((code) => {
        const specific = find(actionParameters, { code });
        return `${specific.name}: ${rest[code]}`;
      })
      .join('; ');
  }

  function generateDndData() {
    return getConfiguration(current).map((item) => {
      const { actionType, ...rest } = item;
      const [p1, p2] = actionType;
      const { actionParameters, actionDescription } = find(programing[p1], { actionId: p2 });
      return {
        title: `${formatMessage({ id: `editor.program.${p1}` })} / ${actionDescription}`,
        subTitle: renderSubTitle(rest, actionParameters),
      };
    });
  }

  return (
    <Modal
      title={`编辑线条编程: [ ${relations.join()} ]`}
      width={'60%'}
      closable={false}
      maskClosable={false}
      visible={visible}
      onCancel={onCancel}
      onOk={onConfirm}
      style={{ maxWidth: 1000, top: '5%' }}
    >
      <Radio.Group
        buttonStyle='solid'
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
        <Container
          dropPlaceholder={{
            showOnTop: true,
            animationDuration: 150,
            className: styles.dndPlaceholder,
          }}
          onDrop={(e) => onDrop(e)}
        >
          {generateDndData().map(({ title, subTitle }, index) => (
            <ProgramingDndCard
              key={`${title}-${index}`}
              index={index}
              title={title}
              subTitle={subTitle}
              onDelete={deleteConfiguration}
            />
          ))}
        </Container>
      )}

      {/*  点位编程配置面板 */}
      <Divider orientation={'left'}>配置面板</Divider>
      <ProgramingConfigure programing={programing} onAdd={add} />
    </Modal>
  );
};
export default connect(({ editor }) => ({
  programing: editor.programing,
}))(memo(ProgramingRelationModal));
