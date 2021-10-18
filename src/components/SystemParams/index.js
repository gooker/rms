import React, { Component } from 'react';
import { Badge, Button, Card, Col, Form, message, Spin, Tabs, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import SelectTag from './component/SelectTag';
import FormButton from './component/FormButton';
import FormRenderComponent from './component/FormRender';
import PassWord from './component/PassWord';
import styles from './systemParamsManager.module.less';

const uiSchema = {};
const { TabPane } = Tabs;

class SystemParams extends Component {
  formRef = React.createRef();

  state = { error: {} };

  refresh = () => {
    const { refresh } = this.props;
    refresh && refresh();
  };

  transformSystemJson = (type, json) => {
    const {
      readonly,
      isRequired,
      items: arrayItems,
      extraInfo,
      defaultValue: initialValue,
      params,
    } = json;

    const result = {
      propsSchema: {
        type: 'object',
        properties: {
          required: [],
        },
      },
      formData: {},
    };
    let defaultValue = { readonly: false, type: 'string' };
    if (type === 'string') {
      defaultValue.type = 'string';
    } else if (type === 'password') {
      defaultValue['widget'] = 'password';
    } else if (type === 'multiple') {
      defaultValue.type = 'array';
      const enumNames = [];
      const enums = [];
      arrayItems.map(({ label: showLabel, value }) => {
        enumNames.push(showLabel);
        enums.push(value);
      });
      defaultValue.enum = enums;
      defaultValue.enumNames = enumNames;
      defaultValue['widget'] = 'multiSelect';
    } else if (type === 'number') {
      defaultValue.type = 'number';
    } else if (type === 'date') {
      defaultValue.format = 'date';
    } else if (type === 'dateTime') {
      defaultValue.format = 'dateTime';
    } else if (type === 'time') {
      defaultValue.format = 'time';
    } else if (type === 'radio') {
      const enumNames = [];
      const enums = [];
      arrayItems.map(({ label: showLabel, value }) => {
        enumNames.push(showLabel);
        enums.push(value);
      });
      defaultValue.enum = enums;
      defaultValue.enumNames = enumNames;
      defaultValue['widget'] = 'radio';
    } else if (type === 'checkbox') {
      defaultValue.type = 'array';
      const items = {
        type: 'string',
      };
      const enumNames = [];
      const enums = [];
      arrayItems.map(({ label: showLabel, value }) => {
        enumNames.push(showLabel);
        enums.push(value);
      });
      defaultValue.enum = enums;
      defaultValue.enumNames = enumNames;
      defaultValue.items = items;
    } else if (type === 'boolean') {
      defaultValue.type = 'boolean';
      defaultValue['widget'] = 'switch';
    } else if (type === 'tag') {
      defaultValue.type = 'array';
      defaultValue['widget'] = 'tag';
      if (arrayItems) {
        defaultValue['options'] = arrayItems;
      }
    } else if (type === 'button') {
      defaultValue['widget'] = 'button';
      defaultValue['options'] = params;
    } else if (type === 'range') {
      defaultValue.type = 'range';
      defaultValue.format = 'date';
    }
    if (readonly) {
      defaultValue['readonly'] = true;
    }
    if (initialValue != null) {
      defaultValue.default = initialValue;
    }
    if (extraInfo) {
      defaultValue = {
        ...extraInfo,
        defaultValue,
      };
    }
    if (isRequired) {
      result.propsSchema.properties.required.push('defaultValue');
    }
    result.propsSchema.properties.defaultValue = defaultValue;
    return result;
  };

  transForm = (json) => {
    return json.map((record) => {
      const { tabContent } = record;
      return {
        ...record,
        content: tabContent.map((object) => {
          const { group } = object;
          return {
            ...object,
            group: group.map((form) => {
              const {
                key,
                description,
                type,
                name,
                isRequired,
                format,
                formatMessage,
                isRequiredMessage,
                defaultValue,
                formItemWapperProps,
                labelCol,
              } = form;
              return {
                schema: this.transformSystemJson(type, form, name),
                field: key,
                desc: description,
                isRequired,
                format,
                name,
                formatMessage,
                defaultValue,
                isRequiredMessage,
                type,
                formItemWapperProps,
                labelCol,
              };
            }),
          };
        }),
      };
    });
  };

  renderTabContent = (content) => {
    return (
      <FormRenderComponent
        propsSchema={content.propsSchema}
        uiSchema={uiSchema}
        column={1}
        displayType="row"
        widgets={{ tag: SelectTag, button: FormButton, password: PassWord }}
        onValidate={this.setValid}
      />
    );
  };
  renderGroup = (record) => {
    const { formItemWapper, colPorps } = this.props;

    return record.map(({ group, groupName }) => {
      return (
        <Card style={{ marginTop: 40 }} key={groupName}>
          <div className={styles.codeBoxTitle}>{groupName}</div>
          <div className={styles.groupItem}>
            {group.map(
              ({
                field,
                desc,
                schema,
                isRequired,
                isRequiredMessage,
                format,
                formatMessage,
                name,
                type,
                defaultValue,
                labelCol,
              }) => {
                const rules = [];
                if (isRequired) {
                  rules.push({
                    required: true,
                    message: isRequiredMessage,
                  });
                }
                if (format) {
                  const reg = new RegExp(format);
                  rules.push({
                    pattern: reg,
                    message: formatMessage,
                  });
                }
                const formItemWrapperProps = {};
                if (labelCol != null && labelCol !== '') {
                  if (parseInt(labelCol, 10) > 24) {
                    message.error('labelCol is must <24 &&labCol is  number');
                  } else {
                    formItemWrapperProps.wrapperCol = {};
                    formItemWrapperProps.labelCol = {};
                    formItemWrapperProps.wrapperCol.span = 24 - parseInt(labelCol, 10);
                    formItemWrapperProps.labelCol.span = parseInt(labelCol, 10);
                  }
                }
                return (
                  <Col
                    key={field}
                    style={{ height: 80, display: 'flex' }}
                    xxl={{ span: 8 }}
                    sm={{ span: 24 }}
                    xl={{ span: 12 }}
                    {...colPorps}
                  >
                    {/* 字段组件 */}
                    <Col span={22}>
                      {type === 'button' ? (
                        <FormButton value={defaultValue} />
                      ) : (
                        <Form.Item
                          label={name}
                          key={field}
                          name={field}
                          initialValue={defaultValue}
                          rules={rules}
                          labelCol={{ span: 6, color: 'red' }}
                          wrapperCol={{ span: 18 }}
                          {...formItemWapper}
                          {...formItemWrapperProps}
                        >
                          {this.renderTabContent(schema)}
                        </Form.Item>
                      )}
                    </Col>
                    {/* 字段描述 */}
                    {desc && (
                      <Col span={2} style={{ textAlign: 'center' }}>
                        <Tooltip placement="top" title={desc}>
                          <QuestionCircleOutlined
                            style={{
                              fontSize: 20,
                              lineHeight: '40px',
                              cursor: 'pointer',
                            }}
                          />
                        </Tooltip>
                      </Col>
                    )}
                  </Col>
                );
              },
            )}
          </div>
        </Card>
      );
    });
  };

  renderTabPane = (record) => {
    const { error } = this.state;
    return record.map((obj, index) => {
      const { name, content } = obj;
      return (
        <TabPane
          key={index}
          tab={
            <Badge count={error[index] ? error[index] : 0} dot>
              {name}
            </Badge>
          }
        >
          <div className={styles.formItem}>{this.renderGroup(content)}</div>
        </TabPane>
      );
    });
  };

  handleError = (errors) => {
    const errorKey = Object.keys(errors);
    const dir = {};
    const { systemFormData } = this.props;
    systemFormData.forEach((record, index) => {
      const { tabContent } = record;
      tabContent.forEach(({ group }) => {
        group.forEach(({ key }) => {
          dir[key] = index;
        });
      });
    });
    const result = {};
    errorKey.forEach((error) => {
      const key = dir[error];
      if (result[key] == null) {
        result[key] = 1;
      } else {
        result[key] += 1;
      }
    });
    this.setState({
      error: result,
    });
  };

  commit = () => {
    const { validateFields } = this.formRef.current;
    validateFields()
      .then((value) => {
        const { submit } = this.props;
        submit && submit(value);
      })
      .catch((error) => {
        this.handleError(error);
        message.warn(<FormattedMessage id={'app.systemParameters.checkeRequiredFields'} />);
      });
  };

  render() {
    const { systemFormData, loading } = this.props;
    const data = this.transForm(systemFormData);
    return (
      <Form ref={this.formRef}>
        <Spin size="large" spinning={loading}>
          <Card style={{ minHeight: 600 }}>
            <Tabs
              type="card"
              tabBarExtraContent={
                <span>
                  <Button onClick={this.refresh}>
                    <FormattedMessage id={'app.button.refresh'} />
                  </Button>
                  <Button type="primary" onClick={this.commit} style={{ marginLeft: 10 }}>
                    <FormattedMessage id={'app.button.save'} />
                  </Button>
                </span>
              }
            >
              {this.renderTabPane(data)}
            </Tabs>
          </Card>
        </Spin>
      </Form>
    );
  }
}
export default SystemParams;
