/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Modal, Empty, Divider } from 'antd';
import { Container } from 'react-smooth-dnd';
import { find } from 'lodash';
import { customTaskApplyDrag, formatMessage, isNull } from '@/utils/util';
import ProgramingDndCard from './ProgramingDndCard';
import ProgramingConfigure from './ProgramingForm';
import styles from './programing.module.less';

/**
 * 默认导出一个弹窗组件
 * @param props
 * @param editing 正在编辑的对象数据
 * @param title 弹窗Title
 * @param visible 弹窗是否可见
 * @param onOk 弹窗确定按钮
 * @param onCancel 弹窗取消按钮
 * @param width 弹窗宽度
 * @param programing 编程元数据
 */
const ProgramingConfiguerModal = (props) => {
  const { editing, title, visible, onOk, onCancel, width, programing } = props;
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

  function addConfiguration(value) {
    if (Array.isArray(value)) {
      setConfiguration([...configuration, ...value]);
    } else {
      setConfiguration([...configuration, value]);
    }
  }

  function deleteConfiguration(inputIndex) {
    setConfiguration(configuration.filter((item, index) => index !== inputIndex));
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
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={width}
      style={{ maxWidth: 1000, top: '5%' }}
    >
      {/*  点位编程配置信息 */}
      {configuration.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
      <Divider orientation={'left'}>配置工具</Divider>
      <ProgramingConfigure programing={programing} onAdd={addConfiguration} />
    </Modal>
  );
};
export default memo(ProgramingConfiguerModal);

// eslint-disable-next-line react/display-name
const ProgramingConfiguer = memo((props) => {

  //
});
export { ProgramingConfiguer };
