import React, { memo } from 'react';
import { Container } from 'react-smooth-dnd';
import { find, isEmpty } from 'lodash';
import { customTaskApplyDrag, formatMessage, isNull } from '@/utils/util';
import ProgramingDndCard from './ProgramingDndCard';
import FormattedMessage from '@/components/FormattedMessage';
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
    if (isEmpty(actionParameters)) {
      return <FormattedMessage id={'app.programing.noParam'} />;
    }
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
      let title = `${formatMessage({ id: `editor.program.${p1}` })} / ${actionDescription}`;
      if (!isNull(operateType)) {
        title = `${formatMessage({ id: `customTasks.operationType.${operateType}` })} / ` + title;
      }
      return {
        title,
        subTitle: Array.isArray(actionParameters)
          ? renderSubTitle(rest, actionParameters)
          : formatMessage({ id: 'app.programing.noParam' }),
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
