import React, { Component } from 'react';
import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';
import { isEqual, map } from 'lodash';
import { Empty } from 'antd';

const width = document.body.clientWidth * 0.9;
const height = document.body.clientHeight - 376;

const getHeader = (columns) => {
  const excelHeader = map(columns, (record) => {
    return record.title;
  });
  return excelHeader;
};
const getColumns = (columns, data) => {
  return map(columns, (record) => {
    return {
      data: record.dataIndex,
      readOnly: record.readOnly,
      renderer: function (hotInstance, TD, row, col, prop, value, cellProperties) {
        TD.style.backgroundColor = data && data[value] ? '#c9dbea' : '';
        TD.innerHTML = value;
      },
    };
  });
};

const getColWidth = (columns) => {
  return columns
    .map((record) => {
      if (record.width) {
        return width * record.width;
      } else {
        return width * (1 / columns.length);
      }
    })
    .map((record) => {
      return record * 0.84;
    });
};

export default class ExcelTable extends Component {
  render() {
    const { dataSource, mergeData, editList, columns, uniqueKey, onChange } = this.props;
    return (
      <>
        <HotTable
          licenseKey={'non-commercial-and-evaluation'}
          data={dataSource}
          rowHeaders={true}
          width={width}
          height={height}
          columns={getColumns(columns, editList)}
          colHeaders={getHeader(columns)}
          colWidths={getColWidth(columns)}
          autoColumnSize={true}
          manualColumnMove={false}
          manualRowMove={true}
          manualRowResize={false}
          afterChange={(changes) => {
            if (changes != null && onChange) {
              const result = {};
              let currentValue = {};
              let flag = false;
              changes.forEach(([row, prop, oldValue, newValue]) => {
                if (oldValue !== newValue) {
                  currentValue = dataSource[row];
                  currentValue[prop] = newValue;
                  currentValue.languageMap[prop] = currentValue[prop];

                  const key = uniqueKey ? dataSource[row][uniqueKey] : row;
                  result[key] = currentValue;
                  const originalRow = mergeData.find((item) => item.languageKey === key);
                  if (originalRow) {
                    flag = isEqual(currentValue.languageMap, originalRow.languageMap);
                  }
                }
              });
              // 和源数据相同为true
              onChange(result, flag);
            }
            return true;
          }}
        />
        {dataSource.length === 0 ? (
          <Empty style={{ position: 'absolute', margin: '0 auto', top: '50%', left: '45%' }} />
        ) : null}
      </>
    );
  }
}
