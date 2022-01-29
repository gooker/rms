import React, { Component } from 'react';
import { Form, Button, Select, Input } from 'antd';
import { connect } from '@/utils/RcsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { generateLevelOptions } from '../../UserManager/userManagerUtils';
import { isStrictNull } from '@/utils/util';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 15,
  },
};
@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class AddRoleModal extends Component {
  formRef = React.createRef();
  state = {
    levelOptions: [],
  };
  componentDidMount() {
    const { currentUser, updateRow } = this.props;
    const type = currentUser.adminType || 'USER';
    const { setFieldsValue } = this.formRef.current;
    if (!isStrictNull(updateRow) && updateRow.length > 0) {
      const currentItem = updateRow[0];
      const params = {
        code: currentItem.code,
        label: currentItem.label,
        level: currentItem.level,
        description: currentItem.description,
      };
      setFieldsValue({ ...params });
    }
    const levelOptions = generateLevelOptions(type);
    this.setState({ levelOptions });
  }

  submit = (values) => {
    const { validateFields } = this.formRef.current;
    const { onAddRoles } = this.props;
    validateFields().then((allValues) => {
      onAddRoles(allValues);
    });
  };
  render() {
    const { levelOptions } = this.state;
    return (
      <div>
        <Form {...formItemLayout} ref={this.formRef}>
          <Form.Item
            label={<FormattedMessage id="rolemanager.code" />}
            name="code"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="app.common.name" />}
            name="label"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={<FormattedMessage id="sso.user.account.level" />}
            name="level"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select>
              {levelOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={<FormattedMessage id="rolemanager.description" />} name="description">
            <Input />
          </Form.Item>
        </Form>
        <div
          style={{
            marginTop: 60,
            textAlign: 'center',
          }}
        >
          <Button onClick={this.submit} type="primary">
            <FormattedMessage id="app.button.submit" />
          </Button>
        </div>
      </div>
    );
  }
}
export default AddRoleModal;
