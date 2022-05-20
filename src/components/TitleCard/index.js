import React, { memo } from 'react';
import style from './titleCard.module.less';

const TitleCard = (props) => {
  const { width = '100%', hidden = false, title, children } = props;

  if (hidden) {
    return children;
  }
  return (
    <div className={style.titleCard} style={{ width }}>
      <div className={style.title}>{title}</div>
      {children}
    </div>
  );
};
export default memo(TitleCard);
