import React, { memo } from 'react';
import FormRender from 'form-render/lib/antd';
import FormInput from './FormInput';
import FormButton from './FormButton';
import FormMultiSelect from './FormMultiSelect';
import FormPassword from './FormPassword';

const FormRenderComponent = (props) => {
  function onChange(value) {
    const {
      propsSchema: { defaultValue: propsDefault },
    } = props;
    const { defaultValue } = value;
    if (!(propsDefault && propsDefault['ui:widget'] && propsDefault['ui:widget'] === 'button')) {
      props.onChange(defaultValue);
    }
  }

  return (
    <FormRender
      onChange={onChange}
      propsSchema={props.propsSchema}
      column={1}
      displayType='row'
      formData={{
        defaultValue: props.value,
        required: false,
      }}
      widgets={{
        tag: FormMultiSelect,
        button: FormButton,
        password: FormPassword,
        input: FormInput,
      }}
    />
  );
};
export default memo(FormRenderComponent);
