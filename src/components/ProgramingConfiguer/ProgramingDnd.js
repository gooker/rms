import React, { memo } from 'react';
import { Container } from 'react-smooth-dnd';
import { find } from 'lodash';
import { customTaskApplyDrag, formatMessage } from '@/utils/util';
import ProgramingDndCard from './ProgramingDndCard';
import styles from './programing.module.less';

const ProgramingDnd = (props) => {
  const { value, onChange, programing } = props;

  function onDrop(dropResult) {
    const { removedIndex, addedIndex } = dropResult;
    if (removedIndex !== null || addedIndex !== null) {
      const newConfiguration = customTaskApplyDrag([...value], dropResult);
      onChange(newConfiguration);
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

  function generateDndData() {
    return value.map((item) => {
      const { actionType, operateType, ...rest } = item;
      const [p1, p2] = actionType;
      const { actionParameters, actionDescription } = find(programing[p1], { actionId: p2 });
      return {
        title: `${formatMessage({ id: `editor.program.${p1}` })} / ${actionDescription}`,
        subTitle: renderSubTitle(rest, actionParameters),
      };
    });
  }

  function deleteConfiguration(inputIndex) {
    const newConfiguration = [...value];
    onChange(newConfiguration.filter((item, index) => index !== inputIndex));
  }

  return (
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
  );
};
export default memo(ProgramingDnd);
