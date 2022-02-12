import React, { memo, useEffect, useState } from 'react';
import { Form, InputNumber, Select, Button } from 'antd';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchAgvList } from '@/services/api';
import { formatMessage, dealResponse } from '@/utils/util';
import { AGVType } from '@/config/config';
import styles from './addpod.module.less';
const FormLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
const NoLabelFormLayout = { wrapperCol: { offset: 7, span: 9 } };

function AddPodAssignModal(props) {
  const { allAgvTypes, updateRow, onCancel, onSubmit } = props;

  const [formRef] = Form.useForm();
  const [agvList, setAgvList] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
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
  return (
    <Form form={formRef} {...FormLayout} className={styles.addpodForm}>
      <Form.Item
        label={<FormattedMessage id="sourcemanage.pod.length.bd" />}
        name="podLength"
        initialValue={updateRow ? updateRow.podLength : null}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'sourcemanage.require.podLength' }),
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        label={<FormattedMessage id="sourcemanage.pod.length.ac" />}
        name="podWidth"
        initialValue={updateRow ? updateRow.podWidth : null}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'sourcemanage.require.podWidth' }),
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        {...FormLayout}
        name={'robotTypes'}
        label={formatMessage({ id: 'app.common.type' })}
        initialValue={updateRow ? updateRow.robotTypes || [] : []}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          showSearch
          mode="multiple"
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
        name={'robotIds'}
        label={formatMessage({ id: 'app.agv' })}
        initialValue={updateRow ? updateRow.robotIds || [] : []}
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
        <Button type="primary" onClick={submit} style={{ marginLeft: '20px' }}>
          <FormattedMessage id="app.button.confirm" />
        </Button>
      </Form.Item>
    </Form>
  );
}
export default connect(({ global }) => ({
  allAgvTypes: global.allAgvTypes,
}))(memo(AddPodAssignModal));
