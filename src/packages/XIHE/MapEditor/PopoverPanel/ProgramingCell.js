import React, { memo, useEffect, useState } from 'react';
import { Button, Divider, Form, Empty, InputNumber } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { debounce, find } from 'lodash';
import { connect } from '@/utils/RmsDva';
import {
  isNull,
  dealResponse,
  isEmptyArray,
  isStrictNull,
  formatMessage,
  isEmptyPlainObject,
} from '@/utils/util';
import { saveScopeProgram } from '@/services/XIHE';
import { MapSelectableSpriteType } from '@/config/consts';
import ActionDefiner from '../components/ActionDefiner';
import ScopeProgramList from '../components/ScopeProgramList';
import FormattedMessage from '@/components/FormattedMessage';
import SuperMultiSelect from '@/packages/XIHE/components/SuperMultiSelect';

const ProgramingCell = (props) => {
  const { scopeLoad, actions, selections } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState(null);

  const cellConfigLoad = scopeLoad?.detailMap?.cell || [];
  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ id }) => id);

  useEffect(() => {
    formRef.resetFields();
  }, [cellConfigLoad]);

  function save(payload) {
    setLoading(true);
    saveScopeProgram(payload)
      .then((response) => {
        dealResponse(response, true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function validateParam(_, value) {
    if (isNull(value)) {
      return Promise.resolve();
    }

    // 在没选类型情况下value是空数组
    if (isEmptyArray(value)) {
      return Promise.reject();
    } else {
      for (let i = 0; i < value.length; i++) {
        if (isEmptyPlainObject(value[i])) {
          return Promise.reject(new Error(formatMessage({ id: 'editor.program.action.required' })));
        }
        const { code, params } = value[i];
        const action = find(actions, { code });
        // 检查该action的参数是否可以为空
        const canBeEmpty = isEmptyPlainObject(action.params);
        if (!canBeEmpty && params.length === 0) {
          return Promise.reject(new Error(formatMessage({ id: 'editor.program.param.required' })));
        }
      }
      return Promise.resolve();
    }
  }

  function onSubmit() {
    formRef
      .validateFields()
      .then((values) => {
        const { cellCode, beforeArrive, arrived, beforeLeave } = values;
        // 先删选掉已经存在的点位配置数据
        const restCellConfigLoad = [...cellConfigLoad].filter(
          (item) => !cellCode.includes(item.cellCode),
        );
        cellCode.forEach((item) => {
          restCellConfigLoad.push({
            cellCode: item,
            beforeArrive,
            arrived,
            beforeLeave,
          });
        });
        scopeLoad.detailMap.cell = restCellConfigLoad;

        // request
        save(scopeLoad);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getDatasource() {
    let datasource = cellConfigLoad?.map(({ cellCode }) => cellCode) || [];
    if (!isStrictNull(searchKey)) {
      datasource = datasource.filter((item) => item === searchKey);
    }
    return datasource;
  }

  function onEdit(id) {
    const { cellCode, beforeArrive, arrived, beforeLeave } = find(cellConfigLoad, { cellCode: id });
    formRef.setFieldsValue({ cellCode: [cellCode], beforeArrive, arrived, beforeLeave });
  }

  function onDelete(id) {
    scopeLoad.detailMap.cell = cellConfigLoad.filter((item) => item.cellCode !== id);
    save(scopeLoad);
  }

  const dataSource = getDatasource();
  return (
    <div style={{ paddingTop: 20 }}>
      <Form labelWrap form={formRef} layout={'vertical'}>
        <Form.Item
          name={'cellCode'}
          label={<FormattedMessage id={'app.map.cell'} />}
          rules={[{ required: true }]}
          getValueFromEvent={(value) => {
            if (isEmptyArray(value)) {
              formRef.resetFields();
            }
            return value;
          }}
        >
          <SuperMultiSelect currentCellId={selectCellIds} />
        </Form.Item>

        {/* 到达前*/}
        <Form.Item
          name={'beforeArrive'}
          label={<FormattedMessage id={'editor.program.cell.beforeArrive'} />}
          rules={[{ validator: validateParam }]}
        >
          <ActionDefiner data={actions} />
        </Form.Item>

        {/* 到达后*/}
        <Form.Item
          name={'arrived'}
          label={<FormattedMessage id={'editor.program.cell.arrived'} />}
          rules={[{ validator: validateParam }]}
        >
          <ActionDefiner data={actions} />
        </Form.Item>

        {/* 离开前*/}
        <Form.Item
          name={'beforeLeave'}
          label={<FormattedMessage id={'editor.program.cell.beforeLeave'} />}
          rules={[{ validator: validateParam }]}
        >
          <ActionDefiner data={actions} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" loading={loading} disabled={loading} onClick={onSubmit}>
            <FormattedMessage id={'app.button.submit'} />
          </Button>
        </Form.Item>
      </Form>
      <Divider style={{ background: '#a3a3a3' }} />

      <InputNumber
        allowClear
        prefix={<SearchOutlined />}
        style={{ marginBottom: 10, width: '100%' }}
        value={searchKey}
        onChange={debounce((value) => {
          setSearchKey(value);
        }, 200)}
      />
      {dataSource.length === 0 ? (
        <Empty />
      ) : (
        <ScopeProgramList datasource={dataSource} onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  );
};
export default connect(({ editor }) => ({
  selections: editor.selections,
}))(memo(ProgramingCell));
