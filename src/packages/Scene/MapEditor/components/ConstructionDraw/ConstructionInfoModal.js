import React, { memo, useState } from 'react';
import { Form, Radio, Switch, Input, Col, Button, Select } from 'antd';
import { getFormLayout, formatMessage } from '@/utils/util';
import { PaperSize } from '@/config/consts';

const { formItemLayout } = getFormLayout(6, 18);
const selectBefore = (
  <Form.Item name="direction" noStyle initialValue="N">
    <Select className="select-before" style={{ width: '70px' }}>
      <Select.Option value="N">N</Select.Option>
      <Select.Option value="S">S</Select.Option>
      <Select.Option value="W">W</Select.Option>
      <Select.Option value="E">E</Select.Option>
    </Select>
  </Form.Item>
);

const ConstructionInfoModal = (props) => {
  const { configureSubmit } = props;
  const [type, setType] = useState('PNG');
  const [formRef] = Form.useForm();

  function submit() {
    formRef
      .validateFields()
      .then((value) => {
        configureSubmit(value);
      })
      .catch(() => {});
  }

  return (
    <>
      <Form form={formRef} {...formItemLayout} labelWrap>
        <Form.Item
          label={formatMessage({ id: 'app.common.type' })}
          name="exportType"
          initialValue="PNG"
          getValueFromEvent={(ev) => {
            setType(ev.target.value);
            return ev.target.value;
          }}
        >
          <Radio.Group
            options={[
              { label: 'PNG', value: 'PNG' },
              { label: 'PDF', value: 'PDF' },
            ]}
            optionType="button"
          />
        </Form.Item>
        {type === 'PDF' && (
          <>
            <Form.Item
              label={formatMessage({ id: 'editor.constructionDrawing.paperSize' })}
              name="papersize"
              initialValue="A3"
            >
              <Radio.Group size="small" options={PaperSize} optionType="button" />
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'editor.constructionDrawing.paperOrientation' })}
              name="paperoriente"
              initialValue="p"
            >
              <Radio.Group
                size="small"
                options={[
                  {
                    label: formatMessage({ id: 'editor.constructionDrawing.vertical' }),
                    value: 'p',
                  },
                  {
                    label: formatMessage({ id: 'editor.constructionDrawing.horizontal' }),
                    value: 'l',
                  },
                ]}
                optionType="button"
              />
            </Form.Item>
          </>
        )}

        {/* nowayFlag-- */}
        <Form.Item
          label={formatMessage({ id: 'editor.constructionDrawing.showBlockedCells' })}
          name="showBlockedCellsFlag"
          initialValue={false}
          valuePropName={'checked'}
        >
          <Switch
            checkedChildren={formatMessage({ id: 'app.common.true' })}
            unCheckedChildren={formatMessage({ id: 'app.common.false' })}
          />
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'editor.constructionDrawing.exportCellData' })}
          name="exportCellDataFlag"
          initialValue={true}
          valuePropName={'checked'}
        >
          <Switch
            checkedChildren={formatMessage({ id: 'app.common.true' })}
            unCheckedChildren={formatMessage({ id: 'app.common.false' })}
          />
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'editor.constructionDrawing.showCellCoordinates' })}
          name="showCoordinates"
          initialValue={false}
          valuePropName={'checked'}
        >
          <Switch
            checkedChildren={formatMessage({ id: 'app.common.true' })}
            unCheckedChildren={formatMessage({ id: 'app.common.false' })}
          />
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'app.direction' })} name="degree" initialValue={'0'}>
          <Input addonBefore={selectBefore} addonAfter="°" style={{ width: '280px' }} />
        </Form.Item>

        <Form.Item label={formatMessage({ id: 'app.common.remark' })} name="remark">
          <Input style={{ width: '280px' }} />
        </Form.Item>

        <Form.Item>
          <Col span={12} offset={10}>
            <Button type="primary" onClick={submit}>
              {formatMessage({ id: 'app.button.confirm' })}
            </Button>
          </Col>
        </Form.Item>
      </Form>
    </>
  );
};
export default memo(ConstructionInfoModal);
