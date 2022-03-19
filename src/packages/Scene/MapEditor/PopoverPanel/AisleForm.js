import React, { memo } from 'react';
import { Form, Input } from 'antd';
import { connect } from '@/utils/RmsDva';
import { MapSelectableSpriteType } from '@/config/consts';
import FormattedMessage from '@/components/FormattedMessage';
import ButtonInput from '@/components/ButtonInput/ButtonInput';
import { getCurrentRouteMapData } from '@/utils/mapUtil';
import { formatMessage } from '@/utils/util';
import styles from '../../../XIHE/popoverPanel.module.less';

const AisleForm = (props) => {
  const { dispatch, flag, aisle, aisles, mapContext, selectCellIds } = props;
  const [formRef] = Form.useForm();

  function onValuesChange(changedValues, allValues) {
    const currentTunnel = { ...allValues };
    if (!currentTunnel.tunnelName || currentTunnel?.cells?.length === 0) return;

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

  function customNameDuplicateValidator() {
    const existsTunnelNames = aisles.map(({ tunnelName }) => tunnelName);
    return {
      validator(_, value) {
        if (!existsTunnelNames.includes(value)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(formatMessage({ id: 'app.form.name.duplicate' })));
      },
    };
  }

  return (
    <div className={styles.formWhiteLabel}>
      <Form form={formRef} onValuesChange={onValuesChange} layout={'vertical'}>
        {/* 隐藏字段 */}
        <Form.Item hidden name={'flag'} initialValue={flag} />

        {/* 名称 */}
        <Form.Item
          name={'tunnelName'}
          initialValue={aisle?.tunnelName}
          label={formatMessage({ id: 'app.common.name' })}
          rules={[{ required: true }, customNameDuplicateValidator()]}
        >
          <Input />
        </Form.Item>

        {/* 点位 */}
        <Form.Item
          name={'cells'}
          initialValue={aisle?.cells || []}
          rules={[{ required: true }]}
          label={<FormattedMessage id="app.map.cell" />}
        >
          <ButtonInput
            maxTagCount={100}
            multi={true}
            data={selectCellIds}
            btnDisabled={selectCellIds.length === 0}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect(({ editor }) => {
  const { selections, mapContext } = editor;

  const currentScopeMapData = getCurrentRouteMapData();
  const aisles = currentScopeMapData?.tunnels ?? [];

  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ id }) => id);

  return { mapContext, selectCellIds, aisles };
})(memo(AisleForm));
