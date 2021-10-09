import React, { Component } from 'react';
import { Input, Table, Row, Form, Divider, Col, Button, Tag } from 'antd';
import { connect } from '@/utils/dva';
import MenuIcon from '@/utils/MenuIcon';
import { formatMessage } from '@/utils/utils';
import { getCurrentRouteMapData } from '@/utils/mapUtils';
import FormattedMessage from '@/components/FormattedMessage';
import ButtonInput from '@/packages/Mixrobot/components/ButtonInput/ButtonInput';
import MapEditContext from '@/packages/Mixrobot/MapEditor/MapEditContext';

const FormLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };
const NoLabelFormLayout = { wrapperCol: { offset: 5, span: 19 } };

class ChannelList extends Component {
  static contextType = MapEditContext;

  formRef = React.createRef();

  state = {
    flag: 0,
    showForm: false,
    tunnel: null,
  };

  channelListColumns = [
    {
      // 名称
      title: formatMessage({ id: 'app.workStationMap.name' }),
      align: 'center',
      dataIndex: 'tunnelName',
    },
    {
      // 点位
      title: formatMessage({ id: 'app.channel.cells' }),
      align: 'center',
      width: 200,
      dataIndex: 'cells',
      render: (text) => {
        if (text) {
          return text.map((item, index) => <Tag key={index}>{item}</Tag>);
        }
      },
    },
    {
      // 解锁点位
      title: formatMessage({ id: 'app.channel.unLockCells' }),
      align: 'center',
      dataIndex: 'tunnelInUnLockCell',
      render: (text) => {
        if (text) {
          return text.map((item, index) => <Tag key={index}>{item}</Tag>);
        }
      },
    },
    {
      // 入口
      title: formatMessage({ id: 'app.channel.entrance' }),
      align: 'center',
      dataIndex: 'in',
      render: (text) => {
        if (text) {
          return text.map((item, index) => <Tag key={index}>{item}</Tag>);
        }
      },
    },
    {
      // 出口
      title: formatMessage({ id: 'app.channel.exit' }),
      align: 'center',
      dataIndex: 'out',
      render: (text) => {
        if (text) {
          return text.map((item, index) => <Tag key={index}>{item}</Tag>);
        }
      },
    },
    {
      // 操作
      title: formatMessage({ id: 'app.workStationMap.operation' }),
      align: 'center',
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <div>
            <span
              key="edit"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.setState({
                  tunnel: record,
                  showForm: true,
                  flag: index + 1,
                });
              }}
            >
              {MenuIcon.edit}
            </span>
            <Divider type="vertical" />
            <span
              key="delete"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.remove(index + 1);
              }}
            >
              {MenuIcon.delete}
            </span>
          </div>
        );
      },
    },
  ];

  onValuesChange = (changedValues, allValues) => {
    const { dispatch } = this.props;
    const currentTunnel = { ...allValues };
    if (!currentTunnel.tunnelName || currentTunnel?.cells?.length === 0) return;

    dispatch({
      type: 'editor/updateFunction',
      payload: { scope: 'route', type: 'tunnels', data: currentTunnel },
    }).then((result) => {
      if (result.type === 'add') {
        this.context.renderTunnel([result.payload], false, 'add');
      }
      if (result.type === 'update') {
        const { pre, current } = result;
        this.context.renderTunnel([pre], false, 'remove');
        this.context.renderTunnel([current], false, 'add');
      }
      this.context.refresh();
    });
  };

  remove = (flag) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, type: 'tunnels', scope: 'route' },
    }).then((result) => {
      this.context.renderTunnel([result], false, 'remove');
      this.context.refresh();
    });
  };

  customNameDuplicateValidator = () => {
    const { tunnels } = this.props;
    const existsTunnelNames = tunnels.map(({ tunnelName }) => tunnelName);
    return {
      validator(_, value) {
        if (!existsTunnelNames.includes(value)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(formatMessage({ id: 'app.channel.name.duplicate' })));
      },
    };
  };

  render() {
    const { tunnels, selectCellIds, selectLinses } = this.props;
    const { showForm, flag, tunnel } = this.state;

    if (showForm) {
      return (
        <Row style={{ margin: '20px 10px' }}>
          <div style={{ width: '100%' }}>
            <Divider orientation="left">
              {tunnel !== ''
                ? formatMessage({ id: 'app.channel.update' })
                : formatMessage({ id: 'app.channel.add' })}
            </Divider>
          </div>
          <Form ref={this.formRef} onValuesChange={this.onValuesChange} style={{ width: '100%' }}>
            <Form.Item hidden name={'flag'} initialValue={flag} />

            {/* 名称 */}
            <Form.Item
              {...FormLayout}
              name={'tunnelName'}
              initialValue={tunnel?.tunnelName}
              label={<FormattedMessage id="app.workStationMap.name" />}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'app.channel.name.required' }),
                },
                {
                  pattern: /^[0-9a-zA-Z_]{1,}$/,
                  message: formatMessage({ id: 'app.channel.name.validate' }),
                },
                this.customNameDuplicateValidator(),
              ]}
            >
              <Input maxLength={4} />
            </Form.Item>

            {/* 点位 */}
            <Form.Item
              {...FormLayout}
              name={'cells'}
              initialValue={tunnel?.cells || []}
              label={<FormattedMessage id="app.channel.cells" />}
            >
              <ButtonInput
                multi={true}
                data={selectCellIds}
                btnDisabled={selectCellIds.length === 0}
              />
            </Form.Item>

            {/* 解锁点 */}
            <Form.Item
              {...FormLayout}
              name={'tunnelInUnLockCell'}
              initialValue={tunnel?.tunnelInUnLockCell || []}
              label={<FormattedMessage id="app.channel.unLockCells" />}
            >
              <ButtonInput
                multi={true}
                data={selectCellIds}
                btnDisabled={selectCellIds.length === 0}
              />
            </Form.Item>

            {/* 入口 */}
            <Form.Item
              {...FormLayout}
              name={'in'}
              initialValue={tunnel?.in || []}
              label={<FormattedMessage id="app.channel.entrance" />}
            >
              <ButtonInput
                multi={true}
                data={selectLinses}
                btnDisabled={selectLinses.length === 0}
              />
            </Form.Item>

            {/* 出口 */}
            <Form.Item
              {...FormLayout}
              name={'out'}
              initialValue={tunnel?.out || []}
              label={<FormattedMessage id="app.channel.exit" />}
            >
              <ButtonInput
                multi={true}
                data={selectLinses}
                btnDisabled={selectLinses.length === 0}
              />
            </Form.Item>

            {/* 返回 */}
            <Form.Item {...NoLabelFormLayout}>
              <Col span={12}>
                <Button
                  type="primary"
                  icon={MenuIcon.rollback}
                  onClick={() => {
                    this.setState({ showForm: false });
                  }}
                >
                  <FormattedMessage id="app.workStationMap.back" />
                </Button>
              </Col>
            </Form.Item>
          </Form>
        </Row>
      );
    }
    return (
      <Row style={{ margin: '10px 0px' }}>
        <Row style={{ width: '100%' }}>
          <Col span={12}>
            <h3>
              <FormattedMessage id="app.channel.list" />
            </h3>
          </Col>
          <Col style={{ textAlign: 'end' }} span={12}>
            <Button
              size="small"
              type="primary"
              icon={MenuIcon.plus}
              onClick={() => {
                this.setState({ tunnel: null, showForm: true, flag: tunnels.length + 1 });
              }}
            >
              <FormattedMessage id="app.workStationMap.add" />
            </Button>
          </Col>
        </Row>
        <Table
          bordered
          pagination={false}
          dataSource={tunnels}
          columns={this.channelListColumns}
          scroll={{ x: 'max-content' }}
        />
      </Row>
    );
  }
}
export default connect(({ editor }) => {
  const { selectCells, selectLines } = editor;
  const currentScopeMapData = getCurrentRouteMapData();
  const tunnels = currentScopeMapData?.tunnels ?? [];
  return { selectCellIds: selectCells, selectLinses: selectLines, tunnels };
})(ChannelList);
