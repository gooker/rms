import React, { memo, useEffect, useState } from 'react';
import { Divider, Form, Radio, InputNumber, Select, Button } from 'antd';
import { isPlainObject } from 'lodash';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, getFormLayout } from '@/utils/util';
import { MapSelectableSpriteType } from '@/config/consts';
import { NavigationCellType } from '@/config/config';
import DirectionSelector from '@/packages/Scene/components/DirectionSelector';
import styles from '../../popoverPanel.module.less';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(9, 15);
const BatchAddCells = (props) => {
  const { dispatch, mapContext } = props;
  const [formRef] = Form.useForm();

  const [addWay, setAddWay] = useState('absolute');

  function submit(value) {
    formRef.validateFields().then((values) => {
      dispatch({
        type: 'editor/batchAddCells',
        payload: { ...value, ...values },
      }).then((result) => {
        if (isPlainObject(result)) {
          const { centerMap, additionalCells } = result;
          mapContext.updateCells({
            type: 'add',
            payload: additionalCells,
          });
          centerMap && mapContext.centerView();
        }
      });
    });
  }

  return (
    <div className={styles.formWhiteLabel}>
      <Form form={formRef} {...formItemLayout}>
        <Form.Item
          name={'addWay'}
          label={<FormattedMessage id='editor.batchAddCell.addWay' />}
          initialValue={'absolute'}
          getValueFromEvent={(evt) => {
            setAddWay(evt.target.value);
            return evt.target.value;
          }}
        >
          <Radio.Group buttonStyle='solid'>
            <Radio.Button value={'absolute'}>
              <FormattedMessage id='editor.batchAddCell.addWay.absolute' />
            </Radio.Button>
            <Radio.Button value={'offset'}>
              <FormattedMessage id='editor.batchAddCell.addWay.offset' />
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name={'navigationCellType'}
          label={formatMessage({ id: 'editor.navigationCellType' })}
          initialValue={NavigationCellType[0].code}
        >
          <Select style={{ width: 133 }}>
            {NavigationCellType.map(({ code, name }, index) => (
              <Select.Option key={index} value={code}>
                {name}
              </Select.Option>
            ))}
          </Select>
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
export default connect(({ editor }) => {
  const { mapContext } = editor;
  return { mapContext };
})(memo(BatchAddCells));

const BatchAddCellWithAbsolut = (props) => {
  const [formRef] = Form.useForm();

  function submit() {
    formRef.validateFields().then((value) => {
      props.submit(value);
    });
  }

  return (
    <Form labelWrap form={formRef} {...formItemLayout}>
      {/* 起始点 */}
      <Form.Item
        name='autoGenCellIdStart'
        initialValue={1}
        label={formatMessage({ id: 'editor.batchAddCell.firstCode' })}
        rules={[{ required: true }]}
      >
        <InputNumber style={{ width: 150 }} />
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
        <Button type='primary' onClick={submit}>
          <FormattedMessage id='app.button.generate' />
        </Button>
      </Form.Item>
    </Form>
  );
};

const BatchAddCellWithOffset = connect(({ editor }) => ({ selections: editor.selections }))(
  (props) => {
    const { selections } = props;
    const [formRef] = Form.useForm();

    const selectCells = selections
      .filter((item) => item.type === MapSelectableSpriteType.CELL)
      .map(({ id }) => id);

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
          initialValue={1000}
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
          <Button type='primary' onClick={submit} disabled={selectCells.length === 0}>
            <FormattedMessage id='app.button.generate' />
          </Button>
        </Form.Item>
      </Form>
    );
  },
);
