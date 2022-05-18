import React, { memo } from 'react';
import style from './titleCard.module.less';

const TitleCard = (props) => {
  const { title, children } = props;

  return <div>{children}</div>;
};
export default memo(TitleCard);
