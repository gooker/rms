import React, { memo } from 'react';
import { Form, Input } from 'antd';
import { find, isEmpty } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { getCurrentRouteMapData } from '@/utils/mapUtil';
import { formatMessage, getRandomString } from '@/utils/util';
import { MapSelectableSpriteType } from '@/config/consts';
import FormattedMessage from '@/components/FormattedMessage';
import ButtonInput from '@/components/ButtonInput';
import styles from '../../popoverPanel.module.less';

const AisleForm = (props) => {
  const { dispatch, flag, aisle, mapContext, selectCellIds, selectRelations } = props;
  const [formRef] = Form.useForm();

  function onValuesChange(changedValues, allValues) {
    let currentTunnel = { ...allValues };
    if (!currentTunnel.tunnelName || currentTunnel?.cells?.length === 0) return;
    // TODO: 避让方向和避让规则选择的线条，必定有同一个起点

    // 避让方向
    let tmpData = null;
    if (Array.isArray(currentTunnel.giveWayCellMap) && !isEmpty(currentTunnel.giveWayCellMap)) {
      tmpData = {};
      currentTunnel.giveWayCellMap.forEach((item) => {
        const [begin, end] = item.split('-');
        tmpData[begin] = parseInt(end);
      });
    }
    currentTunnel.giveWayCellMap = tmpData;

    // 避让规则
    tmpData = null;
    const { relations } = getCurrentRouteMapData();
    if (
      Array.isArray(currentTunnel.giveWayRelationMap) &&
      !isEmpty(currentTunnel.giveWayRelationMap)
    ) {
      tmpData = {};
      currentTunnel.giveWayRelationMap.forEach((item) => {
        const [source, target] = item.split('-');
        tmpData[source] = find(relations, {
          source: parseInt(source),
          target: parseInt(target),
        });
      });
    }
    currentTunnel.giveWayRelationMap = tmpData;

    dispatch({
      type: 'editor/updateFunction',
      payload: { scope: 'route', type: 'tunnels', data: currentTunnel },
    }).then((result) => {
      if (result.type === 'add') {
        mapContext.renderTunnel([result.payload], false, 'add');
      }
      if (result.type === 'update') {
        const { pre, current } = result;
        mapContext.renderTunnel([pre], false, 'remove');
        mapContext.renderTunnel([current], false, 'add');
      }
      mapContext.refresh();
    });
  }

  return (
    <div className={styles.formWhiteLabel}>
      <Form form={formRef} onValuesChange={onValuesChange} layout={'vertical'}>
        {/* 隐藏字段 */}
        <Form.Item hidden name={'flag'} initialValue={flag} />

        {/* 编码 */}
        <Form.Item
          hidden
          name={'code'}
          initialValue={aisle?.code || `tunnel${getRandomString(6)}${flag}`}
        />

        {/* 名称 */}
        <Form.Item
          name={'tunnelName'}
          initialValue={aisle?.tunnelName}
          label={formatMessage({ id: 'app.common.name' })}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        {/* 点位 */}
        <Form.Item
          name={'cells'}
          initialValue={aisle?.cells || []}
          rules={[{ required: true }]}
          label={<FormattedMessage id='app.map.cell' />}
        >
          <ButtonInput
            maxTagCount={100}
            multi={true}
            data={selectCellIds}
            btnDisabled={selectCellIds.length === 0}
          />
        </Form.Item>

        {/* 避让点*/}
        <Form.Item
          name={'giveWayCellMap'}
          // initialValue={aisle?.cells || []}
          rules={[{ required: true }]}
          label={<FormattedMessage id='editor.tunnel.giveWay' />}
        >
          <ButtonInput
            maxTagCount={100}
            multi={true}
            data={selectRelations}
            btnDisabled={selectRelations.length === 0}
          />
        </Form.Item>

        {/* 避让方向 */}
        <Form.Item
          name={'giveWayRelationMap'}
          // initialValue={aisle?.cells || []}
          rules={[{ required: true }]}
          label={<FormattedMessage id='editor.tunnel.giveWayDirection' />}
        >
          <ButtonInput
            maxTagCount={100}
            multi={true}
            data={selectRelations}
            btnDisabled={selectRelations.length === 0}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect(({ editor }) => {
  const { selections, mapContext } = editor;

  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ id }) => id);

  const selectRelations = selections
    .filter((item) => item.type === MapSelectableSpriteType.ROUTE)
    .map(({ id }) => id);

  return { mapContext, selectCellIds, selectRelations };
})(memo(AisleForm));
