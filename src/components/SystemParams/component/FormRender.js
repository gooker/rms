import React, { PureComponent } from 'react';
import FormRender, { connectForm } from 'form-render';
import SelectTag from './SelectTag';
import FormButton from './FormButton';
import PassWord from './PassWord';
import Input from './Input';

class FormRenderComponent extends PureComponent {
  onValuesChange = (value) => {
    const { onChange } = this.props;
    if (onChange) {
      const {
        propsSchema: { defaultValue: propsDefault },
      } = this.props;
      const { defaultValue } = value;
      if (!(propsDefault && propsDefault['widget'] && propsDefault['widget'] === 'button')) {
        onChange(defaultValue);
      }
    }
  };

  render() {
    const { propsSchema, form } = this.props;
    // const new1={
    //   properties:{
    //       defaultValue: {
    //         type: "string",
    //         format: "date",
    //       }
    //   },
    //   type:'object'
    // }
    return (
      <FormRender
        form={form}
        onValuesChange={this.onValuesChange}
        onFinish={this.onFinish}
        schema={propsSchema}
        column={1}
        displayType="row"
        widgets={{
          tag: SelectTag,
          button: FormButton,
          password: PassWord,
          input: Input,
        }}
      />
    );
  }
}
export default connectForm(FormRenderComponent);
