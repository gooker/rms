import React, { memo, useEffect, useState } from 'react';
import { Button, Divider, Empty, Form, Input, InputNumber, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import {
  dealResponse,
  formatMessage,
  isEmptyArray,
  isEmptyPlainObject,
  isNull,
  isStrictNull,
} from '@/utils/util';
import ActionDefiner from '@/packages/Scene/MapEditor/components/ActionDefiner';
import { MapSelectableSpriteType } from '@/config/consts';
import { saveScopeProgram } from '@/services/XIHE';
import { debounce, find } from 'lodash';
import ScopeProgramList from '@/packages/Scene/MapEditor/components/ScopeProgramList';
import SuperMultiSelect from '@/packages/Scene/components/SuperMultiSelect';

const ProgramingRelation = (props) => {
  const { scopeLoad, actions, selections } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState(null);

  const relationConfigLoad = scopeLoad?.detailMap?.relation || [];
  const selectLines = selections
    .filter((item) => item.type === MapSelectableSpriteType.ROUTE)
    .map(({ id }) => id);

  useEffect(() => {
    formRef.resetFields();
  }, [relationConfigLoad]);

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
        const { relationCode, begin, end } = values;
        // 先删选掉已经存在的线条配置数据
        const restRelationConfigLoad = [...relationConfigLoad].filter(
          (item) => !relationCode.includes(item.relationCode),
        );
        relationCode.forEach((item) => {
          restRelationConfigLoad.push({
            relationCode: item,
            begin: begin || [],
            end: end || [],
          });
        });
        scopeLoad.detailMap.relation = restRelationConfigLoad;

        // request
        save(scopeLoad);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getDatasource() {
    let datasource = relationConfigLoad?.map(({ relationCode }) => relationCode) || [];
    if (!isStrictNull(searchKey)) {
      // 根据数据数字(点位ID)筛选出相关联的线条
      datasource = datasource.filter((item) => {
        return item
          .split('-')
          .map((item) => parseInt(item))
          .includes(searchKey);
      });
    }
    return datasource;
  }

  function onEdit(id) {
    const { relationCode, begin, end } = find(relationConfigLoad, {
      relationCode: id,
    });
    formRef.setFieldsValue({ relationCode: [relationCode], begin, end });
  }

  function onDelete(id) {
    scopeLoad.detailMap.relation = relationConfigLoad.filter((item) => item.relationCode !== id);
    save(scopeLoad);
  }

  const dataSource = getDatasource();
  return (
    <div style={{ paddingTop: 20 }}>
      <Form labelWrap form={formRef} layout={'vertical'}>
        <Form.Item
          name={'relationCode'}
          label={<FormattedMessage id={'app.map.route'} />}
          getValueFromEvent={(value) => {
            if (isEmptyArray(value)) {
              formRef.resetFields();
            }
            return value;
          }}
        >
          <SuperMultiSelect currentCellId={selectLines} />
        </Form.Item>
        {/* 起点 */}
        <Form.Item name="begin" label={formatMessage({ id: 'editor.program.relation.begin' })}>
          <ActionDefiner data={actions} />
        </Form.Item>
        {/* 起点 */}
        <Form.Item name="end" label={formatMessage({ id: 'editor.program.relation.end' })}>
          <ActionDefiner data={actions} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={onSubmit}>
            <FormattedMessage id={'app.button.confirm'} />
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
}))(memo(ProgramingRelation));
