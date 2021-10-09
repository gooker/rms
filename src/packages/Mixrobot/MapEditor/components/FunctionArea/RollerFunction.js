import React from 'react';
import { connect } from '@/utils/dva';
import { Button, Col, Tooltip, InputNumber, Radio, Input, Divider, Form, Row, Table } from 'antd';
import MenuIcon from '@/utils/MenuIcon';
import { isNull, formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import ButtonInput from '@/packages/Mixrobot/components/ButtonInput/ButtonInput';
import AngleSelector from '@/packages/Mixrobot/components/AngleSelector';
import MapEditContext from '@/packages/Mixrobot/MapEditor/MapEditContext';

const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

class RollerFunction extends React.Component {
  static contextType = MapEditContext;

  formRef = React.createRef();

  state = {
    showForm: false,
    flag: 0,
    choice: '',
  };

  rollerStationColumn = [
    {
      // 站点编码
      title: formatMessage({ id: 'app.roller.binCode' }),
      align: 'center',
      dataIndex: 'binCode',
      render: (text) => {
        if (isNull(text)) {
          return null;
        }
        if (text.length >= 5) {
          return (
            <Tooltip title={text}>
              <span>{`${text.slice(0, 6)}***`}</span>
            </Tooltip>
          );
        }
        return text;
      },
    },
    {
      // 站点位置
      title: formatMessage({ id: 'app.roller.binCellId' }),
      align: 'center',
      dataIndex: 'binCellId',
    },
    {
      // 角度
      title: formatMessage({ id: 'app.roller.angle' }),
      align: 'center',
      dataIndex: 'angle',
    },
    {
      // 站点高度
      title: formatMessage({ id: 'app.roller.heightOffset' }),
      align: 'center',
      dataIndex: 'heightOffset',
    },
    {
      // 站点深度
      title: formatMessage({ id: 'app.roller.toteAGVDepth' }),
      align: 'center',
      dataIndex: 'toteAGVDepth',
    },
    {
      // 行号
      title: formatMessage({ id: 'app.roller.row' }),
      align: 'center',
      dataIndex: 'row',
    },
    {
      // 站点类型
      title: formatMessage({ id: 'app.roller.binCellIdType' }),
      align: 'center',
      dataIndex: 'binCellIdType',
    },
    {
      // 站点方向
      title: formatMessage({ id: 'app.roller.binDirection' }),
      align: 'center',
      dataIndex: 'binDirection',
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
                this.edit(index + 1, record);
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
    const currentRoller = { ...allValues };

    if (isNull(currentRoller.binCellId) || isNull(currentRoller.binCellIdType)) {
      return;
    }

    dispatch({
      type: 'editor/updateFunction',
      payload: { scope: 'map', type: 'rollerStationList', data: currentRoller },
    }).then((result) => {
      if (result.type === 'add') {
        this.context.renderRollerFunction([result.payload]);
      }
      if (result.type === 'update') {
        const { pre, current } = result;
        this.context.removeRollerFunction(pre);
        this.context.renderRollerFunction([current]);
      }
      this.context.refresh();
    });
  };

  edit = (index, record) => {
    this.setState({
      choice: record,
      showForm: true,
      flag: index,
    });
  };

  remove = (flag) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, type: 'rollerStationList', scope: 'map' },
    }).then((result) => {
      this.context.removeRollerFunction(result);
      this.context.refresh();
    });
  };

  render() {
    const { showForm, choice, flag } = this.state;
    const { rollerStationList = [], selectCellIds } = this.props;
    if (showForm) {
      return (
        <Row style={{ margin: '20px 10px' }}>
          {/* 返回 */}
          <Button
            type="primary"
            icon={MenuIcon.rollback}
            onClick={() => {
              this.setState({ showForm: false });
            }}
          >
            <FormattedMessage id="app.workStationMap.back" />
          </Button>
          <div style={{ width: '100%' }}>
            <Divider orientation="left">
              {choice !== ''
                ? formatMessage({ id: 'app.roller.update' })
                : formatMessage({ id: 'app.roller.add' })}
            </Divider>
          </div>
          <Form ref={this.formRef} onValuesChange={this.onValuesChange} style={{ width: '100%' }}>
            <Form.Item hidden name={'flag'} initialValue={flag} />

            {/* 料箱编码 */}
            <Form.Item
              {...formLayout}
              name={'binCode'}
              initialValue={choice.binCode}
              label={formatMessage({ id: 'app.roller.binCode' })}
            >
              <Input />
            </Form.Item>

            {/* 料箱点位 */}
            <Form.Item
              {...formLayout}
              name={'binCellId'}
              initialValue={choice.binCellId}
              label={formatMessage({ id: 'app.roller.binCellId' })}
            >
              <ButtonInput
                type="number"
                data={selectCellIds[0]}
                btnDisabled={selectCellIds.length !== 1}
              />
            </Form.Item>

            {/* 角度 */}
            <Form.Item
              {...formLayout}
              name={'angle'}
              initialValue={choice.angle}
              label={formatMessage({ id: 'app.roller.angle' })}
            >
              <AngleSelector getAngle />
            </Form.Item>

            {/* 点位类型 */}
            <Form.Item
              {...formLayout}
              name={'binCellIdType'}
              initialValue={choice.binCellIdType}
              label={formatMessage({ id: 'app.roller.binCellIdType' })}
            >
              <Radio.Group
                options={[
                  { label: formatMessage({ id: 'app.roller.in' }), value: 'IN' },
                  { label: formatMessage({ id: 'app.roller.out' }), value: 'OUT' },
                ]}
                optionType="button"
              />
            </Form.Item>

            {/* 方向 */}
            <Form.Item
              {...formLayout}
              name={'binDirection'}
              initialValue={choice.binDirection}
              label={formatMessage({ id: 'app.roller.binDirection' })}
            >
              <Radio.Group
                options={[
                  { label: formatMessage({ id: 'app.roller.left' }), value: 'L' },
                  { label: formatMessage({ id: 'app.roller.right' }), value: 'R' },
                ]}
                optionType="button"
              />
            </Form.Item>

            {/* 行号 */}
            <Form.Item
              {...formLayout}
              name={'row'}
              initialValue={choice.row}
              label={formatMessage({ id: 'app.roller.row' })}
            >
              <InputNumber />
            </Form.Item>

            {/* 高度 */}
            <Form.Item {...formLayout} label={formatMessage({ id: 'app.roller.heightOffset' })}>
              <Row gutter={10}>
                <Col span={10}>
                  <Form.Item noStyle name={'heightOffset'} initialValue={choice.heightOffset}>
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                  mm
                </Col>
              </Row>
            </Form.Item>

            {/* 深度 */}
            <Form.Item {...formLayout} label={formatMessage({ id: 'app.roller.toteAGVDepth' })}>
              <Row gutter={10}>
                <Col span={10}>
                  <Form.Item noStyle name={'toteAGVDepth'} initialValue={choice.toteAGVDepth}>
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                  mm
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Row>
      );
    }
    return (
      <Row style={{ margin: '20px 10px' }}>
        <Row style={{ width: '100%' }}>
          <Col span={12}>
            <h3>
              <FormattedMessage id="app.roller.list" />
            </h3>
          </Col>
          <Col style={{ textAlign: 'end' }} span={12}>
            <Button
              size="small"
              icon={MenuIcon.plus}
              type="primary"
              onClick={() => {
                this.setState({ choice: '', showForm: true, flag: rollerStationList.length + 1 });
              }}
            >
              <FormattedMessage id="app.workStationMap.add" />
            </Button>
          </Col>
        </Row>
        <Table
          bordered
          pagination={false}
          dataSource={rollerStationList}
          columns={this.rollerStationColumn}
          scroll={{ x: 'max-content' }}
        />
      </Row>
    );
  }
}
export default connect(({ editor }) => {
  const { currentMap, selectCells } = editor;
  return { rollerStationList: currentMap?.rollerStationList ?? [], selectCellIds: selectCells };
})(RollerFunction);
