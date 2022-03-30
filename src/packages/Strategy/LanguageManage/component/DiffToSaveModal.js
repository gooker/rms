import React, { Component } from 'react';
import { Button } from 'antd';
import ReactDiffViewer from 'react-diff-viewer';
import { sortBy } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../translator.module.less';

export default class DiffToSaveModal extends Component {
  state = {
    diffData: {},
    loading: false,
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
    const { originData, allLanguage, editList } = this.props;

    //将俩个数据的格式统一，方便对比
    let oldSource = [];
    originData &&
      originData.map((record) => {
        if (editList && Object.keys(editList).includes(record.languageKey)) {
          oldSource.push({
            ...record.languageMap,
            languageKey: record.languageKey,
          });
        }
      });

    let newSource =
      editList &&
      Object.values(editList).map((record) => {
        return {
          languageKey: record.languageKey,
          ...record.languageMap,
        };
      });
    newSource = sortBy(newSource, (o) => {
      return o.languageKey;
    });
    oldSource = sortBy(oldSource, (o) => {
      return o.languageKey;
    });
    let keys = [...allLanguage];
    keys.unshift('languageKey');
    return {
      oldSource: oldSource.map((record) => {
        return this.generateKey(record, keys);
      }),
      newSource: newSource.map((record) => {
        return this.generateKey(record, keys);
      }),
    };
  };

  render() {
    const { diffData, loading } = this.state;

    return (
      <div className={styles.diffJsoContent}>
        <div className={styles.diffHeader}>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              this.setState({ loading: true });
              const { makeSureUpdate } = this.props;
              if (makeSureUpdate) {
                makeSureUpdate();
              }
              this.setState({ loading: false });
            }}
          >
            <FormattedMessage id="app.button.save" />
          </Button>
        </div>
        <ReactDiffViewer
          splitView={true}
          oldValue={JSON.stringify(diffData.oldSource, null, 4)}
          newValue={JSON.stringify(diffData.newSource, null, 4)}
          leftTitle="before"
          rightTitle="after"
        />
      </div>
    );
  }
}
