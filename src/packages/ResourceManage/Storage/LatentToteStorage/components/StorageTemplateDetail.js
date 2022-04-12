import FormattedMessage from '@/components/FormattedMessage';
import React, { memo, useEffect, useState } from 'react';
import { InputNumber, Checkbox, message, Button, Popover } from 'antd';
import { formatMessage, isNull, isStrictNull } from '@/utils/util';
import styles from '../latentToteStorage.module.less';

const LatentTotePodTemplateDetail = (props) => {
  const { binData, defaultHeight, detailChange } = props;
  const [allRowsNum, setAllRowsNum] = useState([]);
  const [newBinsData, setNewBinsData] = useState([]); // 是反转后的binsdata
  const [totalWeight, setTotalWeight] = useState(null); // 总承重+货架本身的重量
  const [selectedRow, setSelectedRow] = useState([]); // 选中的checkbox
  const [mergeVisible, setMergeVisible] = useState(false); // 选中的checkbox
  const [popVisible, setPopVisible] = useState(false); // popover
  const [inputValue, setInputValue] = useState(null);

  useEffect(() => {
    getTotalWeight();
    if (isNull(binData)) return;
    const currentBins = [...binData];
    generateRows(currentBins);
    setNewBinsData(currentBins.reverse());
  }, [binData]);

  function generateRows(bins) {
    let firstRow = [];
    bins?.forEach((item, index) => {
      firstRow.push(index + 1);
    });
    setAllRowsNum(firstRow.reverse());
  }

  function onCheckChange(e, value) {
    const checked = e.target.checked;
    let currentSelected = [...selectedRow];
    if (checked) {
      currentSelected = [...currentSelected, value];
    } else {
      currentSelected.splice(currentSelected.indexOf(value), 1);
    }

    const serialSet = new Set();
    currentSelected.sort((a, b) => a - b);
    currentSelected.length >= 2 &&
      currentSelected.reduce((prev, cur, index) => {
        if (cur - prev !== 1) {
          serialSet.add(1);
        }
        return cur;
      });
    if (serialSet.size === 1) {
      message.error(formatMessage({ id: 'latentTote.podTemplateStorage.storage.tip' }));
    }
    setMergeVisible(!(serialSet.size === 1) && currentSelected.length >= 1);
    setSelectedRow(currentSelected);
  }

  const content = (
    <div>
      <InputNumber
        size={'small'}
        addonAfter={formatMessage({ id: 'latentTote.podTemplateStorage.column' })}
        onChange={(e) => {
          setInputValue(e);
        }}
      />
      <div style={{ marginTop: 16 }}>
        <Button
          size={'small'}
          onClick={() => {
            setPopVisible(false);
          }}
        >
          <FormattedMessage id={'app.button.cancel'} />
        </Button>
        <Button size={'small'} style={{ marginLeft: 16 }} onClick={batchUpdateSubmit}>
          <FormattedMessage id={'app.button.confirm'} />
        </Button>
      </div>
    </div>
  );

  function batchUpdateSubmit() {
    let newBins = [];
    let prevHeight = 0;
    // 添加合并
    const currentFloor = allRowsNum.length - 1 - selectedRow[selectedRow.length - 1];
    newBinsData.forEach((rowBins, index) => {
      if (!selectedRow.includes(index)) {
        let currentArray = [];
        if (index <= currentFloor) {
          const currentIndex = allRowsNum.length - index - selectedRow.length;
          rowBins.forEach((currentCol, c) => {
            currentArray.push({
              ...currentCol,
              code: `A${getCharCode(currentIndex, c + 1)}`,
            });
          });
        } else {
          currentArray = [...rowBins];
        }
        newBins.push(currentArray);
      } else {
        prevHeight += rowBins[0].height;
      }
    });

    const currentRowArray = [];
    for (let c = 0; c < inputValue; c++) {
      currentRowArray.push({
        code: `A${getCharCode(currentFloor, c + 1)}`,
        height: prevHeight,
        width: 0,
        depth: 0,
        barycenterX: 0,
        barycenterY: 0,
        barycenterZ: 0,
      });
    }

    newBins.reverse().splice(currentFloor, 0, currentRowArray);
    // detailChange([...newBins], newBins.length);
    detailChange([...newBins]);
    setNewBinsData(newBins.reverse());
    clear();
  }
  function clear() {
    setInputValue(null);
    setPopVisible(false);
    setMergeVisible(false);
    setSelectedRow([]);
  }
  function getCharCode(i, c) {
    const charcode = String.fromCharCode(65 + i);
    const columNum = c >= 10 ? c : `0${c}`;
    return `${charcode}${columNum}`;
  }
  function getFloorHeight(idx) {
    let rowHeight = defaultHeight;
    newBinsData.map((rowdata, rowindex) => {
      if (rowindex === idx) rowHeight = rowdata[0]?.height;
    });
    return (rowHeight / defaultHeight) * 26;
  }

  function storageWeightChange(value, rowIndex) {
    const avarageWeight = value;
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
          totalWeight += Number(currentBearWeight);
        }
      });

      newBins.push(currentArray);
    });
    setNewBinsData(newBins);
    setTotalWeight(totalWeight * 2);

    detailChange([...newBins].reverse());
  }

  function getTotalWeight() {
    let totalWeight = 0;
    binData?.forEach((rowBins, index) => {
      rowBins.forEach((currentCol) => {
        if (!isStrictNull(currentCol?.bearWeight)) {
          totalWeight += Number(currentCol?.bearWeight);
        }
      });
    });
    setTotalWeight(totalWeight * 2);
  }

  return (
    <div style={{ padding: 10 }}>
      <div style={{ display: 'flex', marginTop: 20 }}>
        <div style={{ flex: 1 }}></div>
        <div className={styles.floorWeight} style={{ height: '28px' }}>
          {mergeVisible && (
            <Popover content={content} trigger="click" visible={popVisible}>
              <Button
                type="link"
                size={'small'}
                onClick={() => {
                  setPopVisible(true);
                }}
              >
                <FormattedMessage id="translator.languageManage.merge" />
              </Button>
            </Popover>
          )}

          {/* <FormattedMessage id="monitor.simulator.config.leve" /> */}
        </div>
        <div className={styles.storgelabel}>
          <FormattedMessage id="latentTote.podTemplateStorage.storageWeight" />
        </div>
      </div>
      {/* 放具体数据 */}
      <div style={{ display: 'flex', marginTop: 10 }}>
        <div className={styles.storageContainer}>
          {Array.isArray(newBinsData) &&
            newBinsData.map((rowdata, rowindex) => {
              let curentH = ((rowdata[0]?.height ?? 0) / defaultHeight) * 26; //每行的高度是一样
              return (
                <>
                  <div
                    key={rowindex}
                    style={{
                      display: 'flex',
                      height: `${curentH}px`,
                      lineHeight: `${curentH}px`,
                    }}
                    className={styles.floorContainr}
                  >
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
        {/* 层 */}
        <div className={styles.floorWeight}>
          {allRowsNum.map((floor, findex) => {
            let curentH = getFloorHeight(findex); //每行的高度是一样
            return (
              <div
                style={{ display: 'flex', height: `${curentH}px`, lineHeight: `${curentH}px` }}
                key={findex}
                className={styles.floorHeight}
              >
                <Checkbox
                  onChange={(e) => {
                    onCheckChange(e, findex);
                  }}
                  checked={selectedRow.includes(findex)}
                  style={{ padding: '0 5px' }}
                />
                <div key={findex}>{floor}</div>
              </div>
            );
          })}
        </div>
        {/* 储位承重 */}
        <div className={styles.storgelabel}>
          {Array.isArray(newBinsData) &&
            newBinsData.map((rowdata, rowindex) => {
              const curentValue = rowdata[0]?.bearWeight; //getCurrentFloorWeight(rowdata);
              return (
                <>
                  <div className={styles.floorHeight} key={`${rowindex}`}>
                    <InputNumber
                      key={`${rowindex}`}
                      size={'small'}
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
      {/* <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FormattedMessage id="latentTote.podTemplateStorage.bearingTotalweight" />
          <span style={{ marginLeft: 20 }}>
            {totalWeight}
            {'kg'}
          </span>
        </div>
      </div> */}
    </div>
  );
};
export default memo(LatentTotePodTemplateDetail);
