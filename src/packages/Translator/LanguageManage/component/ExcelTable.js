import React, { Component } from 'react';
import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';
import _ from 'lodash';
import { Empty } from 'antd';

const width = document.body.clientWidth*0.9;

const getHeader = (columns) => {
  const excelHeader = _.map(columns, (record) => {
    return record.title;
  });
  return excelHeader;
};
const getColumns = (columns,data) => {
  return _.map(columns, (record) => {
    return {
      data: record.dataIndex,
      readOnly: record.readOnly,
      renderer: function(hotInstance, TD, row, col, prop, value, cellProperties) {
        TD.style.backgroundColor =data && data[value]? '#c9dbea':"";
        TD.innerHTML = value;
      }
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
      return record * 0.74;
    });
};

export default class ExcelTable extends Component {
  render() {
    const { dataSource, editList,columns,uniqueKey,onChange } = this.props;
    return (
      <>
        <HotTable
          licenseKey={'non-commercial-and-evaluation'}
          data={dataSource}
          colHeaders={true}
          rowHeaders={true}
          width={width}
          columns={getColumns(columns,editList)}
          colHeaders={getHeader(columns)}
          colWidths={getColWidth(columns)}
          autoColumnSize={true}
          height="600"
          manualColumnMove= {true}
          manualRowMove={true}
          manualRowResize={true}
          afterChange={changes => {
            if (changes != null && onChange) {
                let newDataSource = {...dataSource};
                const result = {};
                let flag=false;
                changes.forEach(([row, prop, oldValue, newValue]) => {
                    if(oldValue!==newValue){
                        const currentValue = newDataSource[row];
                        currentValue[prop]=newValue;
                        currentValue.languageMap[prop]=currentValue[prop];
                        const key = uniqueKey ? newDataSource[row][uniqueKey] : row;
                        result[key] = currentValue;
                    }
                });
                onChange(result,flag);
            }
            return true;
          }}
        />
      </>
    );
  }
}
