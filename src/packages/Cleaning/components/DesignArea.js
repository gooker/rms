import React, { Component } from 'react';
import { Form, Checkbox, Select } from 'antd';
import { formatMessage, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

class DesignArea extends Component {
  state = {
    isDesigne: true,
    area: [],
    day: null,
    times: null,
  };
  componentDidMount() {
    const { value } = this.props;
    if (isNull(value)) return;
    if (value?.length > 0) {
      this.setState({ isDesigne: true });
      this.setState({ area: value });
    } else {
      this.setState({ isDesigne: false });
      this.setState({ area: [] });
    }
  }

  render() {
    const { isDesigne, area } = this.state;
    const {
      form: { getFieldDecorator },
      onChange,
      functionArea,
    } = this.props;
    return (
      <div style={{ height: '40px', display: 'flex', flex: 1, flexFlow: 'row nowrap' }}>
        <Form.Item>
          {getFieldDecorator('isDesigne', {
            valuePropName: 'checked',
            initialValue: isDesigne,
          })(
            <Checkbox
              onChange={(v) => {
                const flag = v.target.checked;
                if (!flag) {
                  if (onChange) {
                    onChange([]);
                  }
                  this.setState({ area: [] });
                }
                this.setState({ isDesigne: flag });
              }}
            >
              <FormattedMessage id={'cleaninCenter.designatedarea'} />
            </Checkbox>,
          )}
        </Form.Item>

        <Form.Item hidden={!isDesigne}>
          {getFieldDecorator('area', {
            initialValue: area || [],
            // rulea: [
            //   {
            //     required: true,
            //   },
            // ],
          })(
            <Select
              mode="tags"
              placeholder={formatMessage({ id: 'cleaningCenter.pleaseSelect' })}
              style={{ width: '250px' }}
              onChange={(values) => {
                if (onChange) {
                  onChange(values);
                }
              }}
            >
              {functionArea &&
                functionArea.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
            </Select>,
          )}
        </Form.Item>
      </div>
    );
  }
}
export default DesignArea;
