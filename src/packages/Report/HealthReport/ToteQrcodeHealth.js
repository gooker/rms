import React, { memo } from 'react';
import { formatMessage } from '@/utils/util';
import QrCodeComponent from '../components/QrCodeComponent';

const ToteQrcodeHealth = (props) => {
  return (
    <>
      <QrCodeComponent
        codeDomId="toteCodeByCellIdHistory"
        chartTitle={formatMessage({ id: 'reportCenter.qrcodehealth.tote' })}
        dateDomId="toteCodeBydateHistory"
        codeType="BIN"
      />
    </>
  );
};
export default memo(ToteQrcodeHealth);
