/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Divider, Empty, Modal } from 'antd';
import { find } from 'lodash';
import { Container } from 'react-smooth-dnd';
import { connect } from '@/utils/RmsDva';
import { formatMessage, customTaskApplyDrag, isNull } from '@/utils/util';
import ProgramingDndCard from '../../../../components/ProgramingConfiguer/ProgramingDndCard';
import ProgramingConfigure from '@/components/ProgramingConfiguer/ProgramingForm';
import styles from '../../../../components/ProgramingConfiguer/programing.module.less';

const ProgramingZoneTab = (props) => {
  const { visible, onCancel, onConfirm, programing, editing } = props;
  const [configuration, setConfiguration] = useState([]);

  useEffect(() => {
    if (visible && !isNull(editing)) {
      const { actions } = editing;
      const configurations = [];
      actions.forEach(({ adapterType, actionType, actionParameters }) => {
        const addedItem = { actionType: [adapterType, actionType] };
        actionParameters.forEach(({ code, value }) => {
          addedItem[code] = value;
        });
        configurations.push(addedItem);
      });
      setConfiguration(configurations);
    } else {
      setConfiguration([]);
    }
  }, [visible]);

  function onDrop(dropResult) {
    const { removedIndex, addedIndex } = dropResult;
    if (removedIndex !== null || addedIndex !== null) {
      let newConfiguration = [...configuration];
      newConfiguration = customTaskApplyDrag(newConfiguration, dropResult);
      setConfiguration(newConfiguration);
    }
  }

  function renderSubTitle(rest, actionParameters) {
    return Object.keys(rest)
      .map((code) => {
        const specific = find(actionParameters, { code });
        return `${specific.name}: ${rest[code]}`;
      })
      .join('; ');
  }

  function add(value) {
    setConfiguration([...configuration, value]);
  }

  function deleteConfiguration(inputIndex) {
    setConfiguration(configuration.filter((item, index) => index !== inputIndex));
  }

  function generateDndData() {
    return configuration.map((item) => {
      const { actionType, ...rest } = item;
      const [p1, p2] = actionType;
      const { actionParameters, actionDescription } = find(programing[p1], { actionId: p2 });
      return {
        title: `${formatMessage({ id: `editor.program.${p1}` })} / ${actionDescription}`,
        subTitle: renderSubTitle(rest, actionParameters),
      };
    });
  }

  function confirm() {
    onConfirm(configuration);
    onCancel();
  }

  return (
    <Modal
      title={'编辑区域编程'}
      width={'60%'}
      closable={false}
      maskClosable={false}
      visible={visible}
      onCancel={onCancel}
      onOk={confirm}
      style={{ maxWidth: 1000, top: '5%' }}
    >
      {/*  点位编程配置信息 */}
      {configuration.length === 0 ? (
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
              key={title}
              index={index}
              title={title}
              subTitle={subTitle}
              onDelete={deleteConfiguration}
            />
          ))}
        </Container>
      )}

      {/*  点位编程配置面板 */}
      <Divider orientation={'left'}>配置工具</Divider>
      <ProgramingConfigure programing={programing} onAdd={add} />
    </Modal>
  );
};
export default connect(({ global }) => ({
  programing: global.programing || {},
}))(memo(ProgramingZoneTab));
