import React, { memo, useEffect } from 'react';
import { Modal } from 'antd';
import ReactDiffViewer from 'react-diff-viewer';
import { sortBy } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import { adjustModalWidth } from '@/utils/util';

const DiffToSaveModal = (props) => {
  const { visible, onCancel, makeSureUpdate, originData, allLanguage, editList } = props;

  const [diffData, setDiffData] = React.useState([]);

  useEffect(() => {
    if (visible) {
      setDiffData(getData());
    }
  }, [visible]);

  function generateKey(record, keys) {
    const result = {};
    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];
      if (record[element]) {
        result[element.trim()] = record[element.trim()].trim();
      }
    }
    return result;
  }

  function getData() {
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
        return generateKey(record, keys);
      }),
      newSource: newSource.map((record) => {
        return generateKey(record, keys);
      }),
    };
  }

  return (
    <Modal
      destroyOnClose
      width={adjustModalWidth()}
      title={<FormattedMessage id={'translator.languageManage.diffResult'} />}
      style={{ top: 20 }}
      maskClosable={false}
      closable={false}
      visible={visible}
      onCancel={onCancel}
      onOk={makeSureUpdate}
    >
      <div style={{ height: '73vh', overflow: 'auto' }}>
        <ReactDiffViewer
          splitView={true}
          oldValue={JSON.stringify(diffData.oldSource, null, 4)}
          newValue={JSON.stringify(diffData.newSource, null, 4)}
          leftTitle="before"
          rightTitle="after"
        />
      </div>
    </Modal>
  );
};
export default memo(DiffToSaveModal);
