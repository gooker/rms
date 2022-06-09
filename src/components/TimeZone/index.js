import React, { Component } from 'react';
import { Col, Row, Select } from 'antd';
import _ from 'lodash';
import timezones from './timezones.json';
import WorldTimeMap from './WorldTimeMap';

export default class TimeZone extends Component {
  state = {
    value: '',
    onMouseOverValue: '',
  };

  componentDidMount() {
    const { defaultValue } = this.props;
    if (defaultValue != null) {
      this.setState({
        value: defaultValue,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    const { value: thisStateValue } = this.state;
    if (value == null) {
      return;
    }
    if (value !== thisStateValue) {
      this.setState({
        value,
      });
    }
  }

  onChange = value => {
    this.setState({ value: value.timezone }, () => {
      const { onChange } = this.props;
      const { value } = this.state;
      if (onChange) {
        onChange(value);
      }
    });
  };

  renderOperation = () => {
    const uniqueTimezone = _.uniqBy(timezones, record => {
      return record.timezone;
    });
    const result = [];
    for (let index = 0; index < uniqueTimezone.length; index++) {
      const element = uniqueTimezone[index];
      result.push(
        <Select.Option value={element.timezone} key={index}>
          <div>
            <span style={{ display: 'inline-block', width: 250 }}>{element.timezone}</span>
            <span style={{ marginLeft: 10, float: 'right' }}>{element.zonename}</span>
            <span style={{ marginLeft: 10 }}>({element.offset})</span>
          </div>
        </Select.Option>
      );
    }
    return result;
  };

  render() {
    const { value, onMouseOverValue } = this.state;
    return (
      <div>
        <Row>
          <Col span={12}>
            <Select
              showSearch
              style={{ width: 400 }}
              value={value}
              onChange={value => {
                this.setState({ value });
                const { onChange } = this.props;
                if (onChange) {
                  onChange(value);
                }
              }}
            >
              {this.renderOperation()}
            </Select>
          </Col>
          <Col style={{ textAlign: 'right', fontSize: 18 }} span={12}>
            {onMouseOverValue}
          </Col>
        </Row>
        <Row>
          <WorldTimeMap
            onMouseOver={value => {
              this.setState({ onMouseOverValue: value?.timezone });
            }}
            onMouseOut={() => {
              this.setState({ onMouseOverValue: value });
            }}
            value={value}
            onChange={this.onChange}
          />
        </Row>
      </div>
    );
  }
}
