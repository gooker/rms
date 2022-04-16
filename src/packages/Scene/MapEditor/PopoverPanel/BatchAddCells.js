import React, { memo, useEffect, useState } from 'react';
import { Divider, Form, Radio, InputNumber, Select, Button, Switch } from 'antd';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, getFormLayout } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import styles from '../../popoverPanel.module.less';
import { MapSelectableSpriteType } from '@/config/consts';
import DirectionSelector from '@/packages/Scene/components/DirectionSelector';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(9, 15);
const BatchAddCells = (props) => {
  const { dispatch, mapContext, navigationCellType } = props;
  const [formRef] = Form.useForm();

  const [addWay, setAddWay] = useState('absolute');

  function submit(value) {
    formRef.validateFields().then((values) => {
      dispatch({
        type: 'editor/batchAddCells',
        payload: { ...value, ...values },
      }).then(({ centerMap, additionalCells }) => {
        mapContext.updateCells({
          type: 'add',
          payload: {
            type: values.navigationCellType,
            cells: additionalCells,
          },
        });
        centerMap && mapContext.centerView();
      });
    });
  }

  return (
    <div className={styles.formWhiteLabel}>
      <Form form={formRef} {...formItemLayout}>
        <Form.Item
          name={'addWay'}
          label={<FormattedMessage id="editor.batchAddCell.addWay" />}
          initialValue={'absolute'}
          getValueFromEvent={(value) => {
            setAddWay(value);
            return value;
          }}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={'absolute'}>
              <FormattedMessage id="editor.batchAddCell.addWay.absolute" />
            </Radio.Button>
            <Radio.Button value={'offset'}>
              <FormattedMessage id="editor.batchAddCell.addWay.offset" />
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name={'navigationCellType'}
          label={formatMessage({ id: 'editor.navigationCellType' })}
          initialValue={navigationCellType[0].code}
        >
          <Select style={{ width: 133 }}>
            {navigationCellType.map(({ code, name }, index) => (
              <Select.Option key={index} value={code}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={'syncAsController'}
          label={formatMessage({ id: 'editor.batchAddCell.syncAsController' })}
          initialValue={'true'}
          valuePropName={'checked'}
        >
          <Switch />
        </Form.Item>
      </Form>
      <Divider style={{ margin: '15px 0' }} />
      {addWay === 'absolute' ? (
        <BatchAddCellWithAbsolut submit={submit} />
      ) : (
        <BatchAddCellWithOffset submit={submit} />
      )}
    </div>
  );
};
export default connect(({ global, editor }) => {
  const { mapContext } = editor;

  return {
    mapContext,
    navigationCellType: global.navigationCellType,
  };
})(memo(BatchAddCells));

const BatchAddCellWithAbsolut = connect(({ editor }) => ({
  currentLogicArea: editor.currentLogicArea,
}))((props) => {
  const { currentLogicArea } = props;
  const [formRef] = Form.useForm();

  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(0);

  useEffect(() => {
    const currentLogicAreaData = getCurrentLogicAreaData();
    if (currentLogicAreaData) {
      formRef.setFieldsValue({
        autoGenCellIdStart: currentLogicAreaData.rangeStart,
      });
      setRangeStart(currentLogicAreaData.rangeStart);
      setRangeEnd(currentLogicAreaData.rangeEnd);
    }
  }, [currentLogicArea]);

  function submit() {
    formRef.validateFields().then((value) => {
      props.submit(value);
    });
  }

  return (
    <Form labelWrap form={formRef} {...formItemLayout}>
      {/* 起始点 */}
      <Form.Item
        name="autoGenCellIdStart"
        label={formatMessage({ id: 'editor.batchAddCell.firstCode' })}
        rules={[{ required: true }]}
      >
        <InputNumber min={rangeStart} max={rangeEnd} style={{ width: 150 }} />
      </Form.Item>

      {/* 起始X轴坐标 */}
      <Form.Item
        name="x"
        initialValue={0}
        label={formatMessage({ id: 'editor.batchAddCell.firstXCoordinator' })}
        rules={[{ required: true }]}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* 起始Y轴坐标 */}
      <Form.Item
        name={'y'}
        initialValue={0}
        label={formatMessage({ id: 'editor.batchAddCell.firstYCoordinator' })}
        rules={[{ required: true }]}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* X轴码间距 */}
      <Form.Item
        name={'distanceX'}
        initialValue={1225}
        label={formatMessage({ id: 'editor.batchAddCell.horizontalSpace' })}
        rules={[{ required: true }]}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* Y轴码间距 */}
      <Form.Item
        name={'distanceY'}
        initialValue={1225}
        label={formatMessage({ id: 'editor.batchAddCell.verticalSpace' })}
        rules={[{ required: true }]}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* 行数 */}
      <Form.Item
        name={'rows'}
        initialValue={5}
        label={formatMessage({ id: 'editor.batchAddCell.rows' })}
        rules={[{ required: true }]}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* 列数 */}
      <Form.Item
        name={'cols'}
        initialValue={5}
        label={formatMessage({ id: 'editor.batchAddCell.columns' })}
        rules={[{ required: true }]}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* 生成 */}
      <Form.Item {...formItemLayoutNoLabel}>
        <Button type="primary" onClick={submit}>
          <FormattedMessage id="app.button.generate" />
        </Button>
      </Form.Item>
    </Form>
  );
});

const BatchAddCellWithOffset = connect(({ editor }) => {
  const { selections } = editor;
  const selectCells = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ id }) => id);
  return { selectCells };
})((props) => {
  const { selectCells } = props;
  const [formRef] = Form.useForm();

  useEffect(() => {
    formRef.setFieldsValue({ cellIds: selectCells });
  }, [selectCells]);

  function submit() {
    formRef.validateFields().then((value) => {
      props.submit(value);
    });
  }

  return (
    <Form labelWrap form={formRef} {...formItemLayout}>
      {/* 基准点位 */}
      <Form.Item
        name={'cellIds'}
        initialValue={selectCells}
        label={formatMessage({ id: 'editor.cell.bases' })}
        rules={[{ required: true }]}
      >
        <Select disabled mode={'tags'} maxTagCount={4} style={{ width: '90%' }} />
      </Form.Item>

      {/* 方向 */}
      <Form.Item name={'dir'} initialValue={0} label={formatMessage({ id: 'app.direction' })}>
        <DirectionSelector />
      </Form.Item>

      {/* 码间距 */}
      <Form.Item
        name={'distance'}
        initialValue={0}
        label={formatMessage({ id: 'editor.cell.space' })}
        rules={[{ required: true }]}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* 偏移个数 */}
      <Form.Item
        name={'count'}
        initialValue={0}
        label={formatMessage({ id: 'editor.batchAddCell.offsetsNumber' })}
        rules={[{ required: true }]}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* 生成 */}
      <Form.Item {...formItemLayoutNoLabel}>
        <Button type="primary" onClick={submit} disabled={selectCells.length === 0}>
          <FormattedMessage id="app.button.generate" />
        </Button>
      </Form.Item>
    </Form>
  );
});
