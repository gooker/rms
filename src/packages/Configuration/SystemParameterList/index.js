import React, { memo, useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, message, Spin, Tabs, Tooltip } from 'antd';
import { CheckOutlined, QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { dealResponse } from '@/utils/util';
import { GridResponsive } from '@/config/consts';
import { fetchFormTemplate, updateFormTemplateValue } from '@/services/configurationService';
import FormattedMessage from '@/components/FormattedMessage';
import FormRenderer from './components/FormRenderer';
import styles from './systemParameterList.module.less';
import commonStyle from '@/common.module.less';

const { TabPane } = Tabs;

const SystemParameterList = () => {
  const [fomRef] = Form.useForm();
  const [json, setJson] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState({});

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setLoading(true);
    const language = window.localStorage.getItem('currentLocale');
    fetchFormTemplate({ language }).then((response) => {
      if (!dealResponse(response)) {
        setJson(response);
      }
      setLoading(false);
    });
  }

  function submit() {
    setLoading(true);
    fomRef
      .validateFields()
      .then((value) => {
        updateFormTemplateValue(value).then((response) => {
          dealResponse(response, true);
          setLoading(false);
        });
      })
      .catch((error) => {
        handleError(error);
        message.warn('表单未完成, 请检查必填项');
        setLoading(false);
      });
  }

  function handleError(errors) {
    const errorKey = Object.keys(errors);
    const dir = {};
    json.forEach((record, index) => {
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
    setErrorList(result);
  }

  function transformSystemJson(type, json) {
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
    let defaultValue = { 'ui:readonly': false, type: 'string' };
    if (type === 'string') {
      defaultValue.type = 'string';
    } else if (type === 'password') {
      defaultValue['ui:widget'] = 'password';
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
      defaultValue['ui:widget'] = 'multiSelect';
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
      defaultValue['ui:widget'] = 'radio';
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
      defaultValue['ui:widget'] = 'switch';
    } else if (type === 'tag') {
      defaultValue.type = 'tag';
      defaultValue['ui:widget'] = 'tag';
      if (arrayItems) {
        defaultValue['ui:options'] = arrayItems;
      }
    } else if (type === 'button') {
      defaultValue['ui:widget'] = 'button';
      defaultValue['ui:options'] = params;
    } else if (type === 'range') {
      defaultValue.type = 'range';
      defaultValue.format = 'date';
    }
    if (readonly) {
      defaultValue['ui:readonly'] = true;
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
  }

  function transForm(json) {
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
                schema: transformSystemJson(type, form, name),
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
  }

  function renderTabPane() {
    const record = transForm(json);
    return record.map((obj, index) => {
      const { name, content } = obj;
      return (
        <TabPane
          key={index}
          tab={
            <Badge count={errorList[index] ? errorList[index] : 0} dot>
              {name}
            </Badge>
          }
        >
          <div className={styles.formItem}>{renderGroup(content)}</div>
        </TabPane>
      );
    });
  }

  function renderGroup(record) {
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
                return (
                  <Col
                    key={field}
                    style={{ height: 80, display: 'flex' }}
                    // xxl={{ span: 8 }}
                    // sm={{ span: 24 }}
                    // xl={{ span: 12 }}
                    {...GridResponsive}
                  >
                    {/* 字段组件 */}
                    <Col span={22}>
                      {type === 'button' ? (
                        <Button>{defaultValue}</Button>
                      ) : (
                        <Form.Item label={name} key={field} name={field} rules={rules}>
                          <FormRenderer propsSchema={schema.propsSchema} />
                        </Form.Item>
                      )}
                    </Col>

                    {/* 字段描述 */}
                    {desc && (
                      <Col span={2} style={{ textAlign: 'center' }}>
                        <Tooltip placement='top' title={desc}>
                          <QuestionCircleOutlined style={{ fontSize: 20, lineHeight: '40px' }} />
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
  }

  return (
    <div className={commonStyle.commonPageStyle}>
      <Form labelWrap form={fomRef}>
        <Spin spinning={loading}>
          <Tabs
            type='card'
            tabBarExtraContent={
              <span>
                <Button onClick={refresh}>
                  <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
                </Button>
                <Button type='primary' onClick={submit} style={{ marginLeft: 10 }}>
                  <CheckOutlined /> <FormattedMessage id={'app.button.submit'} />
                </Button>
              </span>
            }
          >
            {renderTabPane()}
          </Tabs>
        </Spin>
      </Form>
    </div>
  );
};
export default memo(SystemParameterList);
