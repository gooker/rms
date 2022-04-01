import FormattedMessage from '@/components/FormattedMessage';
import React, { memo, useEffect, useState } from 'react';
import { InputNumber } from 'antd';
import { formatMessage, isNull, isStrictNull } from '@/utils/util';
import styles from '../latentToteStorage.module.less';

const LatentTotePodTemplateDetail = (props) => {
  const {
    binData,
    binData: { rows, columns, weight, bins },
    detailChange,
  } = props;
  const [allRowsNum, setAllRowsNum] = useState([]);
  const [newBinsData, setNewBinsData] = useState([]); // 是反转后的binsdata
  const [totalWeight, setTotalWeight] = useState(null); // 总承重+货架本身的重量

  useEffect(() => {
    getTotalWeight();
    if (isNull(bins)) return;
    let firstRow = [];
    const currentBins = [...bins];
    bins?.forEach((item, index) => {
      firstRow.push(index + 1);
    });
    setAllRowsNum(firstRow.reverse());
    setNewBinsData(currentBins.reverse());
  }, [binData]);

  function getCurrentFloorWeight(rowdata) {
    let allFloorWeight = 0;
    rowdata.forEach((item) => {
      const currentBearWeight = isStrictNull(item?.bearWeight) ? 0 : item?.bearWeight;
      allFloorWeight += Number(currentBearWeight);
    });

    return allFloorWeight * 2;
  }

  function storageWeightChange(value, rowIndex) {
    const avarageWeight = Math.floor(value / (columns * 2));
    const currentIndex = rowIndex;
    let newBins = [];
    let totalWeight = 0;
    newBinsData.forEach((rowBins, index) => {
      let currentArray = [];
      rowBins.forEach((currentCol) => {
        const currentBearWeight = currentIndex === index ? avarageWeight : currentCol.bearWeight;
        currentArray.push({
          ...currentCol,
          bearWeight: currentBearWeight,
        });

        if (!isStrictNull(currentBearWeight)) {
          totalWeight += currentBearWeight;
        }
      });

      newBins.push(currentArray);
    });
    setNewBinsData(newBins);
    setTotalWeight(totalWeight * 2 + weight);

    detailChange({ ...binData, bins: [...newBins].reverse() });
  }

  function getTotalWeight() {
    let totalWeight = 0;
    bins?.forEach((rowBins, index) => {
      rowBins.forEach((currentCol) => {
        if (!isStrictNull(currentCol?.bearWeight)) {
          totalWeight += currentCol?.bearWeight;
        }
      });
    });
    setTotalWeight(totalWeight * 2 + weight);
  }

  return (
    <div style={{ padding: 10 }}>
      {/* <div style={{ display: 'flex', background: '#ccc', justifyContent: 'center', flex: 1 }}>
        {rows}
        <FormattedMessage id="monitor.simulator.config.leve" />
        <FormattedMessage id="app.pod" />
      </div> */}
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
          {allRowsNum.map((floor) => {
            return (
              <>
                <div className={styles.floorHeight} key={floor}>
                  {floor}
                </div>
              </>
            );
          })}
        </div>
        <div className={styles.storageContainer}>
          {Array.isArray(newBinsData) &&
            newBinsData.map((rowdata, rowindex) => {
              return (
                <>
                  <div key={rowindex} style={{ display: 'flex' }} className={styles.floorContainr}>
                    {rowdata.map((coldata, colindex) => {
                      return (
                        <>
                          <div className={styles.binContain} key={colindex}>
                            {isStrictNull(coldata?.bearWeight) ? '' : coldata?.bearWeight}
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
          {Array.isArray(newBinsData) &&
            newBinsData.map((rowdata, rowindex) => {
              const curentValue = getCurrentFloorWeight(rowdata);
              return (
                <>
                  <div className={styles.floorHeight} key={`${rowindex}`}>
                    <InputNumber
                      key={`${rowindex}`}
                      size={'small'}
                      bordered={false}
                      min={1}
                      value={curentValue === 0 ? '' : curentValue}
                      placeholder={formatMessage({ id: 'latentTote.podTemplateStorage.required' })}
                      onBlur={(ev) => {
                        storageWeightChange(ev.target.value, rowindex);
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
            {weight}
            {'kg'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FormattedMessage id="latentTote.podTemplateStorage.bearingTotalweight" />
          <span style={{ marginLeft: 20 }}>
            {totalWeight}
            {'kg'}
          </span>
        </div>
      </div>
    </div>
  );
};
export default memo(LatentTotePodTemplateDetail);
