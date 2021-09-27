import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Row, Divider, List, Button, Descriptions, Col } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import MenuIcon from '@/utils/MenuIcon';
import AddElevator from './AddElevator';
import MapContext from '../MapContext';

class ElevatorList extends Component {
  static contextType = MapContext;

  state = {
    formValue: {},

    flag: 0,
    showForm: false,
    elevator: null,
  };

  deleteElevator = (flag) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, type: 'elevatorList', scope: 'map' },
    }).then((result) => {
      this.context.removeElevator(result);
      this.context.refresh();
    });
  };

  render() {
    const { elevatorList } = this.props;
    const { flag, showForm } = this.state;

    // 电梯新增 & 更新表单
    if (showForm) {
      return (
        <Row style={{ margin: '10px 0px' }}>
          <AddElevator
            flag={flag}
            cancel={() => {
              this.setState({ showForm: false, elevator: '', flag: -1 });
            }}
          />
        </Row>
      );
    }

    // 电梯列表
    return (
      <div style={{ margin: '10px 0px' }}>
        <Row style={{ width: '100%' }}>
          <Col span={12}>
            <h3>
              <FormattedMessage id="app.elevatorList.elevatorList" />
            </h3>
          </Col>
          <Col style={{ textAlign: 'end' }} span={12}>
            <Button
              icon={MenuIcon.plus}
              type="primary"
              size="small"
              onClick={() => {
                this.setState({ elevator: '', showForm: true, flag: elevatorList.length + 1 });
              }}
            >
              <FormattedMessage id="app.workStationMap.add" />
            </Button>
          </Col>
        </Row>
        <List
          itemLayout="horizontal"
          dataSource={elevatorList}
          renderItem={(Item, index) => (
            <List.Item
              actions={[
                <span
                  key="edit"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.setState({
                      elevator: Item,
                      showForm: true,
                      flag: index + 1,
                    });
                  }}
                >
                  {MenuIcon.edit}
                </span>,
                <span
                  key="delete"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.deleteElevator(index + 1);
                  }}
                >
                  {MenuIcon.delete}
                </span>,
              ]}
            >
              <Row>
                <div style={{ width: '100%' }}>
                  <Divider orientation="left">
                    <FormattedMessage
                      id="app.elevatorList.elevatorNo"
                      values={{ index: index + 1 }}
                    />
                  </Divider>
                </div>
                <Descriptions>
                  <Descriptions.Item
                    label={formatMessage({ id: 'app.elevatorList.elevatorPoint' })}
                  >
                    {Item.innerCellId}
                  </Descriptions.Item>
                </Descriptions>
              </Row>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
export default connect(({ editor }) => {
  const { currentMap } = editor;
  const { elevatorList } = currentMap;
  return { elevatorList };
})(ElevatorList);
