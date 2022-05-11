/* TODO: I18N */
import React, { memo, useState } from 'react';
import { Divider, Empty, Modal } from 'antd';
import { find } from 'lodash';
import { Container } from 'react-smooth-dnd';
import { customTaskApplyDrag, formatMessage } from '@/utils/util';
import ProgramingDndCard from './components/ProgramingDndCard';
import ProgramingConfigure from '@/components/ProgramingConfiguer/ProgramingForm';
import styles from './programing.module.less';
import { connect } from '@/utils/RmsDva';
import { ProgramingItemType } from '@/config/config';

const ProgramingCellModal = (props) => {
  const { dispatch, cells, visible, onCancel, onConfirm, programing } = props;
  const [configuration, setConfiguration] = useState([]);

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

  function confirm() {
    dispatch({
      type: 'editor/updateMapPrograming',
      payload: { type: ProgramingItemType.cell, items: cells, configuration },
    });
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

  return (
    <Modal
      title={`编辑点位编程: [ ${cells.join()} ]`}
      width={'60%'}
      closable={false}
      maskClosable={false}
      visible={visible}
      onCancel={onCancel}
      onOk={onConfirm}
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
export default connect(({ editor }) => ({
  programing: editor.programing,
}))(memo(ProgramingCellModal));
