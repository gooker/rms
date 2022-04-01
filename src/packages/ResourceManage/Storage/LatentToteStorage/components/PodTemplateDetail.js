import FormattedMessage from '@/components/FormattedMessage';
import React, { memo, useEffect, useState } from 'react';
import { InputNumber } from 'antd';
import EditableCell from '@/packages/Strategy/LanguageManage/component/EditableCell/EditableCell';

import styles from '../latentToteStorage.module.less';
import { formatMessage, isNull, isStrictNull } from '@/utils/util';
const LatentTotePodTemplateDetail = (props) => {
  const { binData } = props;
  const [allColumnsNum, setAllColumnNum] = useState([]);
  const [newBinsData, setNewBinsData] = useState(binData);

  useEffect(() => {
    const { bins } = binData;
    if (isNull(bins)) return;
    let firstRow = [];
    bins?.forEach((item, index) => {
      firstRow.push(index + 1);
    });
    console.log(firstRow);
    setAllColumnNum(firstRow.reverse());
  }, [binData]);

  function getCurrentFloorWeight(rowdata) {
    let allFloorWeight = 0;
    rowdata.forEach((item) => {
      const currentBearWeight = isStrictNull(item?.bearWeight) ? 0 : item?.bearWeight;
      allFloorWeight += Number(currentBearWeight);
    });

    return allFloorWeight;
  }

  return (
    <div style={{ padding: 10 }}>
      <div style={{ display: 'flex', background: '#ccc', justifyContent: 'center', flex: 1 }}>
        {binData?.rows}
        <FormattedMessage id="monitor.simulator.config.leve" />
        <FormattedMessage id="app.pod" />
      </div>
      <div style={{ display: 'flex', marginTop: 20 }}>
        <div className={styles.floorWeight}>
          {' '}
          <FormattedMessage id="monitor.simulator.config.leve" />
        </div>
        <div style={{ flex: 1 }}></div>
        <div className={styles.floorWeight}>
          <FormattedMessage id="latentTote.podTemplateStorage.floorWeight" />
        </div>
      </div>
      {/* 放具体数据 */}
      <div style={{ display: 'flex', marginTop: 10 }}>
        {/* 层 */}
        <div className={styles.floorWeight}>
          {allColumnsNum.map((floor) => {
            return (
              <>
                <div className={styles.floorHeight} key={floor}>
                  {floor}
                </div>
              </>
            );
          })}
        </div>
        <div style={{ flex: 1 }}>
          {Array.isArray(binData?.bins) &&
            binData.bins.reverse()?.map((rowdata, rowindex) => {
              return (
                <>
                  <div key={rowindex} style={{ display: 'flex' }}>
                    {rowdata.map((coldata, colindex) => {
                      return (
                        <>
                          <div style={{ flex: 1, justifyContent: 'center', textAlign: 'center' }}>
                            {isStrictNull(coldata?.bearWeight) ? '-' : coldata?.bearWeight}
                          </div>
                        </>
                      );
                    })}
                  </div>
                </>
              );
            })}
        </div>
        {/* 层重 */}
        <div className={styles.floorWeight}>
          {Array.isArray(binData?.bins) &&
            binData.bins.reverse()?.map((rowdata, rowindex) => {
              const curentValue = getCurrentFloorWeight(rowdata);
              return (
                <>
                  <div className={styles.floorHeight} key={`${rowindex}`}>
                    <InputNumber
                      size={'small'}
                      bordered={false}
                      min={1}
                      value={curentValue === 0 ? '' : curentValue}
                      placeholder={formatMessage({ id: 'latentTote.podTemplateStorage.required' })}
                      onChange={(content) => {
                        // onChange(field, index, record, content, text);
                      }}
                    />
                  </div>
                </>
              );
            })}
        </div>
      </div>

      {/* 合计 */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FormattedMessage id="latentTote.podTemplateStorage.weight" />
          <span style={{ marginLeft: 20 }}>
            {binData.weight}
            {'kg'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FormattedMessage id="latentTote.podTemplateStorage.bearingTotalweight" />
          <span style={{ marginLeft: 20 }}>
            {'21'}
            {'kg'}
          </span>
        </div>
      </div>
    </div>
  );
};
export default memo(LatentTotePodTemplateDetail);
