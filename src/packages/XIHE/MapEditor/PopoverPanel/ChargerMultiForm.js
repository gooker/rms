import React, { memo } from 'react';
import { Button, Form, Input, Row, Select } from 'antd';
import { formatMessage, getFormLayout } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import AngleSelector from '@/components/AngleSelector';
import ButtonInput from '@/components/ButtonInput/ButtonInput';

const { formItemLayout } = getFormLayout(5, 19);

const ChargerMultiForm = (props) => {
  const { dispatch, allChargers, selectCellIds, mapContext, robotTypes, back } = props;

  const [formRef] = Form.useForm();

  function checkNameDuplicate(name) {
    const { tid } = formRef.getFieldValue();
    const existNames = allChargers.filter((item) => item.tid !== tid).map((item) => item.name);
    return existNames.includes(name);
  }

  function multiSubmit() {
    formRef.validateFields().then((values) => {
      dispatch({ type: 'editor/addChargerInBatches', payload: values }).then((result) => {
        mapContext.renderChargers(result);
        mapContext.refresh();
        back();
      });
    });
  }

  return (
    <Form form={formRef} style={{ width: '100%' }}>
      {/* 名称 */}
      <Form.Item
        {...formItemLayout}
        name={'name'}
        label={formatMessage({ id: 'app.common.name' })}
        rules={[
          { required: true },
          () => ({
            validator(_, value) {
              const isDuplicate = checkNameDuplicate(value);
              if (!isDuplicate) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(formatMessage({ id: 'app.form.name.duplicate' })));
            },
          }),
        ]}
      >
        <Input />
      </Form.Item>

      {/* 角度 */}
      <Form.Item
        {...formItemLayout}
        name={'riceDirection'}
        label={<FormattedMessage id="app.common.angle" />}
      >
        <AngleSelector />
      </Form.Item>

      {/* 充电点 */}
      <Form.Item
        {...formItemLayout}
        name={'cellIds'}
        label={<FormattedMessage id="editor.cellType.charging" />}
      >
        <ButtonInput multi data={selectCellIds} btnDisabled={selectCellIds.length === 0} />
      </Form.Item>

      {/* 小车类型 */}
      <Form.Item
        {...formItemLayout}
        name={'agvTypes'}
        label={formatMessage({ id: 'app.agv.type' })}
      >
        <Select mode="multiple">
          {robotTypes.map((record) => (
            <Select.Option value={record} key={record}>
              {record}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Row justify="end">
          <Button type="primary" onClick={multiSubmit}>
            <FormattedMessage id="app.button.confirm" />
          </Button>
        </Row>
      </Form.Item>
    </Form>
  );
};
export default connect(({ editor }) => {
  const { selectCells, currentMap, mapContext } = editor;

  // 获取所有充电桩名称列表
  const allChargers = [];
  const { logicAreaList } = currentMap;
  logicAreaList.forEach((item) => {
    const chargerList = item.chargerList || [];
    allChargers.push(...chargerList);
  });

  return { allChargers, mapContext, selectCellIds: selectCells };
})(memo(ChargerMultiForm));
