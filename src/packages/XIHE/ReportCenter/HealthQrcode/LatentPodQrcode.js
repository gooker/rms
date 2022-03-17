import React, { memo } from 'react';
import { formatMessage } from '@/utils/util';
import QrCodeComponent from '../components/QrCodeComponent';

const ToteQrcodeHealth = (props) => {
  return (
    <>
      <QrCodeComponent
        codeDomId="latenPodCodeByCellIdHistory"
        chartTitle={formatMessage({ id: 'reportCenter.qrcodehealth.latentPod' })}
        dateDomId="latentPodCodeBydateHistory"
        codeType="POD"
      />
    </>
  );
};
export default memo(ToteQrcodeHealth);
