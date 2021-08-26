import React, { Component } from 'react';

import { sortBy, forIn } from 'lodash';
import styles from '../translator.module.less';
// import { ReactGhLikeDiff } from 'react-gh-like-diff';
// import 'react-gh-like-diff/dist/css/diff2html.min.css';


export default class DiffToSaveModal extends Component {
  state = {
    diffData: {},
  };
  componentDidMount() {
    const result = this.count();
    this.setState({
        diffData:result
    })
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
    const { originData, execlData } = this.props;

    //将俩个数据的格式统一，方便对比
    let originalSource = originData.map((record) => {
        return {
            ...record.languageMap,
            languageKey:record.languageKey
        };
      });
  
    //处理目标函数
    let execlSource = execlData.map((record) => {
      return {
          ...record.languageMap,
          languageKey:record.languageKey
      };
    });
    originalSource = sortBy(originalSource, (o) => {
      return o.languageKey;
    });
    execlSource = sortBy(execlSource, (o) => {
      return o.languageKey;
    });
    const keys = ['languageKey', 'zh-CN', 'en-US', 'ko-KR', 'vi-VN'];
    return {
      oldSource: originalSource.map((record) => {
        return this.generateKey(record, keys);
      }),
      newSource: execlSource.map((record) => {
        return this.generateKey(record, keys);
      }),
    };
  };

  count = () => {
    const { originData, execlData } = this.props;
    //将俩个数据的格式统一，方便对比
    //首先倒转函数，处理数据,处理元数据
    const sour = {};
   forIn(originData, (value, key) => {
      forIn(value, (childValue, childKey) => {
        if (sour[childKey]) {
          sour[childKey][key] = childValue;
        } else {
          sour[childKey] = { languageKey: childKey };
          sour[childKey][key] = childValue;
        }
      });
    });
    let deal = [];
    forIn(sour, (value, key) => {
      deal.push(value);
    });
    //处理目标函数
    let tar = execlData.map(record => {
      delete record.languageMap;
      delete record.id;
      delete record.appCode;
      return record;
    });
    // debugger;
    deal = sortBy(deal, o => {
      return o.languageKey;
    });
    tar = sortBy(tar, o => {
      return o.languageKey;
    });
    const keys = ['languageKey', 'zh-CN', 'en-US', 'ko-KR', 'vi-VN'];
    return {
      current: deal.map(record => {
        return this.generateKey(record, keys);
      }),
      past: tar.map(record => {
        return this.generateKey(record, keys);
      }),
    };
  };

  getSplitContent=(value)=>{
   const contentList=[];
    Array.isArray(value) && value.map((val)=>{
        forIn(val,(k,i)=>{
            contentList.push(`${i}:${k}`)
        })
    })
    return contentList
  }
  render() {
      // const {diffData}=this.state;
    /*
        * {
            key.a:{

            }
        }
        *
        * */

    return (
      <div className={styles.diffJsoContent}>
        {/* {Object.keys(diffData).length>0 && diffData.map((item, index) => {
          const { value, added, removed } = item;
          const type = added ? 'add' : removed ? 'removed' : '';
          return (
            <span key={index} className={classnames(charColorMap[type], styles.diffJsontext)}>
               {this.getSplitContent(value)}
             
            </span>
          );
        })} */}
        {/* <ReactGhLikeDiff 
          options={{
            originalFileName: 'Before ',
            updatedFileName: 'After',
          }}
         past={JSON.stringify(diffData.oldSource)}
         current={JSON.stringify(diffData.newSource)}
        /> */}

      </div>
    );
  }
}
