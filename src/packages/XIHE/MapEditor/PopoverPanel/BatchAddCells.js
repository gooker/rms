import React, { memo, useEffect, useState } from 'react';
import { Divider, Form, Radio, InputNumber, Select, Button } from 'antd';
import { connect } from '@/utils/RcsDva';
import FormattedMessage from '@/components/FormattedMessage';
import DirectionSelector from '@/packages/XIHE/components/DirectionSelector';
import { formatMessage } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import styles from './popoverPanel.module.less';

const BatchAddCells = (props) => {
  const { dispatch, selectCells, mapContext, currentLogicArea } = props;
  const { rangeStart, rangeEnd } = currentLogicArea;

  const [addWay, setAddWay] = useState('absolute');

  function submit(value) {
    dispatch({
      type: 'editor/batchAddCells',
      payload: { ...value, addWay },
    }).then(({ centerMap, additionalCells }) => {
      mapContext.updateCells({ type: 'add', payload: additionalCells });
      if (centerMap) {
        const cellMap = {};
        additionalCells.forEach((item) => {
          cellMap[item.id] = item;
        });
        mapContext.centerView(cellMap);
      }
    });
  }

  return (
    <div className={styles.formWhiteLabel}>
      <div>
        <span style={{ marginRight: 10, color: '#fff' }}>
          <FormattedMessage id="editor.batchAddCell.addWay" />:
        </span>
        <Radio.Group
          value={addWay}
          buttonStyle="solid"
          onChange={({ target: { value } }) => {
            setAddWay(value);
          }}
        >
          <Radio.Button value={'absolute'}>
            <FormattedMessage id="editor.batchAddCell.addWay.absolute" />
          </Radio.Button>
          <Radio.Button value={'offset'}>
            <FormattedMessage id="editor.batchAddCell.addWay.offset" />
          </Radio.Button>
        </Radio.Group>
      </div>
      <Divider style={{ margin: '15px 0' }} />
      {addWay === 'absolute' ? (
        <BatchAddCellWithAbsolut rangeStart={rangeStart} rangeEnd={rangeEnd} submit={submit} />
      ) : (
        <BatchAddCellWithOffset selectCells={selectCells} submit={submit} />
      )}
    </div>
  );
};
export default connect(({ editor }) => {
  const { selectCells, mapContext } = editor;
  const currentLogicAreaData = getCurrentLogicAreaData();
  return {
    mapContext,
    selectCells,
    currentLogicArea: currentLogicAreaData || {},
  };
})(memo(BatchAddCells));

const BatchAddCellWithAbsolut = (props) => {
  const { rangeStart, rangeEnd } = props;
  const [formRef] = Form.useForm();

  function submit() {
    formRef.validateFields().then((value) => {
      props.submit(value);
    });
  }

  return (
    <Form form={formRef} layout={'vertical'}>
      {/* 起始点 */}
      <Form.Item
        name="autoGenCellIdStart"
        initialValue={rangeStart}
        label={formatMessage({ id: 'editor.batchAddCell.firstCode' })}
      >
        <InputNumber min={rangeStart} max={rangeEnd} style={{ width: 150 }} />
      </Form.Item>

      {/* 起始X轴坐标 */}
      <Form.Item
        name="x"
        initialValue={0}
        label={formatMessage({ id: 'editor.batchAddCell.firstXCoordinator' })}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* 起始Y轴坐标 */}
      <Form.Item
        name={'y'}
        initialValue={0}
        label={formatMessage({ id: 'editor.batchAddCell.firstYCoordinator' })}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* X轴码间距 */}
      <Form.Item
        name={'distanceX'}
        initialValue={1225}
        label={formatMessage({ id: 'editor.batchAddCell.horizontalSpace' })}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* Y轴码间距 */}
      <Form.Item
        name={'distanceY'}
        initialValue={1225}
        label={formatMessage({ id: 'editor.batchAddCell.verticalSpace' })}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* 行数 */}
      <Form.Item
        name={'rows'}
        initialValue={5}
        label={formatMessage({ id: 'editor.batchAddCell.rows' })}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* 列数 */}
      <Form.Item
        name={'cols'}
        initialValue={5}
        label={formatMessage({ id: 'editor.batchAddCell.columns' })}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* 生成 */}
      <Form.Item>
        <Button type="primary" onClick={submit}>
          <FormattedMessage id="app.button.generate" />
        </Button>
      </Form.Item>
    </Form>
  );
};

const BatchAddCellWithOffset = (props) => {
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
    <Form form={formRef} layout={'vertical'}>
      {/* 基准点位 */}
      <Form.Item
        name={'cellIds'}
        initialValue={selectCells}
        label={formatMessage({ id: 'editor.cell.bases' })}
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
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* 偏移个数 */}
      <Form.Item
        name={'count'}
        initialValue={0}
        label={formatMessage({ id: 'editor.batchAddCell.offsetsNumber' })}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>

      {/* 生成 */}
      <Form.Item>
        <Button type="primary" onClick={submit} disabled={selectCells.length === 0}>
          <FormattedMessage id="app.button.generate" />
        </Button>
      </Form.Item>
    </Form>
  );
};
