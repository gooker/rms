import React, { memo, useEffect, useState } from 'react';
import { Button, Form, Select, Divider, Empty, Row } from 'antd';
import { cloneDeep, find, findIndex } from 'lodash';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { saveScopeProgram } from '@/services/XIHE';
import {
  isNull,
  dealResponse,
  formatMessage,
  isEmptyArray,
  isEmptyPlainObject,
  isStrictNull,
} from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import { ZoneMarkerType } from '@/config/consts';
import ActionDefiner from '../components/ActionDefiner';
import ScopeProgramList from '@/packages/XIHE/MapEditor/components/ScopeProgramList';

const ProgramingZone = (props) => {
  const { currentLogicArea, currentCells, scopeLoad, actions } = props;
  const zoneConfigLoad = scopeLoad?.detailMap?.zone || [];

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [zoneMarkers, setZoneMarkers] = useState([]);

  useEffect(() => {
    formRef.resetFields();
  }, [zoneConfigLoad]);

  useEffect(() => {
    // 暂时只处理矩形区域
    let zoneMarker = getCurrentLogicAreaData()?.zoneMarker || [];
    zoneMarker = zoneMarker.filter((item) => item.type === ZoneMarkerType.RECT);
    setZoneMarkers(zoneMarker);
  }, [currentLogicArea]);

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
        // 获取区域包含的点位
        const { zoneMarker } = getCurrentLogicAreaData();
        const zone = find(zoneMarker, { code: values.zoneCode });
        const { x, y, width, height } = zone;
        const endX = x + width;
        const endY = y + height;
        const zoneCells = currentCells
          .filter((item) => item.x >= x && item.y >= y && item.x <= endX && item.y <= endY)
          .map(({ id }) => id);

        // 先删选掉已经存在的点位配置数据
        const restZoneConfigLoad = [...zoneConfigLoad].filter(
          (item) => item.zoneCode !== values.zoneCode,
        );
        restZoneConfigLoad.push({ ...values, zoneCells });
        scopeLoad.detailMap.zone = restZoneConfigLoad;

        // request
        save(scopeLoad);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onZoneCodeChanged(zoneCode) {
    if (isNull(zoneCode)) {
      formRef.resetFields();
    } else {
      const zoneParam = find(zoneConfigLoad, { zoneCode });
      if (isNull(zoneParam)) {
        formRef.setFieldsValue({ scopeParams: [] });
      } else {
        formRef.setFieldsValue({ scopeParams: zoneParam.scopeParams });
      }
    }

    return zoneCode;
  }

  function getDatasource() {
    const dbZoneMarkers = getCurrentLogicAreaData()?.zoneMarker || [];
    if (Array.isArray(zoneConfigLoad)) {
      return zoneConfigLoad
        .map(({ zoneCode }) => {
          const dbZoneMarker = find(dbZoneMarkers, { code: zoneCode });
          if (dbZoneMarker) {
            return { code: zoneCode, name: dbZoneMarker.text };
          } else {
            console.log(`区域数据丢失: ${zoneCode}`);
          }
        })
        .filter(Boolean);
    }
    return [];
  }

  function onEdit(id) {
    const { zoneCode, scopeParams, zoneCells } = find(zoneConfigLoad, { zoneCode: id });
    formRef.setFieldsValue({ zoneCode, scopeParams, zoneCells });
  }

  function onDelete(id) {
    scopeLoad.detailMap.zone = zoneConfigLoad.filter((item) => item.zoneCode !== id);
    save(scopeLoad);
  }

  const dataSource = getDatasource();
  return (
    <div style={{ paddingTop: 20 }}>
      <Form labelWrap form={formRef} layout={'vertical'}>
        <Form.Item
          name={'zoneCode'}
          label={<FormattedMessage id={'app.map.zone'} />}
          rules={[{ required: true }]}
          getValueFromEvent={onZoneCodeChanged}
        >
          <Select allowClear>
            {zoneMarkers.map((item) => (
              <Select.Option key={item.code} value={item.code}>
                {item.text || item.code}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="scopeParams"
          label={formatMessage({ id: 'app.common.param' })}
          rules={[{ validator: validateParam }]}
        >
          <ActionDefiner data={actions} />
        </Form.Item>
      </Form>
      <Button type={'primary'} onClick={onSubmit} loading={loading} disabled={loading}>
        <FormattedMessage id={'app.button.confirm'} />
      </Button>

      {/* 区域配置列表 */}
      <Divider style={{ background: '#a3a3a3' }} />
      {dataSource.length === 0 ? (
        <Empty />
      ) : (
        <ScopeProgramList datasource={getDatasource()} onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  );
};
export default connect(({ editor }) => ({
  currentCells: editor.currentCells,
  currentLogicArea: editor.currentLogicArea,
}))(memo(ProgramingZone));
