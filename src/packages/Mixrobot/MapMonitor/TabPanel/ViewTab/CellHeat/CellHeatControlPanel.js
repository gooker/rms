import React, { Component } from 'react';
import { Button, Form, Collapse, DatePicker, Select, Row, Col, message, Switch } from 'antd';
import intl from 'react-intl-universal';
import FormattedMessage from '@/components/FormattedMessage';
import find from 'lodash/find';
import Config from '@/config';
import styles from './CellHeatControlPanel.less';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const NoLabelLayout = {
  wrapperCol: { span: 16, offset: 6 },
};
const { Option } = Select;
const { Panel } = Collapse;

class CellHeatControlPanel extends Component {
  formRef = React.createRef();

  state = {
    type: '',
  };

  handleRequestHeat = (event) => {
    event.stopPropagation();
    const { fresh } = this.props;
    const { validateFields } = this.formRef.current;
    validateFields().then((value) => {
      const { type, startTime, endTime, isTransparent } = value;
      if (!type) {
        message.error(intl.formatMessage({ id: 'app.mapView.require.heatView.viewType' }));
        return;
      }
      if (type === Config.CellHeatType.cost_type) {
        fresh({ type, isTransparent, startTime: '', endTime: '' });
      } else {
        if (!startTime || !endTime) {
          message.error(intl.formatMessage({ id: 'app.mapView.require.heatView.timeRange' }));
          return;
        }
        fresh({
          type,
          isTransparent,
          startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
          endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
        });
      }
    });
  };

  handleTypeChanged = (type) => {
    this.setState(type);
  };

  render() {
    const { type } = this.state;
    const { clearCellHeat } = this.props;
    const locale = window.localStorage.getItem('umi_locale') || 'zh-CN';
    const OptionData = [
      {
        label: intl.formatMessage({ id: 'app.mapView.label.heatView.costHeat' }),
        value: Config.CellHeatType.cost_type,
      },
    ];
    return (
      <div className={styles.cellHeatControlPanel}>
        <Collapse expandIconPosition="right">
          <Panel
            header={
              <>
                <FormattedMessage id="app.mapView.label.heatView.queryType" />:
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#2DBF33',
                  }}
                >{` ${
                  type || intl.formatMessage({ id: 'app.mapView.label.heatView.null' })
                }`}</span>
              </>
            }
            extra={
              <a onClick={this.handleRequestHeat}>
                <FormattedMessage id="app.mapView.action.refresh" />
              </a>
            }
          >
            <Form ref={this.formRef}>
              <Form.Item
                {...(locale === 'zh-CN'
                  ? layout
                  : {
                      labelCol: { span: 8 },
                      wrapperCol: { span: 16 },
                    })}
                name={'type'}
                getValueFromEvent={(value) => {
                  const option = find(OptionData, { value });
                  this.setState({ type: option.label });
                  return value;
                }}
                label={intl.formatMessage({ id: 'app.mapView.label.heatView.queryType' })}
              >
                <Select
                  style={{ width: locale === 'zh-CN' ? 195 : 185 }}
                  placeholder={intl.formatMessage({
                    id: 'app.mapView.require.heatView.viewType',
                  })}
                  onChange={this.handleTypeChanged}
                >
                  {OptionData.map(({ label, value }, index) => (
                    <Option key={index} value={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                {...(locale === 'zh-CN'
                  ? layout
                  : {
                      labelCol: { span: 7 },
                      wrapperCol: { span: 17 },
                    })}
                name={'startTime'}
                label={intl.formatMessage({ id: 'app.mapView.label.heatView.startTime' })}
              >
                <DatePicker
                  showTime
                  placeholder={intl.formatMessage({
                    id: 'app.mapView.require.heatView.startTime',
                  })}
                />
              </Form.Item>

              <Form.Item
                {...(locale === 'zh-CN'
                  ? layout
                  : {
                      labelCol: { span: 7 },
                      wrapperCol: { span: 17 },
                    })}
                name={'endTime'}
                label={intl.formatMessage({ id: 'app.mapView.label.heatView.endTime' })}
              >
                <DatePicker
                  showTime
                  placeholder={intl.formatMessage({ id: 'app.mapView.require.heatView.endTime' })}
                />
              </Form.Item>

              <Form.Item
                {...(locale === 'zh-CN'
                  ? layout
                  : {
                      labelCol: { span: 9 },
                      wrapperCol: { span: 15 },
                    })}
                name={'isTransparent'}
                initialValue={true}
                valuePropName={'checked'}
                label={intl.formatMessage({ id: 'app.mapView.label.heatView.isTransparent' })}
              >
                <Switch
                  checkedChildren={intl.formatMessage({ id: 'app.mapView.label.heatView.yes' })}
                  unCheckedChildren={intl.formatMessage({ id: 'app.mapView.label.heatView.no' })}
                />
              </Form.Item>

              <Form.Item {...NoLabelLayout}>
                <Row type="flex" gutter={10}>
                  <Col>
                    <Button type="primary" onClick={this.handleRequestHeat}>
                      <FormattedMessage id="app.mapView.label.temporaryBlock.show" />
                    </Button>
                  </Col>
                  <Col>
                    <Button onClick={clearCellHeat}>
                      <FormattedMessage id="app.mapView.action.clear" />
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
      </div>
    );
  }
}
export default CellHeatControlPanel;
