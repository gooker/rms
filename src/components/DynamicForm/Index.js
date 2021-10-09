// eslint-disable-next-line max-classes-per-file
import React, { Component, PureComponent } from 'react';
import { Col, Form, Row, Button } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import MenuIcon from '@/utils/MenuIcon';

// 重构: https://ant.design/components/form-cn/#components-form-demo-dynamic-form-items
class DynamicForm extends Component {
  formRef = React.createRef();

  state = {
    result: {
      keys: [],
    },

    id: 0,
    keys: [],
    fields: [],
  };

  // 收集 fields
  componentWillMount() {
    const { children } = this.props;
    if (Array.isArray(children)) {
      const fields = [];
      for (let index = 0; index < children.length; index += 1) {
        const element = children[index];
        const {
          props: { field },
        } = element;
        fields.push(field);
      }
      this.setState({ fields });
    } else {
      const {
        props: { field },
      } = children;
      this.setState({ fields: [field] });
    }
  }

  componentDidMount() {
    const { value, allValue } = this.props;
    const { setFieldsValue } = this.formRef.current;
    if (value != null) {
      const newValue = this.transForm(value);
      this.setState({
        id: value.length,
        result: newValue,
        keys: newValue.keys,
      });
      setFieldsValue({ keys: newValue.keys });

      if (allValue) {
        const keys = value.map((record, index) => index);
        allValue({ keys });
      }
    }
  }

  transForm = (value) => {
    const result = {};
    const { fields } = this.state;
    for (let j = 0; j < fields.length; j += 1) {
      const obj = fields[j];
      result[obj] = [];
    }
    const resultKeys = [];
    for (let index = 0; index < value.length; index += 1) {
      const element = value[index];
      const keys = Object.keys(result);
      for (let j = 0; j < keys.length; j += 1) {
        const key = keys[j];
        result[key].push(element[key]);
      }
      resultKeys.push(index);
    }
    result.keys = resultKeys;
    return result;
  };

  onValuesChange = (_, allValues) => {
    const resultValue = [];
    const resultKey = Object.keys(allValues);
    // keys 标记当前新增几组配置, 第一个为1， 第二个为2，一次类推...
    const keys = allValues.keys;

    keys.forEach((groupFlag) => {
      const subResult = {};
      resultKey.forEach((fieldName) => {
        if (fieldName !== 'keys') {
          const originalFieldName = fieldName.replace(`[${groupFlag}]`, '');
          subResult[originalFieldName] = allValues[fieldName];
        }
      });
      resultValue.push(subResult);
    });

    if (this.props.onChange) {
      this.props.onChange(resultValue || {});
    }
    if (this.props.allValue) {
      this.props.allValue(allValues);
    }
  };

  add = () => {
    const { id } = this.state;
    const { getFieldValue, setFieldsValue } = this.formRef.current;
    const keys = getFieldValue('keys');
    const nextKeys = keys.concat(id + 1);
    this.setState({ id: id + 1, keys: nextKeys });
    setFieldsValue({ keys: nextKeys });
  };

  delete = (k) => {
    const { getFieldValue, setFieldsValue } = this.formRef.current;
    const keys = getFieldValue('keys');
    const nextKeys = keys.filter((key) => key !== k);
    this.setState({ keys: nextKeys });
    setFieldsValue({ keys: nextKeys });
  };

  generateValue = (value, k) => {
    const result = {};
    const keys = Object.keys(value);
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      result[key] = value[key][k];
    }
    return result;
  };

  renderNode = (records, k) => {
    const result = [];
    const { result: stateResult } = this.state;
    const { getFieldsValue, setFieldsValue } = this.formRef.current;
    if (Array.isArray(records)) {
      for (let index = 0; index < records.length; index += 1) {
        const element = records[index];
        const {
          props: { col, renderChild, children, field, label, formItem, renderLabel, opertions },
        } = element;
        let newChild = children;
        if (renderChild) {
          newChild = renderChild(getFieldsValue(), setFieldsValue, k);
        }
        const child = (
          <Col key={index} {...col} style={{ width: '100%'}}>
            <Form.Item
              {...formItem}
              required={false}
              name={`${field}[${k}]`}
              initialValue={
                stateResult[`${field}`] && stateResult[`${field}`][k]
                  ? stateResult[`${field}`][k]
                  : null
              }
              label={renderLabel ? renderLabel(k) : label || null}
              {...opertions}
            >
              {newChild}
            </Form.Item>
          </Col>
        );
        result.push(child);
      }
    } else {
      const {
        props: { col, renderChild, children, field, label, formItem, renderLabel, opertions },
      } = records;
      let newChild = children;
      if (renderChild) {
        newChild = renderChild(this.generateValue(getFieldsValue(), k));
      }
      result.push(
        <Col key={field} {...col} style={{ width: '100%' }}>
          <Form.Item
            {...formItem}
            required={false}
            name={`${field}[${k}]`}
            validateTrigger={['onChange', 'onBlur']}
            initialValue={
              stateResult[`${field}`] && stateResult[`${field}`][k]
                ? stateResult[`${field}`][k]
                : null
            }
            label={renderLabel ? renderLabel(k) : label || null}
            {...opertions}
          >
            {newChild}
          </Form.Item>
        </Col>,
      );
    }
    return result;
  };

  renderFormItem = () => {
    const { keys } = this.state;
    const { border, extra, children, renderDelete } = this.props;
    return keys.map((k) => {
      const content = (
        <Row key={k}>
          {/* 额外节点 */}
          {extra && <Row>extra(k)</Row>}

          {/* 是否包含删除按钮 */}
          {renderDelete ? (
            renderDelete(this.renderNode(children, k), k, this.delete)
          ) : (
            <>
              <Col span={22} style={{display:'flex'}}>{this.renderNode(children, k)}</Col>
              <Col span={2}>
                <Button
                  type="danger"
                  icon={MenuIcon.delete}
                  onClick={() => {
                    this.delete(k);
                  }}
                />
              </Col>
            </>
          )}
        </Row>
      );
      if (border) {
        return border(content);
      }
      return content;
    });
  };

  renderButton = () => {
    const { keys } = this.state;
    const { renderButton } = this.props;
    let button;
    if (renderButton === undefined) {
      button = (
        <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
          <FormattedMessage id="app.workStationMap.add" />
        </Button>
      );
    } else {
      if (typeof renderButton === 'function') {
        button = renderButton(this.state, this.add);
      }
    }
    if (button) {
      return <Row style={{ marginTop: keys.length > 0 ? '20px' : 0, width: '100%' }}>{button}</Row>;
    }
    return null;
  };

  render() {
    const { result } = this.state;
    return (
      <>
        <Form ref={this.formRef} onValuesChange={this.onValuesChange}>
          <Form.Item hidden name={'keys'} initialValue={result.keys || []} />
          {this.renderFormItem()}
        </Form>
        {this.renderButton()}
      </>
    );
  }
}
export default DynamicForm;

export class DynamicFormCol extends PureComponent {
  render() {
    return this.props.children;
  }
}
