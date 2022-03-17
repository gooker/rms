import React, { memo } from 'react';
import { formatMessage } from '@/utils/util';
import QrCodeComponent from '../components/QrCodeComponent';

const ToteQrcodeHealth = (props) => {
  return (
    <>
      <QrCodeComponent
        codeDomId="groundCodeByCellIdHistory"
        chartTitle={formatMessage({ id: 'reportCenter.qrcodehealth' })}
        dateDomId="groundCodeBydateHistory"
        codeType="CELL"
      />
    </>
  );
};
export default memo(ToteQrcodeHealth);
