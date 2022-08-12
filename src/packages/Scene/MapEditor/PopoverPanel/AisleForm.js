import React, { memo } from 'react';
import { Form, Input } from 'antd';
import { connect } from '@/utils/RmsDva';
import { getIdByNaviId, getNaviIdById } from '@/utils/mapUtil';
import { formatMessage, getRandomString } from '@/utils/util';
import { MapSelectableSpriteType } from '@/config/consts';
import ButtonInput from '@/components/ButtonInput';
import styles from '../../popoverPanel.module.less';
import { isPlainObject } from 'lodash';

const AisleForm = (props) => {
  const { dispatch, flag, aisle, cellMap, mapContext, selectCellIds, selectRelations } = props;
  const [formRef] = Form.useForm();

  function onValuesChange() {
    setTimeout(() => {
      formRef
        .validateFields()
        .then((value) => {
          const currentTunnel = { ...value };
          // 这里的点位是导航ID，需要转换成业务ID
          currentTunnel.cells = currentTunnel.cells.map((item) => getIdByNaviId(item, cellMap));

          // 避让方向
          // TIPS: 注意这里使用的是业务ID
          let tmpData = null;
          if (Array.isArray(currentTunnel.giveWayCellMap)) {
            tmpData = {};
            currentTunnel.giveWayCellMap.forEach((item) => {
              const [begin, end] = item.split('-');
              tmpData[begin] = parseInt(end);
            });
          }
          currentTunnel.giveWayCellMap = tmpData;

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
        })
        .catch(() => {
        });
    });
  }

  // 将导航Id转回到业务id
  function convertToLand(cellIds) {
    if (Array.isArray(cellIds)) {
      return cellIds.map((item) => getNaviIdById(item, cellMap));
    }
    return [];
  }

  //TIPS: 这里并没有
  function getGiveWayCellMap(map) {
    if (isPlainObject(map)) {
      return Object.entries(map).map(([source, target]) => `${source}-${target}`);
    }
    return [];
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
          initialValue={convertToLand(aisle?.cells)}
          rules={[{ required: true }]}
          label={formatMessage({ id: 'app.map.cell' })}
        >
          <ButtonInput
            multi
            maxTagCount={100}
            data={selectCellIds}
            btnDisabled={selectCellIds.length === 0}
          />
        </Form.Item>

        {/* 避让方向*/}
        <Form.Item
          name={'giveWayCellMap'}
          label={formatMessage({ id: 'editor.tunnel.giveWay' })}
          initialValue={getGiveWayCellMap(aisle?.giveWayCellMap)}
        >
          <ButtonInput
            multi
            maxTagCount={100}
            data={selectRelations}
            btnDisabled={selectRelations.length === 0}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect(({ editor }) => {
  const { selections, mapContext, currentMap } = editor;

  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ naviId }) => naviId);

  const selectRelations = selections
    .filter((item) => item.type === MapSelectableSpriteType.ROUTE)
    .map(({ id }) => id);

  return { cellMap: currentMap.cellMap, mapContext, selectCellIds, selectRelations };
})(memo(AisleForm));
