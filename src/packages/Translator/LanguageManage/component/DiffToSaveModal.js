import React, { Component } from 'react';
import { Button } from 'antd';
import ReactDiffViewer from 'react-diff-viewer';
import { sortBy } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../translator.module.less';

export default class DiffToSaveModal extends Component {
  state = {
    diffData: {},
  };
  componentDidMount() {
    const result = this.getData();
    this.setState({
      diffData: result,
    });
  }

  generateKey(record, keys) {
    const result = {};
    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];
      if (record[element]) {
        result[element.trim()] = record[element.trim()].trim();
      }
    }
    return result;
  }
  getData = () => {
    const { originData, execlData,allLanguage ,editList} = this.props;

    //将俩个数据的格式统一，方便对比
    let orrSource=[]

    let originalSource =
      originData &&
      originData.map((record) => {
        if(editList && Object.keys(editList).includes(record.languageKey)){
          orrSource.push({
            ...record.languageMap,
            languageKey: record.languageKey,
          })
        }
        return {
          ...record.languageMap,
          languageKey: record.languageKey,
        };
      });
      let currenEditList = editList && Object.values(editList).map((record) => {
        return {
          languageKey: record.languageKey,
           ...record.languageMap,
        };
      });
    //处理目标函数
    let execlSource =
      execlData &&
      execlData.map((record) => {
        return {
          ...record.languageMap,
          languageKey: record.languageKey,
        };
      });
    originalSource = sortBy(originalSource, (o) => {
      return o.languageKey;
    });
    execlSource = sortBy(execlSource, (o) => {
      return o.languageKey;
    });
    currenEditList = sortBy(currenEditList, (o) => {
      return o.languageKey;
    });
    orrSource = sortBy(orrSource, (o) => {
      return o.languageKey;
    });
    let keys =[...allLanguage];
    keys.unshift('languageKey')
    return {
      oldSource: originalSource.map((record) => {
        return this.generateKey(record, keys);
      }),
      newSource: execlSource.map((record) => {
        return this.generateKey(record, keys);
      }),
      orrSource: orrSource.map((record) => {
        return this.generateKey(record, keys);
      }),
      editSource: currenEditList.map((record) => {
        return this.generateKey(record, keys);
      }),
    };
  };

  render() {
    const { diffData } = this.state;
    /*
        * {
            key.a:{

            }
        }
        *
        * */

    return (
      <div className={styles.diffJsoContent}>
        {/* 放button */}
        <div className={styles.diffHeader}>
          <Button type="primary" onClick={()=>{
            const {makeSureUpdate}=this.props;
            if(makeSureUpdate){
              makeSureUpdate()
            }
          }}>
            <FormattedMessage id="app.button.save" />
          </Button>
        </div>
        <ReactDiffViewer
          splitView={true}
          oldValue={JSON.stringify(diffData.orrSource, null, 4)}
          newValue={JSON.stringify(diffData.editSource, null, 4)}
          leftTitle="before"
          rightTitle="after"
          styles={{ display: 'over' }}
        />
      </div>
    );
  }
}
