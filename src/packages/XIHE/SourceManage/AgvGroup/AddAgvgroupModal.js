import React, { memo, useEffect, useState } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchAgvList } from '@/services/api';
import { formatMessage, dealResponse } from '@/utils/util';
import { AGVType } from '@/config/config';

const FormLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
const NoLabelFormLayout = { wrapperCol: { offset: 7, span: 9 } };

function AddAgvGroupModal(props) {
  const { updateRow, onCancel, onSubmit, dataSource, loading, allAgvTypes } = props;

  const [formRef] = Form.useForm();
  const [agvList, setAgvList] = useState([]);

  useEffect(() => {
    getAGvData();
  }, []);

  function getAGvData() {
    fetchAgvList(AGVType.LatentLifting).then((response) => {
      if (!dealResponse(agvList)) {
        setAgvList(agvList);
      }
    });
  }

  function submit() {
    formRef
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch(() => {});
  }

  function nameValidator(_, value) {
    const existGroupName = dataSource.map(({ agvGroupCode }) => agvGroupCode);
    // 名称不可以重复
    if (value && existGroupName.includes(value)) {
      return Promise.reject(new Error(formatMessage({ id: 'app.form.name.duplicate' })));
    }
    return Promise.resolve();
  }
  return (
    <Form form={formRef} {...FormLayout}>
      <Form.Item
        label={<FormattedMessage id="sourcemanage.agvgroup.name" />}
        name="agvGroupCode"
        initialValue={updateRow ? updateRow.agvGroupCode : null}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'sourcemanage.require.agvgroup' }),
          },
          { validator: !updateRow && nameValidator },
        ]}
      >
        <Input disabled={!!updateRow} />
      </Form.Item>
      <Form.Item
        {...FormLayout}
        name={'robotType'}
        label={formatMessage({ id: 'app.common.type' })}
        initialValue={updateRow ? updateRow.robotType || [] : []}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          showSearch
          allowClear
          filterOption={(input, option) =>
            option.props.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {allAgvTypes?.map((item) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        {...FormLayout}
        name={'agvIdList'}
        label={formatMessage({ id: 'app.agv' })}
        initialValue={updateRow ? updateRow.agvIdList || [] : []}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select mode="tags" allowClear>
          {agvList?.map((item) => (
            <Select.Option key={item.robotId} value={item.robotId}>
              {item.robotId}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item {...NoLabelFormLayout} style={{ marginTop: 30 }}>
        <Button onClick={onCancel}>
          <FormattedMessage id="app.button.cancel" />
        </Button>
        <Button type="primary" onClick={submit} style={{ marginLeft: '20px' }} loading={loading}>
          <FormattedMessage id="app.button.confirm" />
        </Button>
      </Form.Item>
    </Form>
  );
}
export default connect(({ global }) => ({
  allAgvTypes: global.allAgvTypes,
}))(memo(AddAgvGroupModal));
